# fablethermochess

A chess engine that evaluates positions by **statistical thermodynamics instead of
minimax** — a position is an ensemble of continuations, its value is a free energy
F = ⟨Q⟩ + T·S — built coherently enough that the implementation doubles as a
laboratory instrument for asking real questions about chess.

**Start here → [`docs/project_status.html`](docs/project_status.html)** — one page:
the goal and design constitution, everything that works, the current open problems,
and the complete table of everything tried that failed (with causes of death).
The full theory is [`docs/thermodynamic_chess_theory.html`](docs/thermodynamic_chess_theory.html)
(third edition, also as PDF). New Claude session? Read [`CLAUDE.md`](CLAUDE.md).

## Layout

```
chess_thermo_jhat.html      THE APP — engine + dashboard, one self-contained file
CLAUDE.md                   bootstrap for a fresh Claude session (workflow + rules)
docs/                       theory paper (3rd ed., html+pdf) + project status page
tests/                      the entire laboratory: harness, instruments, experiments
tests/baselines/            frozen first-edition engine (regression opponent)
tests/results/              every experiment's data, logs, plots (see INDEX.md there)
```

## The app (`chess_thermo_jhat.html`)

Open it in a browser. Everything is inline — board, engine (in the
`<script id="td-engine">` tag; the harness extracts exactly this script, so the page
and the tests can never disagree), and the dashboard laboratory: capacity curve with
phase marker, annealing trace, phase strip, μ board overlay, opponent thermometer
(Ĵ), scheduler clock row, and the redundancy meter (S_reply / n_eff).

Controls that matter:
- **difficulty** — an *average* time per move (the σ_eff scheduler banks time on
  frozen decisions and spends up to 4× on hard ones). There is deliberately no
  temperature knob: T is measured, and thinking time *is* the annealing schedule.
- **S: nominal / S_eff (ours) / S_eff (both)** — experimental choice-premium entropy
  (see status page, "current problems"); default is the known-good nominal engine.

## The laboratory (`tests/`)

Plain Node ≥16. Workflow for any engine change:

```sh
node tests/extract_engine.js    # pull the td-engine script → tests/engine_current.js
node tests/suite.js             # 13 checks: perft, invariants, absorbing states, thermo sanity
```

Full file-by-file guide: [`tests/README.md`](tests/README.md).
What every results file was for: [`tests/results/INDEX.md`](tests/results/INDEX.md).

## The rules of the project (short form)

Every quantity is **geometry** (piece values = mean board reach), **counting**
(S = ln W), or **measurement** (T, J, b, κ, bite — all measured, never tuned).
No imported chess knowledge, no norms of "good play". Instruments may act on
*ensemble parameters* (temperature, truncation width) or *attention* (time,
extensions) — never on state energies; that rule has been paid for three times.
Negative results get committed with autopsies; the graveyard in the status page
is load-bearing.
