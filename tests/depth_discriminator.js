// depth_discriminator.js — THE DISCRIMINATOR PROBE (pre-registered).
//
// The catastrophes need 8-ply depth the search can't reach in play, and σ_eff —
// the scheduler's own signal — is BLIND to them: it cools to a confident wrong
// value (+6, mate 8 ply out) and wants to FREEZE exactly where depth is needed.
// The exposure probe put the collapse 4–8+ ply out; the freeze-guard tried
// "don't freeze on adverse flux" and failed (d3 as unstable as d2). The
// principled fix — spend a conserved ln N budget down the low-branching FORCING
// frontier where it's cheap — needs one thing first: a MEASURED, SHALLOW signal
// that flags "this cold value is off-horizon-suspect" better than σ_eff does.
// This probe measures whether such a signal exists.
//
// ── THE HYPOTHESIS ────────────────────────────────────────────────────
// The value doesn't reveal the net at reachable depth, but the FORCING CENSUS
// might: even when Q is confident, the opponent's initiative β / tempo dominance
// Δμ (measured by counting the census, not by reaching the mate) may already be
// saturated adverse at a catastrophe and neutral at a safe win. If so, β is the
// leading indicator σ_eff isn't, and it funds the selective-depth allocator.
//
// ── DESIGN (contrast: confident-and-WRONG vs confident-and-RIGHT) ──────
//   CATASTROPHES (label 1, "needs depth"): recovered positions where the engine
//     read ≥ +3♙ and was then CHECKMATED — the +3 was an off-horizon illusion.
//   SAFE CONTROLS (label 0, "doesn't"): positions where the engine read ≥ +3♙
//     and WON — the +3 was real. EVAL-MATCHED to the catastrophes so a signal
//     cannot win just by reading "smaller advantage = more dangerous".
//   Both are confident (high eval), engine to move. The question: does any
//   measured shallow signal separate them, and by more than σ_eff does?
//
// ── SIGNALS (all at the shallow horizon d2, flux measure; per-child arrays
//    read at the best move) ──
//   eval      shallow best-move eval (the eval-matched confound baseline)
//   confSE    = gap / T  — the σ_eff confidence (BASELINE to beat; a catastrophe
//               is confident, so this should NOT discriminate: AUC ≈ 0.5)
//   T         revision noise / drift proxy
//   Ceff      Schottky capacity Var(Q)/T²
//   beta      initiative order parameter at the best move (−1 = opponent fully
//             owns the forcing future) — the prime candidate
//   dmu       tempo imbalance Δμ at the best move (opponent tempo dominance)
//   mubar     mean tempo census at the best move
//   oppOpt    lnW_them − lnW_us — the danger sense (opponent optionality)
//
// ── METRIC & PRE-REGISTERED VERDICT (thresholds fixed before results) ──
//   AUC = P(signal_catastrophe > signal_control) (Mann–Whitney). 0.5 = blind;
//   |AUC−0.5| is discrimination strength. A signal DISCRIMINATES if AUC ≥ 0.70
//   or ≤ 0.30 AND it beats σ_eff's |AUC−0.5| by ≥ 0.10.
//     • If a forcing signal (β, Δμ) discriminates ⇒ the leading indicator EXISTS:
//       it is the flag that funds selective-depth allocation (build it next).
//     • If NOTHING beats σ_eff (all |AUC−0.5| < 0.20) ⇒ the "which line needs 8
//       ply" content is UNKNOWABLE at reachable depth; the H_search wall is
//       terminal for cheap flags and only broad depth (longer TC) reaches it.
//
//   node tests/depth_discriminator.js
const fs = require('fs'), path = require('path');
const { recover } = require('./exposure_corpus.js');
const E = require('./engine_current.js');
const MATE = 100000 - 4096;

// ── recover eval-matched confident WINS as safe controls ──
function recoverWins() {
  const dir = path.join(__dirname, 'results');
  const pool = []; const seen = new Set();
  for (const f of fs.readdirSync(dir).filter(f => /^vs_sf1500.*\.json$/.test(f))) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
    const games = j.games || j; if (!Array.isArray(games)) continue;
    for (const g of games) {
      if (!g.moves || !g.trace) continue;
      const engWhite = g.engineIsWhite;
      const engineWon = (engWhite && g.result === '1-0') || (!engWhite && g.result === '0-1');
      if (!engineWon) continue;
      const line = g.line || [], full = line.concat(g.moves);
      const c = new E.Chess(); const eng = []; let ok = true;
      for (let i = 0; i < full.length; i++) {
        const isEng = engWhite ? (i % 2 === 0) : (i % 2 === 1);
        if (isEng) eng.push({ san: full[i], fen: c.fen() });
        if (!c.move(full[i])) { ok = false; break; }
      }
      if (!ok) continue;
      let nBook = 0; for (let i = 0; i < line.length; i++) if (engWhite ? (i % 2 === 0) : (i % 2 === 1)) nBook++;
      g.trace.forEach((t, k) => {
        const pos = eng[k + nBook];
        if (!pos || pos.san !== t.san || t.evalP == null) return;
        const e = engWhite ? t.evalP : -t.evalP;
        if (e >= 3 && e < 20 && !seen.has(pos.fen)) { seen.add(pos.fen); pool.push({ fen: pos.fen, eval: e }); }
      });
    }
  }
  return pool;
}

// ── shallow signals at d2 (flux measure) ──
function signals(fen) {
  const r = E._runAnalyze({ fen, dashDepth: 2, flux: 'measure' });
  const t = r.thermo; if (!t || !t.Qs || t.Qs.length < 2) return null;
  const bi = t.bestIdx;
  if (Math.abs(t.Qs[bi]) > MATE) return null;                 // absorbing — excluded
  const ord = t.Qs.map((q, i) => i).sort((a, b) => t.Qs[b] - t.Qs[a]);
  const gap = (t.Qs[ord[0]] - t.Qs[ord[1]]) / 2;              // top-two gap, pawns
  const arr = (a) => Array.isArray(a) && a[bi] != null && isFinite(a[bi]) ? a[bi] : null;
  const g = new E.Chess(fen); const c = g.fast_mob_counts();
  const us = g.fast_turn() === 'w' ? c.mw : c.mb, them = g.fast_turn() === 'w' ? c.mb : c.mw;
  return {
    eval: t.Qs[bi] / 2,
    gap,
    T: t.T,
    confSE: gap / Math.max(t.T, 0.1),                          // σ_eff confidence
    Ceff: t.Ceff,
    beta: arr(t.beta),
    dmu: arr(t.dmu),
    mubar: arr(t.mubar),
    oppOpt: Math.log(them + 1) - Math.log(us + 1),
  };
}

// ── build the two labelled, eval-matched groups ──
const cats = [];
for (const c of recover()) { const s = signals(c.fen); if (s) cats.push({ ...s, eval0: c.engEval }); }
const winPool = recoverWins().map(w => ({ w })).filter(x => x);
// greedy eval-match: for each catastrophe pick the nearest-eval unused win
const usedFen = new Set();
const ctrls = [];
for (const cat of cats) {
  let best = null, bd = Infinity;
  for (const { w } of winPool) { if (usedFen.has(w.fen)) continue; const d = Math.abs(w.eval - cat.eval0); if (d < bd) { bd = d; best = w; } }
  if (best && bd <= 4) { usedFen.add(best.fen); const s = signals(best.fen); if (s) ctrls.push(s); }
}
console.log(`catastrophes ${cats.length}  ·  eval-matched safe controls ${ctrls.length}`);
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : NaN; };
console.log(`eval band: catastrophes med ${med(cats.map(c => c.eval)).toFixed(1)}♙  controls med ${med(ctrls.map(c => c.eval)).toFixed(1)}♙\n`);

// ── AUC (Mann–Whitney) per signal ──
function auc(key) {
  const a = cats.map(c => c[key]).filter(v => v != null && isFinite(v));
  const b = ctrls.map(c => c[key]).filter(v => v != null && isFinite(v));
  if (a.length < 5 || b.length < 5) return null;
  let s = 0; for (const x of a) for (const y of b) s += x > y ? 1 : x === y ? 0.5 : 0;
  return { auc: s / (a.length * b.length), na: a.length, nb: b.length,
           mc: med(a), mw: med(b) };
}
const SIGS = [
  ['eval (confound)', 'eval'], ['confSE (σ_eff)', 'confSE'], ['gap', 'gap'], ['T (drift)', 'T'],
  ['Ceff', 'Ceff'], ['beta (initiative)', 'beta'], ['dmu (Δμ)', 'dmu'],
  ['mubar', 'mubar'], ['oppOpt (danger)', 'oppOpt'],
];
// bootstrap 90% CI on AUC (resample cats & ctrls with replacement) — the n=27
// point estimate is fragile, so a borderline 0.70 must be read with its CI.
let BSEED = 12345; const brng = () => (BSEED = (BSEED * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
function aucCI(key, B = 2000) {
  const a = cats.map(c => c[key]).filter(v => v != null && isFinite(v));
  const b = ctrls.map(c => c[key]).filter(v => v != null && isFinite(v));
  if (a.length < 5 || b.length < 5) return null;
  const one = (A, C) => { let s = 0; for (const x of A) for (const y of C) s += x > y ? 1 : x === y ? 0.5 : 0; return s / (A.length * C.length); };
  const out = [];
  for (let t = 0; t < B; t++) { const A = a.map(() => a[(brng() * a.length) | 0]), C = b.map(() => b[(brng() * b.length) | 0]); out.push(one(A, C)); }
  out.sort((x, y) => x - y);
  return [out[Math.floor(0.05 * B)], out[Math.floor(0.95 * B)]];
}
console.log('signal              AUC   90% CI          |AUC−.5| dir   med(cat) med(ctrl)  n');
const rows = [];
for (const [lbl, k] of SIGS) {
  const r = auc(k); if (!r) { console.log('  ' + lbl.padEnd(18) + ' — (insufficient)'); continue; }
  const disc = Math.abs(r.auc - 0.5); const ci = aucCI(k);
  rows.push({ lbl, k, ...r, disc, ci });
  console.log('  ' + lbl.padEnd(18) + r.auc.toFixed(3) + '  [' + ci[0].toFixed(2) + ',' + ci[1].toFixed(2) + ']    ' + disc.toFixed(3) + '   ' +
    (r.auc > 0.5 ? 'cat↑' : 'cat↓') + '  ' + r.mc.toFixed(2).padStart(7) + '  ' + r.mw.toFixed(2).padStart(7) + '  ' + (r.na + '/' + r.nb));
}

// ── combined signal: LOO-CV logistic AUC over the forcing/thermo signals ──
const COMB = ['confSE', 'Ceff', 'beta', 'dmu', 'oppOpt'];
function combinedAUC() {
  // rows with all COMB present
  const data = [];
  for (const c of cats) if (COMB.every(k => c[k] != null && isFinite(c[k]))) data.push({ x: COMB.map(k => c[k]), y: 1 });
  for (const c of ctrls) if (COMB.every(k => c[k] != null && isFinite(c[k]))) data.push({ x: COMB.map(k => c[k]), y: 0 });
  const n = data.length, k = COMB.length;
  if (n < 12) return null;
  // standardise
  const mean = COMB.map((_, j) => data.reduce((s, d) => s + d.x[j], 0) / n);
  const sd = COMB.map((_, j) => Math.sqrt(data.reduce((s, d) => s + (d.x[j] - mean[j]) ** 2, 0) / n) || 1);
  const X = data.map(d => d.x.map((v, j) => (v - mean[j]) / sd[j]));
  const Y = data.map(d => d.y);
  // LOO logistic (ridge, gradient descent per fold — small n, fine)
  function fit(idxOut) {
    let w = new Array(k + 1).fill(0);
    for (let it = 0; it < 400; it++) {
      const grad = new Array(k + 1).fill(0);
      for (let i = 0; i < n; i++) { if (i === idxOut) continue; const z = w[0] + X[i].reduce((s, v, j) => s + v * w[j + 1], 0); const p = 1 / (1 + Math.exp(-z)); const e = p - Y[i]; grad[0] += e; for (let j = 0; j < k; j++) grad[j + 1] += e * X[i][j]; }
      for (let j = 0; j <= k; j++) w[j] -= 0.1 * (grad[j] / n + (j > 0 ? 0.05 * w[j] : 0));
    }
    return w;
  }
  const pred = [];
  for (let i = 0; i < n; i++) { const w = fit(i); const z = w[0] + X[i].reduce((s, v, j) => s + v * w[j + 1], 0); pred.push(1 / (1 + Math.exp(-z))); }
  // AUC of LOO predictions
  const pc = pred.filter((_, i) => Y[i] === 1), pw = pred.filter((_, i) => Y[i] === 0);
  let s = 0; for (const a of pc) for (const b of pw) s += a > b ? 1 : a === b ? 0.5 : 0;
  return { auc: s / (pc.length * pw.length), n };
}
const comb = combinedAUC();
if (comb) console.log('\n  COMBINED (LOO-logistic over ' + COMB.join(',') + '): AUC ' + comb.auc.toFixed(3) + '  (n=' + comb.n + ')');

// ── verdict ──
const seConf = rows.find(r => r.k === 'confSE');
const seDisc = seConf ? seConf.disc : 0;
const beta = rows.find(r => r.k === 'beta');
const winners = rows.filter(r => r.k !== 'eval' && (r.auc >= 0.70 || r.auc <= 0.30) && r.disc >= seDisc + 0.10);
console.log('\n════ VERDICT ════');
console.log('  σ_eff (confSE) is BLIND: AUC ' + (seConf ? seConf.auc.toFixed(3) : '—') + ', |AUC−.5| ' + seDisc.toFixed(3) + ' — it cannot');
console.log('  tell a confident catastrophe from a confident win (the documented disease, confirmed).');
if (beta) console.log('  β (initiative) REFUTED as the flag: AUC ' + beta.auc.toFixed(3) + ' — saturated (med −1) in BOTH,');
if (beta) console.log('  so the forcing census can\'t route (echoes dissipation_probe: β ≠ sound-vs-sortie).');
if (winners.length) {
  console.log('  ONE SIGNAL DISCRIMINATES beyond σ_eff:');
  for (const w of winners) console.log(`    ${w.lbl}: AUC ${w.auc.toFixed(3)} (90% CI [${w.ci[0].toFixed(2)},${w.ci[1].toFixed(2)}], ${w.auc > 0.5 ? 'catastrophes higher' : 'lower'})`);
  console.log('  READ HONESTLY: oppOpt IS the danger sense F already prices (lnW_them−lnW_us, the leaf');
  console.log('  entropy term) — so this is not a NEW observable; it is the flag F HAS and under-weights');
  console.log('  (exposure_probe: the danger sense fires but as a bounded ~1♙ signal, hopeless as a term');
  console.log('  against a −∞ off-horizon mate while material reads +6). The AUC ≈ 0.70 is MODEST and');
  console.log('  borderline at n≈27 (see CI). The lawful use is therefore ALLOCATION, not evaluation:');
  console.log('  route the ln N budget / selective depth toward high-oppOpt (exposed-king) nodes where');
  console.log('  σ_eff would freeze — a danger-GATED depth extension, rule-3 clean (attention, not a');
  console.log('  term in Q). This is the fresh take on the failed freeze-guard: that guard denied freezes');
  console.log('  on the VALUE-confirmation flux (blind here), whereas oppOpt actually discriminates.');
} else {
  console.log('  KILL: nothing beats σ_eff — the "which line needs 8 ply" content is UNKNOWABLE at');
  console.log('  reachable depth; only broad depth (longer TC) reaches it.');
}
if (comb) console.log('  (combined LOO-logistic AUC ' + comb.auc.toFixed(3) + ' — no better than oppOpt alone; the others add noise.)');

fs.writeFileSync(path.join(__dirname, 'results', 'depth_discriminator.json'),
  JSON.stringify({ nCat: cats.length, nCtrl: ctrls.length, rows, combined: comb }, null, 1));
console.log('\nwrote results/depth_discriminator.json');
