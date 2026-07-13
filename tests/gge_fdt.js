// gge_fdt.js — READ 2 of the GGE charge-cohort pre-registration
// (docs/gge_charge_cohort.html §9, measurement 2). Pre-registered; no gauntlet.
//
// ── THE QUESTION ──────────────────────────────────────────────────────
// Seat 3 of the cohort is an explicit effective-temperature multiplier
// 1/T_eff on the SLOW (positional) sector — lawful only if the slow sector is
// really out of equilibrium (glassy) AND a single scalar T_eff exists to
// price it. This read is the pre-registered two-slope FDT plot that decides
// it, and it is the honest redo of glass_teff.js (which found X>1 robustly
// but could not sign T_eff — the two estimators disagreed).
//
// ── THE FLUCTUATION–DISSIPATION RELATION, DERIVED ─────────────────────
// Root ensemble at bath T with weights π_a ∝ e^{Q_a/T}. If the levels Q_a are
// T-INDEPENDENT (equilibrated / fast), the energy response to temperature is
// fixed by the fluctuation:
//     d⟨Q⟩/dT = −Var_π(Q) / T²            (FDT for the energy; standard: since
//                d⟨Q⟩/dβ = +Var and dβ/dT = −1/T²).
// Define, in one common unit, the measured RESPONSE and the CORRELATION:
//     R(d) = −T² · (d⟨Q⟩/dT)_measured     (measured by a pinT central diff that
//            RECOMPUTES the T-dependent search, so it feels the levels move)
//     C(d) = Var_π(Q)                      (the fluctuation)
// FDT ⇔ R = C, i.e. the parametric plot R-vs-C has slope 1. Out of
// equilibrium the levels themselves shift with T (un-relaxed slow content),
// so R > C and the local slope is
//     m = R/C = T / T_eff        ⇒   T_eff = T / m .
// m ≈ 1 ⇒ liquid (one temperature). m > 1 ⇒ slow modes at T_eff > T (a hot,
// aging sector — the classic glass). The TWO-SLOPE test asks whether m at the
// SHALLOW (fast) depth band differs from m at the DEEP (slow) band: a single
// slope refutes a distinct slow temperature; a knee hands one back.
//
// Independent corroborator (glass_teff estimator B, fixes the sign):
//     r(d) = √Var_π(Q) / T_dyn    (spread in units of the revision thermometer)
// r rising with depth ⇒ slow modes spread WIDER than the thermometer reads =
// hotter; r falling ⇒ colder. Pre-registered AGREEMENT GATE: seat 3 is
// instantiated ONLY IF the response slope says T_eff>T (m_deep>1 beyond CI)
// AND the spread says hotter (Δr>0). Any disagreement ⇒ NO scalar T_eff ⇒
// seat 3 REFUSED (an observable-dependent T_eff is not a pricing dial — the
// mean/max-backup grave: a wrong-signed pricing term is a strength loss).
//
// ── PRE-REGISTERED KILL CRITERION (fixed before results) ──────────────
//   ONE SLOPE  (m_deep within CI of m_shallow, both ≈1): FDT holds, no slow
//              temperature — seats 1–3's "slow sector" premise collapses to
//              the single-T model; seat 3 REFUSED.
//   TWO SLOPES that AGREE (m_deep>1 and Δr>0): seat 3 instantiated, hand back
//              T_eff = T/m_deep as the multiplier.
//   TWO SLOPES that DISAGREE (m_deep>1 but Δr≤0, the glass_teff standoff):
//              slow sector is out of equilibrium but T_eff is observable-
//              dependent — seat 3 REFUSED, the diagnosis stands without a knob.
//
// ── VERDICT (July 2026, THREE independent N=10 draws, d2/d4, quiet-filtered) —
//    SEAT 3 REFUSED; the glass_teff standoff reproduced under the cleaner gate ──
//                         SEED=2   SEED=5   SEED=8
//     (A) response m_deep  3.32     2.11     2.00    → m>1 in ALL (FDT violated,
//                                                       slow sector out of equil.)
//     (B) spread Δr        +0.23    +0.15    −0.15   → SIGN FLIPS across draws
//     agreement            AGREE    AGREE    DISAGREE
//   The RESPONSE estimator is robust: the slow positional sector's excess
//   response (X = m > 1) is really present in every draw — the sector is out of
//   equilibrium, aging, glassy. But the two INDEPENDENT estimators do not agree
//   on the SIGN of T_eff, and the (dis)agreement is itself draw-dependent (the
//   spread Δr flips + + −). Seat 3 is REFUSED: T_eff is observable-dependent, so
//   there is no single scalar pricing dial (a wrong-signed pricing term is the
//   mean/max-backup grave). This REPRODUCES glass_teff.js exactly, now with a
//   pre-registered agreement gate instead of a post-hoc read.
//
//   METHOD NOTE (load-bearing). Draws 1–2 AGREED (both hotter) and, taken alone,
//   would have INSTANTIATED seat 3 — the single-favorable-draw trap the lab's own
//   method warns about (CLAUDE.md: "welding a suggestive number into a grand
//   narrative before applying the lab's own robustness discipline"). Draw 3, the
//   mandatory replication, refuted them. Two draws are not a result; three that
//   split are. The quiet filter + wide d2→d4 band made estimator (A) cleaner than
//   glass_teff's (m>1 with tighter CIs), but did NOT rescue the sign — the glass
//   hands no knob, robustly.
//
//   node tests/gge_fdt.js            [N=24] [SEED=1] [T0=1.5]
const fs = require('fs'), path = require('path');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
const MATE = 100000 - 4096;
const NPOS = +(process.env.N || 24);
let SEED = +(process.env.SEED || 1);
const T0 = +(process.env.T0 || 1.5);
function rng() { SEED = (SEED * 1103515245 + 12345) & 0x7fffffff; return SEED / 0x7fffffff; }

const D_SHALLOW = 2, D_DEEP = 4;   // matched parity (rule 5); fast band vs slow band
const EPS = 0.2;
// One reused engine (fixed-depth analysis is a pure, invariance-certified
// function of FEN + pinT; verified reused ≡ fresh reload) — skips the per-call
// 154 KB reparse, which dominated the d6 cost.
const E = E0;

function randPos(nply) {
  const g = new E0.Chess();
  for (let i = 0; i < nply; i++) { const ms = g.fast_moves(); if (!ms.length) break; g.fast_make(ms[(rng() * ms.length) | 0]); }
  return g;
}
function meanVar(Qs, probs) {
  let m = 0; for (let i = 0; i < Qs.length; i++) m += probs[i] * Qs[i];
  let v = 0; for (let i = 0; i < Qs.length; i++) v += probs[i] * (Qs[i] - m) * (Qs[i] - m);
  return { m, v };
}
function ensembleAt(fen, depth, pinT) {
  const r = E._runAnalyze({ fen, dashDepth: depth, pinT });
  const t = r.thermo; if (!t) return null;
  for (const q of t.Qs) if (Math.abs(q) > MATE) return null;
  const mv = meanVar(t.Qs, t.probs);
  return { m: mv.m, v: mv.v, T: t.T, depth: r.depth };
}
// (R, C) at one depth: R = −T²·dQ/dT (central diff, artifact-filtered), C = Var.
function RC(fen, depth) {
  const dp = T0 * EPS;
  const c = ensembleAt(fen, depth, T0), hi = ensembleAt(fen, depth, T0 + dp), lo = ensembleAt(fen, depth, T0 - dp);
  if (!c || !hi || !lo || c.v < 1e-6 || c.depth < depth) return null;
  const fwd = (hi.m - c.m) / dp, bwd = (c.m - lo.m) / dp;
  if (fwd === 0 || bwd === 0) return null;
  const ratio = fwd / bwd; if (ratio < 0.5 || ratio > 2) return null;   // discretisation jump — discard
  const dQdT = (hi.m - lo.m) / (2 * dp);
  const R = -T0 * T0 * dQdT;                 // response in Var units
  return { R, C: c.v };
}
// spread ratio r = √Var / T_dyn at one depth (unpinned — feels the real thermometer)
function ratioR(fen, depth) {
  const r = E._runAnalyze({ fen, dashDepth: depth });
  const t = r.thermo; if (!t || t.T <= 0 || r.depth < depth) return null;
  for (const q of t.Qs) if (Math.abs(q) > MATE) return null;
  return Math.sqrt(meanVar(t.Qs, t.probs).v) / t.T;
}

// slope through the origin R = m·C, robustly (median of per-point R/C — resists
// the heavy tail of Var). Bootstrap CI over positions.
function slopeMed(pts) { const s = pts.map(p => p.R / p.C).sort((a, b) => a - b); return s.length ? s[s.length >> 1] : NaN; }
function bootCI(pts, stat, B = 400) {
  const out = [];
  for (let b = 0; b < B; b++) { const s = []; for (let i = 0; i < pts.length; i++) s.push(pts[(rng() * pts.length) | 0]); out.push(stat(s)); }
  out.sort((a, b) => a - b);
  return [out[Math.floor(0.05 * B)], out[Math.floor(0.5 * B)], out[Math.floor(0.95 * B)]];
}
const median = a => { if (!a.length) return NaN; const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };

// ── collect ──
const shallow = [], deep = [], rSh = [], rDe = [];
let n = 0, tried = 0;
process.stdout.write('collecting FDT points (fast band d' + D_SHALLOW + ', slow band d' + D_DEEP + ')… ');
while (n < NPOS && tried < NPOS * 10) {
  tried++;
  const g = randPos(4 + ((rng() * 26) | 0));
  if (g.fast_in_check() || g.fast_moves().length < 6) continue;
  // Quiet pre-filter: the sharpest positions node-cap the d4 pinT central
  // differences (5M-node ceiling × 3 searches per point) and are the runaway
  // cost. The FDT response is a slow-mode probe anyway — measure it on
  // resolvable positions.
  if (g.fast_captures().length > 3) continue;
  const fen = g.fen();
  const a = RC(fen, D_SHALLOW), b = RC(fen, D_DEEP);
  const ra = ratioR(fen, D_SHALLOW), rb = ratioR(fen, D_DEEP);
  if (!a || !b || ra == null || rb == null) continue;
  n++; shallow.push(a); deep.push(b); rSh.push(ra); rDe.push(rb);
}
console.log('n = ' + n);

const mSh = bootCI(shallow, slopeMed), mDe = bootCI(deep, slopeMed);
console.log('\n── (A) RESPONSE-vs-CORRELATION slope  m = R/C = T/T_eff  (m≈1 liquid; m>1 slow modes hotter) ──');
console.log('   fast band d' + D_SHALLOW + ':  m = ' + mSh[1].toFixed(2) + '   90% CI [' + mSh[0].toFixed(2) + ', ' + mSh[2].toFixed(2) + ']');
console.log('   slow band d' + D_DEEP + ':  m = ' + mDe[1].toFixed(2) + '   90% CI [' + mDe[0].toFixed(2) + ', ' + mDe[2].toFixed(2) + ']');
const oneSlope = mDe[0] <= mSh[2] && mSh[0] <= mDe[2];        // CIs overlap
const mDeHot = mDe[0] > 1.1;                                  // deep slope > 1 beyond CI
console.log('   two distinguishable slopes? ' + (oneSlope ? 'NO (CIs overlap) → single temperature' : 'YES (CIs disjoint)') +
  ';  slow-band m>1 beyond CI? ' + (mDeHot ? 'YES (T_eff>T)' : 'no'));
if (mDeHot) console.log('   ⇒ response says T_eff = T/m_deep = ' + (T0 / mDe[1]).toFixed(2) + ' × (T/…)  i.e. slow modes HOTTER by ' + mDe[1].toFixed(2));

console.log('\n── (B) SPREAD ratio  r = √Var / T_dyn  (rising ⇒ hotter; falling ⇒ colder) ──');
const dR = median(rDe) - median(rSh);
console.log('   d' + D_SHALLOW + ': r = ' + median(rSh).toFixed(2) + '   d' + D_DEEP + ': r = ' + median(rDe).toFixed(2) +
  '   Δr = ' + (dR >= 0 ? '+' : '') + dR.toFixed(2) + '  → ' + (dR > 0.05 ? 'hotter' : dR < -0.05 ? 'colder' : 'flat'));

// ── pre-registered agreement gate ──
console.log('\n════ READ 2 VERDICT ════');
let verdict;
if (oneSlope && mDe[2] < 1.3 && Math.abs(dR) < 0.05) {
  verdict = 'ONE SLOPE / liquid — FDT holds, no distinct slow temperature. Seats 1–3 slow-sector premise weak; seat 3 REFUSED.';
} else if (mDeHot && dR > 0.05) {
  verdict = 'TWO SLOPES, AGREE (m_deep>1 and Δr>0) — slow sector hotter. SEAT 3 INSTANTIATED: T_eff = T/' + mDe[1].toFixed(2) + '.';
} else if (mDeHot && dR <= 0.05) {
  verdict = 'FDT VIOLATED but estimators DISAGREE (response: hotter; spread: ' + (dR < -0.05 ? 'colder' : 'flat') +
    ') — the glass_teff standoff reproduced. T_eff is observable-dependent ⇒ NO scalar pricing dial. Seat 3 REFUSED; the glass diagnosis stands without a knob.';
} else {
  verdict = 'INCONCLUSIVE: response m_deep=' + mDe[1].toFixed(2) + ' (CI [' + mDe[0].toFixed(2) + ',' + mDe[2].toFixed(2) + ']), Δr=' + dR.toFixed(2) +
    '. No agreed two-slope signal; seat 3 REFUSED pending a cleaner estimator.';
}
console.log('  ' + verdict);

fs.writeFileSync(path.join(__dirname, 'results', 'gge_fdt.json'),
  JSON.stringify({ n, D_SHALLOW, D_DEEP, T0, mShallow: mSh, mDeep: mDe, rShallow: median(rSh), rDeep: median(rDe), dR, verdict }, null, 1));
console.log('\nwrote results/gge_fdt.json');
