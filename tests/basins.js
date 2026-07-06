// The basin instrument: partition the root ensemble into strategic
// cohorts ("plans") by inherent structure — value cohorts at the bath's
// own resolution T, split by measured census material flow (gap > one
// pawn) and initiative regime (β against its own counting error). The
// premise under test: "thirty ways to lose a knight" are ONE basin, so
// strategic multiplicity S_b, not move multiplicity S, is the honest
// count — and the decision gap that should gate the scheduler is the
// distance to the nearest genuinely DIFFERENT plan.
//
// Predictions:
//   - trap line: knight-losing moves cohabit one basin; S_b ≪ S;
//     basin count small
//   - sound/middlegame: more basins (genuinely different plans)
//   - queen en prise: ~2 basins (take it / everything else)
//   - basin count REFINES as the bath cools (anneal trace)
//   - scheduler: on cohort-degenerate decisions the top-two MOVES share
//     a basin, so the basin gap ≫ move gap → basin clock banks time
//
// MEASURED (depth 4, after the diameter-cap repair — v1 single-linkage
// CHAINED: 29/30 trap moves incl. the defender in one basin, autopsied
// in the git history):
//   - trap line: {dxe5, Ng4} — exactly the two moves that deal with the
//     e5 threat — form their own basin (mass 0.27), against an 18-move
//     and a 9-move knight-loser basin. 27 ways to lose a knight = 2
//     basins. S_b = 0.97 vs S = 3.10.
//   - S_b orders trap (0.97) < sound (0.98) ≈ startpos... the ordering
//     of strategic multiplicity is carried by exp(S_b), not the raw
//     basin count (which counts zero-mass singletons).
//   - scheduler: with the depth ≥ 3 guard (an unguarded depth-2 basin
//     freeze changed the move — e6 for Nc6 at 40 ms, the first
//     schedule-A/B disease in new clothes), no decision changes on any
//     case; startpos banks ~0.4 s on the same move. A/B vs the 9/12
//     schedule baseline: results/vs_sf1500_basinsched.json.
//
//   node tests/basins.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }

const CASES = [
  ['startpos',                       new E0.Chess().fen()],
  ['Alekhine root (d6?? vs Nd5)',    fenAfter(['e4','Nf6','e5'])],
  ['trap line (Black; N hangs)',     fenAfter(['e4','Nf6','e5','d6','Nf3'])],
  ['sound line (after Nd5 3.d4)',    fenAfter(['e4','Nf6','e5','Nd5','d4'])],
  ['middlegame (many plans)',        'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['queen en prise (one idea)',      '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1'],
];

// ── 1 · Basin structure per position (depth 4) ──────────────
console.log('1 · Basin structure (depth 4)');
console.log('position'.padEnd(34) + '  n_mv   S     S_b  basins  ΔQ12  Δbasins  top2 same basin?');
const detail = {};
for (const [name, fen] of CASES) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 4 });
  const t = res.thermo;
  detail[name] = t;
  const ord = t.Qs.map((q, i) => i).sort((a, b) => t.Qs[b] - t.Qs[a]);
  const same2 = t.basinOf && ord.length > 1 && t.basinOf[ord[0]] === t.basinOf[ord[1]];
  const dq12 = ord.length > 1 ? t.Qs[ord[0]] - t.Qs[ord[1]] : null;
  console.log(name.padEnd(34) +
    String(t.moves.length).padStart(5) +
    t.S.toFixed(2).padStart(7) +
    t.Sbasin.toFixed(2).padStart(6) +
    String(t.nBasins).padStart(7) +
    (dq12 != null ? dq12.toFixed(2) : '—').padStart(7) +
    (t.gapB != null ? t.gapB.toFixed(2) : '—').padStart(8) +
    ('  ' + (same2 ? 'YES' : 'no')));
}

// ── 2 · Who lives with whom: the trap position's basins ─────
console.log('\n2 · Trap-line basins (do the knight-losers cohabit?)');
{
  const t = detail['trap line (Black; N hangs)'];
  const groups = new Map();
  for (let i = 0; i < t.moves.length; i++) {
    const b = t.basinOf[i];
    if (!groups.has(b)) groups.set(b, []);
    groups.get(b).push({ m: t.moves[i], q: t.Qs[i], p: t.probs[i] });
  }
  const gs = [...groups.entries()].map(([b, ms]) => ({
    b, ms, mass: ms.reduce((s, x) => s + x.p, 0), qb: Math.max(...ms.map(x => x.q)) }));
  gs.sort((a, b) => b.mass - a.mass);
  for (const g of gs) {
    if (g.mass < 0.01 && g.ms.length < 2) continue;
    console.log(`   basin (mass ${g.mass.toFixed(2)}, bestQ ${g.qb.toFixed(2)}, ${g.ms.length} moves): ` +
      g.ms.sort((a, b) => b.q - a.q).map(x => x.m).join(' '));
  }
}

// ── 3 · Cooling refines the basin structure (anneal trace) ──
console.log('\n3 · Basin refinement under cooling (middlegame, depth per iteration)');
{
  const t = detail['middlegame (many plans)'];
  console.log('   ' + t.anneal.map(a => `d${a.d}: T=${a.T.toFixed(2)} basins=${a.nb != null ? a.nb : '—'}`).join('  ·  '));
}

// ── 4 · The scheduler marriage: move gap vs basin gap ───────
// Where the top two moves share a basin, the basin clock sees a larger
// decision gap and freezes earlier — banking time that funds genuine
// strategic forks. Timed runs (2 s base), schedule vs basinSched.
console.log('\n4 · Scheduler: σ_eff freeze — move gap vs basin gap (2 s base)');
console.log('position'.padEnd(34) + 'clock        move    stop      ms   depth');
for (const [name, fen] of CASES) {
  for (const mode of [{ schedule: true }, { schedule: true, basinSched: true }]) {
    const E = fresh();
    const res = E._runAnalyze(Object.assign({ fen, timeLimit: 2000, flux: 'measure' }, mode));
    const t = res.thermo;
    console.log(name.padEnd(34) + (mode.basinSched ? 'basin' : 'move ').padEnd(10) +
      (res.san || t.moves[t.bestIdx]).padEnd(8) +
      String(t.stop || 'deadline').padEnd(9) +
      String(res.timeMs).padStart(5) + String(res.depth).padStart(6));
  }
}
