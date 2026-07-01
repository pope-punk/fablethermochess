# Test & match harness

Everything runs on plain Node (≥16), no dependencies.

```sh
node tests/extract_engine.js        # pull the engine out of the HTML → tests/engine_current.js
node tests/suite.js                 # perft, invariants, absorbing states, thermodynamic sanity
node tests/match.js cur ref 12 500  # gauntlet vs the material oracle (12 games, 500 ms/move)
node tests/match.js cur v1 12 500   # regression match vs the frozen first-edition engine
```

## The material oracle (`ref_engine.js`)

A deliberately naive opponent used as a measuring instrument: plain
alpha-beta + quiescence over an evaluation that is *pure classical
material* (100/300/310/500/900 cp) — no mobility, no king safety, no
piece-square tables. Because it values exactly one thing, it is a
near-perfect detector for that one thing: losing material to it within
its search horizon means a piece was genuinely hung. It typically reaches
depth 5–7 at 400 ms.

Reading a result against it:

- losing the match → the engine hangs material (the first edition lost 0–2);
- drawing most games → material play is sound (neither side can create
  chances the other perceives);
- winning the match → optionality/activity edges are being converted into
  material the oracle can see. The current engine's 12-game result:
  **+2 −1 =9**.

## The frozen baseline (`baselines/engine_v1_prescribedC.js`)

The complete first-edition engine (prescribed heat capacity, per-node
temperature, mobility-as-energy) kept for regression matches. The current
engine's 12-game result against it: **10–1 (+1 draw)**, with 23 vs 56
material blunders.

## Match harness details

Color-swapped pairs; a 6-line opening book restores game diversity
(deterministic engines otherwise repeat one game); games hitting the
240-ply cap are adjudicated by classical material (±150 cp window = draw).
Every move that loses ≥250 cp within two plies is logged with its FEN to
`tests/blunders_<A>_<B>.json` for diagnosis.
