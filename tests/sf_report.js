// Turns a vs_stockfish.js results JSON into a readable book of results:
// markdown + print-ready HTML (render the HTML to PDF with any browser).
//   node sf_report.js [results/vs_sf1500.json]
const fs = require('fs');
const path = require('path');

const IN = process.argv[2] || path.join(__dirname, 'results', 'vs_sf1500.json');
const data = JSON.parse(fs.readFileSync(IN, 'utf8'));
const base = IN.replace(/\.json$/, '');

const PHASES = ['frozen', 'cold', 'critical', 'hot'];

function gameStats(gm) {
  const tr = gm.trace;
  if (!tr.length) return { meanT: 0, maxT: 0, phases: {}, dominant: '—' };
  let sumT = 0, maxT = 0;
  const phases = {};
  for (const p of tr) {
    sumT += p.T; if (p.T > maxT) maxT = p.T;
    phases[p.phase] = (phases[p.phase] || 0) + 1;
  }
  const dominant = Object.entries(phases).sort((a, b) => b[1] - a[1])[0][0];
  return { meanT: sumT / tr.length, maxT, phases, dominant };
}

function engineResult(gm) {
  if (gm.result === '1/2-1/2') return '½';
  return (gm.result === '1-0') === gm.engineIsWhite ? '1' : '0';
}

function pgn(gm, idx) {
  const headers = [
    ['Event', `Thermodynamic engine vs Stockfish ${data.elo}`],
    ['Round', String(idx + 1)],
    ['White', gm.engineIsWhite ? 'ThermoEngine' : `Stockfish (Elo ${data.elo})`],
    ['Black', gm.engineIsWhite ? `Stockfish (Elo ${data.elo})` : 'ThermoEngine'],
    ['Opening', gm.opening],
    ['Result', gm.result],
    ['Termination', gm.termination],
  ].map(([k, v]) => `[${k} "${v}"]`).join('\n');
  const all = gm.line.concat(gm.moves);
  let text = '';
  for (let i = 0; i < all.length; i++) {
    if (i % 2 === 0) text += (i / 2 + 1) + '. ';
    text += all[i] + ' ';
    if (i % 16 === 15) text += '\n';
  }
  return headers + '\n\n' + text.trim() + ' ' + gm.result;
}

// ── Aggregates ─────────────────────────────────────────────
const pts = data.games.reduce((s, g) => s + (engineResult(g) === '1' ? 1 : engineResult(g) === '½' ? 0.5 : 0), 0);
const allTrace = data.games.flatMap(g => g.trace);
const phaseTotals = {};
for (const p of allTrace) phaseTotals[p.phase] = (phaseTotals[p.phase] || 0) + 1;
const meanTAll = allTrace.reduce((s, p) => s + p.T, 0) / (allTrace.length || 1);
const byOutcome = { win: [], draw: [], loss: [] };
for (const g of data.games) {
  const r = engineResult(g);
  const key = r === '1' ? 'win' : r === '½' ? 'draw' : 'loss';
  for (const p of g.trace) byOutcome[key].push(p.T);
}
const meanT = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length) : NaN;

// ── Markdown ───────────────────────────────────────────────
let md = `# Results book: thermodynamic engine vs Stockfish ${data.elo}\n\n`;
md += `- Date: ${data.date}\n- Engine time: ${data.engineMs} ms/move · Stockfish: ${data.sfMs} ms/move at UCI_Elo ${data.elo}\n`;
md += `- Openings: all ${data.games.length / 2} book lines, both colors (${data.games.length} games)\n\n`;
md += `## Final score\n\n**Engine ${pts} — ${data.games.length - pts} Stockfish**  (W ${data.score.engine} / D ${data.score.draws} / L ${data.score.stockfish})\n\n`;

md += `## Summary\n\n| # | Opening | Engine color | Result | Plies | Termination | mean T | dominant phase |\n|---|---|---|---|---|---|---|---|\n`;
data.games.forEach((g, i) => {
  const st = gameStats(g);
  md += `| ${i + 1} | ${g.opening} | ${g.engineIsWhite ? 'White' : 'Black'} | ${engineResult(g)} (${g.result}) | ${g.plies} | ${g.termination} | ${st.meanT.toFixed(2)} | ${st.dominant} |\n`;
});

md += `\n## Thermodynamics across the match\n\n`;
md += `- Mean bath temperature over all engine moves: **${meanTAll.toFixed(2)}**\n`;
md += `- Phase occupancy: ${PHASES.map(p => `${p} ${(100 * (phaseTotals[p] || 0) / (allTrace.length || 1)).toFixed(0)}%`).join(' · ')}\n`;
md += `- Mean T in won games ${meanT(byOutcome.win).toFixed(2)}, drawn ${meanT(byOutcome.draw).toFixed(2)}, lost ${meanT(byOutcome.loss).toFixed(2)}\n\n`;

md += `## Games\n`;
data.games.forEach((g, i) => {
  const st = gameStats(g);
  md += `\n### Game ${i + 1}: ${g.opening} — engine as ${g.engineIsWhite ? 'White' : 'Black'} — ${g.result}\n\n`;
  md += '```\n' + pgn(g, i) + '\n```\n\n';
  md += `Phases: ${PHASES.map(p => `${p} ${st.phases[p] || 0}`).join(' · ')} · mean T ${st.meanT.toFixed(2)} · max T ${st.maxT.toFixed(2)}\n\n`;
  md += `| ply | move | T | phase | eval (♙) | depth |\n|---|---|---|---|---|---|\n`;
  for (const p of g.trace)
    md += `| ${p.ply} | ${p.san} | ${p.T.toFixed(2)} | ${p.phase} | ${p.evalP >= 0 ? '+' : ''}${p.evalP.toFixed(2)} | ${p.depth} |\n`;
});

fs.writeFileSync(base + '_report.md', md);

// ── Print-ready HTML ───────────────────────────────────────
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Results vs Stockfish ${data.elo}</title><style>
@page { size: A4; margin: 18mm 16mm; }
body { font-family: Georgia, serif; font-size: 9.5pt; line-height: 1.45; color: #1a1a1a; max-width: 178mm; margin: 0 auto; }
h1 { font-size: 17pt; margin: 0 0 4pt; } h2 { font-size: 12pt; margin: 14pt 0 5pt; border-bottom: 1px solid #ddd; page-break-after: avoid; }
h3 { font-size: 10.5pt; margin: 11pt 0 4pt; page-break-after: avoid; }
table { border-collapse: collapse; font-size: 8pt; margin: 5pt 0; }
th, td { border: 1px solid #bbb; padding: 1.5pt 5pt; text-align: center; } th { background: #f0f0f0; }
pre { background: #f6f6f2; padding: 5pt 8pt; font-size: 8pt; white-space: pre-wrap; border-left: 3px solid #999; }
.big { font-size: 13pt; } .meta { color: #666; font-size: 8.5pt; }
.frozen { color: #4a66c0; } .cold { color: #3f96b8; } .critical { color: #b8923f; } .hot { color: #c05548; }
</style></head><body>`;
html += `<h1>Results book: thermodynamic engine vs Stockfish ${data.elo}</h1>`;
html += `<p class="meta">${esc(data.date)} · engine ${data.engineMs} ms/move · Stockfish ${data.sfMs} ms/move at UCI_Elo ${data.elo} · ${data.games.length} games (full opening book, both colors)</p>`;
html += `<p class="big"><b>Engine ${pts} — ${data.games.length - pts} Stockfish</b> &nbsp;(W ${data.score.engine} / D ${data.score.draws} / L ${data.score.stockfish})</p>`;
html += `<p>Mean bath T over all engine moves ${meanTAll.toFixed(2)} · phase occupancy ${PHASES.map(p => `<span class="${p}">${p} ${(100 * (phaseTotals[p] || 0) / (allTrace.length || 1)).toFixed(0)}%</span>`).join(' · ')}<br>`;
html += `Mean T in won games ${meanT(byOutcome.win).toFixed(2)}, drawn ${meanT(byOutcome.draw).toFixed(2)}, lost ${meanT(byOutcome.loss).toFixed(2)}</p>`;
html += `<h2>Summary</h2><table><tr><th>#</th><th>Opening</th><th>Engine</th><th>Result</th><th>Plies</th><th>Termination</th><th>mean T</th><th>dominant phase</th></tr>`;
data.games.forEach((g, i) => {
  const st = gameStats(g);
  html += `<tr><td>${i + 1}</td><td>${esc(g.opening)}</td><td>${g.engineIsWhite ? 'White' : 'Black'}</td><td>${engineResult(g)} (${g.result})</td><td>${g.plies}</td><td>${esc(g.termination)}</td><td>${st.meanT.toFixed(2)}</td><td class="${st.dominant}">${st.dominant}</td></tr>`;
});
html += `</table><h2>Games</h2>`;
data.games.forEach((g, i) => {
  const st = gameStats(g);
  html += `<h3>Game ${i + 1}: ${esc(g.opening)} — engine as ${g.engineIsWhite ? 'White' : 'Black'} — ${g.result}</h3>`;
  html += `<pre>${esc(pgn(g, i))}</pre>`;
  html += `<p class="meta">phases: ${PHASES.map(p => `<span class="${p}">${p} ${st.phases[p] || 0}</span>`).join(' · ')} · mean T ${st.meanT.toFixed(2)} · max T ${st.maxT.toFixed(2)}</p>`;
  html += `<table><tr><th>ply</th><th>move</th><th>T</th><th>phase</th><th>eval ♙</th><th>d</th></tr>`;
  for (const p of g.trace)
    html += `<tr><td>${p.ply}</td><td>${esc(p.san)}</td><td>${p.T.toFixed(2)}</td><td class="${p.phase}">${p.phase}</td><td>${p.evalP >= 0 ? '+' : ''}${p.evalP.toFixed(2)}</td><td>${p.depth}</td></tr>`;
  html += `</table>`;
});
html += `</body></html>`;
fs.writeFileSync(base + '_report.html', html);

console.log('wrote', base + '_report.md');
console.log('wrote', base + '_report.html');
