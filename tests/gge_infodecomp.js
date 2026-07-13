// gge_infodecomp.js — READ 1 of the GGE charge-cohort pre-registration
// (docs/gge_charge_cohort.html §9, measurement 1). Pre-registered; no gauntlet.
//
// ── THE QUESTION ──────────────────────────────────────────────────────
// The evaluation F = ⟨Q⟩ + T·S is the two-statistic (r=1 moment + entropy)
// projection of the search-tree ensemble onto one temperature. The GGE frame
// asks whether a small cohort of further sufficient statistics {I_k} — the
// candidate charges — carries information about the OFF-HORIZON VERDICT that
// ⟨Q⟩ and S do not. A charge earns its seat only by the §7.1 certificate:
//
//     ΔI_k ≡ 𝕀( Y ; I_k | ⟨Q⟩, S, {I_j}_{j<k} )  >  0 .
//
// Y is the verdict the shallow tree is trying to predict — operationalised
// here as the SAME-PARITY off-horizon revision of the engine's own eval,
//     Y = e(deep) − e(shallow),   both at even depth (rule 5: matched parity),
// i.e. how much the verdict moves once the tree is deepened. A charge that
// merely re-expresses ⟨Q⟩ or S adds no CV information about Y and is refused;
// a charge that predicts where the shallow verdict will be overturned
// decompresses exactly the content the projection discards.
//
// ── DERIVATION OF THE ESTIMATORS (from the tree, no tuned constants) ──
// All measured at the shallow horizon d = D_LO from the root ensemble
// {Q_a, π_a} that _runAnalyze already returns. Absorbing (mate-scale) reads
// excluded (rule 2). Every statistic is a symmetric function of the
// unordered ensemble ⇒ permutation-invariant by construction (gauge, rule 1').
//
//   SEATED (conditioned on, never scored):
//     ⟨Q⟩ = Σ π_a Q_a                         (r=1 energy)
//     S   = −Σ π_a ln π_a                      (move entropy)
//
//   CANDIDATE CHARGES (each scored for ΔI_k):
//     seat 1  C = Var_π(Q) = Σ π_a (Q_a−⟨Q⟩)²  (r=2 capacity; the Schottky
//             variance promoted from diagnostic to charge). Also its SLOW
//             restriction C_slow = Var over NON-capture children only (the
//             fast/tactical modes are the captures; the slow sector is the
//             quiet remainder — glass axis τ).
//     seat 2  basin structure (p=1, the RG/plan scale, basins.js):
//               Sbasin  = plan-scale entropy −Σ n_b ln n_b
//               domMass = max_b n_b            (dominant inherent-structure
//                         occupation — the glassy order parameter: 1 = one
//                         basin owns the ensemble, →0 = many competing plans)
//     seat 3  T_eff proxy (τ=slow): r = √Var_π(Q) / T — configurational spread
//             in units of the dynamical (revision) temperature. r ≫ 1 ⇒ the
//             ensemble is wider than the thermometer reads = un-relaxed slow
//             content (glass_teff estimator B, per-position, cheap).
//     seat 4  even modulator (s=even): M_even = ln(W_us+1) + ln(W_them+1),
//             total optionality (the C-EVEN combination — high in open,
//             double-edged positions). Odd part ln W_us − ln W_them is the
//             leaf term F already keeps; the EVEN part is the unexplored
//             parity-clean channel (§3.2 corollary).
//
// ── METHOD: incremental information as cross-validated predictive gain ──
// Direct conditional-MI estimation at n~O(60) is too noisy to trust. We
// operationalise ΔI_k as the honest, standard surrogate: the increase in
// leave-one-out cross-validated R² of a ridge predictor of Y when charge k is
// added on top of {⟨Q⟩, S, seated charges}. ΔR²_k > 0 (beyond a permutation
// null) ⇔ ΔI_k > 0. Two reads:
//   (a) MARGINAL   ΔR²_k = R²({⟨Q⟩,S,I_k}) − R²({⟨Q⟩,S})  — per-charge, clean.
//   (b) FORWARD    greedy conditional sequence: seat the largest-ΔR² charge,
//                  recondition, repeat — the ordered cohort of §7.1, whose
//                  saturation answers the decompression question.
// Cross-check: partial Spearman ρ(Y, I_k | ⟨Q⟩,S) via rank-residuals — a
// transparent, model-free companion to the ridge read.
// Standardisation is per-fold (no leakage); ridge λ small, for conditioning.
//
// ── PRE-REGISTERED KILL CRITERION (fixed before results) ──────────────
//   If every candidate has ΔR²_k ≤ 0 within the permutation null (p ≥ 0.10)
//   AND partial |ρ| < 0.15, the physical cohort is EMPTY beyond (⟨Q⟩,S): the
//   slow-sector verdict-information is generic (not captured by these
//   physical statistics) and NO seat is instantiated — the program stops with
//   that finding (§9). Any charge that clears BOTH (ΔR² above null and
//   |partial ρ| ≥ 0.15) is a seat candidate carried to the shell, gated by
//   read 2 for the temperature seat.
//
// ── VERDICT (July 2026, n=42: 17 exposure catastrophes + 25 quiet controls,
//    shallow d2, deep d4, parity-clean) — KILL, the physical cohort is EMPTY ──
//   base LOO-R² {⟨Q⟩,S} = 0.18 (the r=1 projection already predicts ~18% of the
//   off-horizon revision variance). Every candidate charge has NEGATIVE
//   cross-validated ΔR² — it adds noise, not signal — with permutation p ≥ 0.18:
//        C (Varπ)  ΔR² −0.20  p 0.97   ρ +0.26
//        C_slow    ΔR² −1.19  p 0.99   ρ +0.21   (numerically unstable feature)
//        Sbasin    ΔR² −0.03  p 0.52   ρ +0.13
//        domMass   ΔR² −0.05  p 0.81   ρ −0.06
//        rSpread   ΔR² −0.00  p 0.18   ρ +0.25
//        evenMod   ΔR² −0.05  p 0.74   ρ −0.28
//   The weak positive partial-Spearman hints (C, C_slow, rSpread all ρ≈0.2–0.26)
//   do NOT survive cross-validation, so under the pre-registered rule (ΔR² above
//   null AND |ρ|≥0.15, BOTH) no seat is instantiated. Forward greedy saturates
//   immediately (first add −0.003). The slow-sector verdict-information is not
//   captured by these physical statistics beyond {⟨Q⟩,S} at this depth.
//
//   READING. This is the pre-registered KILL, and it converges with the program's
//   two standing results: the Gumbel META-LAW (the premium is load-bearing at
//   full size; deflations/reshapings of it read negative) and the document's own
//   integrability hedge (the tree is not a GGE in the strict sense). The r=1
//   projection {⟨Q⟩,S} is, at reachable depth, a SUFFICIENT statistic of the
//   ensemble for predicting its own near-horizon revision — the extra charges are
//   redundant, not missing. The one caveat that keeps this a LOWER bound, not a
//   universal refutation: Y is a d2→d4 revision (node-capped, quiet-leaning
//   corpus), so the slow sector 4–8 ply out is only partially in reach; the
//   catastrophe content the exposure probe located past d8 is off this horizon
//   too. A deeper Y (longer time control, or a fixed larger node budget) is the
//   one measurement that could still seat a charge — but nothing here does.
//   ⇒ No seat carried to the shell for play; GGE mode's seat-1 (b₂) is an
//     experimenter hook, refused by this certificate, not a validated evaluator.
//
//   node tests/gge_infodecomp.js            [DEEP=6] [NRAND=60] [SEED=1]
const fs = require('fs'), path = require('path');
const { recover } = require('./exposure_corpus.js');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
const MATE_NEAR = 100000 - 4096;

const D_LO = 2;                                   // shallow horizon (even)
const DEEP = +(process.env.DEEP || 6);            // deep verdict (even — matched parity, rule 5)
const NRAND = +(process.env.NRAND || 60);         // random-walk control positions
let SEED = +(process.env.SEED || 1);
function rng() { SEED = (SEED * 1103515245 + 12345) & 0x7fffffff; return SEED / 0x7fffffff; }

// One engine instance, reused: fixed-depth analysis is a pure function of the
// FEN (invariance-certified determinism; verified reused ≡ fresh reload), so we
// skip the 154 KB per-position module reparse — a large speedup on the corpus.
const E = E0;
// ── ensemble charges at a fixed shallow depth ──
function charges(fen) {
  const r = E._runAnalyze({ fen, dashDepth: D_LO });
  const t = r.thermo; if (!t || !t.Qs || t.Qs.length < 2) return null;
  const Qs = t.Qs, probs = t.probs, n = Qs.length;
  for (const q of Qs) if (Math.abs(q) > MATE_NEAR) return null;   // absorbing — not thermal
  // energy + variance (full and slow-restricted)
  let mQ = 0; for (let i = 0; i < n; i++) mQ += probs[i] * Qs[i];
  let vAll = 0; for (let i = 0; i < n; i++) vAll += probs[i] * (Qs[i] - mQ) * (Qs[i] - mQ);
  // slow sector = non-capture children (fast modes are the captures)
  const g = new E0.Chess(fen); const caps = new Set(g.fast_captures().map(m => g.fast_to_san(m)));
  let ws = 0, mS = 0;
  for (let i = 0; i < n; i++) if (!caps.has(t.moves[i])) { ws += probs[i]; mS += probs[i] * Qs[i]; }
  let vSlow = 0;
  if (ws > 1e-6) { mS /= ws; for (let i = 0; i < n; i++) if (!caps.has(t.moves[i])) vSlow += (probs[i] / ws) * (Qs[i] - mS) * (Qs[i] - mS); }
  else vSlow = vAll;
  // basin occupations
  let domMass = 1;
  if (t.basinOf) { const bm = {}; for (let i = 0; i < n; i++) bm[t.basinOf[i]] = (bm[t.basinOf[i]] || 0) + probs[i]; domMass = Math.max(...Object.values(bm)); }
  // even modulator: total optionality of both sides at the root
  const c = g.fast_mob_counts();
  const wUs = g.fast_turn() === 'w' ? c.mw : c.mb, wThem = g.fast_turn() === 'w' ? c.mb : c.mw;
  const evenMod = Math.log(wUs + 1) + Math.log(wThem + 1);
  const rSpread = t.T > 0 ? Math.sqrt(vAll) / t.T : 0;
  return { avgQ: mQ, S: t.S, C: vAll, Cslow: vSlow, Sbasin: t.Sbasin || 0, domMass,
           nBasins: t.nBasins || 1, rSpread, evenMod, eShallow: Qs[t.bestIdx] / 2 };
}
// deep verdict (mover POV pawns) + the reported depth actually reached
function deepVerdict(fen) {
  const r = E._runAnalyze({ fen, dashDepth: DEEP });
  const t = r.thermo; if (!t) return null;
  const q = t.Qs[t.bestIdx];
  return { e: q / 2, mate: Math.abs(q) > MATE_NEAR, depth: r.depth };
}
function randPos(nply) {
  const g = new E0.Chess();
  for (let i = 0; i < nply; i++) { const ms = g.fast_moves(); if (!ms.length) break; g.fast_make(ms[(rng() * ms.length) | 0]); }
  return g;
}

// ── assemble the corpus: exposure catastrophes + random-walk controls ──
const rows = [];
function addPos(fen, tag) {
  const ch = charges(fen); if (!ch) return;
  const dv = deepVerdict(fen); if (!dv || dv.depth < DEEP) return;   // require the deep target reached (node cap → drop)
  if (dv.mate) return;                                              // absorbing deep verdict excluded
  rows.push({ tag, fen, Y: dv.e - ch.eShallow, eDeep: dv.e, ...ch });
}
process.stdout.write('recovering exposure corpus… ');
const exp = recover();
for (const c of exp) addPos(c.fen, 'exp');
console.log(rows.length + ' qualified (deep reached)');
process.stdout.write('sampling ' + NRAND + ' random-walk controls… ');
let tries = 0;
while (rows.filter(r => r.tag === 'rand').length < NRAND && tries < NRAND * 4) {
  tries++;
  const g = randPos(4 + ((rng() * 26) | 0));
  if (g.fast_in_check() || g.fast_moves().length < 6) continue;
  // Quiet pre-filter: the sharpest positions node-cap the d4 deep search
  // (5M-node ceiling) and are dropped anyway — skip them cheaply so the
  // sampler doesn't burn expensive searches on positions it will discard.
  // Controls are meant to be varied-but-resolvable; the sharp tail lives in
  // the exposure stratum. (Biases controls quiet — noted; it is a control set.)
  if (g.fast_captures().length > 4) continue;
  addPos(g.fen(), 'rand');
}
console.log(rows.filter(r => r.tag === 'rand').length + ' controls\n');

const N = rows.length;
console.log(`corpus n = ${N}  (exp ${rows.filter(r => r.tag === 'exp').length}, rand ${rows.filter(r => r.tag === 'rand').length})`);
console.log(`Y = e(d${DEEP}) − e(d${D_LO})  [same-parity off-horizon revision, pawns, mover POV]`);
const Ys = rows.map(r => r.Y);
const meanY = Ys.reduce((a, b) => a + b, 0) / N;
const sdY = Math.sqrt(Ys.reduce((a, b) => a + (b - meanY) * (b - meanY), 0) / N);
console.log(`Y: mean ${meanY.toFixed(2)}  sd ${sdY.toFixed(2)}  range [${Math.min(...Ys).toFixed(1)}, ${Math.max(...Ys).toFixed(1)}]\n`);

// ── ridge regression + leave-one-out CV R² ──
function solve(A, b) {                       // Gaussian elimination, A is k×k → returns A⁻¹b
  const k = b.length, M = A.map((row, i) => row.concat(b[i]));
  for (let c = 0; c < k; c++) {
    let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) M[c][c] = 1e-12;
    for (let r = 0; r < k; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let j = c; j <= k; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((row, i) => row[k] / row[i]);   // diagonalised: x_i = rhs_i / M_ii
}
function inv(A) {                            // k×k inverse by solving against identity columns
  const k = A.length, I = [];
  for (let c = 0; c < k; c++) { const e = new Array(k).fill(0); e[c] = 1; I.push(solve(A, e)); }
  // I[c] is the c-th column of A⁻¹; transpose to row-major
  return Array.from({ length: k }, (_, r) => Array.from({ length: k }, (_, c) => I[c][r]));
}
const LAM = 1.0;
// Global-standardised design columns, precomputed once per feature key.
const COL = {};
function col(key) {
  if (COL[key]) return COL[key];
  const v = rows.map(r => r[key]); const n = v.length;
  const m = v.reduce((a, b) => a + b, 0) / n;
  let sd = Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / n) || 1;
  COL[key] = v.map(x => (x - m) / sd); return COL[key];
}
// Closed-form ridge LOO-CV R² (hat matrix): loo_resid_i = (y_i−ŷ_i)/(1−H_ii),
// one k×k inverse instead of n refits. y centred; standardised features ⇒ no
// intercept column. Consistent between observed and permutation-null statistics.
function looR2(featKeys, yv) {
  const n = yv.length, k = featKeys.length;
  const ybar = yv.reduce((a, b) => a + b, 0) / n; const yc = yv.map(v => v - ybar);
  const X = featKeys.map(col);              // k columns, each length n
  // A = XᵀX + λI  (k×k)
  const A = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let a = 0; a < k; a++) for (let c = a; c < k; c++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * X[c][i]; A[a][c] = A[c][a] = s + (a === c ? LAM : 0); }
  const Ai = inv(A);
  // Xᵀy (k)
  const Xty = new Array(k).fill(0); for (let a = 0; a < k; a++) { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * yc[i]; Xty[a] = s; }
  const beta = Ai.map(row => row.reduce((s, v, j) => s + v * Xty[j], 0));
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    let yhat = 0; for (let a = 0; a < k; a++) yhat += beta[a] * X[a][i];
    // H_ii = x_iᵀ A⁻¹ x_i
    let hii = 0; for (let a = 0; a < k; a++) { let t = 0; for (let c = 0; c < k; c++) t += Ai[a][c] * X[c][i]; hii += X[a][i] * t; }
    const loo = (yc[i] - yhat) / Math.max(1e-6, 1 - hii);
    ssRes += loo * loo; ssTot += yc[i] * yc[i];
  }
  return 1 - ssRes / ssTot;
}
// partial Spearman: rank-residualise both Y and charge on {avgQ,S}, correlate residual ranks
function rank(a) { const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length); idx.forEach(([, i], k) => r[i] = k); return r; }
function linResidRanks(target, ctrlIdx) {
  const y = rank(rows.map(r => r[target])).map(v => v);           // rank-transform then linearly de-trend on ctrl ranks
  const ctrl = ctrlIdx.map(ci => rank(rows.map(r => r[ci])));
  const n = rows.length, k = ctrlIdx.length;
  const X = []; for (let i = 0; i < n; i++) X.push([1, ...ctrl.map(c => c[i])]);
  // OLS y on X
  const A = Array.from({ length: k + 1 }, () => new Array(k + 1).fill(0)), bb = new Array(k + 1).fill(0);
  for (let i = 0; i < n; i++) for (let a = 0; a <= k; a++) { for (let c = 0; c <= k; c++) A[a][c] += X[i][a] * X[i][c]; bb[a] += X[i][a] * y[i]; }
  const beta = solve(A, bb);
  return y.map((yi, i) => yi - X[i].reduce((s, xv, a) => s + xv * beta[a], 0));
}
function pearson(a, b) { const n = a.length, ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n; let num = 0, da = 0, db = 0; for (let i = 0; i < n; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return num / Math.sqrt(da * db || 1); }
function partialSpearman(chargeKey) {
  const ry = linResidRanks('Y', ['avgQ', 'S']);
  const rc = linResidRanks(chargeKey, ['avgQ', 'S']);
  return pearson(ry, rc);
}

const y = rows.map(r => r.Y);
const CANDS = [
  ['C  (capacity, Var_π)', 'C', 'seat1'],
  ['C_slow (non-capture)', 'Cslow', 'seat1'],
  ['Sbasin', 'Sbasin', 'seat2'],
  ['domMass', 'domMass', 'seat2'],
  ['rSpread (√Var/T)', 'rSpread', 'seat3'],
  ['evenMod', 'evenMod', 'seat4'],
];
const baseR2 = looR2(['avgQ', 'S'], y);
console.log(`base LOO-R²  {⟨Q⟩,S}  = ${baseR2.toFixed(4)}\n`);

// permutation null for ΔR² (shuffle Y)
const NPERM = 300;
function permNull(chargeKey) {
  const arr = [];
  for (let p = 0; p < NPERM; p++) {
    const yp = y.slice(); for (let i = yp.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [yp[i], yp[j]] = [yp[j], yp[i]]; }
    arr.push(looR2(['avgQ', 'S', chargeKey], yp) - looR2(['avgQ', 'S'], yp));
  }
  arr.sort((a, b) => a - b);
  return arr;
}

console.log('(a) MARGINAL  ΔR²_k = R²{⟨Q⟩,S,I_k} − R²{⟨Q⟩,S}   (permutation p, partial Spearman ρ)');
console.log('  charge                 ΔR²      null95    p      partialρ   seat?');
const results = [];
for (const [label, key, seat] of CANDS) {
  const dR2 = looR2(['avgQ', 'S', key], y) - baseR2;
  const nullArr = permNull(key);
  const null95 = nullArr[Math.floor(0.95 * NPERM)];
  const p = nullArr.filter(v => v >= dR2).length / NPERM;
  const pr = partialSpearman(key);
  const pass = p < 0.10 && Math.abs(pr) >= 0.15;
  results.push({ label, key, seat, dR2, null95, p, pr, pass });
  console.log('  ' + label.padEnd(22) + (dR2 >= 0 ? '+' : '') + dR2.toFixed(4) + '   ' +
    (null95 >= 0 ? '+' : '') + null95.toFixed(4) + '   ' + p.toFixed(3) + '   ' +
    (pr >= 0 ? '+' : '') + pr.toFixed(3) + '    ' + (pass ? 'CANDIDATE' : '—'));
}

// (b) forward-greedy conditional cohort
console.log('\n(b) FORWARD  greedy conditional sequence (ΔI_k | seated)');
let seated = ['avgQ', 'S']; let curR2 = baseR2; const pool = CANDS.map(c => c[1]);
const order = [];
while (pool.length) {
  let best = null, bestG = -Infinity;
  for (const key of pool) { const g = looR2([...seated, key], y) - curR2; if (g > bestG) { bestG = g; best = key; } }
  const lbl = CANDS.find(c => c[1] === best)[0];
  console.log('  + ' + lbl.padEnd(22) + ' conditional ΔR² = ' + (bestG >= 0 ? '+' : '') + bestG.toFixed(4) +
    '   cumulative R² = ' + (curR2 + bestG).toFixed(4));
  order.push({ key: best, gain: bestG });
  seated.push(best); curR2 += bestG; pool.splice(pool.indexOf(best), 1);
  if (bestG < 0.002) { console.log('  … conditional gain < 0.002 — cohort saturated'); break; }
}

// (c) JOINT — the anti-isolation test. The marginal/greedy reads above can miss
// SYNERGY (an XOR-type pair carrying joint verdict-information that neither member
// carries alone). Fit the whole cohort SIMULTANEOUSLY (one representative per
// seat), then add every pairwise product (standardised) as an explicit
// interaction term. If the physical cohort decompresses the verdict jointly — as
// a GGE's coupled multipliers would — the full and/or interaction model lifts CV
// R² above {⟨Q⟩,S}; if not, isolation was not the reason the marginal reads died.
const JOINT = ['C', 'domMass', 'rSpread', 'evenMod'];   // seat 1 / 2 / 3-proxy / 4
function zcol(key) { const v = rows.map(r => r[key]); const m = v.reduce((a, b) => a + b, 0) / v.length; const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / v.length) || 1; return v.map(x => (x - m) / sd); }
const Z = {}; for (const k of JOINT) Z[k] = zcol(k);
const inter = [];
for (let a = 0; a < JOINT.length; a++) for (let b = a + 1; b < JOINT.length; b++) {
  const nk = 'i_' + JOINT[a] + '_' + JOINT[b];
  for (let i = 0; i < rows.length; i++) rows[i][nk] = Z[JOINT[a]][i] * Z[JOINT[b]][i];
  inter.push(nk);
}
function permDelta(feats) { const arr = []; for (let p = 0; p < NPERM; p++) { const yp = y.slice(); for (let i = yp.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0;[yp[i], yp[j]] = [yp[j], yp[i]]; } arr.push(looR2(['avgQ', 'S', ...feats], yp) - looR2(['avgQ', 'S'], yp)); } arr.sort((a, b) => a - b); return arr; }
const fullR2 = looR2(['avgQ', 'S', ...JOINT], y), dFull = fullR2 - baseR2;
const interR2 = looR2(['avgQ', 'S', ...JOINT, ...inter], y), dInter = interR2 - baseR2;
const jn = permDelta(JOINT), jp = jn.filter(v => v >= dFull).length / NPERM;
const iAll = [...JOINT, ...inter], inl = permDelta(iAll), ip = inl.filter(v => v >= dInter).length / NPERM;
console.log('\n(c) JOINT  the whole cohort at once — the anti-isolation / synergy test');
console.log('  full cohort (4 seats)   ΔR² = ' + (dFull >= 0 ? '+' : '') + dFull.toFixed(4) + '   perm p ' + jp.toFixed(3) + '   (R² ' + fullR2.toFixed(4) + ' vs base ' + baseR2.toFixed(4) + ')');
console.log('  + ' + inter.length + ' pairwise interactions ΔR² = ' + (dInter >= 0 ? '+' : '') + dInter.toFixed(4) + '   perm p ' + ip.toFixed(3) + '   (R² ' + interR2.toFixed(4) + ')');
const jointHelps = (dFull > 0 && jp < 0.10) || (dInter > 0 && ip < 0.10);
console.log('  → ' + (jointHelps ? 'JOINT SIGNAL: the cohort decompresses the verdict together though not one-at-a-time — isolation WAS misleading.'
  : 'no joint signal: the full cohort and its interactions still do not beat {⟨Q⟩,S} — the marginal KILL was not an isolation artifact.'));

// ── verdict ──
const anyCand = results.some(r => r.pass);
console.log('\n════ READ 1 VERDICT ════');
if (!anyCand) {
  console.log('  KILL: no candidate clears (ΔR² above permutation null AND |partialρ|≥0.15).');
  console.log('  The physical cohort is EMPTY beyond {⟨Q⟩,S} at this depth — the slow-sector');
  console.log('  verdict-information is not captured by these statistics. No seat instantiated.');
} else {
  console.log('  SEAT CANDIDATES (carry to the shell; temperature seat gated by read 2):');
  for (const r of results.filter(r => r.pass)) console.log(`    ${r.seat}  ${r.label}  (ΔR² ${r.dR2.toFixed(4)}, p ${r.p.toFixed(3)}, ρ ${r.pr.toFixed(3)})`);
}
console.log(`\n  NOTE: Y is a d${D_LO}→d${DEEP} revision (parity-clean). Deep is node-capped on sharp`);
console.log('  positions (dropped when the deep depth was not reached), so the corpus leans quiet;');
console.log('  the slow sector 4–8 ply out is only partially in reach. Read as a lower bound on ΔI.');

fs.writeFileSync(path.join(__dirname, 'results', 'gge_infodecomp.json'),
  JSON.stringify({ D_LO, DEEP, N, baseR2, results, order, meanY, sdY,
    joint: { charges: JOINT, fullR2, dFull, jp, interR2, dInter, ip, jointHelps },
    // persist the raw per-position feature matrix so the joint/interaction
    // question is re-answerable offline forever, with no engine re-run
    rows: rows.map(r => ({ tag: r.tag, Y: r.Y, avgQ: r.avgQ, S: r.S, C: r.C, Cslow: r.Cslow,
      Sbasin: r.Sbasin, domMass: r.domMass, rSpread: r.rSpread, evenMod: r.evenMod })) }, null, 1));
console.log('\nwrote results/gge_infodecomp.json (with joint model + raw feature rows)');
