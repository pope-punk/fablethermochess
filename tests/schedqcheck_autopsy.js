// schedqcheck_autopsy.js — why did σ_eff-scheduler + qCheck collapse to 3/12
// (mate losses 2→8) when the scheduler alone is 9/12?
//
// DERIVATION (per CLAUDE.md method — the mechanism I PRE-REGISTERED, then
// measured, then had REFUTED). The freeze criterion is  sigma < gap ,
// gap = nq[0]−nq[1] (top-two value gap), sigma = bathT·√(1+(μ̄χ)²) set by the
// THERMOMETER (bathT, μ̄, χ) — it does NOT depend on the leaf Q values, so
// qCheck can only move the freeze through the GAP. I predicted: qCheck resolves
// shallow checks (not the deep nets — exposure_probe: 15/23 unreached at d8),
// making the greedy grab look more clearly best → WIDER gap → trips sigma<gap
// EARLIER → premature freeze → deep net unseen → mate. Prediction: freeze% UP,
// depth DOWN, gap UP in the complacent (evalP≥+3) window.
//
// ── MEASURED (traces only; no engine re-run) — TWO of three, and the miss is
//    the real finding ──
//   complacent window, schedule(9/12) → schedqcheck(3/12):
//     meanDepth 3.26 → 1.5   (DOWN ✓)      meanGap 1.26 → 1.78♙ (UP ✓)
//     freeze%   18.7 → 2.2   (DOWN ✗ — predicted UP)
//   The freeze story is FALSE: schedqcheck freezes LESS, not more. It barely
//   freezes because the search rarely completes past depth 2 (freeze gates at
//   depth≥2). The dominant, unpredicted signal is the DEPTH COLLAPSE, at
//   EQUAL-OR-MORE wall-clock (complacent meanSpentMs 956 → 1033).
//
// ── THE CORRECTED MECHANISM: qCheck's depth tax, scheduler benefit subtracted
//    (NOT a novel interaction) ──
//   The depth halving is a qCheck PROPERTY, present in every qCheck config with
//   NO scheduler — so the marriage did not create it:
//       config           meanDepth   score   mateLosses
//       flux baseline       3.19        —          —
//       schedule (base)     3.13      9/12         2
//       qcheck  (slow)      1.67      7/12         4
//       qcheck2 (fast)      1.92      4/12         7
//       qbasin              1.48      6/12         6
//       schedqcheck         1.82      3/12         8
//   Every qCheck family member sits at collapsed depth (~1.5–1.9, from base
//   3.19) with elevated mate losses (4–8, from base 2): at d≈1.8 the engine is
//   effectively quiescence-only and BLIND to the d5+ mating nets — the mate
//   losses are the depth collapse, not a scheduler pathology. schedqcheck sits
//   at the unfavorable END of that band (3/12), but WITHIN it: 3 vs qcheck2's 4
//   is ~0.7 SE at n=12 — not cleanly worse than qCheck-alone. So the honest
//   verdict is NOT "schedule × qCheck anti-synergy." It is: the scheduler's
//   9/12 is CONDITIONAL on the base engine's d3 search (its freeze/bank logic
//   gates at depth≥2–3, and its value came from spending banked time on hard
//   positions AT DEPTH). qCheck spends that depth away, so the marriage keeps
//   qCheck's depth tax and loses the scheduler's now-inapplicable benefit —
//   landing at the qCheck-family floor. The two are incompatible not by exotic
//   interaction but by COMPETITION FOR THE SAME SCARCE RESOURCE (search depth):
//   qCheck spends it, the scheduler needs it.
//
//   LAWFUL RESIDUE. (1) A depth-costly forcing extension cannot be married to
//   any depth-conditional instrument at a fixed per-move budget — the extension
//   must first be made depth-neutral (the "fast pre-filter" qcheck2 did NOT do
//   this: d1.92 ≈ d1.67, and it scored WORSE). (2) The gap widening is real but
//   is a shallow-depth artifact (unresolved tactics tower over alternatives),
//   not qCheck manufacturing confidence — my pre-registered channel was wrong.
//   (3) This matches the depth-marker study (heat_persistence_probe): qCheck
//   harvests the tactical 9% of depth-sensitivity but pays a depth tax that
//   only nets to neutral when the other 91% is left intact; give up the
//   scheduler's depth-purchased edge on top and the tax shows through.
//
//   node tests/schedqcheck_autopsy.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'results');
const load = f => { const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); return j.games || j; };
const A = { name: 'schedule (9/12)', games: load('vs_sf1500_schedule.json') };
const B = { name: 'schedqcheck (3/12)', games: load('vs_sf1500_schedqcheck.json') };

function engLostByMate(g) {
  if (g.termination !== 'checkmate') return false;
  return (g.engineIsWhite && g.result === '0-1') || (!g.engineIsWhite && g.result === '1-0');
}
function score(games) {
  let w = 0, d = 0, l = 0, m = 0;
  for (const g of games) {
    const ew = g.engineIsWhite, r = g.result;
    if (r === '1/2-1/2') d++;
    else if ((ew && r === '1-0') || (!ew && r === '0-1')) w++;
    else { l++; if (g.termination === 'checkmate') m++; }
  }
  return { pts: w + d / 2, n: games.length, w, d, l, mate: m };
}
function meanDepth(games) {
  let s = 0, n = 0;
  for (const g of games) (g.trace || []).forEach(t => { if (t.depth != null) { s += t.depth; n++; } });
  return n ? s / n : 0;
}

// freeze/depth/gap over trace moves, split by eval regime
function regionStats(games) {
  const mk = () => ({ froze: 0, n: 0, depthSum: 0, gapSum: 0, gapN: 0, spentSum: 0 });
  const all = mk(), comp = mk();
  for (const g of games) (g.trace || []).forEach(t => {
    if (t.depth == null) return;
    const rec = b => { b.n++; b.depthSum += t.depth; b.spentSum += (t.spentMs || 0);
      if (t.stop === 'frozen') b.froze++; if (t.gapQ != null) { b.gapSum += t.gapQ; b.gapN++; } };
    rec(all); if (t.evalP != null && t.evalP >= 3) rec(comp);
  });
  const fmt = b => ({ n: b.n, frozePct: b.n ? +(100 * b.froze / b.n).toFixed(1) : 0,
    meanDepth: b.n ? +(b.depthSum / b.n).toFixed(2) : 0,
    meanGap: b.gapN ? +(b.gapSum / b.gapN / 2).toFixed(2) : 0,
    meanSpentMs: b.n ? Math.round(b.spentSum / b.n) : 0 });
  return { all: fmt(all), complacent: fmt(comp) };
}

// ── 1. the qCheck-family depth/score/mate table (the corrected mechanism) ──
console.log('\n=== 1. qCheck depth tax is a qCheck PROPERTY, not a marriage effect ===\n');
console.log('  config           meanDepth   score      mateLosses');
const FAM = [
  ['flux baseline', 'vs_sf1500.json'], ['schedule (base)', 'vs_sf1500_schedule.json'],
  ['qcheck (slow)', 'vs_sf1500_qcheck.json'], ['qcheck2 (fast)', 'vs_sf1500_qcheck2.json'],
  ['qbasin', 'vs_sf1500_qbasin.json'], ['schedqcheck', 'vs_sf1500_schedqcheck.json'],
];
for (const [nm, f] of FAM) {
  if (!fs.existsSync(path.join(dir, f))) continue;
  const gs = load(f), sc = score(gs), md = meanDepth(gs);
  console.log('  ' + nm.padEnd(16) + ' ' + md.toFixed(2).padStart(6) + '    ' +
    (sc.pts + '/' + sc.n).padEnd(8) + '   ' + sc.mate);
}

// ── 2. the pre-registered freeze prediction, measured (2 of 3, freeze REFUTED) ──
const sa = regionStats(A.games), sb = regionStats(B.games);
console.log('\n=== 2. pre-registered freeze mechanism: measured, REFUTED on freeze% ===');
for (const region of ['all', 'complacent']) {
  console.log('\n  --- ' + region.toUpperCase() + (region === 'complacent' ? ' (evalP ≥ +3) ---' : ' ---'));
  console.log('  run                  nMoves  froze%   meanDepth  meanGap(♙)  meanSpentMs');
  for (const [nm, s] of [[A.name, sa[region]], [B.name, sb[region]]]) {
    const r = s;
    console.log('  ' + nm.padEnd(20) + ' ' + String(r.n).padStart(5) + '   ' + String(r.frozePct).padStart(5) +
      '   ' + String(r.meanDepth).padStart(7) + '   ' + String(r.meanGap).padStart(8) + '   ' + String(r.meanSpentMs).padStart(8));
  }
}
const dc = sb.complacent, ac = sa.complacent;
console.log('\n  freeze% ' + ac.frozePct + '→' + dc.frozePct + ' (' + (dc.frozePct > ac.frozePct ? 'UP — predicted' : 'DOWN — REFUTES the freeze-widening channel') + ')');
console.log('  meanDepth ' + ac.meanDepth + '→' + dc.meanDepth + ' (' + (dc.meanDepth < ac.meanDepth ? 'DOWN ✓ — the real signal: depth starvation at equal wall-clock' : 'not down') + ')');
console.log('  meanGap ' + ac.meanGap + '→' + dc.meanGap + ' (' + (dc.meanGap > ac.meanGap ? 'UP — but a shallow-depth artifact, not manufactured confidence' : 'not up') + ')');
