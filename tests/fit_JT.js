// Temperature-resolved, precision-weighted Curie–Weiss refit: J(T), b(T),
// and the criticality ratio J·b/2T along the cooling protocol.
//
// Input: a cooling_scan.json (self-play at several time controls, flux in
// 'measure' mode, quadruples [β, Δμ, n_tax, n_μ] per candidate). Each β is
// a proportion estimated from n_tax taxed nodes, so Var(β) ≈ (1−β²)/n_tax:
// readings are weighted by w = n_tax / (1 − β² + ε) — the better data the
// user asked for, replacing the unweighted fit on count-less triples.
//
// Fits per rung (time control = protocol temperature) and pooled:
//   M3: β = b·tanh((Δμ + Jβ)/2T)   (forward fixed-point, weighted MSE)
// with move-level bootstrap CIs, then the verdict: does J·b/2T cross 1
// (spontaneous initiative polarization) as the bath cools?
//
//   node fit_JT.js [results/cooling_scan.json]
const fs = require('fs');
const path = require('path');
const IN = path.resolve(process.argv[2] || path.join(__dirname, 'results', 'cooling_scan.json'));
const data = require(IN);

function predict(dmu, T, J, b) {
  let x = Math.sign(dmu) * 0.5 * b || 0;
  for (let it = 0; it < 40; it++) {
    const nx = b * Math.tanh((dmu + J * x) / (2 * T));
    if (Math.abs(nx - x) < 1e-10) return nx;
    x = 0.5 * x + 0.5 * nx;
  }
  return x;
}
function wsse(sample, J, b) {
  let s = 0, W = 0;
  for (const m of sample) for (const [beta, dmu, w] of m.pts) {
    const p = predict(dmu, m.T, J, b);
    s += w * (beta - p) ** 2; W += w;
  }
  return s / W;
}
function fit(sample) {
  let best = { J: 0, b: 1, mse: Infinity };
  for (let J = 0; J <= 8; J += 0.25) for (let b = 0.4; b <= 1.0001; b += 0.05) {
    const m = wsse(sample, J, b);
    if (m < best.mse) best = { J, b, mse: m };
  }
  for (const st of [0.1, 0.02])
    for (let i = -5; i <= 5; i++) for (let k = -5; k <= 5; k++) {
      const J = Math.max(0, best.J + i * st * 2.5), b = Math.min(1, Math.max(0.2, best.b + k * st));
      const m = wsse(sample, J, b);
      if (m < best.mse) best = { J, b, mse: m };
    }
  return best;
}
function bootstrap(sample, M3, reps = 60) {
  const Js = [], Bs = [];
  for (let r = 0; r < reps; r++) {
    const s = Array.from({ length: sample.length },
      () => sample[Math.floor(Math.random() * sample.length)]);
    let best = { J: M3.J, b: M3.b, mse: Infinity };
    for (let J = Math.max(0, M3.J - 1.75); J <= M3.J + 1.75; J += 0.25)
      for (let b = Math.max(0.3, M3.b - 0.12); b <= Math.min(1, M3.b + 0.12); b += 0.03) {
        const m = wsse(s, J, b);
        if (m < best.mse) best = { J, b, mse: m };
      }
    Js.push(best.J); Bs.push(best.b);
  }
  Js.sort((a, b) => a - b); Bs.sort((a, b) => a - b);
  const ci = a => [a[Math.floor(0.025 * a.length)], a[Math.floor(0.975 * a.length)]];
  return { J: ci(Js), b: ci(Bs) };
}

// collect per rung: moves with weighted points. Robust cut: the shared-bath
// self-play thermometer has a runaway tail (T up to ~10^4 in decided
// positions — the T·lnW feedback; see the doc's instrument-limitations
// note). Moves hotter than TMAX carry no initiative information (all their
// x = Δμ/2T collapse to 0) and are excluded, with the count reported.
const TMAX = parseFloat(process.env.TMAX || '50');
let cutMoves = 0, cutReadings = 0, keptReadings = 0;
const rungs = [];
for (const rung of data.rungs) {
  const movesArr = [];
  for (const g of rung.games) for (const rec of g.trace) {
    if (!rec.triples || !rec.T || rec.T <= 0) continue;
    if (rec.T > TMAX) { cutMoves++; cutReadings += rec.triples.length; continue; }
    const pts = [];
    for (const q of rec.triples) {
      const [beta, dmu, ntax] = q;
      if (!Number.isFinite(beta) || !Number.isFinite(dmu)) continue;
      const w = (ntax || 1) / (1 - beta * beta + 0.05);
      pts.push([beta, dmu, w]);
    }
    if (pts.length) { movesArr.push({ T: rec.T, pts }); keptReadings += pts.length; }
  }
  if (movesArr.length) rungs.push({ ms: rung.ms, movesArr });
}
console.log(`robust cut at T > ${TMAX}: dropped ${cutMoves} moves / ${cutReadings} readings (runaway tail), kept ${keptReadings} readings`);

console.log('rung      moves  readings   ⟨T⟩      J     b      J·b/2T   (95% CI on J)');
const rows = [];
for (const r of rungs) {
  const n = r.movesArr.reduce((s, m) => s + m.pts.length, 0);
  const meanT = r.movesArr.reduce((s, m) => s + m.T, 0) / r.movesArr.length;
  const M3 = fit(r.movesArr);
  const ci = bootstrap(r.movesArr, M3);
  const ratio = M3.J * M3.b / (2 * meanT);
  rows.push({ ms: r.ms, meanT, ...M3, ci, ratio, n, moves: r.movesArr.length });
  console.log(`${(r.ms + 'ms').padEnd(9)}${String(r.movesArr.length).padStart(6)}${String(n).padStart(9)}` +
    `${meanT.toFixed(2).padStart(8)}${M3.J.toFixed(2).padStart(7)}${M3.b.toFixed(2).padStart(6)}` +
    `${ratio.toFixed(2).padStart(9)}     [${ci.J[0].toFixed(2)} … ${ci.J[1].toFixed(2)}]`);
}
// pooled fit across all rungs (each move keeps its own T — the model is
// already temperature-explicit, so pooling is legitimate)
const all = rungs.flatMap(r => r.movesArr);
const M3all = fit(all);
const ciAll = bootstrap(all, M3all, 80);
const meanTall = all.reduce((s, m) => s + m.T, 0) / all.length;
console.log(`${'pooled'.padEnd(9)}${String(all.length).padStart(6)}${String(all.reduce((s, m) => s + m.pts.length, 0)).padStart(9)}` +
  `${meanTall.toFixed(2).padStart(8)}${M3all.J.toFixed(2).padStart(7)}${M3all.b.toFixed(2).padStart(6)}` +
  `${(M3all.J * M3all.b / (2 * meanTall)).toFixed(2).padStart(9)}     [${ciAll.J[0].toFixed(2)} … ${ciAll.J[1].toFixed(2)}]`);

// ── the physical view: bin MOVES by their own bath temperature, pooled
// across rungs. The protocol rungs turned out to shift the composition of
// positions more than the median bath (cold bulk + runaway tail at every
// rung), so criticality must be interrogated where the cold moves actually
// live, whatever rung produced them.
console.log('\nT-binned fits (quantile bins over moves, pooled across rungs):');
console.log('T range        moves  readings   ⟨T⟩      J     b      J·b/2T   (95% CI on J)');
const sortedMoves = all.slice().sort((a, b) => a.T - b.T);
const NBINS = 5, per = Math.floor(sortedMoves.length / NBINS);
const tbins = [];
for (let i = 0; i < NBINS; i++) {
  const seg = sortedMoves.slice(i * per, i === NBINS - 1 ? sortedMoves.length : (i + 1) * per);
  if (seg.length < 20) continue;
  const meanT = seg.reduce((s, m) => s + m.T, 0) / seg.length;
  const M3 = fit(seg);
  const ci = bootstrap(seg, M3);
  const ratio = M3.J * M3.b / (2 * meanT);
  tbins.push({ lo: seg[0].T, hi: seg[seg.length - 1].T, meanT, ...M3, ci, ratio,
               n: seg.reduce((s, m) => s + m.pts.length, 0), moves: seg.length });
  console.log(`${(seg[0].T.toFixed(2) + '–' + seg[seg.length - 1].T.toFixed(2)).padEnd(13)}` +
    `${String(seg.length).padStart(6)}${String(tbins[tbins.length - 1].n).padStart(9)}` +
    `${meanT.toFixed(2).padStart(8)}${M3.J.toFixed(2).padStart(7)}${M3.b.toFixed(2).padStart(6)}` +
    `${ratio.toFixed(2).padStart(9)}     [${ci.J[0].toFixed(2)} … ${ci.J[1].toFixed(2)}]`);
}

const crossed = tbins.some(r => r.ratio >= 1);
const coldward = tbins.length >= 2 ? (tbins[0].ratio - tbins[tbins.length - 1].ratio) : 0;
console.log('\nVERDICT: ' + (crossed
  ? 'the COLD bins CROSS the Curie point — spontaneous initiative polarization in the frozen regime.'
  : `subcritical in every T bin; the ratio ${coldward > 0.02 ? 'RISES toward the Curie point as moves freeze' : coldward < -0.02 ? 'falls as moves freeze' : 'is flat in T'} ` +
    `(cold → hot: ${tbins.map(r => r.ratio.toFixed(2)).join(' → ')}).`));

// ── SVG: criticality ratio vs ⟨T⟩ (T-binned, log-T axis) with the Curie line ──
const W = 760, H = 460, PAD = 60;
const lx = t => Math.log10(t);
const xmin = lx(tbins[0].meanT) - 0.08, xmax = lx(tbins[tbins.length - 1].meanT) + 0.08;
const ymax = Math.max(1.2, ...tbins.map(r => r.ratio * r.ci.J[1] / Math.max(r.J, 1e-9))) + 0.1;
const X = t => PAD + (lx(t) - xmin) / (xmax - xmin) * (W - 2 * PAD);
const Y = y => H - PAD - y / ymax * (H - 2 * PAD);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#0f0f1a;font-family:Georgia,serif">`;
svg += `<text x="${W / 2}" y="24" fill="#e0e0e0" text-anchor="middle" font-size="17">Criticality ratio J·b/2T vs move temperature</text>`;
svg += `<text x="${W / 2}" y="42" fill="#888" text-anchor="middle" font-size="12">self-play cooling scan, ${all.length} moves in ${tbins.length} temperature bins · precision-weighted Curie–Weiss refit per bin · Curie point at ratio = 1</text>`;
svg += `<line x1="${PAD}" y1="${Y(0)}" x2="${W - PAD}" y2="${Y(0)}" stroke="#3a3a5e"/>`;
svg += `<line x1="${PAD}" y1="${Y(1)}" x2="${W - PAD}" y2="${Y(1)}" stroke="#c25b5b" stroke-dasharray="6 4"/>`;
svg += `<text x="${W - PAD}" y="${Y(1) - 6}" fill="#c25b5b" font-size="11" text-anchor="end">Curie point (spontaneous initiative)</text>`;
for (const yv of [0.25, 0.5, 0.75, 1]) svg += `<text x="${PAD - 8}" y="${Y(yv) + 4}" fill="#666" font-size="10" text-anchor="end">${yv}</text>`;
for (const r of tbins) svg += `<text x="${X(r.meanT)}" y="${H - PAD + 16}" fill="#666" font-size="10" text-anchor="middle">${r.meanT.toFixed(2)}</text>`;
svg += `<text x="${W / 2}" y="${H - 10}" fill="#888" font-size="12" text-anchor="middle">⟨T⟩ per bin (log axis) — colder to the left</text>`;
let d = '';
for (let i = 0; i < tbins.length; i++) d += (i ? 'L' : 'M') + X(tbins[i].meanT).toFixed(1) + ',' + Y(tbins[i].ratio).toFixed(1);
svg += `<path d="${d}" stroke="#7ee3a0" stroke-width="2" fill="none"/>`;
for (const r of tbins) {
  const rl = r.ratio * r.ci.J[0] / Math.max(r.J, 1e-9), rh = r.ratio * r.ci.J[1] / Math.max(r.J, 1e-9);
  svg += `<line x1="${X(r.meanT)}" y1="${Y(rl)}" x2="${X(r.meanT)}" y2="${Y(rh)}" stroke="#7ee3a0" stroke-width="1" opacity="0.6"/>`;
  svg += `<circle cx="${X(r.meanT)}" cy="${Y(r.ratio)}" r="4.2" fill="#7ee3a0"/>`;
}
svg += `</svg>`;
const out = IN.replace(/\.json$/, '_JT.svg');
fs.writeFileSync(out, svg);
console.log('plot written:', out);
