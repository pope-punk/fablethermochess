// Dissipative-initiative order parameter — PRE-REGISTERED corpus diagnostic.
//
// HYPOTHESIS (from the queen-sortie deep-dive, session log). The engine
// cannot tell a premature queen sortie (Qh5) from sound aggression,
// because every internal instrument agrees the sortie is strong: it
// constrains the opponent (reply n_eff 2.9 vs 8.0 for quiet moves) and
// the tempo census reads sustained initiative (Δμ +3 to +4 across depth).
// What betrays it is a SIGN MISMATCH between two already-measured
// quantities:
//   · Δμ  = the initiative field (flux census): are we forcing? (>0 yes)
//   · ∂Q/∂depth = the signed SAME-PARITY value revision: is it working?
// Real initiative CONVERTS: Δμ>0 and value rising. A premature sortie
// DISSIPATES: Δμ>0 while the value bleeds — forcing work that does no
// work on the position, tempo spent as heat. This is dissipation in the
// exact thermodynamic sense (work in, stored free energy down).
//
// PRE-REGISTERED DECISION RULE (thresholds fixed BEFORE seeing results):
//   flag DISSIPATIVE  ⇔  Δμ > 1.0  AND  drift < −0.5
//   where drift = Q(d5) − Q(d3)  (same parity: the ladder cancels).
//   A move that reaches a mate score by d5 is ABSORBING, not thermal →
//   classified converting by fiat (a found forced win never dissipates).
//
// PRE-REGISTERED SUCCESS / KILL CRITERIA:
//   · SUCCESS: the rule flags ≥ ¾ of the dissipative corpus and ≤ ¼ of
//     the converting corpus.
//   · KILL: if the rule flags a SOUND SACRIFICE (the sac subset below) —
//     a sac's value dips before its compensation is on-horizon, the
//     textbook false positive; one sac tripped is a fatal flaw for any
//     use of this signal as attention (we'd starve exactly the lines
//     that need depth). The sac subset is the load-bearing test.
//
// ── VERDICT: FAILS (pre-registered kill criterion met — July 2026) ──
//   dissipative D: 4/6 flagged (needed 5 — under-sensitive: Scholar-Qh5
//     had Δμ +0.6 below threshold; premature-Qf3 drifted UP, +0.39).
//   converting  C: 0/4 flagged (clean on quiet development).
//   sound sacs  S: 1/2 flagged — **Legal's Mate Nxe5 tripped**
//     (Δμ +3.6, Q −14.42 → −15.23, drift −0.81 = DISSIPATIVE). FATAL.
//   The queen sac reads dissipative for the textbook reason: at d3–d5
//     the engine sees Nxe5 as dropping the queen (Q ≈ −14) because the
//     Bxf7+/Nd5# mate is beyond horizon, so its value bleeds while the
//     census reads forcing — bit-for-bit the Qh5 signature.
//   WHY IT DIES, and it's deep: Δμ>0 ∧ ∂Q/∂depth<0 is NOT the signature
//     of dissipation — it is the signature of ANY forcing line whose
//     payoff is beyond the current horizon. A premature sortie (payoff:
//     never) and a sound sacrifice (payoff: mate at d7) are the SAME
//     observable at d5. The order parameter cannot separate "no payoff"
//     from "payoff I have not reached yet" without reaching it — i.e.
//     without the depth it was meant to replace. It collapses back into
//     the horizon problem, the identical wall this whole session kept
//     hitting: there is no cheap local diagnostic that substitutes for
//     search. Using it as attention would STARVE sacrifices (defer the
//     lines that most need depth) — the precise opposite of correct.
//   What survives: the divergence is a real and clean signal for
//     "forcing whose payoff is off-horizon" (it catches every such
//     line, sortie AND sac). It just cannot sign the payoff. If it has
//     any use it is the reverse of the one proposed: as an EXTENSION
//     trigger — spend depth on high-Δμ off-horizon lines (sortie and
//     sac alike) to resolve the sign — which is exactly what a
//     forcing-move search extension already does, and reduces to alloc.
//
//   node tests/dissipation_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function fenAfter(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g.fen(); }

// label: 'D' dissipative (premature/dubious sortie), 'C' converting
// (sound initiative), 'S' sound sacrifice (the false-positive test).
const CORPUS = [
  // ── D: premature / dubious sorties (dubious at strong-master level) ──
  ['D', 'Wayward Qh5 (1.e4 e5)',       fenAfter(['e4','e5']),                              'Qh5'],
  ['D', 'Scholar Qh5 (Bc4 out)',       fenAfter(['e4','e5','Bc4','Bc5']),                  'Qh5'],
  ['D', 'Premature Qf3 (1.e4 e5)',     fenAfter(['e4','e5']),                              'Qf3'],
  ['D', 'Premature Qd3 (1.d4 d5)',     fenAfter(['d4','d5']),                              'Qd3'],
  ['D', 'Loose Qh5 vs French',         fenAfter(['e4','e6','d4','d5']),                    'Qh5'],
  ['D', 'Chased-again Qf3',            fenAfter(['e4','e5','Qh5','Nc6','Bc4','g6']),       'Qf3'],
  // ── C: sound initiative / central breaks (theory-approved) ──
  ['C', 'Scotch d4 (real centre)',     fenAfter(['e4','e5','Nf3','Nc6']),                  'd4'],
  ['C', 'Ruy Bb5 (sound pressure)',    fenAfter(['e4','e5','Nf3','Nc6']),                  'Bb5'],
  ['C', 'Italian Nf3 (hits e5)',       fenAfter(['e4','e5']),                              'Nf3'],
  ['C', 'Fried Liver Ng5 (sharp,OK)',  fenAfter(['e4','e5','Nf3','Nc6','Bc4','Nf6']),      'Ng5'],
  // ── S: sound sacrifices (THE kill test — value dips before payoff) ──
  ['S', 'Evans Gambit b4',             fenAfter(['e4','e5','Nf3','Nc6','Bc4','Bc5']),      'b4'],
  ['S', "Legal's Mate Nxe5 (Q sac)",   fenAfter(['e4','e5','Nf3','Nc6','Bc4','d6','Nc3','Bg4','h3','Bh5']), 'Nxe5'],
];

const MATE_NEAR = 100000 - 4096;
function qFor(fen, san, depth) {
  const E = fresh();
  const r = E._runAnalyze({ fen, dashDepth: depth, flux: 'measure' });
  const t = r.thermo;
  const i = t.moves.indexOf(san);
  if (i < 0) return null;
  return { q: t.Qs[i], dmu: (t.dmu && t.dmu[i] != null) ? t.dmu[i] : null,
           mate: Math.abs(t.Qs[i]) > MATE_NEAR };
}

console.log('label  position                       cand    dmu     Q(d3)    Q(d5)   drift   flag');
const tally = { D: { n: 0, flagged: 0 }, C: { n: 0, flagged: 0 }, S: { n: 0, flagged: 0 } };
const sacTrips = [];
for (const [label, name, fen, san] of CORPUS) {
  const a = qFor(fen, san, 3);
  const b = qFor(fen, san, 5);
  tally[label].n++;
  if (!a || !b) { console.log('  ' + label + '    ' + name.padEnd(30) + ' ' + san.padEnd(7) + ' (no reading)'); continue; }
  const drift = b.q - a.q;
  const dmu = b.dmu != null ? b.dmu : (a.dmu != null ? a.dmu : null);
  // absorbing: a found forced win is never dissipative
  const diss = !b.mate && dmu != null && dmu > 1.0 && drift < -0.5;
  if (diss) { tally[label].flagged++; if (label === 'S') sacTrips.push(name); }
  console.log('  ' + label + '    ' + name.padEnd(30) + ' ' + san.padEnd(7) +
    (dmu != null ? (dmu >= 0 ? '+' : '') + dmu.toFixed(1) : '  — ').padStart(6) + '  ' +
    (a.q >= 0 ? '+' : '') + a.q.toFixed(2) + '   ' + (b.q >= 0 ? '+' : '') + b.q.toFixed(2) + '   ' +
    (drift >= 0 ? '+' : '') + drift.toFixed(2) + (b.mate ? ' (MATE)' : '') + '   ' + (diss ? 'DISSIPATIVE' : '·'));
}

console.log('\n── separation ──');
console.log('  dissipative corpus (D): flagged ' + tally.D.flagged + '/' + tally.D.n +
  '   (success ≥ ' + Math.ceil(0.75 * tally.D.n) + ')');
console.log('  converting  corpus (C): flagged ' + tally.C.flagged + '/' + tally.C.n +
  '   (success ≤ ' + Math.floor(0.25 * tally.C.n) + ')');
console.log('  sound sacs  corpus (S): flagged ' + tally.S.flagged + '/' + tally.S.n +
  (sacTrips.length ? '   ✗ KILL — false-positive on: ' + sacTrips.join(', ') : '   ✓ no sac tripped'));

const passD = tally.D.flagged >= Math.ceil(0.75 * tally.D.n);
const passC = tally.C.flagged <= Math.floor(0.25 * tally.C.n);
const passS = tally.S.flagged === 0;
console.log('\nVERDICT: ' + (passD && passC && passS
  ? 'SURVIVES — the divergence separates sorties from sound play and spares sacrifices.'
  : 'FAILS — ' + (!passS ? 'a sound sacrifice tripped the detector (fatal).'
      : !passD ? 'did not catch the sorties.' : 'flagged too much sound play.')));
