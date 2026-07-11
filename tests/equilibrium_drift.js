// equilibrium_drift.js — the state-function residual of F (never measured before).
//
// THE EQUILIBRIUM HYPOTHESIS (the project's linchpin, stated as a conservation
// law): if each side plays the real best move, the evaluation stays the same.
// Taken literally, F is a MARTINGALE along the best line — stationary under the
// system's own dynamics — which is exactly the existence condition for a
// thermodynamic STATE FUNCTION (path-independent, no drift at equilibrium). The
// engine's F is NOT conserved under its own self-play, because the search horizon
// rolls: playing the best move and re-searching to depth d injects one more ply
// of lookahead, revising the value. That revision is the RESIDUAL of the
// equilibrium hypothesis — a direct, signed measure of how far F fails to be a
// state function ("the curl of the proposed potential").
//
// TWO THINGS THAT MAKE THE NAIVE VERSION MEANINGLESS, handled here:
//   · PARITY. F carries the one-sided entropy ladder (+T·S per ply), so only
//     SAME-SIDE-TO-MOVE positions are comparable — drifts are measured two-ply
//     apart along the self-play line (rule 5, as a measurement constraint).
//   · THE PROGRESS CONFOUND. A winning side legitimately converts (eval SHOULD
//     move). So the robust signals are not the raw mean drift but: does drift
//     vanish where the position is RESOLVED (low T), does it grow with T, and
//     does the PREMIUM (T·S) leak more than the ENERGY (maxQ) — the last being
//     confound-robust, because progress loads onto energy, not premium.
//
// OBSERVABLES. Engine self-plays its own best move (argmax Q) from several
// openings at fixed depth d. At each ply, mover-POV: maxQ (played value), avgQ
// (⟨Q⟩), TS (premium), F = avgQ + TS (the state function), T, phase. Two-ply
// same-side drifts: ΔF, ΔmaxQ, ΔTS = value(t+2) − value(t). Absorbing plies
// (mate/repetition) excluded — not thermal.
//
// PRE-REGISTERED PREDICTIONS (from the equilibrium hypothesis):
//   (1) CONSERVATION WHEN RESOLVED: RMS(ΔF) → small (~T₀ scale) in cold/frozen
//       plies — F is a good state function where the position is resolved.
//   (2) LEAK GROWS WITH T: RMS(ΔF) increases with the bath temperature.
//   (3) DYNAMIC WINNER'S CURSE: corr(TS(t), ΔF(t)) < 0 — high premium mean-reverts
//       downward, the static F−⟨Q⟩=TS optimism seen as a conservation violation.
//   (4) THE PREMIUM IS THE LEAKY PART: RMS(ΔTS) ≳ RMS(ΔmaxQ) — most of the
//       state-function violation lives in the entropy premium, not the material.
//       If it holds, the self-indulgence problem IS the premium failing to be a
//       state function, measured independently of any blunder.
//   Landmark cross-check (deepening revision δ = F_{d+2} − F_d on fixed
//   positions): frozen/resolved ≈ 0, sharp/contested large — the same residual
//   seen under deepening instead of play.
//
//   node tests/equilibrium_drift.js [depth]
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
const DEPTH = parseInt(process.argv[2] || '3', 10);
const MATE_NEAR = 100000 - 4096;
const PAWN = 2;

function movesAfter(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g; }
const OPENINGS = [
  ['startpos', []],
  ['open game', ['e4', 'e5', 'Nf3', 'Nc6']],
  ['QGD', ['d4', 'd5', 'c4', 'e6']],
  ['Sicilian', ['e4', 'c5', 'Nf3', 'd6']],
  ['French', ['e4', 'e6', 'd4', 'd5']],
];
const PLIES = 28;

// self-play one line at fixed depth; one engine instance (TT/jhat persist within
// the game, as in real play). record mover-POV values per ply.
function selfPlayLine(name, startMoves, depth) {
  const E = fresh();
  const g = new E.Chess(); for (const m of startMoves) g.move(m);
  const rec = [];
  for (let i = 0; i < PLIES && !g.game_over(); i++) {
    const r = E._runAnalyze({ fen: g.fen(), dashDepth: depth, newGame: i === 0 });
    const th = r.thermo; if (!th) break;
    const maxQ = th.Qs[th.bestIdx];
    rec.push({ side: g.turn(), maxQ, avgQ: th.avgQ, TS: th.TS, F: th.F, T: th.T, phase: th.phase,
      mate: Math.abs(maxQ) > MATE_NEAR, rep: Math.abs(th.F) < 1e-9 });
    g.move(th.moves[th.bestIdx]);
  }
  return { name, rec };
}

// two-ply same-side drifts (mover POV, in pawns), excluding absorbing endpoints
const drifts = [];   // { dF, dMaxQ, dTS, T0:TS(t), Tbath, phase, side }
for (const [name, mv] of OPENINGS) {
  const { rec } = selfPlayLine(name, mv, DEPTH);
  for (let t = 0; t + 2 < rec.length; t++) {
    const a = rec[t], b = rec[t + 2];
    if (a.side !== b.side) continue;                       // parity guard (should always hold)
    if (a.mate || b.mate || a.rep || b.rep) continue;      // absorbing states are not thermal
    drifts.push({
      dF: (b.F - a.F) / PAWN, dMaxQ: (b.maxQ - a.maxQ) / PAWN, dTS: (b.TS - a.TS) / PAWN,
      premium: a.TS / PAWN, Tbath: a.T, phase: a.phase,
    });
  }
}

// stats
const rms = a => a.length ? Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length) : NaN;
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
function pearson(xy) { const n = xy.length; if (n < 3) return NaN; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of xy) { sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; }
  const d = Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)); return d === 0 ? NaN : (n * sxy - sx * sy) / d; }

console.log(`\nequilibrium-drift residual — self-play, depth ${DEPTH}, ${drifts.length} two-ply samples\n`);
console.log('overall (pawns):');
console.log('  RMS(ΔF)    = ' + rms(drifts.map(d => d.dF)).toFixed(3) + '   mean = ' + mean(drifts.map(d => d.dF)).toFixed(3));
console.log('  RMS(ΔmaxQ) = ' + rms(drifts.map(d => d.dMaxQ)).toFixed(3) + '   mean = ' + mean(drifts.map(d => d.dMaxQ)).toFixed(3));
console.log('  RMS(ΔTS)   = ' + rms(drifts.map(d => d.dTS)).toFixed(3) + '   mean = ' + mean(drifts.map(d => d.dTS)).toFixed(3));

// (1)&(2) by phase and by T bin
console.log('\n(1)&(2) drift vs resolution:');
for (const ph of ['frozen', 'cold', 'critical', 'hot']) {
  const g = drifts.filter(d => d.phase === ph);
  if (g.length) console.log(`  ${ph.padEnd(9)} n=${String(g.length).padStart(3)}  RMS(ΔF)=${rms(g.map(d => d.dF)).toFixed(3)}  RMS(ΔTS)=${rms(g.map(d => d.dTS)).toFixed(3)}  <T>=${mean(g.map(d => d.Tbath)).toFixed(2)}`);
}
const tbins = [[0, 1], [1, 2], [2, 4], [4, 8], [8, 1e9]];
console.log('  ── by bath T ──');
for (const [lo, hi] of tbins) {
  const g = drifts.filter(d => d.Tbath >= lo && d.Tbath < hi);
  if (g.length) console.log(`  T∈[${lo},${hi === 1e9 ? '∞' : hi})  n=${String(g.length).padStart(3)}  RMS(ΔF)=${rms(g.map(d => d.dF)).toFixed(3)}`);
}

// (3) dynamic winner's curse
console.log('\n(3) dynamic winner\'s curse:');
console.log('  corr(premium TS, ΔF)    = ' + pearson(drifts.map(d => [d.premium, d.dF])).toFixed(3) + '   (predict < 0)');
console.log('  corr(premium TS, ΔmaxQ) = ' + pearson(drifts.map(d => [d.premium, d.dMaxQ])).toFixed(3));

// (4) premium vs energy leak
const rF = rms(drifts.map(d => d.dF)), rQ = rms(drifts.map(d => d.dMaxQ)), rTS = rms(drifts.map(d => d.dTS));
console.log('\n(4) premium vs energy leak:  RMS(ΔTS)/RMS(ΔmaxQ) = ' + (rTS / rQ).toFixed(2) + '   (predict ≳ 1 ⇒ premium is the leaky part)');

// landmark deepening-revision cross-check
console.log('\nlandmark deepening revision δ = F(d+2) − F(d)  (pawns):');
const LAND = [
  ['startpos', new E0.Chess().fen()],
  ['open middlegame', movesAfter(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7']).fen()],
  ['sharp (Fried Liver)', movesAfter(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5']).fen()],
  ['trebuchet (frozen)', '8/8/4k3/4p3/4P3/3K4/8/8 w - - 0 1'],
];
for (const [nm, fen] of LAND) {
  const lo = fresh()._runAnalyze({ fen, dashDepth: DEPTH }).thermo;
  const hi = fresh()._runAnalyze({ fen, dashDepth: DEPTH + 2 }).thermo;
  if (lo && hi) console.log(`  ${nm.padEnd(20)} F(d${DEPTH})=${(lo.F / PAWN).toFixed(2)}  F(d${DEPTH + 2})=${(hi.F / PAWN).toFixed(2)}  δ=${((hi.F - lo.F) / PAWN).toFixed(3)}  phase=${lo.phase}`);
}

// verdict on the pre-registered predictions
const cold = drifts.filter(d => d.phase === 'frozen' || d.phase === 'cold');
const hot = drifts.filter(d => d.phase === 'hot' || d.phase === 'critical');
const p1 = cold.length && rms(cold.map(d => d.dF)) < 0.5;                 // resolved ≈ conserved (< half pawn)
const p2 = cold.length && hot.length && rms(hot.map(d => d.dF)) > rms(cold.map(d => d.dF));
const p3 = pearson(drifts.map(d => [d.premium, d.dF])) < 0;
const p4 = rTS / rQ >= 1;
console.log('\n════ PREDICTIONS ════');
console.log('  (1) conservation when resolved : ' + (p1 ? 'HOLDS' : 'FAILS'));
console.log('  (2) leak grows with T          : ' + (p2 ? 'HOLDS' : 'FAILS'));
console.log('  (3) dynamic winner\'s curse (<0): ' + (p3 ? 'HOLDS' : 'FAILS'));
console.log('  (4) premium is the leaky part  : ' + (p4 ? 'HOLDS' : 'FAILS'));

require('fs').writeFileSync(require('path').join(__dirname, 'results', 'equilibrium_drift.json'),
  JSON.stringify({ depth: DEPTH, n: drifts.length, drifts }, null, 1));
console.log('\nwrote results/equilibrium_drift.json');
