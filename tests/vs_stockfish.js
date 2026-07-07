// Gauntlet vs real Stockfish (WASM, UCI) at a limited Elo, over the whole
// opening book, both colors. Logs per-move thermodynamic state and writes
// a JSON results file that sf_report.js turns into a readable book.
//
//   cd tests && npm install          # pulls the stockfish WASM package
//   node extract_engine.js
//   node vs_stockfish.js [elo] [engineMs] [sfMs] [outFile]
//   node sf_report.js                # → results/vs_sf<elo>_report.md
//
// Defaults: Elo 1500, 1000 ms/move for our engine, 200 ms/move for
// Stockfish (its strength is capped by UCI_Elo, not time).
const fs = require('fs');
const path = require('path');
const initStockfish = require('stockfish');
const E = require('./engine_current.js');
const { Chess } = E;
const { CP } = require('./ref_engine.js');

const ELO = parseInt(process.argv[2] || '1500');
const ENGINE_MS = parseInt(process.argv[3] || '1000');
const SF_MS = parseInt(process.argv[4] || '200');
const OUT = process.argv[5] || path.join(__dirname, 'results', `vs_sf${ELO}.json`);
const MODE = process.argv[6] || '';          // '', 'probe', 'flux', 'measure', 'schedule', 'basinsched', 'meanback', 'maxback', 'hop', 'alloc', 'hopalloc', 'allocsched', 'guard'
const PROBE = MODE === 'probe';
const BASINSCHED = MODE === 'basinsched';    // schedule, but freeze on the top-two BASIN gap
const LEAFMU = MODE === 'leafmu';            // measure + leaf tempo prior (kappa = live T-hat_c), fixed time
const BACKUP = MODE === 'meanback' ? 'mean' : MODE === 'maxback' ? 'max'
             : MODE === 'basinback' ? 'basin'
             : MODE === 'quenched' ? 'quenched' : undefined;   // backup-form knob, fixed time
const HOP = MODE === 'hop' || MODE === 'hopalloc';   // basin-hopping truncation (kinetics only)
// allocsched = alloc + schedule WITHOUT hop: the fixed-time decomposition
// read 7.5 (alloc) vs 6 (hopalloc) vs 7.5 (baseline) - the interior hop
// dedup carried the whole cost, so the marriage leg drops it.
const ALLOC = MODE === 'alloc' || MODE === 'hopalloc' || MODE === 'allocsched';  // root allocation (kinetics only)
const GUARD = MODE === 'guard';              // schedule + absorbing-risk freeze guard (freeze_guard_replay.js)
const EXK = MODE === 'exk' ? true : MODE === 'exkleaf' ? 'leaf' : MODE === 'exkz' ? 'z' : undefined;  // king moves carry no entropy (fixed time)
const SCHEDULE = MODE === 'schedule' || BASINSCHED || MODE === 'allocsched' || GUARD;  // measure + sigma_eff time management with banking
const FLUX = MODE === 'flux' || MODE === 'measure' || SCHEDULE || LEAFMU || BACKUP !== undefined || HOP || ALLOC || EXK !== undefined;

const OPENINGS = [
  { name: 'Italian complex',       line: ['e4', 'e5', 'Nf3', 'Nc6'] },
  { name: "Queen's Gambit Declined", line: ['d4', 'd5', 'c4', 'e6'] },
  { name: 'Sicilian (Najdorf setup)', line: ['e4', 'c5', 'Nf3', 'd6'] },
  { name: "King's Indian",         line: ['d4', 'Nf6', 'c4', 'g6'] },
  { name: 'French',                line: ['e4', 'e6', 'd4', 'd5'] },
  { name: 'English (reversed Sicilian)', line: ['c4', 'e5', 'Nc3', 'Nf6'] },
];

function whiteMaterialCp(g) {
  const b = g.board();
  let w = 0, bl = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = b[r][c]; if (!p) continue;
    if (p.color === 'w') w += CP[p.type]; else bl += CP[p.type];
  }
  return w - bl;
}

async function makeSf() {
  const eng = await initStockfish(require.resolve('stockfish/bin/stockfish-18-lite-single.js'));
  const lines = [];
  eng.listener = l => lines.push(String(l));
  const send = c => eng.sendCommand(c);
  const waitFor = (pat, ms = 30000) => new Promise((res, rej) => {
    const t0 = Date.now();
    (function poll() {
      for (let i = lines.length - 1; i >= 0; i--) if (pat.test(lines[i])) return res(lines[i]);
      if (Date.now() - t0 > ms) return rej(new Error('SF timeout waiting ' + pat));
      setTimeout(poll, 10);
    })();
  });
  send('uci'); await waitFor(/^uciok/);
  send('setoption name UCI_LimitStrength value true');
  send(`setoption name UCI_Elo value ${ELO}`);
  send('isready'); await waitFor(/^readyok/);
  return {
    newGame: async () => { lines.length = 0; send('ucinewgame'); send('isready'); await waitFor(/^readyok/); },
    bestMove: async fen => {
      lines.length = 0;
      send('position fen ' + fen);
      send('go movetime ' + SF_MS);
      const bm = await waitFor(/^bestmove /);
      return bm.split(/\s+/)[1];   // UCI long algebraic, e.g. e2e4 / e7e8q
    },
  };
}

async function playGame(sf, opening, engineIsWhite) {
  const g = new Chess();
  for (const san of opening.line) g.move(san);
  let keys = [g.fast_hash()];
  const moves = [];
  const trace = [];   // per engine move: thermodynamic state
  // Time bank for schedule mode: moves the scheduler freezes early bank
  // their remainder; hard positions may spend base + up to 3x base from
  // the bank. With node-level preemption in the engine, spend tracks
  // allowed within ~ms, so total game time tracks base * moves
  // (equal-average A/B).
  let bank = 0, engFirst = true;

  await sf.newGame();
  for (let ply = 0; ply < 300; ply++) {
    if (g.game_over()) break;
    const engineToMove = (g.fast_turn() === 'w') === engineIsWhite;
    let san;
    if (engineToMove) {
      const allowed = SCHEDULE ? ENGINE_MS + Math.min(bank, 3 * ENGINE_MS) : ENGINE_MS;
      const res = E._runAnalyze({ fen: g.fen(), timeLimit: allowed, pastKeys: keys.slice(0, -1),
                                  probe: PROBE, schedule: SCHEDULE, basinSched: BASINSCHED, hop: HOP,
                                  alloc: ALLOC, riskGuard: GUARD, exK: EXK,
                                  newGame: (SCHEDULE || LEAFMU) && engFirst,
                                  leafMu: LEAFMU, backup: BACKUP,
                                  flux: (MODE === 'measure' || SCHEDULE || LEAFMU || BACKUP !== undefined || HOP || ALLOC || EXK !== undefined) ? 'measure' : FLUX });
      engFirst = false;
      // income is BASE per move; a draw from the bank is real expenditure
      // (the first A/B credited moves with their own draw — a perpetual
      // motion machine that spent 2.4x base while claiming equal-average)
      if (SCHEDULE) bank = Math.max(0, bank + ENGINE_MS - res.timeMs);
      san = res.san;
      if (res.thermo) {
        const t = res.thermo;
        const rec = { ply, san, T: +t.T.toFixed(3), S: +t.S.toFixed(3), phase: t.phase,
                     Ceff: +t.Ceff.toFixed(3), Cstar: +t.Cstar.toFixed(3),
                     evalP: +((g.fast_turn() === 'w' ? 1 : -1) * t.Qs[t.bestIdx] / 2).toFixed(2),
                     depth: res.depth };
        if (PROBE) {
          rec.w = +(t.tax || 0).toFixed(3);
          rec.chi = (t.chi && t.chi[t.bestIdx] != null) ? +t.chi[t.bestIdx].toFixed(2) : null;
          rec.probed = t.probed;
        }
        if (LEAFMU) { rec.kapRatio = +(t.kapRatio || 0).toFixed(3); rec.bite = +(t.bite || 0).toFixed(3); }
        if (SCHEDULE) {
          rec.spentMs = res.timeMs;
          rec.stop = t.stop || 'deadline';
          if (t.sigma != null) { rec.sigma = +t.sigma.toFixed(2); rec.gapQ = +t.gap.toFixed(2); }
          if (t.jhat) { rec.jhatJ = +t.jhat.J.toFixed(2); rec.jhatTc = +t.jhat.Tc.toFixed(2); }
        }
        if (FLUX && t.beta) {
          rec.beta = t.beta[t.bestIdx] != null ? +t.beta[t.bestIdx].toFixed(3) : null;
          rec.dmu = t.dmu[t.bestIdx] != null ? +t.dmu[t.bestIdx].toFixed(3) : null;
          // full pairs for the equation-of-state test: every candidate with a reading
          rec.triples = [];
          for (let i = 0; i < t.beta.length; i++)
            if (t.beta[i] != null)
              rec.triples.push(t.ntax
                ? [+t.beta[i].toFixed(3), +t.dmu[i].toFixed(3), t.ntax[i], t.nmu[i]]
                : [+t.beta[i].toFixed(3), +t.dmu[i].toFixed(3)]);
        }
        trace.push(rec);
      }
      if (!san) break;
      const mv = g.move(san);
      if (!mv) { console.log('ENGINE ILLEGAL', san); break; }
      if (mv.captured || mv.piece === 'p') keys = [];
      keys.push(g.fast_hash());
      moves.push(san);
    } else {
      const uci = await sf.bestMove(g.fen());
      if (!uci || uci === '(none)') break;
      const mv = g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      if (!mv) { console.log('SF ILLEGAL', uci, g.fen()); break; }
      if (mv.captured || mv.piece === 'p') keys = [];
      keys.push(g.fast_hash());
      moves.push(mv.san);
    }
  }

  let result, termination;
  if (g.in_checkmate()) { result = g.fast_turn() === 'w' ? '0-1' : '1-0'; termination = 'checkmate'; }
  else if (g.in_stalemate()) { result = '1/2-1/2'; termination = 'stalemate'; }
  else if (g.in_threefold_repetition()) { result = '1/2-1/2'; termination = 'threefold repetition'; }
  else if (g.game_over()) { result = '1/2-1/2'; termination = 'draw (50-move/material)'; }
  else {
    const m = whiteMaterialCp(g);
    result = m >= 150 ? '1-0' : (m <= -150 ? '0-1' : '1/2-1/2');
    termination = 'adjudicated on material at ply cap (' + (m >= 0 ? '+' : '') + m + ' cp)';
  }
  return { opening: opening.name, line: opening.line, engineIsWhite, moves, result,
           termination, finalMatCp: whiteMaterialCp(g), plies: g.history().length, trace };
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  console.log(`Gauntlet: engine (${ENGINE_MS} ms/move${PROBE ? ', susceptibility probe ON' : ''}${FLUX ? ', tempo-flux ON' : ''}) vs Stockfish 18 @ Elo ${ELO} (${SF_MS} ms/move)`);
  const sf = await makeSf();
  const games = [];
  const score = { engine: 0, stockfish: 0, draws: 0 };

  for (const opening of OPENINGS) {
    for (const engineIsWhite of [true, false]) {
      const t0 = Date.now();
      const gm = await playGame(sf, opening, engineIsWhite);
      games.push(gm);
      const engineWon = (gm.result === '1-0') === engineIsWhite && gm.result !== '1/2-1/2';
      if (gm.result === '1/2-1/2') score.draws++;
      else if (engineWon) score.engine++;
      else score.stockfish++;
      console.log(`  ${opening.name.padEnd(28)} engine as ${engineIsWhite ? 'White' : 'Black'} → ${gm.result.padEnd(7)} ` +
        `(${gm.plies} plies, ${gm.termination}, ${Math.round((Date.now() - t0) / 1000)}s)`);
      fs.writeFileSync(OUT, JSON.stringify({ elo: ELO, engineMs: ENGINE_MS, sfMs: SF_MS,
        probe: PROBE, flux: FLUX, date: new Date().toISOString(), score, games }, null, 1));
    }
  }
  console.log('\nFINAL SCORE vs Stockfish ' + ELO + ':', JSON.stringify(score));
  console.log('results written to', OUT);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
