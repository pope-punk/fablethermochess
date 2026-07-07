# Claude session bootstrap

You are picking up a mature research project: a chess engine that evaluates by
statistical thermodynamics (F = ⟨Q⟩ + T·S over move ensembles) instead of minimax,
run as an honest physics lab. Minimal context to be productive:

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

- **The Gibbs paradigm (July 2026) — the cliff is broken and pricing is
  opponent-dependent**: G = U + T₀·lnW_us − T·lnW_them (opts.gibbs,
  `tests/gibbs_probe.js`) — our activity as zero-point (degeneracy) pressure
  work, geometry-derived; their optionality alone at the measured bath price;
  roles root-anchored (parity-safe); ≡ Helmholtz at T = T₀; interior premium
  untouched. Cures the Alekhine at d4 with the premium intact (unique),
  converts faster, castles — and at SF-1600 scores **4.5/12 vs the baseline's
  1/12 (zero wins)**: first 1600 wins ever, largest differential in program
  history. At SF-1500 it reads 3.5/12 — THE META-LAW (three-for-three: mean,
  sigma, gibbs all 3.5 at 1500): every Alekhine cure loses to soft opposition;
  T-scaled optionality-seeking is net-positive there and the blunder is its
  insurance cost. **Optimal optionality pricing is opponent-dependent** (as
  the measured J already said). Autopsied flaws, recorded: early-queen rate up
  at 1500 (the indulgence lives in the interior premium, untouched by design);
  the asymmetric leaf unbounded at runaway T (them-term ~95 units at T=28 vs
  frozen us-term; a bounded them-price is not derivable without tuning —
  unbuilt). Open next legs: sigma at 1600 (cure-class vs Gibbs-specific —
  running at session end); Ĵ-gated paradigm selection (the opponent
  thermometer already measures who we face: Helmholtz vs soft, Gibbs vs
  punishing — the constitution allows instruments as ensemble parameters);
  1600-measure rebaseline for a cleaner comparator.
- **S_eff premium gauntlet**: the effective-entropy mechanism (UI toggle, off by
  default) awaits its A/B ladder after interactive testing. It does NOT fix the
  Alekhine case (recorded); the question is net strength.
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
- **Thermal runaway** in decided positions: documented, cut in analysis, uncured —
  but nearly halved in play under `alloc` (deeper quenching of decided positions;
  2.8% vs 4.1% of moves at T>20, runaway clock-stops 13 vs 30).
- Deferred by user: master-games corpus run (measure J / criticality ratio on
  human games).
