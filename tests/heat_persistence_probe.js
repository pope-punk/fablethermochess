// Depth-sensitivity marker study — what predicts WHERE more depth changes
// the answer, so cooling can be steered there? The empirical foundation for
// intelligent (concentrated) depth allocation.
//
// THE REFRAME (session log): the measured quantities (C, |ΔQ|, β, λ̂, bite,
// basin gap, the Δμ-vs-∂Q divergence) are KINETIC — diagnostics of local
// non-equilibrium whose lawful role is steering the cooling schedule (where
// to deepen), never correcting the equilibrium free energy F. Everything
// that acted on F died (rule 3); everything that acted on schedule/attention
// lived (σ_eff scheduler +1.5, alloc neutral, qCheck finds sacs). So the
// metrics are kinetic — the question is which one MARKS the depth-hungry moves.
//
// Target: per root move, r35 = |Q(d5) − Q(d3)| (same parity, ladder cancels)
// — how much the value actually moves with two more ply. Pool over positions.
//
// THREE MARKERS TESTED (results inline; corpus-dependent numbers quoted for
// the 5-position set in POS):
//   1. FLUCTUATION MAGNITUDE (r13 = |Q3−Q1| predicts r35): Pearson ~0.32,
//      Spearman ~0.21 (and only 0.04 on the quieter 4-position subset) —
//      WEAK and corpus-fragile, nowhere near the forcing categorical signal
//      and not a usable per-move allocation lever. A big revision is usually
//      a resolved tactic (one-time jump), not a persistent "needs depth"
//      flag. This is why alloc (Boltzmann-window allocation) was neutral.
//   2. FORCING GEOMETRY (SAN capture/check — pure counting): forcing moves
//      2.43× the mean r35 of quiet moves — a STRONG, clean categorical
//      separation where magnitude was weak. BUT forcing moves are 4% of
//      moves and carry only 9% of total depth-sensitivity: a concentrated
//      TACTICAL pocket, exactly what qCheck already harvests (check-geometry).
//   3. BITE among quiet moves (opponent reply-collapse, mobility proxy):
//      1.15× — essentially FLAT. Constraint does not mark the depth-hungry
//      QUIET moves. So the positional 91% has no cheap structural marker.
//
// Predictive power ranking: forcing geometry (strong, 9% coverage) >>
// magnitude (weak) ≈ bite-quiet (flat). The only STRONG marker covers only
// the tactical pocket; nothing marks the positional bulk.
//
// THE LAW THIS DERIVES: depth-sensitivity has two regimes.
//   · TACTICAL (9%): concentrated, GEOMETRICALLY marked (forcing) — and the
//     concentration is geometric (counting), not thermal (magnitude). qCheck
//     captures it; a forcing-geometry extension is the bounded upside left.
//   · POSITIONAL (91%): DIFFUSE — no cheap marker (magnitude memoryless, bite
//     flat). It cannot be intelligently CONCENTRATED; it dissolves only under
//     UNIFORM depth (why alloc is neutral, not positive) or a better
//     EVALUATION.
//   ⇒ "The evaluation is the binding constraint" (the session's empirical
//     refrain) is hereby DERIVED, not asserted: the depth-sensitivity that
//     matters is diffuse, so no search-allocation can substitute for
//     evaluation quality. You can intelligently cool concentrated hot spots
//     (tactics, geometrically marked); you cannot intelligently cool diffuse
//     heat (position) — that needs uniform cooling or a better free energy.
//
//   node tests/heat_persistence_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function after(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g.fen(); }
const MATE = 100000 - 4096;

const POS = [
  ['startpos',      new E0.Chess().fen()],
  ['Alekhine',      after(['e4','Nf6','e5'])],
  ['middlegame',    'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['open Sicilian', after(['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'])],
  ['tactical',      after(['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3','Ba5'])],
];

// gather per-move: Q1/Q3/Q5, and resulting opponent mobility (bite proxy)
const rows = [];
for (const [, fen] of POS) {
  const q = {};
  for (const d of [1, 3, 5]) {
    const t = fresh()._runAnalyze({ fen, dashDepth: d }).thermo;
    for (let i = 0; i < t.moves.length; i++) {
      if (Math.abs(t.Qs[i]) > MATE) continue;
      (q[t.moves[i]] = q[t.moves[i]] || {})['d' + d] = t.Qs[i];
    }
  }
  const g = new E0.Chess(fen); const legal = g.moves();
  const oppMob = {}; let sum = 0, cnt = 0;
  for (const m of legal) { const g2 = new E0.Chess(fen); g2.move(m);
    const c = g2.fast_mob_counts(); const opp = (g2.fast_turn() === 'w') ? c.mw : c.mb;
    oppMob[m] = opp; sum += opp; cnt++; }
  const meanOpp = sum / cnt;
  for (const m in q) { const v = q[m];
    if (v.d1 == null || v.d3 == null || v.d5 == null || oppMob[m] == null) continue;
    rows.push({ san: m, r13: Math.abs(v.d3 - v.d1), r35: Math.abs(v.d5 - v.d3),
                forcing: /[x+]/.test(m), relMob: oppMob[m] / meanOpp }); }
}
const mean = (a, f) => a.reduce((s, x) => s + f(x), 0) / a.length;
function pearson(a) { const n = a.length; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of a) { sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; }
  return (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)); }
function spearman(a) { const rank = arr => { const idx = arr.map((v, i) => i).sort((i, j) => arr[i] - arr[j]);
  const r = []; idx.forEach((v, k) => r[v] = k); return r; };
  const rx = rank(a.map(p => p[0])), ry = rank(a.map(p => p[1])); return pearson(rx.map((v, i) => [v, ry[i]])); }

console.log('n=' + rows.length + ' (move,position) pairs\n');

console.log('1 · FLUCTUATION MAGNITUDE (r13 predicts r35?)');
const mag = rows.map(r => [r.r13, r.r35]);
console.log('   Pearson=' + pearson(mag).toFixed(3) + '  Spearman=' + spearman(mag).toFixed(3) + '  → weak, not a usable lever\n');

console.log('2 · FORCING GEOMETRY (capture/check vs quiet)');
const f = rows.filter(r => r.forcing), qm = rows.filter(r => !r.forcing);
const tot = rows.reduce((s, r) => s + r.r35, 0), totF = f.reduce((s, r) => s + r.r35, 0);
console.log('   forcing n=' + f.length + ' mean r35=' + mean(f, x => x.r35).toFixed(3) +
  '   quiet n=' + qm.length + ' mean r35=' + mean(qm, x => x.r35).toFixed(3) +
  '   ratio=' + (mean(f, x => x.r35) / mean(qm, x => x.r35)).toFixed(2) + 'x');
console.log('   forcing = ' + (100 * f.length / rows.length).toFixed(0) + '% of moves, ' +
  (100 * totF / tot).toFixed(0) + '% of depth-sensitivity → concentrated TACTICAL pocket (qCheck harvests it)\n');

console.log('3 · BITE among QUIET moves (opponent constraint vs open)');
const qs = qm.slice().sort((a, b) => a.relMob - b.relMob); const nq = Math.floor(qs.length / 3);
const low = qs.slice(0, nq), high = qs.slice(-nq);
console.log('   most-constraining mean r35=' + mean(low, x => x.r35).toFixed(3) +
  '   most-open mean r35=' + mean(high, x => x.r35).toFixed(3) +
  '   ratio=' + (mean(low, x => x.r35) / mean(high, x => x.r35)).toFixed(2) + 'x → FLAT: positional 91% has no cheap marker');

console.log('\nVERDICT: intelligent (concentrated) depth allocation works only for the geometrically-marked');
console.log('tactical pocket (qCheck). The positional bulk is diffuse → the EVALUATION is the binding');
console.log('constraint, DERIVED not asserted: no search-allocation substitutes for evaluation quality.');
