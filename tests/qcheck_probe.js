// Check-aware quiescence (opts.qCheck) — case-study probe.
//
// DERIVATION (session log, culminating the "more depth" thread). Every
// depth mechanism this session (alloc, hop) bought UNIFORM depth and read
// strength-neutral: the evaluation, not search, was the binding
// constraint. The dissipation probe then showed WHY a local diagnostic
// can't shortcut it — a premature sortie and a sound sacrifice are the
// same observable (Δμ>0, value bleeding) until you reach the payoff. The
// ladder-to-d7 measurement showed full-width softmax cannot reach the
// payoff at all (5M-node cap ≈ d5). But the payoff of the sac class is a
// forced CHECK sequence, and quiescence — the model's T=0 relaxation of
// the fast forcing degrees of freedom — resolves captures but NOT checks.
// A check is equally a fast forcing move (its reply menu genuinely
// collapses: real bite, unlike the sortie's fake forcing), so it belongs
// in the pre-thermal relaxation with captures. qCheck adds non-capture
// checks to the top few quiescence plies (bounded QCHECK_MIN against
// check-sequence explosion). Off by default → honest play bit-identical.
//
// MEASURED (4 s/move):
//   Légal's Mate (…Bh5, White to move), the position that stalled at d3
//   with Nxe5 reading −14.42 at 20 s:
//     qCheck off → plays g4,   Nxe5 = −14.42  (misses the sac)
//     qCheck ON  → plays Nxe5,  Nxe5 = +2.12   at MAIN DEPTH 1 — the
//       tactic is resolved inside quiescence (Nxe5 … Bxf7+ Ke7 Nd5#, the
//       mate being a NON-capture check capture-quiescence stands pat in
//       front of). First mechanism all session to FIND a sacrifice.
//   Cost: the make/undo check-detection is real — fixed-time depth drops
//     ~1 ply on quiet positions (d3→d2). The gauntlet adjudicates
//     tactical acuity vs the lost ply.
//   The queen sortie is NOT cured (its refutation is positional tempo,
//     not a check) — expected; qCheck targets the TACTICAL horizon
//     (sacs, mates, combinations), a different disease from the sortie's
//     positional one.
//
//   node tests/qcheck_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g.fen(); }
const MATE = 100000 - 4096;
const fmt = q => Math.abs(q) > MATE ? (q > 0 ? '+M' + (100000 - Math.abs(q)) : '-M') : (q >= 0 ? '+' : '') + q.toFixed(2);

const CASES = [
  ["Légal's Mate Nxe5 (Q sac)", fenAfter(['e4','e5','Nf3','Nc6','Bc4','d6','Nc3','Bg4','h3','Bh5']), 'Nxe5'],
  ['Wayward sortie Qh5',        fenAfter(['e4','e5']),                                                 'Qh5'],
  ['quiet middlegame',          'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10',    null],
];

console.log('1 · qCheck at 4 s: tactics found, and the depth cost');
console.log('   case                        qCheck  depth  best    cand-Q    nodes');
for (const [name, fen, san] of CASES) {
  for (const qc of [false, true]) {
    const E = fresh();
    const r = E._runAnalyze({ fen, timeLimit: 4000, qCheck: qc });
    const t = r.thermo, i = san ? t.moves.indexOf(san) : -1;
    console.log('   ' + name.padEnd(27) + (qc ? 'ON ' : 'off').padEnd(8) + String(r.depth).padEnd(7) +
      (r.san || '').padEnd(8) + (i >= 0 ? fmt(t.Qs[i]) : '—').padStart(8) + '   ' + r.nodes);
  }
}

// controls: standard mate-in-1 and material sanity must still hold
console.log('\n2 · Controls (depth 3, qCheck ON)');
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
];
let bad = 0;
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const best = E._runAnalyze({ fen, dashDepth: 3, qCheck: true }).thermo;
  const m = best.moves[best.bestIdx];
  if (m !== must) bad++;
  console.log('   ' + name.padEnd(18) + (m === must ? '' : '✗ want ' + must + ' got ') + m);
}
if (bad) { console.log(bad + ' control FAILURES'); process.exit(1); }
console.log('   controls pass');

// determinism
{
  const fen = CASES[2][1];
  const a = fresh()._runAnalyze({ fen, dashDepth: 4, qCheck: true }).thermo;
  const b = fresh()._runAnalyze({ fen, dashDepth: 4, qCheck: true }).thermo;
  console.log('\n3 · Determinism (qCheck ON): ' + (a.T === b.T && a.F === b.F ? 'PASS' : 'FAIL'));
  if (a.T !== b.T || a.F !== b.F) process.exit(1);
}
