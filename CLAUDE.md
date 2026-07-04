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
- Test-only laboratory hooks in the engine (`pinT`, `leafT`, `themT`, `shuffleSeed`)
  are never set by play.
- Results files: incremental JSON written during runs; long runs go in background
  with logs under `tests/results/`; every experiment gets committed win or lose.

## Open threads (as of July 2026)

- **S_eff premium gauntlet**: the effective-entropy mechanism (UI toggle, off by
  default) awaits its A/B ladder after interactive testing. It does NOT fix the
  Alekhine case (recorded); the question is net strength.
- **The central open problem**: "self-indulgence" — the interior choice premium
  prices nominal rather than effective multiplicity; decision flips at T* ≈ 1.0 =
  the zero-point floor (see status page §3 and `tests/t_decompose.js`).
- **Thermal runaway** in decided positions: documented, cut in analysis, uncured.
- Deferred by user: master-games corpus run (measure J / criticality ratio on
  human games).
