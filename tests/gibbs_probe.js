// The Gibbs leaf (opts.gibbs) — case-study probes.
//
// THE PARADIGM SHIFT (July 2026, owner's directive). The measured law
// (sigma_probe.js) closed the deflation program: the interior premium
// is load-bearing at its uncorrected size because its FUNCTION in play
// is strategic pressure, not thermal optimism. The Gibbs move does not
// subtract it — it RECLASSIFIES the leaf's accounting:
//     Helmholtz leaf:  F = U + T·(lnW_us − lnW_them)
//     Gibbs leaf:      G = U + P·lnW_us − T·lnW_them,   P = T₀
//   · Opponent optionality alone pays the measured thermal price —
//     their freedom is genuinely our forecast noise. The danger sense
//     and the cornering gradient now own the whole T dial.
//   · Our activity is priced as ZERO-POINT PRESSURE work: a quantum
//     gas at T → 0 keeps degeneracy pressure set by its level spacing,
//     and the lattice quantum T₀ is already derived from geometry.
//     Strategic drive that survives convergence is degeneracy
//     pressure. P is geometry — not an instrument (rule 3: μ̄/β/T̂c as
//     energies died three times).
//   · Roles are ROOT-ANCHORED (us = the deliberating side, as the μ
//     census already does): with P ≠ T a mover-alternating form
//     carries a parity-flipping symmetric component — the exact
//     disease that executed the one-sided tempo charges (rule 4).
//   · CORRESPONDENCE: at T = T₀ the Gibbs and Helmholtz leaves are
//     identical; they diverge only as the bath heats, and the
//     divergence is precisely the self-indulgence channel (hot baths
//     currently inflate the worth of our own shuffling).
//   · The interior premium is untouched at the full bath T — the
//     measured law is respected.
//
// Pre-registered predictions:
//   P1. Alekhine: d6's line opens the position (lnW_them grows) while
//       its own-mobility reward is capped at T₀ — Δ(d6−Nd5) shrinks;
//       cure plausible but not promised at d3–d4.
//   P2. Self-indulgence channel: hot positions stop rewarding our
//       shuffling — early queen-move rate should not exceed baseline;
//       in decided positions the −T·lnW_them term turns runaway heat
//       into a CORNERING gradient (mate-seeking), so fine70 should
//       convert at least as fast as baseline (53 plies), and the
//       trébuchet/zugzwang certification must hold (T there sits at
//       the floor where Gibbs ≡ Helmholtz).
//   P3. Controls, determinism, invariance, suite: pass (honest play
//       bit-identical with the knob off).
//   P4. Oracle: activity-to-material conversion is the open risk (our
//       activity earns less at hot baths — does the engine still
//       convert edges?); the detector decides.
//
// ── LADDER VERDICT AT SF-1500 (negative — and the meta-law, July 2026) ──
//   probes: Alekhine CURED at d4 (Nd5, Δ −0.31) with the interior
//     premium fully intact; fine70 converts faster (45 plies); all
//     certifications green.
//   oracle: +3−3=6 tied (borderline pass; draws swindled from −2810,
//     −1500, −1410; blunders 24 vs 16).
//   gauntlet: 3.5/12 vs the 7.5 baseline (W3 D1 L8, 8 mate losses,
//     two mated-while-ahead at +210/+690). The autopsy FALSIFIES the
//     mechanism's own theory in the field: early queen moves went UP
//     (3.17/game vs 2.25 — the indulgence lives in the interior
//     premium, deliberately untouched), and the runaway share DOUBLED
//     (8.6% at T>20): the asymmetric leaf is UNBOUNDED at runaway
//     temperatures — T·lnW_them ≈ 95 units at T=28 against a frozen
//     T₀·lnW_us ≈ 3.4 — so hot positions become opponent-mobility-
//     phobic and the thermometer feeds on the swings. A bounded
//     them-price might repair this, but is not obviously derivable
//     without tuning; recorded, unbuilt.
//   THE META-LAW (three-for-three): every Alekhine cure — premium
//     removal (mean 3.5), premium-by-resolution (sigma 3.5), leaf
//     exchange-rate with premium intact (gibbs 3.5) — scores exactly
//     3.5/12 at SF-1500/1s, regardless of mechanism. Whatever makes
//     the engine decline d6 also makes it lose these games: T-scaled
//     optionality-seeking is NET-POSITIVE at these stakes, and the
//     Alekhine is its tail risk — the premium's insurance cost. This
//     reframes the cure program as an OPERATING-POINT question: the
//     cures' value should be retested where the baseline collapses
//     (the SF-1600 cliff, baseline 1/12) — vs_sf1600_gibbs.json.
//
//   node tests/gibbs_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

// ── 1 · Alekhine, F vs Gibbs ──
console.log('1 · Alekhine Δ(d6−Nd5), F vs gibbs');
for (const depth of [3, 4]) {
  const row = [];
  for (const gibbs of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, gibbs });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    row.push((gibbs ? 'gibbs' : 'F').padEnd(6) + ' best=' + t.moves[t.bestIdx].padEnd(5) +
      ' Δ=' + ((d >= 0 ? '+' : '') + d.toFixed(2)).padEnd(6));
  }
  console.log('   d' + depth + ':  ' + row.join(' | '));
}

console.log('\n2 · pinT scan d3 (argmax; d6 = the blunder)');
for (const pinT of [1.0, 1.5, 2.0, 3.0]) {
  const row = [];
  for (const gibbs of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: 3, pinT, gibbs });
    row.push(res.thermo.moves[res.thermo.bestIdx].padEnd(6));
  }
  console.log('   pinT=' + pinT.toFixed(1) + '  F: ' + row[0] + ' gibbs: ' + row[1]);
}

// ── 3 · Controls ──
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n3 · Controls (depth 3, gibbs)');
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, gibbs: true });
  const best = res.thermo.moves[res.thermo.bestIdx];
  const ok = must == null || best === must;
  if (!ok) bad++;
  console.log('   ' + name.padEnd(18) + (ok ? '' : '✗') + best);
}
if (bad) { console.log(bad + ' control FAILURES'); process.exit(1); }
console.log('   controls pass');

// ── 4 · The endgame gate + the conversion prediction ──
{
  const E = fresh();
  const g = new E0.Chess('8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1');
  let keys = [g.fast_hash()], plies = 0;
  while (!g.game_over() && plies < 160) {
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: 400, pastKeys: keys.slice(0, -1), gibbs: true });
    if (!res.san) break;
    const mv = g.move(res.san);
    if (!mv) break;
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
    plies++;
  }
  const out = g.in_checkmate() ? (g.fast_turn() === 'b' ? 'WHITE WINS by mate' : 'BLACK wins by mate — GATE FAILED')
            : g.game_over() ? 'draw — GATE FAILED' : 'undecided';
  console.log('\n4 · fine70 self-playout (gibbs): ' + out + ' (' + plies + ' plies, first ' + g.history()[0] + ', baseline 53)');
}

// ── 5 · The king-march position (+1010 game, ply 50): does Gibbs sit still? ──
{
  const G = require('./results/vs_sf1500_guard.json');
  const eng = G.games.find(x => x.opening === 'English (reversed Sicilian)' && x.engineIsWhite);
  const g = new E0.Chess();
  for (const m of eng.line) g.move(m);
  for (const m of eng.moves.slice(0, 50)) g.move(m);
  for (const gibbs of [false, true]) {
    const E = fresh();
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: 1000, gibbs });
    console.log((gibbs ? '5 · king-march gibbs: ' : '5 · king-march F:     ') + 'plays=' + res.san + ' d=' + res.depth);
  }
}

// ── 6 · Determinism ──
{
  const fen = 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10';
  const a = fresh()._runAnalyze({ fen, dashDepth: 4, gibbs: true }).thermo;
  const b = fresh()._runAnalyze({ fen, dashDepth: 4, gibbs: true }).thermo;
  console.log('\n6 · Determinism (gibbs): ' + (a.T === b.T && a.F === b.F ? 'PASS' : 'FAIL'));
  if (a.T !== b.T || a.F !== b.F) process.exit(1);
}
