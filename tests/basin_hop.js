// Basin-hopping truncation (opts.hop): the KINETIC use of the basin
// structure, after the static uses all lost to the free energy. Each
// interior node's dominant set is deduplicated by plan — one deep
// representative per basin inside the same 3T window; cohort-mates keep
// their shallow values in Z's tail; the top-two rule stands; values are
// touched nowhere. As T → 0 cohorts shrink to singletons and this IS
// the default truncation: the protocol leaves the equilibrium invariant.
// The saved width converts to depth through the deepening loop itself.
//
// Claims under test:
//   1. width actually saved (hopSkip / (hopFull+hopSkip) meaningful)
//   2. depth gained at fixed time on broad positions
//   3. decisions sane at fixed depth (dedup ≠ blindness); the Alekhine
//      cure, if it comes, comes THROUGH DEPTH at fixed time — the
//      fixed-depth F reference scan says which depth suffices
//   4. certifications unaffected (hop off = bit-identical; hop on =
//      still deterministic)
//
//   node tests/basin_hop.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

// ── 1 · Fixed-depth reference: when does F resolve the Alekhine? ──
console.log('1 · Fixed-depth F (no hop): Δ(d6−Nd5) by depth — where does depth alone cure it?');
for (const depth of [3, 4, 5]) {
  const E = fresh();
  const t0 = Date.now();
  const res = E._runAnalyze({ fen: alekhine, dashDepth: depth });
  const t = res.thermo;
  const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
  console.log(`   d${depth}: best=${t.moves[t.bestIdx].padEnd(5)} Δ=${(d >= 0 ? '+' : '')}${d.toFixed(2)}  ` +
    `nodes=${res.nodes}  ${(Date.now() - t0)} ms`);
}

// ── 2 · Width saved and depth bought (fixed depth, then fixed time) ──
console.log('\n2 · Same depth, fewer nodes (hop dedup factor); then same TIME, more depth');
const CASES = [
  ['startpos',    new E0.Chess().fen()],
  ['Alekhine',    alekhine],
  ['middlegame',  'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['fine70',      '8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1'],
];
console.log('   fixed depth 4:');
console.log('   position      mode  nodes      best    hopFull/hopSkip');
for (const [name, fen] of CASES) {
  for (const hop of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen, dashDepth: 4, hop });
    const t = res.thermo;
    console.log('   ' + name.padEnd(13) + (hop ? 'hop ' : 'off ').padEnd(6) +
      String(res.nodes).padEnd(11) + t.moves[t.bestIdx].padEnd(8) +
      (hop ? `${t.hopFull}/${t.hopSkip}` : ''));
  }
}
console.log('\n   fixed time 2000 ms:');
console.log('   position      mode  depth  nodes      best     T');
for (const [name, fen] of CASES) {
  for (const hop of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 2000, hop });
    const t = res.thermo;
    console.log('   ' + name.padEnd(13) + (hop ? 'hop ' : 'off ').padEnd(6) +
      String(res.depth).padEnd(7) + String(res.nodes).padEnd(11) +
      (res.san || t.moves[t.bestIdx]).padEnd(8) + t.T.toFixed(2));
  }
}

// ── 3 · The Alekhine at fixed time: does bought depth buy the cure? ──
console.log('\n3 · Alekhine at fixed time (values untouched — any cure is kinetic)');
console.log('   ms     mode  depth   best    Δ(d6−Nd5)');
for (const ms of [1000, 2000, 4000]) {
  for (const hop of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, timeLimit: ms, hop });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    console.log('   ' + String(ms).padEnd(7) + (hop ? 'hop ' : 'off ').padEnd(6) +
      String(res.depth).padEnd(7) + (res.san || t.moves[t.bestIdx]).padEnd(8) +
      ((d >= 0 ? '+' : '') + d.toFixed(2)));
  }
}

// ── 4 · Controls at fixed depth with hop on ─────────────────
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n4 · Controls (depth 3, hop on)');
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, hop: true });
  const best = res.thermo.moves[res.thermo.bestIdx];
  const ok = must == null || best === must;
  if (!ok) bad++;
  console.log('   ' + name.padEnd(18) + (ok ? '' : '✗') + best);
}
if (bad) { console.log(`${bad} control FAILURES`); process.exit(1); }
console.log('   controls pass');

// ── 5 · Determinism with hop on ─────────────────────────────
{
  const a = fresh()._runAnalyze({ fen: CASES[2][1], dashDepth: 4, hop: true }).thermo;
  const b = fresh()._runAnalyze({ fen: CASES[2][1], dashDepth: 4, hop: true }).thermo;
  const same = a.T === b.T && a.F === b.F && a.moves[a.bestIdx] === b.moves[b.bestIdx];
  console.log('\n5 · Determinism (two fresh instances, hop on): ' + (same ? 'PASS' : 'FAIL'));
  if (!same) process.exit(1);
}
