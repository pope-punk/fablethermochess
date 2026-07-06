// The interior basin premium (backup: 'basin'): at every interior node
// the choice premium counts PLANS, not moves — Z over basin
// representatives (basins.js coordinates, measured per child by census
// brackets in thermoSearch, TT-replayed via basinCache). The claims
// under test, in the order the winner's-curse program established them:
//   1. cures the Alekhine blunder (27 knight-losers enter Z once)
//   2. keeps the danger sense (a collapsing position degenerates to one
//      basin and earns nothing — the gradient survives by construction;
//      the mean/max backups died at the gauntlet for losing exactly this)
//   3. keeps deep forced lines visible (max-anchored within basins,
//      F-shaped across them — unlike 'mean', nothing is opponent-mixed)
//   4. tames the interior share of thermal runaway (smaller premiums,
//      smaller T·S feedback)
//   5. costs tolerable overhead (brackets + per-node clustering)
//
//   node tests/basin_premium.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);
const MODES = ['', 'basin'];
const label = m => (m === '' ? 'F' : m).padEnd(7);

// ── 1 · Alekhine decision, live bath ────────────────────────
console.log('1 · Alekhine (live bath): Δ(d6−Nd5), best move, nodes');
console.log('mode     depth   best      Δ(d6−Nd5)      T     nodes');
for (const depth of [3, 4]) {
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, backup: mode });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    console.log(label(mode) + String(depth).padStart(4) +
      ('    ' + t.moves[t.bestIdx]).padEnd(10) +
      ((d >= 0 ? '+' : '') + d.toFixed(2)).padStart(10) +
      t.T.toFixed(2).padStart(9) + String(res.nodes).padStart(10));
  }
}

// ── 2 · pinT scan ───────────────────────────────────────────
console.log('\n2 · pinT scan, Δ(d6−Nd5) at depth 3');
let head = 'T pin  '; for (const m of MODES) head += label(m).padStart(9); console.log(head);
for (const T of [0.5, 1.0, 1.5, 2.0, 3.0]) {
  let row = T.toFixed(2).padEnd(7);
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: 3, pinT: T, backup: mode });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    row += ((d >= 0 ? '+' : '') + d.toFixed(2)).padStart(9);
  }
  console.log(row);
}

// ── 3 · Controls ────────────────────────────────────────────
const CONTROLS = [
  ['startpos',                   new E0.Chess().fen(),                      null],
  ['trap line (must save N)',    fenAfter(['e4','Nf6','e5','d6','Nf3']),    null],
  ['queen en prise',             '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1',       'Rxd5'],
  ['mate in 1',                  '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1',       'Re8#'],
  ['middlegame',                 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10', null],
];
console.log('\n3 · Controls (depth 3): chosen move per mode');
let bad = 0;
for (const [name, fen, must] of CONTROLS) {
  let row = name.padEnd(28);
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen, dashDepth: 3, backup: mode });
    const best = res.thermo.moves[res.thermo.bestIdx];
    const ok = must == null || best === must;
    if (!ok) bad++;
    row += ((ok ? '' : '✗') + best).padStart(10);
  }
  console.log(row);
}
if (bad) { console.log(`${bad} control FAILURES`); process.exit(1); }
console.log('controls pass');

// ── 4 · Trébuchet: deep forced lines stay visible? ──────────
console.log('\n4 · Trébuchet (4 s), bestQ ♙ mover POV (certified loss; mean read −0.08 and died)');
for (const [name, fen] of [['wtm', '8/8/8/3Kp3/4Pk2/8/8/8 w - - 0 1'],
                           ['btm', '8/8/8/3Kp3/4Pk2/8/8/8 b - - 0 1']]) {
  let row = name.padEnd(5);
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 4000, backup: mode });
    const t = res.thermo;
    row += `${label(mode)}${(t.Qs[t.bestIdx] / 2).toFixed(2)} (T=${t.T.toFixed(1)} d${res.depth})   `;
  }
  console.log(row);
}

// ── 5 · Bath in decided positions (runaway probe, 3 s) ──────
console.log('\n5 · Bath in decided positions (3 s)');
for (const [name, fen] of [
  ['middlegame (balanced)', 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['crushed: R+B down',     '5rk1/pp3ppp/4p3/8/8/2NBPN2/PP3PPP/R2Q1RK1 b - - 0 14'],
]) {
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 3000, backup: mode });
    const t = res.thermo;
    console.log(name.padEnd(26) + label(mode) + t.T.toFixed(2).padStart(7) +
      '   ' + t.anneal.map(a => a.T.toFixed(1)).join(' → '));
  }
}
