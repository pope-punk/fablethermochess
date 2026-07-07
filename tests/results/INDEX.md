# Results index — what every file was for

Chronological by experiment. **Baselines currently in force are bolded.**
Modes: `measure` = flux instrument reading, no coupling; `flux` = instrument
coupled into Q (retired); `probe` = susceptibility tax (retired);
`schedule` = σ_eff time management; `leafmu` = leaf tempo charge (retired).

## Stockfish gauntlets (12 games, opening book, both colors, SF-18 @ UCI_Elo)

| file | mode | score | verdict |
|---|---|---|---|
| `vs_sf1500.json` (+`_report.md/.pdf`) | baseline, 1000ms | 6.5/12 | original baseline (pre-quiescence-TT engine) |
| `vs_sf1500_probe.json` | probe | 1.5/12 | susceptibility probe: decisive failure, retired |
| `vs_sf1500_flux.json` (+`_eos/_cw` plots, `_JT.svg`) | flux (coupled) | 4/12 | coupled shade: strength-negative, but its 12k readings produced the **equation of state** and the first J fit |
| `vs_sf1500_v3.json` (+`_report.md`) | baseline, post-qTT engine | 7/12 | rebaseline after quiescence TT; first unprompted castles |
| **`vs_sf1500_measure.json`** (+`_JT.svg`) | measure | **7.5/12** | **fixed-time baseline for all A/Bs**; also the uncoupled anti-SF corpus for J fits |
| **`vs_sf1500_schedule.json`** | schedule | **9/12** | σ_eff scheduler validated (+1.5 at equal time); best result recorded |
| `vs_sf1500_schedule_v1invalid.*` | schedule (buggy) | 5.5/12 | archived invalid run: perpetual-motion bank, mate-gap freezes — kept as the autopsy record |
| `vs_sf1500_leafmu.json` | leafmu (windowed κ) | 5.5/12 | leaf tempo charge v1: volatile coefficient, retired |
| `vs_sf1500_leafmu2.json` | leafmu (structural κ) | 4/12 | v2: worked as designed, worse — mechanism (not tuning) refuted |
| `vs_sf1500_leafmu3.json` | leafmu (recentered) | 4/12 | v3: parity hypothesis refuted by controlled test; retirement final |
| `vs_sf1600.json` (+`_report.md`) | baseline | 1/12 | the 1600 cliff (partly SF's nonlinear Elo mapping) |
| `vs_sf1500_meanback.json` | meanback (⟨Q⟩_π backup) | 3.5/12 | winner's-curse experiment: premium-free backup cures the Alekhine blunder but is mated while ahead in material (8 mate losses) — the premium is the danger sense |
| `vs_sf1500_maxback.json` | maxback (max backup) | 5/12 | same experiment, quenched backup: same failure mode, milder (6 mate losses); both retired, see `backup_forms.js` |
| `vs_sf1500_basinsched.json` | basinsched (basin-gap freeze) | 7.5/12 | vs the 9/12 schedule baseline: no gain, possibly mild cost — and underpowered by design for a rare-firing criterion change (owner's call, correct). Scheduler criterion retired; basin work redirected at the interior premium |
| `vs_sf1500_basinback.json` | basinback (interior basin premium) | 6/12 | best of the premium deflations (oracle +2−1=9 — conversion kept, unlike mean/max; one mated-while-ahead loss vs mean's three; bath 8.8 vs 16.6) but still −1.5 vs the 7.5 baseline. The four-point ladder now reads 7.5 (full premium) > 6 (plans) > 5 (none, max) > 3.5 (none, mean): strength orders by premium size |
| `vs_sf1500_hop.json` | hop (basin-hopping truncation, kinetics) | 5.5/12 | negative with a sharp autopsy: oracle 0W 2L 10D with 31 blunders — the only configuration ever to lose to the material detector; killers deduped away on coarse ranking-depth basins keep optimistic shallow values in Z. Feedback diagnosed: hop → tail flapping → hotter bath → wider cohorts (diameter = live T) → more merging. v2 (T₀ diameter + mk≥4 merge gate) recorded in `basin_hop.js`, unbuilt |
| `hop2_oracle_match.log` | hop v2 / alloc / hopalloc vs the material oracle | +3−1=8 / +3−0=9 / +2−1=9 | the v2 repairs (T₀ merge diameter, mk≥4 gate, fresh-gated selection) restore material soundness across all three kinetics configs — v1's 0W 2L is gone; alloc is undefeated |
| `vs_sf1500_hopalloc.json` | hopalloc (interior hop v2 + root allocation, fixed time) | 6/12 | depth bought in play (mean 3.43→4.16, d6–d9 band appears) and T-at-depth CLEAN (median T identical to baseline at matched depth — the v1 thermometer feedback really is cut), but strength negative: 5 mate losses (none mated-while-ahead), early-queen tilt 2.83/game vs 2.25 — deeper annealing into the same landscape surfaces F's self-indulgence more sharply. The kinetics hypothesis of the SF-1600 cliff weakens; the evaluation hardens as the binding constraint |
| `vs_sf1500_alloc.json` | alloc (root allocation alone, fixed time) | **7.5/12** | **EQUAL to the measure baseline** (W7 D1 L4, 11/12 decisive) and cooler: mean T 8.2 vs 16.6, runaway share 2.8% vs 4.1%, queen tilt gone. The fixed-time kinetics ladder reads 7.5 (baseline) = 7.5 (alloc) > 6 (hopalloc) > 5.5 (hop v1): the interior hop dedup carries the whole cost; the root's own truncation law is free. Root allocation is the surviving kinetics |
| `vs_sf1500_allocsched.json` | allocsched (alloc + σ_eff schedule, no hop) | 6.5/12 | vs the 9/12 schedule baseline: NOT validated. No interaction mechanism found (freeze rate/depth histogram and banking match the baseline; bath cooler, 5.0 vs 5.7); n=12 underpowered or real cost — both recorded; the schedule baseline stands. Byproduct: exposed the d2-freeze-on-capture-gaps scheduler blind spot (~80% of freezes fire at d2 in BOTH runs; QGD-W frozen at d2 through Qxg7/Qxh8/Qxg8 and mated at +590 — σ_eff prices value noise, not horizon risk) |
| `exk_oracle_match.log` | exK='leaf' vs the material oracle | +2−2=8 | tied match (borderline pass), but 27 blunders vs the baseline's 16: the leaf recount measurably degrades tactical valuation |
| `vs_sf1500_exkleaf.json` | exkleaf (king moves out of leaf mobility counts) | 6/12 | vs the 7.5 measure baseline: negative. Draws were defensive salvations, not blown wins — the cost is upstream (W4 vs W6: fewer winning positions reached). The 'z' surface died pre-gauntlet on the endgame gate (a won K+P ending LOST — the interior premium collapse erases zugzwang asymmetry and danger sense where every move is a king move; `exk_probe.js`). Reading: the king's move count carries both our exposure AND their cornering (the mate-proximity gradient) — one number, two sides; removing it symmetrically removes both, and one-sided removal is the thrice-dead parity violation. exK retired in both decompositions |
| `quenched_oracle_match.log` | (aborted by design) | — | the quenched premium (nested-GEV, μ=√λ̂ pooled) did not cure the Alekhine (probe record in `quenched_probe.js`) — per the owner's rule, no strength ladder for an Alekhine-blundering config. Its adjudication measurement split the central disease: trap face = correlation (λ̂ 0.57, self-heals on resolution); open face = honestly independent resolved options overpriced at the bath T — heteroscedasticity is the missing state variable |
| `sigma_oracle_match.log` | σ-premium vs the material oracle | +3−2=7 | match won; draws swindled from −1410/−2800; blunders 24 vs 16 |
| `vs_sf1500_sigmaback.json` | sigmaback (heteroscedastic premium: V = ⟨Q⟩+Σπσ(−lnπ), σ per child from same-parity TT revisions) | **3.5/12** | the sharpest negative of the program: the FIRST mechanism ever to cure the Alekhine at honest temperatures (d4 plays Nd5, Δ −1.02; pinT-sound 1.0–3.0; fine70 converts faster, 41 plies) — and tied-worst in the gauntlet (W2 D3 L7, 7 mate losses, one at +710, two games lost from the opening). The cure and the collapse are one dial. THE LAW, six ladders deep: the interior premium at the full bath T is load-bearing at exactly its uncorrected size; deflation by count, structure, category, measured correlation, or measured resolution all read negative. The premium's function in play is strategic (nominal flexibility exerts real pressure), not statistical |
| `gibbs_oracle_match.log` | Gibbs leaf vs the material oracle | +3−3=6 | tied (borderline pass); draws swindled from −2810/−1500/−1410; blunders 24 vs 16 |
| `vs_sf1500_gibbs.json` | gibbs (G = U + T₀·lnW_us − T·lnW_them, root-anchored zero-point-pressure leaf) | 3.5/12 | the paradigm shift cured the Alekhine at d4 WITH the interior premium intact (unique among cures) — and still scored tied-worst (W3 D1 L8, 8 mate losses). Autopsy falsified its own theory in the field: early-queen rate UP (3.17 vs 2.25 — the indulgence lives in the untouched interior premium) and runaway share DOUBLED (the asymmetric leaf is unbounded at runaway T: them-term ~95 units at T=28 vs frozen us-term ~3.4). THE META-LAW, three-for-three: every Alekhine cure (mean, sigma, gibbs — three unrelated mechanisms) scores exactly 3.5/12 vs SF-1500: whatever declines d6 loses these games. Optionality-seeking is net-positive at these stakes; the blunder is its insurance cost. Cure value is an OPERATING-POINT question → retest at the 1600 cliff |
| `vs_sf1500_guard.json` | guard (schedule + absorbing-risk freeze guard) | 6/12 | pre-registered via `freeze_guard_replay.js` (deny d2 freezes on adverse-beyond-error or unmeasured flux; defer to d3). The clock mechanics worked exactly as registered (d2 freezes 115→2, deferrals cheap, spend unchanged) — and the hypothesis was refuted by its own metric: d3-confirmed freezes are as unstable as d2 ones (32% vs 29% eval-drop rate), and the target class recurred with the guard ON (English-W mated at +1010 on FULL-DEADLINE moves — the king marched Kb4→Kd7 into the net at +10…+13). The clock was never the disease: F prices an open king as an entropy bonus. Guard RETIRED. Scheduler-criterion ladder: 9 (σ_eff as-is) > 7.5 (basinsched) > 6.5 (allocsched) ≈ 6 (guard); an n=24 schedule rebaseline is the cheap next measurement |

## Self-play & fits

| file | what it is |
|---|---|
| `cooling_scan.json` | 16 self-play games at 250ms/1s/4s/15s, measure mode — the criticality-experiment corpus (~34k readings with precision counts) |
| `cooling_scan_JT.svg` | criticality ratio J·b/2T vs move temperature (final clean fit) |
| `fit_JT_full.log` | first T-binned Curie–Weiss refit (before the absorbing-floor cut) |
| `fit_JT_clean.log` | final self-play refit (TMIN=1): coupling weakly identifiable, at-or-below critical |
| `fit_JT_sfdata.log` | matched-T refit of the *coupled* anti-SF corpus (supercritical cold bins — treat edge-pinned CIs as artifacts, see log header commits) |
| `fit_JT_sfmeasure.log` | matched-T refit of the *uncoupled* anti-SF corpus — the deconfounding cell: ratios 0.79→0.82→1.02, zero excluded |
| `chain.log` | the unattended measurement chain (oracle sanity → SF-1500 rebaseline → cooling scan → SF-1600) |
| `backup_match_*.log` | backup-form oracle matches + mean-vs-F head-to-head (12 games, 400 ms): mean/max undefeated vs oracle, mean beats F 7–3 directly — yet both lose the gauntlet; head-to-head between siblings is not a strength instrument |

## Headline numbers to reuse

- Offline pooled J on the uncoupled anti-SF corpus: **J = 2.30 (95% CI 1.80–3.05), b = 0.80**.
- Structural constraint bite: **1.78–2.00** (regime-independent); structural criticality
  ratio b·bite/2 ≈ **0.6–0.75** (dimensionless).
- Baselines for future A/Bs: fixed-time → `vs_sf1500_measure.json` (7.5);
  scheduled → `vs_sf1500_schedule.json` (9).
