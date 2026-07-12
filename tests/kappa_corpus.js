// kappa_corpus.js — does κ = T̂_them/T_us generalize, and where does it break?
// Pre-registered with the algebraic confounds bucketed (per CLAUDE.md method).
//
// SELF-INDULGENCE (objective): a position where the soft-F argmax B differs from
// the hard-minimax (max backup) argmax S, and B is materially worse by the hard
// eval (hard(B) < hard(S) − MARGIN). Then B is the indulgent choice, S the sound.
//
// THE CLAIM. Our value of move m is −F_m(T), F_m(T)=maxQ_m+T·s_m over the opponent
// child's move values. As we cool the opponent (T↓), argmin_m F_m walks from
// "min opponent-optionality" (bath) toward "min opponent-best" (T→0 minimax). The
// first flip off B should land on S at T*≈T̂(B-child), so κ=T̂_them/T_us<1.
//
// EXPECTED BEHAVIOUR + ALGEBRAIC CONFOUNDS (each a bucket, counted):
//   CURE      — first flip off B lands on S at T_flip<T_us.  (claim holds)
//   OVERSHOOT — first flip lands on a THIRD move (argmin F_m is non-monotonic;
//               only T→0 reaches true minimax). The Alekhine sweep already showed
//               this (Ng8). Predicted to be common.
//   NO-FLIP   — argmin stays B down to T_min: no premium asymmetry (disease is
//               material, cooling can't fix) or both replies equally peaked.
//   Flags (orthogonal to the bucket):
//   SUB-FLOOR — T_flip < T₀ (≈1.0): the cure needs an opponent temperature below
//               the zero-point floor — unreachable by honest annealing. Predicted
//               common (the Alekhine crossover 0.89 < T₀).
//   KAPPA≥1   — T̂(B-child) ≥ T_us: opponent not more ordered than us; framing fails.
//   ABSORBING — B- or S-child near mate: not thermal (rule 2).
//   HORIZON   — |softMaxQ − hardMaxQ| large at the B-child: the child's maxQ is
//               itself horizon-contaminated, so the derivation rests on a bad number.
//
//   VALIDATION (the formula): in CURE cases, is κ_flip = T_flip/T_us ≈ T̂(B-child)/T_us?
//
//   node tests/kappa_corpus.js
const fs = require('fs'), path = require('path');
const E = require('./engine_current.js');
const PAWN = 2, MATE_NEAR = 100000 - 4096, T0 = 1.0, MARGIN = 0.3, TOPK = 12;

// corpus: sample every position along a spread of opening lines
const LINES = [
  ['e4', 'Nf6', 'e5'], ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4'],
  ['d4', 'd5', 'c4', 'e6', 'Nc3'], ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4'], ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4'],
  ['e4', 'e6', 'd4', 'd5', 'Nc3'], ['e4', 'c6', 'd4', 'd5', 'Nc3'], ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
  ['c4', 'e5', 'Nc3', 'Nf6'], ['d4', 'f5', 'g3'], ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5'],
  ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3'], ['e4', 'Nc6', 'd4', 'd5'], ['Nf3', 'd5', 'c4', 'd4'],
];
const positions = [];
for (const line of LINES) {
  const g = new E.Chess(); const seen = new Set();
  for (let i = 0; i <= line.length; i++) {
    const fen = g.fen();
    if (!g.game_over() && !seen.has(fen)) { positions.push(fen); seen.add(fen); }
    if (i < line.length) { if (!g.move(line[i])) break; }
  }
}

const softmaxF = (Qs, T) => { const mx = Math.max(...Qs); return mx + T * Math.log(Qs.reduce((s, q) => s + Math.exp((q - mx) / T), 0)); };

const buckets = { CURE: [], OVERSHOOT: [], NOFLIP: [] };
const flags = { SUBFLOOR: 0, KAPPA_GE1: 0, ABSORBING: 0, HORIZON: 0 };
let scanned = 0, reproduced = 0;

for (const fen of positions) {
  scanned++;
  const fd = E._runAnalyze({ fen, dashDepth: 4 }).thermo;
  const fh = E._runAnalyze({ fen, dashDepth: 4, backup: 'max' }).thermo;
  if (!fd || !fh) continue;
  const B = fd.moves[fd.bestIdx], S = fh.moves[fh.bestIdx];
  if (B === S) continue;
  const hB = fh.Qs[fh.moves.indexOf(B)], hS = fh.Qs[fh.bestIdx];
  if (!(hB < hS - MARGIN * PAWN)) continue;            // B not materially worse ⇒ not self-indulgence
  reproduced++;
  const Tus = fd.T;

  // top-K our moves by default Q; get each opponent child's Q-array (pinT=Tus) + Schottky + horizon check
  const order = fd.moves.map((m, i) => [m, fd.Qs[i]]).sort((a, b) => b[1] - a[1]).slice(0, TOPK).map(x => x[0]);
  const kids = {};
  let absorbing = false, horizon = false;
  for (const m of order) {
    const g = new E.Chess(fen); g.move(m);
    const t = E._runAnalyze({ fen: g.fen(), dashDepth: 3, pinT: Tus }).thermo;
    const th = E._runAnalyze({ fen: g.fen(), dashDepth: 3, backup: 'max' }).thermo;
    if (!t) continue;
    const softMax = Math.max(...t.Qs), hardMax = th ? Math.max(...th.Qs) : softMax;
    if (Math.abs(softMax) > MATE_NEAR) absorbing = true;
    if (m === B && Math.abs(softMax - hardMax) > 1.5 * PAWN) horizon = true;
    kids[m] = { Qs: t.Qs.slice(), Tspin: t.Tspin };
  }
  if (!kids[B] || !kids[S]) continue;

  // sweep opponent temperature down; our argmax = argmin_m F_m(T)
  let Tflip = null, target = null;
  for (let T = Tus; T >= 0.15; T -= 0.02) {
    let best = null, bestF = Infinity;
    for (const m of order) { if (!kids[m]) continue; const f = softmaxF(kids[m].Qs, T); if (f < bestF) { bestF = f; best = m; } }
    if (best !== B) { Tflip = T; target = best; break; }
  }
  const That = kids[B].Tspin;
  const rec = { fen, B, S, Tus: +Tus.toFixed(2), Tflip: Tflip == null ? null : +Tflip.toFixed(2),
    target, kappa: Tflip == null ? null : +(Tflip / Tus).toFixed(2), ThatB: +That.toFixed(2), kappaHat: +(That / Tus).toFixed(2) };
  if (absorbing) flags.ABSORBING++;
  if (horizon) flags.HORIZON++;
  if (That >= Tus) flags.KAPPA_GE1++;
  if (Tflip != null && Tflip < T0) flags.SUBFLOOR++;
  if (Tflip == null) buckets.NOFLIP.push(rec);
  else if (target === S) buckets.CURE.push(rec);
  else buckets.OVERSHOOT.push(rec);
}

// report
console.log('\n=== κ generalization — bucketed (T₀≈' + T0 + ', margin ' + MARGIN + '♙, top-' + TOPK + ') ===');
console.log('scanned ' + scanned + ' positions, self-indulgence reproduced: ' + reproduced + '\n');
const n = reproduced || 1;
for (const [k, arr] of Object.entries(buckets))
  console.log('  ' + k.padEnd(9) + ' ' + arr.length + '  (' + (100 * arr.length / n).toFixed(0) + '%)');
console.log('  flags:  SUB-FLOOR ' + flags.SUBFLOOR + '   KAPPA≥1 ' + flags.KAPPA_GE1 +
  '   ABSORBING ' + flags.ABSORBING + '   HORIZON ' + flags.HORIZON);

console.log('\n── CURE cases (does κ_flip ≈ T̂(B-child)/T_us?) ──');
console.log('  B      S      T_us  T_flip  κ_flip  T̂_B/T_us   sub-floor?');
for (const r of buckets.CURE)
  console.log('  ' + r.B.padEnd(6) + ' ' + r.S.padEnd(6) + ' ' + r.Tus.toFixed(2) + '  ' +
    (r.Tflip == null ? ' — ' : r.Tflip.toFixed(2)) + '   ' + r.kappa.toFixed(2) + '    ' + r.kappaHat.toFixed(2) +
    '      ' + (r.Tflip < T0 ? 'YES' : 'no'));
if (buckets.CURE.length) {
  const mk = buckets.CURE.reduce((s, r) => s + r.kappa, 0) / buckets.CURE.length;
  const mh = buckets.CURE.reduce((s, r) => s + r.kappaHat, 0) / buckets.CURE.length;
  console.log('  mean κ_flip=' + mk.toFixed(2) + '  mean T̂_B/T_us=' + mh.toFixed(2) +
    '  → formula ' + (Math.abs(mk - mh) < 0.2 ? 'HOLDS' : 'off by ' + Math.abs(mk - mh).toFixed(2)));
}
console.log('\n── OVERSHOOT (first flip → a third move, not S) ──');
for (const r of buckets.OVERSHOOT.slice(0, 12))
  console.log('  B=' + r.B.padEnd(5) + ' S=' + r.S.padEnd(5) + ' flips→' + String(r.target).padEnd(5) + ' at T=' + (r.Tflip == null ? '—' : r.Tflip.toFixed(2)) + ' (κ=' + r.kappa + ')');

fs.writeFileSync(path.join(__dirname, 'results', 'kappa_corpus.json'), JSON.stringify({ T0, MARGIN, reproduced, buckets, flags }, null, 1));
console.log('\nwrote results/kappa_corpus.json');
