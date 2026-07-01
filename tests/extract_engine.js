// Extracts the td-engine script from the app HTML into engine_current.js
// so the harness always tests exactly what the page runs.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'chess_thermo_sf (10).html');
const html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/<script id="td-engine">([\s\S]*?)<\/script>/);
if (!m) { console.error('td-engine script not found in HTML'); process.exit(1); }

const exports_ = `
module.exports = { Chess, _runAnalyze, staticEval: g => staticEval(g),
  measureSchottky: (...a) => measureSchottky(...a),
  get searchStats() { return searchStats; }, get bathT() { return bathT; } };
`;
fs.writeFileSync(path.join(__dirname, 'engine_current.js'), m[1] + exports_);
console.log('extracted engine_current.js (' + m[1].length + ' chars)');
