// Match harness: current engine vs the material oracle or the frozen v1
// baseline. Equal time per move, color-swapped pairs, small opening book
// for game diversity, blunder scanning against classical material.
//
//   node tests/extract_engine.js          # refresh engine_current.js first
//   node tests/match.js cur ref 12 500    # current vs oracle, 12 games, 500ms/move
//   node tests/match.js cur v1  12 500    # current vs first-edition baseline
//
// Games that reach the ply cap are adjudicated by classical material.
// Blunder = a move after which the mover is ≥250cp worse two plies later;
// positions are saved to tests/blunders_<A>_<B>.json for diagnosis.
const path = require('path');
const { makeRef, materialCp, CP } = require('./ref_engine.js');

const ENGINES = {
  cur: path.join(__dirname, 'engine_current.js'),
  v1: path.join(__dirname, 'baselines', 'engine_v1_prescribedC.js'),
};

function loadEngine(p) {
  delete require.cache[require.resolve(p)];
  return require(p);
}

function whiteMaterialCp(g) {
  const b = g.board();
  let w = 0, bl = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = b[r][c]; if (!p) continue;
    if (p.color === 'w') w += CP[p.type]; else bl += CP[p.type];
  }
  return w - bl;
}

function makePlayer(kind, Chess) {
  if (kind === 'ref') {
    const refMove = makeRef(Chess);
    return { name: 'ref', move: (fen, ms) => refMove(new Chess(fen), ms) };
  }
  // 'cur:mean' / 'cur:max' select a backup-form lab knob (backup_forms.js)
  const [base, backup] = kind.split(':');
  const E = loadEngine(ENGINES[base]);
  return { name: kind, move: (fen, ms, pastKeys) => E._runAnalyze({ fen, timeLimit: ms, pastKeys, backup }).san };
}

// Deterministic engines repeat one game; a small book restores variety.
const OPENINGS = [
  ['e4', 'e5', 'Nf3', 'Nc6'],
  ['d4', 'd5', 'c4', 'e6'],
  ['e4', 'c5', 'Nf3', 'd6'],
  ['d4', 'Nf6', 'c4', 'g6'],
  ['e4', 'e6', 'd4', 'd5'],
  ['c4', 'e5', 'Nc3', 'Nf6'],
];

function playGame(pw, pb, ms, Chess, opening) {
  const g = new Chess();
  if (opening) for (const san of opening) g.move(san);
  let keys = [g.fast_hash()];
  for (let ply = 0; ply < 240; ply++) {
    if (g.game_over()) break;
    const side = g.fast_turn();
    const player = side === 'w' ? pw : pb;
    const san = player.move(g.fen(), ms, keys.slice(0, -1));
    if (!san) break;
    const mv = g.move(san);
    if (!mv) { console.log('ILLEGAL', player.name, san, g.fen()); break; }
    if (mv.captured || mv.piece === 'p') keys = [];
    keys.push(g.fast_hash());
  }
  let result;
  if (g.in_checkmate()) result = g.fast_turn() === 'w' ? '0-1' : '1-0';
  else if (g.game_over()) result = '1/2';
  else {
    const m = whiteMaterialCp(g);
    result = m >= 150 ? '1-0' : (m <= -150 ? '0-1' : '1/2');   // material adjudication at ply cap
  }
  console.log('  ', pw.name, 'vs', pb.name, '→', result,
    '(', g.history().length, 'plies, final mat', whiteMaterialCp(g), 'cp )');
  return { result, history: g.history() };
}

function scanBlunders(history, Chess) {
  const g = new Chess();
  const mats = [whiteMaterialCp(g)];
  for (const san of history) { g.move(san); mats.push(whiteMaterialCp(g)); }
  const out = [];
  for (let i = 0; i + 2 < mats.length; i++) {
    const side = i % 2 === 0 ? 'w' : 'b';
    const d = mats[i + 2] - mats[i];
    const loss = side === 'w' ? -d : d;
    if (loss >= 250) out.push({ ply: i, side, san: history[i], loss });
  }
  return out;
}

(async () => {
  const [A, B, games, ms] = [process.argv[2] || 'cur', process.argv[3] || 'ref',
                             parseInt(process.argv[4] || '4'), parseInt(process.argv[5] || '400')];
  const { Chess } = loadEngine(ENGINES.cur);
  const score = { [A]: 0, [B]: 0, draws: 0 };
  const blunderCount = { [A]: 0, [B]: 0 };
  const blunderFens = [];

  for (let game = 0; game < games; game++) {
    const aIsWhite = game % 2 === 0;
    const pa = makePlayer(A, Chess), pb = makePlayer(B, Chess);
    const opening = OPENINGS[Math.floor(game / 2) % OPENINGS.length];
    const r = playGame(aIsWhite ? pa : pb, aIsWhite ? pb : pa, ms, Chess, opening);
    if (r.result === '1-0') score[aIsWhite ? A : B]++;
    else if (r.result === '0-1') score[aIsWhite ? B : A]++;
    else score.draws++;
    for (const b of scanBlunders(r.history, Chess)) {
      const mover = (b.side === 'w') === aIsWhite ? A : B;
      blunderCount[mover]++;
      const g2 = new Chess();
      for (let i = 0; i < b.ply; i++) g2.move(r.history[i]);
      blunderFens.push({ mover, fen: g2.fen(), san: b.san, loss: b.loss, ply: b.ply });
    }
  }
  console.log('\nSCORE:', JSON.stringify(score));
  console.log('BLUNDERS (>=250cp lost in 2 plies):', JSON.stringify(blunderCount));
  require('fs').writeFileSync(path.join(__dirname, `blunders_${A}_${B}.json`),
    JSON.stringify(blunderFens, null, 1));
  console.log('blunder positions saved:', blunderFens.length);
})();
