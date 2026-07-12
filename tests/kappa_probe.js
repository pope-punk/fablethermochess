// kappa_probe.js — deriving κ (the opponent/us temperature ratio) from first
// principles, and validating the algebra against the code.
//
// METHOD (per CLAUDE.md): derive → check identities → validate code → measure.
//
// THE CORRECTION this fixes. A prior pass concluded "there is no clean κ; the
// self-indulgence lives in ⟨Q⟩, not the entropy." That was a SILLY MISTAKE
// caught by doing the clean computation: it compared the two opponent replies at
// their OWN (different) measured baths. At a COMMON temperature the entropies
// differ and the disease is the opponent's PREMIUM after all. κ is derivable.
//
// THE DERIVATION. At the Alekhine (1.e4 Nf6 2.e5, Black to move), the blunder d6
// and the sound Nd5 lead to opponent (White) positions of different SHAPE:
//   d6 →child: PEAKED  (high max — the knight-win — low premium/entropy)
//   Nd5→child: FLAT    (lower max, high premium/entropy)
// Our value of a move is −F(child), F(T) = maxQ + T·s_eff. We wrongly prefer d6
// (lower F) while the bath is hot; the ranking flips at the crossover T* where
//     F_d6(T*) = F_Nd5(T*)   ⟺   T*·Δs = Δ(maxQ)   ⟺   κ = T*/T_us = Δmax/Δprem.
// This T* is a phase-COEXISTENCE temperature between an ordered (forced) and a
// disordered (free) opponent reply. The self-indulgence is simply that our bath
// sits ABOVE it.
//
// THE FIRST-PRINCIPLES FORM (validated below): the crossover T* equals the
// opponent reply's Schottky CONDENSATION temperature T̂ (the spinodal the engine
// already measures). A responder will resolve their choice — condense onto their
// best move — so they must be evaluated at the temperature where that happens,
// their own T̂, while we stay at our warm bath (we have not committed). Hence
//     κ = T̂_them / T_us,    both measured, no tuned constant.
// κ < 1 because a forced reply condenses below an open initiative.
//
//   RESULT (Alekhine): crossover T* ≈ 0.87, T̂(d6-child) = 0.865 (match),
//   κ ≈ 0.63 — on the empirical cure (themT≈1.0 flips to Nd5). CAVEATS: one
//   decision; the crossover tracks the SHARPER reply's T̂ (peaked child); the
//   deep value-recursion coupling (fractal winner's curse at every ply) is
//   untouched here — this derives the IMMEDIATE-reply κ only. Generalization
//   across a self-indulgence corpus is the next gate.
//
//   node tests/kappa_probe.js
const E = require('./engine_current.js');

const root = new E.Chess(); for (const m of ['e4', 'Nf6', 'e5']) root.move(m);
const rth = E._runAnalyze({ fen: root.fen(), dashDepth: 4 }).thermo;
const Tus = rth.T;

function childInfo(m) {
  const g = new E.Chess(root.fen()); g.move(m);
  const t = E._runAnalyze({ fen: g.fen(), dashDepth: 3, pinT: Tus }).thermo;  // COMMON T
  const Qs = t.Qs.slice(), maxQ = Math.max(...Qs);
  return { Qs, maxQ, avgQ: t.avgQ, S: t.S, F: t.F, prem: t.F - maxQ, Tspin: t.Tspin };
}
const d6 = childInfo('d6'), n5 = childInfo('Nd5');
const F = (Qs, T) => { const mx = Math.max(...Qs); return mx + T * Math.log(Qs.reduce((s, q) => s + Math.exp((q - mx) / T), 0)); };

console.log('Alekhine — us bathT=' + Tus.toFixed(3) + '  (our own Schottky T̂=' + rth.Tspin.toFixed(3) + ')\n');
console.log('reply   maxQ    prem(F-max)   S      Schottky T̂');
for (const [lbl, x] of [['d6 ', d6], ['Nd5', n5]])
  console.log('  ' + lbl + '   ' + x.maxQ.toFixed(2).padStart(5) + '   ' + x.prem.toFixed(2).padStart(6) +
    '     ' + x.S.toFixed(2) + '     ' + x.Tspin.toFixed(3));

// (1) algebraic κ from Δmax/Δprem
const kAlg = (d6.maxQ - n5.maxQ) / (n5.prem - d6.prem);
// (2) numerical crossover T* where F_d6(T)=F_Nd5(T)
let Tstar = null, prev = null;
for (let T = 1.8; T > 0.3; T -= 0.005) { const diff = F(d6.Qs, T) - F(n5.Qs, T); if (prev !== null && (prev > 0) !== (diff > 0)) { Tstar = T + 0.0025; break; } prev = diff; }
// (3) Schottky form κ = T̂_them / T_us  (sharper reply's condensation temp)
const That = Math.max(d6.Tspin, n5.Tspin);   // the peaked reply condenses higher; it sets the crossover

console.log('\n── κ three ways ──');
console.log('  (1) algebraic  Δmax/Δprep            = ' + kAlg.toFixed(3));
console.log('  (2) numerical  crossover T*/T_us     = ' + (Tstar / Tus).toFixed(3) + '   (T* = ' + Tstar.toFixed(3) + ')');
console.log('  (3) Schottky   T̂_them/T_us            = ' + (That / Tus).toFixed(3) + '   (T̂_them = ' + That.toFixed(3) + ')');
console.log('  empirical cure (themT≈1.0 flips→Nd5): ' + (1.0 / Tus).toFixed(3));
console.log('\n  T* vs T̂_them: ' + Tstar.toFixed(3) + ' vs ' + That.toFixed(3) +
  '  → ' + (Math.abs(Tstar - That) < 0.1 ? 'MATCH: κ = T̂_them/T_us, both measured, no tuning' : 'mismatch — Schottky form not confirmed here'));
