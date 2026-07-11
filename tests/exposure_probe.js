// exposure_probe.js — THE DISCRIMINATOR (pre-registered).
//
// The central open problem is that F prices exposure (an open/marching king, a
// material grab defended by nominal options) as an entropy BONUS, and every cure
// splits into two mutually-exclusive worlds we have never separated by direct
// measurement:
//
//   H_eval   — the refutation is horizon-free structure the ENSEMBLE misprices.
//              At the shallow depth where F is complacent, the badness is already
//              present in the leaves; F only masks it with the +T·S entropy term.
//              ⇒ curable by repricing the ensemble at fixed depth (Pathway 1:
//                the asymmetric-reservoir / Gibbs completion — our optionality at
//                T₀, their optionality at a spectrally-bounded bath).
//
//   H_search — the refutation is genuinely OFF the shallow horizon (a mating net
//              several ply deeper). No reweighting of the shallow leaves can see
//              it; only depth reaches it.
//              ⇒ curable only through attention (Pathway 2: χ-gated allocation,
//                spend alloc's free depth where the king is soft), and only at a
//                time control that affords the depth.
//
// Every dead-end this year (deflation ×6, freeze-guard, allocsched) is consistent
// with BOTH worlds — the signature of a missing measurement, not a missing
// mechanism. This probe makes the measurement. It reuses only certified hooks:
// fixed-depth analysis (deterministic, invariance-battery certified), backup:'max'
// (interior premium off — backup_forms.js), and leafT (leaf optionality repriced —
// the t_decompose knob). No new engine code; no play affected.
//
// ── THE OBSERVABLES (per recovered catastrophe; engine = side to move) ──
//   eF(d)      = engine self-eval in pawns (mover POV) under full F, at fixed
//                depth d = 1..DMAX. Complacent positions read eF ≥ +2 at d_lo.
//   reveal_F   = smallest d with eF(d) ≤ REVEAL (the winning illusion breaks);
//                ∞ if never within DMAX. delta = reveal_F − d_lo = plies of pure
//                ATTENTION the full evaluation needs to undeceive itself.
//   eMax(d_lo) = eval under backup:'max' (interior choice premium removed, leaf
//                entropy kept). eMax ≤ REVEAL ⇒ the INTERIOR PREMIUM was the mask.
//   eCold(d_lo)= eval under backup:'max' + leafT→0 (BOTH entropy channels off ≈
//                material minimax at depth d_lo). eCold ≤ REVEAL ⇒ the loss is on
//                the shallow horizon and F's entropy is the only thing hiding it.
//   cold_local = (eCold(d_lo) ≤ REVEAL) — the ensemble arm. TRUE ⇒ an ensemble
//                re-derivation can catch it WITHOUT deeper search (H_eval).
//
// ── PRE-REGISTERED DECISION RULE (thresholds fixed BEFORE results) ──
//   d_lo = 2 (the shallow reference horizon), REVEAL = 0.0 pawns (no longer
//   winning), COMPLACENT = +2.0 pawns (base-F must be complacent at d_lo to
//   qualify; absorbing/mate reads at d_lo are excluded — not thermal), DMAX = 8.
//
//   H_eval  is supported ⇔ cold_local TRUE for ≥ 2/3 of the qualified corpus.
//   H_search is supported ⇔ cold_local FALSE for ≥ 2/3 AND median(delta) ≥ 4.
//   SPLIT: results are reported by class (EXPOSURE king-march vs MATERIAL grab).
//     If the classes fall in different bins, THAT is the finding — the two
//     diseases have different cures and the pathways split by class, and the
//     probe says which pathway each class needs.
//   Secondary (locus, colour only): among cold_local positions, premium_local
//     (eMax ≤ REVEAL) attributes the mask to the INTERIOR premium; its
//     complement (cold_local ∧ ¬premium_local) attributes it to the LEAF
//     exposure bonus — i.e. which of Pathway 1's two channels to reprice.
//
// ── VERDICT: H_search, decisively — Pathway 1 REFUTED for the catastrophe
//    class (July 2026, 23 recovered positions) ──
//   cold_local = 0/23 (0%), UNANIMOUS across both classes. Stripping BOTH
//   entropy channels at the shallow horizon (interior premium via backup:max
//   AND the leaf bonus via leafT→0) reveals NOT ONE catastrophe. No ensemble
//   re-derivation — Gibbs, basin, sigma, exK, quenched, or any future one —
//   can see these losses, because the loss is not represented in the shallow
//   tree at all. The asymmetric-reservoir/Gibbs completion may still bound
//   thermal runaway, but it cannot fix a single mated-while-winning game.
//
//   THE FRAMING CORRECTION. "F prices the open king as an entropy BONUS" does
//   NOT survive at the actual catastrophe positions. The entropy inflation
//   eF−eCold is NEGATIVE in all 23 (median −1.1 pawns): F's entropy is a mild
//   PENALTY, the danger sense already firing on the opponent's optionality
//   around the exposed king. It fires — it is just a bounded ~1-pawn signal,
//   hopeless against an off-horizon mate worth −∞ while the engine reads
//   +6…+15 on raw material (up a rook/queen and being mated). (Caveat: eF ≤
//   eMax holds structurally because the child F counts the opponent's premium;
//   the FINDING is the ~1-pawn MAGNITUDE and cold=0, not the sign. The
//   "bonus" intuition saw lnW_us rise with escape squares and missed that
//   lnW_them rises faster — the net leaf term already docks the exposed side.)
//
//   OFF-HORIZON. Median reveal Δ = 7 ply; 15/23 unrevealed even at DMAX=8.
//   The refutation is a forcing (mating/check) net beyond the horizon — the
//   identical wall every cheap-local-diagnostic died on. It splits by class:
//   EXPOSURE king-marches reveal SHALLOWER (median Δ 3.5, 4 unreached — a
//   forcing extension of ~4 ply reaches them), MATERIAL grabs run DEEPER
//   (median Δ 7, 11 unreached — often past d8).
//
//   REDIRECTION of the redevelopment. The lawful cure is neither ensemble
//   repricing (Pathway 1, refuted here) nor width allocation (alloc already
//   neutral; the freeze-guard's 1-ply defer already failed — the nets are
//   4–8+ ply out). It is FORCING-LINE (check) extension to resolution — the
//   qCheck family — the one instrument that provably resolves off-horizon
//   mates (Légal) and already cut mate-losses 10→6. Pathway 2 should be
//   reformulated from "χ-gated width" to "forcing-net depth": follow the
//   opponent's checks/captures to their terminal, concentrated on the
//   king-march class the probe shows is within ~4 ply. The flat-to-d8
//   material-up cases (up huge material, slowly mated) are the honest
//   residue: no search from a single position reaches them, and the eval
//   cannot see a threat that carries no material or counting signal — the
//   horizon problem in its irreducible form.
//
//   CAVEAT (found later, via equilibrium_drift's depth audit): the fixed-depth
//   path caps at NODE_HARD_LIMIT = 5M nodes, so on sharp positions the ladder
//   stops advancing around d4–d5 (dashDepth 6–8 return the same node-capped
//   result — hence flat ladder tails like …14.5,14.5,14.5). The cold_local=0/23
//   result at d_lo=2 is well below the cap and UNAFFECTED; the reveal-depths
//   beyond ~d5 mean "unreached by a 5M-node search," which only reinforces
//   off-horizon — but the precise reveal-depth distribution (median Δ, "unreached
//   at d8") should be read as node-capped, not true depth 8.
//
//   node tests/exposure_probe.js
const fs = require('fs'), path = require('path');
const { recover } = require('./exposure_corpus.js');
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }

const D_LO = 2, REVEAL = 0.0, COMPLACENT = 2.0, DMAX = 8;
const MATE_NEAR = 100000 - 4096;

// mover-POV best-eval in pawns at fixed depth d, under the given lab hooks.
// returns { p: pawns, mate: bool }
function evalAt(fen, d, hooks) {
  const E = fresh();
  const r = E._runAnalyze(Object.assign({ fen, dashDepth: d }, hooks || {}));
  const th = r.thermo; if (!th) return null;
  const q = th.Qs[th.bestIdx];
  return { p: q / 2, mate: Math.abs(q) > MATE_NEAR, move: th.moves[th.bestIdx] };
}

const corpus = recover();
const rows = [];
for (const c of corpus) {
  // base-F complacency guard at the shallow horizon
  const lo = evalAt(c.fen, D_LO, {});
  if (!lo || lo.mate || lo.p < COMPLACENT) continue;   // not a shallow-horizon thermal delusion

  // depth ladder under full F, early-stopping when the illusion breaks
  let reveal = Infinity, ladder = [];
  for (let d = 1; d <= DMAX; d++) {
    const e = evalAt(c.fen, d, {});
    ladder.push(e ? +e.p.toFixed(1) : null);
    if (e && (e.p <= REVEAL || e.mate && e.p < 0)) { reveal = d; break; }
  }
  // ensemble arm at the shallow horizon
  const eMax = evalAt(c.fen, D_LO, { backup: 'max' });
  const eCold = evalAt(c.fen, D_LO, { backup: 'max', leafT: 0.01 });
  const cold_local = eCold && (eCold.p <= REVEAL);
  const premium_local = eMax && (eMax.p <= REVEAL);
  // how much the entropy terms inflate the shallow eval — the direct size of the
  // mispricing. Small gap ⇒ complacency is NOT an entropy artifact (pure horizon).
  const entropyGap = eCold ? +(lo.p - eCold.p).toFixed(1) : null;

  rows.push({ game: c.game, opening: c.opening, san: c.san, cls: c.cls,
    eLo: +lo.p.toFixed(1), reveal, delta: reveal === Infinity ? Infinity : reveal - D_LO,
    eMax: eMax ? +eMax.p.toFixed(1) : null, eCold: eCold ? +eCold.p.toFixed(1) : null,
    entropyGap, cold_local, premium_local, ladder, fen: c.fen });
}

// ── report ──
const med = a => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
console.log(`\nqualified positions (base-F complacent ≥ +${COMPLACENT} at d${D_LO}): ${rows.length} / ${corpus.length}`);
console.log(`d_lo=${D_LO}  REVEAL=${REVEAL}pawns  DMAX=${DMAX}\n`);
console.log('cls  game        move    eF(d2)  reveal  Δ    eMax   eCold  cold?  ladder eF(d1..)');
for (const r of rows) {
  console.log('  ' + r.cls[0] + '  ' + r.game.padEnd(11) + ' ' + r.san.padEnd(6) +
    ('+' + r.eLo).padStart(7) + '   ' + (r.reveal === Infinity ? '>' + DMAX : 'd' + r.reveal).padStart(4) +
    '  ' + (r.delta === Infinity ? '>' + (DMAX - D_LO) : '+' + r.delta).padStart(3) + '  ' +
    (r.eMax == null ? '  — ' : (r.eMax >= 0 ? '+' : '') + r.eMax).padStart(6) + ' ' +
    (r.eCold == null ? '  — ' : (r.eCold >= 0 ? '+' : '') + r.eCold).padStart(6) + '  ' +
    (r.cold_local ? 'LOCAL' : ' off ') + '  ' + JSON.stringify(r.ladder));
}

const CAP_DELTA = DMAX - D_LO + 1;   // unreached: refutation is beyond DMAX, count it as just past
const capd = r => r.delta === Infinity ? CAP_DELTA : r.delta;
function summarize(label, rs) {
  if (!rs.length) return;
  const cold = rs.filter(r => r.cold_local).length;
  const deltas = rs.map(capd);   // unreached folded in at CAP_DELTA, not dropped
  const unreached = rs.filter(r => r.delta === Infinity).length;
  const prem = rs.filter(r => r.cold_local && r.premium_local).length;
  const leafOnly = rs.filter(r => r.cold_local && !r.premium_local).length;
  const gaps = rs.filter(r => r.entropyGap != null).map(r => r.entropyGap);
  console.log(`\n── ${label} (n=${rs.length}) ──`);
  console.log(`  cold_local (ensemble-visible at d${D_LO}): ${cold}/${rs.length} (${(100 * cold / rs.length).toFixed(0)}%)`);
  console.log(`  entropy inflation eF−eCold: median ${med(gaps).toFixed(1)} pawns  (values: ${gaps.join(',')})`);
  console.log(`  reveal Δ: median ${med(deltas)} ply (unreached=CAP ${CAP_DELTA})` +
    (unreached ? `, ${unreached} unreached at DMAX` : '') + `  (values: ${rs.map(r => r.delta === Infinity ? '∞' : r.delta).join(',')})`);
  console.log(`  locus among cold: interior-premium ${prem}, leaf-exposure ${leafOnly}`);
}
summarize('ALL', rows);
summarize('EXPOSURE (king-march)', rows.filter(r => r.cls === 'EXPOSURE'));
summarize('MATERIAL (grab)', rows.filter(r => r.cls === 'MATERIAL'));

// ── verdict ──
function verdict(rs) {
  const cold = rs.filter(r => r.cold_local).length, n = rs.length;
  const mdelta = med(rs.map(capd));   // unreached folded in at CAP_DELTA
  if (cold >= 2 / 3 * n) return 'H_eval (ensemble-fixable at shallow depth → Pathway 1)';
  if (cold <= 1 / 3 * n && mdelta >= 4) return 'H_search (off-horizon → Pathway 2, attention/depth)';
  return `cold-arm H_search (0 ensemble-visible) but median Δ=${mdelta}<4 — refutation off-horizon yet shallow`;
}
console.log('\n════ VERDICT ════');
console.log('  ALL      : ' + verdict(rows));
console.log('  EXPOSURE : ' + verdict(rows.filter(r => r.cls === 'EXPOSURE')));
console.log('  MATERIAL : ' + verdict(rows.filter(r => r.cls === 'MATERIAL')));

fs.writeFileSync(path.join(__dirname, 'results', 'exposure_probe.json'),
  JSON.stringify({ D_LO, REVEAL, COMPLACENT, DMAX, rows }, null, 1));
console.log('\nwrote results/exposure_probe.json');
