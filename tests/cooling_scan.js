// Criticality experiment: cool the bath by thinking longer, and watch the
// initiative's order parameter. The Curie–Weiss fit on the SF-1500 flux
// gauntlet gave J = 3.5, b = 0.63 → T_c = J·b/2 ≈ 1.1, with match play
// sitting SUBCRITICAL (J·b/2T ≈ 0.55 at T ≈ 2). Deeper search anneals the
// bath colder. Does the system approach — or cross — the spontaneous
// initiative-polarization transition as the protocol cools it?
//
// Method: self-play (engine both sides, shared bath, fresh bath per game)
// at four time controls, flux stage in 'measure' mode: full (β, Δμ, n)
// readings per candidate move with the Q-coupling DISABLED, so the
// instrument does not perturb the play. Output: one JSON with per-move
// T and count-carrying quadruples [β, Δμ, n_tax, n_μ] for the
// precision-weighted J(T) refit (fit_JT.js).
//
//   node cooling_scan.js [outFile]
const fs = require('fs');
const path = require('path');
const ENGINE = path.join(__dirname, 'engine_current.js');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'results', 'cooling_scan.json'));
function fresh() { delete require.cache[require.resolve(ENGINE)]; return require(ENGINE); }

const OPENINGS = [
  { name: 'Italian complex',       line: ['e4', 'e5', 'Nf3', 'Nc6'] },
  { name: "Queen's Gambit Declined", line: ['d4', 'd5', 'c4', 'e6'] },
  { name: 'Sicilian (Najdorf setup)', line: ['e4', 'c5', 'Nf3', 'd6'] },
  { name: "King's Indian",         line: ['d4', 'Nf6', 'c4', 'g6'] },
  { name: 'French',                line: ['e4', 'e6', 'd4', 'd5'] },
  { name: 'English (reversed Sicilian)', line: ['c4', 'e5', 'Nc3', 'Nf6'] },
];
// games per time control chosen so each rung costs roughly comparable
// wall-clock; the cold rungs pay per-move what the hot rungs pay per game
const RUNGS = process.argv.includes('--smoke')
  ? [{ ms: 250, games: 1 }]
  : [
      { ms: 250,   games: 6 },
      { ms: 1000,  games: 5 },
      { ms: 4000,  games: 3 },
      { ms: 15000, games: 2 },
    ];

function playGame(ms, opening) {
  const E = fresh();
  const g = new E.Chess();
  for (const san of opening.line) g.move(san);
  let keys = [g.fast_hash()];
  const trace = [], moves = [];
  for (let ply = 0; ply < 240; ply++) {
    if (g.game_over()) break;
    const res = E._runAnalyze({ fen: g.fen(), timeLimit: ms,
                                pastKeys: keys.slice(0, -1), flux: 'measure' });
    if (!res.san) break;
    const t = res.thermo;
    const rec = { ply, san: res.san, T: +t.T.toFixed(3), depth: res.depth, triples: [] };
    if (t.beta)
      for (let i = 0; i < t.beta.length; i++)
        if (t.beta[i] != null)
          rec.triples.push([+t.beta[i].toFixed(3), +t.dmu[i].toFixed(3), t.ntax[i], t.nmu[i]]);
    trace.push(rec);
    const mv = g.move(res.san);
    if (!mv) break;
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
    moves.push(res.san);
  }
  let result = '1/2-1/2', termination = 'ply cap';
  if (g.in_checkmate()) { result = g.fast_turn() === 'w' ? '0-1' : '1-0'; termination = 'checkmate'; }
  else if (g.in_stalemate()) termination = 'stalemate';
  else if (g.in_threefold_repetition()) termination = 'threefold repetition';
  else if (g.game_over()) termination = 'draw (50-move/material)';
  return { opening: opening.name, line: opening.line, moves, result, termination,
           plies: moves.length, trace };
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const out = { kind: 'cooling_scan', date: new Date().toISOString(), rungs: [] };
for (const rung of RUNGS) {
  const R = { ms: rung.ms, games: [] };
  out.rungs.push(R);
  console.log(`\n── rung ${rung.ms} ms/move · ${rung.games} self-play games ──`);
  for (let i = 0; i < rung.games; i++) {
    const t0 = Date.now();
    const gm = playGame(rung.ms, OPENINGS[i % OPENINGS.length]);
    R.games.push(gm);
    let sumT = 0, nT = 0, nTr = 0;
    for (const r of gm.trace) { sumT += r.T; nT++; nTr += r.triples.length; }
    console.log(`  ${gm.opening.padEnd(28)} ${gm.result.padEnd(7)} ${String(gm.plies).padStart(3)} plies · ` +
      `⟨T⟩=${(sumT / Math.max(1, nT)).toFixed(2)} · ${nTr} readings · ${Math.round((Date.now() - t0) / 1000)}s`);
    fs.writeFileSync(OUT, JSON.stringify(out));
  }
}
console.log('\ncooling scan written to', OUT);
