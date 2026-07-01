// Correctness + physics invariants for the current engine.
//   node tests/extract_engine.js && node tests/suite.js
const E = require('./engine_current.js');
const { Chess } = E;

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) pass++; else fail++;
  console.log((cond ? 'PASS ' : 'FAIL ') + name + (detail !== undefined ? '  [' + detail + ']' : ''));
}
function perft(g, d) {
  if (d === 0) return 1;
  const ms = g.fast_moves();
  if (d === 1) return ms.length;
  let n = 0;
  for (const m of ms) { g.fast_make(m); n += perft(g, d - 1); g.fast_undo(); }
  return n;
}

// ── Move generation (reference perft values) ──
let g = new Chess();
check('perft(4) start = 197281', perft(g, 4) === 197281);
g = new Chess('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1');
check('perft(3) kiwipete = 97862', perft(g, 3) === 97862);
g = new Chess('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1');
check('perft(4) pos3 = 43238', perft(g, 4) === 43238);

// ── Incremental material accumulator = full scan (random walk) ──
g = new Chess();
g.fast_seed_acc();
let ok = true;
for (let i = 0; i < 300; i++) {
  const ms = g.fast_moves();
  if (!ms.length) break;
  g.fast_make(ms[Math.floor(Math.random() * ms.length)]);
  const acc = g.fast_raw_mat_split();
  g.fast_end_acc();
  const scan = g.fast_raw_mat_split();
  g.fast_seed_acc();
  if (Math.abs(acc.Uw - scan.Uw) > 1e-9 || Math.abs(acc.Ub - scan.Ub) > 1e-9) { ok = false; break; }
}
check('material accumulator = full scan over 300 random moves', ok);

// ── Microstate counting ──
g = new Chess();
const c = g.fast_mob_counts();
check('mob counts at start = 20/20', c.mw === 20 && c.mb === 20, JSON.stringify(c));

// ── Absorbing states ──
let res = E._runAnalyze({ fen: '6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1', timeLimit: 800 });
check('finds mate in 1', res.san === 'Re8#', res.san);
res = E._runAnalyze({ fen: '6k1/8/5KQ1/8/8/8/8/8 w - - 0 1', timeLimit: 1500 });
check('prefers the fastest mate', /#$/.test(res.san), res.san);

// ── Repetition awareness vs the played game ──
{
  const t = new Chess();
  const keys = [t.fast_hash()];
  for (const san of ['Nf3', 'Nf6', 'Ng1']) { t.move(san); keys.push(t.fast_hash()); }
  keys.pop();
  res = E._runAnalyze({ fen: t.fen(), timeLimit: null, dashDepth: 2, pastKeys: keys });
  const i = res.thermo.moves.indexOf('Ng8');
  check('move repeating a played position scores exactly 0', res.thermo.Qs[i] === 0, res.thermo.Qs[i]);
}

// ── Thermodynamic sanity of a real search ──
res = E._runAnalyze({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', timeLimit: 1500 });
{
  const t = res.thermo;
  check('bath T finite and ≥ zero-point', Number.isFinite(t.T) && t.T >= 1, 'T=' + t.T.toFixed(3));
  check('S ≥ 0, F finite', t.S >= 0 && Number.isFinite(t.F));
  check('C* ≥ C_eff ≥ 0', t.Cstar >= t.Ceff - 1e-9 && t.Ceff >= 0,
        'Ceff=' + t.Ceff.toFixed(3) + ' C*=' + t.Cstar.toFixed(3));
  check('phase label present', ['frozen', 'cold', 'critical', 'hot'].includes(t.phase), t.phase);
  let pSum = 0; for (const p of t.probs) pSum += p;
  check('Σπ = 1', Math.abs(pSum - 1) < 1e-9, pSum);
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
