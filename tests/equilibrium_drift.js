// equilibrium_drift.js — the state-function residual of F (never measured before).
//
// THE EQUILIBRIUM HYPOTHESIS (the project's linchpin, stated as a conservation
// law): if each side plays the real best move, the evaluation stays the same.
// Taken literally, F is a MARTINGALE along the best line — stationary under the
// system's own dynamics — which is exactly the existence condition for a
// thermodynamic STATE FUNCTION (path-independent, no drift at equilibrium). The
// engine's F is NOT conserved under its own self-play, because the search horizon
// rolls: playing the best move and re-searching to depth d injects one more ply
// of lookahead, revising the value. That revision is the RESIDUAL of the
// equilibrium hypothesis — a direct, signed measure of how far F fails to be a
// state function ("the curl of the proposed potential").
//
// TWO THINGS THAT MAKE THE NAIVE VERSION MEANINGLESS, handled here:
//   · PARITY. F carries the one-sided entropy ladder (+T·S per ply), so only
//     SAME-SIDE-TO-MOVE positions are comparable — drifts are measured two-ply
//     apart along the self-play line (rule 5, as a measurement constraint).
//   · THE PROGRESS CONFOUND. A winning side legitimately converts (eval SHOULD
//     move). So the robust signals are not the raw mean drift but: does drift
//     vanish where the position is RESOLVED (low T), does it grow with T, and
//     does the PREMIUM (T·S) leak more than the ENERGY (maxQ) — the last being
//     confound-robust, because progress loads onto energy, not premium.
//
// OBSERVABLES. Engine self-plays its own best move (argmax Q) from several
// openings at fixed depth d. At each ply, mover-POV: maxQ (played value), avgQ
// (⟨Q⟩), TS (premium), F = avgQ + TS (the state function), T, phase. Two-ply
// same-side drifts: ΔF, ΔmaxQ, ΔTS = value(t+2) − value(t). Absorbing plies
// (mate/repetition) excluded — not thermal.
//
// PRE-REGISTERED PREDICTIONS (from the equilibrium hypothesis):
//   (1) CONSERVATION SCALES WITH PREMIUM: the drift is a function of premium
//       size, not phase — low-premium plies conserve F, high-premium plies leak.
//       (v1 binned by PHASE and failed: phase = ensemble concentration, not
//       value conservation — the trebuchet reads "hot" yet has δ≈0. v2 bins by
//       premium tercile with a ROBUST median, and reads the conditional corr.)
//   (3) DYNAMIC WINNER'S CURSE: corr(TS(t), ΔF(t)) < 0 — high premium mean-reverts
//       downward, the static F−⟨Q⟩=TS optimism seen as a conservation violation.
//   (4) THE PREMIUM IS THE LEAKY PART: RMS(ΔTS) ≳ RMS(ΔmaxQ) — most of the
//       state-function violation lives in the entropy premium, not the material.
//   (5) THE RECONSTRUCTION IS A MARTINGALE: F* = ⟨Q⟩ + λ̂·T·S (the Doob
//       correction — subtract the quenched/predictable fraction of the premium)
//       has LOWER drift and weaker premium-correlation than F. If it holds, F*
//       is the honest state function and λ̂ is the deflation coefficient, MEASURED.
//   (6) THE LEAK IS THE QUENCHED FRACTION: among high-premium plies, corr(λ̂, ΔF)
//       > 0 — higher independence (less quenched disorder) ⇒ less downward leak.
//       The drift residual = the annealed−quenched Jensen gap, i.e. λ̂ dynamically.
//   Landmark cross-check (deepening revision δ = F_{d+2} − F_d on fixed
//   positions): frozen/resolved ≈ 0, sharp/contested large; also δ for F*.
//
// ── VERDICT (d3, July 2026) — with a same-session ROBUSTNESS CORRECTION ──
//   ROBUST (drift_robustness.js: Spearman + the declared T<8/T<4 runaway cut):
//   · the premium is more volatile than the energy (median |ΔTS| ≈ 1.3–1.8×
//     |Δ⟨Q⟩|);
//   · high-premium positions drift DOWN monotonically — the winner's curse,
//     Spearman(premium,ΔF) = −0.58, STABLE across cuts;
//   · landmarks (confound-free): contested middlegames over-value (δF −0.5…−1.0),
//     resolved conserve (trebuchet δF −0.03);
//   · F* = ⟨Q⟩ + λ̂·TS is REFUTED, robustly: med|ΔF*|/med|ΔF| = 1.00 at every
//     cut — λ̂ is too noisy to make F a martingale (the Δλ̂·TS variance it injects
//     cancels the deflation it removes).
//
//   WITHDRAWN (the first verdict here overclaimed on outlier-sensitive Pearson
//   stats and untested inferences — the user's "are you sure?" caught it):
//   · corr(premium,ΔF) = −0.71  →  TWO T>8 samples drove it; robust Pearson is
//     −0.27, and the real signal is the Spearman −0.58. (I had not applied the
//     lab's own thermal-runaway cut.)
//   · β = −0.88, "only ~12% survives"  →  β on ΔF conflates premium dissipation
//     with the energy (⟨Q⟩ RISES as max falls: corr(premium,Δ⟨Q⟩) = +0.49), so
//     this was not a clean premium-persistence number.
//   · "martingale correction = the 'mean' backup = weaker player, fork PROVEN"
//     →  never tested; F* (the one deflation tried) did NOT lower drift, so which
//     correction (if any) makes F a martingale is OPEN.
//   · "orthogonal axes, the discovery"  →  a plausible reading of the F* failure,
//     not a proven fact.
//   OPEN — and NOT answered by the d5 scan (second audit finding): the
//   fixed-depth path is bounded by NODE_HARD_LIMIT = 5M nodes, not by dashDepth
//   alone. Sharp positions cap at ~d4 (dashDepth 5–8 all return reported depth 4
//   on the Fried Liver); only quiet positions reach d5+. Self-play visits sharp
//   middlegames, so the "d5" run was a node-capped ≈d4 mix — the d3-vs-d5 depth
//   comparison is INVALID, and whether the winner's curse shrinks with depth is
//   UNRESOLVED. A correct depth scan must record the REPORTED depth per ply and
//   compare only plies that actually reached the requested depth (or raise the
//   node cap). The d5 landmark zeros were this cap (F at "d5" = F at "d7" = F at
//   depth 4 ⇒ δ = 0 exactly), not convergence.
//
//   node tests/equilibrium_drift.js [depth]
function fresh() { delete require.cache[require.resolve('./engine_current.js')]; return require('./engine_current.js'); }
const E0 = fresh();
const DEPTH = parseInt(process.argv[2] || '3', 10);
const MATE_NEAR = 100000 - 4096;
const PAWN = 2;

function movesAfter(mvs) { const g = new E0.Chess(); for (const m of mvs) g.move(m); return g; }
const OPENINGS = [
  ['startpos', []],
  ['open game', ['e4', 'e5', 'Nf3', 'Nc6']],
  ['QGD', ['d4', 'd5', 'c4', 'e6']],
  ['Sicilian', ['e4', 'c5', 'Nf3', 'd6']],
  ['French', ['e4', 'e6', 'd4', 'd5']],
];
const PLIES = 28;

// self-play one line at fixed depth; one engine instance (TT/jhat persist within
// the game, as in real play). record mover-POV values per ply.
function selfPlayLine(name, startMoves, depth) {
  const E = fresh();
  const g = new E.Chess(); for (const m of startMoves) g.move(m);
  const rec = [];
  for (let i = 0; i < PLIES && !g.game_over(); i++) {
    const r = E._runAnalyze({ fen: g.fen(), dashDepth: depth, newGame: i === 0 });
    const th = r.thermo; if (!th) break;
    const maxQ = th.Qs[th.bestIdx];
    const lam = (typeof th.lamHat === 'number' && isFinite(th.lamHat)) ? th.lamHat : 1;
    rec.push({ side: g.turn(), maxQ, avgQ: th.avgQ, TS: th.TS, F: th.F, T: th.T, phase: th.phase,
      lam, Fstar: th.avgQ + lam * th.TS, mate: Math.abs(maxQ) > MATE_NEAR, rep: Math.abs(th.F) < 1e-9 });
    g.move(th.moves[th.bestIdx]);
  }
  return { name, rec };
}

// two-ply same-side drifts (mover POV, in pawns), excluding absorbing endpoints
const drifts = [];   // { dF, dMaxQ, dTS, T0:TS(t), Tbath, phase, side }
for (const [name, mv] of OPENINGS) {
  const { rec } = selfPlayLine(name, mv, DEPTH);
  for (let t = 0; t + 2 < rec.length; t++) {
    const a = rec[t], b = rec[t + 2];
    if (a.side !== b.side) continue;                       // parity guard (should always hold)
    if (a.mate || b.mate || a.rep || b.rep) continue;      // absorbing states are not thermal
    drifts.push({
      dF: (b.F - a.F) / PAWN, dMaxQ: (b.maxQ - a.maxQ) / PAWN, dTS: (b.TS - a.TS) / PAWN,
      dFstar: (b.Fstar - a.Fstar) / PAWN,
      premium: a.TS / PAWN, quenched: (1 - a.lam) * a.TS / PAWN, lam: a.lam,
      Tbath: a.T, phase: a.phase,
    });
  }
}

// stats
const rms = a => a.length ? Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length) : NaN;
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
const median = a => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const medAbs = a => median(a.map(Math.abs));
function pearson(xy) { const n = xy.length; if (n < 3) return NaN; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of xy) { sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; }
  const d = Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)); return d === 0 ? NaN : (n * sxy - sx * sy) / d; }
function slope(xy) { const n = xy.length; if (n < 3) return NaN; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of xy) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const d = n * sxx - sx * sx; return d === 0 ? NaN : (n * sxy - sx * sy) / d; }
// Spearman (rank) — robust to the thermal-runaway outliers Pearson over-weights.
function spearman(xy) { const rank = arr => { const idx = arr.map((v, i) => i).sort((a, b) => arr[a] - arr[b]); const r = []; idx.forEach((v, kk) => r[v] = kk); return r; };
  const rx = rank(xy.map(p => p[0])), ry = rank(xy.map(p => p[1])); return pearson(rx.map((v, i) => [v, ry[i]])); }
const TCUT = 50;   // the lab's declared thermal-runaway cut (see §4.1) — Pearson/β on the full set are outlier-inflated

console.log(`\nequilibrium-drift residual — self-play, depth ${DEPTH}, ${drifts.length} two-ply samples\n`);
console.log('overall (pawns):   [RMS is outlier-dominated; medians in brackets are robust]');
console.log('  ΔF     RMS=' + rms(drifts.map(d => d.dF)).toFixed(3) + '  mean=' + mean(drifts.map(d => d.dF)).toFixed(3) + '  [med|Δ|=' + medAbs(drifts.map(d => d.dF)).toFixed(3) + ']');
console.log('  ΔmaxQ  RMS=' + rms(drifts.map(d => d.dMaxQ)).toFixed(3) + '  mean=' + mean(drifts.map(d => d.dMaxQ)).toFixed(3) + '  [med|Δ|=' + medAbs(drifts.map(d => d.dMaxQ)).toFixed(3) + ']');
console.log('  ΔTS    RMS=' + rms(drifts.map(d => d.dTS)).toFixed(3) + '  mean=' + mean(drifts.map(d => d.dTS)).toFixed(3) + '  [med|Δ|=' + medAbs(drifts.map(d => d.dTS)).toFixed(3) + ']');
console.log('  ΔF*    RMS=' + rms(drifts.map(d => d.dFstar)).toFixed(3) + '  mean=' + mean(drifts.map(d => d.dFstar)).toFixed(3) + '  [med|Δ|=' + medAbs(drifts.map(d => d.dFstar)).toFixed(3) + ']   ← F* = ⟨Q⟩+λ̂·TS');

// (1) conservation scales with premium — robust, premium-binned
console.log('\n(1) conservation scales with premium (robust med|ΔF|, terciles):');
const byPrem = drifts.slice().sort((a, b) => a.premium - b.premium);
const k = Math.floor(byPrem.length / 3);
for (const [lbl, g] of [['low-premium', byPrem.slice(0, k)], ['mid', byPrem.slice(k, 2 * k)], ['high-premium', byPrem.slice(2 * k)]])
  console.log(`  ${lbl.padEnd(13)} n=${String(g.length).padStart(3)}  med|ΔF|=${medAbs(g.map(d => d.dF)).toFixed(3)}  med|ΔF*|=${medAbs(g.map(d => d.dFstar)).toFixed(3)}  <premium>=${mean(g.map(d => d.premium)).toFixed(2)}`);

// (3) dynamic winner's curse — Spearman + the runaway cut are the robust reads
// (Pearson/β on the full set are outlier-inflated; see drift_robustness.js).
const cutD = drifts.filter(d => d.Tbath < TCUT), nOut = drifts.length - cutD.length;
console.log('\n(3) dynamic winner\'s curse   [' + nOut + ' samples cut at T≥' + TCUT + ']:');
console.log('  Spearman(premium, ΔF)     = ' + spearman(cutD.map(d => [d.premium, d.dF])).toFixed(3) + '   ← ROBUST (predict < 0)');
console.log('  Pearson(premium, ΔF)      = ' + pearson(cutD.map(d => [d.premium, d.dF])).toFixed(3) + ' [cut]  ' + pearson(drifts.map(d => [d.premium, d.dF])).toFixed(3) + ' [raw — outlier-inflated]');
console.log('  Spearman(premium, ΔmaxQ)  = ' + spearman(cutD.map(d => [d.premium, d.dMaxQ])).toFixed(3));

// (4) premium vs energy leak
const rQ = rms(drifts.map(d => d.dMaxQ)), rTS = rms(drifts.map(d => d.dTS));
console.log('\n(4) premium vs energy leak:  RMS(ΔTS)/RMS(ΔmaxQ) = ' + (rTS / rQ).toFixed(2) + '  [robust ' + (medAbs(drifts.map(d => d.dTS)) / medAbs(drifts.map(d => d.dMaxQ))).toFixed(2) + ']   (predict ≳ 1)');

// (5) the reconstruction F* is a martingale
const rFm = medAbs(drifts.map(d => d.dF)), rFsm = medAbs(drifts.map(d => d.dFstar));
const corrF = pearson(drifts.map(d => [d.premium, d.dF])), corrFs = pearson(drifts.map(d => [d.premium, d.dFstar]));
console.log('\n(5) reconstruction F* = ⟨Q⟩ + λ̂·TS:');
console.log('  med|ΔF*|/med|ΔF| = ' + (rFsm / rFm).toFixed(2) + '   (predict < 1 ⇒ F* drifts less)');
console.log('  corr(premium, ΔF*) = ' + corrFs.toFixed(3) + '   vs corr(premium, ΔF) = ' + corrF.toFixed(3) + '   (predict |ΔF*| weaker)');

// (6) the leak is the quenched fraction — among high-premium plies, higher λ̂ ⇒ less leak
const hp = byPrem.slice(2 * k);
console.log('\n(6) the leak is the quenched fraction:');
console.log('  corr(λ̂, ΔF | high premium) = ' + pearson(hp.map(d => [d.lam, d.dF])).toFixed(3) + '   (predict > 0: more independent ⇒ less downward leak)');
console.log('  corr(quenched (1−λ̂)TS, ΔF) = ' + pearson(drifts.map(d => [d.quenched, d.dF])).toFixed(3) + '   vs corr(full TS, ΔF) = ' + corrF.toFixed(3));

// landmark deepening-revision cross-check
console.log('\nlandmark deepening revision δ = F(d+2) − F(d)  (pawns):');
const LAND = [
  ['startpos', new E0.Chess().fen()],
  ['open middlegame', movesAfter(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7']).fen()],
  ['sharp (Fried Liver)', movesAfter(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5']).fen()],
  ['trebuchet (frozen)', '8/8/4k3/4p3/4P3/3K4/8/8 w - - 0 1'],
];
const lamOf = th => (typeof th.lamHat === 'number' && isFinite(th.lamHat)) ? th.lamHat : 1;
for (const [nm, fen] of LAND) {
  const lo = fresh()._runAnalyze({ fen, dashDepth: DEPTH }).thermo;
  const hi = fresh()._runAnalyze({ fen, dashDepth: DEPTH + 2 }).thermo;
  if (lo && hi) {
    const fsLo = (lo.avgQ + lamOf(lo) * lo.TS) / PAWN, fsHi = (hi.avgQ + lamOf(hi) * hi.TS) / PAWN;
    console.log(`  ${nm.padEnd(20)} δF=${((hi.F - lo.F) / PAWN).toFixed(3)}  δF*=${(fsHi - fsLo).toFixed(3)}  phase=${lo.phase}`);
  }
}

// verdict on the pre-registered predictions
const p1 = mean(byPrem.slice(2 * k).map(d => Math.abs(d.dF))) > mean(byPrem.slice(0, k).map(d => Math.abs(d.dF))); // high-premium leaks more than low
const p3 = pearson(drifts.map(d => [d.premium, d.dF])) < 0;
const p4 = rTS / rQ >= 1;
const p5 = (rFsm / rFm) < 0.95 && Math.abs(corrFs) < Math.abs(corrF) - 0.02;  // require a real effect, not float noise
const p6 = pearson(hp.map(d => [d.lam, d.dF])) > 0;
console.log('\n════ PREDICTIONS ════');
console.log('  (1) conservation scales w/ premium : ' + (p1 ? 'HOLDS' : 'FAILS'));
console.log('  (3) dynamic winner\'s curse (<0)    : ' + (p3 ? 'HOLDS' : 'FAILS'));
console.log('  (4) premium is the leaky part      : ' + (p4 ? 'HOLDS' : 'FAILS'));
console.log('  (5) F* = ⟨Q⟩+λ̂·TS drifts less       : ' + (p5 ? 'HOLDS' : 'FAILS'));
console.log('  (6) leak is the quenched fraction  : ' + (p6 ? 'HOLDS' : 'FAILS'));

const outName = 'equilibrium_drift_d' + DEPTH + '.json';
require('fs').writeFileSync(require('path').join(__dirname, 'results', outName),
  JSON.stringify({ depth: DEPTH, n: drifts.length, betaDoob: slope(drifts.map(d => [d.premium, d.dF])), drifts }, null, 1));
console.log('\nwrote results/' + outName);
