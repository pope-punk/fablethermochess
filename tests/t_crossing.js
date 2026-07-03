// Counterfactual-temperature reranking: at what bath T does a decision
// flip? Uses the pinT laboratory hook (external-field knob; play never
// sets it). The inaugural case is the Alekhine blunder 1.e4 Nf6 2.e5,
// where d6 (hangs the knight to exf6) outranks Nd5 at match temperatures.
// Measured: the crossing sits at T* ~ 1.0 — the zero-point quantum itself.
//   node t_crossing.js [fen] [moveA] [moveB]
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
let fen = process.argv[2], mA = process.argv[3] || 'd6', mB = process.argv[4] || 'Nd5';
if (!fen) {
  const g = new E0.Chess();
  for (const m of ['e4', 'Nf6', 'e5']) g.move(m);
  fen = g.fen();
}
console.log('T-crossing at fixed depth 3:', fen, `· ${mA} vs ${mB}`);
console.log('T pin    best      Q(A)     Q(B)    Δ(A−B)');
for (const T of [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0]) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, pinT: T });
  const t = res.thermo;
  const qa = t.Qs[t.moves.indexOf(mA)], qb = t.Qs[t.moves.indexOf(mB)];
  console.log(`${T.toFixed(2).padStart(5)}  ${t.moves[t.bestIdx].padEnd(8)} ${qa.toFixed(2).padStart(8)} ${qb.toFixed(2).padStart(8)} ${(qa - qb).toFixed(2).padStart(8)}`);
}
