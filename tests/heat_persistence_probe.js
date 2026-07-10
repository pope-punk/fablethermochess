// Heat persistence — does shallow thermal fluctuation predict where depth
// changes the answer? The load-bearing test for magnitude-guided adaptive
// deepening.
//
// The reframe (session log): the measured quantities (C, |ΔQ|, β, λ̂, bite,
// basin gap, the Δμ-vs-∂Q divergence) are KINETIC — diagnostics of local
// non-equilibrium whose lawful role is steering the cooling schedule
// (where to deepen), not correcting the equilibrium free energy F. Every
// mechanism that acted on F died (rule 3); every one that acted on the
// schedule/attention survived (σ_eff scheduler +1.5, alloc neutral, qCheck
// finds sacs). The metaphor says these are kinetic, not state.
//
// This probe tests the NAIVE kinetic proxy: per-move revision MAGNITUDE.
// For each root move, r13 = |Q(d3) − Q(d1)|, r35 = |Q(d5) − Q(d3)| (all
// odd depths = same parity, the entropy ladder cancels). If high r13
// predicts high r35, "deepen what just moved" is well founded.
//
// VERDICT (pooled over 4 positions, 126 move·position pairs):
//   Pearson r(r13,r35) = 0.197   (weak)
//   Spearman ρ         = 0.040   (≈ zero — no rank relationship)
//   top-quartile-by-r13 moves carry 37% of total future revision (random
//     = 25%): mild concentration, far from predictive.
//   ⇒ per-move revision magnitude is essentially MEMORYLESS. "Deepen the
//     moves that revised most" ≈ random. This is why alloc (a Boltzmann-
//     window, magnitude-like allocation) came out strength-neutral.
//   The physical reason: a big revision is usually a RESOLVED tactic (a
//     one-time jump that then stabilizes), while the depth-hungry moves
//     are slow bleeders (the queen sortie drifts a little each ply, never
//     spikes). Fluctuation magnitude is discharged noise.
//   REDIRECT: the allocation signal must be STRUCTURAL (geometry/counting)
//     not magnitude (measurement). Measurement is right for the STATE (T);
//     geometry is right for the SCHEDULE (where to cool). qCheck (check-
//     geometry), the bite (branching collapse), and basin boundaries are
//     the stable, persistent kinetic signals — and qCheck is the only
//     family member that found tactics magnitude-guided depth never did.
//
//   node tests/heat_persistence_probe.js
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
function after(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g.fen(); }
const MATE = 100000 - 4096;

const POS = [
  ['startpos',      new E0.Chess().fen()],
  ['Alekhine',      after(['e4','Nf6','e5'])],
  ['middlegame',    'r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 10'],
  ['open Sicilian', after(['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'])],
];
const pairs = [];
for (const [, fen] of POS) {
  const q = {};
  for (const d of [1, 3, 5]) {
    const t = fresh()._runAnalyze({ fen, dashDepth: d }).thermo;
    for (let i = 0; i < t.moves.length; i++) {
      if (Math.abs(t.Qs[i]) > MATE) continue;
      (q[t.moves[i]] = q[t.moves[i]] || {})['d' + d] = t.Qs[i];
    }
  }
  for (const m in q) { const v = q[m]; if (v.d1 == null || v.d3 == null || v.d5 == null) continue;
    pairs.push([Math.abs(v.d3 - v.d1), Math.abs(v.d5 - v.d3)]); }
}
function pearson(a) { const n = a.length; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of a) { sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; }
  return (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)); }
function spearman(a) { const rank = arr => { const idx = arr.map((v, i) => i).sort((i, j) => arr[i] - arr[j]);
  const r = []; idx.forEach((v, k) => r[v] = k); return r; };
  const rx = rank(a.map(p => p[0])), ry = rank(a.map(p => p[1]));
  return pearson(rx.map((v, i) => [v, ry[i]])); }

console.log('n=' + pairs.length + ' (move,position) pairs');
console.log('Pearson r(r13, r35) = ' + pearson(pairs).toFixed(3) + '   (weak)');
console.log('Spearman rho        = ' + spearman(pairs).toFixed(3) + '   (≈0 → revision magnitude is memoryless)');
pairs.sort((a, b) => b[0] - a[0]);
const nq = Math.ceil(pairs.length / 4); let topR35 = 0, allR35 = 0;
pairs.forEach((p, i) => { allR35 += p[1]; if (i < nq) topR35 += p[1]; });
console.log('top-quartile-by-r13 carry ' + (100 * topR35 / allR35).toFixed(0) + '% of future revision (random 25%)');
console.log('\nVERDICT: magnitude-guided adaptive deepening REFUTED; allocation must be structural (geometry), not fluctuation (measurement).');
