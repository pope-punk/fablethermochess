// Backup-form decomposition: WHAT the search backs up, with the ensemble
// held fixed. Under the Gumbel reading of the softmax, the free energy
//     F = T·ln Z = E[ max_a (Q_a + T·G_a) ],  G_a i.i.d. Gumbel,
// is the value a chooser with value noise T ESTIMATES its best option is
// worth, while ⟨Q⟩_π = Σ π_a Q_a is what that chooser actually ACHIEVES
// (it picks a with probability π_a and collects Q_a). The identity
//     F − ⟨Q⟩_π = T·S
// says the interior choice premium is, term for term, the optimizer's own
// estimation bias — the winner's curse of trusting argmax under noise.
// The self-indulgence decomposition (t_decompose.js) convicted exactly
// this term on our own nodes (~3.75 of the Alekhine swing).
//
// The forms bracket the truth about future sibling revisions:
//   ''        F backup — revisions independent: full premium (current)
//   'mean'    ⟨Q⟩_π — no future re-choice: the quantal-response game value
//   'mean-us' ⟨Q⟩_π at OUR nodes, F at the opponent's (asymmetric probe;
//             caveat: the truncation tail mixes backup forms across one Z)
//   'max'     revisions common-mode: premium cancels in every comparison
//
// MEASURED (depth 3/4, live bath): 'mean' and 'max' both cure the
// Alekhine blunder at every temperature (F: +0.48 toward d6 at depth 4;
// mean: −1.59; max: −3.43) with all tactical controls intact. 'mean-us'
// convicts itself before any match: the asymmetric backup is a one-sided
// entropy ladder, and the thermometer reads it as heat (T → 7.1 at depth
// 4) — the parity rule applies to backup forms, not just charges. The
// runaway and trébuchet probes (§4, §5 below) then split 'mean' and
// 'max': 'mean' tames the interior share of thermal runaway but erases
// deep forced lines (opponent-mixing discounts certainty geometrically);
// 'max' keeps them. Strength adjudication: oracle matches + gauntlet
// ('meanback' / 'maxback' modes in vs_stockfish.js, 'cur:mean' in
// match.js).
//
//   node tests/backup_forms.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }

const MODES = ['', 'mean', 'mean-us', 'max'];
const label = m => (m === '' ? 'F' : m).padEnd(8);

// ── 1 · The Alekhine decision at the live bath ──────────────
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);
console.log('1 · Alekhine decision (live bath): d6 vs Nd5 at', alekhine);
console.log('mode      depth    best        Δ(d6−Nd5)      T     nodes');
for (const depth of [3, 4]) {
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, backup: mode });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    console.log(label(mode) + String(depth).padStart(4) +
      ('    ' + t.moves[t.bestIdx]).padEnd(12) +
      ((d >= 0 ? '+' : '') + d.toFixed(2)).padStart(10) +
      t.T.toFixed(2).padStart(9) + String(res.nodes).padStart(10));
  }
}

// ── 2 · Counterfactual-T crossing per form (the t_crossing scan) ──
console.log('\n2 · pinT scan, Δ(d6−Nd5) at depth 3 (positive = blunder preferred):');
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

// ── 3 · Control decisions (no form may break these) ────────
const CONTROLS = [
  ['startpos',                      new E0.Chess().fen(),                                    null],
  ['trap line (Black; N hangs)',    fenAfter(['e4','Nf6','e5','d6','Nf3']),                  null],
  ['queen en prise (must take)',    '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1',                     'Rxd5'],
  ['mate in 1 (must play Re8#)',    '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1',                     'Re8#'],
  ['middlegame (sane move)',        'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10', null],
];
console.log('\n3 · Controls (live bath, depth 3): chosen move per form');
console.log('position'.padEnd(32) + MODES.map(m => label(m).padStart(10)).join(''));
let failures = 0;
for (const [name, fen, must] of CONTROLS) {
  let row = name.padEnd(32);
  for (const mode of MODES) {
    const E = fresh();
    const res = E._runAnalyze({ fen, dashDepth: 3, backup: mode });
    const best = res.thermo.moves[res.thermo.bestIdx];
    const ok = must == null || best === must;
    if (!ok) failures++;
    row += ((ok ? '' : '✗') + best).padStart(10);
  }
  console.log(row);
}
if (failures) { console.log(`\n${failures} control FAILURES`); process.exit(1); }
console.log('\nall controls passed');

// ── 4 · Thermal-runaway probe: is the amplification interior? ──
// The runaway loop is T·S feedback into the thermometer. 'mean' removes
// the interior premium; the leaf T·ΔlnW back-reaction remains. Measured
// (3 s think): in a crushed position F's bath runs 1.5 → 5.7 while
// 'mean' holds 1.2 — most of the amplification is the interior premium.
console.log('\n4 · Bath in decided positions (3 s think)');
const DECIDED = [
  ['middlegame (balanced)', 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['crushed: R+B down',     '5rk1/pp3ppp/4p3/8/8/2NBPN2/PP3PPP/R2Q1RK1 b - - 0 14'],
];
console.log('position'.padEnd(26) + 'form    T_final  anneal trace');
for (const [name, fen] of DECIDED) {
  for (const mode of ['', 'mean']) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 3000, backup: mode });
    const t = res.thermo;
    console.log(name.padEnd(26) + label(mode) + t.T.toFixed(2).padStart(7) +
      '   ' + t.anneal.map(a => a.T.toFixed(1)).join(' → '));
  }
}

// ── 5 · The trébuchet: deep forced lines per form ───────────
// The certified mutual zugzwang (zugzwang.js) is a full-point loss for
// the mover ~40 plies from conversion. Measured (4 s): F carries the
// loss in its Q values (≈ −3.3♙; only the premium washes it out), 'max'
// reads a definite loss signal, but 'mean' erases it (≈ −0.08): QRE
// averaging mixes the opponent's suboptimal replies at every ply, so a
// deep forced loss is discounted geometrically (~π^d). 'mean' sees
// 1-ply punishments at weight π and 40-ply certainties not at all —
// opponent-mixing is the wrong model exactly where play is forced.
console.log('\n5 · Trébuchet visibility (4 s think), bestQ in ♙ (mover POV; certified loss)');
for (const [name, fen] of [['wtm', '8/8/8/3Kp3/4Pk2/8/8/8 w - - 0 1'],
                           ['btm', '8/8/8/3Kp3/4Pk2/8/8/8 b - - 0 1']]) {
  let row = name.padEnd(6);
  for (const mode of ['', 'mean', 'max']) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 4000, backup: mode });
    const t = res.thermo;
    row += `${label(mode)}${(t.Qs[t.bestIdx] / 2).toFixed(2)} (T=${t.T.toFixed(1)} d${res.depth})   `;
  }
  console.log(row);
}
