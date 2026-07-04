// Validation of the revision-covariance instrument: does ĉ (the
// Boltzmann-weighted common-mode fraction of same-parity revisions)
// distinguish correlated hedges from genuine flexibility?
// Predictions:
//   - forced positions (everything loses but one idea): ĉ high
//   - the Alekhine trap line (Black's many replies all condition on the
//     unresolved exf6 threat): ĉ elevated
//   - open positions with genuinely independent plans: ĉ low
//   node covariance_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }

const CASES = [
  ['startpos (control)',            new E0.Chess().fen()],
  ['Alekhine trap: after 2...d6 3.Nf3 (Black; N still hangs)', fenAfter(['e4','Nf6','e5','d6','Nf3'])],
  ['Alekhine sound: after 2...Nd5 3.d4 (Black)',               fenAfter(['e4','Nf6','e5','Nd5','d4'])],
  ['middlegame (many plans)',       'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['queen en prise (one idea)',     '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1'],
];

console.log('position'.padEnd(60) + '   ĉ      S     S_eff   S_reply  n_eff  depth');
for (const [label, fen] of CASES) {
  const E = fresh();
  const res = E._runAnalyze({ fen, timeLimit: 3000 });
  const t = res.thermo;
  console.log(label.padEnd(60) +
    (t.covC != null ? t.covC.toFixed(3) : '  —  ').padStart(6) +
    t.S.toFixed(2).padStart(7) +
    (t.effS != null ? t.effS.toFixed(2) : '—').padStart(8) +
    (t.replyS != null ? t.replyS.toFixed(2) : '—').padStart(9) +
    (t.replyS != null ? Math.exp(t.replyS).toFixed(1) : '—').padStart(7) +
    String(res.depth).padStart(6));
}
