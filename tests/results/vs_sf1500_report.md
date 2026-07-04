# Results book: thermodynamic engine vs Stockfish 1500

- Date: 2026-07-01T22:58:53.969Z
- Engine time: 1000 ms/move · Stockfish: 200 ms/move at UCI_Elo 1500
- Openings: all 6 book lines, both colors (12 games)

## Final score

**Engine 6.5 — 5.5 Stockfish**  (W 6 / D 1 / L 5)

## Summary

| # | Opening | Engine color | Result | Plies | Termination | mean T | dominant phase |
|---|---|---|---|---|---|---|---|
| 1 | Italian complex | White | 1 (1-0) | 55 | checkmate | 2.56 | hot |
| 2 | Italian complex | Black | 1 (0-1) | 90 | checkmate | 6.11 | hot |
| 3 | Queen's Gambit Declined | White | 0 (0-1) | 76 | checkmate | 2.31 | hot |
| 4 | Queen's Gambit Declined | Black | 0 (1-0) | 91 | checkmate | 3.47 | hot |
| 5 | Sicilian (Najdorf setup) | White | 0 (0-1) | 98 | checkmate | 4.92 | hot |
| 6 | Sicilian (Najdorf setup) | Black | 1 (0-1) | 80 | checkmate | 3.29 | hot |
| 7 | King's Indian | White | ½ (1/2-1/2) | 107 | threefold repetition | 7.60 | hot |
| 8 | King's Indian | Black | 0 (1-0) | 145 | checkmate | 10.75 | hot |
| 9 | French | White | 0 (0-1) | 124 | checkmate | 5.99 | hot |
| 10 | French | Black | 1 (0-1) | 74 | checkmate | 3.18 | hot |
| 11 | English (reversed Sicilian) | White | 1 (1-0) | 65 | checkmate | 3.06 | hot |
| 12 | English (reversed Sicilian) | Black | 1 (0-1) | 114 | checkmate | 6.59 | hot |

## Thermodynamics across the match

- Mean bath temperature over all engine moves: **5.58**
- Phase occupancy: frozen 7% · cold 8% · critical 6% · hot 79%
- Mean T in won games 4.49, drawn 7.60, lost 6.15

## Games

### Game 1: Italian complex — engine as White — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "1"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Italian complex"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. d4 Nf6 4. dxe5 Nh5 5. g4 f5 6. gxh5 Bb4+ 7. c3 O-O 8. Qd5+ Rf7 
9. Ng5 Qe7 10. Nxf7 Bc5 11. Nd6+ Kh8 12. Qxc5 cxd6 13. Qxd6 Qxd6 14. exd6 fxe4 15. Rg1 b5 16. Bxb5 h6 
17. Be2 Rb8 18. Nd2 Ne5 19. Nxe4 Ba6 20. Bxa6 Re8 21. Ke2 Ng6 22. hxg6 h5 23. f3 Kg8 24. Bc4+ Kf8 
25. Rg5 Rxe4+ 26. fxe4 a6 27. Rxh5 Ke8 28. Rh8# 1-0
```

Phases: frozen 2 · cold 2 · critical 3 · hot 19 · mean T 2.56 · max T 13.78

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | d4 | 1.50 | hot | -0.42 | 3 |
| 2 | dxe5 | 1.75 | hot | -1.02 | 2 |
| 4 | g4 | 1.04 | hot | +0.90 | 2 |
| 6 | gxh5 | 1.77 | hot | +1.59 | 2 |
| 8 | c3 | 1.48 | critical | +4.31 | 3 |
| 10 | Qd5+ | 7.32 | hot | +6.04 | 2 |
| 12 | Ng5 | 2.17 | critical | +7.35 | 2 |
| 14 | Nxf7 | 1.05 | hot | +10.78 | 1 |
| 16 | Nd6+ | 3.51 | hot | +11.45 | 2 |
| 18 | Qxc5 | 5.57 | hot | +12.61 | 1 |
| 20 | Qxd6 | 1.73 | hot | +11.24 | 2 |
| 22 | exd6 | 2.64 | cold | +13.80 | 3 |
| 24 | Rg1 | 1.25 | hot | +13.15 | 3 |
| 26 | Bxb5 | 1.35 | hot | +13.95 | 3 |
| 28 | Be2 | 1.32 | hot | +14.28 | 3 |
| 30 | Nd2 | 1.18 | hot | +14.03 | 3 |
| 32 | Nxe4 | 1.25 | critical | +14.91 | 3 |
| 34 | Bxa6 | 1.67 | hot | +14.74 | 3 |
| 36 | Ke2 | 1.36 | cold | +19.11 | 3 |
| 38 | hxg6 | 2.67 | hot | +21.18 | 3 |
| 40 | f3 | 4.14 | hot | +23.51 | 4 |
| 42 | Bc4+ | 2.55 | hot | +24.11 | 3 |
| 44 | Rg5 | 2.45 | hot | +23.75 | 3 |
| 46 | fxe4 | 13.78 | hot | +35.71 | 4 |
| 48 | Rxh5 | 0.00 | frozen | +49998.50 | 5 |
| 50 | Rh8# | 0.00 | frozen | +49999.50 | 5 |

### Game 2: Italian complex — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "2"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Italian complex"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. a3 Nf6 4. Nc3 d5 5. Nxd5 Nxd5 6. exd5 Qxd5 7. d3 Qa5+ 8. b4 Bxb4+ 
9. axb4 Qxa1 10. d4 Qc3+ 11. Ke2 Nxd4+ 12. Nxd4 Qc4+ 13. Ke1 Qxb4+ 14. Qd2 Qxd2+ 15. Bxd2 exd4 16. c3 dxc3 
17. Bb5+ c6 18. Bxc3 cxb5 19. f4 f6 20. Kf2 b4 21. Bd2 Bg4 22. h3 Rd8 23. Re1+ Kf7 24. Bc3 bxc3 
25. Rc1 Rd2+ 26. Kg3 Bf5 27. Rxc3 Rc8 28. Rb3 Rd3+ 29. Rxd3 Bxd3 30. Kf3 Re8 31. g4 Re2 32. g5 fxg5 
33. fxg5 g6 34. Kf4 Re4+ 35. Kf3 Ke7 36. h4 Kd6 37. h5 gxh5 38. Kg2 Rg4+ 39. Kf2 Rxg5 40. Ke3 Rg3+ 
41. Kf2 h4 42. Ke1 Rg2 43. Kd1 h3 44. Ke1 h2 45. Kd1 h1=Q# 0-1
```

Phases: frozen 3 · cold 1 · critical 5 · hot 34 · mean T 6.11 · max T 60.71

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Nf6 | 1.37 | hot | +0.16 | 3 |
| 3 | d5 | 1.02 | hot | +1.03 | 2 |
| 5 | Nxd5 | 1.45 | hot | +0.59 | 2 |
| 7 | Qxd5 | 1.23 | hot | +1.47 | 2 |
| 9 | Qa5+ | 1.13 | hot | +0.77 | 2 |
| 11 | Bxb4+ | 1.06 | critical | -0.57 | 2 |
| 13 | Qxa1 | 1.08 | cold | -3.66 | 3 |
| 15 | Qc3+ | 1.03 | hot | -3.65 | 2 |
| 17 | Nxd4+ | 1.25 | hot | -4.88 | 1 |
| 19 | Qc4+ | 2.17 | hot | -3.21 | 2 |
| 21 | Qxb4+ | 6.03 | critical | -2.42 | 2 |
| 23 | Qxd2+ | 10.77 | hot | -2.32 | 2 |
| 25 | exd4 | 1.21 | critical | -4.97 | 3 |
| 27 | dxc3 | 1.70 | hot | -6.30 | 3 |
| 29 | c6 | 2.79 | hot | -6.53 | 4 |
| 31 | cxb5 | 2.43 | hot | -7.51 | 3 |
| 33 | f6 | 1.63 | hot | -8.99 | 4 |
| 35 | b4 | 1.65 | hot | -9.36 | 3 |
| 37 | Bg4 | 2.02 | hot | -8.78 | 3 |
| 39 | Rd8 | 2.42 | hot | -8.34 | 3 |
| 41 | Kf7 | 1.74 | critical | -8.04 | 4 |
| 43 | bxc3 | 3.84 | hot | -9.21 | 2 |
| 45 | Rd2+ | 2.03 | hot | -15.06 | 3 |
| 47 | Bf5 | 3.28 | hot | -15.98 | 3 |
| 49 | Rc8 | 1.41 | hot | -14.54 | 3 |
| 51 | Rd3+ | 1.75 | hot | -14.78 | 2 |
| 53 | Bxd3 | 4.39 | critical | -16.80 | 3 |
| 55 | Re8 | 5.07 | hot | -16.71 | 4 |
| 57 | Re2 | 6.53 | hot | -17.65 | 4 |
| 59 | fxg5 | 4.20 | hot | -16.99 | 4 |
| 61 | g6 | 5.56 | hot | -17.60 | 4 |
| 63 | Re4+ | 8.13 | hot | -19.61 | 4 |
| 65 | Ke7 | 6.95 | hot | -17.93 | 4 |
| 67 | Kd6 | 6.85 | hot | -18.49 | 4 |
| 69 | gxh5 | 5.38 | hot | -18.48 | 4 |
| 71 | Rg4+ | 9.32 | hot | -21.21 | 4 |
| 73 | Rxg5 | 6.73 | hot | -19.84 | 4 |
| 75 | Rg3+ | 18.30 | hot | -31.50 | 5 |
| 77 | h4 | 55.20 | hot | -67.61 | 5 |
| 79 | Rg2 | 60.71 | hot | -74.55 | 5 |
| 81 | h3 | 0.00 | frozen | -49997.50 | 5 |
| 83 | h2 | 0.00 | frozen | -49998.50 | 6 |
| 85 | h1=Q# | 0.00 | frozen | -49999.50 | 5 |

### Game 3: Queen's Gambit Declined — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "3"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Queen's Gambit Declined"]
[Result "0-1"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. Qa4+ c6 4. cxd5 Nf6 5. dxc6 Nxc6 6. d5 Bb4+ 7. Bd2 exd5 8. Bxb4 Qb6 
9. Bc3 d4 10. Bxd4 Qxd4 11. Qxd4 Nxd4 12. Na3 Bd7 13. e3 Ne6 14. Nb5 Ke7 15. Nxa7 Rxa7 16. Bd3 b6 
17. Nf3 g5 18. Ne5 Rd8 19. Nxd7 Raxd7 20. Bb5 Rd2 21. Rc1 g4 22. g3 R8d6 23. a4 Rxb2 24. h3 Ne4 
25. hxg4 Rxf2 26. Rxh7 Rg2 27. Bf1 Ra2 28. Bc4 Rg2 29. Bf1 Rb2 30. Be2 N6g5 31. Rh8 Ne6 32. Rh7 N4g5 
33. Rh5 Rdd2 34. Bb5 Rg2 35. Bf1 Rgd2 36. Bc4 Kd6 37. Bb5 Nf3+ 38. Kf1 Rf2# 0-1
```

Phases: frozen 1 · cold 5 · critical 4 · hot 26 · mean T 2.31 · max T 4.92

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qa4+ | 1.25 | hot | -1.09 | 2 |
| 2 | cxd5 | 1.02 | hot | -0.89 | 2 |
| 4 | dxc6 | 2.93 | hot | -1.05 | 2 |
| 6 | d5 | 1.73 | hot | -1.55 | 2 |
| 8 | Bd2 | 4.43 | hot | -1.94 | 3 |
| 10 | Bxb4 | 1.00 | cold | +2.75 | 2 |
| 12 | Bc3 | 1.09 | cold | +2.59 | 2 |
| 14 | Bxd4 | 3.88 | hot | -0.66 | 2 |
| 16 | Qxd4 | 4.92 | critical | -0.66 | 2 |
| 18 | Na3 | 2.61 | hot | -1.87 | 4 |
| 20 | e3 | 1.33 | critical | +1.32 | 3 |
| 22 | Nb5 | 1.95 | hot | -0.12 | 3 |
| 24 | Nxa7 | 2.04 | hot | -0.16 | 3 |
| 26 | Bd3 | 2.46 | hot | -2.50 | 3 |
| 28 | Nf3 | 2.26 | hot | -2.29 | 3 |
| 30 | Ne5 | 1.62 | hot | -0.82 | 3 |
| 32 | Nxd7 | 3.60 | hot | -2.94 | 2 |
| 34 | Bb5 | 1.25 | critical | +1.13 | 3 |
| 36 | Rc1 | 2.34 | hot | -0.38 | 3 |
| 38 | g3 | 2.83 | hot | -0.56 | 3 |
| 40 | a4 | 2.69 | hot | -0.68 | 3 |
| 42 | h3 | 1.58 | hot | -0.53 | 3 |
| 44 | hxg4 | 2.19 | hot | -2.48 | 2 |
| 46 | Rxh7 | 1.36 | hot | +0.17 | 3 |
| 48 | Bf1 | 3.28 | hot | +0.40 | 3 |
| 50 | Bc4 | 3.92 | hot | -0.01 | 3 |
| 52 | Bf1 | 3.47 | hot | +0.00 | 3 |
| 54 | Be2 | 3.77 | hot | -1.73 | 3 |
| 56 | Rh8 | 1.97 | critical | -0.55 | 3 |
| 58 | Rh7 | 2.96 | hot | +0.00 | 3 |
| 60 | Rh5 | 1.36 | cold | +0.69 | 3 |
| 62 | Bb5 | 1.38 | cold | +0.51 | 3 |
| 64 | Bf1 | 4.02 | hot | -1.29 | 3 |
| 66 | Bc4 | 1.55 | cold | +0.36 | 3 |
| 68 | Bb5 | 1.28 | hot | +0.64 | 3 |
| 70 | Kf1 | 0.00 | frozen | -49999.00 | 5 |

### Game 4: Queen's Gambit Declined — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "4"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Queen's Gambit Declined"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. cxd5 Bb4+ 4. Bd2 Bxd2+ 5. Qxd2 Qxd5 6. e3 a5 7. h3 a4 8. Ne2 Nc6 
9. Nec3 Qg5 10. Ne4 Qh4 11. Nec3 Qg5 12. Nb5 Kd7 13. h4 Qd5 14. Rg1 Qh5 15. Rh1 g5 16. d5 gxh4 
17. dxc6+ Ke7 18. Be2 Qe5 19. Qb4+ Kf6 20. N1a3 bxc6 21. Nc3 c5 22. Qc4 Ba6 23. Qe4 Qxc3+ 24. bxc3 Bxe2 
25. Qxa8 Bg4 26. Qe4 Bf5 27. Qf4 e5 28. Qxa4 Ne7 29. Qxh4+ Ke6 30. Qc4+ Kf6 31. Qh4+ Ke6 32. Qa4 Rg8 
33. Rd1 Rxg2 34. Qc4+ Kf6 35. Qxc5 Bg4 36. Nc4 Rg1+ 37. Rxg1 Nd5 38. Rxg4 Kf5 39. Rg1 c6 40. Rxd5 cxd5 
41. Qxd5 f6 42. Nd2 h6 43. Qc6 h5 44. a3 h4 45. f3 h3 46. Qd7# 1-0
```

Phases: frozen 6 · cold 6 · critical 1 · hot 30 · mean T 3.47 · max T 22.54

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.27 | hot | +0.35 | 2 |
| 3 | Bxd2+ | 4.37 | hot | +1.46 | 2 |
| 5 | Qxd5 | 1.02 | hot | +1.41 | 2 |
| 7 | a5 | 1.77 | hot | +0.72 | 3 |
| 9 | a4 | 1.06 | hot | +1.38 | 2 |
| 11 | Nc6 | 1.16 | hot | +1.44 | 2 |
| 13 | Qg5 | 1.93 | cold | +0.78 | 3 |
| 15 | Qh4 | 1.19 | cold | -0.54 | 3 |
| 17 | Qg5 | 1.09 | hot | +0.00 | 2 |
| 19 | Kd7 | 1.12 | hot | +1.55 | 2 |
| 21 | Qd5 | 1.02 | hot | +1.38 | 2 |
| 23 | Qh5 | 1.08 | hot | +0.77 | 2 |
| 25 | g5 | 1.04 | hot | +1.07 | 2 |
| 27 | gxh4 | 4.74 | hot | +0.96 | 1 |
| 29 | Ke7 | 1.49 | cold | +3.49 | 3 |
| 31 | Qe5 | 1.74 | hot | +4.18 | 2 |
| 33 | Kf6 | 2.17 | cold | +3.90 | 3 |
| 35 | bxc6 | 1.66 | hot | +1.74 | 1 |
| 37 | c5 | 3.82 | hot | +5.93 | 2 |
| 39 | Ba6 | 3.66 | hot | +5.93 | 2 |
| 41 | Qxc3+ | 22.54 | hot | +20.05 | 2 |
| 43 | Bxe2 | 7.77 | hot | +20.99 | 2 |
| 45 | Bg4 | 4.99 | hot | +18.08 | 3 |
| 47 | Bf5 | 3.88 | hot | +14.74 | 3 |
| 49 | e5 | 4.94 | hot | +14.21 | 3 |
| 51 | Ne7 | 6.49 | hot | +18.15 | 3 |
| 53 | Ke6 | 3.02 | hot | +17.39 | 4 |
| 55 | Kf6 | 5.67 | hot | +18.29 | 3 |
| 57 | Ke6 | 9.10 | cold | +0.00 | 4 |
| 59 | Rg8 | 2.21 | hot | +15.03 | 3 |
| 61 | Rxg2 | 2.20 | hot | +14.99 | 3 |
| 63 | Kf6 | 4.91 | critical | +16.88 | 3 |
| 65 | Bg4 | 2.02 | hot | +16.66 | 2 |
| 67 | Rg1+ | 11.44 | hot | +25.43 | 2 |
| 69 | Nd5 | 12.19 | hot | +46.07 | 2 |
| 71 | Kf5 | 3.84 | cold | +28.56 | 3 |
| 73 | c6 | 3.49 | hot | +28.73 | 3 |
| 75 | cxd5 | 0.00 | frozen | +49998.00 | 4 |
| 77 | f6 | 0.00 | frozen | +49999.00 | 5 |
| 79 | h6 | 0.00 | frozen | +49999.00 | 6 |
| 81 | h5 | 0.00 | frozen | +49999.00 | 6 |
| 83 | h4 | 0.00 | frozen | +49999.00 | 6 |
| 85 | h3 | 0.00 | frozen | +49999.00 | 6 |

### Game 5: Sicilian (Najdorf setup) — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "5"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "Sicilian (Najdorf setup)"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. Bb5+ Nc6 4. Bxc6+ bxc6 5. Ng5 h6 6. Nxf7 Kxf7 7. Qf3+ Ke8 8. Qh5+ Kd7 
9. Qh3+ e6 10. Qf3 Nf6 11. e5 dxe5 12. Qd3+ Ke8 13. Qxd8+ Kxd8 14. d4 cxd4 15. f4 e4 16. c3 c5 
17. cxd4 Rb8 18. dxc5 Ke8 19. Nc3 Bxc5 20. Na4 Be7 21. Be3 Nd5 22. Bxa7 Ra8 23. Nb6 Nxb6 24. Bxb6 Ba6 
25. Bd4 Rg8 26. Rc1 Rf8 27. Bxg7 Rxf4 28. Bxh6 Bb4+ 29. Kd1 Rf5 30. a3 Rd8+ 31. Kc2 Be7 32. g4 Rf2+ 
33. Kb1 Bd3+ 34. Ka1 Bf6 35. Be3 Rxb2 36. Bg5 Be5 37. Bf6 Bxf6 38. g5 Rb1+ 39. Ka2 Bh8 40. Rxb1 Bc4+ 
41. Rb3 Rd2+ 42. Kb1 Bxb3 43. Re1 e3 44. Kc1 Rc2+ 45. Kb1 Rd2 46. Kc1 Bc3 47. Rg1 e2 48. h3 Rd1+ 
49. Rxd1 exd1=R# 0-1
```

Phases: frozen 8 · cold 4 · critical 3 · hot 32 · mean T 4.92 · max T 55.08

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.59 | hot | +0.94 | 3 |
| 2 | Bxc6+ | 1.65 | hot | -0.19 | 3 |
| 4 | Ng5 | 1.66 | hot | -2.61 | 3 |
| 6 | Nxf7 | 1.93 | hot | -1.59 | 3 |
| 8 | Qf3+ | 1.68 | hot | -2.20 | 3 |
| 10 | Qh5+ | 1.65 | hot | -2.01 | 3 |
| 12 | Qh3+ | 1.38 | hot | -2.32 | 3 |
| 14 | Qf3 | 1.69 | hot | -4.06 | 3 |
| 16 | e5 | 1.63 | hot | -3.41 | 3 |
| 18 | Qd3+ | 1.44 | hot | -3.57 | 3 |
| 20 | Qxd8+ | 3.45 | hot | -2.16 | 3 |
| 22 | d4 | 1.71 | hot | -5.20 | 3 |
| 24 | f4 | 1.84 | hot | -6.09 | 3 |
| 26 | c3 | 1.87 | hot | -6.11 | 3 |
| 28 | cxd4 | 1.78 | hot | -5.80 | 3 |
| 30 | dxc5 | 6.28 | hot | -8.21 | 3 |
| 32 | Nc3 | 4.40 | hot | -6.40 | 3 |
| 34 | Na4 | 1.72 | hot | -4.31 | 3 |
| 36 | Be3 | 2.15 | hot | -5.25 | 3 |
| 38 | Bxa7 | 1.40 | critical | -4.08 | 3 |
| 40 | Nb6 | 1.75 | hot | -4.36 | 3 |
| 42 | Bxb6 | 1.63 | cold | -5.52 | 4 |
| 44 | Bd4 | 1.60 | hot | -3.90 | 3 |
| 46 | Rc1 | 1.58 | hot | -4.23 | 3 |
| 48 | Bxg7 | 1.29 | hot | -2.91 | 3 |
| 50 | Bxh6 | 1.21 | hot | -2.86 | 3 |
| 52 | Kd1 | 1.78 | critical | -4.47 | 4 |
| 54 | a3 | 1.73 | hot | -3.11 | 3 |
| 56 | Kc2 | 1.59 | cold | -4.55 | 4 |
| 58 | g4 | 1.83 | hot | -2.89 | 3 |
| 60 | Kb1 | 2.11 | hot | -3.80 | 3 |
| 62 | Ka1 | 2.51 | hot | -5.19 | 4 |
| 64 | Be3 | 4.76 | hot | -5.39 | 3 |
| 66 | Bg5 | 1.31 | cold | -4.07 | 3 |
| 68 | Bf6 | 22.05 | cold | -19.44 | 3 |
| 70 | g5 | 8.05 | critical | -15.01 | 4 |
| 72 | Ka2 | 4.19 | frozen | -12.42 | 4 |
| 74 | Rxb1 | 11.15 | hot | -9.11 | 3 |
| 76 | Rb3 | 36.93 | frozen | -37.47 | 4 |
| 78 | Kb1 | 55.08 | frozen | -65.63 | 4 |
| 80 | Re1 | 6.68 | hot | -14.97 | 4 |
| 82 | Kc1 | 5.60 | frozen | -13.32 | 4 |
| 84 | Kb1 | 0.00 | frozen | -49998.00 | 5 |
| 86 | Kc1 | 5.40 | frozen | +0.00 | 4 |
| 88 | Rg1 | 6.33 | hot | -15.25 | 4 |
| 90 | h3 | 0.00 | frozen | -49998.00 | 4 |
| 92 | Rxd1 | 0.00 | frozen | -49999.00 | 6 |

### Game 6: Sicilian (Najdorf setup) — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "6"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "Sicilian (Najdorf setup)"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. Be2 Nf6 4. Nc3 d5 5. Bb5+ Bd7 6. e5 Bxb5 7. a3 Bc4 8. exf6 exf6 
9. d4 Qe7+ 10. Be3 cxd4 11. Nxd4 Qe5 12. Nf3 Qe6 13. Nd4 Qb6 14. Rb1 Bc5 15. Qg4 Nc6 16. Nce2 Nxd4 
17. Nxd4 Qa5+ 18. Bd2 Qb6 19. Nf5 Bxf2+ 20. Kd1 g6 21. Ng7+ Kf8 22. Qf3 Kxg7 23. b4 Ba2 24. Ra1 Bc4 
25. a4 Qd4 26. Qa3 Be3 27. Qc3 Qg4+ 28. Kc1 Bd4 29. Bh6+ Kxh6 30. h3 Qg5+ 31. Kb2 Bxc3+ 32. Kb1 Qxg2 
33. Rc1 Bxa1 34. Kxa1 Qxh3 35. Kb1 Rhe8 36. a5 Qh2 37. b5 Bxb5 38. c4 Bxc4 39. Rxc4 dxc4 40. Kc1 Re1# 0-1
```

Phases: frozen 2 · cold 3 · critical 2 · hot 31 · mean T 3.29 · max T 18.17

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Nf6 | 1.48 | hot | +0.33 | 3 |
| 3 | d5 | 1.55 | hot | +0.52 | 3 |
| 5 | Bd7 | 1.30 | hot | +0.65 | 3 |
| 7 | Bxb5 | 2.23 | hot | +0.58 | 2 |
| 9 | Bc4 | 4.60 | hot | +2.53 | 2 |
| 11 | exf6 | 1.01 | hot | -1.41 | 2 |
| 13 | Qe7+ | 1.03 | hot | -2.15 | 2 |
| 15 | cxd4 | 2.31 | hot | -1.18 | 2 |
| 17 | Qe5 | 1.05 | hot | -1.06 | 2 |
| 19 | Qe6 | 1.03 | cold | -1.12 | 2 |
| 21 | Qb6 | 1.02 | hot | -1.43 | 2 |
| 23 | Bc5 | 1.00 | hot | -1.33 | 2 |
| 25 | Nc6 | 1.45 | hot | -0.89 | 2 |
| 27 | Nxd4 | 1.73 | hot | -2.08 | 2 |
| 29 | Qa5+ | 1.33 | hot | -1.73 | 2 |
| 31 | Qb6 | 2.85 | cold | +0.81 | 2 |
| 33 | Bxf2+ | 1.22 | critical | -3.74 | 2 |
| 35 | g6 | 1.84 | hot | -1.95 | 2 |
| 37 | Kf8 | 1.42 | hot | -4.60 | 3 |
| 39 | Kxg7 | 1.41 | hot | -5.73 | 3 |
| 41 | Ba2 | 1.03 | hot | -5.88 | 2 |
| 43 | Bc4 | 1.27 | critical | -6.06 | 3 |
| 45 | Qd4 | 1.02 | hot | -5.60 | 2 |
| 47 | Be3 | 1.76 | hot | -8.52 | 3 |
| 49 | Qg4+ | 2.55 | hot | -7.40 | 2 |
| 51 | Bd4 | 1.68 | cold | -10.05 | 2 |
| 53 | Kxh6 | 1.67 | hot | -11.06 | 4 |
| 55 | Qg5+ | 18.17 | hot | -12.68 | 2 |
| 57 | Bxc3+ | 18.14 | hot | -31.80 | 3 |
| 59 | Qxg2 | 13.30 | hot | -36.70 | 3 |
| 61 | Bxa1 | 14.49 | hot | -37.07 | 3 |
| 63 | Qxh3 | 3.14 | hot | -29.38 | 3 |
| 65 | Rhe8 | 3.26 | hot | -29.69 | 3 |
| 67 | Qh2 | 3.61 | hot | -29.94 | 3 |
| 69 | Bxb5 | 3.69 | hot | -30.07 | 3 |
| 71 | Bxc4 | 3.52 | hot | -31.56 | 3 |
| 73 | dxc4 | 0.00 | frozen | -49998.50 | 4 |
| 75 | Re1# | 0.00 | frozen | -49999.50 | 4 |

### Game 7: King's Indian — engine as White — 1/2-1/2

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "7"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "King's Indian"]
[Result "1/2-1/2"]
[Termination "threefold repetition"]

1. d4 Nf6 2. c4 g6 3. Qd3 d6 4. Qf3 c5 5. dxc5 dxc5 6. Qa3 Bf5 7. Qa4+ Qd7 8. Qxd7+ Bxd7 
9. Be3 Nc6 10. Bxc5 Bf5 11. g4 Bxg4 12. f3 Bf5 13. e4 Nd7 14. exf5 Nxc5 15. fxg6 f5 16. g7 Bxg7 
17. Nc3 Rd8 18. Bh3 Nd3+ 19. Ke2 Nxb2 20. Rb1 Bxc3 21. Rc1 Bd4 22. Bxf5 Bc5 23. Be4 Rd6 24. Rb1 Bd4 
25. c5 Rd8 26. Bxc6+ bxc6 27. Nh3 Rg8 28. Nf4 Rg5 29. h4 Rxc5 30. Rhc1 Rf5 31. Nd3 Rb5 32. Rxc6 Rdb8 
33. Nxb2 Bxb2 34. a4 Rb4 35. Rxb2 Rxb2+ 36. Kd3 R2b7 37. Rc5 Rb3+ 38. Ke2 R8b6 39. Rc8+ Kf7 40. a5 Rd6 
41. Rc7 a6 42. Rc1 Ke8 43. Rc8+ Rd8 44. Rxd8+ Kxd8 45. h5 Kd7 46. Kd2 Ke6 47. Kc2 Rb8 48. f4 h6 
49. f5+ Kxf5 50. Kd3 Ra8 51. Ke3 Rb8 52. Kd3 Rb5 53. Kd2 Rb8 54. Kd3 1/2-1/2
```

Phases: frozen 0 · cold 2 · critical 0 · hot 50 · mean T 7.60 · max T 116.46

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qd3 | 1.16 | hot | +0.19 | 3 |
| 2 | Qf3 | 1.76 | hot | -0.70 | 3 |
| 4 | dxc5 | 1.36 | hot | -1.23 | 2 |
| 6 | Qa3 | 1.39 | hot | -0.43 | 3 |
| 8 | Qa4+ | 1.29 | hot | +0.27 | 3 |
| 10 | Qxd7+ | 5.52 | hot | +2.65 | 3 |
| 12 | Be3 | 1.48 | hot | -0.37 | 3 |
| 14 | Bxc5 | 1.34 | hot | -0.46 | 3 |
| 16 | g4 | 1.88 | hot | +0.24 | 3 |
| 18 | f3 | 1.32 | hot | +0.16 | 3 |
| 20 | e4 | 1.52 | hot | +0.10 | 3 |
| 22 | exf5 | 2.90 | hot | -1.46 | 2 |
| 24 | fxg6 | 4.84 | hot | -3.07 | 3 |
| 26 | g7 | 5.01 | hot | +1.71 | 3 |
| 28 | Nc3 | 5.58 | hot | -3.79 | 3 |
| 30 | Bh3 | 2.45 | hot | -1.31 | 3 |
| 32 | Ke2 | 6.49 | hot | -4.59 | 3 |
| 34 | Rb1 | 2.65 | hot | -3.61 | 3 |
| 36 | Rc1 | 1.81 | hot | -4.44 | 3 |
| 38 | Bxf5 | 1.71 | hot | -3.83 | 3 |
| 40 | Be4 | 2.42 | hot | -4.17 | 3 |
| 42 | Rb1 | 1.66 | hot | -2.98 | 3 |
| 44 | c5 | 1.50 | hot | -2.44 | 3 |
| 46 | Bxc6+ | 1.76 | hot | -3.42 | 3 |
| 48 | Nh3 | 2.02 | hot | -5.70 | 3 |
| 50 | Nf4 | 2.15 | hot | -5.70 | 3 |
| 52 | h4 | 2.41 | hot | -5.37 | 3 |
| 54 | Rhc1 | 1.81 | hot | -5.96 | 3 |
| 56 | Nd3 | 1.49 | hot | -6.45 | 3 |
| 58 | Rxc6 | 2.39 | hot | -5.41 | 3 |
| 60 | Nxb2 | 1.77 | hot | -4.81 | 3 |
| 62 | a4 | 1.39 | hot | -4.55 | 3 |
| 64 | Rxb2 | 2.87 | hot | -5.77 | 3 |
| 66 | Kd3 | 3.30 | hot | -10.35 | 4 |
| 68 | Rc5 | 1.40 | hot | -8.69 | 4 |
| 70 | Ke2 | 1.59 | hot | -9.20 | 4 |
| 72 | Rc8+ | 1.59 | hot | -6.35 | 3 |
| 74 | a5 | 1.74 | hot | -7.72 | 3 |
| 76 | Rc7 | 2.17 | hot | -8.31 | 3 |
| 78 | Rc1 | 4.42 | hot | -11.68 | 4 |
| 80 | Rc8+ | 2.02 | hot | -8.38 | 4 |
| 82 | Rxd8+ | 3.85 | hot | -9.67 | 4 |
| 84 | h5 | 7.40 | hot | -12.78 | 5 |
| 86 | Kd2 | 11.72 | hot | -15.96 | 5 |
| 88 | Kc2 | 5.36 | hot | -11.22 | 5 |
| 90 | f4 | 10.63 | hot | -14.85 | 5 |
| 92 | f5+ | 26.00 | hot | -28.67 | 6 |
| 94 | Kd3 | 88.82 | hot | -75.53 | 6 |
| 96 | Ke3 | 25.05 | hot | -29.22 | 6 |
| 98 | Kd3 | 1.25 | cold | +0.00 | 7 |
| 100 | Kd2 | 116.46 | hot | -100.53 | 6 |
| 102 | Kd3 | 1.26 | cold | +0.00 | 7 |

### Game 8: King's Indian — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "8"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "King's Indian"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. h4 dxc4 5. e4 Bg4 6. Nf3 Bxf3 7. gxf3 Nc6 8. e5 Qxd4 
9. exf6 Qxd1+ 10. Kxd1 Rd8+ 11. Ke1 Ne5 12. Be3 Nxf3+ 13. Ke2 Nd4+ 14. Kd1 Nb3+ 15. Kc2 Nxa1+ 16. Kb1 Rd1+ 
17. Nxd1 Nb3 18. Bxc4 Nd2+ 19. Bxd2 exf6 20. a3 b5 21. Ba2 Bd6 22. Kc2 b4 23. axb4 c5 24. b5 a6 
25. bxa6 Ke7 26. Kc1 Ra8 27. Re1+ Be5 28. Be3 Rxa6 29. Bxc5+ Kd7 30. Bb3 Ra1+ 31. Kd2 Kc6 32. Be3 Ra8 
33. Nc3 Rd8+ 34. Kc2 Bxc3 35. bxc3 Kb5 36. Bxf7 Rf8 37. Rb1+ Kc6 38. Bc4 Ra8 39. Rb6+ Kc7 40. Re6 Ra4 
41. Bf4+ Kd7 42. Kb3 Rxc4 43. Rd6+ Ke7 44. Rd4 Rxd4 45. cxd4 g5 46. Bc7 Kd7 47. Bg3 gxh4 48. Bxh4 Ke6 
49. Kc3 Kf7 50. d5 Ke7 51. Kb3 Kf7 52. Kc3 Ke7 53. f3 Kd6 54. Kd4 Ke7 55. f4 Kf7 56. Kc5 Ke7 
57. f5 Kf7 58. d6 Ke8 59. Bxf6 Kf7 60. Ba1 Ke8 61. Bb2 Kd7 62. Bf6 Ke8 63. Kd5 Kf7 64. Ba1 Ke8 
65. Kc6 Kf7 66. d7 Ke7 67. Kc7 Kf7 68. d8=Q h6 69. Kd7 h5 70. Bh8 h4 71. Bb2 h3 72. Be5 h2 
73. Qe8# 1-0
```

Phases: frozen 6 · cold 4 · critical 3 · hot 57 · mean T 10.75 · max T 283.86

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | d5 | 1.77 | hot | +0.72 | 3 |
| 3 | dxc4 | 1.02 | hot | +0.61 | 2 |
| 5 | Bg4 | 1.78 | hot | +0.67 | 2 |
| 7 | Bxf3 | 2.52 | hot | +1.58 | 2 |
| 9 | Nc6 | 2.33 | hot | +4.22 | 2 |
| 11 | Qxd4 | 2.03 | hot | +2.81 | 2 |
| 13 | Qxd1+ | 1.68 | hot | +3.05 | 2 |
| 15 | Rd8+ | 1.61 | hot | +3.41 | 2 |
| 17 | Ne5 | 1.51 | hot | +3.68 | 2 |
| 19 | Nxf3+ | 1.22 | critical | +1.39 | 2 |
| 21 | Nd4+ | 3.04 | hot | -0.39 | 3 |
| 23 | Nb3+ | 14.68 | hot | +8.74 | 2 |
| 25 | Nxa1+ | 1.64 | cold | -4.58 | 3 |
| 27 | Rd1+ | 6.88 | hot | +2.90 | 2 |
| 29 | Nb3 | 11.47 | hot | +8.86 | 3 |
| 31 | Nd2+ | 2.46 | hot | +2.78 | 3 |
| 33 | exf6 | 2.10 | hot | +6.00 | 3 |
| 35 | b5 | 2.33 | hot | +5.36 | 3 |
| 37 | Bd6 | 1.93 | hot | +5.31 | 3 |
| 39 | b4 | 1.87 | hot | +5.17 | 3 |
| 41 | c5 | 1.74 | hot | +5.96 | 3 |
| 43 | a6 | 2.06 | hot | +6.45 | 3 |
| 45 | Ke7 | 2.33 | hot | +7.70 | 3 |
| 47 | Ra8 | 1.52 | hot | +6.42 | 3 |
| 49 | Be5 | 1.43 | hot | +6.67 | 3 |
| 51 | Rxa6 | 1.70 | hot | +6.99 | 2 |
| 53 | Kd7 | 1.31 | hot | +7.25 | 4 |
| 55 | Ra1+ | 1.20 | hot | +5.47 | 3 |
| 57 | Kc6 | 1.33 | hot | +6.18 | 3 |
| 59 | Ra8 | 2.40 | hot | +7.23 | 3 |
| 61 | Rd8+ | 1.88 | critical | +6.04 | 3 |
| 63 | Bxc3 | 3.32 | hot | +7.68 | 3 |
| 65 | Kb5 | 3.43 | hot | +10.40 | 3 |
| 67 | Rf8 | 1.50 | hot | +9.00 | 3 |
| 69 | Kc6 | 3.20 | cold | +11.52 | 5 |
| 71 | Ra8 | 6.10 | hot | +14.92 | 4 |
| 73 | Kc7 | 9.18 | hot | +18.87 | 4 |
| 75 | Ra4 | 3.19 | hot | +10.28 | 3 |
| 77 | Kd7 | 3.10 | hot | +10.92 | 5 |
| 79 | Rxc4 | 6.64 | hot | +13.76 | 4 |
| 81 | Ke7 | 43.23 | hot | +55.40 | 4 |
| 83 | Rxd4 | 4.73 | critical | +7.38 | 4 |
| 85 | g5 | 3.75 | hot | +6.55 | 5 |
| 87 | Kd7 | 1.72 | hot | +4.63 | 5 |
| 89 | gxh4 | 1.56 | hot | +4.22 | 5 |
| 91 | Ke6 | 1.24 | hot | +5.35 | 5 |
| 93 | Kf7 | 1.53 | hot | +5.33 | 5 |
| 95 | Ke7 | 2.26 | hot | +6.06 | 5 |
| 97 | Kf7 | 1.94 | hot | +5.76 | 5 |
| 99 | Ke7 | 2.27 | cold | +0.00 | 5 |
| 101 | Kd6 | 2.16 | hot | +6.08 | 5 |
| 103 | Ke7 | 2.24 | hot | +7.51 | 6 |
| 105 | Kf7 | 2.21 | hot | +7.65 | 6 |
| 107 | Ke7 | 4.27 | hot | +8.88 | 6 |
| 109 | Kf7 | 5.15 | hot | +10.14 | 6 |
| 111 | Ke8 | 19.20 | hot | +20.74 | 6 |
| 113 | Kf7 | 27.63 | hot | +28.13 | 6 |
| 115 | Ke8 | 26.92 | hot | +26.98 | 6 |
| 117 | Kd7 | 31.14 | hot | +29.78 | 6 |
| 119 | Ke8 | 41.20 | hot | +37.74 | 6 |
| 121 | Kf7 | 23.19 | hot | +25.27 | 6 |
| 123 | Ke8 | 27.46 | hot | +27.86 | 6 |
| 125 | Kf7 | 67.00 | hot | +56.30 | 6 |
| 127 | Ke7 | 283.86 | cold | +223.56 | 6 |
| 129 | Kf7 | 0.00 | frozen | +49997.00 | 7 |
| 131 | h6 | 0.00 | frozen | +49998.00 | 7 |
| 133 | h5 | 0.00 | frozen | +49999.00 | 8 |
| 135 | h4 | 0.00 | frozen | +49999.00 | 8 |
| 137 | h3 | 0.00 | frozen | +49999.00 | 7 |
| 139 | h2 | 0.00 | frozen | +49999.00 | 6 |

### Game 9: French — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "9"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "French"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e6 2. d4 d5 3. Bb5+ c6 4. Bd3 dxe4 5. Bxe4 g6 6. Qd3 Bg7 7. Nf3 Ne7 8. Ne5 Nd7 
9. Ng4 Qc7 10. Bh6 Kf8 11. Bxg7+ Kxg7 12. Qg3 Qb6 13. Qd6 h5 14. Qxe7 hxg4 15. Bxg6 Qa5+ 16. b4 Qd5 
17. Qxf7+ Kh6 18. h3 Qxg2 19. Rf1 gxh3 20. Bd3 Qg7 21. Qxg7+ Kxg7 22. Rg1+ Kf8 23. Be4 Nf6 24. Bf3 a5 
25. Rg6 Kf7 26. Rxf6+ Kxf6 27. bxa5 e5 28. dxe5+ Ke7 29. Nc3 Rxa5 30. Nd5+ Kd8 31. Nb6 Kc7 32. Na8+ Kb8 
33. Nb6 Be6 34. Nd7+ Ka8 35. Nb6+ Ka7 36. Nc8+ Ka8 37. Nb6+ Kb8 38. Nd7+ Ka7 39. a4 h2 40. Kd2 Rd8 
41. Bxc6 bxc6 42. Rh1 Rd5+ 43. Ke3 Rh8 44. Nf6 Ra5 45. Kd4 Ka8 46. c4 Bf5 47. e6 Ra7 48. e7 Rxe7 
49. Kc5 Rh3 50. Ng8 Rb7 51. Nf6 Rb1 52. Rxb1 Bxb1 53. f3 Rh8 54. Kxc6 h1=Q 55. Kc7 Qh6 56. Nd7 Bf5 
57. Nb6+ Ka7 58. a5 Qf6 59. c5 Rh7+ 60. Nd7 Qe6 61. c6 Rxd7+ 62. Kc8 Qe8# 0-1
```

Phases: frozen 4 · cold 5 · critical 2 · hot 49 · mean T 5.99 · max T 45.84

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.27 | hot | -0.86 | 2 |
| 2 | Bd3 | 2.05 | hot | -1.72 | 3 |
| 4 | Bxe4 | 1.93 | hot | -1.30 | 3 |
| 6 | Qd3 | 1.02 | hot | -1.60 | 2 |
| 8 | Nf3 | 1.69 | hot | -2.59 | 2 |
| 10 | Ne5 | 1.07 | hot | -1.44 | 2 |
| 12 | Ng4 | 1.88 | hot | +0.21 | 1 |
| 14 | Bh6 | 1.04 | hot | -0.88 | 2 |
| 16 | Bxg7+ | 1.20 | hot | +0.09 | 2 |
| 18 | Qg3 | 1.01 | hot | -0.84 | 2 |
| 20 | Qd6 | 2.33 | hot | -3.00 | 2 |
| 22 | Qxe7 | 3.91 | hot | -3.47 | 2 |
| 24 | Bxg6 | 2.96 | hot | -4.19 | 2 |
| 26 | b4 | 1.45 | cold | +1.62 | 3 |
| 28 | Qxf7+ | 1.03 | cold | +1.96 | 2 |
| 30 | h3 | 2.05 | hot | -0.01 | 2 |
| 32 | Rf1 | 2.76 | hot | -1.43 | 3 |
| 34 | Bd3 | 1.06 | cold | -0.21 | 3 |
| 36 | Qxg7+ | 4.86 | critical | +3.59 | 3 |
| 38 | Rg1+ | 1.64 | hot | +1.06 | 3 |
| 40 | Be4 | 1.39 | hot | -0.31 | 3 |
| 42 | Bf3 | 1.51 | critical | -0.66 | 3 |
| 44 | Rg6 | 2.19 | hot | -0.89 | 3 |
| 46 | Rxf6+ | 3.91 | hot | -1.69 | 3 |
| 48 | bxa5 | 3.29 | hot | -6.39 | 3 |
| 50 | dxe5+ | 3.63 | hot | -3.04 | 3 |
| 52 | Nc3 | 4.77 | hot | -5.90 | 3 |
| 54 | Nd5+ | 4.37 | hot | -4.53 | 3 |
| 56 | Nb6 | 3.35 | hot | -5.21 | 3 |
| 58 | Na8+ | 7.52 | hot | -10.33 | 2 |
| 60 | Nb6 | 4.05 | hot | -5.78 | 3 |
| 62 | Nd7+ | 4.00 | hot | -4.50 | 3 |
| 64 | Nb6+ | 1.58 | hot | -3.93 | 3 |
| 66 | Nc8+ | 9.53 | hot | -2.79 | 3 |
| 68 | Nb6+ | 5.05 | hot | +0.00 | 3 |
| 70 | Nd7+ | 8.40 | hot | +0.00 | 3 |
| 72 | a4 | 4.49 | hot | -7.56 | 3 |
| 74 | Kd2 | 6.99 | hot | -15.75 | 2 |
| 76 | Bxc6 | 7.82 | hot | -16.44 | 2 |
| 78 | Rh1 | 14.10 | hot | -17.32 | 3 |
| 80 | Ke3 | 10.30 | hot | -14.15 | 3 |
| 82 | Nf6 | 5.05 | hot | -9.97 | 3 |
| 84 | Kd4 | 5.12 | hot | -10.83 | 3 |
| 86 | c4 | 4.64 | hot | -10.10 | 3 |
| 88 | e6 | 4.48 | hot | -10.19 | 3 |
| 90 | e7 | 2.26 | hot | -7.32 | 3 |
| 92 | Kc5 | 1.98 | hot | -9.09 | 3 |
| 94 | Ng8 | 1.67 | hot | -8.57 | 3 |
| 96 | Nf6 | 1.98 | hot | -8.89 | 3 |
| 98 | Rxb1 | 33.95 | hot | -21.49 | 3 |
| 100 | f3 | 44.79 | hot | -37.44 | 3 |
| 102 | Kxc6 | 45.84 | hot | -40.85 | 3 |
| 104 | Kc7 | 7.64 | hot | -22.94 | 3 |
| 106 | Nd7 | 5.96 | hot | -23.30 | 4 |
| 108 | Nb6+ | 8.62 | frozen | -22.27 | 5 |
| 110 | a5 | 15.42 | cold | -31.13 | 4 |
| 112 | c5 | 19.55 | cold | -35.17 | 4 |
| 114 | Nd7 | 0.00 | frozen | -49998.00 | 6 |
| 116 | c6 | 0.00 | frozen | -49998.00 | 5 |
| 118 | Kc8 | 0.00 | frozen | -49999.00 | 6 |

### Game 10: French — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "10"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "French"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e6 2. d4 d5 3. Bd3 dxe4 4. Bc4 Bb4+ 5. Bd2 Qxd4 6. Bb5+ c6 7. Bf1 Qxb2 8. c3 Bc5 
9. Bc4 Qxa1 10. Qb3 b5 11. Bxb5 cxb5 12. Ne2 e3 13. O-O exd2 14. Qc2 d1=Q 15. Rxd1 Bxf2+ 16. Kh1 Nc6 
17. Nf4 e5 18. Qxf2 exf4 19. Qe1+ Nge7 20. Qe2 Bf5 21. c4 Bxb1 22. Qe1 Qxa2 23. cxb5 Bc2 24. Ra1 Qxa1 
25. Qxa1 Kd7 26. Qc3 Nd4 27. Qxd4+ Ke6 28. Qb4 Nd5 29. Qc4 Rhc8 30. Qe2+ Ne3 31. h3 Be4 32. Qd2 Bxg2+ 
33. Qxg2 Nxg2 34. b6 axb6 35. Kg1 Ra2 36. h4 Nxh4 37. Kf1 Rc1# 0-1
```

Phases: frozen 2 · cold 3 · critical 4 · hot 26 · mean T 3.18 · max T 16.98

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | dxe4 | 1.03 | hot | +0.30 | 2 |
| 3 | Bb4+ | 1.02 | hot | -0.27 | 2 |
| 5 | Qxd4 | 1.16 | critical | -1.31 | 2 |
| 7 | c6 | 1.03 | hot | -1.90 | 2 |
| 9 | Qxb2 | 1.13 | cold | -4.41 | 2 |
| 11 | Bc5 | 8.24 | hot | +3.50 | 2 |
| 13 | Qxa1 | 1.00 | cold | -8.51 | 2 |
| 15 | b5 | 1.01 | hot | -9.65 | 2 |
| 17 | cxb5 | 2.64 | hot | -12.38 | 1 |
| 19 | e3 | 1.50 | hot | -11.53 | 2 |
| 21 | exd2 | 2.55 | hot | -14.25 | 2 |
| 23 | d1=Q | 4.11 | hot | -16.05 | 2 |
| 25 | Bxf2+ | 3.32 | hot | -14.68 | 3 |
| 27 | Nc6 | 3.42 | hot | -15.04 | 3 |
| 29 | e5 | 1.96 | hot | -15.82 | 3 |
| 31 | exf4 | 1.00 | critical | -14.59 | 2 |
| 33 | Nge7 | 1.19 | hot | -15.82 | 3 |
| 35 | Bf5 | 1.02 | hot | -15.36 | 2 |
| 37 | Bxb1 | 1.53 | hot | -16.63 | 2 |
| 39 | Qxa2 | 8.44 | hot | -8.98 | 2 |
| 41 | Bc2 | 1.83 | hot | -17.86 | 3 |
| 43 | Qxa1 | 5.21 | critical | -19.46 | 3 |
| 45 | Kd7 | 3.39 | hot | -10.18 | 2 |
| 47 | Nd4 | 6.09 | hot | -7.29 | 2 |
| 49 | Ke6 | 2.89 | hot | -8.66 | 4 |
| 51 | Nd5 | 1.75 | critical | -12.05 | 3 |
| 53 | Rhc8 | 1.43 | cold | -12.58 | 3 |
| 55 | Ne3 | 1.29 | hot | -12.45 | 3 |
| 57 | Be4 | 1.44 | hot | -11.36 | 2 |
| 59 | Bxg2+ | 1.27 | hot | -12.86 | 2 |
| 61 | Nxg2 | 12.68 | hot | -25.99 | 3 |
| 63 | axb6 | 6.60 | hot | -25.50 | 4 |
| 65 | Ra2 | 16.98 | hot | -34.96 | 4 |
| 67 | Nxh4 | 0.00 | frozen | -49998.50 | 4 |
| 69 | Rc1# | 0.00 | frozen | -49999.50 | 5 |

### Game 11: English (reversed Sicilian) — engine as White — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "11"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1500)"]
[Opening "English (reversed Sicilian)"]
[Result "1-0"]
[Termination "checkmate"]

1. c4 e5 2. Nc3 Nf6 3. Nf3 e4 4. Ng5 Nc6 5. Ncxe4 d5 6. Nxf6+ gxf6 7. Nxf7 Kxf7 8. cxd5 Nd4 
9. Qa4 Qxd5 10. e3 Bg4 11. Qxd4 Rd8 12. Bc4 Be6 13. Bxd5 Kg7 14. Bxe6 Rxd4 15. exd4 h5 16. Ke2 Bd6 
17. Bd5 c6 18. Bf3 Kg6 19. Be4+ Kh6 20. d3+ Kg7 21. Bd2 Rf8 22. g3 Re8 23. Bf4 f5 24. Bxd6 h4 
25. Be5+ Kf7 26. Bxf5 b6 27. gxh4 b5 28. Rhg1 c5 29. Rg7+ Kf8 30. Rag1 c4 31. dxc4 bxc4 32. Rg8+ Kf7 
33. R1g7# 1-0
```

Phases: frozen 1 · cold 2 · critical 4 · hot 24 · mean T 3.06 · max T 22.17

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Nf3 | 1.42 | hot | -0.30 | 3 |
| 2 | Ng5 | 1.37 | hot | -0.40 | 3 |
| 4 | Ncxe4 | 1.02 | hot | -0.63 | 2 |
| 6 | Nxf6+ | 5.35 | hot | -2.14 | 2 |
| 8 | Nxf7 | 5.62 | hot | +1.94 | 3 |
| 10 | cxd5 | 2.12 | hot | -1.29 | 3 |
| 12 | Qa4 | 2.68 | hot | -0.94 | 3 |
| 14 | e3 | 1.44 | critical | -0.79 | 3 |
| 16 | Qxd4 | 1.84 | critical | +1.53 | 3 |
| 18 | Bc4 | 1.02 | cold | +8.53 | 2 |
| 20 | Bxd5 | 11.15 | hot | +8.94 | 1 |
| 22 | Bxe6 | 6.31 | hot | +11.37 | 2 |
| 24 | exd4 | 1.11 | cold | +13.76 | 3 |
| 26 | Ke2 | 1.05 | hot | +13.79 | 3 |
| 28 | Bd5 | 1.45 | hot | +13.03 | 3 |
| 30 | Bf3 | 1.57 | critical | +12.58 | 3 |
| 32 | Be4+ | 1.46 | hot | +13.76 | 3 |
| 34 | d3+ | 1.89 | hot | +14.91 | 3 |
| 36 | Bd2 | 1.17 | hot | +13.42 | 3 |
| 38 | g3 | 1.31 | hot | +13.28 | 3 |
| 40 | Bf4 | 1.37 | hot | +13.27 | 3 |
| 42 | Bxd6 | 4.53 | hot | +11.50 | 2 |
| 44 | Be5+ | 2.04 | hot | +17.51 | 3 |
| 46 | Bxf5 | 1.32 | critical | +19.44 | 3 |
| 48 | gxh4 | 1.40 | hot | +20.68 | 3 |
| 50 | Rhg1 | 1.65 | hot | +21.35 | 3 |
| 52 | Rg7+ | 22.17 | hot | +43.24 | 3 |
| 54 | Rag1 | 1.85 | hot | +20.79 | 3 |
| 56 | dxc4 | 1.84 | hot | +20.94 | 2 |
| 58 | Rg8+ | 4.36 | hot | +24.82 | 3 |
| 60 | R1g7# | 0.00 | frozen | +49999.50 | 3 |

### Game 12: English (reversed Sicilian) — engine as Black — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1500"]
[Round "12"]
[White "Stockfish (Elo 1500)"]
[Black "ThermoEngine"]
[Opening "English (reversed Sicilian)"]
[Result "0-1"]
[Termination "checkmate"]

1. c4 e5 2. Nc3 Nf6 3. Nf3 e4 4. Ne5 Qe7 5. d4 d6 6. Qa4+ c6 7. Nxc6 Nxc6 8. Bg5 h6 
9. Nd5 Qd8 10. Bxf6 gxf6 11. h4 Qa5+ 12. Qxa5 Nxa5 13. b4 Nb3 14. axb3 Rb8 15. b5 Bg7 16. b6 axb6 
17. f3 f5 18. fxe4 Bxd4 19. Ra7 fxe4 20. Ra2 e3 21. Kd1 Bf5 22. g3 Be4 23. Rg1 Bb1 24. Ra7 b5 
25. Ra3 Bb2 26. Nc7+ Kd7 27. Nxb5 Bxa3 28. Nxa3 Bf5 29. g4 Be4 30. Nc2 Bxc2+ 31. Kxc2 Ra8 32. Kb2 Rhg8 
33. Bg2 Kc7 34. Be4 Rge8 35. Bd5 f5 36. Bf7 Re7 37. Bh5 fxg4 38. b4 Re5 39. Bg6 Rg8 40. Rxg4 Re6 
41. Bh5 Rxg4 42. Bf7 Re7 43. Kc3 Rxf7 44. c5 dxc5 45. Kb2 Rxb4+ 46. Kc1 Rf1+ 47. Kc2 h5 48. Kc3 Rc1+ 
49. Kd3 Rd4+ 50. Kxe3 Rc3+ 51. Kf2 Rf4+ 52. Ke1 Ra3 53. Kd2 Rd4+ 54. Kc1 Re3 55. Kb1 Rxe2 56. Kc1 Kd7 
57. Kb1 Rd1# 0-1
```

Phases: frozen 2 · cold 6 · critical 2 · hot 45 · mean T 6.59 · max T 58.21

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | e4 | 1.45 | hot | +0.21 | 3 |
| 3 | Qe7 | 1.25 | hot | -0.58 | 3 |
| 5 | d6 | 1.14 | hot | +0.40 | 2 |
| 7 | c6 | 1.23 | hot | -0.25 | 3 |
| 9 | Nxc6 | 1.00 | cold | +0.00 | 2 |
| 11 | h6 | 1.05 | hot | -0.65 | 2 |
| 13 | Qd8 | 1.06 | cold | -0.67 | 2 |
| 15 | gxf6 | 1.02 | cold | -1.70 | 2 |
| 17 | Qa5+ | 1.03 | hot | -2.27 | 2 |
| 19 | Nxa5 | 6.63 | hot | +2.04 | 3 |
| 21 | Nb3 | 5.38 | hot | -0.09 | 3 |
| 23 | Rb8 | 2.68 | hot | +2.01 | 3 |
| 25 | Bg7 | 6.38 | hot | +4.69 | 3 |
| 27 | axb6 | 4.67 | hot | +2.04 | 3 |
| 29 | f5 | 4.40 | hot | +1.04 | 3 |
| 31 | Bxd4 | 1.27 | hot | -1.40 | 3 |
| 33 | fxe4 | 1.15 | hot | -2.45 | 3 |
| 35 | e3 | 1.19 | hot | -2.64 | 3 |
| 37 | Bf5 | 1.04 | hot | -2.77 | 3 |
| 39 | Be4 | 1.06 | hot | -3.27 | 3 |
| 41 | Bb1 | 1.05 | hot | -3.22 | 3 |
| 43 | b5 | 1.03 | hot | -3.01 | 3 |
| 45 | Bb2 | 1.59 | hot | -3.28 | 3 |
| 47 | Kd7 | 1.37 | hot | -3.87 | 4 |
| 49 | Bxa3 | 7.53 | hot | -9.38 | 3 |
| 51 | Bf5 | 1.60 | critical | -4.24 | 4 |
| 53 | Be4 | 1.63 | cold | -4.29 | 4 |
| 55 | Bxc2+ | 2.56 | hot | -6.05 | 3 |
| 57 | Ra8 | 1.07 | hot | -3.04 | 3 |
| 59 | Rhg8 | 1.15 | hot | -3.30 | 3 |
| 61 | Kc7 | 1.42 | hot | -2.26 | 3 |
| 63 | Rge8 | 1.28 | hot | -2.96 | 3 |
| 65 | f5 | 1.69 | hot | -1.69 | 3 |
| 67 | Re7 | 1.20 | cold | -3.14 | 3 |
| 69 | fxg4 | 1.24 | hot | -2.88 | 3 |
| 71 | Re5 | 2.02 | hot | -4.13 | 3 |
| 73 | Rg8 | 1.95 | hot | -3.59 | 3 |
| 75 | Re6 | 1.09 | hot | -2.71 | 3 |
| 77 | Rxg4 | 2.58 | critical | -2.79 | 4 |
| 79 | Re7 | 1.93 | cold | -11.03 | 4 |
| 81 | Rxf7 | 4.54 | hot | -16.99 | 4 |
| 83 | dxc5 | 2.27 | hot | -17.03 | 3 |
| 85 | Rxb4+ | 10.75 | hot | -24.33 | 4 |
| 87 | Rf1+ | 58.21 | hot | -68.10 | 5 |
| 89 | h5 | 31.88 | hot | -45.48 | 5 |
| 91 | Rc1+ | 46.08 | hot | -60.44 | 5 |
| 93 | Rd4+ | 41.72 | hot | -52.69 | 5 |
| 95 | Rc3+ | 36.99 | hot | -50.28 | 5 |
| 97 | Rf4+ | 7.19 | hot | -21.34 | 4 |
| 99 | Ra3 | 6.36 | hot | -20.41 | 4 |
| 101 | Rd4+ | 9.50 | hot | -23.32 | 4 |
| 103 | Re3 | 7.08 | hot | -22.28 | 4 |
| 105 | Rxe2 | 16.79 | hot | -33.94 | 4 |
| 107 | Kd7 | 0.00 | frozen | -49998.50 | 6 |
| 109 | Rd1# | 0.00 | frozen | -49999.50 | 6 |
