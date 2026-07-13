// gge_infodecomp_robust.js — ROBUST redo of read 1, prompted by a red flag:
// the raw-feature ridge returned ΔR² = −1.19 for C_slow, which is impossible for
// a merely-uninformative feature (adding one column cannot honestly drop LOO-CV
// R² from 0.18 to −1.0). Diagnosis: the capacity charges are wildly heavy-tailed
// (C ranges 0→139, C_slow 0→162 — max ≈ 130–180× the median), so standardising
// them leaves extreme high-leverage points; the closed-form LOO residual
// (y−ŷ)/(1−H_ii) blows up when H_ii→1 on those points → spurious huge-negative
// ΔR². The partial Spearman (rank-based) was immune and DID show a monotone hint
// (C +0.26, C_slow +0.21, rSpread +0.25) — so the linear-CV metric, not the
// physics, was the problem, and my "both conditions" rule let the broken ridge
// veto the real rank signal.
//
// FIX: do the whole decomposition in RANK (normal-score) space — monotone,
// bounded, immune to the fat tails, and exactly the space the Spearman hint
// lives in. Reuses the PERSISTED feature rows (tests/results/gge_infodecomp.json),
// so no engine re-run. Reports raw vs rank side by side, with a permutation null,
// and re-grades against the same certificate.
//
//   node tests/gge_infodecomp_robust.js
const fs = require('fs'), path = require('path');
const J = require('./results/gge_infodecomp.json');
const rows = J.rows;
const N = rows.length;
let SEED = +(process.env.SEED || 7); function rng() { SEED = (SEED * 1103515245 + 12345) & 0x7fffffff; return SEED / 0x7fffffff; }

// ── rank → van der Waerden normal scores (bounded, monotone, tail-robust) ──
function normalScores(v) {
  const idx = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(v.length);
  // average ranks for ties
  let i = 0;
  while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; const rank = (i + j) / 2; for (let k = i; k <= j; k++) r[idx[k][1]] = rank; i = j + 1; }
  // Φ⁻¹((rank+1)/(n+1))
  return r.map(rk => probit((rk + 1) / (v.length + 1)));
}
function probit(p) { // Acklam's inverse normal CDF
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const pl = 0.02425;
  let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

// pre-transform every column to normal scores once
const COLS = {};
for (const k of ['avgQ', 'S', 'C', 'Cslow', 'Sbasin', 'domMass', 'rSpread', 'evenMod', 'Y'])
  COLS[k] = normalScores(rows.map(r => r[k]));
const yv = COLS['Y'];

// ── ridge LOO-CV R² (closed form) on the normal-score columns ──
function inv(A) { const k = A.length; const M = A.map((r, i) => r.concat(Array.from({ length: k }, (_, c) => c === i ? 1 : 0)));
  for (let c = 0; c < k; c++) { let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;[M[c], M[p]] = [M[p], M[c]]; const pv = M[c][c] || 1e-12; for (let j = 0; j < 2 * k; j++) M[c][j] /= pv; for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c]; for (let j = 0; j < 2 * k; j++) M[r][j] -= f * M[c][j]; } }
  return M.map(r => r.slice(k)); }
const LAM = 1.0;
function looR2(featKeys, y) {
  const n = y.length, k = featKeys.length;
  const yb = y.reduce((a, b) => a + b, 0) / n, yc = y.map(v => v - yb);
  const X = featKeys.map(f => COLS[f]);
  const A = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let a = 0; a < k; a++) for (let c = a; c < k; c++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * X[c][i]; A[a][c] = A[c][a] = s + (a === c ? LAM : 0); }
  const Ai = inv(A);
  const Xty = new Array(k).fill(0); for (let a = 0; a < k; a++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * yc[i]; Xty[a] = s; }
  const beta = Ai.map(r => r.reduce((s, v, j) => s + v * Xty[j], 0));
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) { let yh = 0; for (let a = 0; a < k; a++) yh += beta[a] * X[a][i];
    let hii = 0; for (let a = 0; a < k; a++) { let t = 0; for (let c = 0; c < k; c++) t += Ai[a][c] * X[c][i]; hii += X[a][i] * t; }
    const loo = (yc[i] - yh) / Math.max(1e-6, 1 - hii); ssRes += loo * loo; ssTot += yc[i] * yc[i]; }
  return 1 - ssRes / ssTot;
}
const base = looR2(['avgQ', 'S'], yv);
const NPERM = 2000;
function permP(feats, obs) { let ge = 0; for (let p = 0; p < NPERM; p++) { const yp = yv.slice(); for (let i = yp.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0;[yp[i], yp[j]] = [yp[j], yp[i]]; } COLS['Y'] = yp; const d = looR2(['avgQ', 'S', ...feats], yp) - looR2(['avgQ', 'S'], yp); if (d >= obs) ge++; } COLS['Y'] = yv; return ge / NPERM; }

const CANDS = [['C (capacity)', 'C'], ['C_slow', 'Cslow'], ['Sbasin', 'Sbasin'], ['domMass', 'domMass'], ['rSpread', 'rSpread'], ['evenMod', 'evenMod']];
console.log(`ROBUST read 1 — rank/normal-score space (n=${N}, offline from persisted rows)\n`);
console.log(`base LOO-R² {⟨Q⟩,S} (rank) = ${base.toFixed(4)}\n`);
console.log('  charge          ΔR²(rank)   perm p     partial-ρ');
const res = [];
for (const [lbl, k] of CANDS) {
  const dR2 = looR2(['avgQ', 'S', k], yv) - base;
  const p = permP([k], dR2);
  // partial Spearman = partial correlation of normal scores on {avgQ,S}
  const pr = partialCorr(k);
  res.push({ lbl, k, dR2, p, pr });
  console.log('  ' + lbl.padEnd(14) + (dR2 >= 0 ? '+' : '') + dR2.toFixed(4) + '     ' + p.toFixed(3) + '      ' + (pr >= 0 ? '+' : '') + pr.toFixed(3));
}
function partialCorr(k) { // partial corr(Y, k | avgQ,S) in normal-score space
  const resid = (t) => { const y = COLS[t], c1 = COLS['avgQ'], c2 = COLS['S'], n = y.length;
    // OLS y ~ 1 + c1 + c2
    const X = []; for (let i = 0; i < n; i++) X.push([1, c1[i], c2[i]]);
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], b = [0, 0, 0];
    for (let i = 0; i < n; i++) for (let a = 0; a < 3; a++) { for (let c = 0; c < 3; c++) A[a][c] += X[i][a] * X[i][c]; b[a] += X[i][a] * y[i]; }
    const bet = inv(A).map(r => r.reduce((s, v, j) => s + v * b[j], 0));
    return y.map((yi, i) => yi - (bet[0] + bet[1] * c1[i] + bet[2] * c2[i])); };
  const ry = resid('Y'), rk = resid(k), n = ry.length;
  let num = 0, da = 0, db = 0; for (let i = 0; i < n; i++) { num += ry[i] * rk[i]; da += ry[i] * ry[i]; db += rk[i] * rk[i]; }
  return num / Math.sqrt(da * db || 1);
}

// joint + interactions in rank space
const JOINT = ['C', 'domMass', 'rSpread', 'evenMod'];
const inter = [];
for (let a = 0; a < JOINT.length; a++) for (let b = a + 1; b < JOINT.length; b++) { const nk = 'i_' + JOINT[a] + '_' + JOINT[b]; COLS[nk] = normalScores(rows.map((_, i) => COLS[JOINT[a]][i] * COLS[JOINT[b]][i])); inter.push(nk); }
const dJoint = looR2(['avgQ', 'S', ...JOINT], yv) - base, pJoint = permP(JOINT, dJoint);
const dInter = looR2(['avgQ', 'S', ...JOINT, ...inter], yv) - base, pInter = permP([...JOINT, ...inter], dInter);
console.log('\n  JOINT full cohort (4)      ΔR²(rank) = ' + (dJoint >= 0 ? '+' : '') + dJoint.toFixed(4) + '   perm p ' + pJoint.toFixed(3));
console.log('  + 6 interactions           ΔR²(rank) = ' + (dInter >= 0 ? '+' : '') + dInter.toFixed(4) + '   perm p ' + pInter.toFixed(3));

// ── influence check: is the joint signal driven by one position? drop-one jackknife ──
// recompute the joint ΔR² with each single row removed (rank-transform recomputed
// on the reduced sample), report the spread. A signal that vanishes when one point
// is dropped is an outlier, not a cohort.
{
  const jk = [];
  for (let drop = 0; drop < N; drop++) {
    const sub = rows.filter((_, i) => i !== drop);
    const C2 = {}; for (const key of ['avgQ', 'S', 'C', 'domMass', 'rSpread', 'evenMod', 'Y']) C2[key] = normalScores(sub.map(r => r[key]));
    // local closed-form ridge LOO on the reduced normal-score columns
    const looR2sub = (feats) => {
      const y = C2['Y'], n = y.length, k = feats.length, yb = y.reduce((a, b) => a + b, 0) / n, yc = y.map(v => v - yb);
      const X = feats.map(f => C2[f]); const A = Array.from({ length: k }, () => new Array(k).fill(0));
      for (let a = 0; a < k; a++) for (let c = a; c < k; c++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * X[c][i]; A[a][c] = A[c][a] = s + (a === c ? LAM : 0); }
      const Ai = inv(A); const Xty = new Array(k).fill(0); for (let a = 0; a < k; a++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * yc[i]; Xty[a] = s; }
      const beta = Ai.map(r => r.reduce((s, v, j) => s + v * Xty[j], 0)); let sr = 0, st = 0;
      for (let i = 0; i < n; i++) { let yh = 0; for (let a = 0; a < k; a++) yh += beta[a] * X[a][i]; let hii = 0; for (let a = 0; a < k; a++) { let t = 0; for (let c = 0; c < k; c++) t += Ai[a][c] * X[c][i]; hii += X[a][i] * t; } const l = (yc[i] - yh) / Math.max(1e-6, 1 - hii); sr += l * l; st += yc[i] * yc[i]; } return 1 - sr / st;
    };
    jk.push(looR2sub(['avgQ', 'S', 'C', 'domMass', 'rSpread', 'evenMod']) - looR2sub(['avgQ', 'S']));
  }
  jk.sort((a, b) => a - b);
  console.log('  drop-one jackknife of the joint ΔR²: min ' + jk[0].toFixed(4) + '  median ' + jk[N >> 1].toFixed(4) + '  max ' + jk[N - 1].toFixed(4) +
    '  (>0 in ' + jk.filter(v => v > 0).length + '/' + N + ')');
}

// ── re-grade ──
const passers = res.filter(r => r.p < 0.10 && Math.abs(r.pr) >= 0.15);
console.log('\n════ ROBUST VERDICT ════');
if (passers.length) {
  console.log('  SIGNAL RECOVERED under a tail-robust metric — the raw-ridge KILL was partly a heavy-tail artifact:');
  for (const r of passers) console.log(`    ${r.lbl}: ΔR²(rank) ${r.dR2.toFixed(4)} (p ${r.p.toFixed(3)}), partial-ρ ${r.pr.toFixed(3)}`);
  console.log('  These are seat CANDIDATES on the robust certificate (still require read 2 for the T-seat and, ultimately, the gauntlet).');
} else {
  console.log('  STILL NULL under the robust metric: even in rank space no charge clears (p<0.10 AND |ρ|≥0.15).');
  console.log('  The heavy tails inflated the NEGATIVES but did not hide a positive — the KILL survives robustification.');
}
console.log('\n  (raw-ridge for comparison: every ΔR²<0, C_slow −1.19 — the artifact this script corrects.)');
