
/* ================================================================
 * chess.js v0.10.3 (c) Jeff Hlywa, BSD license
 * Modified: castling[us]=0 (was ''), fast_hash, generate_captures
 * ================================================================ */
var Chess = function(fen) {
  var BLACK = 'b', WHITE = 'w', EMPTY = -1;
  var PAWN = 'p', KNIGHT = 'n', BISHOP = 'b', ROOK = 'r', QUEEN = 'q', KING = 'k';
  var SYMBOLS = 'pnbrqkPNBRQK';
  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];
  var PAWN_OFFSETS = { b: [16, 32, 17, 15], w: [-16, -32, -17, -15] };
  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15], r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1]
  };
  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24, 0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24, 0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24, 0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24, 2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56,53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0,56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56,53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24, 2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24, 0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24, 0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24, 0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0,20
  ];
  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1, -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];
  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };
  var FLAGS = { NORMAL:'n', CAPTURE:'c', BIG_PAWN:'b', EP_CAPTURE:'e', PROMOTION:'p', KSIDE_CASTLE:'k', QSIDE_CASTLE:'q' };
  var BITS = { NORMAL:1, CAPTURE:2, BIG_PAWN:4, EP_CAPTURE:8, PROMOTION:16, KSIDE_CASTLE:32, QSIDE_CASTLE:64 };
  var RANK_1=7, RANK_2=6, RANK_7=1, RANK_8=0;
  var SQUARES = {
    a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,
    a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,
    a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,
    a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,
    a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,
    a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,
    a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,
    a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119
  };
  var ROOKS = {
    w: [{square:SQUARES.a1,flag:BITS.QSIDE_CASTLE},{square:SQUARES.h1,flag:BITS.KSIDE_CASTLE}],
    b: [{square:SQUARES.a8,flag:BITS.QSIDE_CASTLE},{square:SQUARES.h8,flag:BITS.KSIDE_CASTLE}]
  };
  var board = new Array(128);
  var accUw = 0, accUb = 0, accActive = false;   // search-scoped x-ray eval accumulator
  var kings = { w: EMPTY, b: EMPTY };
  var turn = WHITE;
  var castling = { w: 0, b: 0 };
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};
  if (typeof fen === 'undefined') load(DEFAULT_POSITION); else load(fen);

  function clear(keep_headers) {
    if (typeof keep_headers === 'undefined') keep_headers = false;
    board = new Array(128); kings = { w: EMPTY, b: EMPTY };
    turn = WHITE; castling = { w: 0, b: 0 }; ep_square = EMPTY;
    half_moves = 0; move_number = 1; history = [];
    if (!keep_headers) header = {};
    update_setup(generate_fen());
  }
  function reset() { load(DEFAULT_POSITION); }
  function load(fen, keep_headers) {
    if (typeof keep_headers === 'undefined') keep_headers = false;
    var tokens = fen.split(/\s+/); var position = tokens[0]; var square = 0;
    if (!validate_fen(fen).valid) return false;
    clear(keep_headers);
    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);
      if (piece === '/') { square += 8; }
      else if (is_digit(piece)) { square += parseInt(piece, 10); }
      else {
        var color = piece < 'a' ? WHITE : BLACK;
        put({ type: piece.toLowerCase(), color: color }, algebraic(square)); square++;
      }
    }
    turn = tokens[1];
    if (tokens[2].indexOf('K') > -1) castling.w |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('Q') > -1) castling.w |= BITS.QSIDE_CASTLE;
    if (tokens[2].indexOf('k') > -1) castling.b |= BITS.KSIDE_CASTLE;
    if (tokens[2].indexOf('q') > -1) castling.b |= BITS.QSIDE_CASTLE;
    ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10); move_number = parseInt(tokens[5], 10);
    update_setup(generate_fen()); return true;
  }
  function validate_fen(fen) {
    var errors = { 0:'No errors.', 1:'FEN string must contain six space-delimited fields.',
      2:'6th field (move number) must be a positive integer.',
      3:'5th field (half move counter) must be a non-negative integer.',
      4:'4th field (en-passant square) is invalid.', 5:'3rd field (castling availability) is invalid.',
      6:'2nd field (side to move) is invalid.',
      7:"1st field (piece positions) does not contain 8 '/'-delimited rows.",
      8:'1st field (piece positions) is invalid [consecutive numbers].',
      9:'1st field (piece positions) is invalid [invalid piece].',
      10:'1st field (piece positions) is invalid [row too large].',
      11:'Illegal en-passant square' };
    var tokens = fen.split(/\s+/);
    if (tokens.length !== 6) return { valid:false, error_number:1, error:errors[1] };
    if (isNaN(tokens[5]) || parseInt(tokens[5],10) <= 0) return { valid:false, error_number:2, error:errors[2] };
    if (isNaN(tokens[4]) || parseInt(tokens[4],10) < 0) return { valid:false, error_number:3, error:errors[3] };
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) return { valid:false, error_number:4, error:errors[4] };
    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) return { valid:false, error_number:5, error:errors[5] };
    if (!/^(w|b)$/.test(tokens[1])) return { valid:false, error_number:6, error:errors[6] };
    var rows = tokens[0].split('/');
    if (rows.length !== 8) return { valid:false, error_number:7, error:errors[7] };
    for (var i = 0; i < rows.length; i++) {
      var sum_fields = 0, previous_was_number = false;
      for (var k = 0; k < rows[i].length; k++) {
        if (!isNaN(rows[i][k])) {
          if (previous_was_number) return { valid:false, error_number:8, error:errors[8] };
          sum_fields += parseInt(rows[i][k],10); previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) return { valid:false, error_number:9, error:errors[9] };
          sum_fields += 1; previous_was_number = false;
        }
      }
      if (sum_fields !== 8) return { valid:false, error_number:10, error:errors[10] };
    }
    if ((tokens[3][1]=='3' && tokens[1]=='w') || (tokens[3][1]=='6' && tokens[1]=='b'))
      return { valid:false, error_number:11, error:errors[11] };
    return { valid:true, error_number:0, error:errors[0] };
  }
  function generate_fen() {
    var empty = 0, fen = '';
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) { empty++; }
      else { if (empty > 0) { fen += empty; empty = 0; }
        var color = board[i].color; var piece = board[i].type;
        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }
      if ((i + 1) & 0x88) { if (empty > 0) { fen += empty; }
        if (i !== SQUARES.h1) fen += '/'; empty = 0; i += 8;
      }
    }
    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) cflags += 'K';
    if (castling[WHITE] & BITS.QSIDE_CASTLE) cflags += 'Q';
    if (castling[BLACK] & BITS.KSIDE_CASTLE) cflags += 'k';
    if (castling[BLACK] & BITS.QSIDE_CASTLE) cflags += 'q';
    cflags = cflags || '-';
    var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);
    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  }
  function set_header(args) {
    for (var i = 0; i < args.length; i += 2)
      if (typeof args[i]==='string' && typeof args[i+1]==='string') header[args[i]] = args[i+1];
    return header;
  }
  function update_setup(fen) {
    if (history.length > 0) return;
    if (fen !== DEFAULT_POSITION) { header['SetUp']='1'; header['FEN']=fen; }
    else { delete header['SetUp']; delete header['FEN']; }
  }
  function get(square) {
    var piece = board[SQUARES[square]];
    return piece ? { type:piece.type, color:piece.color } : null;
  }
  function put(piece, square) {
    if (!('type' in piece && 'color' in piece)) return false;
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) return false;
    if (!(square in SQUARES)) return false;
    var sq = SQUARES[square];
    if (piece.type == KING && !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) return false;
    board[sq] = { type:piece.type, color:piece.color };
    if (piece.type === KING) kings[piece.color] = sq;
    update_setup(generate_fen()); return true;
  }
  function remove(square) {
    var piece = get(square); board[SQUARES[square]] = null;
    if (piece && piece.type === KING) kings[piece.color] = EMPTY;
    update_setup(generate_fen()); return piece;
  }
  function build_move(board, from, to, flags, promotion) {
    var move = { color:turn, from:from, to:to, flags:flags, piece:board[from].type };
    if (promotion) { move.flags |= BITS.PROMOTION; move.promotion = promotion; }
    if (board[to]) move.captured = board[to].type;
    else if (flags & BITS.EP_CAPTURE) move.captured = PAWN;
    return move;
  }
  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      if (board[from].type === PAWN && (rank(to) === RANK_8 || rank(to) === RANK_1)) {
        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
        for (var i = 0, len = pieces.length; i < len; i++) moves.push(build_move(board, from, to, flags, pieces[i]));
      } else { moves.push(build_move(board, from, to, flags)); }
    }
    var moves = [], us = turn, them = swap_color(us);
    var second_rank = { b: RANK_7, w: RANK_2 };
    var first_sq = SQUARES.a8, last_sq = SQUARES.h1, single_square = false;
    var legal = typeof options !== 'undefined' && 'legal' in options ? options.legal : true;
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) { first_sq = last_sq = SQUARES[options.square]; single_square = true; }
      else return [];
    }
    for (var i = first_sq; i <= last_sq; i++) {
      if (i & 0x88) { i += 7; continue; }
      var piece = board[i];
      if (piece == null || piece.color !== us) continue;
      if (piece.type === PAWN) {
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(board, moves, i, square, BITS.NORMAL);
          square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null)
            add_move(board, moves, i, square, BITS.BIG_PAWN);
        }
        for (var j = 2; j < 4; j++) {
          square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;
          if (board[square] != null && board[square].color === them) add_move(board, moves, i, square, BITS.CAPTURE);
          else if (square === ep_square) add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j]; var square = i;
          while (true) {
            square += offset; if (square & 0x88) break;
            if (board[square] == null) { add_move(board, moves, i, square, BITS.NORMAL); }
            else { if (board[square].color === us) break; add_move(board, moves, i, square, BITS.CAPTURE); break; }
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }
    if (!single_square || last_sq === kings[us]) {
      if (castling[us] & BITS.KSIDE_CASTLE) {
        var castling_from = kings[us], castling_to = castling_from + 2;
        if (board[castling_from+1]==null && board[castling_to]==null &&
            !attacked(them,kings[us]) && !attacked(them,castling_from+1) && !attacked(them,castling_to))
          add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
      }
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us], castling_to = castling_from - 2;
        if (board[castling_from-1]==null && board[castling_from-2]==null && board[castling_from-3]==null &&
            !attacked(them,kings[us]) && !attacked(them,castling_from-1) && !attacked(them,castling_to))
          add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
      }
    }
    if (!legal) return moves;
    return legality_filter(moves);
  }
  function generate_captures() {
    var moves = [], us = turn, them = swap_color(us);
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (i & 0x88) { i += 7; continue; }
      var piece = board[i];
      if (piece == null || piece.color !== us) continue;
      if (piece.type === PAWN) {
        for (var j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;
          if (board[square] != null && board[square].color === them) {
            if (rank(square) === RANK_8 || rank(square) === RANK_1) {
              moves.push(build_move(board, i, square, BITS.CAPTURE, QUEEN));
              moves.push(build_move(board, i, square, BITS.CAPTURE, ROOK));
              moves.push(build_move(board, i, square, BITS.CAPTURE, BISHOP));
              moves.push(build_move(board, i, square, BITS.CAPTURE, KNIGHT));
            } else { moves.push(build_move(board, i, square, BITS.CAPTURE)); }
          } else if (square === ep_square) {
            moves.push(build_move(board, i, ep_square, BITS.EP_CAPTURE));
          }
        }
        var push_sq = i + PAWN_OFFSETS[us][0];
        if (!(push_sq & 0x88) && board[push_sq] == null &&
            (rank(push_sq) === RANK_8 || rank(push_sq) === RANK_1)) {
          moves.push(build_move(board, i, push_sq, BITS.NORMAL, QUEEN));
          moves.push(build_move(board, i, push_sq, BITS.NORMAL, KNIGHT));
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j]; var square = i;
          while (true) {
            square += offset; if (square & 0x88) break;
            if (board[square] == null) { if (piece.type==='n'||piece.type==='k') break; continue; }
            if (board[square].color === us) break;
            moves.push(build_move(board, i, square, BITS.CAPTURE)); break;
          }
        }
      }
    }
    return legality_filter(moves);
  }
  function move_to_san(move, sloppy) {
    var output = '';
    if (move.flags & BITS.KSIDE_CASTLE) { output = 'O-O'; }
    else if (move.flags & BITS.QSIDE_CASTLE) { output = 'O-O-O'; }
    else {
      var disambiguator = get_disambiguator(move, sloppy);
      if (move.piece !== PAWN) output += move.piece.toUpperCase() + disambiguator;
      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) output += algebraic(move.from)[0];
        output += 'x';
      }
      output += algebraic(move.to);
      if (move.flags & BITS.PROMOTION) output += '=' + move.promotion.toUpperCase();
    }
    make_move(move);
    if (in_check()) { if (in_checkmate()) output += '#'; else output += '+'; }
    undo_move();
    return output;
  }
  function stripped_san(move) { return move.replace(/=/, '').replace(/[+#]?[?!]*$/, ''); }
  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (i & 0x88) { i += 7; continue; }
      if (board[i] == null || board[i].color !== color) continue;
      var piece = board[i]; var difference = i - square; var index = difference + 119;
      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) { if (piece.color === WHITE) return true; }
          else { if (piece.color === BLACK) return true; }
          continue;
        }
        if (piece.type === 'n' || piece.type === 'k') return true;
        var offset = RAYS[index]; var j = i + offset; var blocked = false;
        while (j !== square) { if (board[j] != null) { blocked = true; break; } j += offset; }
        if (!blocked) return true;
      }
    }
    return false;
  }
  function king_attacked(color) { return attacked(swap_color(color), kings[color]); }
  function in_check() { return king_attacked(turn); }

  // Pin/checker-based legality filter. Precomputes checkers and pinned pieces
  // once per node, then tests each pseudo-legal move in O(1). King moves and
  // en-passant captures (the only cases with subtle discovered-check behaviour)
  // fall back to the proven make/undo test. Returns the identical legal-move
  // set the make/undo filter would, in the same order — verified exhaustively.
  function legality_filter(moves) {
    var us = turn, them = swap_color(us), ksq = kings[us];
    var qoff = PIECE_OFFSETS.q, noff = PIECE_OFFSETS.n;

    // --- checkers (and block squares for a single sliding checker) ---
    var checkers = [];
    var sliderChecker = -1, sliderBlocks = null;
    for (var k = 0; k < 8; k++) {
      var s = ksq + noff[k];
      if (!(s & 0x88)) { var p = board[s]; if (p && p.color === them && p.type === KNIGHT) checkers.push(s); }
    }
    var pca = ksq - PAWN_OFFSETS[them][2], pcb = ksq - PAWN_OFFSETS[them][3];
    if (!(pca & 0x88)) { var p = board[pca]; if (p && p.color === them && p.type === PAWN) checkers.push(pca); }
    if (!(pcb & 0x88)) { var p = board[pcb]; if (p && p.color === them && p.type === PAWN) checkers.push(pcb); }
    for (var d = 0; d < 8; d++) {
      var off = qoff[d], diag = (off === 17 || off === -17 || off === 15 || off === -15);
      var s = ksq + off, between = [];
      while (!(s & 0x88)) {
        var p = board[s];
        if (p) {
          if (p.color === them && (p.type === QUEEN || (diag ? p.type === BISHOP : p.type === ROOK))) {
            checkers.push(s);
            if (sliderChecker === -1) { sliderChecker = s; sliderBlocks = between; }
            else sliderChecker = -2;
          }
          break;
        }
        between.push(s); s += off;
      }
    }
    var numCheckers = checkers.length;
    var resolveSet = null;
    if (numCheckers === 1) {
      resolveSet = new Set(); resolveSet.add(checkers[0]);
      if (sliderChecker >= 0 && sliderBlocks) for (var b = 0; b < sliderBlocks.length; b++) resolveSet.add(sliderBlocks[b]);
    }

    // --- pins: friendly piece that is the sole blocker between king and an enemy slider ---
    var pinned = null;
    for (var d = 0; d < 8; d++) {
      var off = qoff[d], diag = (off === 17 || off === -17 || off === 15 || off === -15);
      var s = ksq + off, seg = [], firstFriendly = -1;
      while (!(s & 0x88)) {
        var p = board[s];
        if (p) {
          if (firstFriendly === -1) {
            if (p.color === us) { firstFriendly = s; seg.push(s); } else break;
          } else {
            if (p.color === them && (p.type === QUEEN || (diag ? p.type === BISHOP : p.type === ROOK))) {
              seg.push(s); if (!pinned) pinned = {}; pinned[firstFriendly] = new Set(seg);
            }
            break;
          }
        } else seg.push(s);
        s += off;
      }
    }

    // --- filter ---
    var out = [];
    for (var m = 0; m < moves.length; m++) {
      var mv = moves[m];
      if (mv.piece === KING || (mv.flags & BITS.EP_CAPTURE)) {
        make_move(mv); if (!king_attacked(us)) out.push(mv); undo_move(); continue;
      }
      if (numCheckers >= 2) continue;
      if (numCheckers === 1 && !resolveSet.has(mv.to)) continue;
      if (pinned) { var pa = pinned[mv.from]; if (pa && !pa.has(mv.to)) continue; }
      out.push(mv);
    }
    return out;
  }
  function in_checkmate() { return in_check() && generate_moves().length === 0; }
  function in_stalemate() { return !in_check() && generate_moves().length === 0; }
  function insufficient_material() {
    var pieces = {}, bishops = [], num_pieces = 0, sq_color = 0;
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      sq_color = (sq_color + 1) % 2; if (i & 0x88) { i += 7; continue; }
      var piece = board[i];
      if (piece) { pieces[piece.type] = piece.type in pieces ? pieces[piece.type]+1 : 1;
        if (piece.type === BISHOP) bishops.push(sq_color); num_pieces++;
      }
    }
    if (num_pieces === 2) return true;
    if (num_pieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) return true;
    if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0, len = bishops.length;
      for (var i = 0; i < len; i++) sum += bishops[i];
      if (sum === 0 || sum === len) return true;
    }
    return false;
  }
  function in_threefold_repetition() {
    var moves = [], positions = {}, repetition = false;
    while (true) { var move = undo_move(); if (!move) break; moves.push(move); }
    while (true) {
      var fen = generate_fen().split(' ').slice(0,4).join(' ');
      positions[fen] = fen in positions ? positions[fen]+1 : 1;
      if (positions[fen] >= 3) repetition = true;
      if (!moves.length) break; make_move(moves.pop());
    }
    return repetition;
  }
  function push(move) {
    history.push({ move:move, kings:{b:kings.b,w:kings.w}, turn:turn,
      castling:{b:castling.b,w:castling.w}, ep_square:ep_square,
      half_moves:half_moves, move_number:move_number });
  }
  function make_move(move) {
    var us = turn, them = swap_color(us); push(move);
    board[move.to] = board[move.from]; board[move.from] = null;
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) board[move.to - 16] = null; else board[move.to + 16] = null;
    }
    if (move.flags & BITS.PROMOTION) board[move.to] = { type:move.promotion, color:us };
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to-1, castling_from = move.to+1;
        board[castling_to] = board[castling_from]; board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to+1, castling_from = move.to-2;
        board[castling_to] = board[castling_from]; board[castling_from] = null;
      }
      /* FIX: was castling[us] = '' (string); now numeric 0 */
      castling[us] = 0;
    }
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square && castling[us] & ROOKS[us][i].flag)
          { castling[us] ^= ROOKS[us][i].flag; break; }
      }
    }
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square && castling[them] & ROOKS[them][i].flag)
          { castling[them] ^= ROOKS[them][i].flag; break; }
      }
    }
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') ep_square = move.to - 16; else ep_square = move.to + 16;
    } else { ep_square = EMPTY; }
    if (move.piece === PAWN) half_moves = 0;
    else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) half_moves = 0;
    else half_moves++;
    if (turn === BLACK) move_number++;
    turn = swap_color(turn);
  }
  function undo_move() {
    var old = history.pop(); if (old == null) return null;
    var move = old.move; kings = old.kings; turn = old.turn; castling = old.castling;
    ep_square = old.ep_square; half_moves = old.half_moves; move_number = old.move_number;
    var us = turn, them = swap_color(turn);
    board[move.from] = board[move.to]; board[move.from].type = move.piece; board[move.to] = null;
    if (move.flags & BITS.CAPTURE) board[move.to] = { type:move.captured, color:them };
    else if (move.flags & BITS.EP_CAPTURE) {
      var index; if (us === BLACK) index = move.to - 16; else index = move.to + 16;
      board[index] = { type:PAWN, color:them };
    }
    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) { castling_to = move.to+1; castling_from = move.to-1; }
      else if (move.flags & BITS.QSIDE_CASTLE) { castling_to = move.to-2; castling_from = move.to+1; }
      board[castling_to] = board[castling_from]; board[castling_from] = null;
    }
    return move;
  }
  // ── Search-scoped incremental x-ray eval ──────────────────
  // Maintained ONLY through fast_make/fast_undo (search moves), never through
  // the internal make_move/undo_move that legality probing uses — so the ~30
  // legality make/undo pairs per node stay untaxed. O(1) per searched move.
  function xidx(sq) { return (7 - (sq >> 4)) * 8 + (sq & 7); }
  function applyEvalDelta(move, sign) {
    var us = move.color, them = swap_color(us);
    var ft = (move.flags & BITS.PROMOTION) ? move.promotion : move.piece;
    var dUs = -XRAY[us + move.piece][xidx(move.from)] + XRAY[us + ft][xidx(move.to)];
    var dThem = 0;
    if (move.flags & BITS.EP_CAPTURE) {
      var ep = (us === BLACK) ? move.to - 16 : move.to + 16;
      dThem -= XRAY[them + 'p'][xidx(ep)];
    } else if (move.captured) {
      dThem -= XRAY[them + move.captured][xidx(move.to)];
    }
    if (move.flags & BITS.KSIDE_CASTLE)
      dUs += -XRAY[us + 'r'][xidx(move.to + 1)] + XRAY[us + 'r'][xidx(move.to - 1)];
    else if (move.flags & BITS.QSIDE_CASTLE)
      dUs += -XRAY[us + 'r'][xidx(move.to - 2)] + XRAY[us + 'r'][xidx(move.to + 1)];
    if (us === WHITE) accUw += sign * dUs; else accUb += sign * dUs;
    if (them === WHITE) accUw += sign * dThem; else accUb += sign * dThem;
  }
  function get_disambiguator(move, sloppy) {
    var moves = generate_moves({legal:!sloppy});
    var from = move.from, to = move.to, piece = move.piece;
    var ambiguities = 0, same_rank = 0, same_file = 0;
    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from, ambig_to = moves[i].to, ambig_piece = moves[i].piece;
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;
        if (rank(from) === rank(ambig_from)) same_rank++;
        if (file(from) === file(ambig_from)) same_file++;
      }
    }
    if (ambiguities > 0) {
      if (same_rank > 0 && same_file > 0) return algebraic(from);
      else if (same_file > 0) return algebraic(from).charAt(1);
      else return algebraic(from).charAt(0);
    }
    return '';
  }
  function move_from_san(move, sloppy) {
    var clean_move = stripped_san(move);
    if (sloppy) {
      var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
      if (matches) { var piece=matches[1], from=matches[2], to=matches[3], promotion=matches[4]; }
    }
    var moves = generate_moves();
    for (var i = 0, len = moves.length; i < len; i++) {
      if (clean_move === stripped_san(move_to_san(moves[i])) ||
          (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) return moves[i];
      else if (matches && (!piece || piece.toLowerCase()==moves[i].piece) &&
               SQUARES[from]==moves[i].from && SQUARES[to]==moves[i].to &&
               (!promotion || promotion.toLowerCase()==moves[i].promotion)) return moves[i];
    }
    return null;
  }
  function rank(i) { return i >> 4; }
  function file(i) { return i & 15; }
  function algebraic(i) { var f=file(i), r=rank(i); return 'abcdefgh'.substring(f,f+1)+'87654321'.substring(r,r+1); }
  function swap_color(c) { return c === WHITE ? BLACK : WHITE; }
  function is_digit(c) { return '0123456789'.indexOf(c) !== -1; }
  function make_pretty(ugly_move) {
    var move = clone(ugly_move); move.san = move_to_san(move, false);
    move.to = algebraic(move.to); move.from = algebraic(move.from);
    var flags = '';
    for (var flag in BITS) { if (BITS[flag] & move.flags) flags += FLAGS[flag]; }
    move.flags = flags; return move;
  }
  function clone(obj) {
    var dupe = obj instanceof Array ? [] : {};
    for (var property in obj) { if (typeof property === 'object') dupe[property]=clone(obj[property]); else dupe[property]=obj[property]; }
    return dupe;
  }
  function trim(str) { return str.replace(/^\s+|\s+$/g, ''); }

  return {
    WHITE:WHITE, BLACK:BLACK, PAWN:PAWN, KNIGHT:KNIGHT, BISHOP:BISHOP, ROOK:ROOK, QUEEN:QUEEN, KING:KING,
    SQUARES: (function() { var keys=[]; for (var i=SQUARES.a8; i<=SQUARES.h1; i++) { if(i&0x88){i+=7;continue;} keys.push(algebraic(i)); } return keys; })(),
    FLAGS: FLAGS,
    load: function(fen) { return load(fen); },
    reset: function() { return reset(); },
    moves: function(options) {
      var ugly_moves = generate_moves(options), moves = [];
      for (var i=0,len=ugly_moves.length;i<len;i++) {
        if (typeof options!=='undefined' && 'verbose' in options && options.verbose) moves.push(make_pretty(ugly_moves[i]));
        else moves.push(move_to_san(ugly_moves[i], false));
      }
      return moves;
    },
    in_check: function() { return in_check(); },
    in_checkmate: function() { return in_checkmate(); },
    in_stalemate: function() { return in_stalemate(); },
    in_draw: function() { return half_moves>=100||in_stalemate()||insufficient_material()||in_threefold_repetition(); },
    insufficient_material: function() { return insufficient_material(); },
    in_threefold_repetition: function() { return in_threefold_repetition(); },
    game_over: function() { return half_moves>=100||in_checkmate()||in_stalemate()||insufficient_material()||in_threefold_repetition(); },
    validate_fen: function(fen) { return validate_fen(fen); },
    fen: function() { return generate_fen(); },
    board: function() {
      var output=[], row=[];
      for (var i=SQUARES.a8;i<=SQUARES.h1;i++) {
        if (board[i]==null) row.push(null); else row.push({type:board[i].type,color:board[i].color});
        if ((i+1)&0x88) { output.push(row); row=[]; i+=8; }
      }
      return output;
    },
    header: function() { return set_header(arguments); },
    ascii: function() {
      var s='   +------------------------+\n';
      for (var i=SQUARES.a8;i<=SQUARES.h1;i++) {
        if (file(i)===0) s+=' '+'87654321'[rank(i)]+' |';
        if (board[i]==null) s+=' . ';
        else { var piece=board[i].type,color=board[i].color; s+=' '+(color===WHITE?piece.toUpperCase():piece.toLowerCase())+' '; }
        if ((i+1)&0x88) { s+='|\n'; i+=8; }
      }
      s+='   +------------------------+\n     a  b  c  d  e  f  g  h\n'; return s;
    },
    turn: function() { return turn; },
    move: function(move, options) {
      var sloppy = typeof options!=='undefined' && 'sloppy' in options ? options.sloppy : false;
      var move_obj = null;
      if (typeof move === 'string') { move_obj = move_from_san(move, sloppy); }
      else if (typeof move === 'object') {
        var moves = generate_moves();
        for (var i=0,len=moves.length;i<len;i++) {
          if (move.from===algebraic(moves[i].from) && move.to===algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) || move.promotion===moves[i].promotion))
            { move_obj=moves[i]; break; }
        }
      }
      if (!move_obj) return null;
      var pretty_move = make_pretty(move_obj); make_move(move_obj); return pretty_move;
    },
    undo: function() { var move=undo_move(); return move ? make_pretty(move) : null; },
    clear: function() { return clear(); },
    put: function(piece,square) { return put(piece,square); },
    get: function(square) { return get(square); },
    remove: function(square) { return remove(square); },
    square_color: function(square) {
      if (square in SQUARES) { var sq_0x88=SQUARES[square]; return (rank(sq_0x88)+file(sq_0x88))%2===0?'light':'dark'; }
      return null;
    },
    history: function(options) {
      var reversed_history=[], move_history=[];
      var verbose = typeof options!=='undefined' && 'verbose' in options && options.verbose;
      while (history.length > 0) reversed_history.push(undo_move());
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) move_history.push(make_pretty(move)); else move_history.push(move_to_san(move));
        make_move(move);
      }
      return move_history;
    },
    /* ── Fast paths for engine ───────────────────────── */
    fast_moves: function() { return generate_moves(); },
    fast_captures: function() { return generate_captures(); },
    fast_make: function(m) { make_move(m); if (accActive) applyEvalDelta(m, 1); },
    fast_undo: function() {
      if (accActive && history.length) { var mv = history[history.length-1].move; undo_move(); applyEvalDelta(mv, -1); }
      else { undo_move(); }
    },
    fast_seed_acc: function() {
      var w=0, b=0;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i]; if (p==null) continue;
        var idx=(7-(i>>4))*8+(i&7);
        if (p.color===WHITE) w+=XRAY['w'+p.type][idx]; else b+=XRAY['b'+p.type][idx];
      }
      accUw=w; accUb=b; accActive=true;
    },
    fast_end_acc: function() { accActive=false; },
    fast_raw_u: function(xt) {
      if (xt === XRAY && accActive) return (turn===WHITE) ? accUw-accUb : accUb-accUw;
      var Uw=0, Ub=0;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i]; if (p==null) continue;
        var r=7-(i>>4), f=i&7, idx=r*8+f;
        if (p.color===WHITE) Uw+=xt['w'+p.type][idx];
        else Ub+=xt['b'+p.type][idx];
      }
      return (turn===WHITE) ? Uw-Ub : Ub-Uw;
    },
    fast_raw_u_split: function(xt) {
      if (xt === XRAY && accActive) return { Uw:accUw, Ub:accUb };
      var Uw=0, Ub=0;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i]; if (p==null) continue;
        var r=7-(i>>4), f=i&7, idx=r*8+f;
        if (p.color===WHITE) Uw+=xt['w'+p.type][idx]; else Ub+=xt['b'+p.type][idx];
      }
      return { Uw:Uw, Ub:Ub };
    },
    // Real (blocker-aware) mobility: each piece scores its material base plus the
    // number of squares it can actually reach (rays stop at the first blocker;
    // an enemy on that square counts as a capture). Unlike x-ray this sees open
    // files, blocked bishops, and rook activity. King AND pawn contribute no
    // mobility term (base only) — so the king gains nothing from walking into the
    // open and "developing the king" is never rewarded.
    fast_real_u: function() {
      var Uw=0, Ub=0, NOFF=PIECE_OFFSETS.n;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i]; if (p==null) continue;
        var t=p.type, mob=0, k, off, sq;
        if (t==='n') { for(k=0;k<8;k++){ sq=i+NOFF[k]; if(!(sq&0x88) && (board[sq]==null||board[sq].color!==p.color)) mob++; } }
        else if (t==='b'||t==='r'||t==='q') {
          var dirs=PIECE_OFFSETS[t];
          for(k=0;k<dirs.length;k++){ off=dirs[k]; sq=i+off;
            while(!(sq&0x88)){ if(board[sq]==null){mob++; sq+=off;} else { if(board[sq].color!==p.color) mob++; break; } } }
        }
        var val=PIECE_BASE[t]+mob;   // king & pawn: mob stays 0
        if (p.color===WHITE) Uw+=val; else Ub+=val;
      }
      return (turn===WHITE) ? Uw-Ub : Ub-Uw;
    },
    fast_real_u_split: function() {
      var Uw=0, Ub=0, NOFF=PIECE_OFFSETS.n;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i]; if (p==null) continue;
        var t=p.type, mob=0, k, off, sq;
        if (t==='n') { for(k=0;k<8;k++){ sq=i+NOFF[k]; if(!(sq&0x88) && (board[sq]==null||board[sq].color!==p.color)) mob++; } }
        else if (t==='b'||t==='r'||t==='q') {
          var dirs=PIECE_OFFSETS[t];
          for(k=0;k<dirs.length;k++){ off=dirs[k]; sq=i+off;
            while(!(sq&0x88)){ if(board[sq]==null){mob++; sq+=off;} else { if(board[sq].color!==p.color) mob++; break; } } }
        }
        var val=PIECE_BASE[t]+mob;
        if (p.color===WHITE) Uw+=val; else Ub+=val;
      }
      return { Uw:Uw, Ub:Ub };
    },
    /* Null move (pass): flips the side to move and clears en passant,
     * touching no pieces — used to evaluate the opponent's move ensemble
     * from the same position (symmetric leaf optionality). Callers must
     * pair make/undo and never pass while in check. */
    fast_make_null: function() {
      history.push({ move: null, kings: { b: kings.b, w: kings.w }, turn: turn,
        castling: { b: castling.b, w: castling.w }, ep_square: ep_square,
        half_moves: half_moves, move_number: move_number });
      turn = swap_color(turn); ep_square = EMPTY;
    },
    fast_undo_null: function() {
      var old = history.pop();
      turn = old.turn; ep_square = old.ep_square;
      kings = old.kings; castling = old.castling;
      half_moves = old.half_moves; move_number = old.move_number;
    },
    fast_in_check: function() { return in_check(); },
    fast_in_checkmate: function() { return in_checkmate(); },
    fast_turn: function() { return turn; },
    fast_to_san: function(m) { return move_to_san(m); },
    fast_algebraic: function(i) { return algebraic(i); },
    /* 32-bit FNV-1a hash: no string allocation, O(64) integer arithmetic */
    fast_hash: function() {
      var h = (turn === WHITE) ? 0x811c9dc5 : 0x050c5d1f;
      for (var i=SQUARES.a8; i<=SQUARES.h1; i++) {
        if (i&0x88) { i+=7; continue; }
        var p=board[i];
        var v = p ? (p.color===WHITE ? 0 : 6) + SHIFTS[p.type] + 1 : 0;
        h = Math.imul(h ^ v, 0x01000193);
      }
      h = Math.imul(h ^ ((castling.w << 4) | castling.b), 0x01000193);
      h = Math.imul(h ^ (ep_square + 2), 0x01000193);
      return h | 0;
    }
  };
};

/* ================================================================
 * ENGINE — Thermodynamic Search
 * ================================================================ */

// ── Constants ──────────────────────────────────────────────
const T_FLOOR = 1e-3;   // Numerical guard only, well below the engine's eval
                        // resolution (~1 unit). It lets T fall to its true
                        // self-consistent value — including the T→0 ground
                        // state of a forced position — instead of clamping at
                        // an arbitrary fixed temperature. Not a physical floor.
const PAWN_XRAY = 2;   // pawn base = 2 internal units (avg pawn moves); also the display divisor
const CHECKMATE_SCORE = 100000;
const MATE_NEAR = CHECKMATE_SCORE - 4096;   // scores beyond this encode mate distance
// Mate-distance ticking: every negation on the way up the tree pulls a mate
// score one unit toward zero, so a mate in 2 outscores a mate in 4 and the
// engine converts won positions instead of shuffling. Scores stay
// node-relative, which keeps transposition-table entries valid across paths.
function tickMate(v) { return v > MATE_NEAR ? v - 1 : (v < -MATE_NEAR ? v + 1 : v); }
const TIME_LIMITS = { easy:500, medium:2000, hard:8000, max:20000 };
const MATE_SENTINEL = 9999;   // Stockfish mate score, stored in pawn-equivalent units
const SF_DEPTH = 12;          // Stockfish search depth for the reference evaluation
const BOLTZ_SIGMA = 3;
const TRUNC_MAX = 16;   // hard cap on children fully recursed per node (partition truncation)
const NODE_HARD_LIMIT = 5000000;
const DELTA_MARGIN = 2 * PAWN_XRAY;   // ~2 pawns; quiescence delta-pruning safety margin (new eval scale)
const PIECE_CHAR = {
    wk:'♔',wq:'♕',wr:'♖',wb:'♗',wn:'♘',wp:'♙',
    bk:'♚',bq:'♛',br:'♜',bb:'♝',bn:'♞',bp:'♟'
};
const PIECE_NAME = { p:'Pawn', n:'Knight', b:'Bishop', r:'Rook', q:'Queen' };

// ── Derived piece geometry & material base ─────────────────
// X-ray mobility: squares a piece sweeps on an empty board (blocker-agnostic),
// a pure function of type and square — which is why it precomputes.
function xrayMobility(type, file, rank) {
    switch (type) {
        case 'r': return 14;
        case 'b': return Math.min(file,rank)+Math.min(7-file,rank)+Math.min(file,7-rank)+Math.min(7-file,7-rank);
        case 'q': return 14+Math.min(file,rank)+Math.min(7-file,rank)+Math.min(file,7-rank)+Math.min(7-file,7-rank);
        case 'n': { let c=0; for (const [df,dr] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) if (file+df>=0&&file+df<=7&&rank+dr>=0&&rank+dr<=7) c++; return c; }
        // king & pawn carry no mobility term in U:
        //   king: walking it into the open is rewarded with no safety offset;
        //   pawn: its x-ray mobility is enemy-dependent, and a start-rank push
        //         bonus penalised advancing — both dropped.
        default: return 0;
    }
}
function avgMobility(type) { let s = 0; for (let r=0;r<8;r++) for (let f=0;f<8;f++) s += xrayMobility(type,f,r); return s/64; }

// Material base is DERIVED from geometry, not imported as a point count:
//   base = sqrt(mean x-ray mobility).
// Per-square mobility is then added on top, so mobility is the dominant term and
// a centralized piece outvalues a cornered one of the same type. The sqrt keeps
// the base a modest anchor rather than double-counting mobility.
//   pawn: mobility is enemy-dependent and disregarded in U, so base is fixed at
//         sqrt(2) (its ~2 typical moves) with no per-square term.
//   king: never traded, and cancels in U (both sides always have one), so base 0.
const PIECE_BASE = {}, PIECE_WORTH = {};
for (const type of ['p','n','b','r','q','k']) {
    const a = (type === 'p') ? 2 : avgMobility(type);
    PIECE_BASE[type]  = (type === 'k') ? 0 : a;   // base = x-ray value itself (was sqrt): squares the material term so it dominates mobility
    PIECE_WORTH[type] = PIECE_BASE[type] + ((type === 'p' || type === 'k') ? 0 : a);  // avg total value; capture ordering only
}

// Heat capacity is scaled by material left on the board. Since robustT solves
// Var(Q)/T^2 = C, a LARGER C demands a LOWER temperature. The demand is not
// always satisfiable: each position has a critical capacity
// C* = max_T Var_pi(Q)/T^2 set by its own move ensemble, and when C > C* the
// solver pins T at the spinodal (see robustT) — so C acts as a capacity
// DEMAND, an upper bound the position meets when it can. We map the
// value-weighted material fraction (1 at the start, ->0 as pieces are traded)
// linearly into [C_BARE, C_OPEN]: a full board is cool and decisive (checks and
// entropy games are muted) while an open board heats up and the optionality
// term is allowed to matter.
const START_TOTAL = 2 * (8*PIECE_WORTH.p + 2*PIECE_WORTH.n + 2*PIECE_WORTH.b + 2*PIECE_WORTH.r + PIECE_WORTH.q);
const C_OPEN = 2.0;   // full board (opening): cool, decisive; typically supercritical → T pins at T̂
const C_BARE = 0.6;   // bare board (endgame): hotter, exploratory; typically an exact solution exists
function materialC(g) {
    const placement = g.fen().split(' ')[0];
    let total = 0;
    for (let i = 0; i < placement.length; i++) {
        const lo = placement[i].toLowerCase();
        if (lo === 'p' || lo === 'n' || lo === 'b' || lo === 'r' || lo === 'q') total += PIECE_WORTH[lo];
    }
    const frac = total / START_TOTAL;                 // value-weighted material remaining, in [0,1]
    return C_BARE + (C_OPEN - C_BARE) * frac;         // stays within [C_BARE, C_OPEN], below the T-solver cliff
}

// ── Precomputed X-ray Mobility Table (material base + mobility) ─────
const XRAY = {};
(function buildXrayTable() {
    for (const color of ['w','b'])
        for (const type of ['p','n','b','r','q','k']) {
            const t = new Float64Array(64);
            const base = PIECE_BASE[type];
            for (let rank=0;rank<8;rank++) for (let file=0;file<8;file++) t[rank*8+file] = base + xrayMobility(type,file,rank);
            XRAY[color+type] = t;
        }
})();

// ── Optionality model ──────────────────────────────────────
// How a *leaf* position's optionality is scored. Interior nodes
// never use this — their optionality is already the entropy term
// TS inside F = ⟨Q⟩ + TS, and it propagates up through the tree.
// X-ray mobility only ever entered at the leaves, so this flag is
// the only place the choice actually lives.
//   'xray'   : static x-ray mobility (default). Cheap, side-symmetric,
//              position-independent — already baked into the XRAY table.
//   'thermo' : T·S of the Boltzmann distribution over each side's legal
//              moves (treating moves as the leaf's microstates), added to
//              a material-only base. The opponent's ensemble is reached by
//              a null move, and the two are differenced, so the term is
//              side-symmetric (no odd/even parity bias). Grounded in the
//              same thermodynamics as the rest of the engine, but several
//              times slower. Off by default.
let OPTIONALITY_MODE = 'xray';

// Material-only companion table (base piece values, no mobility term),
// used as the leaf base in 'thermo' mode so optionality isn't counted twice.
const MAT = {};
for (const color of ['w','b'])
    for (const type of ['p','n','b','r','q','k'])
        MAT[color+type] = new Float64Array(64).fill(PIECE_BASE[type]);

// ── Game State ─────────────────────────────────────────────
let game = new Chess();
let boardFlipped = false;
let selectedSq = null;
let legalTargets = [];
let humanColor = 'w';
let aiColor = 'b';
let thinking = false;
let lastMoveSquares = null;
let moveHistory = [];
let nodeCount = 0;
let searchStats = { depth: 0, nodes: 0 };
let graphData = [];
let activeC = 1;          // effective heat capacity used by robustT (set per-search from material)
let heatCapMult = 1;      // user slider: a multiplier on the material-scaled C

// ── Transposition Cache ────────────────────────────────────
const thermoCache = new Map();
const THERMO_CACHE_MAX = 500000;

// Cached F values are functions of (position, depth, C). C changes with the
// slider and with material, so entries computed under a different C are
// stale physics, not just stale search: drop them. Also drop everything when
// the table nears its cap (no eviction policy — a full table stops learning).
let tCacheC = -1;
function syncCache() {
    if (activeC !== tCacheC || thermoCache.size > THERMO_CACHE_MAX * 0.9) {
        thermoCache.clear();
        tCacheC = activeC;
    }
}

// Position keys of the played game (since the last irreversible move),
// passed in with each analysis request and seeded into the search's
// repetition detection: the engine avoids repetition draws when ahead and
// steers into them when lost, relative to the ACTUAL game, not merely the
// search path.
let PAST_KEYS = [];

// ── X-ray evaluation: split by color ───────────────────────
function rawU(g) {
    return g.fast_real_u_split ? g.fast_real_u_split() : rawU_slow(g);
}
function rawU_slow(g) {
    let Uw=0, Ub=0;
    const b = g.board();
    for (let row=0;row<8;row++) for (let col=0;col<8;col++) {
        const p=b[row][col]; if (!p) continue;
        const idx=(7-row)*8+col;
        if (p.color==='w') Uw+=XRAY['w'+p.type][idx]; else Ub+=XRAY['b'+p.type][idx];
    }
    return { Uw, Ub };
}

// ── Leaf optionality (thermo mode) ─────────────────────────
// Treats a side's legal moves as the leaf's microstates and returns
// T·S of the Boltzmann distribution over their static values — a
// position-aware optionality score that replaces static x-ray
// mobility. This resolves the "μ can't exist at a leaf" problem:
// a leaf is a single position, but optionality is a property of the
// *moves available from it*, which do form a distribution.
function sideOptionality(g) {
    const moves = g.fast_moves();
    const n = moves.length;
    if (n <= 1) return 0;                 // 0 or 1 move ⇒ no optionality
    const Qs = new Array(n);
    for (let i = 0; i < n; i++) {
        g.fast_make(moves[i]);
        Qs[i] = -g.fast_raw_u(XRAY);      // value to the mover after this move
        g.fast_undo();
    }
    const T = robustT(Qs, n);
    let maxQ = Qs[0];
    for (let i = 1; i < n; i++) if (Qs[i] > maxQ) maxQ = Qs[i];
    let expSum = 0;
    for (let i = 0; i < n; i++) expSum += Math.exp((Qs[i] - maxQ) / T);
    let S = 0;
    for (let i = 0; i < n; i++) {
        const p = Math.exp((Qs[i] - maxQ) / T) / expSum;
        if (p > 1e-15) S -= p * Math.log(p);
    }
    return T * S;                          // same units as U (Q-units)
}
// Side-symmetric optionality: the mover's T·S minus the opponent's T·S,
// the latter evaluated after a null move (a pass — exactly the ensemble
// "what could they do if it were their turn"). A mover-only bonus would
// flip sign every ply and inject an odd/even parity bias into the search;
// the difference restores the symmetry equilibrium requires. Only called
// from quiet stand-pat positions, where passing is physically meaningful.
function leafOptionality(g) {
    const own = sideOptionality(g);
    g.fast_make_null();
    const theirs = sideOptionality(g);
    g.fast_undo_null();
    return own - theirs;
}
// Static leaf evaluation, mode-aware. In 'thermo' mode a position in check
// has no equilibrium optionality (passing is illegal, the ensemble is not
// stationary): material only.
function staticEval(g) {
    if (OPTIONALITY_MODE !== 'thermo') return g.fast_real_u();
    const base = g.fast_raw_u(MAT);
    return g.fast_in_check() ? base : base + leafOptionality(g);
}

// ── Quiescence Search ──────────────────────────────────────
// Resolves captures and promotions to reach a quiet position
// before applying the static XRAY evaluation. Positions with
// pending captures are far from equilibrium; computing
// thermodynamic state variables for them is meaningless.
// Alpha-beta is used here (not Boltzmann) because quiescence
// enumerates tactical sequences exhaustively.
function quiesce(g, alpha, beta, qd) {
    nodeCount++;
    if (qd === undefined) qd = 24;
    const inCheck = g.fast_in_check();

    let standPat = 0;
    if (!inCheck) {
        standPat = staticEval(g);   // xray: material + REAL blocker-aware mobility;
                                    // thermo: material + symmetric T·S optionality
        if (standPat >= beta) return standPat;
        if (standPat > alpha) alpha = standPat;
        if (qd <= 0) return standPat;                   // quiescence depth cap (quiet)
    }
    if (inCheck && qd <= -8) return staticEval(g);      // bound runaway checking sequences

    // In check: all evasions. Not in check: captures and promotions only.
    const moves = inCheck ? g.fast_moves() : g.fast_captures();
    if (moves.length === 0) return inCheck ? -CHECKMATE_SCORE : alpha;

    // MVV-LVA ordering: most valuable victim, least valuable attacker first,
    // so the strongest captures produce beta cutoffs early. The king has no
    // material worth (it is never traded) but as an ATTACKER it is ordered
    // last, not first — its ordering value is its irreplaceability.
    if (!inCheck && moves.length > 1) {
        for (let i = 0; i < moves.length; i++)
            moves[i]._o = (PIECE_WORTH[moves[i].captured] || 0) * 16 -
                          (moves[i].piece === 'k' ? 2 * PIECE_WORTH.q : PIECE_WORTH[moves[i].piece]);
        moves.sort((a, b) => b._o - a._o);
    }

    for (let i = 0; i < moves.length; i++) {
        const m = moves[i];
        // Delta pruning: if even winning this capture cannot lift us to alpha, skip it.
        if (!inCheck && m.captured && !m.promotion &&
            standPat + (PIECE_WORTH[m.captured] || 0) + DELTA_MARGIN <= alpha) continue;
        g.fast_make(m);
        const score = -tickMate(quiesce(g, -beta, -alpha, qd - 1));
        g.fast_undo();
        if (score >= beta) return score;
        if (score > alpha) alpha = score;
    }

    return alpha;
}

// ── Self-Consistent Temperature ────────────────────────────
// Solves the fixed-point equation  Var_π(Q) / T² = C  for T, where π is
// the Boltzmann distribution over the node's move values at temperature T
// and C is the prescribed heat capacity. Writing r(T) ≡ σ_π(T)/T, the
// equation reads r(T) = √C. r(T) → 0 as T → 0 (the distribution freezes
// onto the best move) and r(T) → 0 as T → ∞ (σ_π saturates while T grows),
// so r is peaked in between and the solver distinguishes three phases:
//
//   subcritical   max r > √C : the self-consistent temperature exists.
//                 Take the crossing on the RIGHT (descending) branch —
//                 the thermodynamically stable fixed point — by log-space
//                 bisection, solved to <1%.
//   supercritical max r < √C : NO temperature can supply the demanded
//                 capacity. T pins at the spinodal T̂ = argmax r(T), the
//                 closest achievable equilibrium; the achieved capacity
//                 saturates at the position's critical capacity
//                 C* = max_T Var_π(Q)/T² < C. (Dashboard: C_eff vs C.)
//   frozen        max r ≈ 0 : one move dominates at every temperature in
//                 the domain (forced positions, mates): T → T_FLOOR and
//                 F → max Q, the minimax limit.
//
// The search domain is set by a robust median-based scale of the BULK of
// the Q distribution, not the full range: a mate outlier must freeze the
// ensemble, not open a fake high-temperature branch in which F would be
// valued as a mixture of mate and quiet moves.
function _sigmaOverT(xs, n, T, xmax) {
    let expSum = 0, m1 = 0, m2 = 0;
    for (let i = 0; i < n; i++) {
        const w = Math.exp((xs[i] - xmax) / T);
        expSum += w; m1 += w * xs[i]; m2 += w * xs[i] * xs[i];
    }
    m1 /= expSum; m2 /= expSum;
    const v = m2 - m1 * m1;
    return v > 0 ? Math.sqrt(v) / T : 0;
}
function robustT(Qs, n) {
    if (n < 2) return T_FLOOR;
    const sqrtC = Math.sqrt(activeC);

    // Robust bulk scale: MAD, with quantile fallbacks for degenerate bulks.
    const tmp = new Array(n);
    for (let i = 0; i < n; i++) tmp[i] = Qs[i];
    tmp.sort((a, b) => a - b);
    const med = n & 1 ? tmp[n >> 1] : (tmp[(n >> 1) - 1] + tmp[n >> 1]) * 0.5;
    for (let i = 0; i < n; i++) tmp[i] = Math.abs(Qs[i] - med);
    tmp.sort((a, b) => a - b);
    const mad = n & 1 ? tmp[n >> 1] : (tmp[(n >> 1) - 1] + tmp[n >> 1]) * 0.5;
    let scale = 1.4826 * mad;
    if (scale === 0) scale = tmp[Math.min(n - 1, Math.ceil(0.9 * n) - 1)]; // 90th-pct deviation
    if (scale === 0 && tmp[n - 1] < MATE_NEAR) scale = tmp[n - 1];         // widest non-mate gap
    if (scale === 0) return T_FLOOR;                                       // frozen: no bulk spread

    // Median-centered values: T depends only on the spread, and centering
    // keeps E[Q²]−E[Q]² numerically stable when |Q| is large.
    const xs = tmp;
    let xmax = -Infinity;
    for (let i = 0; i < n; i++) { xs[i] = Qs[i] - med; if (xs[i] > xmax) xmax = xs[i]; }

    // Geometric sweep downward from well above the bulk scale. If r is
    // still above √C at the ceiling, the stable branch sits higher: expand.
    let T_hi = 6 * scale / sqrtC;
    let r_hi = _sigmaOverT(xs, n, T_hi, xmax);
    let guard = 0;
    while (r_hi >= sqrtC && guard++ < 40) { T_hi *= 2; r_hi = _sigmaOverT(xs, n, T_hi, xmax); }

    const RHO = 0.6, T_min = Math.max(T_FLOOR, scale * 1e-3);
    let bestT = T_hi, bestR = r_hi;
    let Ta = T_hi, Tb = 0, found = false;
    for (let T = T_hi * RHO; T >= T_min; T *= RHO) {
        const r = _sigmaOverT(xs, n, T, xmax);
        if (r >= sqrtC) { found = true; Tb = T; break; }     // bracket [Tb, Ta]
        if (r > bestR) { bestR = r; bestT = T; }
        else if (r < 0.3 * bestR) break;                      // well past the peak: no crossing below
        Ta = T;
    }

    if (found) {
        // Largest root: bisect in log T on [Tb, Ta] with r(Tb) ≥ √C > r(Ta).
        let lo = Tb, hi = Ta;
        for (let it = 0; it < 10; it++) {
            const mid = Math.sqrt(lo * hi);
            if (_sigmaOverT(xs, n, mid, xmax) >= sqrtC) lo = mid; else hi = mid;
        }
        return Math.max(Math.sqrt(lo * hi), T_FLOOR);
    }

    // No grid point cleared √C: refine the peak of r by golden-section in
    // log T. Frozen if even the peak is negligible.
    if (bestR < 1e-6) return T_FLOOR;
    let lo = Math.log(bestT * RHO), hi = Math.log(Math.min(bestT / RHO, T_hi));
    const GR = 0.6180339887498949;
    let x1 = hi - GR * (hi - lo), x2 = lo + GR * (hi - lo);
    let r1 = _sigmaOverT(xs, n, Math.exp(x1), xmax), r2 = _sigmaOverT(xs, n, Math.exp(x2), xmax);
    for (let it = 0; it < 8; it++) {
        if (r1 < r2) { lo = x1; x1 = x2; r1 = r2; x2 = lo + GR * (hi - lo); r2 = _sigmaOverT(xs, n, Math.exp(x2), xmax); }
        else { hi = x2; x2 = x1; r2 = r1; x1 = hi - GR * (hi - lo); r1 = _sigmaOverT(xs, n, Math.exp(x1), xmax); }
    }
    const Tpk = Math.exp((lo + hi) * 0.5);
    const rPk = _sigmaOverT(xs, n, Tpk, xmax);
    // Near-critical rescue: the band where r ≥ √C can be narrower than one
    // grid step and slip between sweep points. If the refined peak clears
    // √C after all, the position is subcritical — recover the stable
    // (right-branch) crossing between the peak and the grid point above it,
    // where r < √C was already established.
    if (rPk >= sqrtC) {
        let cl = Tpk, ch = Math.min(bestT / RHO, T_hi);
        for (let it = 0; it < 10; it++) {
            const mid = Math.sqrt(cl * ch);
            if (_sigmaOverT(xs, n, mid, xmax) >= sqrtC) cl = mid; else ch = mid;
        }
        return Math.max(Math.sqrt(cl * ch), T_FLOOR);
    }
    // Genuinely supercritical: pin at the spinodal.
    return Math.max(Tpk, T_FLOOR);
}

// ── Thermodynamic Search: F = T ln Z ───────────────────────
// Unified search at all depths. Both sides computed identically
// (equilibrium requires symmetry).
//   depth ≤ 0: quiescence search (alpha-beta over captures)
//   depth 1 : full Boltzmann evaluation of all moves
//   depth ≥ 2: partition-function truncation — the dominant set is
//              fully recursed, the negligible tail keeps its shallow
//              values (it contributes <1% of Z)
//
// Draw detection via pathKeys: if the current position has appeared
// earlier on the search path — or in the PLAYED GAME since the last
// irreversible move (PAST_KEYS, seeded per search) — return 0 (draw).
function thermoSearch(g, depth, pathKeys) {
    nodeCount++;

    // Node hard limit: degrade gracefully
    if (nodeCount > NODE_HARD_LIMIT && depth > 1) depth = 1;

    // Leaf: resolve captures via quiescence
    if (depth <= 0) return quiesce(g, -Infinity, Infinity);

    const posKey = g.fast_hash();

    // Draw detection: repetition on current search path
    if (pathKeys.has(posKey)) return 0;

    // Transposition table lookup (numeric key: 32-bit hash × depth ≤ 64
    // packs exactly into a double — no string allocation per node)
    const key = posKey * 128 + depth;
    const cached = thermoCache.get(key);
    if (cached !== undefined) return cached;

    const moves = g.fast_moves();
    const n = moves.length;
    if (n === 0) {
        const v = g.fast_in_check() ? -CHECKMATE_SCORE : 0;
        if (thermoCache.size < THERMO_CACHE_MAX) thermoCache.set(key, v);
        return v;
    }

    let Qs;

    if (depth === 1) {
        // Depth 1: quiescence is already the cheapest eval, nothing to truncate.
        Qs = new Array(n);
        pathKeys.add(posKey);
        for (let i = 0; i < n; i++) {
            g.fast_make(moves[i]);
            Qs[i] = -tickMate(thermoSearch(g, 0, pathKeys));
            g.fast_undo();
        }
        pathKeys.delete(posKey);
    } else {
        // Depth ≥ 2: partition-function truncation (the softmax analog of α-β).
        // 1) cheap shallow pass (depth-2) to rank the children,
        // 2) fully recurse only those carrying non-negligible Boltzmann weight
        //    (within BOLTZ_SIGMA·T of the best, capped at TRUNC_MAX),
        // 3) the negligible tail keeps its shallow value — it contributes <1% of Z.
        // The width is temperature-scaled: forced (low-T) nodes prune to nearly one
        // move, open (high-T) nodes keep more, and as T→0 this becomes hard minimax.
        const quickQs = new Array(n);
        pathKeys.add(posKey);
        for (let i = 0; i < n; i++) {
            g.fast_make(moves[i]);
            quickQs[i] = -tickMate(thermoSearch(g, depth - 2, pathKeys));
            g.fast_undo();
        }

        let qMax = quickQs[0];
        for (let i = 1; i < n; i++) if (quickQs[i] > qMax) qMax = quickQs[i];
        const T_est = robustT(quickQs, n);
        const threshold = qMax - BOLTZ_SIGMA * T_est;

        const order = new Array(n);
        for (let i = 0; i < n; i++) order[i] = i;
        order.sort((a, b) => quickQs[b] - quickQs[a]);   // move ordering (#4)

        Qs = quickQs.slice();
        for (let r = 0; r < n && r < TRUNC_MAX; r++) {
            const i = order[r];
            if (r > 0 && quickQs[i] < threshold) break;   // past the dominant set
            g.fast_make(moves[i]);
            Qs[i] = -tickMate(thermoSearch(g, depth - 1, pathKeys));
            g.fast_undo();
        }
        pathKeys.delete(posKey);
    }

    return computeF(Qs, n, key);
}

function computeF(Qs, n, cacheKey) {
    let maxQ = Qs[0];
    for (let i = 1; i < n; i++) if (Qs[i] > maxQ) maxQ = Qs[i];
    // Mate scores are absorbing states, not thermal energies. A forced win
    // is taken deterministically (ground-state selection, T → 0 for this
    // decision); when every move loses by force, the value is the longest
    // resistance. No entropy bonus may attach to a terminal outcome —
    // otherwise "many ways to mate" would outscore the mate itself
    // (F = maxQ + T·ln Z > mate) and the engine would shuffle checks
    // forever instead of converting.
    if (maxQ > MATE_NEAR || maxQ < -MATE_NEAR || !Number.isFinite(maxQ)) {
        if (cacheKey && thermoCache.size < THERMO_CACHE_MAX) thermoCache.set(cacheKey, maxQ);
        return maxQ;
    }
    const T = robustT(Qs, n);
    let expSum = 0;
    for (let i = 0; i < n; i++) expSum += Math.exp((Qs[i] - maxQ) / T);
    const val = maxQ + T * Math.log(expSum);
    if (cacheKey && thermoCache.size < THERMO_CACHE_MAX) thermoCache.set(cacheKey, val);
    return val;
}

// ── Full Thermodynamic State (dashboard analysis) ──────────
function computeThermodynamics(g, depth) {
    activeC = heatCapMult * materialC(g);   // temperature set by material on the board
    syncCache();
    const rawMoves = g.fast_moves();
    if (rawMoves.length === 0) return null;

    const pathKeys = new Set(PAST_KEYS);
    const posKey = g.fast_hash();
    pathKeys.add(posKey);

    if (OPTIONALITY_MODE === 'thermo') g.fast_seed_acc();
    const Qs = new Array(rawMoves.length);
    const moveNames = new Array(rawMoves.length);
    const fromSqs = new Array(rawMoves.length);
    for (let i = 0; i < rawMoves.length; i++) {
        moveNames[i] = g.fast_to_san(rawMoves[i]);
        fromSqs[i] = g.fast_algebraic(rawMoves[i].from);
        g.fast_make(rawMoves[i]);
        Qs[i] = -tickMate(thermoSearch(g, depth - 1, pathKeys));
        g.fast_undo();
    }
    pathKeys.delete(posKey);
    g.fast_end_acc();

    const n = Qs.length;
    let maxQ = Qs[0], bestIdx = 0;
    for (let i = 1; i < n; i++) if (Qs[i] > maxQ) { maxQ = Qs[i]; bestIdx = i; }

    // Absorbing-state root: a forced mate (for either side) freezes the
    // ensemble — the decision is deterministic, so T sits at the floor and
    // F = maxQ. Mirrors the same rule in computeF.
    const T = (maxQ > MATE_NEAR || maxQ < -MATE_NEAR) ? T_FLOOR : robustT(Qs, n);

    const expTerms = new Array(n);
    let expSum = 0;
    for (let i = 0; i < n; i++) { expTerms[i] = Math.exp((Qs[i]-maxQ)/T); expSum += expTerms[i]; }

    const F = maxQ + T * Math.log(expSum);
    const probs = new Array(n);
    for (let i = 0; i < n; i++) probs[i] = expTerms[i] / expSum;

    let avgQ = 0, avgX = 0, avgX2 = 0, S = 0;
    for (let i = 0; i < n; i++) {
        avgQ += probs[i] * Qs[i];
        const x = Qs[i] - maxQ;              // centered: stable when |Q| is large
        avgX += probs[i] * x;
        avgX2 += probs[i] * x * x;
        if (probs[i] > 1e-15) S -= probs[i] * Math.log(probs[i]);
    }
    const TS = T * S;
    // Achieved capacity Var(Q)/T². Equals the demanded C in the subcritical
    // phase; saturates at the position's critical capacity C* when pinned.
    const Ceff = Math.max(avgX2 - avgX*avgX, 0) / (T*T);

    return { T, F, S, avgQ, TS, probs, moves: moveNames, fromSqs, Qs, bestIdx,
             Cdemand: activeC, Ceff };
}

// ── Chemical Potential: μ = −T ln(1 − p_P) ────────────────
// p_P = Σ π_a for all moves originating from piece P.
// μ_P = F − F_{−P}: free energy cost of removing P's moves
// from the partition function. Assumes moves from other
// pieces are unaffected (ideal-gas / independent-pieces limit).
function sqId(file, rank) { return String.fromCharCode(97+file)+(rank+1); }
function computeChemicalPotentials(g, thermo) {
    if (!thermo || !thermo.fromSqs) return [];

    const T = thermo.T;
    const board = g.board();
    const color = g.turn();

    // Sum Boltzmann probabilities by origin square
    const sqProb = {};
    for (let i = 0; i < thermo.fromSqs.length; i++) {
        const sq = thermo.fromSqs[i];
        sqProb[sq] = (sqProb[sq] || 0) + thermo.probs[i];
    }

    const results = [];
    const seen = {};
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const p = board[row][col];
            if (!p || p.color !== color || p.type === 'k') continue;
            const sq = sqId(col, 7 - row);
            if (seen[sq]) continue;
            seen[sq] = 1;
            const pSq = sqProb[sq] || 0;
            const mu = -T * Math.log(1 - Math.min(pSq, 1 - 1e-10));
            results.push({ type: p.type, square: sq, mu: mu, pSq: pSq });
        }
    }

    results.sort((a, b) => b.mu - a.mu);
    return results;
}

// ── Iterative Deepening ────────────────────────────────────
function bestMove(g, timeLimitMs) {
    const deadline = performance.now() + timeLimitMs;
    nodeCount = 0;
    activeC = heatCapMult * materialC(g);   // temperature set by material on the board
    // activeC is the heat-capacity C; the slider (onHeatCapChange) sets the
    // multiplier heatCapMult, and it is scaled here by the board material. No DOM
    // access, so bestMove can run inside a Web Worker.
    // Fresh table every move: cached values absorb repetition draws relative
    // to the current game path (graph-history interaction), so entries must
    // not outlive the move they were computed for.
    thermoCache.clear();
    tCacheC = activeC;

    const moves = g.fast_moves();
    const n = moves.length;
    if (n === 0) return null;
    if (n === 1) {
        searchStats = { depth: 1, nodes: 1 };
        return g.fast_to_san(moves[0]);
    }

    let bestIdx = 0;
    let reachedDepth = 0;
    const pathKeys = new Set();
    const rootPosKey = g.fast_hash();
    if (OPTIONALITY_MODE === 'thermo') g.fast_seed_acc();

    for (let depth = 1; depth <= 64; depth++) {
        const Qs = new Array(n);
        let timedOut = false;

        pathKeys.clear();
        pathKeys.add(rootPosKey);
        for (let k = 0; k < PAST_KEYS.length; k++) pathKeys.add(PAST_KEYS[k]);

        for (let i = 0; i < n; i++) {
            g.fast_make(moves[i]);
            Qs[i] = -tickMate(thermoSearch(g, depth - 1, pathKeys));
            g.fast_undo();

            // Depth 1 always runs to completion (it is nearly free): a partial
            // first iteration would leave undefined Qs and an arbitrary move.
            if (depth > 1 && performance.now() > deadline) { timedOut = true; break; }
        }

        if (timedOut && reachedDepth > 0) break;

        bestIdx = 0;
        for (let i = 1; i < n; i++) if (Qs[i] > Qs[bestIdx]) bestIdx = i;
        reachedDepth = depth;

        // Reorder moves by Q for next iteration (best first → better timeout behavior)
        if (depth < 64) {
            const order = [];
            for (let i = 0; i < n; i++) order.push(i);
            order.sort((a, b) => Qs[b] - Qs[a]);
            const newMoves = new Array(n);
            for (let i = 0; i < n; i++) newMoves[i] = moves[order[i]];
            for (let i = 0; i < n; i++) moves[i] = newMoves[i];
            bestIdx = 0; // best move is now first after reordering
        }

        if (performance.now() > deadline) break;
        if (nodeCount > NODE_HARD_LIMIT) break;
    }

    g.fast_end_acc();
    searchStats = { depth: reachedDepth, nodes: nodeCount };
    return g.fast_to_san(moves[bestIdx]);
}

// buildRootThermo: used only by computeThermodynamics (dashboard) now
function buildRootThermo(g, rawMoves, Qs, depth) {
    const n = rawMoves.length;
    const T = robustT(Qs, n);

    let maxQ = Qs[0], bestIdx = 0;
    for (let i = 1; i < n; i++) if (Qs[i] > maxQ) { maxQ = Qs[i]; bestIdx = i; }

    const expTerms = new Array(n);
    let expSum = 0;
    for (let i = 0; i < n; i++) { expTerms[i] = Math.exp((Qs[i]-maxQ)/T); expSum += expTerms[i]; }

    const F = maxQ + T * Math.log(expSum);
    const probs = new Array(n);
    for (let i = 0; i < n; i++) probs[i] = expTerms[i] / expSum;

    let avgQ = 0, S = 0;
    for (let i = 0; i < n; i++) {
        avgQ += probs[i] * Qs[i];
        if (probs[i] > 1e-15) S -= probs[i] * Math.log(probs[i]);
    }
    const TS = T * S;

    const moveNames = new Array(n);
    const fromSqs = new Array(n);
    for (let i = 0; i < n; i++) {
        moveNames[i] = g.fast_to_san(rawMoves[i]);
        fromSqs[i] = g.fast_algebraic(rawMoves[i].from);
    }

    return { T, F, S, avgQ, TS, probs, moves: moveNames, fromSqs, Qs, bestIdx, depth };
}

// Unified analysis entry point. Runs identically on the main thread (sync
// fallback) and inside the Web Worker. Given a FEN it optionally searches for
// the best move (when timeLimit is set), then computes the dashboard
// thermodynamics, and returns a plain serialisable object.
function _runAnalyze(msg) {
    heatCapMult = msg.heatCapMult || 1;   // slider value is a multiplier; effective C is set from material per-search
    PAST_KEYS = msg.pastKeys || [];       // played-game repetition keys (see collectPastKeys)
    const g = new Chess(msg.fen);
    const out = { turn: g.turn(), fen: g.fen(), gameOver: g.game_over() };
    if (msg.timeLimit != null) {
        const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const t0 = now();
        out.san = bestMove(g, msg.timeLimit);
        out.depth = searchStats.depth;
        out.nodes = searchStats.nodes;
        out.timeMs = Math.round(now() - t0);
    }
    if (!g.game_over()) {
        const depth = (msg.timeLimit != null) ? (searchStats.depth > 0 ? searchStats.depth : 2)
                                              : (msg.dashDepth || 2);
        const saveNC = nodeCount; nodeCount = 0;
        const th = computeThermodynamics(g, depth);
        nodeCount = saveNC;
        const r = rawU(g);
        out.Uw = r.Uw; out.Ub = r.Ub;
        out.thermo = th ? { T: th.T, F: th.F, S: th.S, avgQ: th.avgQ, TS: th.TS,
                            probs: th.probs, moves: th.moves, fromSqs: th.fromSqs,
                            Qs: th.Qs, bestIdx: th.bestIdx, depth: depth,
                            Cdemand: th.Cdemand, Ceff: th.Ceff,
                            mu: computeChemicalPotentials(g, th) } : null;
    }
    return out;
}

module.exports = { Chess, bestMove: (...a)=>bestMove(...a), _runAnalyze, setMode: m=>{OPTIONALITY_MODE=m;}, staticEval: g=>staticEval(g), setC: c=>{activeC=c;}, robustT: (...a)=>robustT(...a), get searchStats(){return searchStats;} };
