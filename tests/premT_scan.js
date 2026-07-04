// The premT leg of the winner's-curse program: price ONLY the interior
// choice premium T·S at a counterfactual temperature while the ensemble
// (weights, truncation, thermometer, leaf) stays at the live bath. This
// is the missing row of the t_decompose grid — it separates the
// premium's SCALE from the ensemble it rides on. premT → 0 is the
// 'mean' backup; premT = bath recovers F exactly.
//
// The question it answers: can any GLOBAL premium temperature cure the
// Alekhine blunder? The prediction on record (from T* ≈ 1.0 = the
// zero-point floor): no — a global premium rescale is cooling by
// another name, so the cure must be per-node (the λ̂ deflation), with
// the global channel reserved for the danger sense (σ_eff).
//
//   node tests/premT_scan.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(moves) { const g = new E0.Chess(); for (const m of moves) g.move(m); return g.fen(); }
const alekhine = fenAfter(['e4', 'Nf6', 'e5']);

// ── 1 · Alekhine at the live bath, premium repriced ─────────
console.log('1 · Alekhine (live bath, depth 3/4): Δ(d6−Nd5) vs premT   [F ≙ premT=bath]');
const PREMS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 0];   // 0 = off (F)
for (const depth of [3, 4]) {
  let row = 'd' + depth + '   ';
  for (const p of PREMS) {
    const E = fresh();
    const res = E._runAnalyze({ fen: alekhine, dashDepth: depth, premT: p || undefined });
    const t = res.thermo;
    const d = t.Qs[t.moves.indexOf('d6')] - t.Qs[t.moves.indexOf('Nd5')];
    row += ((p ? 'p' + p.toFixed(2) : 'F') + ':' + (d >= 0 ? '+' : '') + d.toFixed(2)).padStart(13);
  }
  console.log(row);
}

// ── 2 · Sanity: premT must not break tactics or the bath ────
const CONTROLS = [
  ['mate in 1', '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', 'Re8#'],
  ['queen en prise', '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1', 'Rxd5'],
];
let bad = 0;
for (const p of [0.25, 1.0]) {
  for (const [name, fen, must] of CONTROLS) {
    const E = fresh();
    const res = E._runAnalyze({ fen, dashDepth: 3, premT: p });
    const best = res.thermo.moves[res.thermo.bestIdx];
    if (best !== must) { bad++; console.log(`  FAIL ${name} @ premT=${p}: played ${best}`); }
  }
}
console.log(bad ? `\n${bad} control failures` : '\n2 · controls pass at premT 0.25 and 1.0');
if (bad) process.exit(1);
