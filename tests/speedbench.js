// Speed comparison: thermodynamic engine vs plain alpha-beta minimax
// (same movegen, same time budget). Reports depth reached, nodes, nps.
const E = require('./engine_current.js');
const { Chess } = E;
const { CP, materialCp } = require('./ref_engine.js');

// Instrumented minimax (same algorithm as the oracle, counting nodes)
let abNodes = 0;
function qs(g, alpha, beta, qd) {
  abNodes++;
  const inCheck = g.fast_in_check();
  if (!inCheck) {
    const stand = materialCp(g);
    if (stand >= beta) return stand;
    if (stand > alpha) alpha = stand;
    if (qd <= 0) return stand;
  } else if (qd <= -8) return materialCp(g);
  const moves = inCheck ? g.fast_moves() : g.fast_captures();
  if (moves.length === 0) return inCheck ? -1000000 : alpha;
  if (!inCheck) {
    for (const m of moves) m._o = (CP[m.captured] || 0) * 16 - CP[m.piece];
    moves.sort((a, b) => b._o - a._o);
  }
  for (const m of moves) {
    g.fast_make(m);
    const s = -qs(g, -beta, -alpha, qd - 1);
    g.fast_undo();
    if (s >= beta) return s;
    if (s > alpha) alpha = s;
  }
  return alpha;
}
function ab(g, depth, alpha, beta, deadline) {
  abNodes++;
  if (depth <= 0) return qs(g, alpha, beta, 16);
  const moves = g.fast_moves();
  if (moves.length === 0) return g.fast_in_check() ? -1000000 + (100 - depth) : 0;
  for (const m of moves) m._o = m.captured ? (CP[m.captured] || 0) * 16 - CP[m.piece] : -10000;
  moves.sort((a, b) => b._o - a._o);
  let best = -Infinity;
  for (const m of moves) {
    g.fast_make(m);
    const s = -ab(g, depth - 1, -beta, -alpha, deadline);
    g.fast_undo();
    if (s > best) best = s;
    if (s > alpha) alpha = s;
    if (alpha >= beta) break;
    if (performance.now() > deadline) break;
  }
  return best;
}
function minimaxBench(fen, ms) {
  const g = new Chess(fen);
  const deadline = performance.now() + ms;
  abNodes = 0;
  const moves = g.fast_moves();
  let reached = 0;
  for (let depth = 1; depth <= 32; depth++) {
    let bestS = -Infinity, timedOut = false;
    const scores = new Array(moves.length);
    for (let i = 0; i < moves.length; i++) {
      g.fast_make(moves[i]);
      scores[i] = -ab(g, depth - 1, -Infinity, Infinity, deadline);
      g.fast_undo();
      if (depth > 1 && performance.now() > deadline) { timedOut = true; break; }
    }
    if (timedOut) break;
    reached = depth;
    const order = moves.map((m, i) => i).sort((a, b) => scores[b] - scores[a]);
    const nm = order.map(i => moves[i]);
    for (let i = 0; i < moves.length; i++) moves[i] = nm[i];
    if (performance.now() > deadline) break;
  }
  return { depth: reached, nodes: abNodes };
}

const POSITIONS = [
  ['opening', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
  ['middlegame', 'r1bq1rk1/pp3ppp/2nbpn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 8'],
  ['sharp middlegame', 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1'],
  ['endgame', '8/5pk1/6p1/8/3R4/6P1/5PK1/3r4 w - - 0 1'],
];
const MS = 2000;

console.log('time budget per position:', MS, 'ms\n');
console.log('position           | engine      depth  nodes      nps     T     | minimax     depth  nodes      nps');
console.log('-'.repeat(108));
for (const [name, fen] of POSITIONS) {
  const t0 = performance.now();
  const res = E._runAnalyze({ fen, timeLimit: MS });
  const dt1 = performance.now() - t0;
  const t1 = performance.now();
  const mm = minimaxBench(fen, MS);
  const dt2 = performance.now() - t1;
  console.log(
    name.padEnd(18), '|',
    ''.padEnd(10),
    String(res.depth).padStart(3),
    String(res.nodes).padStart(9),
    String(Math.round(res.nodes / (dt1 / 1000) / 1000) + 'k').padStart(7),
    ('T=' + res.thermo.T.toFixed(2)).padStart(7), '|',
    ''.padEnd(10),
    String(mm.depth).padStart(3),
    String(mm.nodes).padStart(9),
    String(Math.round(mm.nodes / (dt2 / 1000) / 1000) + 'k').padStart(7));
}
