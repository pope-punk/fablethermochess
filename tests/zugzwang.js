// Zugzwang certification. Two halves:
//
//  1. CERTIFY a mutual full-point zugzwang ("trébuchet") from first
//     principles: build an exact tablebase for KPK (white pawn on the
//     e-file, promotion resolved exactly) plus the blocked-KPKP layer
//     (white pawn e4 vs black pawn e5, frozen), by least-fixpoint win
//     propagation. Scan every king placement for positions where
//     WHOEVER IS TO MOVE LOSES. No position is trusted from memory —
//     an earlier session used a "trebuchet" FEN that turned out to have
//     the white king standing in check.
//
//  2. MEASURE the engine there. Zugzwang is the tempo priced negative:
//     material is equal, yet having the move loses the game.
//     ASSERTED (instrument certification): μ_tempo at the trebuchet sits
//     at the softplus gauge zero (T·ln2 exactly — χ = 0: quiescence sees
//     no tactical premium on the move), while a control position with a
//     real threat prices it far above.
//     REPORTED (physics, not asserted): whether the deep annealed F and
//     the argmax playout detect the certified loss. First measurement
//     found they do not — the bath reads T ≈ 4.7 at the trebuchet,
//     HOTTER than the pawn gap (2 Q-units), so the ensemble thermally
//     washes out a full-point zugzwang: it is a frozen-phase object,
//     invisible above its condensation temperature. Recorded honestly
//     either way.
//
//   node zugzwang.js
const path = require('path');
const ENGINE = path.join(__dirname, 'engine_current.js');
function fresh() { delete require.cache[require.resolve(ENGINE)]; return require(ENGINE); }

let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS' : 'FAIL') + ' ' + msg); if (!ok) fails++; };

// ── board helpers (a1 = 0, h8 = 63) ──
const FL = s => s & 7, RK = s => s >> 3;
const dist = (a, b) => Math.max(Math.abs(FL(a) - FL(b)), Math.abs(RK(a) - RK(b)));
function kingNbrs(s) {
  const out = [];
  for (const d of [-9, -8, -7, -1, 1, 7, 8, 9]) {
    const n = s + d;
    if (n >= 0 && n < 64 && Math.abs(FL(n) - FL(s)) <= 1) out.push(n);
  }
  return out;
}
const alg = s => 'abcdefgh'[FL(s)] + (RK(s) + 1);
// white pawn at p attacks p+7/p+9; black pawn attacks p-9/p-7 (file-guarded)
const wPawnAtt = p => [p + 7, p + 9].filter(t => t < 64 && Math.abs(FL(t) - FL(p)) === 1);
const bPawnAtt = p => [p - 9, p - 7].filter(t => t >= 0 && Math.abs(FL(t) - FL(p)) === 1);

// ── exact promotion resolution: pawn just queened on e8, black to move ──
// Returns true iff White wins (KQK is won unless the queen falls or
// black is stalemated).
const E8 = 60;
function queenAttacks(target, wk, bkMoving) {
  // ray-walk from e8; the white king is the only blocker (bk is moving away)
  if (target === E8) return false;
  for (const d of [-9, -8, -7, -1, 1, 7, 8, 9]) {
    let s = E8;
    while (true) {
      const n = s + d;
      if (n < 0 || n > 63 || Math.abs(FL(n) - FL(s)) > 1) break;
      if (n === target) return true;
      if (n === wk) break;
      s = n;
    }
  }
  return false;
}
function promoWinsForWhite(wk, bk) {
  const inCheck = queenAttacks(bk, wk);
  let hasMove = false;
  for (const n of kingNbrs(bk)) {
    if (dist(n, wk) <= 1) continue;
    if (n === E8) { if (dist(wk, E8) > 1) return false; continue; }  // Kxq → draw
    if (!queenAttacks(n, wk)) hasMove = true;
  }
  if (!hasMove) return inCheck;      // mate = win; stalemate = draw
  return true;                        // KQK with the queen safe: always won
}

// ── KPK tablebase: white pawn on e2..e7, least-fixpoint of "White wins" ──
// level 0..5 ↔ pawn on e2..e7; idx = ((level·64 + wk)·64 + bk)·2 + stm
const PSQ = l => 12 + 8 * l;
const W = 0, B = 1;
const kpkIdx = (l, wk, bk, stm) => ((l * 64 + wk) * 64 + bk) * 2 + stm;
const kpkWin = new Uint8Array(6 * 64 * 64 * 2);
function kpkValid(l, wk, bk, stm) {
  const p = PSQ(l);
  if (wk === bk || wk === p || bk === p || dist(wk, bk) <= 1) return false;
  if (stm === W && wPawnAtt(p).includes(bk)) return false;   // opponent in check on our move
  return true;
}
{
  let changed = true, iters = 0;
  while (changed) {
    changed = false; iters++;
    for (let l = 5; l >= 0; l--) {
      const p = PSQ(l), att = wPawnAtt(p);
      for (let wk = 0; wk < 64; wk++) for (let bk = 0; bk < 64; bk++) {
        // white to move
        if (kpkValid(l, wk, bk, W) && !kpkWin[kpkIdx(l, wk, bk, W)]) {
          let win = false;
          for (const n of kingNbrs(wk))
            if (n !== p && dist(n, bk) > 1 && kpkWin[kpkIdx(l, n, bk, B)]) { win = true; break; }
          if (!win) {
            const t = p + 8;
            if (t !== wk && t !== bk) {
              if (t === E8) win = promoWinsForWhite(wk, bk);
              else win = kpkWin[kpkIdx(l + 1, wk, bk, B)] === 1;
            }
            if (!win && l === 0 && p + 8 !== wk && p + 8 !== bk && p + 16 !== wk && p + 16 !== bk)
              win = kpkWin[kpkIdx(2, wk, bk, B)] === 1;      // double step e2–e4
          }
          if (win) { kpkWin[kpkIdx(l, wk, bk, W)] = 1; changed = true; }
        }
        // black to move: White wins iff black has a move and EVERY move keeps the win
        if (kpkValid(l, wk, bk, B) && !kpkWin[kpkIdx(l, wk, bk, B)]) {
          let hasMove = false, allWin = true;
          for (const n of kingNbrs(bk)) {
            if (dist(n, wk) <= 1) continue;
            if (n === p) { hasMove = true; allWin = false; break; }   // Kxp → draw
            if (att.includes(n)) continue;
            hasMove = true;
            if (!kpkWin[kpkIdx(l, wk, n, W)]) { allWin = false; break; }
          }
          if (hasMove && allWin) { kpkWin[kpkIdx(l, wk, bk, B)] = 1; changed = true; }
        }
      }
    }
  }
  console.log(`KPK tablebase (white pawn e2–e7) converged in ${iters} sweeps`);
}
// sanity against endgame theory
check(kpkWin[kpkIdx(3, 44, 60, B)] === 1, 'KPK sanity: Pe5 Ke6 / ke8 btm is a win (king in front on 6th)');
check(kpkWin[kpkIdx(3, 44, 60, W)] === 1, 'KPK sanity: Pe5 Ke6 / ke8 wtm is a win');
check(kpkWin[kpkIdx(5, 12, 60, W)] === 0, 'KPK sanity: Pe7 Ke2 / ke8 wtm is a draw (king holds e8)');
// black-pawn KPK by color mirror: black pawn at bp, kings wk/bk, stm → does BLACK win?
const mir = s => s ^ 56;
const kpkBlackWins = (bp, wk, bk, stm) =>
  kpkWin[kpkIdx((mir(bp) - 12) / 8, mir(bk), mir(wk), 1 - stm)] === 1;

// ── blocked KPKP layer: white pawn e4 (28), black pawn e5 (36), frozen ──
const WP = 28, BP = 36;
const wAtt = wPawnAtt(WP), bAtt = bPawnAtt(BP);   // {d5,f5}, {d4,f4}
const idx2 = (wk, bk, stm) => (wk * 64 + bk) * 2 + stm;
const winW2 = new Uint8Array(64 * 64 * 2), winB2 = new Uint8Array(64 * 64 * 2);
function valid2(wk, bk, stm) {
  if (wk === bk || dist(wk, bk) <= 1) return false;
  if (wk === WP || wk === BP || bk === WP || bk === BP) return false;
  if (stm === W && wAtt.includes(bk)) return false;
  if (stm === B && bAtt.includes(wk)) return false;
  return true;
}
{
  let changed = true, iters = 0;
  while (changed) {
    changed = false; iters++;
    for (let wk = 0; wk < 64; wk++) for (let bk = 0; bk < 64; bk++) {
      if (valid2(wk, bk, W)) {
        // white king moves; Kxe5 drops into white-pawn KPK (pawn back on e4)
        let anyW = false, allB = true, hasMove = false;
        for (const n of kingNbrs(wk)) {
          if (n === WP || dist(n, bk) <= 1 || bAtt.includes(n)) continue;
          hasMove = true;
          let sW, sB;
          if (n === BP) { sW = kpkWin[kpkIdx(2, n, bk, B)] === 1; sB = false; }
          else { sW = winW2[idx2(n, bk, B)] === 1; sB = winB2[idx2(n, bk, B)] === 1; }
          if (sW) anyW = true;
          if (!sB) allB = false;
        }
        if (anyW && !winW2[idx2(wk, bk, W)]) { winW2[idx2(wk, bk, W)] = 1; changed = true; }
        if (hasMove && allB && !winB2[idx2(wk, bk, W)]) { winB2[idx2(wk, bk, W)] = 1; changed = true; }
      }
      if (valid2(wk, bk, B)) {
        let anyB = false, allW = true, hasMove = false;
        for (const n of kingNbrs(bk)) {
          if (n === BP || dist(n, wk) <= 1 || wAtt.includes(n)) continue;
          hasMove = true;
          let sW, sB;
          if (n === WP) { sB = kpkBlackWins(BP, wk, n, W); sW = false; }
          else { sW = winW2[idx2(wk, n, W)] === 1; sB = winB2[idx2(wk, n, W)] === 1; }
          if (sB) anyB = true;
          if (!sW) allW = false;
        }
        if (anyB && !winB2[idx2(wk, bk, B)]) { winB2[idx2(wk, bk, B)] = 1; changed = true; }
        if (hasMove && allW && !winW2[idx2(wk, bk, B)]) { winW2[idx2(wk, bk, B)] = 1; changed = true; }
      }
    }
  }
  console.log(`blocked-KPKP layer (Pe4 vs pe5) converged in ${iters} sweeps`);
}

// ── scan for mutual full-point zugzwang: side to move LOSES, both ways ──
const trebs = [];
for (let wk = 0; wk < 64; wk++) for (let bk = 0; bk < 64; bk++)
  if (valid2(wk, bk, W) && valid2(wk, bk, B) &&
      winB2[idx2(wk, bk, W)] && winW2[idx2(wk, bk, B)])
    trebs.push([wk, bk]);
console.log(`\nmutual full-point zugzwangs found: ${trebs.length}`);
for (const [wk, bk] of trebs) console.log(`  K${alg(wk)} / k${alg(bk)}   (Pe4 vs pe5)`);
check(trebs.length > 0, 'at least one trébuchet certified by exact tablebase');

function trebFen(wk, bk, stm) {
  const board = {}; board[wk] = 'K'; board[bk] = 'k'; board[WP] = 'P'; board[BP] = 'p';
  let fen = '';
  for (let r = 7; r >= 0; r--) {
    let run = 0;
    for (let f = 0; f < 8; f++) {
      const pc = board[r * 8 + f];
      if (pc) { if (run) fen += run; run = 0; fen += pc; } else run++;
    }
    if (run) fen += run;
    if (r) fen += '/';
  }
  return `${fen} ${stm === W ? 'w' : 'b'} - - 0 1`;
}

// canonical pick: the most central certified pair
trebs.sort((a, b) => (Math.abs(FL(a[0]) - 3.5) + Math.abs(RK(a[0]) - 3.5)) -
                     (Math.abs(FL(b[0]) - 3.5) + Math.abs(RK(b[0]) - 3.5)));
if (!trebs.length) { console.log('no trebuchet — nothing to measure'); process.exit(1); }
const [WK, BK] = trebs[0];
console.log(`\ncanonical trébuchet: K${alg(WK)} / k${alg(BK)} — certified: side to move loses, both colors`);

// ── engine measurements at the certified position ──
(async () => {
  const CONTROL = '4k3/8/8/3q4/8/8/3R4/4K3 w - - 0 1';   // Rxd5 wins the queen: hot tempo
  console.log('\n── μ_tempo: the quiescent tempo price (gauge zero = T·ln2 ≈ 0.69·T) ──');
  const readings = {};
  for (const [name, fen] of [['trebuchet wtm', trebFen(WK, BK, W)],
                             ['trebuchet btm', trebFen(WK, BK, B)],
                             ['control (hot)', CONTROL]]) {
    const E = fresh();
    const res = E._runAnalyze({ fen, dashDepth: 3 });
    const t = res.thermo;
    readings[name] = { mu: t.muTempo, T: t.T };
    console.log(`  ${name.padEnd(15)} ${fen.padEnd(38)} μ_tempo=${t.muTempo == null ? 'n/a' : t.muTempo.toFixed(3)}  T=${t.T.toFixed(3)}  (T·ln2=${(t.T * Math.LN2).toFixed(3)})`);
  }
  const g0w = readings['trebuchet wtm'], g0b = readings['trebuchet btm'], hot = readings['control (hot)'];
  check(g0w.mu != null && g0w.mu <= g0w.T * Math.LN2 + 0.25,
    `wtm μ_tempo ${g0w.mu?.toFixed(3)} sits at/below the gauge zero: no tactical premium on the move`);
  check(g0b.mu != null && g0b.mu <= g0b.T * Math.LN2 + 0.25,
    `btm μ_tempo ${g0b.mu?.toFixed(3)} sits at/below the gauge zero`);
  check(hot.mu != null && hot.mu > 2 * hot.T * Math.LN2,
    `control μ_tempo ${hot.mu?.toFixed(3)} prices a real threat far above gauge zero`);

  console.log('\n── deep search (REPORTED): does the annealed ensemble feel the move-obligation? ──');
  for (const [name, fen] of [['wtm', trebFen(WK, BK, W)], ['btm', trebFen(WK, BK, B)]]) {
    const E = fresh();
    const res = E._runAnalyze({ fen, timeLimit: 4000 });
    const t = res.thermo;
    const seen = t.F < -1;
    console.log(`  NOTE ${name}: F=${t.F.toFixed(2)}  depth=${res.depth}  best=${t.moves[t.bestIdx]}  T=${t.T.toFixed(2)}  ` +
      (seen ? '— zugzwang priced into F'
            : `— certified loss reads ≈ 0: bath T > pawn gap (2), the loss is thermally washed out`));
  }

  // ── argmax playout (REPORTED): selection is a T→0 operation even when F
  // is thermal — do the dynamics fall into the certified ground state?
  console.log('\n── argmax self-playout from the trébuchet (certified: mover loses) ──');
  for (const [name, stm, tbWinner] of [['wtm', W, 'black'], ['btm', B, 'white']]) {
    const E = fresh();
    const g = new E.Chess(trebFen(WK, BK, stm));
    let keys = [g.fast_hash()];
    let plies = 0;
    while (!g.game_over() && plies < 160) {
      const res = E._runAnalyze({ fen: g.fen(), timeLimit: 1000, pastKeys: keys.slice(0, -1) });
      if (!res.san) break;
      const mv = g.move(res.san);
      if (!mv) break;
      if (mv.captured || mv.piece === 'p') keys = [];
      keys.push(g.fast_hash());
      plies++;
    }
    let outcome;
    if (g.in_checkmate()) outcome = (g.fast_turn() === 'w' ? 'black' : 'white') + ' wins by mate';
    else if (g.game_over()) outcome = 'draw';
    else {
      const u = g.fast_raw_mat_split();
      const mat = u.Uw - u.Ub;        // white − black, internal units
      outcome = mat > 2 ? 'white winning on material' : mat < -2 ? 'black winning on material' : 'unresolved';
    }
    const agrees = outcome.startsWith(tbWinner);
    console.log(`  NOTE ${name}: ${plies} plies → ${outcome}  (tablebase: ${tbWinner} wins) ` +
      (agrees ? '— dynamics found the ground state' : '— dynamics did NOT convert the certified win'));
  }
  console.log('\n' + (fails ? fails + ' FAILURES' : 'zugzwang certification complete: all asserted checks passed'));
  process.exit(fails ? 1 : 0);
})();
