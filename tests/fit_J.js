// Solve for J: fit the Curie–Weiss equation of state of the initiative,
//     β = b · tanh( (Δμ + J·β) / 2T )
// to the flux-gauntlet readings. J is the self-coupling of the initiative
// (momentum: how much holding the forcing future amplifies itself); b is
// the saturation polarization (alternation depolarization: even crushing
// attacks contain replies that tax the attacker; b = 1 is the ideal
// two-level system). Nested models:
//   M0: β = tanh(Δμ/2T)              (0 parameters — the pure prediction)
//   M1: β = tanh((Δμ + Jβ)/2T)       (J)
//   M2: β = b·tanh(Δμ/2T)            (b)
//   M3: β = b·tanh((Δμ + Jβ)/2T)     (J, b)
// Fitting: forward fixed-point predictions (no artanh selection bias),
// grid + local refinement on SSE. Errors: bootstrap resampling MOVES
// (readings within one position are correlated), refitting locally.
//   node fit_J.js [results/vs_sf1500_flux.json]
const fs = require('fs');
const path = require('path');
const IN = path.resolve(process.argv[2] || path.join(__dirname, 'results', 'vs_sf1500_flux.json'));
const data = require(IN);

// points grouped by move (each move = one T, many candidate readings)
const movesArr = [];
for (const g of data.games) for (const rec of g.trace) {
  if (!rec.triples || !rec.T || rec.T <= 0) continue;
  const pts = rec.triples.filter(([b, d]) => Number.isFinite(b) && Number.isFinite(d));
  if (pts.length) movesArr.push({ T: rec.T, pts });
}
const NPTS = movesArr.reduce((s, m) => s + m.pts.length, 0);
console.log('moves:', movesArr.length, ' readings:', NPTS);

// forward solve β = b·tanh((Δμ + Jβ)/2T); take the branch continuous from
// sign(Δμ) (the physical one when J is supercritical and bistable)
function predict(dmu, T, J, b) {
  let x = Math.sign(dmu) * 0.5 * b || 0;
  for (let it = 0; it < 40; it++) {
    const nx = b * Math.tanh((dmu + J * x) / (2 * T));
    if (Math.abs(nx - x) < 1e-10) return nx;
    x = 0.5 * x + 0.5 * nx;   // damped: near-critical J oscillates undamped
  }
  return x;
}

function sse(sample, J, b) {
  let s = 0, n = 0;
  for (const m of sample) for (const [beta, dmu] of m.pts) {
    const p = predict(dmu, m.T, J, b);
    s += (beta - p) ** 2; n++;
  }
  return s / n;   // mean squared error
}

function fit(sample, fitJ, fitB) {
  let best = { J: 0, b: 1, mse: Infinity };
  const Js = fitJ ? Array.from({ length: 33 }, (_, i) => i * 0.25) : [0];   // 0..8
  const Bs = fitB ? Array.from({ length: 13 }, (_, i) => 0.4 + i * 0.05) : [1];
  for (const J of Js) for (const b of Bs) {
    const m = sse(sample, J, b);
    if (m < best.mse) best = { J, b, mse: m };
  }
  // local refinement, two rounds
  for (const stepScale of [0.1, 0.02]) {
    for (const J of fitJ ? Array.from({ length: 11 }, (_, i) => Math.max(0, best.J + (i - 5) * stepScale * 2.5)) : [best.J])
      for (const b of fitB ? Array.from({ length: 11 }, (_, i) => Math.min(1, Math.max(0.2, best.b + (i - 5) * stepScale))) : [best.b]) {
        const m = sse(sample, J, b);
        if (m < best.mse) best = { J, b, mse: m };
      }
  }
  return best;
}

const M0 = { J: 0, b: 1, mse: sse(movesArr, 0, 1) };
const M1 = fit(movesArr, true, false);
const M2 = fit(movesArr, false, true);
const M3 = fit(movesArr, true, true);
console.log('\nmodel                       J        b       MSE      ΔMSE vs M0');
const row = (name, m) => console.log(name.padEnd(26), m.J.toFixed(2).padStart(5), m.b.toFixed(2).padStart(8),
  m.mse.toFixed(4).padStart(9), ('−' + (100 * (1 - m.mse / M0.mse)).toFixed(1) + '%').padStart(11));
row('M0 pure tanh', M0);
row('M1 Curie–Weiss (J)', M1);
row('M2 saturation (b)', M2);
row('M3 both (J, b)', M3);

// mean T for the criticality comparison: spontaneous polarization iff J·b > 2T
let sumT = 0; for (const m of movesArr) sumT += m.T;
const meanT = sumT / movesArr.length;
console.log('\nmean bath T =', meanT.toFixed(2), ' → critical coupling J_c = 2T/b =', (2 * meanT / M3.b).toFixed(2));
console.log('fitted J·b/2T =', (M3.J * M3.b / (2 * meanT)).toFixed(2), (M3.J * M3.b > 2 * meanT ? '(SUPERCRITICAL: spontaneous initiative)' : '(subcritical)'));

// bootstrap over moves, local refit around M3
const REPS = 120;
const Js = [], Bs = [];
for (let r = 0; r < REPS; r++) {
  const sample = Array.from({ length: movesArr.length },
    () => movesArr[Math.floor(Math.random() * movesArr.length)]);
  let best = { J: M3.J, b: M3.b, mse: Infinity };
  for (let J = Math.max(0, M3.J - 1.5); J <= M3.J + 1.5; J += 0.25)
    for (let b = Math.max(0.3, M3.b - 0.12); b <= Math.min(1, M3.b + 0.12); b += 0.03) {
      const m = sse(sample, J, b);
      if (m < best.mse) best = { J, b, mse: m };
    }
  Js.push(best.J); Bs.push(best.b);
}
Js.sort((a, b) => a - b); Bs.sort((a, b) => a - b);
const ci = a => [a[Math.floor(0.025 * a.length)], a[Math.floor(0.975 * a.length)]];
const [Jlo, Jhi] = ci(Js), [Blo, Bhi] = ci(Bs);
console.log(`\nJ = ${M3.J.toFixed(2)}  (95% CI ${Jlo.toFixed(2)} … ${Jhi.toFixed(2)})  [bootstrap over ${movesArr.length} moves, ${REPS} reps]`);
console.log(`b = ${M3.b.toFixed(2)}  (95% CI ${Blo.toFixed(2)} … ${Bhi.toFixed(2)})`);

// ── plot: binned data + M0 and M3 curves at the median T ──
const flat = [];
for (const m of movesArr) for (const [beta, dmu] of m.pts) flat.push([dmu / (2 * m.T), beta, dmu, m.T]);
flat.sort((a, b) => a[0] - b[0]);
const NB = 24, per = Math.floor(flat.length / NB), bins = [];
for (let i = 0; i < NB; i++) {
  const seg = flat.slice(i * per, (i + 1) * per);
  if (!seg.length) continue;
  const mx = seg.reduce((s, p) => s + p[0], 0) / seg.length;
  const my = seg.reduce((s, p) => s + p[1], 0) / seg.length;
  const se = Math.sqrt(seg.reduce((s, p) => s + (p[1] - my) ** 2, 0) / seg.length) / Math.sqrt(seg.length);
  bins.push({ x: mx, y: my, se });
}
const Ts = movesArr.map(m => m.T).sort((a, b) => a - b);
const medT = Ts[Math.floor(Ts.length / 2)];
const W = 760, H = 520, PAD = 55, xmin = -3, xmax = 3;
const X = x => PAD + (Math.max(xmin, Math.min(xmax, x)) - xmin) / (xmax - xmin) * (W - 2 * PAD);
const Y = y => H - PAD - (y + 1) / 2 * (H - 2 * PAD);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#0f0f1a;font-family:Georgia,serif">`;
svg += `<text x="${W / 2}" y="24" fill="#e0e0e0" text-anchor="middle" font-size="17">Curie–Weiss fit: the self-coupling of the initiative</text>`;
svg += `<text x="${W / 2}" y="42" fill="#888" text-anchor="middle" font-size="12">β = b·tanh((Δμ + Jβ)/2T) · J = ${M3.J.toFixed(2)} [${Jlo.toFixed(2)}…${Jhi.toFixed(2)}], b = ${M3.b.toFixed(2)} · curves drawn at median T = ${medT.toFixed(2)}</text>`;
svg += `<line x1="${PAD}" y1="${Y(0)}" x2="${W - PAD}" y2="${Y(0)}" stroke="#3a3a5e"/>`;
svg += `<line x1="${X(0)}" y1="${PAD}" x2="${X(0)}" y2="${H - PAD}" stroke="#3a3a5e"/>`;
for (const yv of [-1, -0.5, 0.5, 1]) svg += `<text x="${X(0) - 8}" y="${Y(yv) + 4}" fill="#666" font-size="10" text-anchor="end">${yv}</text>`;
for (const xv of [-2, -1, 1, 2]) svg += `<text x="${X(xv)}" y="${Y(0) + 14}" fill="#666" font-size="10" text-anchor="middle">${xv}</text>`;
svg += `<text x="${W - PAD}" y="${Y(0) - 8}" fill="#888" font-size="12" text-anchor="end">Δμ / 2T</text>`;
const curve = (fn, color, w2) => {
  let d = '';
  for (let i = 0; i <= 240; i++) {
    const x = xmin + (xmax - xmin) * i / 240;
    d += (i ? 'L' : 'M') + X(x).toFixed(1) + ',' + Y(fn(x)).toFixed(1);
  }
  return `<path d="${d}" stroke="${color}" stroke-width="${w2}" fill="none"/>`;
};
svg += curve(x => Math.tanh(x), '#e0a458', 1.6);
svg += curve(x => predict(x * 2 * medT, medT, M3.J, M3.b), '#7ee3a0', 2.4);
for (const b of bins) {
  if (b.x < xmin || b.x > xmax) continue;
  svg += `<line x1="${X(b.x)}" y1="${Y(b.y - b.se)}" x2="${X(b.x)}" y2="${Y(b.y + b.se)}" stroke="#e0e0ea" stroke-width="1.2"/>`;
  svg += `<circle cx="${X(b.x)}" cy="${Y(b.y)}" r="3.4" fill="#e0e0ea"/>`;
}
svg += `<text x="${PAD}" y="${H - 14}" fill="#e0e0ea" font-size="11">● binned ⟨β⟩ ± SE</text>`;
svg += `<text x="${PAD + 130}" y="${H - 14}" fill="#e0a458" font-size="11">— pure tanh (J=0, b=1)</text>`;
svg += `<text x="${PAD + 290}" y="${H - 14}" fill="#7ee3a0" font-size="11">— Curie–Weiss fit</text>`;
svg += `</svg>`;
const out = IN.replace(/\.json$/, '_cw.svg');
fs.writeFileSync(out, svg);
console.log('plot written:', out);
