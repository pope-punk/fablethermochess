// The heteroscedastic premium (backup: 'sigma') — case-study probes.
//
// DERIVATION CHAIN (July 2026). The quenched program (quenched_probe.js)
// established that the annealed→quenched correction is the right FAMILY
// but its adjudication measurement split the central disease in two:
//   - the trap face IS a correlation overcount (λ̂ 0.57) — but it
//     self-heals exactly when it becomes measurable (the killer's
//     resolution both reveals the correlation and repairs the values);
//   - the open face (post-exf6: 29 moves, λ̂ 0.81) is HONESTLY
//     independent optionality among known-bad options — 29 resolved
//     ways to be down a knight, priced at the global bath T as if
//     still uncertain.
// The missing state variable: the ensemble has ONE temperature, but
// the microstates have DIFFERENT residual uncertainties. The winner's
// curse of option a rides its OWN noise σ_a; a resolved option has
// nothing left to be optimistic about. The exact identity
// F − ⟨Q⟩_π = T·S generalizes microstate-by-microstate:
//     V = ⟨Q⟩_π + Σ_a π_a · σ_a · (−ln π_a)
// π untouched at the bath (the premT pattern); σ_a = √(rev_a² + T₀²)
// from each child's same-parity revision (fresh full value at depth−1
// vs its TT partner at depth−3, or the static baseline at depth 2 —
// the root thermometer's own seed pair), riding the zero-point
// quantum with the SAME functional form as the bath itself. No new
// constants. σ_a = T ∀a recovers F exactly; unmeasured children
// (frontier, tails, depth-1 nodes) keep σ = bath — unmeasured =
// undeflated. The accumulated entropy ladder along RESOLVED lines
// collapses to the frontier layer: the engine stops paying itself,
// level after level, for menus whose values it has already measured
// cold.
//
// PROBE VERDICTS (measured, this file reproduces them):
//   Alekhine: d3 Δ(d6−Nd5) +1.02 → +0.18 (best Nc6); d4 +0.48 →
//     −1.02, best = Nd5 — THE SOUND MOVE. pinT scan: the blunder is
//     gone at EVERY pinned temperature 1.0–3.0 — not a knife-edge
//     crossing; the first mechanism in the project's history to cure
//     the motivating case at honest temperatures.
//   Controls (Rxd5 / Re8# / trap dxe5): pass.
//   fine70 argmax playout: WHITE WINS by mate in 41 plies — FASTER
//     than the F baseline's 53 (resolved-menu deflation sharpens
//     conversion: the opponent's known-junk options stop earning
//     premium, so progress reads clearer).
//   Determinism: PASS.
// Ladder next: oracle match (the danger-sense question — mean/max
// died mated-while-ahead; sigma keeps the premium at the frontier
// where the uncertainty actually lives), then the fixed-time gauntlet.
//
//   node tests/sigma_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

console.log('1 · Alekhine Δ(d6−Nd5), F vs sigma');
for (const depth of [3, 4]) {
  const row = [];
  for (const backup of [undefined, 'sigma']) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, backup });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    row.push((backup || 'F').padEnd(6) + ' best=' + t.moves[t.bestIdx].padEnd(5) +
      ' Δ=' + ((d >= 0 ? '+' : '') + d.toFixed(2)).padEnd(6));
  }
  console.log('   d' + depth + ':  ' + row.join(' | '));
}

console.log('\n2 · pinT scan d3 (argmax; d6 = the blunder)');
for (const pinT of [1.0, 1.5, 2.0, 3.0]) {
  const row = [];
  for (const backup of [undefined, 'sigma']) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: 3, pinT, backup });
    row.push(res.thermo.moves[res.thermo.bestIdx].padEnd(6));
  }
  console.log('   pinT=' + pinT.toFixed(1) + '  F: ' + row[0] + ' sigma: ' + row[1]);
}

const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n3 · Controls (depth 3, sigma)');
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, backup: 'sigma' });
  const best = res.thermo.moves[res.thermo.bestIdx];
  const ok = must == null || best === must;
  if (!ok) bad++;
  console.log('   ' + name.padEnd(18) + (ok ? '' : '✗') + best);
}
if (bad) { console.log(bad + ' control FAILURES'); process.exit(1); }
console.log('   controls pass');

{
  const E = fresh();
  const g = new E0.Chess('8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1');
  let keys = [g.fast_hash()], plies = 0;
  while (!g.game_over() && plies < 160) {
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: 400, pastKeys: keys.slice(0, -1), backup: 'sigma' });
    if (!res.san) break;
    const mv = g.move(res.san);
    if (!mv) break;
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
    plies++;
  }
  const out = g.in_checkmate() ? (g.fast_turn() === 'b' ? 'WHITE WINS by mate' : 'BLACK wins by mate — GATE FAILED')
            : g.game_over() ? 'draw — GATE FAILED' : 'undecided';
  console.log('\n4 · fine70 self-playout (sigma): ' + out + ' (' + plies + ' plies, first ' + g.history()[0] + ')');
}

{
  const fen = 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10';
  const a = fresh()._runAnalyze({ fen, dashDepth: 4, backup: 'sigma' }).thermo;
  const b = fresh()._runAnalyze({ fen, dashDepth: 4, backup: 'sigma' }).thermo;
  console.log('\n5 · Determinism (sigma): ' + (a.T === b.T && a.F === b.F ? 'PASS' : 'FAIL'));
  if (a.T !== b.T || a.F !== b.F) process.exit(1);
}
