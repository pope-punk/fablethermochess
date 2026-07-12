// committal_probe.js — does forcing (qCheck) extension PROPHYLACTICALLY steer the
// engine away from an exposure catastrophe, one ply before it's already lost?
//
// DERIVATION / METHOD. qcheck_reveal showed qCheck REVEALS the mating nets at the
// peak (6/10 at d2) but flips the move only 1/10 there — the peaks are already
// lost (every move mates), so reveal ≠ rescue. The curative value, if any, is at
// the COMMITTAL ply: earlier in the losing sequence, where the eval was still
// moderate and a sound alternative existed. There, qCheck should (a) reveal the
// net EARLIER — eval_qCheck ≪ eval_default (the forcing line resolves in
// quiescence that plain search stands pat before) — and (b) FLIP the argmax off
// the exposing move. If it only flips at already-lost evals, forcing extension has
// no prophylactic value and the mate-loss pocket is beyond it.
//
// TEST. For each engine-lost-by-mate game, recover the peak (self-eval ≥ +3), then
// WALK BACK over the engine's prior moves. At each, compare default vs qCheck:
// self-eval and argmax. Bucket per game by the EARLIEST ply where qCheck flips the
// move, and whether the eval there was still SAVABLE (|eval| < SAVABLE, not yet a
// forced loss). Alignment: trace[k] ↔ engine move k+nBook (book moves absent from
// trace), as in exposure_corpus.
//
//   node tests/committal_probe.js
const fs = require('fs'), path = require('path');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E = fresh();
const PAWN = 2, MATE_NEAR = 100000 - 4096, DEPTH = 4, COMPLACENT = 3, SAVABLE = 3, BACKSTEPS = 6;

// recover losing-by-mate games with per-engine-move FEN + eval
function games() {
  const dir = path.join(__dirname, 'results');
  const files = fs.readdirSync(dir).filter(f => /^vs_sf1500.*\.json$/.test(f));
  const out = [];
  for (const f of files) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
    const gs = j.games || j; if (!Array.isArray(gs)) continue;
    gs.forEach((g, gi) => {
      if (!g.moves || !g.trace || g.termination !== 'checkmate') return;
      const engWhite = g.engineIsWhite;
      if (!((engWhite && g.result === '0-1') || (!engWhite && g.result === '1-0'))) return;
      const line = g.line || [], full = line.concat(g.moves);
      const c = new E.Chess(); const eng = []; let ok = true;
      for (let i = 0; i < full.length; i++) {
        const isEng = engWhite ? (i % 2 === 0) : (i % 2 === 1);
        if (isEng) eng.push({ san: full[i], fen: c.fen() });
        if (!c.move(full[i])) { ok = false; break; }
      }
      if (!ok) return;
      let nBook = 0; for (let i = 0; i < line.length; i++) if (engWhite ? (i % 2 === 0) : (i % 2 === 1)) nBook++;
      // engine-move index of the peak (max self-eval in the terminal window)
      let peakK = -1, peakEval = -Infinity;
      g.trace.forEach((t, k) => {
        const pos = eng[k + nBook]; if (!pos || pos.san !== t.san || t.evalP == null) return;
        const ev = engWhite ? t.evalP : -t.evalP;
        if (ev >= COMPLACENT && ev < 50 && k >= g.trace.length - 12 && ev > peakEval) { peakEval = ev; peakK = k; }
      });
      if (peakK >= 0) out.push({ tag: f.replace('vs_sf1500_', '').replace('.json', '') + '#' + gi, eng, nBook, peakK });
    });
  }
  return out;
}

function selfEval(fen, qc) {
  const th = fresh()._runAnalyze({ fen, dashDepth: DEPTH, qCheck: qc }).thermo;
  if (!th) return null;
  const q = th.Qs[th.bestIdx];
  return { p: q / PAWN, mate: Math.abs(q) > MATE_NEAR, move: th.moves[th.bestIdx] };
}

const OUT = path.join(__dirname, 'results', 'committal_probe.jsonl');
fs.writeFileSync(OUT, '');
const gl = games();
const perGame = [];
for (const G of gl.slice(0, 14)) {         // cap for restart-feasibility
  const rows = [];
  for (let b = 0; b <= BACKSTEPS; b++) {
    const pos = G.eng[G.peakK + G.nBook - b];   // walk back b engine moves from the peak
    if (!pos) break;
    const d = selfEval(pos.fen, false), q = selfEval(pos.fen, true);
    if (!d || !q || d.mate) continue;
    const rec = { back: b, evalDef: +d.p.toFixed(2), evalQc: +q.p.toFixed(2), gap: +(d.p - q.p).toFixed(2),
      moveDef: d.move, moveQc: q.move, flip: d.move !== q.move, savable: Math.abs(d.p) < SAVABLE };
    rows.push(rec);
  }
  // earliest (largest back) ply where qCheck flips at a savable eval
  const proph = rows.filter(r => r.flip && r.savable && r.gap > 0.5).sort((a, b) => b.back - a.back)[0];
  const rec = { game: G.tag, prophylactic: !!proph, prophBack: proph ? proph.back : null, prophGap: proph ? proph.gap : null, rows };
  perGame.push(rec); fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
  process.stderr.write(G.tag.padEnd(14) + ' prophylactic=' + rec.prophylactic + (proph ? ' (back ' + proph.back + ', gap ' + proph.gap + ', ' + proph.rows + ')' : '') + '\n');
}

// report
const n = perGame.length, proph = perGame.filter(g => g.prophylactic).length;
console.log('\n=== committal-flip: does qCheck reveal-and-flip while still SAVABLE? (depth ' + DEPTH + ', ' + n + ' games) ===\n');
console.log('  games with a prophylactic committal flip (qCheck flips off the exposing move at |eval|<' + SAVABLE + ', gap>0.5): ' + proph + '/' + n);
console.log('  mean qCheck reveal gap (eval_def − eval_qc) across all walked plies: ' +
  (perGame.flatMap(g => g.rows).reduce((s, r) => s + r.gap, 0) / Math.max(1, perGame.flatMap(g => g.rows).length)).toFixed(2) + ' pawns');
console.log('\n  per game:');
for (const g of perGame) {
  const flips = g.rows.filter(r => r.flip).length, savableFlips = g.rows.filter(r => r.flip && r.savable).length;
  console.log('  ' + g.game.padEnd(14) + ' proph=' + (g.prophylactic ? 'YES(back ' + g.prophBack + ')' : 'no ') +
    '  flips ' + flips + '/' + g.rows.length + ' (savable ' + savableFlips + ')  maxGap ' + Math.max(0, ...g.rows.map(r => r.gap)).toFixed(2));
}
fs.writeFileSync(path.join(__dirname, 'results', 'committal_probe.json'), JSON.stringify({ DEPTH, perGame }, null, 1));
console.log('\nwrote results/committal_probe.json');
