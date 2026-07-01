// Classical reference opponent: pure-material alpha-beta with quiescence and
// iterative deepening. Deliberately positionally naive — its only job is to
// be a material-truth oracle that punishes hung pieces.
const CP = { p: 100, n: 300, b: 310, r: 500, q: 900, k: 0 };
const MATE = 1000000;

function materialCp(g) {
  // centipawns from the side to move's perspective
  const b = g.board();
  let w = 0, bl = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = b[r][c]; if (!p) continue;
    if (p.color === 'w') w += CP[p.type]; else bl += CP[p.type];
  }
  return g.fast_turn() === 'w' ? w - bl : bl - w;
}

function makeRef(Chess) {
  function quiesceRef(g, alpha, beta, qd) {
    const inCheck = g.fast_in_check();
    if (!inCheck) {
      const stand = materialCp(g);
      if (stand >= beta) return stand;
      if (stand > alpha) alpha = stand;
      if (qd <= 0) return stand;
    } else if (qd <= -8) return materialCp(g);
    const moves = inCheck ? g.fast_moves() : g.fast_captures();
    if (moves.length === 0) return inCheck ? -MATE : alpha;
    if (!inCheck) {
      for (const m of moves) m._o = (CP[m.captured] || 0) * 16 - CP[m.piece];
      moves.sort((a, b) => b._o - a._o);
    }
    for (const m of moves) {
      g.fast_make(m);
      const s = -quiesceRef(g, -beta, -alpha, qd - 1);
      g.fast_undo();
      if (s >= beta) return s;
      if (s > alpha) alpha = s;
    }
    return alpha;
  }

  function ab(g, depth, alpha, beta, deadline) {
    if (depth <= 0) return quiesceRef(g, alpha, beta, 16);
    const moves = g.fast_moves();
    if (moves.length === 0) return g.fast_in_check() ? -MATE + (100 - depth) : 0;
    for (const m of moves) m._o = (m.captured ? (CP[m.captured] || 0) * 16 - CP[m.piece] : -10000);
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

  return function refBestMove(g, timeMs) {
    const deadline = performance.now() + timeMs;
    const moves = g.fast_moves();
    if (moves.length === 0) return null;
    if (moves.length === 1) return g.fast_to_san(moves[0]);
    let bestIdx = 0;
    for (let depth = 1; depth <= 32; depth++) {
      let idx = 0, bestS = -Infinity, timedOut = false;
      const scores = new Array(moves.length);
      for (let i = 0; i < moves.length; i++) {
        g.fast_make(moves[i]);
        const s = -ab(g, depth - 1, -Infinity, Infinity, deadline);
        g.fast_undo();
        scores[i] = s;
        if (s > bestS) { bestS = s; idx = i; }
        if (depth > 1 && performance.now() > deadline) { timedOut = true; break; }
      }
      if (timedOut) break;
      bestIdx = 0;
      // reorder best-first for next iteration
      const order = moves.map((m, i) => i).sort((a, b) => scores[b] - scores[a]);
      const nm = order.map(i => moves[i]);
      for (let i = 0; i < moves.length; i++) moves[i] = nm[i];
      if (performance.now() > deadline) break;
    }
    return g.fast_to_san(moves[bestIdx]);
  };
}

module.exports = { makeRef, materialCp, CP };
