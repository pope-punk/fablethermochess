// Absorbing-risk guard for the σ_eff scheduler — PRE-REGISTRATION REPLAY.
//
// The disease (status page §3): ~80% of σ_eff freezes fire at depth 2,
// and forcing capture sequences freeze the clock exactly where mating
// nets build beyond the horizon. Documented catastrophe: allocsched
// QGD-W, frozen at d2 in 174–493 ms through Qxg7/Qxh8/Qxg8, mated at
// +590 — the chosen futures read β = −1 (opponent owns every measured
// forcing future) while the value said +3…+6.
//
// A naive guard ("deny any freeze whose chosen flux is adverse") was
// FALSIFIED by this replay's first sample before implementation:
// benign forced recaptures (schedule 9/12 run, ply-10 Bxd5, +2.46,
// game won) also read β = −1 saturated — a recapture subtree is a
// forced channel by nature. The flux cannot discriminate fatal from
// benign at the freeze instant; at d2 the discriminating information
// (the net at d5) does not exist in the subtree statistics at all.
//
// The PRE-REGISTERED RULE is therefore epistemic, not clairvoyant:
//   A freeze at depth 2 is a claim made on a value that has NEVER been
//   same-parity confirmed (d2 vs d1 is cross-parity — the same reason
//   the thermometer skips depth 2). Deny the d2 freeze when the chosen
//   future is (a) adverse beyond its own counting error, β < −SE with
//   SE = sqrt((1−β²)/n_tax) — the regime split's own significance test
//   — or (b) unmeasured (n_μ < 8, the flux instrument's own sample
//   floor): banking time on an unconfirmed value in a measured-adverse
//   or unmeasured channel is not a made decision. Deferred decisions
//   freeze at depth 3+, where a parity-confirmed revision exists and
//   entered the thermometer. Quiet d2 freezes (β within error of ≥ 0,
//   well-sampled) fire exactly as before. No new constants: 8 and 4
//   are the flux instrument's existing sample gates, SE is counting.
//
// Predictions (written before running):
//   P1. All three QGD-W catastrophe freezes (plies 16/18/20) are denied.
//   P2. Quiet-position d2 freezes are mostly untouched — the bank that
//       funds the +1.5 survives for the quiet class.
//   P3. Forced-recapture d2 freezes (β = −1, benign) ARE deferred: the
//       cost is one extra iteration in positions where truncation makes
//       d3 cheap, not the loss of the freeze.
//   P4. Freezes at d3+ are untouched by construction.
//
// ── GAUNTLET VERDICT (negative, autopsied — July 2026) ──
//   guard mode: 6/12 vs the 9/12 schedule baseline (W5 D2 L5, 5 mate
//   losses vs 2; bath 3.3 vs 5.7). The guard did its clock job exactly
//   as registered: d2 freezes 115 → 2 (the quiet hatch), deferrals
//   fire at d3 (69), total freezes halved (the d3 re-check disconfirms
//   half the claims), mean spend nearly unchanged (984 vs 966 ms).
//   BUT the pre-registered hypothesis is REFUTED by its own metric:
//   the freeze→eval-drop rate is 32% vs 29% — d3-confirmed freezes
//   are exactly as unstable as raw d2 ones. The instability is not a
//   missing-parity-partner artifact; it is horizon-generic in this
//   evaluation landscape. And the target class recurred with the
//   guard ON: English-W mated at +1010 — on FULL-DEADLINE moves, not
//   freezes: the engine marched its king Kb4–Kb5–Kc6–Kc7–Kd7 at
//   evals +10…+13 into the net. The clock was never the disease;
//   F prices an open king as an entropy BONUS (mobility), and every
//   scheduler pathology traced this session is downstream of that.
//   Scheduler-criterion ladder now: schedule 9 > basinsched 7.5 >
//   allocsched 6.5 ≈ guard 6 — four modifications in a row read
//   negative at n=12. Recorded honestly: either σ_eff-as-is is a
//   sharp local optimum, or the single 9/12 run was a favorable draw
//   (±1.7 at n=12); an n=24 schedule rebaseline would settle which
//   and is the cheap next measurement. The guard is RETIRED.
//
// Replay limitation, declared: trace records carry β only when the
// engine's own reading gate passed (n_μ ≥ 8 AND n_tax ≥ 4), so a null
// β here cannot distinguish "unmeasured subtree" (deny) from
// "well-sampled but quiet" (n_tax < 4: allow — no current, no risk).
// The replay counts null-β as denied (upper bound on deferral); the
// engine implementation uses the raw counters and allows the quiet case.
//
//   node tests/freeze_guard_replay.js
const path = require('path');

const RUNS = [
  ['schedule 9/12  ', 'vs_sf1500_schedule.json'],
  ['basinsched 7.5 ', 'vs_sf1500_basinsched.json'],
  ['allocsched 6.5 ', 'vs_sf1500_allocsched.json'],
];

function guardDenies(rec) {
  if (rec.depth !== 2) return false;                 // d3+: parity-confirmed, untouched
  if (rec.beta == null) return true;                 // unmeasured (upper bound; see header)
  // recover n_tax for the chosen move from its triple (β, dμ rounded to 3dp)
  let ntax = null;
  if (rec.triples) {
    for (const t of rec.triples)
      if (t.length >= 4 && t[0] === rec.beta && t[1] === rec.dmu) { ntax = t[2]; break; }
  }
  if (ntax == null) return true;                     // cannot certify the reading: defer
  const se = Math.sqrt(Math.max(0, 1 - rec.beta * rec.beta) / ntax);
  return rec.beta < -se;                             // adverse beyond counting error
}

for (const [label, file] of RUNS) {
  let data;
  try { data = require(path.join(__dirname, 'results', file)); }
  catch (e) { console.log(label + ': ' + file + ' not found, skipped'); continue; }

  let freezes = 0, d2 = 0, denied = 0, deniedNull = 0, deniedAdverse = 0;
  let fatalAdj = 0, fatalDenied = 0;
  const examples = [];
  for (const g of data.games) {
    const tr = g.trace;
    const engLostByMate = g.termination === 'checkmate' &&
      (g.result !== '1/2-1/2') && ((g.result === '1-0') !== g.engineIsWhite);
    for (let k = 0; k < tr.length; k++) {
      const p = tr[k];
      if (p.stop !== 'frozen') continue;
      freezes++;
      if (p.depth === 2) d2++;
      // fatal-adjacent: engine-POV eval drops ≥ 2 pawns within the next
      // 3 engine moves, or the game ends in a mate loss within 20 plies.
      const sgn = g.engineIsWhite ? 1 : -1;
      const e0 = sgn * p.evalP;
      let drop = false;
      for (let j = k + 1; j <= k + 3 && j < tr.length; j++)
        if (e0 - sgn * tr[j].evalP >= 2) { drop = true; break; }
      const mateSoon = engLostByMate && (g.plies - p.ply) <= 20;
      const fatal = drop || mateSoon;
      if (fatal) fatalAdj++;
      const deny = guardDenies(p);
      if (deny) {
        denied++;
        if (p.beta == null) deniedNull++; else deniedAdverse++;
        if (fatal) fatalDenied++;
        if (fatal && examples.length < 6)
          examples.push(`      ${g.opening} ${g.engineIsWhite ? 'W' : 'B'} ply ${p.ply} ${p.san} eval ${p.evalP} β=${p.beta} (${mateSoon ? 'mated soon' : 'eval drop'})`);
      }
    }
  }
  console.log(label + ': freezes=' + freezes + ' (d2: ' + d2 + ')  denied=' + denied +
    ' [adverse ' + deniedAdverse + ', null-β ' + deniedNull + ']  ' +
    'fatal-adjacent freezes=' + fatalAdj + ' of which denied=' + fatalDenied);
  for (const e of examples) console.log(e);
}

// The registered catastrophe, explicitly:
try {
  const B = require(path.join(__dirname, 'results', 'vs_sf1500_allocsched.json'));
  const qgd = B.games.find(g => g.opening === "Queen's Gambit Declined" && g.engineIsWhite);
  console.log('\nQGD-W +590 catastrophe (P1):');
  for (const p of qgd.trace) if (p.stop === 'frozen')
    console.log(`   ply ${p.ply} ${p.san.padEnd(7)} β=${p.beta != null ? p.beta : 'null'}  d=${p.depth}  → ${guardDenies(p) ? 'DENIED' : 'allowed'}`);
} catch (e) { /* run missing */ }
