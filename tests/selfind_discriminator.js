// selfind_discriminator.js — the derived discriminator, measured.
//
// DERIVATION (per CLAUDE.md method). Self-indulgence ⟺ Δmax(d) < T·Δs: the
// opponent's material edge after our move (Δmax, GROWS with depth as the killer
// resolves) is outweighed by their over-valued optionality (T·Δs, fixed). So the
// signature that separates self-indulgence from SOUND flexibility (both have a
// large premium) is whether the opponent's best reply RESOLVES MATERIAL with depth:
//     δmax  =  maxQ(chosen-child; d+2) − maxQ(chosen-child; d)
//   opponent POV, so δmax > 0 ⇒ the opponent's best improves with depth (a hidden
//   killer crystallising off-horizon). This is the LAYER-2 material-horizon axis —
//   the one λ̂ (sibling correlation) could not see.
//
//   PREDICTION: self-indulgence cases have δmax ≫ 0; high-premium SOUND controls
//   have δmax ≈ 0. Both have comparable premium (so the discriminator is δmax, not
//   premium). If clean, δmax is an attention trigger (rule-3) that fingers WHERE
//   the load-bearing premium is hiding growing material — without deflating it.
//
// ── VERDICT (dedup'd: 8 self-ind, 26 sound controls, depth 3→5): WEAK, and a
//    method-check failure on my part ──
//   (1) PREDICTION REFUTED: neither group has δmax ≫ 0 (self-ind mean −0.07,
//       control −0.48). (2) I MEASURED THE WRONG QUANTITY: the derivation is about
//       Δmax = maxQ_B − maxQ_S (a blunder-vs-sound DIFFERENCE, a between-move
//       observable that doesn't apply to controls); the code measured d(maxQ_chosen)/dd
//       for a single move. Step-3 of the method (verify the code computes the
//       derived quantity) failed, caught post-hoc. (3) The incidental signal that
//       DID appear — sound moves' opponent-threats fizzle with depth (δmax<0),
//       self-indulgence's persist (δmax≈0) — is real in the mean (~0.4♙) but the
//       distributions OVERLAP badly; not a per-case discriminator.
//
//   THE UNIFYING NEGATIVE this forces: self-indulgence has NO cheap local/
//   per-position detector — not entropy (deflation), not correlation (λ̂), not
//   temperature (κ), not opponent-threat-persistence (δmax). Every attempt to
//   find a COLLECTIVE signature of a TRAJECTORY-blindness fails, because the
//   blindness IS a specific trajectory, revealed only by searching it (the same
//   wall dissipation_probe and exposure_probe hit). The evaluation cannot cheaply
//   know where it is blind. So "a free energy that knows where it's blind" is not
//   achievable on the cheap; concentrated attention has no cheap trigger, leaving
//   uniform depth (alloc, neutral) or the uncertainty-proxy scheduler (+1.5) as
//   the only lawful channels. This is the type-a/type-b boundary in its hardest
//   form, and it caps the EVALUATION-side ceiling near where it already sits.
//
//   node tests/selfind_discriminator.js
const fs = require('fs'), path = require('path');
const E = require('./engine_current.js');
const PAWN = 2, MATE_NEAR = 100000 - 4096;

// self-indulgence group: recovered from the durable kappa corpus (fen, chosen=B)
const jl = fs.readFileSync(path.join(__dirname, 'results', 'kappa_corpus.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const selfind = jl.map(r => ({ fen: r.fen, chosen: r.B, tag: 'SELF-IND(' + r.bucket + ')' }));

// control group: SOUND flexible positions — F argmax == hard-minimax argmax AND high entropy
const LINES = [
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6'], ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7'],
  ['e4', 'e6', 'd4', 'd5', 'Nd2', 'Nf6', 'e5', 'Nfd7'], ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3'],
  ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O'], ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2', 'e6', 'O-O', 'Be7'],
  ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e5'], ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'],
];
const controls = [];
for (const line of LINES) {
  const g = new E.Chess(); const seen = new Set();
  for (let i = 0; i <= line.length && controls.length < 60; i++) {
    const fen = g.fen();
    if (!g.game_over() && !seen.has(fen)) {
      seen.add(fen);
      const fd = E._runAnalyze({ fen, dashDepth: 3 }).thermo;
      const fh = E._runAnalyze({ fen, dashDepth: 3, backup: 'max' }).thermo;
      if (fd && fh && fd.moves[fd.bestIdx] === fh.moves[fh.bestIdx] && fd.S > 2.5)   // sound AND flexible
        controls.push({ fen, chosen: fd.moves[fd.bestIdx], tag: 'CONTROL' });
    }
    if (i < line.length && !g.move(line[i])) break;
  }
}

// the derived measurement: δmax and premium at the chosen-child
function measure(fen, chosen) {
  const g = new E.Chess(fen); if (!g.move(chosen)) return null;
  const cf = g.fen();
  const t3 = E._runAnalyze({ fen: cf, dashDepth: 3 }).thermo;
  const t5 = E._runAnalyze({ fen: cf, dashDepth: 5 }).thermo;
  if (!t3 || !t5) return null;
  const m3 = Math.max(...t3.Qs), m5 = Math.max(...t5.Qs);
  if (Math.abs(m3) > MATE_NEAR || Math.abs(m5) > MATE_NEAR) return null;   // absorbing
  return { dmax: (m5 - m3) / PAWN, prem: (t3.F - m3) / PAWN };             // pawns; δmax>0 = opponent resolving material
}

const OUT = path.join(__dirname, 'results', 'selfind_discriminator.jsonl');
fs.writeFileSync(OUT, '');
const rows = [];
for (const c of selfind.concat(controls)) {
  const m = measure(c.fen, c.chosen);
  if (!m) continue;
  const rec = { tag: c.tag, chosen: c.chosen, dmax: +m.dmax.toFixed(2), prem: +m.prem.toFixed(2), fen: c.fen };
  rows.push(rec); fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
  process.stderr.write(rec.tag.padEnd(18) + ' ' + rec.chosen.padEnd(6) + ' δmax=' + rec.dmax.toFixed(2) + ' prem=' + rec.prem.toFixed(2) + '\n');
}

const grp = t => rows.filter(r => r.tag.startsWith(t));
const stat = a => { if (!a.length) return { n: 0 }; const v = a.slice().sort((x, y) => x - y); const md = v[v.length >> 1]; const mn = a.reduce((s, x) => s + x, 0) / a.length; return { n: a.length, mean: +mn.toFixed(2), median: +md.toFixed(2) }; };
const S = grp('SELF-IND'), C = grp('CONTROL');
console.log('\n=== self-indulgence vs SOUND control: δmax = opponent maxQ(d5)−maxQ(d3), pawns ===\n');
console.log('  group         n   premium(mean)   δmax(mean)  δmax(median)   δmax>0.3');
for (const [nm, g] of [['SELF-IND', S], ['CONTROL ', C]]) {
  const dd = g.map(r => r.dmax), pp = g.map(r => r.prem);
  const sp = stat(dd), spp = stat(pp);
  console.log('  ' + nm + '   ' + String(sp.n).padStart(2) + '     ' + (spp.mean != null ? spp.mean.toFixed(2) : '—').padStart(6) +
    '        ' + (sp.mean != null ? sp.mean.toFixed(2) : '—').padStart(6) + '      ' + (sp.median != null ? sp.median.toFixed(2) : '—').padStart(6) +
    '        ' + g.filter(r => r.dmax > 0.3).length + '/' + g.length);
}
const sepMean = (stat(S.map(r => r.dmax)).mean || 0) - (stat(C.map(r => r.dmax)).mean || 0);
console.log('\n  δmax separation (self-ind − control, mean) = ' + sepMean.toFixed(2) + ' pawns');
console.log('  premium comparable? self-ind ' + (stat(S.map(r => r.prem)).mean) + ' vs control ' + (stat(C.map(r => r.prem)).mean) +
  '  → discriminator is ' + (Math.abs((stat(S.map(r => r.prem)).mean || 0) - (stat(C.map(r => r.prem)).mean || 0)) < 0.6 ? 'δmax (premium comparable)' : 'confounded by premium'));
fs.writeFileSync(path.join(__dirname, 'results', 'selfind_discriminator.json'), JSON.stringify({ rows }, null, 1));
console.log('\nwrote results/selfind_discriminator.json');
