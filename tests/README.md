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
| `vs_stockfish.js` | SF-18 WASM gauntlet at UCI_Elo; modes `'' / probe / flux / measure / schedule / basinsched / leafmu / meanback / maxback / basinback / hop / alloc / hopalloc / allocsched / guard / qcheck / qbasin / trio / schedqcheck`; writes incremental JSON to `results/` |
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
| `covariance_probe.js` | redundancy instruments: v1 revision common-mode (failed honestly — measures drift), v2 reply-partition n_eff (validated: trap 3.5 vs sound 10.6), v3 λ̂ drift-centered reply-grouped independence (validated on all five predictions: trap 0.60 / sound 0.91 / middlegame 0.92 / Q-en-prise 0.56 / startpos 0.87 — orders correctly exactly where v1 ordered backwards) |
| `backup_forms.js` | backup-form decomposition (`backup` lab hook): F vs ⟨Q⟩_π ('mean') vs max — F−⟨Q⟩_π = T·S is the winner's-curse identity; 'mean' and 'max' cure the Alekhine blunder at every T, 'mean-us' dies by one-sided ladder (thermometer runaway, as the parity rule predicts); gauntlets 3.5 & 5/12 — the premium is also the danger sense |
| `premT_scan.js` | the premium-temperature leg (`premT` hook): global premium repricing crosses at premT ≈ 0.75–1.0 — the zero-point floor again, from the premium axis — so no global scale separates blunder-cure from danger-sense; the cure must be per-node (λ̂) |
| `basins.js` | the basin instrument (inherent structures): root moves clustered into "plans" — value cohorts of diameter ≤ T, split by census material flow (⟨ΔM⟩, diameter ≤ 1♙) and initiative regime (β vs own SE). Validated: trap = {dxe5, Ng4} vs 27 knight-losers in 2 basins, S_b = 0.97 vs S = 3.10. Basin-gap scheduler (`basinsched` gauntlet mode, `basinSched` opt) freezes on the top-two PLAN gap, depth ≥ 3 guard — retired at 7.5/12 vs the 9/12 schedule baseline |
| `basin_premium.js` | the interior basin premium (`backup:'basin'`): plans, not moves, in every Z. Cures the Alekhine at every T, keeps the trébuchet visible, tames runaway, keeps oracle conversion (+2−1=9) — and 6/12 vs 7.5 at the gauntlet. The four-point ladder 7.5 (F) > 6 (basin) > 5 (max) > 3.5 (mean): strength orders by premium size; statics interventions retired |
| `basin_hop.js` | basin-hopping truncation (`hop` opt) + root allocation (`alloc` opt): KINETICS — values touched nowhere, width converted to depth. hop v1 (one deep representative per plan, cohorts at live-T diameter) was NEGATIVE: oracle 0W 2L — killers deduped on coarse basins kept optimistic shallow values in Z, and the protocol heated the thermometer that set its own coarse-graining. v2 repairs (no new constants): cohorts merge at the zero-point diameter T₀ (fixed by geometry — feedback cut) and only moves with mk ≥ 4 census samples may merge. `alloc` is the scheduler brought inside the move: the root obeys the same dominant-set truncation law as every interior node (3T window, top two always, TRUNC_MAX cap; the previous iteration is the root's free ranking pass); frozen children keep their standing value in Z, feed no thermometer sample (freshness-parity guard `_fd/_fd2`), and may not be argmax (selection stays inside the re-measured set — the probe-stage rule; without it the root replays the v1 disease once per search, on the played move). Measured (hop+alloc): 5.0M→690k nodes at fixed d4 (middlegame); at 1 s depth rises d3→d4 (startpos, Alekhine root), d2→d3 (middlegame); the Alekhine cure arrives through depth at 8 s (d5, plays Ne4) vs ~26 s for pure width |
| `exposure_corpus.js` | recovers "complacent-then-mated" decision positions from the recorded SF-1500 gauntlets (engine self-eval ≥ +3♙ then checkmated), config-diverse — the objective catastrophe corpus. Alignment: `trace` holds only non-book engine moves, so `trace[k]` ↔ engine move `k+nBook` |
| `exposure_probe.js` | **THE DISCRIMINATOR** — is the central disease shallow-horizon ensemble mispricing (H_eval → Pathway 1, reprice) or off-horizon forcing nets (H_search → Pathway 2, attention)? Pre-registered decision rule; reuses only certified hooks (fixed-depth, `backup:'max'`, `leafT`). **Verdict H_search:** `cold_local = 0/23` — no ensemble re-derivation sees a loss absent from the shallow tree; F's entropy is a −1.1♙ PENALTY (danger sense), not the "open-king bonus" the notes claimed; median reveal Δ = 7 ply. Redirects the cure to forcing-line (check) extension (qCheck family). Full autopsy in the file header |
| `qcheck_reveal.js` | the redirect test: does forcing (check) extension reach the P0 nets? On the 23-position corpus with qCheck ON, EXPOSURE king-marches reveal 6/10 at d2 (median reveal depth 5.5→2 ply, ≈ P0's Δ) — the nets ARE forcing-reachable — but the played move flips only 1/10 (already-lost positions: reveal ≠ rescue). The curative value is prophylactic, one ply earlier; the committal-flip test is the next probe |
| `equilibrium_drift.js` | **the state-function residual of F** (the equilibrium hypothesis as a conservation law): how far F fails to be a martingale under the engine's own best play. Same-parity two-ply drifts along self-play; energy (maxQ) vs premium (TS). Confirms the premium is the leaky part and bleeds as the winner's curse (β=−0.88, ~12% survives at d3); REFUTES the λ̂-reconstruction F*=⟨Q⟩+λ̂TS (drifts the same — the dissipation axis is orthogonal to λ̂'s correlation axis). The martingale F = global deflation = the weaker `mean` backup: the fork is proven. `node equilibrium_drift.js [depth]` |
| `schedqcheck_autopsy.js` | why the σ_eff-scheduler + qCheck marriage collapsed to 3/12 (traces only, no re-run). Pre-registered a freeze-widening channel; MEASURED it REFUTED (complacent freeze% 18.7→2.2, DOWN). The real mechanism: qCheck's DEPTH TAX (halves depth to ~1.8 in every family member with no scheduler), and the scheduler's +2.5 edge is depth-conditional — the two compete for search depth. schedqcheck sits at the qCheck-family floor, not below it (≈0.7 SE from qcheck2 at n=12). Prints the depth/score/mate table + the refuted prediction |
| `gge_infodecomp.js` | **READ 1 of the GGE charge-cohort pre-registration** (`docs/gge_charge_cohort.html` §9). The evaluation F = ⟨Q⟩ + T·S is the r=1 projection of the tree ensemble; this measures the incremental cross-validated information ΔI_k of each candidate charge — capacity Var_π (seat 1), basin occupations (seat 2), the T_eff-proxy √Var/T (seat 3), the even modulator lnW₊ (seat 4) — about the off-horizon verdict Y = e(d4)−e(d2) (same-parity revision), *beyond* the seated {⟨Q⟩, S}. Method: closed-form hat-matrix ridge LOO-CV R², permutation null, partial Spearman. Kill criterion (pre-registered): all ΔR²_k within the null AND \|partial ρ\| < 0.15 ⇒ the physical cohort is empty and no seat is instantiated. Corpus = exposure catastrophes + quiet random controls; deep is node-capped (read as a lower bound on ΔI). `node gge_infodecomp.js [DEEP] [NRAND] [SEED]`. **VERDICT (n=42, d2→d4): KILL** — base LOO-R²{⟨Q⟩,S}=0.18; every candidate has *negative* CV ΔR² (permutation p≥0.18); the weak partial-Spearman hints (C, rSpread ρ≈0.25) don't survive CV. No seat instantiated: {⟨Q⟩,S} is a sufficient statistic for the near-horizon verdict at reachable depth — converges with the Gumbel meta-law. **Anti-isolation check**: the full cohort fit simultaneously (ΔR²=−0.30) and with all 6 pairwise interactions (ΔR²=−0.47) both do *worse* than base — no synergy, so the marginal KILL is not an isolation artifact. Raw feature rows persisted in the JSON |
| `gge_fdt.js` | **READ 2 of the GGE pre-registration** (§9): the two-slope fluctuation–dissipation plot that decides the T_eff seat. Response R = −T²·d⟨Q⟩/dT (pinT central diff) vs correlation C = Var_π(Q), slope m = R/C = T/T_eff, measured in a fast (d2) vs slow (d4) depth band with bootstrap CIs, plus the glass_teff spread corroborator r = √Var/T_dyn. Pre-registered agreement gate: seat 3 is instantiated only if the response slope (m_deep>1) AND the spread (Δr>0) agree on T_eff>T; one slope, or a sign disagreement (the glass_teff standoff), REFUSES it. The honest, matched-control redo of glass_teff. `node gge_fdt.js [N] [SEED] [T0]`. **VERDICT (3 draws): seat 3 REFUSED** — the response m_deep>1 in ALL draws (2.0–3.3; the slow sector is really out of equilibrium), but the spread sign FLIPS (Δr = +0.23, +0.15, −0.15) — the glass_teff standoff reproduced. Draws 1–2 agreed and alone would have seated it; draw 3 (the mandatory replication) refuted them. No scalar T_eff, no pricing dial |

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
leaf tempo charge, kept for reproducibility) · `backup` (`'mean'`/`'max'`/
`'mean-us'`: interior backup form — what scalar propagates up, with the
ensemble, thermometer, truncation, and leaf term untouched; see
`backup_forms.js`) · `premT` (pay only the interior choice premium T·S at a
counterfactual temperature; ensemble stays at the bath — `premT→0` is the
`'mean'` backup, `premT=bath` is F; see `premT_scan.js`).
`hop` (basin-hopping truncation v2: one deep representative per plan,
cohorts at the T₀ diameter, mk ≥ 4 merge gate) and `alloc` (root
allocation: the interior dominant-set truncation law applied to the root;
fresh-gated selection) are kinetics-only protocol knobs — ensemble
parameters/attention under constitution rule 3, never values. Ladder
verdicts (July 2026): interior hop dedup retired (6/12 vs 7.5 with hop;
depth bought, strength lost to sharpened self-indulgence); `alloc` alone
is strength-neutral (7.5/12 = baseline) with the coolest bath of any
config and runaway nearly halved in play; `allocsched` (alloc+schedule)
read 6.5 vs the 9 schedule baseline — not validated, baseline stands.
`match.js` accepts backup variants as `cur:mean` etc., and the kinetics
knobs as `cur:hop` / `cur:alloc` / `cur:hopalloc`.

The app now carries a **Lab panel** (dashed amber console under the game
controls): the same hooks, hand-applied. Blank/F = honest play, bit-identical
to a build without the panel. Any active field is stamped on the dashboard
header (`⚠ LAB: …`) so a perturbed reading can never be mistaken for an
unperturbed one, and λ̂ (the drift-centered reply-grouped revision-independence
instrument, v3 of `covariance_probe.js`) reads live in the state grid.
