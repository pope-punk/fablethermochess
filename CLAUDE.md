# Claude session bootstrap

You are picking up a mature research project: a chess engine that evaluates by
statistical thermodynamics (F = ⟨Q⟩ + T·S over move ensembles) instead of minimax,
run as an honest physics lab. Minimal context to be productive:

## Method — the core discipline (follow this before reaching for the keyboard)

**When confused or unsure, always revisit first principles, your own algebra, and
established identities in game theory, information theory, and statistical mechanics
to manipulate your abstractions and "show your work" to yourself to try to solve
problems at a conceptual level (and catch silly mistakes), then validate the code
against these formulas, and then, and only then, begin/suggest beginning empirical
testing.**

The order is load-bearing: derive → check the derivation against known identities →
verify the code computes the derived quantity → only then measure. Two failure modes
this project keeps punishing: (1) welding a suggestive number into a grand narrative
before applying the lab's own robustness discipline, and (2) building a mechanism
before checking whether the algebra even predicts it will work. When a derived
formula, once computed, returns nonsense, that is a *result* — it means the
abstraction was wrong; find out why before proceeding.

## Read first (in order, ~10 minutes)

1. `docs/project_status.html` — goal, constitution, what works, open problems,
   and the graveyard of failed approaches. **Do not re-attempt graveyard items
   without new information; each row lists its cause of death.**
2. `tests/README.md` — what every script in the lab does.
3. `docs/thermodynamic_chess_theory.html` — the full theory (skim §4, §8, §10).

## Where things live

- **The engine is inside the app**: `chess_thermo_jhat.html`, in the
  `<script id="td-engine">…</script>` tag. UI lives in the second script tag.
  There is no separate engine source file — edit the HTML.
- `tests/extract_engine.js` copies that script tag to `tests/engine_current.js`
  (gitignored, regenerated) so Node tests run *exactly* what the page runs.

## The loop for any engine change

```sh
node tests/extract_engine.js && node tests/suite.js   # must stay 13/13
node tests/invariance.js                              # thermometer determinism/gauge
node tests/zugzwang.js                                # instrument certification
```

Strength claims require an A/B gauntlet: `node tests/vs_stockfish.js 1500 1000 200
results/<name>.json <mode>` (modes: '' | probe | flux | measure | schedule | leafmu),
compared with `node tests/ab_compare.js` against the relevant baseline
(see `tests/results/INDEX.md` for which baseline is current).

## The constitution (violations have all failed empirically)

1. Every quantity is geometry, counting, or **measurement** — never a tuned constant.
2. **Absorbing states are not thermal**: mates/repetitions carry no entropy, feed no
   thermometer, trip no scheduler freeze.
3. Instruments may act as **ensemble parameters or attention** (T, truncation width,
   thinking time, extensions) — **never as state energies** added to Q. Three
   mechanisms died this way (probe, coupled flux, leaf tempo charge ×3).
4. **Horizon corrections must be side-symmetric** (the leaf entropy term is; the
   one-sided tempo charge wasn't — necessary but not sufficient).
5. Same-parity discipline: negamax-softmax values carry an entropy ladder; any
   cross-depth comparison must match parity or it reads the ladder as signal.
6. Negative results are committed with autopsies, not deleted.

## Conventions

- Develop on the designated feature branch; commit early with descriptive messages;
  push after each coherent unit of work.
- Test-only laboratory hooks in the engine (`pinT`, `leafT`, `themT`, `premT`,
  `backup`, `shuffleSeed`) and the kinetics protocol knobs (`hop`, `alloc`,
  `basinSched`) are never set by play. The app's Lab panel exposes them to the
  experimenter's hand; any active field is stamped on the dashboard reading
  (`⚠ LAB: …`), and blank = honest play.
- Results files: incremental JSON written during runs; long runs go in background
  with logs under `tests/results/`; every experiment gets committed win or lose.

## Open threads (as of July 2026)

- **The basin program — kinetics ladder complete (July 2026)**: continuations
  grouped into strategic cohorts ("plans") by inherent structure
  (`tests/basins.js`). Statics uses retired earlier (scheduler criterion
  7.5/12 vs 9; interior premium 6/12 vs 7.5). Kinetics (`tests/basin_hop.js`):
  hop v2 (T₀ merge diameter + mk≥4 gate + fresh-gated selection) restored
  material soundness (oracle +2−1=9 vs v1's 0W 2L) and cut the v1 thermometer
  feedback (T-at-depth clean vs baseline), bought real depth in play
  (mean 3.43→4.16, d6–d9 band, the Alekhine cured kinetically at 8 s vs
  ~26 s pure width) — and still lost the gauntlet (6/12 vs 7.5): the bought
  depth sharpened F's own self-indulgence (early-queen tilt 2.83 vs
  2.25/game). Interior hop dedup RETIRED. The SURVIVOR is **root allocation**
  (`alloc`): the root obeys the interior dominant-set truncation law — the
  scheduler brought inside the move; frozen children price Z but feed no
  thermometer sample and may not be argmax. 7.5/12 = baseline exactly,
  coolest bath of any config (mean T 8.2 vs 16.6), thermal runaway in play
  nearly halved (2.8% vs 4.1% at T>20). Strength-neutral kinetics: depth is
  now purchasable at no cost; the EVALUATION is the binding constraint. The
  allocsched marriage read 6.5/12 vs the 9 schedule baseline (no interaction
  mechanism found; n=12 underpowered; NOT validated — the schedule baseline
  stands), and exposed a scheduler blind spot: ~80% of σ_eff freezes fire at
  depth 2 in every config, and capture sequences freeze the clock exactly
  where mating nets build beyond the horizon (one loss mated at +590) — see
  status page §3. The absorbing-risk guard was then BUILT and RETIRED
  (July 2026, pre-registered in `tests/freeze_guard_replay.js`, gauntlet
  6/12 vs 9): the clock mechanics worked exactly as designed (d2 freezes
  115→2, deferred to d3 nearly free) but d3-confirmed freezes proved
  exactly as unstable as d2 ones (32% vs 29% eval-drop rate), and the
  catastrophe class recurred on FULL-DEADLINE moves (mated at +1010 after
  a voluntary king march at +10 evals). The clock was never the disease:
  F prices an open king as an entropy bonus. Scheduler-criterion ladder:
  9 (σ_eff as-is) > 7.5 (basinsched) > 6.5 (allocsched) ≈ 6 (guard) —
  four modifications in a row negative at n=12; either σ_eff-as-is is a
  sharp local optimum or the single 9/12 run was a favorable draw (±1.7
  at n=12). Candidate next legs, unbuilt: an n=24 schedule rebaseline
  (cheap, settles the 9/12 question); alloc at longer time controls /
  SF-1600 (does neutral-at-1s become positive when depth differentials
  grow?). Every road this session — kinetics, clock — dead-ends at the
  same wall: the evaluation's mispricing of exposure (open king = mobility
  = entropy bonus), i.e. the self-indulgence problem below.

- **The Gibbs paradigm (July 2026) — built, laddered, honestly graded**:
  G = U + T₀·lnW_us − T·lnW_them (opts.gibbs, `tests/gibbs_probe.js`) — our
  activity as zero-point (degeneracy) pressure work, geometry-derived; their
  optionality alone at the measured bath price; roles root-anchored
  (parity-safe); ≡ Helmholtz at T = T₀; interior premium untouched. Cures the
  Alekhine at d4 with the premium intact (unique among cures), converts
  faster, castles. Ladder: 3.5/12 at SF-1500 — THE META-LAW (three-for-three:
  mean, sigma, gibbs all 3.5 at 1500): every Alekhine cure loses to soft
  opposition; T-scaled optionality-seeking is net-positive there and the
  blunder is its insurance cost. At SF-1600: initially read as "the cliff
  broken" (4.5 vs the recorded 1/12) — **CORRECTED same-session by a
  same-harness rebaseline: the current 1600 baseline is 3.5/12, so
  Gibbs-at-1600 is +1.0 at n=12, suggestive and unresolved**. What survives:
  the sign flip (−4 at 1500, +1 at 1600), Gibbs-structure-specificity (sigma
  at 1600 reads 2/12 — the premium-intact + opponent-dominant-leaf
  combination is what moves, not Alekhine-cures generically), mate losses
  10→6, and the first Ĵ-at-Elo corpus (jhat now logged in every flux mode:
  T̂c>0 on 45% of moves at 1600 vs 12–39% at 1500 — weak Elo discrimination).
  Autopsied flaws, recorded: early-queen rate up at 1500 (the indulgence
  lives in the interior premium, untouched by design); the asymmetric leaf
  unbounded at runaway T (a bounded them-price is not derivable without
  tuning — unbuilt). Next measurements before any Ĵ-gated paradigm selector:
  n=24 at 1600, or stronger opposition.
- **S_eff premium gauntlet**: the effective-entropy mechanism (UI toggle, off by
  default) awaits its A/B ladder after interactive testing. It does NOT fix the
  Alekhine case (recorded); the question is net strength.
- **The glass program (July 2026) — diagnosed, sign refused, route closed**:
  the physics dialogue on the binding constraint (F's mispricing of the
  diffuse positional sector) converged on a testable claim — the positional
  (slow) modes are a *glass*: out of equilibrium at the search timescale, so
  the single revision-thermometer bath is the wrong temperature for them, and
  the fix would be to price them at a Cugliandolo–Kurchan effective
  temperature T_eff. Two probes: `glass_probe.js` established the glass
  QUALITATIVELY (FDT ratio X = measured d⟨Q⟩/dT ÷ (−Var/T²) ranges 0–22, never
  1; aging toward but not reaching equilibrium with depth) but could not sign
  T_eff and rested its quiet-vs-tactical gap on one KID outlier.
  `glass_teff.js` was the sign-resolving follow-up: two INDEPENDENT estimators
  pre-registered to agree or be inconclusive — (A) response ratio X, (B)
  configurational spread / dynamical temperature r = √Var/T_dyn across depth.
  VERDICT (TWO independent n=16 draws): the estimators DISAGREE in both — (A)
  X deep 2.44/3.04 (slow modes HOTTER), (B) Δr −0.25/−0.12 (COLDER) — the
  pre-registered kill for a signed T_eff, and the standoff is robust across
  samples. NO signed slow-mode pricing temperature ⇒ the "price positional
  modes at T_eff" mechanism is NOT BUILT (wrong sign = the mean/max backup
  grave). CORRECTION recorded in-file: draw 1 showed X_quiet 3.62 ≫
  X_tactical 1.43 and I over-read it as "the slow-mode localization is now
  real"; draw 2 runs the OTHER way (X_tactical 3.04 > X_quiet 2.47), so the
  quiet/tactical split is NOT stable (captures-proxy noise over ~8
  positions/bin) — glass_teff establishes it no better than glass_probe's one
  outlier did. Honest robust survivors: only (1) the FDT violation X>1 is
  really present (the sector is out of equilibrium) and (2) its sign cannot
  be corroborated. The disagreement is itself the physics: in a glass T_eff is
  observable-dependent, so there is no single scalar and no single evaluation
  dial. The glass diagnosis (one bath can't describe both fast response and
  slow spread) stands; the effective-temperature-as-pricing route is closed.
- **The central open problem — now with a measured law (July 2026)**: the
  premium-deflation program is CLOSED, six ladders deep. The quenched premium
  (nested-GEV over the reply partition, μ=√λ̂ — `tests/quenched_probe.js`)
  formalized F as the ANNEALED free energy and the killer refutation as
  quenched disorder; its adjudication measurement split the disease in two
  (trap face = correlation, λ̂ 0.57, self-heals on resolution; open face =
  honestly independent resolved options overpriced at the bath T). That led
  to the heteroscedastic premium (`tests/sigma_probe.js`, backup 'sigma'):
  V = ⟨Q⟩_π + Σ π_a·σ_a·(−ln π_a) with σ_a per child from same-parity TT
  revisions riding the zero-point quantum — THE FIRST MECHANISM EVER to cure
  the Alekhine at honest temperatures (d4 plays Nd5; pinT-sound 1.0–3.0;
  fine70 converts FASTER) — and it collapsed in the gauntlet at 3.5/12,
  tied-worst with 'mean' (7 mate losses; two games lost from the opening).
  THE LAW: the interior choice premium at the full bath temperature is
  load-bearing at exactly its uncorrected size — deflation by count (mean
  3.5), structure (basin 6), category (exK-leaf 6), measured correlation
  (quenched: no cure), or measured per-option resolution (sigma 3.5) all
  read negative; the Alekhine cure and the strength collapse are one dial.
  The Gumbel/winner's-curse reading explains the premium's FORM; its
  FUNCTION in play is strategic — nominal flexibility exerts real pressure
  on an adversary who must answer it, and it keeps paying after values
  resolve. Any future cure must ADD what F cannot see (rule-3-legal
  channels: ensemble parameters, attention, time) rather than subtract what
  it overpays. New certified instrumentation from this program, available
  to any future mechanism: per-child same-parity revisions mined from the
  TT's own history (σ_a), and per-node λ̂.
- **Check-aware quiescence (qCheck, July 2026) — built, most promising**:
  quiescence is the model's T=0 relaxation of the FAST forcing degrees of
  freedom before thermal sampling — and it resolved captures but not checks.
  A check is equally a fast forcing move (real bite: the reply menu
  collapses, unlike a sortie's fake forcing), so it belongs in the
  pre-thermal relaxation with captures; its omission left check-based
  tactics (mates, the Légal-sac class) invisible at every reachable depth
  (the Légal sac read −14 and stalled at d3/20s because Nd5# is a
  non-capture check). qCheck adds non-capture checks to the top quiescence
  plies (`tests/qcheck_probe.js`, opts.qCheck, gauntlet mode 'qcheck',
  off by default = bit-identical). Oracle +6−0=6 (STRONGEST of the session
  — finds sacrifices incl. Légal's Nxe5 at main-depth 1, converts activity
  to material). Gauntlet: slow build 7/12, fast build (O(1) sound check
  pre-filter, 12×→1.5× per-node, differential-proven identical checks)
  4/12 at MORE depth — the two bracket a true ≈5.5/12 (n=12 SE ≈1.4):
  qCheck is **strength-neutral within noise**, the 7 was a favorable draw
  (over-read at the time). This is what the depth-marker study
  (`heat_persistence_probe.js`) DERIVED: qCheck harvests the tactical 9%
  of depth-sensitivity; strength is dominated by the positional 91% it
  cannot touch, so neutral is forced — theory and experiment converge.
  Rule-3 clean (search extension = attention, never a term in Q;
  symmetric, no parity issue). A real, correct tactical instrument that is
  strength-neutral because tactics are a small share of what depth
  resolves; the pre-filter speedup is kept.
- **Dissipative-initiative order parameter (July 2026) — built, refuted**:
  the queen-sortie deep-dive (`tests/dissipation_probe.js`) proposed that a
  premature sortie is *dissipative* — Δμ>0 (forcing census) while ∂Q/∂depth<0
  (value bleeding), forcing work that does no work, both quantities already
  measured. Pre-registered corpus diagnostic FAILED on its own kill criterion:
  Legal's-Mate Nxe5, a sound queen sac, tripped as dissipative (its mate is
  beyond d5, so its value bleeds identically to a sortie). The divergence is
  not the signature of dissipation but of ANY forcing line whose payoff is
  off-horizon — sortie and sound sac are the same observable at d5; it cannot
  sign the payoff without reaching it. Collapses into the horizon problem
  again. Only lawful residue: it's an EXTENSION trigger (spend depth on
  high-Δμ off-horizon lines), which reduces to alloc. Net: no cheap local
  diagnostic substitutes for search — the session's recurring wall.
- **Thermal runaway** in decided positions: documented, cut in analysis, uncured —
  but nearly halved in play under `alloc` (deeper quenching of decided positions;
  2.8% vs 4.1% of moves at T>20, runaway clock-stops 13 vs 30).
- Deferred by user: master-games corpus run (measure J / criticality ratio on
  human games).
