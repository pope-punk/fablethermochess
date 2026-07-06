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

- **S_eff premium gauntlet**: the effective-entropy mechanism (UI toggle, off by
  default) awaits its A/B ladder after interactive testing. It does NOT fix the
  Alekhine case (recorded); the question is net strength.
- **The central open problem**: "self-indulgence" — the interior choice premium
  prices nominal rather than effective multiplicity; decision flips at T* ≈ 1.0 =
  the zero-point floor (see status page §3 and `tests/t_decompose.js`).
- **Thermal runaway** in decided positions: documented, cut in analysis, uncured —
  but nearly halved in play under `alloc` (deeper quenching of decided positions;
  2.8% vs 4.1% of moves at T>20, runaway clock-stops 13 vs 30).
- Deferred by user: master-games corpus run (measure J / criticality ratio on
  human games).
