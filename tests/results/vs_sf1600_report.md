# Results book: thermodynamic engine vs Stockfish 1600

- Date: 2026-07-02T16:29:36.728Z
- Engine time: 1000 ms/move · Stockfish: 200 ms/move at UCI_Elo 1600
- Openings: all 6 book lines, both colors (12 games)

## Final score

**Engine 1 — 11 Stockfish**  (W 0 / D 2 / L 10)

## Summary

| # | Opening | Engine color | Result | Plies | Termination | mean T | dominant phase |
|---|---|---|---|---|---|---|---|
| 1 | Italian complex | White | 0 (0-1) | 74 | checkmate | 3.08 | hot |
| 2 | Italian complex | Black | 0 (1-0) | 89 | checkmate | 5.41 | hot |
| 3 | Queen's Gambit Declined | White | 0 (0-1) | 46 | checkmate | 5.57 | hot |
| 4 | Queen's Gambit Declined | Black | 0 (1-0) | 81 | checkmate | 2.52 | hot |
| 5 | Sicilian (Najdorf setup) | White | 0 (0-1) | 72 | checkmate | 2.44 | hot |
| 6 | Sicilian (Najdorf setup) | Black | 0 (1-0) | 113 | checkmate | 3.64 | hot |
| 7 | King's Indian | White | ½ (1/2-1/2) | 91 | threefold repetition | 3.88 | hot |
| 8 | King's Indian | Black | 0 (1-0) | 153 | checkmate | 197.35 | hot |
| 9 | French | White | 0 (0-1) | 68 | checkmate | 7.05 | hot |
| 10 | French | Black | 0 (1-0) | 127 | checkmate | 8.73 | hot |
| 11 | English (reversed Sicilian) | White | 0 (0-1) | 166 | checkmate | 432.37 | hot |
| 12 | English (reversed Sicilian) | Black | ½ (1/2-1/2) | 92 | threefold repetition | 1.78 | hot |

## Thermodynamics across the match

- Mean bath temperature over all engine moves: **91.90**
- Phase occupancy: frozen 9% · cold 9% · critical 7% · hot 75%
- Mean T in won games NaN, drawn 2.83, lost 108.50

## Games

### Game 1: Italian complex — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "1"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "Italian complex"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bg5 Bb4+ 5. c3 Be7 6. Bxe7 Ngxe7 7. Nxd4 Nxd4 8. Qxd4 f6 
9. Bc4 c6 10. Qd6 Qb6 11. Qg3 d5 12. Qxg7 Rg8 13. Qxf6 dxc4 14. Na3 Rf8 15. Qxf8+ Kxf8 16. Nxc4 Qa6 
17. b3 Be6 18. Kd2 Ng8 19. Nd6 Rd8 20. e5 Qa3 21. Kc2 Rxd6 22. exd6 Bf5+ 23. Kd2 Bd7 24. b4 Nf6 
25. Kd3 c5 26. bxc5 Qxc5 27. a4 b5 28. axb5 Qd5+ 29. Kc2 Bf5+ 30. Kb2 Qxb5+ 31. Ka3 Qa5+ 32. Kb2 Qb6+ 
33. Kc1 Qxf2 34. Kd1 Ne4 35. Ra2 Qxa2 36. Kc1 Nxc3 37. Rf1 Qc2# 0-1
```

Phases: frozen 3 · cold 3 · critical 3 · hot 26 · mean T 3.08 · max T 12.12

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | d4 | 1.50 | hot | -0.42 | 3 |
| 2 | Bg5 | 1.03 | hot | -1.45 | 2 |
| 4 | c3 | 1.13 | hot | -0.52 | 3 |
| 6 | Bxe7 | 1.96 | hot | -1.52 | 2 |
| 8 | Nxd4 | 1.08 | hot | -1.43 | 2 |
| 10 | Qxd4 | 1.23 | critical | +0.18 | 3 |
| 12 | Bc4 | 1.23 | hot | +0.14 | 3 |
| 14 | Qd6 | 1.28 | hot | +0.47 | 3 |
| 16 | Qg3 | 1.36 | hot | -1.33 | 2 |
| 18 | Qxg7 | 1.00 | cold | +0.47 | 2 |
| 20 | Qxf6 | 12.12 | hot | -2.40 | 1 |
| 22 | Na3 | 2.97 | hot | -6.53 | 2 |
| 24 | Qxf8+ | 3.95 | hot | -6.02 | 2 |
| 26 | Nxc4 | 1.13 | critical | -5.88 | 3 |
| 28 | b3 | 1.09 | critical | -5.77 | 3 |
| 30 | Kd2 | 1.13 | hot | -7.46 | 2 |
| 32 | Nd6 | 1.02 | hot | -7.12 | 2 |
| 34 | e5 | 1.43 | hot | -6.87 | 3 |
| 36 | Kc2 | 1.04 | hot | -6.93 | 2 |
| 38 | exd6 | 4.53 | cold | -5.07 | 3 |
| 40 | Kd2 | 10.15 | hot | -12.49 | 4 |
| 42 | b4 | 2.22 | hot | -4.91 | 2 |
| 44 | Kd3 | 1.12 | hot | -3.26 | 2 |
| 46 | bxc5 | 2.39 | hot | -4.73 | 2 |
| 48 | a4 | 3.46 | hot | -8.23 | 2 |
| 50 | axb5 | 4.57 | hot | -8.92 | 2 |
| 52 | Kc2 | 6.41 | hot | -5.50 | 3 |
| 54 | Kb2 | 7.25 | hot | -5.97 | 3 |
| 56 | Ka3 | 5.00 | hot | -6.27 | 4 |
| 58 | Kb2 | 2.25 | hot | -3.98 | 4 |
| 60 | Kc1 | 7.45 | hot | -7.30 | 3 |
| 62 | Kd1 | 4.96 | cold | -7.41 | 3 |
| 64 | Ra2 | 7.53 | frozen | -14.38 | 3 |
| 66 | Kc1 | 0.00 | frozen | -49998.00 | 4 |
| 68 | Rf1 | 0.00 | frozen | -49999.00 | 4 |

### Game 2: Italian complex — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "2"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "Italian complex"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Na5 4. Nxe5 Nxc4 5. Nxc4 d5 6. exd5 Qxd5 7. Ne3 Qe5 8. Nc3 Be6 
9. d4 Qa5 10. Bd2 Qb4 11. d5 Bd7 12. O-O Bd6 13. a4 Qh4 14. h3 Qb4 15. Nb5 Bh2+ 16. Kxh2 Qf4+ 
17. Kh1 c6 18. Na3 cxd5 19. Nxd5 Qd6 20. Bf4 Qf8 21. Nb5 Kd8 22. Re1 g5 23. Bc7+ Kc8 24. Nd6+ Qxd6 
25. Bxd6 h5 26. Qd4 Rh6 27. Qc5+ Bc6 28. Bg3 b6 29. Nxb6+ axb6 30. Qf8+ Kb7 31. Qxf7+ Ka6 32. b4 h4 
33. Bh2 Rf6 34. Qc4+ Kb7 35. a5 bxa5 36. bxa5 Rc8 37. Rab1+ Ka7 38. f3 Bb7 39. Rxb7+ Kxb7 40. Rb1+ Ka7 
41. Qb5 Rf7 42. Bg1+ Rc5 43. Qxc5+ Ka6 44. Qc4+ Kxa5 45. Bb6# 1-0
```

Phases: frozen 5 · cold 8 · critical 7 · hot 22 · mean T 5.41 · max T 63.82

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Na5 | 1.02 | hot | +0.85 | 2 |
| 3 | Nxc4 | 6.13 | hot | +5.06 | 2 |
| 5 | d5 | 1.20 | hot | -1.14 | 3 |
| 7 | Qxd5 | 1.29 | hot | -1.35 | 3 |
| 9 | Qe5 | 1.67 | hot | -0.63 | 3 |
| 11 | Be6 | 1.10 | hot | +0.64 | 2 |
| 13 | Qa5 | 1.08 | hot | +0.77 | 2 |
| 15 | Qb4 | 1.07 | hot | +0.19 | 2 |
| 17 | Bd7 | 1.48 | hot | -0.47 | 3 |
| 19 | Bd6 | 1.27 | hot | -0.75 | 3 |
| 21 | Qh4 | 1.16 | hot | -0.49 | 2 |
| 23 | Qb4 | 1.17 | hot | +0.34 | 2 |
| 25 | Bh2+ | 4.12 | hot | +3.59 | 2 |
| 27 | Qf4+ | 1.02 | cold | +3.67 | 3 |
| 29 | c6 | 1.03 | hot | +4.32 | 2 |
| 31 | cxd5 | 1.02 | hot | +4.13 | 2 |
| 33 | Qd6 | 1.17 | cold | +3.95 | 3 |
| 35 | Qf8 | 5.01 | hot | +8.15 | 3 |
| 37 | Kd8 | 2.42 | critical | +5.92 | 3 |
| 39 | g5 | 2.89 | hot | +5.55 | 3 |
| 41 | Kc8 | 31.00 | frozen | +32.96 | 4 |
| 43 | Qxd6 | 63.82 | frozen | +51.91 | 3 |
| 45 | h5 | 3.30 | hot | +15.10 | 3 |
| 47 | Rh6 | 3.55 | critical | +14.82 | 3 |
| 49 | Bc6 | 5.06 | cold | +16.37 | 3 |
| 51 | b6 | 2.81 | critical | +14.20 | 3 |
| 53 | axb6 | 3.79 | critical | +13.73 | 3 |
| 55 | Kb7 | 3.10 | cold | +13.09 | 3 |
| 57 | Ka6 | 2.63 | hot | +13.80 | 3 |
| 59 | h4 | 1.54 | critical | +12.53 | 3 |
| 61 | Rf6 | 1.54 | critical | +12.41 | 3 |
| 63 | Kb7 | 1.72 | cold | +12.69 | 3 |
| 65 | bxa5 | 1.21 | critical | +12.91 | 2 |
| 67 | Rc8 | 1.72 | hot | +12.51 | 3 |
| 69 | Ka7 | 1.33 | cold | +12.42 | 3 |
| 71 | Bb7 | 2.02 | hot | +12.74 | 3 |
| 73 | Kxb7 | 22.31 | cold | +30.63 | 4 |
| 75 | Ka7 | 32.57 | hot | +35.42 | 3 |
| 77 | Rf7 | 4.03 | cold | +12.71 | 3 |
| 79 | Rc5 | 0.00 | frozen | +49998.00 | 4 |
| 81 | Ka6 | 0.00 | frozen | +49999.00 | 5 |
| 83 | Kxa5 | 0.00 | frozen | +49999.00 | 5 |

### Game 3: Queen's Gambit Declined — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "3"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "Queen's Gambit Declined"]
[Result "0-1"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. Qa4+ c6 4. cxd5 Nf6 5. dxc6 Nxc6 6. d5 Qxd5 7. Nc3 Qc5 8. Be3 Qf5 
9. Nb5 Bb4+ 10. Qxb4 Nxb4 11. Nd6+ Kd8 12. Nxf7+ Ke7 13. Nxh8 Nc2+ 14. Kd2 Nxa1 15. Ng6+ hxg6 16. Nf3 Kd8 
17. Nd4 Qd5 18. f3 Qa5+ 19. b4 Qxb4+ 20. Kd3 e5 21. Nc6+ bxc6 22. Bf2 Ba6+ 23. Ke3 Qc3# 0-1
```

Phases: frozen 1 · cold 1 · critical 0 · hot 19 · mean T 5.57 · max T 38.97

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qa4+ | 1.25 | hot | -1.09 | 2 |
| 2 | cxd5 | 1.02 | hot | -0.89 | 2 |
| 4 | dxc6 | 2.93 | hot | -1.05 | 2 |
| 6 | d5 | 1.73 | hot | -1.55 | 2 |
| 8 | Nc3 | 1.08 | hot | -1.24 | 2 |
| 10 | Be3 | 1.02 | hot | -1.00 | 2 |
| 12 | Nb5 | 1.01 | hot | -1.37 | 2 |
| 14 | Qxb4 | 9.80 | hot | +1.47 | 3 |
| 16 | Nd6+ | 21.44 | hot | -15.75 | 2 |
| 18 | Nxf7+ | 8.36 | hot | -6.96 | 2 |
| 20 | Nxh8 | 5.41 | hot | -5.85 | 3 |
| 22 | Kd2 | 38.97 | hot | -29.80 | 3 |
| 24 | Ng6+ | 2.78 | hot | -7.81 | 3 |
| 26 | Nf3 | 2.89 | hot | -10.62 | 3 |
| 28 | Nd4 | 2.05 | hot | -9.45 | 3 |
| 30 | f3 | 2.81 | hot | -10.95 | 3 |
| 32 | b4 | 2.96 | hot | -10.21 | 3 |
| 34 | Kd3 | 2.50 | hot | -11.39 | 3 |
| 36 | Nc6+ | 3.45 | hot | -10.42 | 3 |
| 38 | Bf2 | 3.40 | cold | -14.77 | 3 |
| 40 | Ke3 | 0.00 | frozen | -49999.00 | 5 |

### Game 4: Queen's Gambit Declined — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "4"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "Queen's Gambit Declined"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 d5 2. c4 e6 3. e3 Bb4+ 4. Nc3 dxc4 5. Bxc4 Qg5 6. Kf1 b5 7. Nxb5 Kd7 8. Nf3 Qf5 
9. Kg1 a6 10. Bd3 Qf6 11. Qa4 Nc6 12. Nc3 Ne7 13. e4 Bb7 14. e5 Qxf3 15. gxf3 Nf5 16. Be3 Nxe3 
17. Be4 Bxc3 18. Rc1 Bxb2 19. Bxc6+ Kc8 20. Bxb7+ Kb8 21. Rxc7 Kxc7 22. Be4 Nd5 23. Qc4+ Kd7 24. Bxd5 exd5 
25. Qxd5+ Kc7 26. h4 Rhf8 27. Kg2 Rad8 28. Qb3 Bxd4 29. f4 f6 30. Rb1 fxe5 31. Qb7+ Kd6 32. fxe5+ Kxe5 
33. Re1+ Kd6 34. Qxa6+ Kc5 35. Rc1+ Kd5 36. Qc6+ Ke5 37. Re1+ Kf5 38. Qe4+ Kf6 39. Qf4+ Kg6 40. Qg4+ Kh6 
41. Qg5# 1-0
```

Phases: frozen 5 · cold 8 · critical 2 · hot 23 · mean T 2.52 · max T 17.57

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.02 | hot | +0.50 | 2 |
| 3 | dxc4 | 1.02 | hot | +0.85 | 2 |
| 5 | Qg5 | 1.02 | hot | +1.06 | 2 |
| 7 | b5 | 1.01 | hot | +1.52 | 2 |
| 9 | Kd7 | 1.04 | cold | +0.89 | 1 |
| 11 | Qf5 | 1.01 | hot | +0.90 | 1 |
| 13 | a6 | 1.05 | hot | +1.89 | 2 |
| 15 | Qf6 | 1.35 | cold | +1.49 | 3 |
| 17 | Nc6 | 1.02 | hot | +2.41 | 2 |
| 19 | Ne7 | 1.01 | cold | +2.62 | 2 |
| 21 | Bb7 | 1.01 | hot | +2.45 | 2 |
| 23 | Qxf3 | 17.57 | hot | +25.37 | 2 |
| 25 | Nf5 | 1.03 | hot | +10.65 | 2 |
| 27 | Nxe3 | 3.68 | hot | +10.73 | 2 |
| 29 | Bxc3 | 4.63 | hot | +9.19 | 2 |
| 31 | Bxb2 | 7.29 | hot | +10.25 | 2 |
| 33 | Kc8 | 2.27 | hot | +5.59 | 3 |
| 35 | Kb8 | 2.63 | hot | +11.34 | 4 |
| 37 | Kxc7 | 12.21 | hot | +18.69 | 2 |
| 39 | Nd5 | 1.72 | hot | +5.17 | 3 |
| 41 | Kd7 | 1.10 | cold | +2.85 | 3 |
| 43 | exd5 | 1.69 | cold | +1.95 | 3 |
| 45 | Kc7 | 1.52 | cold | +4.44 | 4 |
| 47 | Rhf8 | 1.43 | hot | +2.68 | 3 |
| 49 | Rad8 | 1.34 | hot | +2.16 | 3 |
| 51 | Bxd4 | 1.34 | critical | +1.72 | 3 |
| 53 | f6 | 1.97 | hot | +1.96 | 3 |
| 55 | fxe5 | 1.92 | cold | +1.41 | 3 |
| 57 | Kd6 | 4.70 | frozen | +3.66 | 3 |
| 59 | Kxe5 | 2.30 | hot | +1.76 | 3 |
| 61 | Kd6 | 3.97 | hot | +2.45 | 3 |
| 63 | Kc5 | 1.35 | hot | +1.62 | 3 |
| 65 | Kd5 | 2.34 | cold | +3.55 | 4 |
| 67 | Ke5 | 1.91 | frozen | +3.25 | 4 |
| 69 | Kf5 | 2.44 | critical | +2.79 | 3 |
| 71 | Kf6 | 0.00 | frozen | +49999.00 | 5 |
| 73 | Kg6 | 0.00 | frozen | +49998.00 | 5 |
| 75 | Kh6 | 0.00 | frozen | +49999.00 | 4 |

### Game 5: Sicilian (Najdorf setup) — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "5"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "Sicilian (Najdorf setup)"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. Bb5+ Nc6 4. Bxc6+ bxc6 5. Ng5 Nf6 6. e5 Nd7 7. Qh5 g6 8. Qf3 Nxe5 
9. Qb3 Qb6 10. Qxb6 axb6 11. f4 Ng4 12. h3 f6 13. hxg4 fxg5 14. fxg5 c4 15. Na3 b5 16. Nxb5 cxb5 
17. Rh4 Bg7 18. c3 Be5 19. Kf2 Bg7 20. d4 O-O+ 21. Ke2 Bb7 22. Be3 Bd5 23. Rhh1 Bb7 24. Rh4 e5 
25. dxe5 dxe5 26. Bc5 Rfc8 27. Bd6 Bxg2 28. Rh2 Rd8 29. Rxg2 Rd7 30. Bc5 e4 31. Ke3 Rd3+ 32. Kxe4 Re8+ 
33. Be7 b4 34. Kf4 Rxe7 35. Rh1 Be5+ 36. Ke4 Bg3# 0-1
```

Phases: frozen 1 · cold 3 · critical 1 · hot 29 · mean T 2.44 · max T 16.87

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.59 | hot | +0.94 | 3 |
| 2 | Bxc6+ | 1.65 | hot | -0.19 | 3 |
| 4 | Ng5 | 1.66 | hot | -2.61 | 3 |
| 6 | e5 | 1.58 | hot | -2.23 | 3 |
| 8 | Qh5 | 1.83 | hot | -2.55 | 2 |
| 10 | Qf3 | 1.80 | hot | -1.46 | 3 |
| 12 | Qb3 | 1.66 | cold | -3.37 | 3 |
| 14 | Qxb6 | 1.41 | hot | -2.89 | 2 |
| 16 | f4 | 1.57 | hot | -2.88 | 3 |
| 18 | h3 | 1.50 | hot | -2.47 | 3 |
| 20 | hxg4 | 2.29 | hot | -3.68 | 2 |
| 22 | fxg5 | 2.39 | hot | -4.06 | 3 |
| 24 | Na3 | 2.39 | hot | -3.16 | 3 |
| 26 | Nxb5 | 2.90 | hot | -3.26 | 3 |
| 28 | Rh4 | 3.15 | hot | -5.70 | 3 |
| 30 | c3 | 2.22 | hot | -5.05 | 3 |
| 32 | Kf2 | 2.47 | hot | -5.03 | 3 |
| 34 | d4 | 1.99 | hot | -4.87 | 3 |
| 36 | Ke2 | 1.81 | hot | -4.50 | 3 |
| 38 | Be3 | 3.55 | hot | -6.24 | 3 |
| 40 | Rhh1 | 2.08 | hot | -6.90 | 2 |
| 42 | Rh4 | 2.20 | cold | +0.00 | 2 |
| 44 | dxe5 | 2.23 | hot | -6.12 | 2 |
| 46 | Bc5 | 1.64 | hot | -4.93 | 2 |
| 48 | Bd6 | 2.68 | hot | -5.50 | 3 |
| 50 | Rh2 | 1.15 | hot | -3.96 | 3 |
| 52 | Rxg2 | 2.03 | hot | -3.00 | 3 |
| 54 | Bc5 | 1.46 | critical | -0.83 | 3 |
| 56 | Ke3 | 1.45 | hot | -0.40 | 3 |
| 58 | Kxe4 | 1.15 | hot | +0.58 | 3 |
| 60 | Be7 | 4.64 | cold | -6.61 | 4 |
| 62 | Kf4 | 16.87 | hot | -12.19 | 3 |
| 64 | Rh1 | 2.09 | hot | -5.36 | 3 |
| 66 | Ke4 | 0.00 | frozen | -49999.00 | 4 |

### Game 6: Sicilian (Najdorf setup) — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "6"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "Sicilian (Najdorf setup)"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 c5 2. Nf3 d6 3. Be2 Nf6 4. d4 Qa5+ 5. Bd2 Qb6 6. e5 Qxb2 7. Bc4 Qxa1 8. Bc3 Qxc3+ 
9. Nxc3 cxd4 10. Nb5 Nd5 11. Bxd5 Be6 12. Bxb7 Bd5 13. Bxd5 e6 14. Bb3 dxe5 15. Kf1 Na6 16. Nxe5 f6 
17. Nf3 Rb8 18. Nbxd4 Nc5 19. Qe1 Nxb3 20. Qxe6+ Be7 21. axb3 Rd8 22. g3 Rd6 23. Qc4 Kd7 24. c3 Rc8 
25. Qa4+ Kd8 26. Qxa7 Rxc3 27. Kg2 Rc7 28. Ne6+ Rxe6 29. Qa5 Bc5 30. Rc1 Bb6 31. Qa8+ Ke7 32. Qa3+ Kf7 
33. h4 Rxc1 34. Qxc1 Re2 35. Qc4+ Re6 36. Qc8 h5 37. Qc1 Re2 38. Qc4+ Re6 39. Qd5 Ke7 40. Qb7+ Kd8 
41. Qa6 Ke7 42. Qb5 g6 43. Nd2 f5 44. Nc4 Bd4 45. Qb7+ Kf6 46. Qb4 Kg7 47. Qb5 Kf6 48. Qd7 Bc5 
49. Nd2 Rd6 50. Qb5 Ba7 51. Qb4 Rd7 52. Nf3 Kg7 53. Ne5 Rc7 54. Qd6 Rb7 55. Qa6 Rxb3 56. Qxg6+ Kf8 
57. Qf7# 1-0
```

Phases: frozen 1 · cold 5 · critical 5 · hot 43 · mean T 3.64 · max T 28.16

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Nf6 | 1.48 | hot | +0.33 | 3 |
| 3 | Qa5+ | 1.03 | hot | +0.48 | 2 |
| 5 | Qb6 | 1.23 | cold | +0.41 | 3 |
| 7 | Qxb2 | 1.06 | critical | -0.95 | 2 |
| 9 | Qxa1 | 4.51 | hot | +0.32 | 2 |
| 11 | Qxc3+ | 28.16 | hot | +14.63 | 2 |
| 13 | cxd4 | 2.16 | hot | +1.85 | 2 |
| 15 | Nd5 | 2.46 | hot | +3.20 | 2 |
| 17 | Be6 | 2.92 | hot | +5.92 | 2 |
| 19 | Bd5 | 13.77 | hot | +28.82 | 2 |
| 21 | e6 | 16.64 | hot | +40.87 | 2 |
| 23 | dxe5 | 3.86 | hot | +13.90 | 2 |
| 25 | Na6 | 1.82 | critical | +8.53 | 2 |
| 27 | f6 | 2.23 | hot | +9.73 | 2 |
| 29 | Rb8 | 2.13 | hot | +9.57 | 2 |
| 31 | Nc5 | 2.49 | hot | +10.44 | 2 |
| 33 | Nxb3 | 4.72 | hot | +11.75 | 2 |
| 35 | Be7 | 16.03 | hot | +15.91 | 3 |
| 37 | Rd8 | 2.98 | hot | +7.93 | 3 |
| 39 | Rd6 | 1.57 | hot | +6.54 | 3 |
| 41 | Kd7 | 2.38 | hot | +7.85 | 3 |
| 43 | Rc8 | 1.75 | hot | +6.70 | 3 |
| 45 | Kd8 | 2.24 | critical | +7.71 | 3 |
| 47 | Rxc3 | 1.42 | hot | +7.53 | 3 |
| 49 | Rc7 | 1.55 | hot | +6.65 | 3 |
| 51 | Rxe6 | 1.68 | cold | +5.63 | 4 |
| 53 | Bc5 | 2.04 | hot | +4.74 | 3 |
| 55 | Bb6 | 1.48 | cold | +4.33 | 3 |
| 57 | Ke7 | 1.14 | hot | +4.00 | 3 |
| 59 | Kf7 | 1.69 | hot | +4.62 | 3 |
| 61 | Rxc1 | 2.45 | hot | +2.14 | 3 |
| 63 | Re2 | 1.56 | hot | +3.98 | 3 |
| 65 | Re6 | 5.23 | hot | +8.62 | 4 |
| 67 | h5 | 1.44 | hot | +4.37 | 3 |
| 69 | Re2 | 1.53 | hot | +4.02 | 3 |
| 71 | Re6 | 5.41 | hot | +8.76 | 4 |
| 73 | Ke7 | 2.44 | hot | +5.38 | 3 |
| 75 | Kd8 | 1.76 | hot | +6.29 | 4 |
| 77 | Ke7 | 1.48 | hot | +4.14 | 3 |
| 79 | g6 | 2.41 | hot | +4.97 | 3 |
| 81 | f5 | 1.59 | hot | +4.22 | 3 |
| 83 | Bd4 | 1.32 | cold | +4.04 | 3 |
| 85 | Kf6 | 2.89 | hot | +6.72 | 4 |
| 87 | Kg7 | 1.46 | cold | +4.25 | 3 |
| 89 | Kf6 | 1.50 | hot | +4.29 | 3 |
| 91 | Bc5 | 1.93 | critical | +4.81 | 3 |
| 93 | Rd6 | 1.30 | hot | +3.58 | 3 |
| 95 | Ba7 | 1.73 | hot | +4.03 | 3 |
| 97 | Rd7 | 1.27 | hot | +4.06 | 3 |
| 99 | Kg7 | 1.41 | hot | +4.17 | 3 |
| 101 | Rc7 | 2.25 | critical | +5.23 | 3 |
| 103 | Rb7 | 9.41 | hot | +12.11 | 3 |
| 105 | Rxb3 | 12.41 | hot | +15.34 | 3 |
| 107 | Kf8 | 0.00 | frozen | +49999.00 | 4 |

### Game 7: King's Indian — engine as White — 1/2-1/2

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "7"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "King's Indian"]
[Result "1/2-1/2"]
[Termination "threefold repetition"]

1. d4 Nf6 2. c4 g6 3. Qd3 d5 4. cxd5 Nxd5 5. Qb5+ c6 6. Qb3 Nc7 7. Bf4 Bg7 8. Qg3 Qxd4 
9. Bxc7 Qxb2 10. Qb3 Qxb3 11. axb3 Bxa1 12. Bxb8 Rxb8 13. e4 Kd8 14. Bc4 Kc7 15. Bxf7 Rf8 16. Bc4 b5 
17. Be2 Be6 18. Bg4 Rf4 19. Bxe6 Rxe4+ 20. Ne2 Rxe6 21. Kd2 a5 22. Nbc3 Rd6+ 23. Kc2 Bxc3 24. Nxc3 g5 
25. Ne4 Kb6 26. Nxd6 exd6 27. Re1 Kc5 28. Re7 Rf8 29. f3 g4 30. Rxh7 gxf3 31. gxf3 Rxf3 32. Rh5+ Kb6 
33. Rh6 Rf2+ 34. Kd3 Kc5 35. Rh5+ Kb4 36. Rh4+ Kc5 37. Rh5+ Kb4 38. Rh4+ Kxb3 39. Rh6 a4 40. Rxd6 c5 
41. Ke3 Rxh2 42. Rd3+ Kc2 43. Rd5 Kb3 44. Rd3+ Kb2 45. Rd5 Kb3 46. Rd3+ 1/2-1/2
```

Phases: frozen 0 · cold 6 · critical 2 · hot 36 · mean T 3.88 · max T 40.52

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Qd3 | 1.16 | hot | +0.19 | 3 |
| 2 | cxd5 | 1.06 | hot | -0.85 | 2 |
| 4 | Qb5+ | 1.38 | hot | +0.57 | 3 |
| 6 | Qb3 | 1.78 | cold | -0.96 | 3 |
| 8 | Bf4 | 1.16 | hot | -1.56 | 2 |
| 10 | Qg3 | 1.24 | hot | -0.88 | 2 |
| 12 | Bxc7 | 2.65 | hot | -2.38 | 2 |
| 14 | Qb3 | 15.44 | cold | -27.46 | 2 |
| 16 | axb3 | 40.52 | hot | -23.46 | 3 |
| 18 | Bxb8 | 1.96 | hot | -7.04 | 3 |
| 20 | e4 | 2.33 | hot | -9.72 | 3 |
| 22 | Bc4 | 1.79 | hot | -8.71 | 3 |
| 24 | Bxf7 | 1.38 | hot | -8.31 | 3 |
| 26 | Bc4 | 2.14 | hot | -8.67 | 3 |
| 28 | Be2 | 2.49 | hot | -9.24 | 3 |
| 30 | Bg4 | 4.20 | hot | -10.78 | 3 |
| 32 | Bxe6 | 6.84 | hot | -15.99 | 2 |
| 34 | Ne2 | 34.16 | hot | -42.01 | 4 |
| 36 | Kd2 | 2.52 | hot | -9.91 | 3 |
| 38 | Nbc3 | 1.27 | hot | -8.10 | 3 |
| 40 | Kc2 | 2.47 | critical | -6.30 | 3 |
| 42 | Nxc3 | 1.85 | critical | -7.60 | 3 |
| 44 | Ne4 | 1.41 | hot | -5.91 | 3 |
| 46 | Nxd6 | 7.13 | hot | -2.69 | 3 |
| 48 | Re1 | 1.29 | hot | -2.60 | 4 |
| 50 | Re7 | 1.42 | hot | -2.32 | 4 |
| 52 | f3 | 1.44 | hot | -2.14 | 3 |
| 54 | Rxh7 | 1.17 | hot | -1.58 | 3 |
| 56 | gxf3 | 1.49 | hot | -2.52 | 4 |
| 58 | Rh5+ | 1.11 | hot | -2.87 | 4 |
| 60 | Rh6 | 1.10 | hot | -3.26 | 4 |
| 62 | Kd3 | 1.07 | hot | -3.26 | 4 |
| 64 | Rh5+ | 1.07 | hot | -2.60 | 4 |
| 66 | Rh4+ | 1.40 | hot | -3.53 | 4 |
| 68 | Rh5+ | 1.90 | cold | +0.00 | 4 |
| 70 | Rh4+ | 2.91 | cold | +0.00 | 4 |
| 72 | Rh6 | 1.20 | hot | -4.36 | 4 |
| 74 | Rxd6 | 1.25 | hot | -3.61 | 4 |
| 76 | Ke3 | 1.30 | hot | -3.40 | 4 |
| 78 | Rd3+ | 1.14 | hot | -4.09 | 4 |
| 80 | Rd5 | 1.06 | hot | -2.81 | 5 |
| 82 | Rd3+ | 3.06 | cold | +0.00 | 4 |
| 84 | Rd5 | 1.15 | hot | -3.94 | 4 |
| 86 | Rd3+ | 3.07 | cold | +0.00 | 4 |

### Game 8: King's Indian — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "8"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "King's Indian"]
[Result "1-0"]
[Termination "checkmate"]

1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. Qd3 Nxa2 7. Rxa2 Be6 8. Ra3 Nc6 
9. Ne2 Bg7 10. d5 Ne5 11. Qb3 Bc8 12. Bf4 g5 13. Be3 Nf3+ 14. gxf3 Qd6 15. h3 b6 16. h4 gxh4 
17. Nc3 Bxc3+ 18. Qxc3 Rg8 19. Kd2 c6 20. Qxc6+ Qxc6 21. dxc6 Rg6 22. Rc3 Rd6+ 23. Kc2 e5 24. c7 h3 
25. f4 exf4 26. Bb5+ Ke7 27. Bxf4 Rf6 28. Bg3 a6 29. Be2 Bb7 30. Rd1 Bxe4+ 31. Kd2 Rc8 32. Bxa6 h2 
33. Rdc1 h1=Q 34. Rxh1 Bxh1 35. Re3+ Kd7 36. Rd3+ Bd5 37. Bxc8+ Kxc8 38. Rxd5 Kb7 39. Ke3 Re6+ 40. Kd3 Rc6 
41. Rd8 Rxc7 42. Bxc7 Kxc7 43. Rd5 Kc6 44. Kd4 f6 45. Rf5 Kd7 46. Rxf6 Ke7 47. Rxb6 Kd7 48. Rh6 Ke7 
49. Rxh7+ Kf6 50. Ke4 Kg6 51. Rh5 Kxh5 52. f4 Kg6 53. Ke5 Kf7 54. b3 Ke7 55. f5 Kf7 56. f6 Kg6 
57. b4 Kf7 58. b5 Kg6 59. b6 Kg5 60. f7 Kg4 61. f8=Q Kg3 62. Ke4 Kg2 63. b7 Kg3 64. Qf4+ Kh3 
65. Qd6 Kg2 66. b8=Q Kf2 67. Qd1 Kg2 68. Qdd6 Kf2 69. Qd1 Kg2 70. Qh8 Kg3 71. Qg8+ Kf2 72. Kf5 Ke3 
73. Qg5+ Kf2 74. Kg4 Kg2 75. Kf5+ Kf2 76. Qgg4 Ke3 77. Qge2# 1-0
```

Phases: frozen 13 · cold 4 · critical 8 · hot 49 · mean T 197.35 · max T 5037.32

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | d5 | 1.77 | hot | +0.72 | 3 |
| 3 | Nxd5 | 1.25 | hot | +1.12 | 3 |
| 5 | Nxc3 | 2.30 | critical | +0.62 | 2 |
| 7 | Nxa2 | 1.54 | hot | -1.57 | 3 |
| 9 | Be6 | 1.51 | hot | -0.81 | 3 |
| 11 | Nc6 | 1.87 | hot | -0.23 | 3 |
| 13 | Bg7 | 1.04 | hot | +0.25 | 2 |
| 15 | Ne5 | 1.13 | critical | +0.39 | 2 |
| 17 | Bc8 | 1.97 | hot | +0.92 | 3 |
| 19 | g5 | 1.06 | hot | +0.49 | 2 |
| 21 | Nf3+ | 3.00 | hot | +2.15 | 2 |
| 23 | Qd6 | 2.98 | hot | +6.61 | 2 |
| 25 | b6 | 1.94 | hot | +4.60 | 2 |
| 27 | gxh4 | 1.88 | hot | +3.66 | 2 |
| 29 | Bxc3+ | 2.10 | hot | +3.24 | 2 |
| 31 | Rg8 | 3.08 | hot | +7.69 | 2 |
| 33 | c6 | 2.37 | hot | +6.19 | 2 |
| 35 | Qxc6 | 28.82 | hot | +41.53 | 2 |
| 37 | Rg6 | 5.34 | hot | +7.71 | 3 |
| 39 | Rd6+ | 2.60 | hot | +3.33 | 3 |
| 41 | e5 | 4.38 | hot | +6.63 | 3 |
| 43 | h3 | 3.03 | hot | +8.20 | 2 |
| 45 | exf4 | 2.30 | hot | +5.12 | 2 |
| 47 | Ke7 | 3.30 | critical | +4.72 | 3 |
| 49 | Rf6 | 2.19 | hot | +5.29 | 3 |
| 51 | a6 | 1.17 | hot | +4.88 | 2 |
| 53 | Bb7 | 1.18 | hot | +5.01 | 2 |
| 55 | Bxe4+ | 1.06 | critical | +3.13 | 2 |
| 57 | Rc8 | 1.39 | cold | +4.70 | 2 |
| 59 | h2 | 3.41 | hot | +7.18 | 3 |
| 61 | h1=Q | 2.46 | hot | +4.63 | 2 |
| 63 | Bxh1 | 3.04 | hot | +5.13 | 2 |
| 65 | Kd7 | 9.41 | hot | +7.36 | 3 |
| 67 | Bd5 | 28.18 | hot | +18.43 | 3 |
| 69 | Kxc8 | 2.89 | cold | +8.64 | 4 |
| 71 | Kb7 | 5.74 | hot | +10.08 | 4 |
| 73 | Re6+ | 1.41 | critical | +4.26 | 3 |
| 75 | Rc6 | 1.81 | hot | +5.49 | 3 |
| 77 | Rxc7 | 1.66 | critical | +7.33 | 4 |
| 79 | Kxc7 | 2.66 | critical | +8.13 | 5 |
| 81 | Kc6 | 4.94 | hot | +9.29 | 5 |
| 83 | f6 | 3.49 | hot | +8.73 | 5 |
| 85 | Kd7 | 9.08 | hot | +13.52 | 5 |
| 87 | Ke7 | 7.21 | hot | +12.44 | 5 |
| 89 | Kd7 | 19.05 | hot | +21.95 | 5 |
| 91 | Ke7 | 294.28 | hot | +230.11 | 6 |
| 93 | Kf6 | 176.68 | hot | +136.18 | 6 |
| 95 | Kg6 | 79.96 | hot | +68.91 | 6 |
| 97 | Kxh5 | 5.93 | critical | +8.79 | 6 |
| 99 | Kg6 | 3.31 | hot | +4.67 | 9 |
| 101 | Kf7 | 3.42 | hot | +4.78 | 9 |
| 103 | Ke7 | 1.62 | hot | +3.27 | 9 |
| 105 | Kf7 | 6.40 | hot | +7.09 | 9 |
| 107 | Kg6 | 12.09 | hot | +12.02 | 8 |
| 109 | Kf7 | 11.97 | hot | +11.06 | 8 |
| 111 | Kg6 | 9.29 | hot | +14.81 | 8 |
| 113 | Kg5 | 1157.64 | hot | +844.57 | 8 |
| 115 | Kg4 | 2824.12 | hot | +1951.78 | 7 |
| 117 | Kg3 | 4777.82 | hot | +3345.36 | 7 |
| 119 | Kg2 | 5037.32 | cold | +3761.23 | 7 |
| 121 | Kg3 | 0.00 | frozen | +49997.00 | 7 |
| 123 | Kh3 | 0.00 | frozen | +49997.00 | 7 |
| 125 | Kg2 | 0.00 | frozen | +49997.00 | 7 |
| 127 | Kf2 | 0.00 | frozen | +49998.00 | 6 |
| 129 | Kg2 | 0.00 | frozen | +49998.00 | 7 |
| 131 | Kf2 | 3.98 | frozen | +0.00 | 6 |
| 133 | Kg2 | 1.00 | frozen | +0.00 | 64 |
| 135 | Kg3 | 0.00 | frozen | +49999.00 | 7 |
| 137 | Kf2 | 0.00 | frozen | +49999.00 | 6 |
| 139 | Ke3 | 0.00 | frozen | +49999.00 | 7 |
| 141 | Kf2 | 0.00 | frozen | +49999.00 | 7 |
| 143 | Kg2 | 0.00 | frozen | +49999.00 | 8 |
| 145 | Kf2 | 1.39 | cold | +0.00 | 8 |
| 147 | Ke3 | 0.00 | frozen | +49999.00 | 8 |

### Game 9: French — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "9"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "French"]
[Result "0-1"]
[Termination "checkmate"]

1. e4 e6 2. d4 d5 3. Bb5+ c6 4. Bd3 dxe4 5. Bxe4 c5 6. dxc5 Nd7 7. c6 bxc6 8. Bxc6 Rb8 
9. Qd4 Ba6 10. Qxa7 Nf6 11. Qxa6 Bc5 12. Qc4 O-O 13. Bg5 Qb6 14. Bxd7 Bxf2+ 15. Ke2 Bxg1 16. Rxg1 Qxg1 
17. Bxf6 Qxg2+ 18. Ke3 gxf6 19. Bc6 Qg1+ 20. Ke2 Rfd8 21. Qf4 Rbc8 22. Be4 f5 23. Bd3 Rxd3 24. Kxd3 Qd1+ 
25. Ke3 Qc1+ 26. Kf3 Qxb2 27. Qg5+ Kh8 28. Qf6+ Qxf6 29. c3 Rg8 30. Ke2 Qe5+ 31. Kf2 Qf4+ 32. Ke1 Rg2 
33. Na3 Qf3 34. Nb5 Qe2# 0-1
```

Phases: frozen 2 · cold 5 · critical 2 · hot 23 · mean T 7.05 · max T 93.73

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Bb5+ | 1.27 | hot | -0.86 | 2 |
| 2 | Bd3 | 2.05 | hot | -1.72 | 3 |
| 4 | Bxe4 | 1.93 | hot | -1.30 | 3 |
| 6 | dxc5 | 1.36 | hot | -1.26 | 2 |
| 8 | c6 | 1.74 | hot | -0.65 | 2 |
| 10 | Bxc6 | 1.05 | hot | +0.50 | 2 |
| 12 | Qd4 | 1.03 | hot | -0.03 | 2 |
| 14 | Qxa7 | 1.03 | hot | +1.46 | 2 |
| 16 | Qxa6 | 1.10 | cold | +4.84 | 2 |
| 18 | Qc4 | 1.04 | hot | +5.23 | 2 |
| 20 | Bg5 | 1.08 | hot | +5.16 | 2 |
| 22 | Bxd7 | 5.60 | hot | -0.83 | 2 |
| 24 | Ke2 | 10.79 | hot | -9.88 | 2 |
| 26 | Rxg1 | 2.92 | hot | +2.74 | 2 |
| 28 | Bxf6 | 4.17 | hot | -1.76 | 2 |
| 30 | Ke3 | 15.90 | hot | -7.09 | 3 |
| 32 | Bc6 | 2.66 | hot | -3.05 | 2 |
| 34 | Ke2 | 3.44 | hot | -2.40 | 3 |
| 36 | Qf4 | 3.00 | hot | -4.32 | 2 |
| 38 | Be4 | 1.96 | critical | -0.91 | 3 |
| 40 | Bd3 | 1.69 | critical | -1.05 | 3 |
| 42 | Kxd3 | 1.70 | cold | +1.69 | 3 |
| 44 | Ke3 | 1.57 | cold | +0.01 | 4 |
| 46 | Kf3 | 4.38 | cold | -0.08 | 3 |
| 48 | Qg5+ | 4.10 | hot | -3.66 | 3 |
| 50 | Qf6+ | 17.33 | hot | -14.68 | 2 |
| 52 | c3 | 4.66 | hot | -15.76 | 4 |
| 54 | Ke2 | 5.13 | hot | -15.09 | 4 |
| 56 | Kf2 | 26.21 | hot | -34.32 | 4 |
| 58 | Ke1 | 93.73 | cold | -80.47 | 5 |
| 60 | Na3 | 0.00 | frozen | -49998.00 | 4 |
| 62 | Nb5 | 0.00 | frozen | -49999.00 | 4 |

### Game 10: French — engine as Black — 1-0

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "10"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "French"]
[Result "1-0"]
[Termination "checkmate"]

1. e4 e6 2. d4 d5 3. e5 Bb4+ 4. Bd2 Bxd2+ 5. Nxd2 Qh4 6. Ndf3 Qe4+ 7. Ne2 h6 8. h4 Nc6 
9. Nd2 Qg4 10. c3 f6 11. f3 Qf5 12. g4 Qd3 13. Rh3 fxe5 14. f4 Qb5 15. a4 Qxb2 16. Rb1 Qa3 
17. Rb3 Qxa4 18. fxe5 Na5 19. Rb4 Qxd1+ 20. Kxd1 Nc6 21. Rb2 h5 22. g5 Nxe5 23. dxe5 Ne7 24. Nf4 O-O 
25. Rf3 Nc6 26. Nd3 Rxf3 27. Nxf3 Nxe5 28. Nfxe5 d4 29. c4 Bd7 30. Bg2 Ba4+ 31. Kc1 Rf8 32. Rxb7 a5 
33. Kb1 Bd1 34. Rxc7 Rb8+ 35. Ka1 Bc2 36. Rb7 Rxb7 37. Bxb7 Bxd3 38. Nxd3 Kf7 39. Be4 Ke7 40. Kb2 a4 
41. Ka2 Kd7 42. g6 Kc7 43. Kb2 a3+ 44. Kxa3 Kd7 45. Ka4 Kc7 46. c5 Kd7 47. Ka5 Kc7 48. Bh1 Kd7 
49. c6+ Kc7 50. Be4 Kd8 51. Kb6 Ke7 52. Bg2 e5 53. Be4 Kd6 54. c7 Kd7 55. Nc5+ Ke7 56. c8=Q d3 
57. Nxd3 Kd6 58. Bf5 Ke7 59. Kc6 e4 60. Qc7+ Ke8 61. Qc8+ Ke7 62. Nf4 e3 63. Ne2 Kf6 64. Qe6# 1-0
```

Phases: frozen 8 · cold 3 · critical 2 · hot 48 · mean T 8.73 · max T 100.19

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | Bb4+ | 1.44 | hot | -0.23 | 3 |
| 3 | Bxd2+ | 2.84 | hot | -1.49 | 3 |
| 5 | Qh4 | 1.61 | hot | +0.36 | 3 |
| 7 | Qe4+ | 1.61 | hot | -0.99 | 3 |
| 9 | h6 | 1.32 | hot | +0.21 | 3 |
| 11 | Nc6 | 1.31 | hot | +0.26 | 3 |
| 13 | Qg4 | 1.36 | hot | +0.27 | 3 |
| 15 | f6 | 1.06 | hot | +0.93 | 2 |
| 17 | Qf5 | 1.03 | hot | -0.12 | 1 |
| 19 | Qd3 | 1.42 | hot | +0.40 | 3 |
| 21 | fxe5 | 1.07 | hot | +0.49 | 2 |
| 23 | Qb5 | 1.07 | cold | +0.44 | 2 |
| 25 | Qxb2 | 1.73 | hot | +0.33 | 2 |
| 27 | Qa3 | 2.59 | cold | +2.01 | 2 |
| 29 | Qxa4 | 1.76 | hot | -0.50 | 2 |
| 31 | Na5 | 1.02 | hot | -1.43 | 2 |
| 33 | Qxd1+ | 11.21 | hot | -8.98 | 3 |
| 35 | Nc6 | 1.54 | hot | -2.55 | 3 |
| 37 | h5 | 1.73 | hot | -1.49 | 3 |
| 39 | Nxe5 | 1.74 | hot | -1.06 | 3 |
| 41 | Ne7 | 2.02 | hot | +1.10 | 3 |
| 43 | O-O | 1.97 | hot | -0.04 | 3 |
| 45 | Nc6 | 1.75 | hot | +1.99 | 2 |
| 47 | Rxf3 | 3.58 | hot | -2.26 | 3 |
| 49 | Nxe5 | 2.31 | hot | +1.10 | 3 |
| 51 | d4 | 3.23 | hot | +3.60 | 3 |
| 53 | Bd7 | 7.20 | hot | +8.65 | 4 |
| 55 | Ba4+ | 1.46 | critical | +3.15 | 4 |
| 57 | Rf8 | 5.75 | hot | +5.64 | 3 |
| 59 | a5 | 4.93 | hot | +6.41 | 3 |
| 61 | Bd1 | 3.71 | hot | +5.42 | 3 |
| 63 | Rb8+ | 1.56 | hot | +3.50 | 3 |
| 65 | Bc2 | 2.33 | hot | +4.77 | 3 |
| 67 | Rxb7 | 4.13 | critical | +2.78 | 3 |
| 69 | Bxd3 | 4.49 | hot | +7.67 | 4 |
| 71 | Kf7 | 16.43 | hot | +16.94 | 5 |
| 73 | Ke7 | 13.85 | hot | +15.05 | 5 |
| 75 | a4 | 18.45 | hot | +18.51 | 5 |
| 77 | Kd7 | 16.17 | hot | +17.22 | 5 |
| 79 | Kc7 | 12.06 | hot | +13.94 | 5 |
| 81 | a3+ | 6.92 | hot | +9.25 | 5 |
| 83 | Kd7 | 17.72 | hot | +18.96 | 5 |
| 85 | Kc7 | 16.46 | hot | +18.19 | 5 |
| 87 | Kd7 | 19.18 | hot | +20.12 | 5 |
| 89 | Kc7 | 16.64 | hot | +18.55 | 5 |
| 91 | Kd7 | 56.17 | hot | +50.45 | 6 |
| 93 | Kc7 | 12.36 | hot | +14.40 | 5 |
| 95 | Kd8 | 14.78 | hot | +17.02 | 5 |
| 97 | Ke7 | 28.55 | hot | +26.26 | 5 |
| 99 | e5 | 27.28 | hot | +27.13 | 5 |
| 101 | Kd6 | 36.67 | hot | +35.06 | 5 |
| 103 | Kd7 | 100.19 | hot | +83.60 | 5 |
| 105 | Ke7 | 10.94 | cold | +24.78 | 5 |
| 107 | d3 | 0.00 | frozen | +49998.00 | 6 |
| 109 | Kd6 | 0.00 | frozen | +49998.00 | 6 |
| 111 | Ke7 | 0.00 | frozen | +49998.00 | 6 |
| 113 | e4 | 0.00 | frozen | +49998.00 | 6 |
| 115 | Ke8 | 0.00 | frozen | +49998.00 | 6 |
| 117 | Ke7 | 1.00 | frozen | +0.00 | 64 |
| 119 | e3 | 0.00 | frozen | +49999.00 | 6 |
| 121 | Kf6 | 0.00 | frozen | +49999.00 | 7 |

### Game 11: English (reversed Sicilian) — engine as White — 0-1

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "11"]
[White "ThermoEngine"]
[Black "Stockfish (Elo 1600)"]
[Opening "English (reversed Sicilian)"]
[Result "0-1"]
[Termination "checkmate"]

1. c4 e5 2. Nc3 Nf6 3. Nf3 d6 4. Qa4+ Qd7 5. Qxd7+ Bxd7 6. Nb5 Kd8 7. Ng5 Bxb5 8. Nxf7+ Ke8 
9. Nxh8 Bxc4 10. d3 Bg8 11. e4 Be7 12. Be2 a5 13. Be3 Nc6 14. Rc1 Kf8 15. b3 a4 16. bxa4 Nd7 
17. Bg4 Nc5 18. Ng6+ hxg6 19. Bxc5 dxc5 20. Rb1 b6 21. Bd7 Nd8 22. Rb2 Bf6 23. h4 Ra7 24. h5 Ke7 
25. Bb5 gxh5 26. Rxh5 Be6 27. d4 Bf7 28. Rxe5+ Kf8 29. Rf5 Ne6 30. Rxf6 gxf6 31. d5 Nd8 32. f3 Nb7 
33. g4 Nd6 34. Bc6 Ra5 35. Rh2 Be8 36. Bxe8 Nxe8 37. Rh8+ Kf7 38. Rh7+ Ng7 39. Rh2 Ra8 40. d6 Rc8 
41. d7 Rd8 42. Rd2 Ne6 43. Kf2 Ke7 44. Rd1 Rxd7 45. Rxd7+ Kxd7 46. e5 fxe5 47. Ke2 c4 48. Kd2 Kd6 
49. Kc3 Kc5 50. Kd2 Kd6 51. Kc3 Kd5 52. Kd2 Kd4 53. Ke2 Kc5 54. Kd2 Kb4 55. a3+ Kc5 56. a5 bxa5 
57. f4 exf4 58. Ke2 Kd4 59. Kf2 c3 60. Ke2 a4 61. g5 Nxg5 62. Kf2 Ke4 63. Ke2 c5 64. Kf2 c2 
65. Kg2 Nf3 66. Kf1 Ke3 67. Kg2 Ke4 68. Kf1 Ne5 69. Kf2 c1=Q 70. Kg2 Nf3 71. Kf2 c4 72. Kg2 Qd1 
73. Kf2 Qa1 74. Kg2 Qd1 75. Kf2 Qe1+ 76. Kg2 Ne5 77. Kh2 f3 78. Kh3 Qg1 79. Kh4 Qg2 80. Kh5 Qg1 
81. Kh4 c3 82. Kh5 Qg3 83. Kh6 Qg6# 0-1
```

Phases: frozen 14 · cold 5 · critical 3 · hot 59 · mean T 432.37 · max T 20098.96

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 0 | Nf3 | 1.42 | hot | -0.30 | 3 |
| 2 | Qa4+ | 1.43 | hot | +0.50 | 3 |
| 4 | Qxd7+ | 1.70 | hot | -1.16 | 2 |
| 6 | Nb5 | 1.46 | hot | +0.73 | 3 |
| 8 | Ng5 | 1.64 | hot | +0.77 | 3 |
| 10 | Nxf7+ | 14.14 | hot | -8.82 | 2 |
| 12 | Nxh8 | 3.09 | critical | +3.56 | 3 |
| 14 | d3 | 1.55 | critical | +4.89 | 3 |
| 16 | e4 | 1.79 | hot | +3.34 | 3 |
| 18 | Be2 | 1.66 | hot | +3.52 | 3 |
| 20 | Be3 | 1.55 | hot | +3.61 | 3 |
| 22 | Rc1 | 1.64 | hot | +3.42 | 3 |
| 24 | b3 | 1.50 | hot | +2.33 | 2 |
| 26 | bxa4 | 1.86 | hot | +2.30 | 2 |
| 28 | Bg4 | 1.93 | hot | +3.18 | 2 |
| 30 | Ng6+ | 3.02 | hot | +2.28 | 2 |
| 32 | Bxc5 | 2.99 | hot | -0.33 | 2 |
| 34 | Rb1 | 3.52 | hot | -1.29 | 3 |
| 36 | Bd7 | 3.15 | hot | -0.34 | 3 |
| 38 | Rb2 | 1.70 | hot | +0.08 | 3 |
| 40 | h4 | 1.38 | hot | +0.53 | 3 |
| 42 | h5 | 1.08 | hot | -0.12 | 2 |
| 44 | Bb5 | 1.51 | critical | +0.05 | 3 |
| 46 | Rxh5 | 1.02 | hot | -0.30 | 2 |
| 48 | d4 | 1.46 | hot | +0.07 | 3 |
| 50 | Rxe5+ | 2.74 | hot | -1.28 | 2 |
| 52 | Rf5 | 3.92 | hot | -3.52 | 2 |
| 54 | Rxf6 | 2.76 | hot | -0.47 | 2 |
| 56 | d5 | 2.12 | hot | -0.73 | 3 |
| 58 | f3 | 1.09 | hot | -0.52 | 3 |
| 60 | g4 | 1.10 | hot | -0.59 | 3 |
| 62 | Bc6 | 1.25 | hot | -0.80 | 3 |
| 64 | Rh2 | 1.07 | hot | -0.68 | 3 |
| 66 | Bxe8 | 3.72 | hot | +0.78 | 3 |
| 68 | Rh8+ | 1.72 | hot | +0.21 | 3 |
| 70 | Rh7+ | 1.52 | hot | -0.48 | 3 |
| 72 | Rh2 | 1.89 | hot | -1.44 | 3 |
| 74 | d6 | 3.32 | hot | -2.79 | 3 |
| 76 | d7 | 1.56 | hot | +0.26 | 3 |
| 78 | Rd2 | 1.49 | hot | -0.71 | 3 |
| 80 | Kf2 | 1.35 | hot | -1.39 | 3 |
| 82 | Rd1 | 2.06 | hot | -1.53 | 3 |
| 84 | Rxd7+ | 3.15 | hot | +0.15 | 3 |
| 86 | e5 | 1.35 | hot | -3.54 | 4 |
| 88 | Ke2 | 1.71 | hot | -4.01 | 5 |
| 90 | Kd2 | 2.05 | hot | -5.39 | 4 |
| 92 | Kc3 | 2.10 | hot | -4.13 | 5 |
| 94 | Kd2 | 1.97 | hot | -4.25 | 5 |
| 96 | Kc3 | 1.71 | cold | +0.00 | 5 |
| 98 | Kd2 | 2.06 | hot | -4.29 | 5 |
| 100 | Ke2 | 2.27 | hot | -4.51 | 5 |
| 102 | Kd2 | 1.69 | cold | +0.00 | 5 |
| 104 | a3+ | 2.51 | hot | -5.19 | 5 |
| 106 | a5 | 2.17 | hot | -4.55 | 5 |
| 108 | f4 | 2.99 | hot | -6.05 | 5 |
| 110 | Ke2 | 7.50 | hot | -12.11 | 6 |
| 112 | Kf2 | 9.82 | hot | -13.97 | 6 |
| 114 | Ke2 | 13.93 | hot | -20.57 | 6 |
| 116 | g5 | 19.99 | hot | -23.96 | 6 |
| 118 | Kf2 | 129.82 | hot | -101.80 | 7 |
| 120 | Ke2 | 113.10 | hot | -90.09 | 7 |
| 122 | Kf2 | 97.37 | hot | -78.74 | 7 |
| 124 | Kg2 | 11561.36 | hot | -8367.60 | 7 |
| 126 | Kf1 | 0.00 | frozen | -49997.00 | 7 |
| 128 | Kg2 | 20098.96 | frozen | -15004.87 | 7 |
| 130 | Kf1 | 1.55 | cold | +0.00 | 8 |
| 132 | Kf2 | 2844.11 | hot | -2166.71 | 6 |
| 134 | Kg2 | 0.00 | frozen | -49997.00 | 8 |
| 136 | Kf2 | 0.00 | frozen | -49998.00 | 7 |
| 138 | Kg2 | 0.00 | frozen | -49998.00 | 8 |
| 140 | Kf2 | 0.00 | frozen | -49998.00 | 7 |
| 142 | Kg2 | 0.00 | frozen | -49998.00 | 7 |
| 144 | Kf2 | 1.21 | cold | +0.00 | 8 |
| 146 | Kg2 | 0.00 | frozen | -49998.00 | 8 |
| 148 | Kh2 | 0.00 | frozen | -49998.00 | 8 |
| 150 | Kh3 | 0.00 | frozen | -49998.00 | 8 |
| 152 | Kh4 | 0.00 | frozen | -49999.00 | 8 |
| 154 | Kh5 | 0.00 | frozen | -49998.00 | 8 |
| 156 | Kh4 | 1.22 | cold | +0.00 | 8 |
| 158 | Kh5 | 0.00 | frozen | -49998.00 | 7 |
| 160 | Kh6 | 0.00 | frozen | -49999.00 | 8 |

### Game 12: English (reversed Sicilian) — engine as Black — 1/2-1/2

```
[Event "Thermodynamic engine vs Stockfish 1600"]
[Round "12"]
[White "Stockfish (Elo 1600)"]
[Black "ThermoEngine"]
[Opening "English (reversed Sicilian)"]
[Result "1/2-1/2"]
[Termination "threefold repetition"]

1. c4 e5 2. Nc3 Nf6 3. d4 exd4 4. Nb5 Bb4+ 5. Bd2 Bxd2+ 6. Qxd2 Ne4 7. Qxd4 Nc6 8. Qxe4+ Kf8 
9. Qd5 a6 10. Nd4 Nxd4 11. Rc1 Qh4 12. Rd1 Nc2+ 13. Kd2 Nb4 14. Qc5+ Qe7 15. Qxc7 Qg5+ 16. e3 Qf6 
17. Qc5+ Qe7 18. Qxe7+ Kxe7 19. Kc3 Nxa2+ 20. Kb3 Nc1+ 21. Rxc1 d6 22. Nf3 Bf5 23. Ra1 a5 24. Ka2 Be4 
25. Rd1 Bc2 26. Rc1 Be4 27. Be2 h5 28. Nd4 Bxg2 29. Rhe1 Be4 30. h4 a4 31. Bf1 b6 32. Nb5 Rh6 
33. f4 Kd7 34. Red1 Bf3 35. Rd3 Be4 36. Rdc3 f5 37. Bd3 Bxd3 38. Rxd3 Rc8 39. Nd4 Rf6 40. Ra3 d5 
41. Nb5 Rxc4 42. Rd1 Kc6 43. Na7+ Kb7 44. Nb5 Kc6 45. Nd4+ Kd7 46. Nb5 Kc6 1/2-1/2
```

Phases: frozen 0 · cold 1 · critical 2 · hot 41 · mean T 1.78 · max T 9.32

| ply | move | T | phase | eval (♙) | depth |
|---|---|---|---|---|---|
| 1 | exd4 | 1.43 | hot | +0.89 | 2 |
| 3 | Bb4+ | 1.95 | critical | -0.88 | 2 |
| 5 | Bxd2+ | 4.71 | hot | +1.56 | 2 |
| 7 | Ne4 | 2.57 | hot | +2.11 | 2 |
| 9 | Nc6 | 3.69 | hot | +5.04 | 2 |
| 11 | Kf8 | 2.68 | hot | +4.54 | 3 |
| 13 | a6 | 1.19 | hot | +3.85 | 2 |
| 15 | Nxd4 | 1.32 | hot | +3.41 | 2 |
| 17 | Qh4 | 1.77 | hot | +1.00 | 3 |
| 19 | Nc2+ | 1.45 | critical | -0.70 | 3 |
| 21 | Nb4 | 1.29 | hot | +0.76 | 2 |
| 23 | Qe7 | 1.21 | hot | +0.14 | 3 |
| 25 | Qg5+ | 1.01 | hot | +1.15 | 2 |
| 27 | Qf6 | 1.00 | hot | +1.40 | 2 |
| 29 | Qe7 | 1.33 | hot | +1.16 | 3 |
| 31 | Kxe7 | 1.19 | cold | +1.70 | 5 |
| 33 | Nxa2+ | 1.70 | hot | +1.10 | 3 |
| 35 | Nc1+ | 9.32 | hot | -1.99 | 3 |
| 37 | d6 | 1.72 | hot | +3.66 | 3 |
| 39 | Bf5 | 1.74 | hot | +3.35 | 3 |
| 41 | a5 | 1.65 | hot | +3.38 | 3 |
| 43 | Be4 | 1.26 | hot | +2.56 | 3 |
| 45 | Bc2 | 1.44 | hot | +2.29 | 3 |
| 47 | Be4 | 1.70 | hot | +3.18 | 3 |
| 49 | h5 | 1.64 | hot | +3.47 | 3 |
| 51 | Bxg2 | 1.01 | hot | +2.31 | 2 |
| 53 | Be4 | 1.83 | hot | +2.48 | 3 |
| 55 | a4 | 1.45 | hot | +2.25 | 3 |
| 57 | b6 | 1.21 | hot | +1.51 | 3 |
| 59 | Rh6 | 1.22 | hot | +1.53 | 3 |
| 61 | Kd7 | 1.13 | hot | +1.41 | 3 |
| 63 | Bf3 | 1.08 | hot | +2.43 | 2 |
| 65 | Be4 | 1.03 | hot | +2.43 | 2 |
| 67 | f5 | 1.10 | hot | +1.31 | 3 |
| 69 | Bxd3 | 1.18 | hot | +1.73 | 2 |
| 71 | Rc8 | 1.09 | hot | +3.28 | 2 |
| 73 | Rf6 | 1.93 | hot | +2.62 | 3 |
| 75 | d5 | 1.83 | hot | +2.94 | 3 |
| 77 | Rxc4 | 2.05 | hot | +2.03 | 3 |
| 79 | Kc6 | 1.53 | hot | +1.09 | 3 |
| 81 | Kb7 | 1.08 | hot | +0.55 | 3 |
| 83 | Kc6 | 1.68 | hot | +0.00 | 3 |
| 85 | Kd7 | 1.26 | hot | +1.19 | 3 |
| 87 | Kc6 | 1.62 | hot | +0.00 | 3 |
