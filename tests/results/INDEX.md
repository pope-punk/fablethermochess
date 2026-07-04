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

## Headline numbers to reuse

- Offline pooled J on the uncoupled anti-SF corpus: **J = 2.30 (95% CI 1.80–3.05), b = 0.80**.
- Structural constraint bite: **1.78–2.00** (regime-independent); structural criticality
  ratio b·bite/2 ≈ **0.6–0.75** (dimensionless).
- Baselines for future A/Bs: fixed-time → `vs_sf1500_measure.json` (7.5);
  scheduled → `vs_sf1500_schedule.json` (9).
