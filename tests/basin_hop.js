// Basin-hopping truncation (opts.hop) + root allocation (opts.alloc):
// the KINETIC uses of the basin structure, after the static uses all
// lost to the free energy. Values are touched nowhere by either knob;
// the width saved converts to depth through the deepening loop itself.
//
//   hop  — each interior node's dominant set is deduplicated by plan:
//          one deep representative per basin; cohort-mates keep their
//          shallow ranking values in Z's tail; top-two rule intact.
//   alloc — the scheduler brought inside the move: the root obeys the
//          same dominant-set truncation law as every interior node
//          (3T window, top two always, TRUNC_MAX cap) instead of
//          full-widthing all n children every iteration. Frozen
//          children keep their standing value in Z and feed no
//          thermometer sample (freshness-parity guard). With hop also
//          on, the live window is deduplicated by plan.
//
// ── v1 LADDER VERDICT (hop alone, negative, autopsied) ──
//   oracle: 0W 2L 10D, 31 blunders (F baseline: +2−1=9, 16) — the first
//     configuration of the whole program to LOSE games to the material
//     detector. A killer misranked 3rd+ that shared a (ranking-depth,
//     coarse) basin with a resolved sibling kept its optimistic shallow
//     value inside Z, and material got hung.
//   gauntlet: 5.5/12 vs 7.5 baseline, 6 mate losses.
//   the diagnosed feedback: hop → shallow-tail flapping → hotter bath
//     (mean T 19.2 vs 16.6 in play) → wider value cohorts (diameter =
//     live T) → MORE merging. The protocol heated the thermometer that
//     set the protocol's own coarse-graining scale.
//
// ── v2 (BUILT, under test here) ──
//   Two repairs, no new constants:
//   1. cohorts merge at the ZERO-POINT diameter T₀ (the lattice
//      quantum, fixed by the geometry tables) — the merge scale no
//      longer reads the thermometer at all, so the feedback is cut,
//      and only moves even a fully annealed search could not tell
//      apart are synonyms;
//   2. a move needs mk ≥ 4 census samples on its material-flow
//      coordinate to merge (the regime split's own counting
//      threshold): thinly measured killers stay singletons.
//   Root allocation is new in v2: the root was the one node exempt
//   from its own truncation law, and in a 30-move position most of
//   every iteration re-measured moves the bath had already resolved
//   as worse. The window is re-cut against the fresh leader every
//   iteration (a thawed child is re-measured), and a stale value can
//   never be argmax (it would have to rank top-two first, where it is
//   immediately re-searched).
//
// Claims under test:
//   1. width actually saved (hopFull/hopSkip; rootLive vs n)
//   2. depth gained at fixed time on broad positions (d4–d5 at 1–2 s
//      where the baseline reaches d3)
//   3. decisions sane at fixed depth (dedup ≠ blindness); the Alekhine
//      cure, if it comes, comes THROUGH DEPTH at fixed time
//   4. the bath does NOT run hotter under the protocol (the v1 disease)
//   5. certifications unaffected (all knobs off = bit-identical;
//      knobs on = still deterministic)
//
//   node tests/basin_hop.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

const CONFIGS = [
  ['off',      {}],
  ['hop',      { hop: true }],
  ['alloc',    { alloc: true }],
  ['hopalloc', { hop: true, alloc: true }],
];

// ── 1 · Fixed-depth reference: when does F resolve the Alekhine? ──
console.log('1 · Fixed-depth F (no knobs): Δ(d6−Nd5) by depth — where does depth alone cure it?');
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
console.log('\n2 · Same depth, fewer nodes; then same TIME, more depth');
const CASES = [
  ['startpos',    new E0.Chess().fen()],
  ['Alekhine',    alekhine],
  ['middlegame',  'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['fine70',      '8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1'],
];
console.log('   fixed depth 4:');
console.log('   position      mode      nodes      best    hopFull/hopSkip  rootLive');
for (const [name, fen] of CASES) {
  for (const [tag, o] of CONFIGS) {
    const E = fresh();
    const res = E._runAnalyze(Object.assign({ fen, dashDepth: 4 }, o));
    const t = res.thermo;
    console.log('   ' + name.padEnd(13) + tag.padEnd(10) +
      String(res.nodes).padEnd(11) + t.moves[t.bestIdx].padEnd(8) +
      (t.hopFull != null ? `${t.hopFull}/${t.hopSkip}` : '').padEnd(17) +
      (t.rootLive != null ? String(t.rootLive) : ''));
  }
}
console.log('\n   fixed time 1000 ms (the gauntlet budget), then 2000 ms:');
console.log('   ms    position      mode      depth  nodes      best     T     rootLive');
for (const ms of [1000, 2000]) {
  for (const [name, fen] of CASES) {
    for (const [tag, o] of CONFIGS) {
      const E = fresh();
      const res = E._runAnalyze(Object.assign({ fen, timeLimit: ms }, o));
      const t = res.thermo;
      console.log('   ' + String(ms).padEnd(6) + name.padEnd(13) + tag.padEnd(10) +
        String(res.depth).padEnd(7) + String(res.nodes).padEnd(11) +
        (res.san || t.moves[t.bestIdx]).padEnd(8) + t.T.toFixed(2).padEnd(7) +
        (t.rootLive != null ? String(t.rootLive) : ''));
    }
  }
}

// ── 3 · The Alekhine at fixed time: does bought depth buy the cure? ──
console.log('\n3 · Alekhine at fixed time (values untouched — any cure is kinetic)');
console.log('   ms     mode      depth   best    Δ(d6−Nd5)');
for (const ms of [1000, 2000, 4000]) {
  for (const [tag, o] of CONFIGS) {
    const E = fresh();
    const res = E._runAnalyze(Object.assign({ fen: alekhine, timeLimit: ms }, o));
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    console.log('   ' + String(ms).padEnd(7) + tag.padEnd(10) +
      String(res.depth).padEnd(7) + (res.san || t.moves[t.bestIdx]).padEnd(8) +
      ((d >= 0 ? '+' : '') + d.toFixed(2)));
  }
}

// ── 4 · Controls at fixed depth with the knobs on ─────────────────
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n4 · Controls (depth 3, each knob combination)');
for (const [name, fen, must] of CONTROLS) {
  for (const [tag, o] of CONFIGS.slice(1)) {
    const E = fresh();
    const res = E._runAnalyze(Object.assign({ fen, dashDepth: 3 }, o));
    const best = res.thermo.moves[res.thermo.bestIdx];
    const ok = must == null || best === must;
    if (!ok) bad++;
    console.log('   ' + name.padEnd(18) + tag.padEnd(10) + (ok ? '' : '✗') + best);
  }
}
if (bad) { console.log(`${bad} control FAILURES`); process.exit(1); }
console.log('   controls pass');

// ── 5 · Determinism with the knobs on ─────────────────────────────
{
  const a = fresh()._runAnalyze({ fen: CASES[2][1], dashDepth: 4, hop: true, alloc: true }).thermo;
  const b = fresh()._runAnalyze({ fen: CASES[2][1], dashDepth: 4, hop: true, alloc: true }).thermo;
  const same = a.T === b.T && a.F === b.F && a.moves[a.bestIdx] === b.moves[b.bestIdx];
  console.log('\n5 · Determinism (two fresh instances, hop+alloc on): ' + (same ? 'PASS' : 'FAIL'));
  if (!same) process.exit(1);
}
