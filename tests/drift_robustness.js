// drift_robustness.js — does the equilibrium-drift result survive the lab's own
// robust thermal-runaway cut, and is β a clean premium-persistence measure?
// Post-hoc re-analysis of equilibrium_drift_d<N>.json (no re-search).
//   node tests/drift_robustness.js [depth]
const fs = require('fs'), path = require('path');
const D = parseInt(process.argv[2] || '3', 10);
const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'results', 'equilibrium_drift_d' + D + '.json'), 'utf8'));
const rows = j.drifts;

function pearson(xy) { xy = xy.filter(p => isFinite(p[0]) && isFinite(p[1])); const n = xy.length; if (n < 3) return NaN;
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of xy) { sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; }
  const d = Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)); return d === 0 ? NaN : (n * sxy - sx * sy) / d; }
function slope(xy) { xy = xy.filter(p => isFinite(p[0]) && isFinite(p[1])); const n = xy.length; if (n < 3) return NaN;
  let sx = 0, sy = 0, sxx = 0, sxy = 0; for (const [x, y] of xy) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx); }
function spearman(xy) { const rank = arr => { const idx = arr.map((v, i) => i).sort((a, b) => arr[a] - arr[b]); const r = []; idx.forEach((v, k) => r[v] = k); return r; };
  const rx = rank(xy.map(p => p[0])), ry = rank(xy.map(p => p[1])); return pearson(rx.map((v, i) => [v, ry[i]])); }
const rms = a => Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length);
const median = a => { const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const medAbs = a => median(a.map(Math.abs));

console.log(`\n=== drift robustness, depth ${D}, n=${rows.length} ===\n`);
console.log('Tbath distribution: max=' + Math.max(...rows.map(r => r.Tbath)).toFixed(1) +
  '  >8: ' + rows.filter(r => r.Tbath > 8).length + '  >50: ' + rows.filter(r => r.Tbath > 50).length);

for (const cut of [1e9, 50, 8, 4]) {
  const R = rows.filter(r => r.Tbath < cut);
  const dQ = R.map(r => r.dF - r.dTS); // Δ⟨Q⟩ = ΔF − ΔTS
  console.log(`\n── T < ${cut === 1e9 ? '∞ (no cut)' : cut}   n=${R.length} ──`);
  console.log('  corr(premium, ΔF)   Pearson=' + pearson(R.map(r => [r.premium, r.dF])).toFixed(3) +
    '  Spearman=' + spearman(R.map(r => [r.premium, r.dF])).toFixed(3) +
    '  β=' + slope(R.map(r => [r.premium, r.dF])).toFixed(3));
  console.log('  corr(premium, ΔTS)  Pearson=' + pearson(R.map(r => [r.premium, r.dTS])).toFixed(3) +
    '  β_TS=' + slope(R.map(r => [r.premium, r.dTS])).toFixed(3) + '   ← clean premium dissipation');
  console.log('  corr(premium, Δ⟨Q⟩) Pearson=' + pearson(R.map((r, i) => [r.premium, dQ[i]])).toFixed(3) +
    '   ← energy part of the ΔF correlation');
  console.log('  med|ΔF|=' + medAbs(R.map(r => r.dF)).toFixed(3) + '  med|ΔTS|=' + medAbs(R.map(r => r.dTS)).toFixed(3) +
    '  med|Δ⟨Q⟩|=' + medAbs(dQ).toFixed(3) + '   RMS(ΔF)=' + rms(R.map(r => r.dF)).toFixed(2));
  // F* re-check within cut
  const rFm = medAbs(R.map(r => r.dF)), rFsm = medAbs(R.map(r => r.dFstar));
  console.log('  F*: med|ΔF*|/med|ΔF|=' + (rFsm / rFm).toFixed(2) + '  corr(prem,ΔF*)=' + pearson(R.map(r => [r.premium, r.dFstar])).toFixed(3));
}

// premium-persistence, properly: from ΔTS not ΔF. persistence = 1 + β_TS
console.log('\n── clean premium persistence (from ΔTS) ──');
for (const cut of [1e9, 8]) {
  const R = rows.filter(r => r.Tbath < cut);
  const bTS = slope(R.map(r => [r.premium, r.dTS]));
  console.log(`  T<${cut === 1e9 ? '∞' : cut}: β_TS=${bTS.toFixed(3)} ⇒ premium persistence 1+β_TS = ${(1 + bTS).toFixed(3)}`);
}
