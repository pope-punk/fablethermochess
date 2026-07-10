// Effective temperature of the positional (slow) sector — the robust,
// SIGN-resolving follow-up to glass_probe.js (which established, n=7 and
// noisily, that the positional sector is out of equilibrium and ages).
//
// Two independent estimators of the FDT violation, over a large filtered
// ensemble, so the SIGN (the number the mechanism needs — hotter vs colder
// slow modes) is corroborated or provably absent:
//
//   (A) RESPONSE ratio X = [d⟨Q⟩/dT] / [−Var_π(Q)/T²].  Equilibrium FDT for
//       energy: d⟨Q⟩/dT = −Var/T² iff the levels are T-independent
//       (equilibrated). Measured d⟨Q⟩/dT by a pinT central difference that
//       recomputes the T-dependent search (so it feels the levels move).
//       X = 1 ⇒ liquid; X > 1 ⇒ excess response (levels cool with T =
//       un-relaxed slow content). Artifact filter: forward and backward
//       differences must agree within 2× (else a truncation jump — discard).
//
//   (B) CONFIGURATIONAL vs DYNAMICAL temperature. The dynamical (fast-mode)
//       temperature is the revision thermometer, T_dyn = 1.2533·⟨|Q_d −
//       Q_{d−2}|⟩. The configurational temperature is what the ensemble
//       spread implies: from the energy-fluctuation relation the bath that
//       would produce spread √Var at the softmax is T itself, but the
//       RELAXATION of that spread across depth, ΔVar/Δd, is the response.
//       Report r = √Var_π(Q) / T_dyn — configurational spread in units of
//       the dynamical temperature. r ≈ const across depth ⇒ one temperature;
//       r growing (slow modes spread wider than the thermometer reads) ⇒
//       slow sector HOTTER; r shrinking ⇒ colder. Independent of (A)'s
//       normalization, so it fixes the sign.
//
// PRE-REGISTERED: liquid ⇒ X median ≈ 1 and r flat. Glass-hotter ⇒ X > 1
// AND r rising with depth. Glass-colder ⇒ X < 1 AND r falling. The two
// estimators must AGREE on the sign or the result is inconclusive.
//
//   node tests/glass_teff.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
const MATE = 100000 - 4096;

function randPos(nply) {
  const g = new E0.Chess();
  for (let i = 0; i < nply; i++) { const ms = g.fast_moves(); if (!ms.length) break;
    g.fast_make(ms[(Math.random() * ms.length) | 0]); }
  return g;
}
function meanVar(Qs, probs) {
  let m = 0; for (let i = 0; i < Qs.length; i++) m += probs[i] * Qs[i];
  let v = 0; for (let i = 0; i < Qs.length; i++) v += probs[i] * (Qs[i] - m) * (Qs[i] - m);
  return { m, v };
}
function ensembleAt(fen, depth, pinT) {
  const r = fresh()._runAnalyze({ fen, dashDepth: depth, pinT });
  const t = r.thermo;
  for (const q of t.Qs) if (Math.abs(q) > MATE) return null;
  const mv = meanVar(t.Qs, t.probs);
  return { m: mv.m, v: mv.v };
}
// (A) response ratio X with artifact filter
function measureX(fen, depth, T0, eps) {
  const dp = T0 * eps;
  const c = ensembleAt(fen, depth, T0), hi = ensembleAt(fen, depth, T0 + dp), lo = ensembleAt(fen, depth, T0 - dp);
  if (!c || !hi || !lo || c.v < 1e-6) return null;
  const fwd = (hi.m - c.m) / dp, bwd = (c.m - lo.m) / dp;
  if (fwd === 0 || bwd === 0) return null;
  const ratio = fwd / bwd;
  if (ratio < 0.5 || ratio > 2) return null;       // discretization jump — discard
  const dQdT = (hi.m - lo.m) / (2 * dp);
  return dQdT / (-c.v / (T0 * T0));
}
// (B) configurational-spread / dynamical-temperature, per depth (unpinned)
function ratioR(fen, depth) {
  const r = fresh()._runAnalyze({ fen, dashDepth: depth });
  const t = r.thermo;
  for (const q of t.Qs) if (Math.abs(q) > MATE) return null;
  const mv = meanVar(t.Qs, t.probs);
  if (t.T <= 0) return null;
  return Math.sqrt(mv.v) / t.T;   // spread in units of the dynamical (revision) temperature
}

const median = a => { if (!a.length) return NaN; const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };
const DSHALLOW = 3, DDEEP = 4;   // d4 ≈ 5× cheaper than d5, still shows aging + sign
const Xd3 = [], Xd5 = [], Rd3 = [], Rd5 = [];
const XqD5 = [], XtD5 = [];   // quiet vs tactical at the deep read
let n = 0, tried = 0;
while (n < 16 && tried < 200) {
  tried++;
  const g = randPos(4 + ((Math.random() * 26) | 0));
  if (g.fast_in_check() || g.fast_moves().length < 6) continue;
  const fen = g.fen();
  const tactical = g.fast_captures().length > 0;   // cheap proxy: captures available
  const a = measureX(fen, DSHALLOW, 1.5, 0.2), b = measureX(fen, DDEEP, 1.5, 0.2);
  const r3 = ratioR(fen, DSHALLOW), r5 = ratioR(fen, DDEEP);
  if (a == null || b == null || r3 == null || r5 == null) continue;
  n++;
  Xd3.push(a); Xd5.push(b); Rd3.push(r3); Rd5.push(r5);
  (tactical ? XtD5 : XqD5).push(b);
}

console.log('n = ' + n + ' filtered positions  (shallow d' + DSHALLOW + ', deep d' + DDEEP + ')\n');
console.log('(A) RESPONSE ratio X   (X=1 liquid; X>1 excess response = un-relaxed slow content)');
console.log('    median X:  d' + DSHALLOW + ' = ' + median(Xd3).toFixed(2) + '   d' + DDEEP + ' = ' + median(Xd5).toFixed(2) +
  '   (aging: X relaxes toward 1 with depth)');
console.log('    tactical (captures avail) median X(deep) = ' + median(XtD5).toFixed(2) +
  '   quiet median X(deep) = ' + median(XqD5).toFixed(2));
console.log('\n(B) CONFIG spread / DYN temperature  r = √Var / T_dyn   (rising ⇒ slow modes HOTTER; falling ⇒ colder)');
console.log('    median r:  d' + DSHALLOW + ' = ' + median(Rd3).toFixed(2) + '   d' + DDEEP + ' = ' + median(Rd5).toFixed(2));
const dR = median(Rd5) - median(Rd3);
console.log('    Δr(d3→d5) = ' + (dR >= 0 ? '+' : '') + dR.toFixed(2));
console.log('\n── sign ──');
const xSign = median(Xd5) > 1.1 ? 'X>1 (excess response)' : median(Xd5) < 0.9 ? 'X<1' : 'X≈1';
const rSign = dR > 0.05 ? 'r rising (hotter)' : dR < -0.05 ? 'r falling (colder)' : 'r flat';
console.log('    (A) says: ' + xSign + '   (B) says: ' + rSign);
console.log('    ' + ((median(Xd5) > 1.1 && dR > 0.05) ? 'AGREE: slow sector is HOTTER (T_eff > T_bath) — classic glass'
  : (median(Xd5) < 0.9 && dR < -0.05) ? 'AGREE: slow sector is COLDER (T_eff < T_bath)'
  : (Math.abs(median(Xd5) - 1) < 0.1 && Math.abs(dR) < 0.05) ? 'AGREE: liquid (no effective temperature)'
  : 'DISAGREE / inconclusive — the two estimators do not corroborate a sign'));
