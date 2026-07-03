// Three-knob decomposition of a decision's temperature dependence:
//   pinT   — pins the whole bath (search + leaf + thermometer off)
//   leafT  — overrides only the leaf optionality price
//   themT  — overrides only the OPPONENT's interior ensembles
// Measured on the Alekhine blunder (1.e4 Nf6 2.e5: d6 vs Nd5), depth 3:
//   leaf price:        ~0.3 of the swing  (negligible)
//   them-side interior: ~0.8–1.9, only when T_us is cold
//   US-side interior:   ~3.75            (dominant)
// The blunder is SELF-INDULGENCE: the engine overprices its OWN future
// optionality via the interior choice premium T·lnZ at its own nodes.
//   node t_decompose.js [fen] [moveA] [moveB]
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
let fen = process.argv[2], mA = process.argv[3] || 'd6', mB = process.argv[4] || 'Nd5';
if (!fen) { const g = new E0.Chess(); for (const m of ['e4','Nf6','e5']) g.move(m); fen = g.fen(); }
const Ts = [0.5, 1.0, 1.5, 2.0];
function grid(label, mk) {
  console.log('\n' + label);
  let head = '      '; for (const c of Ts) head += ('  ' + c.toFixed(1)).padStart(16); console.log(head);
  for (const r of Ts) {
    let row = r.toFixed(1).padEnd(6);
    for (const c of Ts) {
      const E = fresh();
      const res = E._runAnalyze(Object.assign({ fen, dashDepth: 3 }, mk(r, c)));
      const t = res.thermo;
      const d = t.Qs[t.moves.indexOf(mA)] - t.Qs[t.moves.indexOf(mB)];
      row += `${t.moves[t.bestIdx]} ${(d >= 0 ? '+' : '')}${d.toFixed(2)}`.padStart(16);
    }
    console.log(row);
  }
}
console.log(`decomposing ${mA} vs ${mB} at ${fen}`);
grid('rows T_search (pinT) × cols T_leaf (leafT):', (r, c) => ({ pinT: r, leafT: c }));
grid('rows T_us (pinT) × cols T_them (themT):',     (r, c) => ({ pinT: r, themT: c }));
