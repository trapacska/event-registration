export type Color = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Piece {
  type: PieceType;
  color: Color;
}

export type Square = Piece | null;
export type Board = Square[][];
export interface Position {
  row: number;
  col: number;
}

export const GLYPHS: Record<Color, Record<PieceType, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

export interface GameState {
  board: Board;
  turn: Color;
  capturedByWhite: Piece[];
  capturedByBlack: Piece[];
  lastMove: string | null;
  selected: Position | null;
  legalMoves: Position[];
}

function makeInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, (): Square[] =>
    Array.from({ length: 8 }, (): Square => null),
  );

  const backRank: PieceType[] = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
  ];
  backRank.forEach((type, col) => {
    board[0][col] = { type, color: 'black' };
    board[7][col] = { type, color: 'white' };
  });
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  return board;
}

export function initialGameState(): GameState {
  return {
    board: makeInitialBoard(),
    turn: 'white',
    capturedByWhite: [],
    capturedByBlack: [],
    lastMove: null,
    selected: null,
    legalMoves: [],
  };
}

function posToAlg(pos: Position): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + pos.col);
  const rank = String(8 - pos.row);
  return `${file}${rank}`;
}

export function posEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function getLegalMoves(board: Board, pos: Position): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];

  const slide = (dRow: number, dCol: number): void => {
    let r = pos.row + dRow;
    let c = pos.col + dCol;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target !== null) {
        if (target.color !== piece.color) moves.push({ row: r, col: c });
        break;
      }
      moves.push({ row: r, col: c });
      r += dRow;
      c += dCol;
    }
  };

  const step = (r: number, c: number): void => {
    if (r < 0 || r >= 8 || c < 0 || c >= 8) return;
    const target = board[r][c];
    if (target === null || target.color !== piece.color) {
      moves.push({ row: r, col: c });
    }
  };

  switch (piece.type) {
    case 'pawn': {
      const dir = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      const nr = pos.row + dir;
      if (nr >= 0 && nr < 8 && board[nr][pos.col] === null) {
        moves.push({ row: nr, col: pos.col });
        const nr2 = pos.row + 2 * dir;
        if (pos.row === startRow && nr2 >= 0 && nr2 < 8 && board[nr2][pos.col] === null) {
          moves.push({ row: nr2, col: pos.col });
        }
      }
      for (const dc of [-1, 1]) {
        const cr = pos.row + dir;
        const cc = pos.col + dc;
        if (cr >= 0 && cr < 8 && cc >= 0 && cc < 8) {
          const t = board[cr][cc];
          if (t !== null && t.color !== piece.color) {
            moves.push({ row: cr, col: cc });
          }
        }
      }
      break;
    }
    case 'knight': {
      const km: [number, number][] = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of km) step(pos.row + dr, pos.col + dc);
      break;
    }
    case 'rook':
      slide(0, 1); slide(0, -1); slide(1, 0); slide(-1, 0);
      break;
    case 'bishop':
      slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
      break;
    case 'queen':
      slide(0, 1); slide(0, -1); slide(1, 0); slide(-1, 0);
      slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
      break;
    case 'king': {
      const km: [number, number][] = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1],
      ];
      for (const [dr, dc] of km) step(pos.row + dr, pos.col + dc);
      break;
    }
  }

  return moves;
}

export function applyMove(state: GameState, from: Position, to: Position): GameState {
  const board: Board = state.board.map(row => [...row]);
  const piece = board[from.row][from.col];
  if (!piece) return state;

  const captured = board[to.row][to.col];
  const newCapturedByWhite = [...state.capturedByWhite];
  const newCapturedByBlack = [...state.capturedByBlack];

  if (captured !== null) {
    if (piece.color === 'white') {
      newCapturedByWhite.push(captured);
    } else {
      newCapturedByBlack.push(captured);
    }
  }

  let movedPiece: Piece = piece;
  if (
    piece.type === 'pawn' &&
    ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7))
  ) {
    movedPiece = { type: 'queen', color: piece.color };
  }

  board[to.row][to.col] = movedPiece;
  board[from.row][from.col] = null;

  const lastMove = `${GLYPHS[piece.color][piece.type]} ${posToAlg(from)}→${posToAlg(to)}`;

  return {
    board,
    turn: state.turn === 'white' ? 'black' : 'white',
    capturedByWhite: newCapturedByWhite,
    capturedByBlack: newCapturedByBlack,
    lastMove,
    selected: null,
    legalMoves: [],
  };
}
