import { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { applyMove, GameState, getLegalMoves, GLYPHS, Position, posEqual } from '@/lib/chess';

const LIGHT_SQ = '#f0d9b5';
const DARK_SQ = '#b58863';
const SEL_COLOR = 'rgba(255, 230, 0, 0.55)';
const MOVE_COLOR = 'rgba(255, 230, 0, 0.30)';

interface Props {
  state: GameState;
  onStateChange: (next: GameState) => void;
}

export function ChessBoard({ state, onStateChange }: Props) {
  const { width } = useWindowDimensions();
  const sqSize = Math.floor(Math.min(width - Spacing.three * 2, 480) / 8);
  const boardSize = sqSize * 8;
  const pieceSize = Math.floor(sqSize * 0.68);

  const handlePress = useCallback(
    (pos: Position) => {
      const { board, selected, legalMoves, turn } = state;
      const piece = board[pos.row][pos.col];

      if (selected) {
        if (legalMoves.some(m => posEqual(m, pos))) {
          onStateChange(applyMove(state, selected, pos));
          return;
        }
        if (piece && piece.color === turn) {
          onStateChange({ ...state, selected: pos, legalMoves: getLegalMoves(board, pos) });
          return;
        }
        onStateChange({ ...state, selected: null, legalMoves: [] });
        return;
      }

      if (piece && piece.color === turn) {
        onStateChange({ ...state, selected: pos, legalMoves: getLegalMoves(board, pos) });
      }
    },
    [state, onStateChange],
  );

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {state.board.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((piece, ci) => {
            const pos: Position = { row: ri, col: ci };
            const isLight = (ri + ci) % 2 === 0;
            const isSel = state.selected !== null && posEqual(state.selected, pos);
            const isTarget = state.legalMoves.some(m => posEqual(m, pos));

            return (
              <Pressable
                key={ci}
                style={[
                  styles.sq,
                  { width: sqSize, height: sqSize, backgroundColor: isLight ? LIGHT_SQ : DARK_SQ },
                ]}
                onPress={() => handlePress(pos)}>
                {isSel && <View style={[StyleSheet.absoluteFill, { backgroundColor: SEL_COLOR }]} />}
                {isTarget && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: MOVE_COLOR }]} />
                )}
                {isTarget && piece === null && (
                  <View
                    style={[
                      styles.dot,
                      {
                        width: sqSize * 0.3,
                        height: sqSize * 0.3,
                        borderRadius: (sqSize * 0.3) / 2,
                      },
                    ]}
                  />
                )}
                {piece !== null && (
                  <Text
                    style={[
                      styles.piece,
                      { fontSize: pieceSize },
                      piece.color === 'white' ? styles.wPiece : styles.bPiece,
                    ]}>
                    {GLYPHS[piece.color][piece.type]}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  sq: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  piece: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  wPiece: {
    color: '#fffef0',
    textShadowColor: '#1a0a00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  bPiece: {
    color: '#1a0500',
    textShadowColor: '#d4a870',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
});
