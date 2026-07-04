// A/B comparison of two vs_stockfish results files (e.g. probe off vs on).
//   node ab_compare.js results/vs_sf1500.json results/vs_sf1500_probe.json
const path = require('path');
const A = require(path.resolve(process.argv[2] || path.join(__dirname, 'results', 'vs_sf1500.json')));
const B = require(path.resolve(process.argv[3] || path.join(__dirname, 'results', 'vs_sf1500_probe.json')));

function stats(data) {
  const games = data.games;
  let pts = 0, castles = 0, castlePlies = [], lossByMate = 0, engMoves = 0;
  let sumT = 0, sumChi = 0, chiN = 0, sumW = 0, wN = 0;
  for (const g of games) {
    const r = g.result === '1/2-1/2' ? 0.5 : ((g.result === '1-0') === g.engineIsWhite ? 1 : 0);
    pts += r;
    if (r === 0 && g.termination === 'checkmate') lossByMate++;
    const all = g.line.concat(g.moves);
    for (let i = 0; i < all.length; i++) {
      const isEng = (i % 2 === 0) === g.engineIsWhite;
      if (isEng && /^O-O/.test(all[i])) { castles++; castlePlies.push(i + 1); }
    }
    for (const p of g.trace) {
      engMoves++; sumT += p.T;
      if (p.chi != null) { sumChi += p.chi; chiN++; }
      if (p.w != null) { sumW += p.w; wN++; }
    }
  }
  return {
    label: (data.probe ? 'probe ON ' : data.flux ? 'flux ON  ' : 'baseline ') + ' @ Elo ' + data.elo,
    score: `${pts} / ${games.length}  (W${data.score.engine} D${data.score.draws} L${data.score.stockfish})`,
    castles: castles + (castlePlies.length ? ` (plies ${castlePlies.join(', ')})` : ''),
    lossesByMate: lossByMate,
    meanT: (sumT / engMoves).toFixed(2),
    meanChosenChi: chiN ? (sumChi / chiN).toFixed(2) : '—',
    meanW: wN ? (sumW / wN).toFixed(3) : '—',
  };
}

const a = stats(A), b = stats(B);
const keys = ['label', 'score', 'castles', 'lossesByMate', 'meanT', 'meanChosenChi', 'meanW'];
const wcol = 34;
console.log(''.padEnd(16) + 'A: '.padEnd(4) + a.label.padEnd(wcol) + 'B: ' + b.label);
for (const k of keys.slice(1))
  console.log(k.padEnd(16) + '    ' + String(a[k]).padEnd(wcol) + '    ' + String(b[k]));
