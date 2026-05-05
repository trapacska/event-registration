import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChessBoard } from '@/components/chess-board';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { GLYPHS, GameState, initialGameState } from '@/lib/chess';

export default function PlayScreen() {
  const [game, setGame] = useState<GameState>(initialGameState);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const capturedByWhite = game.capturedByWhite.map(p => GLYPHS[p.color][p.type]).join('');
  const capturedByBlack = game.capturedByBlack.map(p => GLYPHS[p.color][p.type]).join('');

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
        },
      ]}>
      <ThemedView style={styles.inner}>
        <ThemedText type="subtitle" style={styles.title}>
          Chess
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <ThemedText type="smallBold" style={styles.sideLabel}>
            {game.turn === 'black' ? '▶ Black' : '  Black'}
          </ThemedText>
          <ThemedText style={styles.captured} themeColor="textSecondary">
            {capturedByBlack || '·'}
          </ThemedText>
        </ThemedView>

        <ChessBoard state={game} onStateChange={setGame} />

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <ThemedText type="smallBold" style={styles.sideLabel}>
            {game.turn === 'white' ? '▶ White' : '  White'}
          </ThemedText>
          <ThemedText style={styles.captured} themeColor="textSecondary">
            {capturedByWhite || '·'}
          </ThemedText>
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" style={styles.lastMove}>
          {game.lastMove ?? 'White to move'}
        </ThemedText>

        <Pressable
          onPress={() => setGame(initialGameState())}
          style={({ pressed }) => pressed && styles.pressed}>
          <ThemedView type="primary" style={styles.button}>
            <ThemedText type="smallBold" style={styles.buttonText}>New Game</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  title: {
    marginBottom: Spacing.one,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    width: '100%',
    maxWidth: 480,
    gap: Spacing.two,
  },
  sideLabel: {
    width: 68,
  },
  captured: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 1,
  },
  lastMove: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
