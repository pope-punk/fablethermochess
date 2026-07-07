// The quenched premium (backup: 'quenched') — case-study probes.
//
// DERIVATION (July 2026). F = T·ln Z is the ANNEALED free energy of
// the move ensemble: under the project's own Gumbel reading (the
// winner's-curse identity), F is the expected max over options with
// INDEPENDENT value noise. But the opponent's killer refutation is not
// a thermal fluctuation — it is a frozen fact about the position:
// QUENCHED disorder. Thirty moves that are all fine iff the opponent
// declines one killer are thirty spins riding one disorder
// realization; Jensen says the annealed average overestimates, and
// that gap is the self-indulgence disease term for term. Five
// subtractive recounts in a row died because deleting microstates
// deletes the danger sense with the overcount; physics fixes
// correlation by evaluating the log in the right place instead. For
// Gumbel noise the quenched expected max has an exact closed form —
// the nested/GEV partition function:
//     V = T·ln Σ_g e^{F_g/T},   F_g = μT·ln Σ_{a∈g} e^{Q_a/μT}
// with g the measured reply partition (per node, already tagged) and
// μ = √λ̂ — λ̂ being the v3 independence instrument, by definition the
// independent-variance share of the premium's noise (variance → scale
// gives the square root; a derivation, not a tuning). μ = 1 recovers
// F exactly; μ → 0 recovers the effective-multiplicity premium
// exactly: F and effS are the two poles of one family and the
// interpolation is MEASURED. λ̂ acts as an ensemble parameter (a
// temperature ratio — rule 3's legal category); maxQ ≤ V ≤ F always,
// so the menu-collapse gradient survives by construction. The
// mechanism is self-measuring: LAMBDA_LIVE starts at 1 (unmeasured =
// undeflated), damps toward the root λ̂ each iteration, persists
// across moves within a game (reset per game like Ĵ and the bite).
//
// Pre-registered predictions:
//   P1. Trap-family positions (λ̂ ≈ 0.6): the interior premium of
//       hedge lines deflates; Δ(d6−Nd5) on the Alekhine shrinks vs F
//       at equal depth, and the pinT flip temperature T* — currently
//       AT the zero-point floor (≈1.0), i.e. unreachable by honest
//       cooling — should RISE toward reachable temperatures.
//   P2. Sound/middlegame positions (λ̂ ≈ 0.9): nearly unchanged
//       (μ ≈ 0.95 — the premium survives where independence is real).
//   P3. The endgame gate (fine70 argmax playout) still converts: the
//       within-group premium is reduced, never zeroed, and values are
//       untouched — unlike exK-z, which lost this position outright.
//   P4. Controls (Rxd5 / mate-in-1 / trap dxe5) unchanged; deterministic.
//   P5. Oracle: material soundness kept (V ≥ maxQ anchors the danger
//       sense; this is not a premium removal).
//
//   node tests/quenched_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

// ── 1 · The Alekhine decision vs depth, F vs quenched ──
console.log('1 · Alekhine Δ(d6−Nd5) by depth (fresh engine per cell; λ̂ self-measured)');
console.log('   depth   F: best Δ        quenched: best Δ      λ̂_live at end');
for (const depth of [3, 4]) {
  const row = [];
  let lam = null;
  for (const backup of [undefined, 'quenched']) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, backup });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    row.push(t.moves[t.bestIdx].padEnd(5) + ' ' + ((d >= 0 ? '+' : '') + d.toFixed(2)).padEnd(7));
    if (backup) lam = t.lamHat;
  }
  console.log('   d' + depth + '      ' + row[0] + '      ' + row[1] + '       ' +
    (lam != null ? lam.toFixed(2) : '—'));
}

// ── 2 · The flip temperature (pinT scan): can honest cooling now cure it? ──
// The disease's sharpest statement: the decision flips only at
// T* ≈ 1.0 = the zero-point floor. If the quenched premium raises T*,
// deeper honest search (which cools toward the floor) can resolve it.
console.log('\n2 · pinT scan at depth 3: argmax (d6 = blunder) — F vs quenched');
console.log('   pinT    F        quenched');
for (const pinT of [1.0, 1.5, 2.0, 3.0, 4.0]) {
  const row = [];
  for (const backup of [undefined, 'quenched']) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: 3, pinT, backup });
    row.push(res.thermo.moves[res.thermo.bestIdx].padEnd(8));
  }
  console.log('   ' + pinT.toFixed(1).padEnd(8) + row[0] + ' ' + row[1]);
}

// ── 3 · λ̂_live across position types (P2: deflation lands where measured) ──
console.log('\n3 · λ̂ (root instrument, quenched run, depth 4)');
const CASES = [
  ['trap line',   fenAfter(['e4','Nf6','e5','d6','Nf3'])],
  ['sound line',  fenAfter(['e4','Nf6','e5','Nd5','d4'])],
  ['middlegame',  'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['startpos',    new E0.Chess().fen()],
];
for (const [name, fen] of CASES) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 4, backup: 'quenched' });
  console.log('   ' + name.padEnd(13) + 'λ̂=' + (res.thermo.lamHat != null ? res.thermo.lamHat.toFixed(2) : '—') +
    '  best=' + res.thermo.moves[res.thermo.bestIdx]);
}

// ── 4 · Controls ──
const CONTROLS = [
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
  ['mate in 1',      '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['trap line',      fenAfter(['e4','Nf6','e5','d6','Nf3']), null],
];
let bad = 0;
console.log('\n4 · Controls (depth 3, quenched)');
for (const [name, fen, must] of CONTROLS) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: 3, backup: 'quenched' });
  const best = res.thermo.moves[res.thermo.bestIdx];
  const ok = must == null || best === must;
  if (!ok) bad++;
  console.log('   ' + name.padEnd(18) + (ok ? '' : '✗') + best);
}
if (bad) { console.log(bad + ' control FAILURES'); process.exit(1); }
console.log('   controls pass');

// ── 5 · The endgame gate: fine70 argmax self-playout (killed exK-z) ──
{
  const E = fresh();
  const g = new E0.Chess('8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1');
  let keys = [g.fast_hash()], plies = 0;
  while (!g.game_over() && plies < 160) {
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: 400, pastKeys: keys.slice(0, -1), backup: 'quenched' });
    if (!res.san) break;
    const mv = g.move(res.san);
    if (!mv) break;
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
    plies++;
  }
  const out = g.in_checkmate() ? (g.fast_turn() === 'b' ? 'WHITE WINS by mate' : 'BLACK wins by mate — GATE FAILED')
            : g.game_over() ? 'draw — GATE FAILED' : 'undecided';
  console.log('\n5 · fine70 self-playout (quenched): ' + out + ' (' + plies + ' plies, first ' + g.history()[0] + ')');
}

// ── 6 · Determinism ──
{
  const fen = CASES[2][1];
  const a = fresh()._runAnalyze({ fen, dashDepth: 4, backup: 'quenched' }).thermo;
  const b = fresh()._runAnalyze({ fen, dashDepth: 4, backup: 'quenched' }).thermo;
  console.log('\n6 · Determinism (quenched): ' + (a.T === b.T && a.F === b.F ? 'PASS' : 'FAIL'));
  if (a.T !== b.T || a.F !== b.F) process.exit(1);
}
