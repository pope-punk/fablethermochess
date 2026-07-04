# Results book: thermodynamic engine vs Stockfish 1500

- Date: 2026-07-02T14:33:17.983Z
- Engine time: 1000 ms/move · Stockfish: 200 ms/move at UCI_Elo 1500
- Openings: all 6 book lines, both colors (12 games)

## Final score

**Engine 7 — 5 Stockfish**  (W 6 / D 2 / L 4)

## Summary

| # | Opening | Engine color | Result | Plies | Termination | mean T | dominant phase |
|---|---|---|---|---|---|---|---|
| 1 | Italian complex | White | 0 (0-1) | 54 | checkmate | 5.43 | hot |
| 2 | Italian complex | Black | 0 (1-0) | 69 | checkmate | 3.58 | hot |
| 3 | Queen's Gambit Declined | White | 1 (1-0) | 95 | checkmate | 2.62 | hot |
| 4 | Queen's Gambit Declined | Black | 0 (1-0) | 101 | checkmate | 37.98 | hot |
| 5 | Sicilian (Najdorf setup) | White | 1 (1-0) | 73 | checkmate | 2.37 | hot |
| 6 | Sicilian (Najdorf setup) | Black | 1 (0-1) | 74 | checkmate | 3.27 | hot |
| 7 | King's Indian | White | ½ (1/2-1/2) | 141 | draw (50-move/material) | 2.50 | hot |
| 8 | King's Indian | Black | 1 (0-1) | 66 | checkmate | 2.72 | hot |
| 9 | French | White | 1 (1-0) | 73 | checkmate | 2.52 | hot |
| 10 | French | Black | ½ (1/2-1/2) | 212 | threefold repetition | 4.81 | hot |
| 11 | English (reversed Sicilian) | White | 0 (0-1) | 92 | checkmate | 3.99 | hot |
| 12 | English (reversed Sicilian) | Black | 1 (0-1) | 92 | checkmate | 2.45 | hot |

## Thermodynamics across the match

- Mean bath temperature over all engine moves: **6.42**
- Phase occupancy: frozen 5% · cold 13% · critical 5% · hot 77%
- Mean T in won games 2.65, drawn 3.89, lost 15.09

## Games

### Game 1: Italian complex — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "1"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Italian complex"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. d4 Nxd4 4. Nxd4 exd4 5. Qxd4 b6 6. Qe5+ Be7 7. Qxg7 Bf6 8. Qg3 Bb7 
9. e5 Bh4 10. Qg7 Bxf2+ 11. Kxf2 Qh4+ 12. g3 Qe4 13. Qxh8 O-O-O 14. Rg1 Nh6 15. Qxd8+ Kxd8 16. Bg5+ f6 
17. Bxf6+ Kc8 18. Bd3 Qf3+ 19. Ke1 Ng4 20. Rf1 Qg2 21. Bxh7 Kb8 22. Rf4 Qg1+ 23. Ke2 Qe3+ 24. Kd1 Bf3+ 
25. Rxf3 Qxf3+ 26. Kd2 Qe3+ 27. Kd1 Nf2# 0-1
```

Phases: frozen 3 · cold 7 · critical 0 · hot 15 · mean T 5.43 · max T 49.89

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | d4 | 1.50 | hot | -0.42 | 3 |
| 2 | Nxd4 | 1.45 | hot | -0.66 | 2 |
| 4 | Qxd4 | 1.07 | hot | -1.23 | 2 |
| 6 | Qe5+ | 1.14 | hot | -0.12 | 2 |
| 8 | Qxg7 | 1.30 | hot | +1.54 | 3 |
| 10 | Qg3 | 1.22 | cold | +1.19 | 3 |
| 12 | e5 | 1.23 | hot | +0.44 | 2 |
| 14 | Qg7 | 1.03 | cold | +3.91 | 2 |
| 16 | Kxf2 | 2.17 | hot | +5.16 | 3 |
| 18 | g3 | 1.07 | hot | +4.72 | 3 |
| 20 | Qxh8 | 13.18 | hot | +6.01 | 1 |
| 22 | Rg1 | 2.77 | hot | +6.55 | 2 |
| 24 | Qxd8+ | 4.78 | cold | +10.37 | 3 |
| 26 | Bg5+ | 2.58 | hot | +6.30 | 2 |
| 28 | Bxf6+ | 2.70 | cold | +9.21 | 3 |
| 30 | Bd3 | 2.27 | cold | +6.44 | 3 |
| 32 | Ke1 | 1.71 | frozen | +6.09 | 4 |
| 34 | Rf1 | 2.31 | cold | +6.43 | 3 |
| 36 | Bxh7 | 3.27 | hot | +3.48 | 2 |
| 38 | Rf4 | 3.12 | hot | +4.20 | 2 |
| 40 | Ke2 | 3.72 | hot | +3.19 | 3 |
| 42 | Kd1 | 16.86 | cold | -9.24 | 4 |
| 44 | Rxf3 | 49.89 | frozen | -48.45 | 4 |
| 46 | Kd2 | 13.48 | hot | -3.71 | 3 |
| 48 | Kd1 | 0.00 | frozen | -49999.00 | 4 |

### Game 2: Italian complex — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "2"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Italian complex"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. d4 Bb4+ 4. Nbd2 exd4 5. Bb5 a6 6. Be2 Qe7 7. O-O Nf6 8. Nb3 Qxe4 
9. Bg5 h6 10. Bh4 g5 11. a3 Bd6 12. Bc4 gxh4 13. Re1 Bxh2+ 14. Nxh2 Qxe1+ 15. Qxe1+ Kf8 16. Qc1 Ne5 
17. Be2 d3 18. cxd3 Nxd3 19. Qc3 Nf4 20. Qb4+ c5 21. Qxf4 Nd5 22. Qc4 b5 23. Qxh4 c4 24. Qd4 Nf4 
25. Bf3 Ne2+ 26. Bxe2 Rg8 27. Qd6+ Kg7 28. Qe5+ f6 29. Qe7+ Kh8 30. Bf3 Rb8 31. Nd4 Rg7 32. Qxf6 Kh7 
33. Nf5 Rxg2+ 34. Bxg2 h5 35. Qg7# 1-0
```

Phases: frozen 1 · cold 2 · critical 1 · hot 28 · mean T 3.58 · max T 15.14

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.49 | hot | +1.10 | 2 |
| 3 | exd4 | 1.21 | hot | +0.60 | 2 |
| 5 | a6 | 1.02 | hot | -0.27 | 2 |
| 7 | Qe7 | 1.06 | hot | -0.15 | 2 |
| 9 | Nf6 | 1.15 | hot | +0.00 | 2 |
| 11 | Qxe4 | 1.08 | hot | -0.38 | 2 |
| 13 | h6 | 2.17 | hot | +0.02 | 2 |
| 15 | g5 | 1.12 | hot | -1.56 | 2 |
| 17 | Bd6 | 2.65 | hot | -2.21 | 1 |
| 19 | gxh4 | 2.31 | hot | -5.52 | 1 |
| 21 | Bxh2+ | 11.81 | hot | -3.01 | 1 |
| 23 | Qxe1+ | 15.14 | hot | +5.79 | 2 |
| 25 | Kf8 | 2.27 | hot | +3.28 | 3 |
| 27 | Ne5 | 1.03 | hot | +1.82 | 2 |
| 29 | d3 | 2.42 | hot | +3.91 | 2 |
| 31 | Nxd3 | 1.58 | hot | +4.56 | 2 |
| 33 | Nf4 | 2.55 | hot | +3.79 | 3 |
| 35 | c5 | 8.14 | hot | +5.50 | 3 |
| 37 | Nd5 | 4.08 | hot | +10.43 | 2 |
| 39 | b5 | 4.60 | hot | +11.28 | 2 |
| 41 | c4 | 3.50 | hot | +7.61 | 3 |
| 43 | Nf4 | 7.91 | hot | +19.42 | 2 |
| 45 | Ne2+ | 8.34 | critical | +5.39 | 3 |
| 47 | Rg8 | 2.59 | cold | +9.40 | 3 |
| 49 | Kg7 | 2.38 | hot | +9.30 | 3 |
| 51 | f6 | 1.80 | hot | +8.68 | 3 |
| 53 | Kh8 | 2.17 | hot | +9.81 | 3 |
| 55 | Rb8 | 5.97 | hot | +13.03 | 3 |
| 57 | Rg7 | 2.00 | hot | +11.16 | 2 |
| 59 | Kh7 | 5.90 | hot | +13.50 | 3 |
| 61 | Rxg2+ | 3.12 | cold | +15.72 | 3 |
| 63 | h5 | 0.00 | frozen | +49999.00 | 4 |

### Game 3: Queen's Gambit Declined — engine as White — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "3"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Queen's Gambit Declined"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. Qa4+ c6 4. cxd5 Nf6 5. dxc6 bxc6 6. Bg5 Ba6 7. e4 Bxf1 8. Kxf1 Be7 
9. e5 Nfd7 10. Bxe7 Nb6 11. Qxc6+ Nxc6 12. Bxd8 Nxd8 13. Nc3 Nd5 14. Nxd5 exd5 15. Rc1 Ne6 16. Ne2 O-O 
17. Rc6 a5 18. Rd6 Rfb8 19. b3 a4 20. b4 h5 21. a3 Kf8 22. Rxd5 Nc7 23. Rd7 Nb5 24. e6 fxe6 
25. Nf4 Nxa3 26. Nxe6+ Kg8 27. Rxg7+ Kh8 28. Rg5 Nc2 29. Rxh5+ Kg8 30. Nc7 Ra7 31. Rg5+ Kf8 32. Ne6+ Ke8 
33. Rg8+ Ke7 34. Rxb8 Kxe6 35. Rc8 Nxd4 36. Rc4 Rd7 37. Rc3 Nf3 38. Rc6+ Ke7 39. gxf3 Rd8 40. Ke2 Kd7 
41. Ra6 Ke7 42. Ra7+ Kf6 43. Rg1 Rc8 44. Ra6+ Kf7 45. Kd3 Rd8+ 46. Ke4 a3 47. Ra7+ Ke8 48. Rg8# 1-0
```

Phases: frozen 1 · cold 4 · critical 2 · hot 39 · mean T 2.62 · max T 28.24

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qa4+ | 1.25 | hot | -1.09 | 2 |
| 2 | cxd5 | 1.02 | hot | -0.89 | 2 |
| 4 | dxc6 | 2.93 | hot | -1.05 | 2 |
| 6 | Bg5 | 1.01 | hot | -0.46 | 2 |
| 8 | e4 | 1.01 | hot | +0.24 | 2 |
| 10 | Kxf1 | 1.01 | cold | -0.34 | 2 |
| 12 | e5 | 1.63 | hot | -0.62 | 2 |
| 14 | Bxe7 | 3.62 | hot | +3.19 | 3 |
| 16 | Qxc6+ | 28.24 | hot | -16.38 | 2 |
| 18 | Bxd8 | 11.64 | hot | -14.78 | 2 |
| 20 | Nc3 | 1.55 | hot | +1.28 | 4 |
| 22 | Nxd5 | 1.81 | hot | +3.07 | 3 |
| 24 | Rc1 | 1.39 | hot | +1.39 | 4 |
| 26 | Ne2 | 1.75 | hot | +0.97 | 3 |
| 28 | Rc6 | 1.36 | hot | +1.64 | 3 |
| 30 | Rd6 | 1.19 | hot | +1.94 | 3 |
| 32 | b3 | 1.65 | hot | +1.35 | 3 |
| 34 | b4 | 2.05 | hot | +0.93 | 3 |
| 36 | a3 | 1.38 | hot | +1.79 | 3 |
| 38 | Rxd5 | 1.04 | hot | +2.61 | 3 |
| 40 | Rd7 | 1.05 | cold | +2.21 | 4 |
| 42 | e6 | 2.41 | hot | +2.23 | 3 |
| 44 | Nf4 | 1.51 | hot | +1.59 | 3 |
| 46 | Nxe6+ | 1.18 | hot | +2.73 | 3 |
| 48 | Rxg7+ | 1.22 | hot | +3.86 | 3 |
| 50 | Rg5 | 1.44 | hot | +3.18 | 3 |
| 52 | Rxh5+ | 1.47 | hot | +5.01 | 3 |
| 54 | Nc7 | 1.48 | hot | +4.86 | 3 |
| 56 | Rg5+ | 1.18 | critical | +3.14 | 4 |
| 58 | Ne6+ | 4.04 | hot | +6.92 | 3 |
| 60 | Rg8+ | 11.88 | hot | +10.63 | 3 |
| 62 | Rxb8 | 5.20 | critical | +9.38 | 3 |
| 64 | Rc8 | 1.77 | hot | +7.34 | 4 |
| 66 | Rc4 | 1.17 | hot | +6.41 | 4 |
| 68 | Rc3 | 1.03 | hot | +6.18 | 4 |
| 70 | Rc6+ | 1.70 | cold | +7.96 | 4 |
| 72 | gxf3 | 1.15 | cold | +8.55 | 4 |
| 74 | Ke2 | 1.19 | hot | +9.56 | 4 |
| 76 | Ra6 | 1.38 | hot | +9.83 | 4 |
| 78 | Ra7+ | 1.49 | hot | +10.34 | 4 |
| 80 | Rg1 | 1.29 | hot | +9.85 | 4 |
| 82 | Ra6+ | 1.46 | hot | +11.05 | 4 |
| 84 | Kd3 | 1.38 | hot | +10.11 | 4 |
| 86 | Ke4 | 1.27 | hot | +9.94 | 4 |
| 88 | Ra7+ | 1.59 | hot | +12.33 | 3 |
| 90 | Rg8# | 0.00 | frozen | +49999.50 | 4 |

### Game 4: Queen's Gambit Declined — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "4"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Queen's Gambit Declined"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. Nf3 Bb4+ 4. Bd2 Bxd2+ 5. Nbxd2 dxc4 6. Qa4+ Bd7 7. Qc2 c3 8. Qxc3 Ba4 
9. d5 Qxd5 10. e4 Qd6 11. a3 Nc6 12. b3 Qxd2+ 13. Nxd2 Bxb3 14. Nxb3 Nf6 15. Rd1 Nxe4 16. Qe3 Nxf2 
17. Qxf2 Ke7 18. g3 Rad8 19. Rc1 Rd5 20. h4 Re5+ 21. Be2 Rf5 22. Qg2 Rd8 23. Rf1 Rxf1+ 24. Bxf1 Rd5 
25. Be2 h5 26. Rxc6 bxc6 27. Qf2 Rf5 28. Qxa7 Kd7 29. Qd4+ Rd5 30. Qe3 Ke7 31. Qa7 Kd7 32. a4 Kc8 
33. Nc5 Kd8 34. Na6 Ke7 35. Qb8 Rd8 36. Qb7 Rd4 37. Qxc6 Rd6 38. Qc5 e5 39. Nxc7 g6 40. Bb5 g5 
41. Qxe5+ Re6 42. Nxe6 fxe6 43. Qc5+ Kf7 44. Qxg5 e5 45. a5 Ke6 46. Qg6+ Kd5 47. Qc6+ Kd4 48. Qc4+ Ke3 
49. Qb3+ Kd4 50. Qc4+ Ke3 51. Qd3# 1-0
```

Phases: frozen 3 · cold 4 · critical 0 · hot 41 · mean T 37.98 · max T 789.21

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.01 | hot | +0.02 | 2 |
| 3 | Bxd2+ | 1.59 | hot | +0.64 | 2 |
| 5 | dxc4 | 1.43 | hot | +0.08 | 3 |
| 7 | Bd7 | 3.69 | hot | -1.73 | 3 |
| 9 | c3 | 2.52 | hot | +2.76 | 2 |
| 11 | Ba4 | 2.07 | hot | +1.27 | 3 |
| 13 | Qxd5 | 1.93 | hot | +2.21 | 2 |
| 15 | Qd6 | 2.81 | cold | +3.80 | 2 |
| 17 | Nc6 | 1.70 | hot | +1.73 | 2 |
| 19 | Qxd2+ | 11.00 | hot | +15.18 | 2 |
| 21 | Bxb3 | 11.52 | hot | +28.63 | 2 |
| 23 | Nf6 | 1.76 | hot | +14.39 | 2 |
| 25 | Nxe4 | 1.31 | hot | +11.98 | 2 |
| 27 | Nxf2 | 1.94 | hot | +10.66 | 3 |
| 29 | Ke7 | 2.68 | hot | +13.68 | 3 |
| 31 | Rad8 | 1.10 | hot | +13.78 | 2 |
| 33 | Rd5 | 1.06 | hot | +13.54 | 2 |
| 35 | Re5+ | 1.02 | hot | +12.41 | 2 |
| 37 | Rf5 | 1.05 | hot | +12.62 | 2 |
| 39 | Rd8 | 1.01 | hot | +13.34 | 2 |
| 41 | Rxf1+ | 1.45 | hot | +12.60 | 2 |
| 43 | Rd5 | 1.04 | hot | +13.47 | 2 |
| 45 | h5 | 1.01 | hot | +13.45 | 2 |
| 47 | bxc6 | 1.62 | cold | +8.39 | 3 |
| 49 | Rf5 | 2.36 | hot | +10.40 | 2 |
| 51 | Kd7 | 2.14 | hot | +10.33 | 3 |
| 53 | Rd5 | 5.25 | hot | +11.46 | 3 |
| 55 | Ke7 | 1.31 | hot | +10.68 | 2 |
| 57 | Kd7 | 1.52 | hot | +11.04 | 2 |
| 59 | Kc8 | 2.08 | hot | +9.92 | 3 |
| 61 | Kd8 | 3.67 | cold | +11.02 | 3 |
| 63 | Ke7 | 7.10 | hot | +13.64 | 3 |
| 65 | Rd8 | 6.55 | hot | +12.49 | 3 |
| 67 | Rd4 | 4.34 | hot | +15.88 | 2 |
| 69 | Rd6 | 5.53 | hot | +12.70 | 3 |
| 71 | e5 | 7.68 | hot | +15.31 | 3 |
| 73 | g6 | 8.94 | hot | +17.88 | 3 |
| 75 | g5 | 17.87 | hot | +27.74 | 4 |
| 77 | Re6 | 68.77 | hot | +77.24 | 4 |
| 79 | fxe6 | 20.83 | hot | +36.55 | 4 |
| 81 | Kf7 | 139.06 | hot | +117.60 | 5 |
| 83 | e5 | 789.21 | hot | +615.56 | 6 |
| 85 | Ke6 | 132.22 | hot | +111.75 | 5 |
| 87 | Kd5 | 139.97 | hot | +120.38 | 5 |
| 89 | Kd4 | 0.00 | frozen | +49998.00 | 6 |
| 91 | Ke3 | 0.00 | frozen | +49999.00 | 7 |
| 93 | Kd4 | 396.22 | cold | +322.17 | 6 |
| 95 | Ke3 | 1.00 | frozen | +0.00 | 64 |

### Game 5: Sicilian (Najdorf setup) — engine as White — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "5"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Sicilian (Najdorf setup)"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7 4. Bxd7+ Qxd7 5. Ng5 h6 6. Qh5 hxg5 7. Qxh8 Qe6 8. Qxg8 Qxe4+ 
9. Kf1 Qxc2 10. Nc3 Nd7 11. h4 Nf6 12. Qh8 g4 13. Ke2 d5 14. f3 gxf3+ 15. gxf3 Qg6 16. Kf2 O-O-O 
17. Nb5 a6 18. Na7+ Kd7 19. h5 Qc2 20. h6 Qg6 21. hxg7 Bxg7 22. Qh3+ e6 23. Rg1 Qh5 24. Qxh5 Ne4+ 
25. Ke2 Ke7 26. Rxg7 Nd6 27. Qh4+ Kf8 28. Rg8+ Kxg8 29. Qxd8+ Kg7 30. Qxd6 b5 31. Qxc5 Kh7 32. Qc2+ Kg7 
33. d4 b4 34. Qc7 a5 35. Qg3+ Kh8 36. Bd2 f6 37. Rh1# 1-0
```

Phases: frozen 2 · cold 4 · critical 2 · hot 27 · mean T 2.37 · max T 11.92

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.59 | hot | +0.94 | 3 |
| 2 | Bxd7+ | 2.59 | hot | +1.45 | 3 |
| 4 | Ng5 | 1.77 | hot | -0.99 | 3 |
| 6 | Qh5 | 1.74 | hot | +0.21 | 3 |
| 8 | Qxh8 | 1.00 | cold | +4.45 | 3 |
| 10 | Qxg8 | 2.03 | hot | +3.60 | 2 |
| 12 | Kf1 | 5.76 | hot | +1.56 | 3 |
| 14 | Nc3 | 1.13 | cold | +4.76 | 3 |
| 16 | h4 | 1.02 | hot | +3.84 | 2 |
| 18 | Qh8 | 1.15 | cold | +4.54 | 3 |
| 20 | Ke2 | 1.03 | hot | +3.48 | 2 |
| 22 | f3 | 1.01 | hot | +3.89 | 2 |
| 24 | gxf3 | 1.00 | hot | +3.59 | 2 |
| 26 | Kf2 | 1.37 | hot | +4.58 | 3 |
| 28 | Nb5 | 1.26 | hot | +4.82 | 3 |
| 30 | Na7+ | 1.26 | hot | +5.06 | 3 |
| 32 | h5 | 1.42 | hot | +4.54 | 3 |
| 34 | h6 | 1.06 | hot | +3.58 | 2 |
| 36 | hxg7 | 2.37 | hot | +4.04 | 2 |
| 38 | Qh3+ | 1.53 | cold | +5.75 | 3 |
| 40 | Rg1 | 1.47 | hot | +5.65 | 3 |
| 42 | Qxh5 | 7.41 | hot | +9.84 | 3 |
| 44 | Ke2 | 2.08 | hot | +17.66 | 3 |
| 46 | Rxg7 | 2.13 | critical | +22.25 | 3 |
| 48 | Qh4+ | 1.13 | hot | +20.75 | 2 |
| 50 | Rg8+ | 8.36 | critical | +26.27 | 2 |
| 52 | Qxd8+ | 11.92 | hot | +31.29 | 3 |
| 54 | Qxd6 | 1.78 | hot | +24.52 | 3 |
| 56 | Qxc5 | 2.11 | hot | +25.88 | 3 |
| 58 | Qc2+ | 2.58 | hot | +26.59 | 3 |
| 60 | d4 | 1.97 | hot | +26.09 | 3 |
| 62 | Qc7 | 3.88 | hot | +26.72 | 4 |
| 64 | Qg3+ | 3.00 | hot | +27.51 | 3 |
| 66 | Bd2 | 0.00 | frozen | +49998.50 | 4 |
| 68 | Rh1# | 0.00 | frozen | +49999.50 | 4 |

### Game 6: Sicilian (Najdorf setup) — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "6"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Sicilian (Najdorf setup)"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. d4 Qa5+ 4. Nbd2 cxd4 5. b4 Qxb4 6. Bc4 Qc3 7. O-O Qxa1 8. Nb3 Qc3 
9. Bb5+ Bd7 10. Bd2 Qc8 11. Nfxd4 Bxb5 12. e5 Bxf1 13. Kxf1 Qc4+ 14. Ne2 dxe5 15. f4 exf4 16. Bc3 f3 
17. gxf3 Qc6 18. Kg2 Qg6+ 19. Ng3 Qd6 20. Qf1 Qc6 21. Ne4 f5 22. Nd4 Qg6+ 23. Kh1 fxe4 24. a3 exf3 
25. h3 Qg2+ 26. Qxg2 fxg2+ 27. Kg1 e5 28. Kxg2 exd4 29. Bb4 Bxb4 30. c3 Bxc3 31. Kh1 Nc6 32. h4 Nf6 
33. Kg1 Ng4 34. h5 O-O 35. h6 Rf2 36. a4 Re8 37. Kh1 Re1# 0-1
```

Phases: frozen 2 · cold 5 · critical 0 · hot 28 · mean T 3.27 · max T 17.78

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Qa5+ | 1.09 | hot | +0.98 | 2 |
| 3 | cxd4 | 1.06 | hot | +0.50 | 2 |
| 5 | Qxb4 | 1.14 | cold | -1.88 | 3 |
| 7 | Qc3 | 1.20 | hot | -1.67 | 2 |
| 9 | Qxa1 | 1.57 | cold | -8.10 | 3 |
| 11 | Qc3 | 2.40 | cold | -7.96 | 3 |
| 13 | Bd7 | 3.28 | hot | -7.30 | 3 |
| 15 | Qc8 | 1.76 | cold | -7.87 | 3 |
| 17 | Bxb5 | 1.66 | hot | -7.76 | 2 |
| 19 | Bxf1 | 8.76 | hot | -2.69 | 2 |
| 21 | Qc4+ | 1.20 | hot | -15.09 | 2 |
| 23 | dxe5 | 1.01 | hot | -14.56 | 2 |
| 25 | exf4 | 1.34 | hot | -15.85 | 3 |
| 27 | f3 | 1.85 | hot | -17.19 | 3 |
| 29 | Qc6 | 1.40 | hot | -15.58 | 3 |
| 31 | Qg6+ | 1.54 | hot | -16.65 | 3 |
| 33 | Qd6 | 1.77 | hot | -15.55 | 3 |
| 35 | Qc6 | 1.02 | hot | -14.98 | 2 |
| 37 | f5 | 1.06 | hot | -15.24 | 2 |
| 39 | Qg6+ | 1.54 | hot | -16.83 | 3 |
| 41 | fxe4 | 1.56 | hot | -17.39 | 3 |
| 43 | exf3 | 1.05 | hot | -17.79 | 2 |
| 45 | Qg2+ | 2.76 | hot | -18.36 | 2 |
| 47 | fxg2+ | 4.84 | cold | -21.21 | 3 |
| 49 | e5 | 1.61 | hot | -19.26 | 3 |
| 51 | exd4 | 2.34 | hot | -21.82 | 3 |
| 53 | Bxb4 | 2.65 | hot | -23.84 | 3 |
| 55 | Bxc3 | 4.23 | hot | -27.78 | 4 |
| 57 | Nc6 | 17.78 | hot | -42.23 | 5 |
| 59 | Nf6 | 9.15 | hot | -32.74 | 4 |
| 61 | Ng4 | 8.56 | hot | -32.13 | 4 |
| 63 | O-O | 9.40 | hot | -33.70 | 4 |
| 65 | Rf2 | 10.74 | hot | -36.53 | 4 |
| 67 | Re8 | 0.00 | frozen | -49998.50 | 4 |
| 69 | Re1# | 0.00 | frozen | -49999.50 | 4 |

### Game 7: King's Indian — engine as White — 1/2-1/2

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "7"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "King's Indian"]
[Result "1/2-1/2"]
[Termination "draw (50-move/material)"]

1. d4 Nf6 2. c4 g6 3. Qd3 d5 4. cxd5 c6 5. dxc6 Bg7 6. cxb7 Bxb7 7. Qb5+ Bc6 8. Qe5 Qd7 
9. d5 Qxd5 10. Qxd5 Nxd5 11. e4 Nb6 12. Nc3 Na4 13. Nxa4 Bxa4 14. Nf3 Nc6 15. Ba6 Nb4 16. Bb7 Rb8 
17. Bc6+ Bxc6 18. Nd4 Bxe4 19. f3 Bb7 20. Be3 Nd5 21. Bf2 Ba8 22. Bg3 Rxb2 23. O-O-O Rb6 24. Rhe1 Rb4 
25. Be5 O-O 26. Bxg7 Rc8+ 27. Nc6 Bxc6 28. Be5 Ba4+ 29. Kd2 Bxd1 30. Rxd1 f6 31. a3 Rb7 32. Bd4 Rd7 
33. Rc1 Rdc7 34. Rxc7 Nxc7 35. Bxa7 Na6 36. Bf2 Ra8 37. Kc2 Kh8 38. Be3 Nc7 39. Bb6 Kg7 40. Bxc7 Rxa3 
41. Kb2 Re3 42. Bf4 Rd3 43. Kc2 Rd8 44. Be3 Kf7 45. Kc3 g5 46. Bb6 Ra8 47. Bf2 Ra2 48. Bc5 Ra5 
49. Kb4 Ra8 50. Kc4 Ra2 51. Kc3 h5 52. Kb3 Rxg2 53. h3 g4 54. hxg4 Rg3 55. gxh5 e5 56. Kc2 Rxf3 
57. h6 Rf4 58. h7 Kg7 59. h8=Q+ Kxh8 60. Kb3 f5 61. Bd6 Rh4 62. Bxe5+ Kg8 63. Bf6 Re4 64. Bc3 Kf7 
65. Kc2 Rc4 66. Kb3 Rxc3+ 67. Kxc3 Kg6 68. Kd3 Kg5 69. Ke3 Kh5 70. Kf4 Kh6 71. Kxf5 1/2-1/2
```

Phases: frozen 0 · cold 2 · critical 3 · hot 64 · mean T 2.50 · max T 21.12

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qd3 | 1.16 | hot | +0.19 | 3 |
| 2 | cxd5 | 1.06 | hot | -0.85 | 2 |
| 4 | dxc6 | 2.80 | hot | -2.39 | 2 |
| 6 | cxb7 | 2.69 | hot | +1.53 | 2 |
| 8 | Qb5+ | 1.02 | hot | +1.70 | 2 |
| 10 | Qe5 | 1.74 | cold | +0.98 | 3 |
| 12 | d5 | 1.03 | hot | +0.55 | 2 |
| 14 | Qxd5 | 5.10 | critical | +3.71 | 3 |
| 16 | e4 | 1.71 | hot | +0.69 | 3 |
| 18 | Nc3 | 2.21 | hot | -0.63 | 3 |
| 20 | Nxa4 | 3.40 | hot | -2.14 | 2 |
| 22 | Nf3 | 1.62 | hot | +0.09 | 3 |
| 24 | Ba6 | 1.83 | hot | -0.06 | 3 |
| 26 | Bb7 | 2.47 | hot | -1.35 | 3 |
| 28 | Bc6+ | 13.88 | hot | +3.23 | 3 |
| 30 | Nd4 | 2.84 | hot | -6.03 | 3 |
| 32 | f3 | 1.75 | hot | -5.82 | 3 |
| 34 | Be3 | 1.68 | hot | -5.90 | 3 |
| 36 | Bf2 | 1.78 | hot | -5.99 | 3 |
| 38 | Bg3 | 1.62 | hot | -6.41 | 2 |
| 40 | O-O-O | 1.83 | hot | -5.96 | 3 |
| 42 | Rhe1 | 2.04 | hot | -6.63 | 3 |
| 44 | Be5 | 1.55 | hot | -5.88 | 3 |
| 46 | Bxg7 | 1.63 | hot | -5.46 | 3 |
| 48 | Nc6 | 21.12 | hot | -18.35 | 3 |
| 50 | Be5 | 3.51 | hot | -6.48 | 3 |
| 52 | Kd2 | 13.46 | hot | -15.76 | 3 |
| 54 | Rxd1 | 2.75 | hot | -7.65 | 3 |
| 56 | a3 | 2.01 | hot | -7.38 | 3 |
| 58 | Bd4 | 2.13 | hot | -7.71 | 3 |
| 60 | Rc1 | 1.74 | hot | -6.80 | 3 |
| 62 | Rxc7 | 3.99 | hot | -3.97 | 3 |
| 64 | Bxa7 | 1.21 | hot | -6.26 | 3 |
| 66 | Bf2 | 1.82 | hot | -7.09 | 4 |
| 68 | Kc2 | 1.15 | hot | -6.06 | 4 |
| 70 | Be3 | 1.08 | hot | -6.21 | 4 |
| 72 | Bb6 | 1.42 | hot | -5.71 | 3 |
| 74 | Bxc7 | 2.95 | hot | -5.27 | 3 |
| 76 | Kb2 | 1.33 | hot | -5.06 | 4 |
| 78 | Bf4 | 1.15 | hot | -4.74 | 4 |
| 80 | Kc2 | 1.35 | hot | -4.87 | 4 |
| 82 | Be3 | 1.74 | hot | -5.26 | 4 |
| 84 | Kc3 | 1.21 | hot | -4.90 | 4 |
| 86 | Bb6 | 1.32 | hot | -5.27 | 4 |
| 88 | Bf2 | 1.86 | hot | -5.81 | 4 |
| 90 | Bc5 | 2.23 | hot | -8.02 | 4 |
| 92 | Kb4 | 1.07 | hot | -4.41 | 4 |
| 94 | Kc4 | 1.45 | hot | -5.46 | 4 |
| 96 | Kc3 | 6.46 | hot | +0.00 | 3 |
| 98 | Kb3 | 2.81 | hot | -3.60 | 3 |
| 100 | h3 | 1.45 | hot | -6.73 | 4 |
| 102 | hxg4 | 2.07 | hot | -4.50 | 3 |
| 104 | gxh5 | 1.90 | hot | -3.64 | 3 |
| 106 | Kc2 | 2.12 | hot | -5.02 | 4 |
| 108 | h6 | 1.26 | hot | -4.06 | 5 |
| 110 | h7 | 1.08 | hot | -3.91 | 4 |
| 112 | h8=Q+ | 4.45 | hot | -2.90 | 4 |
| 114 | Kb3 | 1.09 | hot | -4.71 | 5 |
| 116 | Bd6 | 1.05 | hot | -4.12 | 5 |
| 118 | Bxe5+ | 1.15 | critical | -2.60 | 5 |
| 120 | Bf6 | 1.07 | hot | -3.73 | 5 |
| 122 | Bc3 | 1.20 | hot | -3.99 | 5 |
| 124 | Kc2 | 1.45 | hot | -4.45 | 5 |
| 126 | Kb3 | 1.14 | hot | -3.82 | 5 |
| 128 | Kxc3 | 1.02 | cold | -1.19 | 7 |
| 130 | Kd3 | 1.11 | hot | -1.31 | 11 |
| 132 | Ke3 | 1.04 | hot | -1.74 | 10 |
| 134 | Kf4 | 1.02 | hot | -0.44 | 11 |
| 136 | Kxf5 | 1.01 | critical | +0.81 | 11 |

### Game 8: King's Indian — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "8"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "King's Indian"]
[Result "0-1"]
[Termination "checkmate"]

1. d4 Nf6 2. c4 g6 3. Nf3 d5 4. cxd5 Qxd5 5. h3 Qa5+ 6. Bd2 Qb6 7. e3 Qxb2 8. Bc3 Qb6 
9. Bc4 Ne4 10. a4 Nxc3 11. Nxc3 Qb4 12. Qd3 Bf5 13. Ng5 Bxd3 14. Bxf7+ Kd7 15. Be6+ Kd6 16. Kd2 Be4 
17. Ra2 Bxg2 18. Rg1 Bh6 19. Nf7+ Kxe6 20. h4 Qxd4+ 21. Kc2 Be4+ 22. Kb3 Bd5+ 23. Kc2 Qxh4 24. Nxd5 Qxf2+ 
25. Kd1 Qxg1+ 26. Kc2 Kxf7 27. Nxe7 Kxe7 28. Rb2 Qxe3 29. Kb1 Qc1+ 30. Ka2 Qc4+ 31. Ka3 Bc1 32. a5 Rf8 
33. a6 Rf3# 0-1
```

Phases: frozen 2 · cold 7 · critical 3 · hot 19 · mean T 2.72 · max T 14.50

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | d5 | 1.73 | hot | +0.59 | 3 |
| 3 | Qxd5 | 1.03 | hot | +1.48 | 2 |
| 5 | Qa5+ | 1.10 | hot | +0.68 | 2 |
| 7 | Qb6 | 1.49 | cold | +0.31 | 3 |
| 9 | Qxb2 | 1.03 | hot | -0.53 | 2 |
| 11 | Qb6 | 2.01 | cold | +0.25 | 3 |
| 13 | Ne4 | 1.01 | hot | -0.58 | 2 |
| 15 | Nxc3 | 3.56 | hot | -1.08 | 2 |
| 17 | Qb4 | 1.04 | hot | -2.08 | 2 |
| 19 | Bf5 | 1.05 | hot | -2.65 | 2 |
| 21 | Bxd3 | 4.69 | critical | -10.32 | 2 |
| 23 | Kd7 | 1.17 | hot | -12.25 | 4 |
| 25 | Kd6 | 1.28 | hot | -12.21 | 4 |
| 27 | Be4 | 2.16 | hot | -11.42 | 3 |
| 29 | Bxg2 | 1.17 | critical | -13.76 | 3 |
| 31 | Bh6 | 2.05 | hot | -12.06 | 3 |
| 33 | Kxe6 | 14.50 | hot | +2.43 | 2 |
| 35 | Qxd4+ | 1.69 | cold | -19.71 | 1 |
| 37 | Be4+ | 1.23 | cold | -20.03 | 3 |
| 39 | Bd5+ | 1.19 | cold | -20.18 | 3 |
| 41 | Qxh4 | 1.39 | cold | -20.05 | 1 |
| 43 | Qxf2+ | 6.31 | hot | -20.05 | 1 |
| 45 | Qxg1+ | 5.07 | cold | -25.37 | 2 |
| 47 | Kxf7 | 3.21 | critical | -27.78 | 3 |
| 49 | Kxe7 | 2.99 | hot | -30.61 | 3 |
| 51 | Qxe3 | 2.63 | hot | -30.83 | 3 |
| 53 | Qc1+ | 3.31 | hot | -32.29 | 3 |
| 55 | Qc4+ | 2.68 | hot | -31.82 | 3 |
| 57 | Bc1 | 10.69 | hot | -38.02 | 3 |
| 59 | Rf8 | 0.00 | frozen | -49998.50 | 4 |
| 61 | Rf3# | 0.00 | frozen | -49999.50 | 3 |

### Game 9: French — engine as White — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "9"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "French"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 e6 2. d4 d5 3. Bb5+ Bd7 4. Bxd7+ Qxd7 5. exd5 Bd6 6. dxe6 Qxe6+ 7. Qe2 Ne7 8. Qxe6 fxe6 
9. d5 exd5 10. Nc3 O-O 11. Nb5 Nbc6 12. Nxd6 Nb4 13. Nf5 Rxf5 14. Ke2 c5 15. g4 Rff8 16. Bg5 Rae8 
17. c3 Nc8+ 18. Be3 d4 19. cxb4 dxe3 20. fxe3 cxb4 21. Nf3 Rf4 22. Kf2 Rxg4 23. h3 Rc4 24. Rac1 Nb6 
25. Rxc4 Rf8 26. Rxb4 g6 27. Rd1 Na4 28. Rxa4 a5 29. Rxa5 Rxf3+ 30. Kxf3 Kf8 31. Ra8+ Kg7 32. Rd7+ Kf6 
33. Rxb7 h6 34. Ra6+ Kg5 35. Rb5+ Kh4 36. Kg2 h5 37. Ra4# 1-0
```

Phases: frozen 3 · cold 0 · critical 3 · hot 29 · mean T 2.52 · max T 8.99

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.27 | hot | -0.86 | 2 |
| 2 | Bxd7+ | 2.71 | hot | -1.52 | 2 |
| 4 | exd5 | 1.36 | hot | -1.48 | 2 |
| 6 | dxe6 | 1.47 | hot | -0.22 | 2 |
| 8 | Qe2 | 2.21 | hot | -0.22 | 3 |
| 10 | Qxe6 | 1.83 | critical | +0.85 | 2 |
| 12 | d5 | 1.83 | hot | +0.06 | 3 |
| 14 | Nc3 | 1.88 | hot | -1.06 | 3 |
| 16 | Nb5 | 1.52 | hot | -0.13 | 3 |
| 18 | Nxd6 | 4.24 | hot | -2.41 | 2 |
| 20 | Nf5 | 3.28 | hot | -0.12 | 3 |
| 22 | Ke2 | 3.00 | hot | -1.26 | 3 |
| 24 | g4 | 3.04 | hot | +1.20 | 3 |
| 26 | Bg5 | 3.32 | hot | +0.29 | 3 |
| 28 | c3 | 2.14 | hot | -0.81 | 2 |
| 30 | Be3 | 1.84 | hot | +0.06 | 4 |
| 32 | cxb4 | 3.28 | hot | -1.79 | 2 |
| 34 | fxe3 | 3.10 | hot | -3.68 | 2 |
| 36 | Nf3 | 1.44 | hot | -0.49 | 3 |
| 38 | Kf2 | 1.90 | hot | +0.41 | 3 |
| 40 | h3 | 1.30 | hot | -0.30 | 3 |
| 42 | Rac1 | 1.26 | hot | -1.01 | 3 |
| 44 | Rxc4 | 2.26 | hot | +0.35 | 3 |
| 46 | Rxb4 | 1.09 | hot | +7.27 | 3 |
| 48 | Rd1 | 1.09 | hot | +7.63 | 3 |
| 50 | Rxa4 | 1.44 | critical | +10.40 | 3 |
| 52 | Rxa5 | 1.55 | hot | +11.58 | 3 |
| 54 | Kxf3 | 5.29 | critical | +17.21 | 4 |
| 56 | Ra8+ | 5.18 | hot | +19.22 | 4 |
| 58 | Rd7+ | 7.31 | hot | +21.75 | 4 |
| 60 | Rxb7 | 4.77 | hot | +19.42 | 4 |
| 62 | Ra6+ | 8.99 | hot | +24.72 | 4 |
| 64 | Rb5+ | 0.00 | frozen | +49997.50 | 5 |
| 66 | Kg2 | 0.00 | frozen | +49998.50 | 5 |
| 68 | Ra4# | 0.00 | frozen | +49999.50 | 5 |

### Game 10: French — engine as Black — 1/2-1/2

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "10"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "French"]
[Result "1/2-1/2"]
[Termination "threefold repetition"]

1. e4 e6 2. d4 d5 3. e5 Bb4+ 4. c3 Bf8 5. Nf3 Bd7 6. Bd3 h6 7. O-O g5 8. a4 g4 
9. Nfd2 Qh4 10. g3 Qh3 11. Re1 a5 12. Na3 Na6 13. Qb3 Nb4 14. cxb4 axb4 15. Nc2 b5 16. axb5 Qxh2+ 
17. Kxh2 Rxa1 18. Kg1 Ra5 19. Nf1 Bxb5 20. Bxb5+ Rxb5 21. Nd2 h5 22. Na3 Rb6 23. Nb5 Rxb5 24. Nf1 c5 
25. Qc2 b3 26. Qd1 cxd4 27. Qe2 Rb4 28. Bf4 d3 29. Qxd3 Bc5 30. Rc1 Bd4 31. Rc7 Bxb2 32. Qd2 Ba3 
33. Rc8+ Kd7 34. Rc1 b2 35. Re1 b1=Q 36. Rxb1 Rxb1 37. Qd4 Be7 38. Qc3 Bf8 39. Qd3 Re1 40. Qa6 Bg7 
41. Qa4+ Kd8 42. Qa5+ Kc8 43. Qc5+ Kd7 44. Qa7+ Ke8 45. Qb8+ Kd7 46. Qb7+ Ke8 47. Qc8+ Ke7 48. Bg5+ f6 
49. Qc7+ Kf8 50. Bd2 Rb1 51. Qd7 fxe5 52. Kh2 Nf6 53. Qxe6 Ne4 54. Qxd5 Nxd2 55. Qc5+ Kf7 56. Qc7+ Ke6 
57. Nxd2 Rh1+ 58. Kxh1 Bh6 59. Ne4 Kf5 60. Nc3 Ke6 61. Qc6+ Kf7 62. Qb7+ Kf6 63. Nd5+ Ke6 64. Qc6+ Kf7 
65. Kg2 Bg5 66. Qb7+ Ke6 67. Nc7+ Kf5 68. Nb5 Ke6 69. Nc7+ Kf5 70. Qc6 Rh6 71. Qd5 Rh7 72. Qd3+ e4 
73. Qb5+ Kg6 74. Qe8+ Kg7 75. Qd7+ Kg6 76. Qc6+ Kf7 77. Qe6+ Kf8 78. Qe8+ Kg7 79. Nd5 Rh8 80. Qe6 Rh6 
81. Qe5+ Bf6 82. Qe8 Bg5 83. Qd7+ Kg8 84. Nc3 Bf6 85. Qe6+ Kg7 86. Nd5 Bg5 87. Qe5+ Bf6 88. Qf4 Bd4 
89. Qg5+ Rg6 90. Qf4 Rh6 91. Qxe4 Bc5 92. Qe5+ Kf7 93. Qg5 Rh8 94. Qf6+ Kg8 95. Qg6+ Kf8 96. Qf6+ Kg8 
97. Nf4 Rh7 98. Ne6 Ra7 99. Nxc5 Kh7 100. Ne6 Kg8 101. Qg6+ Kh8 102. Qxh5+ Kg8 103. Qe8+ Kh7 104. Qh5+ Kg8 
105. Qg6+ Kh8 106. Qh5+ Kg8 1/2-1/2
```

Phases: frozen 5 · cold 22 · critical 6 · hot 71 · mean T 4.81 · max T 84.35

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.44 | hot | -0.23 | 3 |
| 3 | Bf8 | 2.06 | hot | +1.53 | 3 |
| 5 | Bd7 | 1.91 | hot | +1.30 | 3 |
| 7 | h6 | 2.13 | hot | +1.48 | 3 |
| 9 | g5 | 1.85 | hot | +1.16 | 3 |
| 11 | g4 | 1.06 | hot | +0.68 | 2 |
| 13 | Qh4 | 1.36 | hot | +1.95 | 2 |
| 15 | Qh3 | 1.31 | cold | +0.56 | 3 |
| 17 | a5 | 1.02 | hot | +1.52 | 2 |
| 19 | Na6 | 1.05 | hot | +1.67 | 2 |
| 21 | Nb4 | 1.49 | hot | +1.97 | 2 |
| 23 | axb4 | 1.07 | hot | +2.50 | 2 |
| 25 | b5 | 3.02 | hot | +6.07 | 2 |
| 27 | Qxh2+ | 13.19 | hot | +16.88 | 2 |
| 29 | Rxa1 | 13.37 | hot | +31.76 | 2 |
| 31 | Ra5 | 1.57 | cold | +7.13 | 3 |
| 33 | Bxb5 | 2.05 | hot | +8.31 | 2 |
| 35 | Rxb5 | 2.00 | cold | +6.38 | 3 |
| 37 | h5 | 1.18 | hot | +6.90 | 2 |
| 39 | Rb6 | 1.04 | cold | +5.01 | 3 |
| 41 | Rxb5 | 1.03 | critical | +3.96 | 2 |
| 43 | c5 | 1.05 | hot | +3.67 | 2 |
| 45 | b3 | 1.26 | hot | +2.20 | 3 |
| 47 | cxd4 | 1.10 | hot | +3.08 | 2 |
| 49 | Rb4 | 1.12 | cold | +1.61 | 3 |
| 51 | d3 | 1.22 | hot | +1.64 | 3 |
| 53 | Bc5 | 1.79 | hot | +3.34 | 3 |
| 55 | Bd4 | 1.92 | hot | +3.37 | 3 |
| 57 | Bxb2 | 1.33 | cold | +2.49 | 3 |
| 59 | Ba3 | 1.81 | critical | +2.45 | 3 |
| 61 | Kd7 | 1.10 | hot | +1.58 | 3 |
| 63 | b2 | 1.69 | hot | +1.38 | 2 |
| 65 | b1=Q | 5.85 | hot | -1.22 | 2 |
| 67 | Rxb1 | 4.55 | critical | -1.49 | 3 |
| 69 | Be7 | 1.12 | cold | -4.65 | 3 |
| 71 | Bf8 | 1.04 | hot | -4.75 | 3 |
| 73 | Re1 | 1.00 | hot | -3.40 | 2 |
| 75 | Bg7 | 1.01 | hot | -3.58 | 2 |
| 77 | Kd8 | 6.56 | hot | +3.41 | 4 |
| 79 | Kc8 | 23.92 | hot | +13.23 | 3 |
| 81 | Kd7 | 1.21 | cold | -4.10 | 3 |
| 83 | Ke8 | 1.64 | cold | -3.94 | 3 |
| 85 | Kd7 | 5.97 | hot | +0.00 | 3 |
| 87 | Ke8 | 4.42 | hot | +0.00 | 4 |
| 89 | Ke7 | 1.30 | frozen | -3.96 | 3 |
| 91 | f6 | 1.43 | cold | -3.81 | 3 |
| 93 | Kf8 | 2.92 | critical | -1.64 | 4 |
| 95 | Rb1 | 2.15 | cold | -3.51 | 3 |
| 97 | fxe5 | 2.42 | hot | -1.94 | 2 |
| 99 | Nf6 | 1.34 | hot | -5.36 | 3 |
| 101 | Ne4 | 1.07 | hot | -4.69 | 3 |
| 103 | Nxd2 | 1.64 | critical | -5.31 | 3 |
| 105 | Kf7 | 5.88 | hot | -2.73 | 4 |
| 107 | Ke6 | 5.49 | hot | -2.83 | 4 |
| 109 | Rh1+ | 11.22 | hot | -7.60 | 3 |
| 111 | Bh6 | 1.70 | hot | +2.35 | 3 |
| 113 | Kf5 | 1.67 | cold | +3.63 | 4 |
| 115 | Ke6 | 1.63 | hot | +2.34 | 3 |
| 117 | Kf7 | 4.34 | hot | +6.06 | 4 |
| 119 | Kf6 | 4.82 | hot | +6.52 | 4 |
| 121 | Ke6 | 2.45 | hot | +4.59 | 4 |
| 123 | Kf7 | 5.85 | cold | +7.36 | 4 |
| 125 | Bg5 | 2.50 | hot | +3.10 | 3 |
| 127 | Ke6 | 3.81 | hot | +5.48 | 4 |
| 129 | Kf5 | 2.81 | hot | +4.68 | 4 |
| 131 | Ke6 | 1.52 | hot | +2.24 | 3 |
| 133 | Kf5 | 1.53 | cold | +0.00 | 4 |
| 135 | Rh6 | 1.54 | hot | +2.09 | 3 |
| 137 | Rh7 | 1.93 | hot | +2.54 | 3 |
| 139 | e4 | 1.93 | cold | +3.86 | 4 |
| 141 | Kg6 | 2.72 | hot | +4.85 | 4 |
| 143 | Kg7 | 2.66 | hot | +5.18 | 4 |
| 145 | Kg6 | 3.43 | hot | +5.39 | 4 |
| 147 | Kf7 | 4.71 | hot | +7.33 | 4 |
| 149 | Kf8 | 2.46 | hot | +5.45 | 4 |
| 151 | Kg7 | 1.00 | frozen | +0.00 | 64 |
| 153 | Rh8 | 5.25 | hot | +5.32 | 3 |
| 155 | Rh6 | 4.17 | hot | +3.57 | 3 |
| 157 | Bf6 | 3.29 | hot | +5.22 | 3 |
| 159 | Bg5 | 4.15 | hot | +4.94 | 3 |
| 161 | Kg8 | 3.44 | hot | +5.99 | 4 |
| 163 | Bf6 | 3.38 | hot | +4.05 | 3 |
| 165 | Kg7 | 5.26 | hot | +5.04 | 3 |
| 167 | Bg5 | 4.25 | hot | +0.00 | 3 |
| 169 | Bf6 | 7.14 | hot | +0.00 | 3 |
| 171 | Bd4 | 3.28 | hot | +4.04 | 3 |
| 173 | Rg6 | 1.61 | cold | +3.98 | 4 |
| 175 | Rh6 | 3.69 | hot | +0.00 | 3 |
| 177 | Bc5 | 1.94 | critical | +3.85 | 3 |
| 179 | Kf7 | 2.69 | hot | +6.88 | 4 |
| 181 | Rh8 | 1.82 | hot | +3.81 | 3 |
| 183 | Kg8 | 6.60 | hot | +9.51 | 4 |
| 185 | Kf8 | 5.06 | frozen | +8.06 | 4 |
| 187 | Kg8 | 1.46 | cold | +0.00 | 5 |
| 189 | Rh7 | 5.88 | hot | +8.92 | 4 |
| 191 | Ra7 | 2.69 | hot | +9.61 | 4 |
| 193 | Kh7 | 5.71 | hot | +13.55 | 4 |
| 195 | Kg8 | 5.81 | cold | +13.02 | 4 |
| 197 | Kh8 | 84.35 | cold | +71.79 | 5 |
| 199 | Kg8 | 49.67 | cold | +46.08 | 5 |
| 201 | Kh7 | 12.13 | frozen | +17.34 | 5 |
| 203 | Kg8 | 1.00 | frozen | +0.00 | 64 |
| 205 | Kh8 | 38.89 | cold | +38.39 | 5 |
| 207 | Kg8 | 1.94 | cold | +0.00 | 6 |

### Game 11: English (reversed Sicilian) — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "11"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "English (reversed Sicilian)"]
[Result "0-1"]
[Termination "checkmate"]

1. c4 e5 2. Nc3 Nf6 3. Nf3 d6 4. Qa4+ c6 5. d4 Nbd7 6. dxe5 dxe5 7. Be3 Bc5 8. Bxc5 Nxc5 
9. Qa3 Nce4 10. Nxe4 Nxe4 11. Qe3 Qa5+ 12. Kd1 Bf5 13. g4 Rd8+ 14. Kc1 Qb4 15. gxf5 Qxc4+ 16. Qc3 Rd1+ 
17. Kxd1 Nxc3+ 18. bxc3 O-O 19. Nd2 Qa4+ 20. Ke1 Qa3 21. Rb1 Rd8 22. Ne4 Qxa2 23. Rd1 Rd5 24. Rxd5 cxd5 
25. Nd6 Qb2 26. Kd1 e4 27. Rg1 Qb1+ 28. Kd2 Qb6 29. Ne8 Kf8 30. e3 Qb2+ 31. Kd1 g6 32. Nf6 Qxf2 
33. Nxh7+ Ke7 34. f6+ Kd8 35. Rh1 Qf3+ 36. Kc2 Qf2+ 37. Kd1 d4 38. Ng5 dxc3 39. Nxf7+ Ke8 40. Nd6+ Kd7 
41. Bb5+ Kxd6 42. Be2 Qxe3 43. Kc2 Qd2+ 44. Kb3 Qb2+ 45. Ka4 Kc5 46. f7 Qa2# 0-1
```

Phases: frozen 3 · cold 11 · critical 3 · hot 27 · mean T 3.99 · max T 37.54

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Nf3 | 1.42 | hot | -0.30 | 3 |
| 2 | Qa4+ | 1.43 | hot | +0.50 | 3 |
| 4 | d4 | 1.01 | hot | -1.07 | 2 |
| 6 | dxe5 | 1.16 | hot | -0.55 | 2 |
| 8 | Be3 | 1.07 | hot | -1.04 | 2 |
| 10 | Bxc5 | 1.14 | hot | -0.11 | 2 |
| 12 | Qa3 | 1.03 | cold | -0.79 | 2 |
| 14 | Nxe4 | 1.51 | hot | +0.13 | 2 |
| 16 | Qe3 | 1.04 | hot | -0.34 | 2 |
| 18 | Kd1 | 1.08 | hot | -0.15 | 3 |
| 20 | g4 | 1.05 | hot | -1.06 | 2 |
| 22 | Kc1 | 1.23 | cold | +0.25 | 3 |
| 24 | gxf5 | 3.10 | critical | +3.19 | 1 |
| 26 | Qc3 | 1.36 | cold | -7.39 | 4 |
| 28 | Kxd1 | 37.54 | hot | -17.76 | 3 |
| 30 | bxc3 | 4.87 | hot | -2.29 | 3 |
| 32 | Nd2 | 2.25 | hot | +0.52 | 3 |
| 34 | Ke1 | 2.63 | hot | -1.17 | 4 |
| 36 | Rb1 | 2.08 | hot | +0.07 | 3 |
| 38 | Ne4 | 2.53 | hot | -2.54 | 2 |
| 40 | Rd1 | 1.09 | critical | +0.32 | 3 |
| 42 | Rxd5 | 1.76 | hot | -0.30 | 2 |
| 44 | Nd6 | 1.84 | hot | -0.43 | 3 |
| 46 | Kd1 | 2.72 | cold | -1.26 | 3 |
| 48 | Rg1 | 2.00 | hot | -0.65 | 3 |
| 50 | Kd2 | 1.71 | frozen | -1.40 | 4 |
| 52 | Ne8 | 1.59 | hot | -0.82 | 3 |
| 54 | e3 | 4.10 | hot | -2.68 | 3 |
| 56 | Kd1 | 9.93 | hot | -6.92 | 3 |
| 58 | Nf6 | 2.08 | hot | -0.57 | 3 |
| 60 | Nxh7+ | 3.21 | hot | -1.82 | 3 |
| 62 | f6+ | 2.52 | critical | -1.12 | 3 |
| 64 | Rh1 | 3.61 | hot | -4.79 | 4 |
| 66 | Kc2 | 12.15 | hot | -20.63 | 4 |
| 68 | Kd1 | 1.72 | cold | +0.00 | 4 |
| 70 | Ng5 | 1.66 | cold | -0.30 | 3 |
| 72 | Nxf7+ | 1.60 | cold | -1.18 | 4 |
| 74 | Nd6+ | 2.09 | cold | -1.25 | 4 |
| 76 | Bb5+ | 3.91 | cold | -0.30 | 3 |
| 78 | Be2 | 7.62 | frozen | -11.71 | 4 |
| 80 | Kc2 | 2.99 | cold | -9.07 | 4 |
| 82 | Kb3 | 15.39 | cold | -25.60 | 4 |
| 84 | Ka4 | 17.93 | hot | -26.70 | 4 |
| 86 | f7 | 0.00 | frozen | -49999.00 | 4 |

### Game 12: English (reversed Sicilian) — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "12"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "English (reversed Sicilian)"]
[Result "0-1"]
[Termination "checkmate"]

1. c4 e5 2. Nc3 Nf6 3. e3 d5 4. d4 exd4 5. exd4 Qe7+ 6. Be2 dxc4 7. d5 Qb4 8. a3 Qb3 
9. Bf4 Qxb2 10. Bd2 c6 11. Bxc4 Nxd5 12. Nxd5 cxd5 13. Bb3 Qe5+ 14. Kf1 Bg4 15. Nf3 Qe4 16. Bc3 Bxf3 
17. Ba4+ Nc6 18. gxf3 Qc4+ 19. Kg2 Qxc3 20. Qxd5 Bxa3 21. Rxa3 Qxa3 22. Bxc6+ Kf8 23. Bd7 Rd8 24. h3 Qe7 
25. Re1 Qxe1 26. Qd6+ Kg8 27. Qc7 Qe7 28. Qxb7 Qxd7 29. Qb1 Qa4 30. Qe1 Re8 31. Qb1 g6 32. Qf1 Kg7 
33. Qc1 Qd4 34. Qf1 Re6 35. f4 Qd5+ 36. Kg1 Qa5 37. Qd3 Re1+ 38. Kh2 Rd8 39. Qf3 Qb4 40. Qg3 f5 
41. h4 Rd4 42. Qf3 Rxf4 43. Qd1 Rxh4+ 44. Kg2 Rxd1 45. Kf3 Qe4+ 46. Kg3 Qg4# 0-1
```

Phases: frozen 2 · cold 5 · critical 3 · hot 34 · mean T 2.45 · max T 27.01

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | d5 | 1.92 | hot | +1.14 | 3 |
| 3 | exd4 | 2.42 | hot | +2.51 | 2 |
| 5 | Qe7+ | 1.08 | hot | +0.69 | 2 |
| 7 | dxc4 | 1.12 | hot | +0.89 | 2 |
| 9 | Qb4 | 1.01 | hot | +0.42 | 2 |
| 11 | Qb3 | 1.06 | hot | +0.51 | 2 |
| 13 | Qxb2 | 2.16 | hot | -2.04 | 1 |
| 15 | c6 | 1.03 | hot | -1.06 | 2 |
| 17 | Nxd5 | 1.00 | hot | -2.02 | 1 |
| 19 | cxd5 | 1.00 | cold | -1.07 | 2 |
| 21 | Qe5+ | 1.04 | hot | -1.37 | 2 |
| 23 | Bg4 | 1.05 | hot | -1.16 | 2 |
| 25 | Qe4 | 1.11 | hot | -0.42 | 2 |
| 27 | Bxf3 | 2.33 | hot | +0.86 | 2 |
| 29 | Nc6 | 10.82 | hot | +7.24 | 2 |
| 31 | Qc4+ | 1.10 | critical | -0.37 | 2 |
| 33 | Qxc3 | 1.00 | cold | -3.10 | 2 |
| 35 | Bxa3 | 1.00 | hot | -3.03 | 2 |
| 37 | Qxa3 | 1.25 | cold | -6.67 | 3 |
| 39 | Kf8 | 3.55 | hot | -0.81 | 4 |
| 41 | Rd8 | 1.96 | hot | -3.85 | 3 |
| 43 | Qe7 | 1.60 | hot | -5.59 | 3 |
| 45 | Qxe1 | 1.73 | cold | -10.87 | 3 |
| 47 | Kg8 | 1.63 | hot | -11.63 | 4 |
| 49 | Qe7 | 4.19 | critical | -14.64 | 3 |
| 51 | Qxd7 | 1.08 | cold | -15.27 | 3 |
| 53 | Qa4 | 1.09 | hot | -15.62 | 3 |
| 55 | Re8 | 1.18 | hot | -16.05 | 3 |
| 57 | g6 | 1.16 | hot | -15.59 | 3 |
| 59 | Kg7 | 1.61 | hot | -16.27 | 3 |
| 61 | Qd4 | 1.15 | hot | -15.77 | 3 |
| 63 | Re6 | 1.91 | hot | -16.65 | 3 |
| 65 | Qd5+ | 2.11 | hot | -17.42 | 3 |
| 67 | Qa5 | 1.73 | hot | -16.71 | 3 |
| 69 | Re1+ | 1.76 | hot | -16.82 | 3 |
| 71 | Rd8 | 1.49 | hot | -16.65 | 3 |
| 73 | Qb4 | 2.18 | hot | -16.95 | 3 |
| 75 | f5 | 2.84 | hot | -17.52 | 3 |
| 77 | Rd4 | 1.69 | hot | -15.03 | 2 |
| 79 | Rxf4 | 1.36 | hot | -16.23 | 2 |
| 81 | Rxh4+ | 27.01 | hot | -42.99 | 2 |
| 83 | Rxd1 | 7.31 | critical | -34.15 | 3 |
| 85 | Qe4+ | 0.00 | frozen | -49998.50 | 4 |
| 87 | Qg4# | 0.00 | frozen | -49999.50 | 4 |
