# The laboratory

Everything runs on plain Node (≥16). One npm dependency (`stockfish`, WASM) for the
gauntlets only — `cd tests && npm install`.

```sh
node tests/extract_engine.js        # pull the engine out of the HTML → tests/engine_current.js
node tests/suite.js                 # 13 checks: perft, invariants, absorbing states, thermo sanity
```

`extract_engine.js` copies the `<script id="td-engine">` tag out of
`chess_thermo_jhat.html`, so the tests always run *exactly* what the page runs.
`engine_current.js` is gitignored — regenerate it, never edit it.

## Core harness

| file | purpose |
|---|---|
| `extract_engine.js` | HTML → `engine_current.js` (+ module exports for the instruments) |
| `suite.js` | regression suite — must stay 13/13 for any engine change |
| `ref_engine.js` | the **material oracle**: alpha-beta over pure classical material (see below) |
| `baselines/engine_v1_prescribedC.js` | frozen first-edition engine, regression opponent |
| `match.js` | engine-vs-engine matches (`cur` vs `ref`/`v1`), blunder scanner |
| `vs_stockfish.js` | SF-18 WASM gauntlet at UCI_Elo; modes `'' / probe / flux / measure / schedule / leafmu`; writes incremental JSON to `results/` |
| `sf_report.js` | gauntlet JSON → readable results book (md + print-ready html) |
| `ab_compare.js` | A/B two gauntlet JSONs (score, castles, mate losses, mean T) |
| `speedbench.js` | node/depth benchmarks on standard positions |
| `run_chain.sh` | the unattended measurement chain (sequential long runs) |

## Instrument certifications (run these after touching the engine)

| file | what it certifies |
|---|---|
| `invariance.js` | thermometer determinism at fixed depth; gauge invariance under root-order shuffle (≤4e-16); T(budget) protocol table |
| `zugzwang.js` | builds an exact KPK+blocked-KPKP tablebase, certifies the true trébuchet, asserts μ_tempo reads its gauge zero there; reports the thermal-washout and argmax-quench findings |
| `jhat_replay.js` | the opponent thermometer (Ĵ) replayed over recorded corpora: convergence to offline fits, regime ordering, conservatism |

## Experiments & analysis (each reads corpora from `results/` — see `results/INDEX.md`)

| file | what it does / found |
|---|---|
| `eos_test.js` | the equation-of-state test: β vs tanh(Δμ/2T), binned, plotted (r = 0.61, sign-perfect) |
| `fit_J.js` | Curie–Weiss fit (forward fixed-point, bootstrap CIs): J = 3.5, b = 0.63 on the coupled corpus |
| `fit_JT.js` | temperature-resolved precision-weighted refit; env `TMIN`/`TMAX` set the thermal domain of validity |
| `cooling_scan.js` | self-play at four time controls in measure mode — the criticality corpus generator |
| `j_floor_probe.js` | the structural share of J from played games: constraint bite ⟨lnW_free − lnW_forced⟩ ≈ 1.9, dimensionless criticality ratio ≈ 0.6–0.75 |
| `t_crossing.js` | counterfactual-temperature reranking of a decision (uses the `pinT` lab hook); found the Alekhine blunder crossing at T* ≈ 1.0 = the zero-point floor |
| `t_decompose.js` | three-knob decomposition (`pinT`/`leafT`/`themT`) of a decision's T-dependence; convicted the *our-side interior choice premium* (~3.75 of the swing) |
| `covariance_probe.js` | redundancy instruments: v1 revision common-mode (failed honestly — measures drift), v2 reply-partition n_eff (validated: trap 3.5 vs sound 10.6) |

## The material oracle (`ref_engine.js`)

A deliberately naive opponent used as a measuring instrument: plain alpha-beta +
quiescence over *pure classical material* (100/300/310/500/900 cp) — no mobility, no
king safety, no piece-square tables. Because it values exactly one thing, it is a
near-perfect detector for that thing: losing material to it within its horizon means
a piece was genuinely hung. Reading a result against it: losing the match → the
engine hangs material (the first edition lost 0–2); mostly draws → material play is
sound; winning → activity edges are being converted into material the oracle can
see. Current engine: **+2 −1 =9**.

## Match harness details

Color-swapped pairs; a 6-line opening book restores game diversity (deterministic
engines otherwise repeat one game); games hitting the ply cap are adjudicated by
classical material (±150 cp = draw). Moves losing ≥250 cp within two plies are
logged with FENs to `tests/blunders_<A>_<B>.json` for diagnosis.

## Laboratory hooks inside the engine (test-only; play never sets them)

`pinT` (pin the bath — the external-field knob) · `leafT` (reprice only the leaf
optionality) · `themT` (retemper only the opponent's interior ensembles) ·
`shuffleSeed` (seeded root-order permutation) · `effS` (`true`/`'us'`: the
effective-entropy premium, also exposed as the UI selector) · `leafMu` (retired
leaf tempo charge, kept for reproducibility).
