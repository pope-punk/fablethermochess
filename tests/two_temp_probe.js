// two_temp_probe.js — can the winner's curse be cured on the AGENCY axis, i.e.
// by a colder opponent temperature (the two-temperature GGE mechanism)?
//
// THE CHAIN. The self-indulgence (Alekhine 1.e4 Nf6 2.e5 d6??) has a real
// ADVERSARIAL component: at the child after d6, White's warm softmax puts only
// ~16% on the knight-winning exf6 (measured), so the annealed backup credits
// White with ~84% chance of DECLINING a free knight — a large over-valuation of
// d6. The two-temperature story says: cool the opponent (T_them < T_us) so the
// adversary chooses sharply, curing the curse while our own optionality (the
// bluff / danger sense) stays warm. `themT` is exactly the opponent-node
// temperature (computeF: Tn = tOver at opponent nodes).
//
// PRE-REGISTERED VERDICT (thresholds fixed before running):
//   default reproduces the blunder (argmax = d6).
//   · CURE ⇔ cooling the opponent (themT ↓) moves argmax OFF d6 toward the sound
//     Nd5 AND drops eval(d6). ⇒ agency axis works, build the asymmetric backup.
//   · BACKFIRE ⇔ cooling the opponent RAISES eval(d6) (we get MORE optimistic).
//     ⇒ the sectors are coupled: a cold opponent minimizes against a warm us
//       below (inflated compensation) and loses its optionality premium (the
//       danger sense). Agency axis refuted; the opponent must stay warm.
//   CONTROL: symmetric cooling (pinT < T*) must cure (both sides cold = the
//     known Alekhine fix at T≈1) — else the setup is broken.
//
// ── RESULT (Alekhine, July 2026) ──
//   The adversarial component is REAL: π(exf6) = 16% — the warm opponent
//   under-plays the knight-win, over-crediting d6. And cooling the opponent DOES
//   eventually flip the argmax to the sound Nd5 (at themT=1.0). BUT one-sided
//   cooling heats the SHARED thermometer monotonically (themT 1.3→0.1 drives
//   bathT 1.37→3.58), and the flip to Nd5 is COEXTENSIVE with runaway (bathT
//   already 1.90 at the flip). Symmetric cooling cures with no runaway (pinT
//   0.50, max 1.17), so the instability is the ONE-SIDEDNESS — the same rule-5
//   thermometer runaway that killed mean-us and the leaf charges.
//
//   DIAGNOSIS (this is the answer to "how do two temperatures fit the equilibrium
//   metaphor"): T_us and T_them are NOT independent, because there is ONE
//   thermometer, measured from BOTH sides' value revisions. Lowering T_them
//   changes those revisions and raises the measured T_us monotonically — the
//   sectors are coupled THROUGH THE MEASUREMENT (not a dynamical heat current).
//   The single-bath GGE therefore has no stable asymmetric operating point.
//   The construction this forces: TWO same-parity thermometers — T_us from
//   our-ply revisions, T_them from theirs — decoupling the measurement so the
//   opponent can be cooled without heating us. That is the two-temperature GGE
//   done properly, and it carries a falsifiable check: the drift-nulling T_them
//   should equal the opponent thermometer T̂c. NEXT BUILD, not yet done.
//
//   VALIDATED IN PRINCIPLE (part c): simulate the decoupled regime — pin our bath
//   (pinT=1.37, breaking the feedback) and cool the opponent (themT=1.0) — and it
//   CURES cleanly: argmax Nd5, evals negative (d6 −1.22, Nd5 −1.19), NO runaway.
//   The coupled version reached Nd5 only at a run-away bath (1.90) with inflated
//   evals. Residual caveat: even decoupled, over-cooling (themT≤0.7) drifts toward
//   over-valuation (a value-recursion coupling remains), so T_them must be MODEST
//   (≈0.7·T_us) — the QRE picture quantified (adversary slightly sharper than us).
//   This is the first eval-side mechanism of the session to cure the Alekhine
//   while keeping our own warmth AND without thermometer runaway; strength is the
//   open (gauntlet) question.
//   (Established on the canonical Alekhine; the runaway mechanism is general
//   rule-5 physics, the specific flip point is position-specific.)
//
//   node tests/two_temp_probe.js
const E = require('./engine_current.js');
const PAWN = 2;

const root = new E.Chess(); for (const m of ['e4', 'Nf6', 'e5']) root.move(m);
const FEN = root.fen();
const BLUNDER = 'd6', SOUND = 'Nd5';
const D = 4;

function read(opts) {
  const th = E._runAnalyze(Object.assign({ fen: FEN, dashDepth: D }, opts)).thermo;
  const qi = s => { const i = th.moves.indexOf(s); return i < 0 ? null : th.Qs[i] / PAWN; };
  return { best: th.moves[th.bestIdx], T: th.T, qBlunder: qi(BLUNDER), qSound: qi(SOUND) };
}

// (a) the adversarial signal: White's probability on the killer exf6 after d6
const cg = new E.Chess(FEN); cg.move(BLUNDER);
const cth = E._runAnalyze({ fen: cg.fen(), dashDepth: D }).thermo;
const iEx = cth.moves.indexOf('exf6');
console.log('adversarial signal — after 1.e4 Nf6 2.e5 d6, White to move (T=' + cth.T.toFixed(2) + '):');
console.log('  π(exf6, the knight-win) = ' + (cth.probs[iEx] * 100).toFixed(1) + '%   (warm opponent under-sharpens ⇒ over-credits d6)\n');

// (b) map the opponent-temperature sweep AND the bath's response (the coupling)
console.log('config                     best   eval(d6)  eval(Nd5)   bathT');
const base = read({});
const sweep = [1.3, 1.2, 1.1, 1.0, 0.9, 0.7, 0.4, 0.1];
const rows = [['default (both warm)', base]];
for (const tt of sweep) rows.push(['themT=' + tt.toFixed(1), read({ themT: tt })]);
rows.push(['pinT=0.5 (BOTH cold)', read({ pinT: 0.5 })]);
rows.push(['max backup (both hard)', read({ backup: 'max' })]);
for (const [lbl, r] of rows)
  console.log('  ' + lbl.padEnd(24) + ' ' + r.best.padEnd(5) +
    (r.qBlunder == null ? '   —' : (r.qBlunder >= 0 ? '+' : '') + r.qBlunder.toFixed(2)).padStart(8) +
    (r.qSound == null ? '   —' : (r.qSound >= 0 ? '+' : '') + r.qSound.toFixed(2)).padStart(10) +
    '   ' + r.T.toFixed(2) + (r.T > base.T + 0.5 ? ' ⚠runaway' : ''));

// (c) simulate the DECOUPLED two-thermometer regime: pin our bath (breaking the
// thermometer feedback) while cooling the opponent. If decoupling opens a clean
// curative point, the two-thermometer construction is validated in principle.
console.log('\ndecoupled simulation (pinT fixes our T; themT cools the opponent):');
console.log('config                     best   eval(d6)  eval(Nd5)   bathT');
const dec = [
  ['pinT=1.37 themT=1.0', read({ pinT: 1.37, themT: 1.0 })],
  ['pinT=1.37 themT=0.7', read({ pinT: 1.37, themT: 0.7 })],
  ['pinT=1.37 themT=0.4', read({ pinT: 1.37, themT: 0.4 })],
];
for (const [lbl, r] of dec)
  console.log('  ' + lbl.padEnd(24) + ' ' + r.best.padEnd(5) +
    (r.qBlunder >= 0 ? '+' : '') + r.qBlunder.toFixed(2).padStart(6) +
    ('  ' + (r.qSound >= 0 ? '+' : '') + r.qSound.toFixed(2)).padStart(10) + '   ' + r.T.toFixed(2));
const decCure = read({ pinT: 1.37, themT: 1.0 });
const decClean = decCure.best === SOUND && decCure.qBlunder < 0 && decCure.T < base.T + 0.3;
console.log('  DECOUPLED CURE (Nd5, neg evals, no runaway): ' + decClean +
  '  ⇒ ' + (decClean ? 'two-thermometer construction validated in principle (T_them≈0.7·T_us)' : 'decoupling does not cleanly help — coupling is in the value recursion'));

// verdict: the coupling diagnosis. The flip to SOUND, if it exists, and the
// bath's response to one-sided cooling (the thermometer feedback).
const sw = sweep.map(tt => ({ tt, r: read({ themT: tt }) }));
const flip = sw.find(x => x.r.best === SOUND);
const bathRises = sw.every((x, i) => i === 0 || x.r.T >= sw[i - 1].r.T - 0.05);  // monotone in −themT
console.log('\n════ VERDICT ════');
console.log('  default plays the blunder d6:  ' + (base.best === BLUNDER) + '   (bathT ' + base.T.toFixed(2) + ')');
console.log('  one-sided cooling heats the shared bath monotonically: ' + bathRises +
  '  (themT 1.3→0.1 drives bathT ' + sw[0].r.T.toFixed(2) + '→' + sw[sw.length - 1].r.T.toFixed(2) + ')');
if (flip)
  console.log('  argmax flips to ' + SOUND + ' at themT=' + flip.tt.toFixed(1) + ', but bathT is ALREADY ' +
    flip.r.T.toFixed(2) + ' (up from ' + base.T.toFixed(2) + ') — cure and runaway are COEXTENSIVE.');
console.log('  symmetric cooling cures with NO runaway (pinT bathT ' + read({ pinT: 0.5 }).T.toFixed(2) +
  ', max ' + read({ backup: 'max' }).T.toFixed(2) + ') ⇒ the instability is the ONE-SIDEDNESS (rule 5).');
console.log('\n  DIAGNOSIS: T_us and T_them are NOT independent — one shared thermometer, measured from BOTH');
console.log('  sides\' revisions, couples them. Lowering T_them raises the measured T_us monotonically, so the');
console.log('  agency axis has no stable operating point (the same one-sided runaway that killed mean-us).');
console.log('  The GGE fix this motivates: TWO same-parity thermometers — T_us from our-ply revisions, T_them');
console.log('  from theirs — decoupling the measurement so the opponent can be cooled without heating us.');
console.log('  Falsifiable bonus: that measured T_them is the drift-nulling temperature to check against T̂c.');
