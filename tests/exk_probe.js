// exK — the absorbing coordinate carries no entropy: case-study probes.
//
// Motivation (July 2026): every road of the kinetics/clock session
// dead-ended at the evaluation's mispricing of exposure — the +1010
// loss marched its king Kb4→Kd7 into a mating net at evals +10…+13.
// The energy side already prices king mobility at zero (PIECE_BASE['k']
// = 0, "walking it into the open is rewarded with no safety offset");
// mate is the vanishing of the king's menu, so the king's move count is
// the order parameter of the absorbing transition, not thermal option
// supply (rule 2, extended from the absorbing state to the absorbing
// coordinate). Two surfaces, decomposable:
//   exK='leaf' — king moves out of both sides' leaf mobility counts
//   exK='z'    — king moves enter every interior Z as ONE microstate
//   exK=true   — both.
//
// PROBE VERDICTS (measured before the ladder):
//   fine70 argmax self-playout (the endgame gate — king activity is
//   the whole game there):
//     off:   WHITE WINS by mate, 53 plies (Kb2)     — reference
//     leaf:  WHITE WINS by mate, 53 plies (Kb2)     — PASSES, play unchanged
//     z:     BLACK wins by mate, 70 plies (Kb2)     — POISON: the interior
//            premium collapse (king fan = 1 microstate, both sides)
//            washes out the zugzwang asymmetry and the danger sense
//            where nearly every move is a king move; a won ending is
//            not merely drawn but LOST
//     both:  draw, 56 plies (Ka2)                   — killed by the z share
//   ⇒ the interior-Z recount is RETIRED on the endgame gate alone;
//     'leaf' is the surviving candidate and proceeds to the ladder.
//   the +1010 king-march positions (plies 50/58/60): the march is
//     UNCHANGED under every exK variant — at +13 all moves win in F's
//     eyes and the march is indifference-driven, not entropy-reward-
//     driven. exK cannot cure conversion-apathy; recorded honestly.
//   Alekhine root (hedge disease, not king): Δ(d6−Nd5) +1.02 → +0.94
//     under exK — essentially unchanged, as predicted.
//
//   node tests/exk_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }

const FINE70 = '8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1';

// ── 1 · The endgame gate: fine70 argmax self-playout per variant ──
console.log('1 · fine70 self-playout (400 ms/move, 160-ply cap)');
for (const exK of [undefined, 'leaf', 'z', true]) {
  const E = fresh();
  const g = new E0.Chess(FINE70);
  let keys = [g.fast_hash()], plies = 0;
  while (!g.game_over() && plies < 160) {
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: 400, pastKeys: keys.slice(0, -1), exK });
    if (!res.san) break;
    const mv = g.move(res.san);
    if (!mv) break;
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
    plies++;
  }
  const out = g.in_checkmate() ? (g.fast_turn() === 'b' ? 'WHITE WINS by mate' : 'BLACK wins by mate')
            : g.game_over() ? 'draw' : 'undecided';
  console.log('   exK=' + String(exK === undefined ? 'off' : exK).padEnd(5) +
    out + ' (' + plies + ' plies, first ' + g.history()[0] + ')');
}

// ── 2 · Controls at depth 3 with the surviving variant ──
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n2 · Controls (depth 3, exK=leaf)');
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, exK: 'leaf' });
  const best = res.thermo.moves[res.thermo.bestIdx];
  const ok = must == null || best === must;
  if (!ok) bad++;
  console.log('   ' + name.padEnd(18) + (ok ? '' : '✗') + best);
}
if (bad) { console.log(bad + ' control FAILURES'); process.exit(1); }
console.log('   controls pass');

// ── 3 · Alekhine honesty check (should be ~unchanged) ──
console.log('\n3 · Alekhine root, depth 3');
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);
for (const exK of [undefined, 'leaf']) {
  const E = fresh();
  const res = E._runAnalyze({ fen: alekhine, dashDepth: 3, exK });
  const t = res.thermo;
  const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
  console.log('   exK=' + String(exK === undefined ? 'off' : exK).padEnd(5) +
    'best=' + t.moves[t.bestIdx] + '  Δ(d6−Nd5)=' + (d >= 0 ? '+' : '') + d.toFixed(2));
}

// ── 4 · Determinism with exK=leaf ──
{
  const fen = 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10';
  const a = fresh()._runAnalyze({ fen, dashDepth: 4, exK: 'leaf' }).thermo;
  const b = fresh()._runAnalyze({ fen, dashDepth: 4, exK: 'leaf' }).thermo;
  console.log('\n4 · Determinism (exK=leaf): ' + (a.T === b.T && a.F === b.F ? 'PASS' : 'FAIL'));
  if (a.T !== b.T || a.F !== b.F) process.exit(1);
}
