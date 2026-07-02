// Equation-of-state test: is the initiative a thermal two-level degree of
// freedom? If the "tempo spin" (who owns the forcing future) equilibrates
// with the bath, its polarization must satisfy
//     β = tanh( Δμ / 2T )
// with all three quantities measured independently: β from taxed-node
// counts, Δμ from the softplus μ-field averages, T from the annealing
// thermometer. This script reads a flux-mode gauntlet JSON, bins the
// (x = Δμ/2T, y = β) pairs, compares binned means against tanh, and emits
// an SVG plot plus summary statistics.
//   node eos_test.js [results/vs_sf1500_flux.json]
const fs = require('fs');
const path = require('path');
const IN = path.resolve(process.argv[2] || path.join(__dirname, 'results', 'vs_sf1500_flux.json'));
const data = require(IN);

// Collect (x, y) pairs
const pts = [];
for (const g of data.games) for (const rec of g.trace) {
  if (!rec.triples || !rec.T) continue;
  for (const [beta, dmu] of rec.triples) {
    const x = dmu / (2 * rec.T);
    if (Number.isFinite(x) && Number.isFinite(beta)) pts.push([x, beta]);
  }
}
console.log('pairs collected:', pts.length);
if (pts.length < 100) { console.log('not enough data'); process.exit(1); }

// Pearson correlation of y against tanh(x)
let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
for (const [x, y] of pts) {
  const t = Math.tanh(x);
  sx += t; sy += y; sxx += t * t; syy += y * y; sxy += t * y;
}
const n = pts.length;
const r = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
console.log('Pearson r( β , tanh(Δμ/2T) ) =', r.toFixed(4));

// Binned means (equal-count bins in x)
const sorted = pts.slice().sort((a, b) => a[0] - b[0]);
const NB = 24, per = Math.floor(n / NB);
const bins = [];
for (let b = 0; b < NB; b++) {
  const seg = sorted.slice(b * per, (b + 1) * per);
  if (!seg.length) continue;
  const mx = seg.reduce((s, p) => s + p[0], 0) / seg.length;
  const my = seg.reduce((s, p) => s + p[1], 0) / seg.length;
  const sd = Math.sqrt(seg.reduce((s, p) => s + (p[1] - my) ** 2, 0) / seg.length);
  bins.push({ x: mx, y: my, sd, pred: Math.tanh(mx), n: seg.length });
}
console.log('\n  x=Δμ/2T   ⟨β⟩      tanh(x)   σ(β)    n');
for (const b of bins)
  console.log(' ', b.x.toFixed(2).padStart(6), b.y.toFixed(3).padStart(8),
              b.pred.toFixed(3).padStart(8), b.sd.toFixed(3).padStart(7), String(b.n).padStart(6));

// RMS deviation of binned means from tanh
const rms = Math.sqrt(bins.reduce((s, b) => s + (b.y - b.pred) ** 2, 0) / bins.length);
console.log('\nRMS deviation of binned ⟨β⟩ from tanh:', rms.toFixed(4));

// ── SVG plot: scatter (subsampled), binned means, tanh curve ──
const W = 760, H = 520, PAD = 55;
const xmin = Math.max(-4, sorted[0][0]), xmax = Math.min(4, sorted[n - 1][0]);
const X = x => PAD + (Math.max(xmin, Math.min(xmax, x)) - xmin) / (xmax - xmin) * (W - 2 * PAD);
const Y = y => H - PAD - (y + 1) / 2 * (H - 2 * PAD);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#0f0f1a;font-family:Georgia,serif">`;
svg += `<text x="${W / 2}" y="24" fill="#e0e0e0" text-anchor="middle" font-size="17">Equation of state of the initiative: β vs tanh(Δμ/2T)</text>`;
svg += `<text x="${W / 2}" y="42" fill="#888" text-anchor="middle" font-size="12">${n} candidate-move readings, 12 games vs Stockfish ${data.elo} · r = ${r.toFixed(3)} · binned RMS = ${rms.toFixed(3)}</text>`;
// axes
svg += `<line x1="${PAD}" y1="${Y(0)}" x2="${W - PAD}" y2="${Y(0)}" stroke="#3a3a5e"/>`;
svg += `<line x1="${X(0)}" y1="${PAD}" x2="${X(0)}" y2="${H - PAD}" stroke="#3a3a5e"/>`;
for (const yv of [-1, -0.5, 0.5, 1])
  svg += `<text x="${X(0) - 8}" y="${Y(yv) + 4}" fill="#666" font-size="10" text-anchor="end">${yv}</text>`;
for (const xv of [-3, -2, -1, 1, 2, 3])
  if (xv > xmin && xv < xmax) svg += `<text x="${X(xv)}" y="${Y(0) + 14}" fill="#666" font-size="10" text-anchor="middle">${xv}</text>`;
svg += `<text x="${W - PAD}" y="${Y(0) - 8}" fill="#888" font-size="12" text-anchor="end">Δμ / 2T</text>`;
svg += `<text x="${X(0) + 8}" y="${PAD + 6}" fill="#888" font-size="12">β (measured flux)</text>`;
// scatter, subsampled
const step = Math.max(1, Math.floor(n / 2500));
for (let i = 0; i < n; i += step) {
  const [x, y] = sorted[i];
  if (x < xmin || x > xmax) continue;
  svg += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.4" fill="#7ec8e3" opacity="0.18"/>`;
}
// tanh prediction
let d = '';
for (let i = 0; i <= 200; i++) {
  const x = xmin + (xmax - xmin) * i / 200;
  d += (i ? 'L' : 'M') + X(x).toFixed(1) + ',' + Y(Math.tanh(x)).toFixed(1);
}
svg += `<path d="${d}" stroke="#e0a458" stroke-width="2.2" fill="none"/>`;
// binned means with error bars (σ/√n)
for (const b of bins) {
  if (b.x < xmin || b.x > xmax) continue;
  const se = b.sd / Math.sqrt(b.n);
  svg += `<line x1="${X(b.x)}" y1="${Y(b.y - se)}" x2="${X(b.x)}" y2="${Y(b.y + se)}" stroke="#e0e0ea" stroke-width="1.2"/>`;
  svg += `<circle cx="${X(b.x)}" cy="${Y(b.y)}" r="3.4" fill="#e0e0ea"/>`;
}
svg += `<text x="${PAD}" y="${H - 14}" fill="#7ec8e3" font-size="11">● readings</text>`;
svg += `<text x="${PAD + 90}" y="${H - 14}" fill="#e0e0ea" font-size="11">● binned ⟨β⟩ ± SE</text>`;
svg += `<text x="${PAD + 230}" y="${H - 14}" fill="#e0a458" font-size="11">— tanh(Δμ/2T), zero free parameters</text>`;
svg += `</svg>`;
const out = IN.replace(/\.json$/, '_eos.svg');
fs.writeFileSync(out, svg);
console.log('plot written:', out);
