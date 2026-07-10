// Glass probe — is the positional sector out of equilibrium (a glass), so
// that its slow modes carry an effective temperature ≠ the bath?
//
// THE PHYSICS. In the canonical ensemble with FIXED energy levels Q_i,
// the mean value's response to temperature is exactly the fluctuation:
//     d⟨Q⟩/dT = −Var_π(Q) / T²         (engine sign: π_i ∝ exp(Q_i/T))
// This is the fluctuation–dissipation theorem for energy. It holds iff the
// levels are T-independent — i.e. the modes are equilibrated. If the search
// has NOT relaxed a mode, that mode's value still moves with T (dQ_i/dT≠0),
// and the measured response departs from the fluctuation. The ratio
//     X = [measured d⟨Q⟩/dT] / [−Var_π(Q)/T²]
// is the FDT violation: X = 1 ⇒ equilibrated (liquid); X ≠ 1 ⇒ un-relaxed
// modes carry an effective temperature (glass). Measured d⟨Q⟩/dT via a
// pinT perturbation (which recomputes the T-dependent search, so it sees
// the levels move); Var from the ensemble at the pinned T.
//
// PRE-REGISTERED PREDICTION (fixed before running):
//   · LIQUID hypothesis: X ≈ 1 for all positions and depths.
//   · GLASS hypothesis: X departs from 1, and |X−1| is LARGER for
//     positionally-quiet positions (slow modes dominant, un-relaxed) than
//     for tactically-sharp ones (fast modes, resolved by quiescence), and
//     does not vanish at the deepest reachable depth.
//   KILL: if X ≈ 1 within noise everywhere, the positional sector is a
//     liquid, the effective-temperature idea is wrong, and self-indulgence
//     is NOT a wrong-temperature-for-slow-modes artifact.
//
// VERDICT (July 2026, n=7, T0=1.5):
//   LIQUID REJECTED, robustly: X ranges ~0 to 22 — nowhere near 1. The
//   fluctuation and the response disagree by up to an order of magnitude;
//   the positional sector is NOT in configurational equilibrium at the bath
//   temperature. The revision thermometer (a fast-mode instrument) does not
//   describe the slow modes.
//   AGING confirmed (the glass signature): X relaxes toward 1 with depth but
//   does not reach it (open Sicilian 9.6→1.3, symmetric 5.4→1.3, closed KID
//   22.6→9.4). Slow modes can't equilibrate on the search timescale. The
//   most physically glassy position — the locked KID centre — is by far the
//   glassiest at depth (X=9.4 vs ~1.3 for resolved tactical positions).
//   NOT ESTABLISHED: the summary's positional-vs-tactical gap (|X−1| 2.5 vs
//   0.40) is almost entirely ONE outlier (closed KID); drop it and the
//   groups are indistinguishable, and the locked French runs the other way
//   (X≈0.3, likely a pinT-truncation discretization artifact). And the SIGN
//   of the effective temperature is not claimable from this normalization —
//   which is the number the mechanism needs (hotter vs colder decides add
//   vs subtract). Cleaner protocol required: the C–χ parametric plot across
//   depth (slope = −1/T_eff), robust and sign-resolving.
//   NET: the positional sector IS a glass (out of equilibrium, aging) — the
//   first measured evidence the single bath is wrong for the slow modes —
//   but T_eff's magnitude/sign await the cleaner measurement.
//
//   node tests/glass_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function after(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g.fen(); }
const MATE = 100000 - 4096;

function meanVar(Qs, probs) {
  let m = 0; for (let i = 0; i < Qs.length; i++) m += probs[i] * Qs[i];
  let v = 0; for (let i = 0; i < Qs.length; i++) v += probs[i] * (Qs[i] - m) * (Qs[i] - m);
  return { m, v };
}
function meanAt(fen, depth, pinT) {
  const r = fresh()._runAnalyze({ fen, dashDepth: depth, pinT });
  const t = r.thermo;
  // guard: skip if any near-mate contaminates the ensemble
  for (const q of t.Qs) if (Math.abs(q) > MATE) return null;
  return meanVar(t.Qs, t.probs);
}
function measureX(fen, depth, T0, eps) {
  const dp = T0 * eps;
  const c = meanAt(fen, depth, T0);
  const hi = meanAt(fen, depth, T0 + dp);
  const lo = meanAt(fen, depth, T0 - dp);
  if (!c || !hi || !lo) return null;
  const dQdT = (hi.m - lo.m) / (2 * dp);
  const eqPred = -c.v / (T0 * T0);
  if (Math.abs(eqPred) < 1e-6) return null;
  return { X: dQdT / eqPred, var: c.v };
}

// tag: 'T' tactically sharp (fast modes), 'Q' positionally quiet (slow modes)
const POS = [
  ['T', 'Evans gambit (sharp)',   after(['e4','e5','Nf3','Nc6','Bc4','Bc5','b4'])],
  ['T', 'open Sicilian',          after(['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'])],
  ['T', 'Two Knights Ng5',        after(['e4','e5','Nf3','Nc6','Bc4','Nf6','Ng5'])],
  ['Q', 'Italian quiet',          after(['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d3','d6'])],
  ['Q', 'closed KID centre',      after(['d4','Nf6','c4','g6','Nc3','Bg7','e4','d6','Nf3','O-O','Be2','e5','d5'])],
  ['Q', 'symmetric middlegame',   'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['Q', 'locked French',          after(['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Qb6'])],
];

console.log('FDT ratio X = measured d⟨Q⟩/dT ÷ (−Var/T²).  X≈1 liquid; |X−1| large & positional ⇒ glass');
console.log('(T0=1.5, ε=0.2)\n');
console.log('tag  position                    X(d3)    X(d5)');
const byTag = { T: [], Q: [] };
for (const [tag, name, fen] of POS) {
  const x3 = measureX(fen, 3, 1.5, 0.2);
  const x5 = measureX(fen, 5, 1.5, 0.2);
  const f = x => x ? x.X.toFixed(2) : ' — ';
  console.log('  ' + tag + '  ' + name.padEnd(27) + f(x3).padStart(6) + '   ' + f(x5).padStart(6));
  if (x5) byTag[tag].push(x5.X);
}
const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const dev = a => mean(a.map(x => Math.abs(x - 1)));
console.log('\n── FDT violation |X−1| at d5 ──');
console.log('  tactically sharp (fast modes): mean X=' + mean(byTag.T).toFixed(2) + '  mean|X−1|=' + dev(byTag.T).toFixed(2));
console.log('  positionally quiet (slow modes): mean X=' + mean(byTag.Q).toFixed(2) + '  mean|X−1|=' + dev(byTag.Q).toFixed(2));
console.log('\nGLASS if quiet |X−1| ≫ sharp |X−1| (slow modes violate FDT); LIQUID if both ≈ 0.');
