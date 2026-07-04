// Invariance battery for the thermometer: is T a property of the POSITION,
// or an accident of how the search happened to unfold?
//
// The objection (session log, "temperature well-definedness"): T depends on
// move order, time limits, depth. The defensible claim is narrower — at a
// FIXED protocol (fixed depth, fixed apparatus), T must be a reproducible
// function of the position alone. This battery tests exactly that:
//
//   A. Determinism: two fresh engine instances, same position, same fixed
//      depth → bitwise-identical T, F, S, best move.
//   B. Root-shuffle invariance: eight seeded permutations of the root move
//      list (opts.shuffleSeed) at fixed depth → T spread should be pure
//      float noise, not physics. Enumeration order is a coordinate choice;
//      the thermometer must be gauge-invariant under it.
//   C. Cooling protocol: T as a function of time budget (the annealing
//      schedule), per position — reported, not asserted: T is a property
//      of (position, protocol), and budget is part of the protocol. This
//      table is the protocol-dependence made explicit.
//
//   node invariance.js
const path = require('path');
const ENGINE = path.join(__dirname, 'engine_current.js');

// bathT is deliberately persistent engine state (the bath has a history);
// for invariance measurements each reading needs a fresh, identical bath.
function fresh() { delete require.cache[require.resolve(ENGINE)]; return require(ENGINE); }

const POSITIONS = [
  { name: 'start',        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
  { name: 'italian',      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3' },
  { name: 'middlegame',   fen: 'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10' },
  { name: 'fine70 endgame', fen: '8/k7/3p4/p2P1p2/P2P1P2/8/8/K7 w - - 0 1' },
];
const DEPTH = 3;

let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + msg); if (!ok) fails++; };

function analyzeFixed(fen, seed) {
  const E = fresh();
  const res = E._runAnalyze({ fen, dashDepth: DEPTH, shuffleSeed: seed });
  const t = res.thermo;
  return { T: t.T, F: t.F, S: t.S, best: t.moves[t.bestIdx], nodes: res.nodes };
}

console.log('── A. fixed-depth determinism (depth ' + DEPTH + ', fresh bath each run) ──');
for (const p of POSITIONS) {
  const a = analyzeFixed(p.fen), b = analyzeFixed(p.fen);
  const same = a.T === b.T && a.F === b.F && a.S === b.S && a.best === b.best;
  check(same, `${p.name.padEnd(16)} T=${a.T.toFixed(6)} F=${a.F.toFixed(6)} best=${a.best}` +
    (same ? '' : `  vs  T=${b.T.toFixed(6)} F=${b.F.toFixed(6)} best=${b.best}`));
}

console.log('\n── B. root-shuffle gauge invariance (8 seeded permutations) ──');
for (const p of POSITIONS) {
  const runs = [analyzeFixed(p.fen)];
  for (let seed = 1; seed <= 8; seed++) runs.push(analyzeFixed(p.fen, seed));
  const Ts = runs.map(r => r.T), Fs = runs.map(r => r.F);
  const spreadT = Math.max(...Ts) - Math.min(...Ts);
  const spreadF = Math.max(...Fs) - Math.min(...Fs);
  const bests = new Set(runs.map(r => r.best));
  const scaleT = Math.max(1, Math.abs(Ts[0])), scaleF = Math.max(1, Math.abs(Fs[0]));
  check(spreadT / scaleT < 1e-9 && spreadF / scaleF < 1e-9 && bests.size === 1,
    `${p.name.padEnd(16)} ΔT=${spreadT.toExponential(2)} ΔF=${spreadF.toExponential(2)} best={${[...bests].join(',')}}`);
}

console.log('\n── C. cooling protocol: T(budget) — reported, protocol-dependence made explicit ──');
(async () => {
  const BUDGETS = [250, 500, 1000, 2000, 4000];
  console.log('position'.padEnd(18) + BUDGETS.map(b => (b + 'ms').padStart(14)).join(''));
  for (const p of POSITIONS) {
    let row = p.name.padEnd(18);
    for (const ms of BUDGETS) {
      const E = fresh();
      const res = E._runAnalyze({ fen: p.fen, timeLimit: ms });
      row += `T=${res.thermo.T.toFixed(2)} d${res.depth}`.padStart(14);
    }
    console.log(row);
  }
  console.log('\n' + (fails ? fails + ' FAILURES' : 'all invariance checks passed'));
  process.exit(fails ? 1 : 0);
})();
