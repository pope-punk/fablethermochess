// Extracts the td-engine script from the app HTML into engine_current.js
// so the harness always tests exactly what the page runs.
const fs = require('fs');
const path = require('path');

// Default source is the canonical app (chess_thermo_jhat.html) so every
// recorded result reproduces exactly. ENGINE_SRC selects a different app —
// e.g. ENGINE_SRC=chess_thermo_gge.html to suite-test the GGE engine shell.
const htmlPath = path.join(__dirname, '..', process.env.ENGINE_SRC || 'chess_thermo_jhat.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/<script id="td-engine">([\s\S]*?)<\/script>/);
if (!m) { console.error('td-engine script not found in HTML'); process.exit(1); }

const exports_ = `
module.exports = { Chess, _runAnalyze, staticEval: g => staticEval(g),
  measureSchottky: (...a) => measureSchottky(...a),
  jhatReset: (...a) => jhatReset(...a), jhatUpdate: (...a) => jhatUpdate(...a),
  jhatRead: (...a) => jhatRead(...a),
  get searchStats() { return searchStats; }, get bathT() { return bathT; } };
`;
fs.writeFileSync(path.join(__dirname, 'engine_current.js'), m[1] + exports_);
console.log('extracted engine_current.js (' + m[1].length + ' chars)');
