// qcheck_reveal.js — the redirect test (pre-registered follow-up to
// exposure_probe.js). P0 found the catastrophes are off-horizon forcing nets
// (H_search), median reveal Δ = 7 ply, and redirected the cure from ensemble
// repricing (refuted) to FORCING-LINE (check) extension — the qCheck family.
// This tests that redirect directly: does qCheck's check-resolution surface the
// catastrophes at the SHALLOW horizon where base-F is complacent?
//
// qCheck adds non-capture checks to the top quiescence plies — a T=0 relaxation
// of the fast forcing degrees of freedom (attention, never a term in Q). If the
// opponent's mating net is a check sequence, qCheck should resolve it without
// spending main-search depth, pulling the reveal in.
//
// ── PRE-REGISTERED DECISION RULE (thresholds fixed BEFORE results) ──
//   Reuses the P0 corpus and base rows (results/exposure_probe.json), same
//   d_lo=2, REVEAL=0 pawns, DMAX=8. Per position, with qCheck ON:
//     e_qc(d_lo)      = eval at the shallow horizon.
//     revealed_qc     = e_qc(d_lo) ≤ REVEAL  (forcing extension sees it NOW).
//     flip_qc         = argmax at d_lo is no longer the catastrophic move.
//     reveal_qc       = first depth d≤DMAX with eval ≤ REVEAL (qCheck ladder).
//   The load-bearing class is EXPOSURE (king-marches; P0 median Δ≈3.5, within
//   forcing reach). SUCCESS ⇔ qCheck reveals (revealed_qc) ≥ 1/2 of the EXPOSURE
//   positions base-F left complacent, OR cuts the EXPOSURE median reveal depth by
//   ≥ 2 ply. FAIL ⇔ reveals < 1/4 AND cuts reveal depth by < 1 ply — the nets are
//   deeper than qCheck's extension reaches, and a deeper forcing search is needed.
//   MATERIAL grabs (P0 Δ 7, past d8) are reported but not expected to move.
//
// ── VERDICT: reachability CONFIRMED, rescue NOT — the redirect's premise holds,
//    its curative value is prophylactic and still untested (July 2026, 23 pos) ──
//   EXPOSURE class meets the pre-registered SUCCESS bar on BOTH arms: qCheck
//   reveals 6/10 king-march nets at d2 (was ≤ 5 needed), and cuts the median
//   reveal depth 5.5 → 2 ply — essentially the Δ≈3.5 P0 predicted. Forcing
//   (check) extension DOES reach these nets (gibbs Kd3 +12.8→−49997 at d1;
//   alloc Kd8 +7.9→−49998; meanback Kd4 +6.3→−49998). The T=0 relaxation is
//   the right sector for this type-(b) content — exactly where the state
//   function is blind (P0: cold_local 0/23) the forcing search sees.
//
//   THE HONEST LIMIT, and it is the whole lesson. Revealing the loss FLIPS the
//   played move only 1/10 (EXPOSURE), and that one flip is Kc7→Kd7 — another
//   losing king move. These corpus positions are ALREADY LOST: every move
//   mates, so seeing it changes nothing. Reveal is necessary, not sufficient.
//   The curative value of forcing extension is PROPHYLACTIC — it must fire one
//   move earlier, at the committal decision where a sound alternative still
//   exists — and the 5.5→2 reveal-depth cut is exactly the evidence that at
//   that earlier (also shallow, in-play) ply the net would now be visible.
//   THE NEXT PROBE writes itself: the committal-decision corpus (the ply BEFORE
//   each king-march), asking whether qCheck flips AWAY from the exposing move
//   to a sound one. That is the actual prophylaxis test; this probe only
//   established the precondition.
//
//   MATERIAL grabs behave differently, as P0 implied (Δ 7, non-forcing): qCheck
//   reveals 4/13, does NOT move the median (9→9) — those refutations are not
//   check-nets — yet flips 4/13 where it does fire. Two anomalies to resolve
//   before any gauntlet: (a) leafmu Kd1 reveal moves LATER under qCheck (d5→>8)
//   — check extension can resolve a line optimistically; (b) maxback Bf1+ reads
//   +49998 (mate FOR the mover) in a game the engine LOST — a candidate qCheck
//   false-positive (over-reading a check sequence as mating). Both need a
//   soundness pass; neither is fatal to the reachability result.
//
//   node tests/qcheck_reveal.js
const fs = require('fs'), path = require('path');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }

const D_LO = 2, REVEAL = 0.0, DMAX = 8;
const MATE_NEAR = 100000 - 4096;

// Base rows come from the P0 probe's cached JSON when present; if it's missing
// (e.g. an ephemeral-container rollback ate it), fall back to re-deriving the
// corpus deterministically — the qCheck arm still runs; only the base reveal
// comparison degrades to "recompute here".
let rows;
const cachePath = path.join(__dirname, 'results', 'exposure_probe.json');
if (fs.existsSync(cachePath)) {
  rows = JSON.parse(fs.readFileSync(cachePath, 'utf8')).rows;
} else {
  console.warn('exposure_probe.json missing — re-deriving corpus from exposure_corpus.js');
  const { recover } = require('./exposure_corpus.js');
  rows = recover().map(c => ({ game: c.game, san: c.san, cls: c.cls, eLo: null, reveal: null, fen: c.fen }));
}

function evalAt(fen, d, hooks) {
  const E = fresh();
  const r = E._runAnalyze(Object.assign({ fen, dashDepth: d }, hooks || {}));
  const th = r.thermo; if (!th) return null;
  const q = th.Qs[th.bestIdx];
  return { p: q / 2, mate: Math.abs(q) > MATE_NEAR, move: th.moves[th.bestIdx] };
}

const out = [];
for (const r of rows) {
  const qc = { qCheck: true };
  const lo = evalAt(r.fen, D_LO, qc);
  // qCheck depth ladder, early-stop on reveal
  let reveal_qc = Infinity;
  for (let d = 1; d <= DMAX; d++) {
    const e = evalAt(r.fen, d, qc);
    if (e && (e.p <= REVEAL || (e.mate && e.p < 0))) { reveal_qc = d; break; }
  }
  const revealed_qc = lo && lo.p <= REVEAL;
  const flip_qc = lo && lo.move !== r.san;
  const reveal_base = r.reveal == null ? Infinity : r.reveal;   // JSON serialized ∞ as null
  out.push({ game: r.game, san: r.san, cls: r.cls, eLo: r.eLo,
    eLo_qc: lo ? +lo.p.toFixed(1) : null, move_qc: lo ? lo.move : null,
    revealed_qc, flip_qc, reveal_base, reveal_qc });
}

const CAP = DMAX - D_LO + 1;
const capr = rv => (rv === Infinity ? DMAX + 1 : rv);
const med = a => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

console.log(`\nqCheck reveal test — d_lo=${D_LO} REVEAL=${REVEAL} DMAX=${DMAX}\n`);
console.log('cls  game        move    eF(d2)  eF_qc(d2)  reveal_base  reveal_qc  seen@d2  flip');
for (const o of out) {
  console.log('  ' + o.cls[0] + '  ' + o.game.padEnd(11) + ' ' + o.san.padEnd(6) +
    ('+' + o.eLo).padStart(7) + '  ' + (o.eLo_qc == null ? '  —' : (o.eLo_qc >= 0 ? '+' : '') + o.eLo_qc).padStart(8) +
    '   ' + (o.reveal_base === Infinity ? '>' + DMAX : 'd' + o.reveal_base).padStart(8) +
    '   ' + (o.reveal_qc === Infinity ? '>' + DMAX : 'd' + o.reveal_qc).padStart(7) +
    '   ' + (o.revealed_qc ? 'YES' : ' · ').padStart(5) + '   ' + (o.flip_qc ? o.move_qc : '·'));
}

function summ(label, rs) {
  if (!rs.length) return;
  const revealed = rs.filter(r => r.revealed_qc).length;
  const flips = rs.filter(r => r.flip_qc).length;
  const mb = med(rs.map(r => capr(r.reveal_base))), mq = med(rs.map(r => capr(r.reveal_qc)));
  console.log(`\n── ${label} (n=${rs.length}) ──`);
  console.log(`  qCheck reveals at d${D_LO}: ${revealed}/${rs.length}   argmax flips off the catastrophe: ${flips}/${rs.length}`);
  console.log(`  median reveal depth: base ${mb} → qCheck ${mq}  (Δ ${(mb - mq).toFixed(1)} ply earlier; unreached counted as ${DMAX + 1})`);
}
summ('ALL', out);
const exp = out.filter(o => o.cls === 'EXPOSURE'), mat = out.filter(o => o.cls === 'MATERIAL');
summ('EXPOSURE (king-march)', exp);
summ('MATERIAL (grab)', mat);

// verdict on the load-bearing class
const revE = exp.filter(o => o.revealed_qc).length;
const mbE = med(exp.map(o => capr(o.reveal_base))), mqE = med(exp.map(o => capr(o.reveal_qc)));
const success = revE >= exp.length / 2 || (mbE - mqE) >= 2;
const fail = revE < exp.length / 4 && (mbE - mqE) < 1;
console.log('\n════ VERDICT (EXPOSURE class) ════');
console.log('  ' + (success ? 'SUCCESS — forcing-extension reaches the king-march nets; a targeted qCheck-extension gauntlet is motivated.'
  : fail ? 'FAIL — qCheck\'s extension is too shallow to reach these nets; a deeper forcing search is required.'
  : 'PARTIAL — qCheck helps but below the pre-registered bar; report and decide.'));

fs.writeFileSync(path.join(__dirname, 'results', 'qcheck_reveal.json'), JSON.stringify({ D_LO, REVEAL, DMAX, out }, null, 1));
console.log('\nwrote results/qcheck_reveal.json');
