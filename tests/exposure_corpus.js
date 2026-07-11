// exposure_corpus.js — objectively recover "complacent-then-mated" decision
// positions from the recorded SF-1500 gauntlets, for the exposure depth-flip
// discriminator (exposure_probe.js).
//
// Signature of the target disease: the engine reads its OWN position at ≥ +3
// pawns (by its own POV) and is then checkmated within a few moves — F priced
// something (an open/marching king, a material grab) as safe that was lost.
// These are recovered, not constructed: every one is a real game the engine
// lost by mate while its dashboard said it was winning.
//
// Alignment note (load-bearing): a game's `trace` records only the engine's
// NON-BOOK moves, in order; the opening `line` is played before `moves` and is
// absent from the trace. So trace[k] ↔ the (k+nBook)-th engine move of the full
// line+moves sequence, where nBook = engine moves inside the opening line.
//
//   const {recover} = require('./exposure_corpus.js');  // returns positions[]

const fs = require('fs'), path = require('path');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }

function recover(opts = {}) {
  const E = fresh();
  const dir = path.join(__dirname, 'results');
  const COMPLACENT = opts.complacent != null ? opts.complacent : 3.0; // pawns, engine-POV
  const TERMINAL = opts.terminal != null ? opts.terminal : 9;         // last N engine moves
  const files = fs.readdirSync(dir).filter(f => /^vs_sf1500.*\.json$/.test(f));
  const picks = []; const seen = new Set();

  for (const f of files) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
    const games = j.games || j; if (!Array.isArray(games)) continue;
    const tag = f.replace('vs_sf1500_', '').replace('.json', '') || 'base';
    games.forEach((g, gi) => {
      if (!g.moves || !g.trace || g.termination !== 'checkmate') return;
      const engWhite = g.engineIsWhite;
      const engineLost = (engWhite && g.result === '0-1') || (!engWhite && g.result === '1-0');
      if (!engineLost) return;
      const line = g.line || [], full = line.concat(g.moves);
      // engine move list with the board position BEFORE each engine move
      const c = new E.Chess(); const eng = [];
      let ok = true;
      for (let i = 0; i < full.length; i++) {
        const isEng = engWhite ? (i % 2 === 0) : (i % 2 === 1);
        if (isEng) eng.push({ san: full[i], fen: c.fen() });
        if (!c.move(full[i])) { ok = false; break; }
      }
      if (!ok) return;
      let nBook = 0;
      for (let i = 0; i < line.length; i++) if (engWhite ? (i % 2 === 0) : (i % 2 === 1)) nBook++;
      // collect complacent, terminal engine decisions
      const rows = [];
      g.trace.forEach((t, k) => {
        const pos = eng[k + nBook];
        if (!pos || pos.san !== t.san || t.evalP == null) return;       // alignment guard
        const engEval = engWhite ? t.evalP : -t.evalP;
        const terminal = k >= g.trace.length - TERMINAL;
        if (engEval >= COMPLACENT && engEval < 50 && terminal)
          rows.push({ k, san: t.san, engEval: +engEval.toFixed(2), depth: t.depth, fen: pos.fen });
      });
      if (!rows.length) return;
      // one game contributes: the peak-eval decision, and the peak king-march (if any)
      const peak = rows.reduce((a, b) => b.engEval > a.engEval ? b : a);
      const king = rows.filter(r => /^K/.test(r.san)).sort((a, b) => b.engEval - a.engEval)[0];
      for (const r of [peak, king].filter(Boolean)) {
        if (seen.has(r.fen)) continue; seen.add(r.fen);
        picks.push({ game: tag, opening: g.opening, san: r.san, engEval: r.engEval, playDepth: r.depth,
          cls: /^K/.test(r.san) ? 'EXPOSURE' : 'MATERIAL', fen: r.fen });
      }
    });
  }
  picks.sort((a, b) => (a.cls < b.cls ? -1 : a.cls > b.cls ? 1 : 0) || b.engEval - a.engEval);
  return picks;
}

module.exports = { recover };

if (require.main === module) {
  const picks = recover();
  console.log('recovered ' + picks.length + ' positions (' +
    picks.filter(p => p.cls === 'EXPOSURE').length + ' EXPOSURE, ' +
    picks.filter(p => p.cls === 'MATERIAL').length + ' MATERIAL)\n');
  for (const p of picks)
    console.log(`  [${p.cls[0]}] ${p.game.padEnd(11)} ${(p.opening || '').slice(0, 13).padEnd(13)} ${p.san.padEnd(6)} +${String(p.engEval).padStart(6)}  ${p.fen}`);
}
