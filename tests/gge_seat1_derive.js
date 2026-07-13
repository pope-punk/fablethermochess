// gge_seat1_derive.js — LEG 1: derive the seat-1 multiplier from measurement,
// not tuning. Offline, from the persisted read-1 rows (results/gge_infodecomp.json).
//
// ── THE DERIVATION ────────────────────────────────────────────────────
// Seat 1 is the r=2 reshaping π_a ∝ exp(z_a − b₂ z_a²), z_a=(Q_a−maxQ)/T. To
// leading order its effect on the backed-up value is
//     ΔΦ = dΦ/db₂ · b₂ = −T·⟨z²⟩_π · b₂ = −b₂ · M₂/T ,   M₂ = Σπ(Q−maxQ)² ≈ Var.
// The GGE self-consistency fixes b₂ by a SECOND-SCALE measurement: read 1 found
// that the off-horizon verdict revision Y = e(deep)−e(shallow) depends on the
// ensemble variance. Write that measured law as Y_Q ≈ β·Var (Q-units, controlling
// ⟨Q⟩,S). Requiring the reshaping to move the value by exactly the measured
// off-horizon revision, ΔΦ = β·Var, gives
//     b₂ = −β·T      (per node — β is the one measured constant, T is local).
// So the derived seat-1 rule is b₂(node) = −β̂·T(node), β̂ measured here. Nothing
// tuned: β̂ is a measurement (like J, κ, bite); T is measured.
//
// This script measures β̂ ROBUSTLY (the raw slope is wrecked by Var's heavy tail —
// the same artifact that broke the first read) and — decisively — its SIGN, and
// checks the sign is stable across the two strata (catastrophes vs quiet
// controls). Gauntletting the wrong sign is the mean/max-backup grave, so the
// sign must be nailed before leg 3.
//
//   node tests/gge_seat1_derive.js
const J = require('./results/gge_infodecomp.json');
const rows = J.rows.filter(r => r.rSpread > 1e-6);   // need T = √Var/rSpread
for (const r of rows) { r.T = Math.sqrt(r.C) / r.rSpread; r.YQ = 2 * r.Y; }   // Y stored in pawns → Q-units
const N = rows.length;
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;

// ── partial-out ⟨Q⟩ and S (OLS residuals) so we measure the variance's OWN law ──
function resid(target, ctrl) {
  const y = rows.map(r => r[target]); const n = y.length, k = ctrl.length;
  const X = rows.map(r => [1, ...ctrl.map(c => r[c])]);
  const A = Array.from({ length: k + 1 }, () => new Array(k + 1).fill(0)), b = new Array(k + 1).fill(0);
  for (let i = 0; i < n; i++) for (let a = 0; a <= k; a++) { for (let c = 0; c <= k; c++) A[a][c] += X[i][a] * X[i][c]; b[a] += X[i][a] * y[i]; }
  // gaussian solve
  const M = A.map((r, i) => r.concat(b[i]));
  for (let c = 0; c <= k; c++) { let p = c; for (let r = c + 1; r <= k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;[M[c], M[p]] = [M[p], M[c]]; for (let r = 0; r <= k; r++) if (r !== c) { const f = M[r][c] / (M[c][c] || 1e-12); for (let j = c; j <= k + 1; j++) M[r][j] -= f * M[c][j]; } }
  const beta = M.map((r, i) => r[k + 1] / (r[i] || 1e-12));
  return rows.map((r, i) => y[i] - X[i].reduce((s, xv, a) => s + xv * beta[a], 0));
}
// Theil–Sen slope of yr on xr (median of pairwise slopes — robust to the Var tail)
function theilSen(xr, yr) {
  const s = []; for (let i = 0; i < xr.length; i++) for (let j = i + 1; j < xr.length; j++) { const dx = xr[j] - xr[i]; if (Math.abs(dx) > 1e-9) s.push((yr[j] - yr[i]) / dx); }
  return med(s);
}
// Spearman of xr, yr
function spearman(xr, yr) {
  const rk = a => { const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = new Array(a.length); idx.forEach(([, i], k) => r[i] = k); return r; };
  const rx = rk(xr), ry = rk(yr), n = xr.length, mx = (n - 1) / 2;
  let num = 0, dx = 0, dy = 0; for (let i = 0; i < n; i++) { num += (rx[i] - mx) * (ry[i] - mx); dx += (rx[i] - mx) ** 2; dy += (ry[i] - mx) ** 2; }
  return num / Math.sqrt(dx * dy);
}

const ryQ = resid('YQ', ['avgQ', 'S']);
const rVar = resid('C', ['avgQ', 'S']);
const rho = spearman(rVar, ryQ);                 // robust SIGN (rank; tail-immune)
const betaTS = theilSen(rVar, ryQ);              // robust slope Q-units(Y) per Q²(Var)
const Tmed = med(rows.map(r => r.T));
const b2derived = -betaTS * Tmed;

console.log('LEG 1 — deriving seat-1 b₂ from the measured C→verdict law  (n=' + N + ', offline)\n');
console.log('  partial Spearman ρ(Var, Y_Q | ⟨Q⟩,S) = ' + (rho >= 0 ? '+' : '') + rho.toFixed(3) + '   ← the SIGN (rank-robust)');
console.log('  Theil–Sen slope  β̂ = dY_Q/dVar       = ' + betaTS.toExponential(2) + '  Q-units per Var-unit');
console.log('  median bath T (recovered √Var/rSpread) = ' + Tmed.toFixed(3));
console.log('  ⇒ derived  b₂ = −β̂·T  ≈ ' + b2derived.toFixed(4) + '   (engine applies b₂(node) = −β̂·T_node)\n');
console.log('  SIGN MEANING: ρ>0 ⇒ higher shallow variance ⇒ verdict IMPROVES off-horizon ⇒ F UNDER-values');
console.log('  spread ⇒ b₂<0 (reward spread).  ρ<0 ⇒ F OVER-values spread ⇒ b₂>0 (penalise, deflation-like).');

// ── stratum stability (must not flip between catastrophes and controls) ──
function stratum(tag) {
  const idx = rows.map((r, i) => [r, i]).filter(([r]) => tag === 'all' || r.tag === tag).map(([, i]) => i);
  const xs = idx.map(i => rVar[i]), ys = idx.map(i => ryQ[i]);
  return { n: idx.length, rho: spearman(xs, ys), ts: theilSen(xs, ys) };
}
console.log('\n  stratum          n     ρ(Var,Y)     Theil–Sen β̂');
for (const t of ['all', 'exp', 'rand']) { const s = stratum(t); console.log('   ' + (t === 'exp' ? 'catastrophes' : t === 'rand' ? 'quiet controls' : 'ALL').padEnd(15) + String(s.n).padStart(3) + '   ' + (s.rho >= 0 ? '+' : '') + s.rho.toFixed(3) + '        ' + s.ts.toExponential(2)); }

const eS = stratum('exp'), rS = stratum('rand');
const stable = Math.sign(eS.rho) === Math.sign(rS.rho) && Math.abs(eS.rho) > 0.1 && Math.abs(rS.rho) > 0.1;
console.log('\n════ LEG 1 VERDICT ════');
if (stable) {
  console.log('  SIGN STABLE across strata (' + (rho > 0 ? 'both +' : 'both −') + ') — the derived b₂ = ' + b2derived.toFixed(4) +
    ' is well-posed. Carry b₂(node) = −(' + betaTS.toExponential(2) + ')·T to leg 3.');
} else {
  console.log('  SIGN NOT STABLE across strata (catastrophes ' + eS.rho.toFixed(2) + ' vs controls ' + rS.rho.toFixed(2) +
    ') — the variance→verdict law is stratum-dependent, so a single-signed b₂ is not cleanly derivable. Report this; ' +
    'gauntlet the pooled sign with the caveat, or reconsider the charge.');
}
console.log('\n  (β̂ is the ONE measured constant; T is measured per node. No tuning.)');

require('fs').writeFileSync(require('path').join(__dirname, 'results', 'gge_seat1_derive.json'),
  JSON.stringify({ N, rho, betaTS, Tmed, b2derived, strata: { all: stratum('all'), exp: eS, rand: rS }, stable }, null, 1));
