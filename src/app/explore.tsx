import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const RULES = [
  {
    glyph: '♙ ♟',
    name: 'Pawn',
    desc: 'Moves 1 square forward (2 from its starting square). Captures one square diagonally forward. Automatically promotes to a queen upon reaching the opposite back rank.',
  },
  {
    glyph: '♖ ♜',
    name: 'Rook',
    desc: 'Moves any number of squares horizontally or vertically. Cannot jump over pieces.',
  },
  {
    glyph: '♗ ♝',
    name: 'Bishop',
    desc: 'Moves any number of squares diagonally. Cannot jump over pieces. Each bishop stays on its starting color.',
  },
  {
    glyph: '♘ ♞',
    name: 'Knight',
    desc: 'Moves in an "L" shape — 2 squares in one direction then 1 perpendicular. The only piece that can jump over others.',
  },
  {
    glyph: '♕ ♛',
    name: 'Queen',
    desc: 'Combines rook and bishop — moves any number of squares in any straight or diagonal direction. The most powerful piece.',
  },
  {
    glyph: '♔ ♚',
    name: 'King',
    desc: 'Moves exactly 1 square in any direction. Must be kept safe — losing the king ends the game.',
  },
];

export default function RulesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{
        top: safeAreaInsets.top,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
      }}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Rules</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            How each piece moves
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.rulesContainer}>
          {RULES.map(rule => (
            <ThemedView
              key={rule.name}
              type="backgroundElement"
              style={[styles.ruleCard, { borderWidth: 1, borderColor: theme.border }]}>
              <ThemedView style={styles.ruleHeader} type="backgroundElement">
                <ThemedText style={[styles.glyph, { color: theme.primary }]}>{rule.glyph}</ThemedText>
                <ThemedText type="smallBold">{rule.name}</ThemedText>
              </ThemedView>
              <ThemedText type="small" themeColor="textSecondary">
                {rule.desc}
              </ThemedText>
            </ThemedView>
          ))}

          <ThemedView
            type="backgroundElement"
            style={[styles.ruleCard, { borderWidth: 1, borderColor: theme.border }]}>
            <ThemedText type="smallBold" style={styles.generalTitle}>
              General
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              White moves first. Tap a piece to select it, then tap a highlighted square to move.
              You cannot capture your own pieces. This implementation omits castling, en passant,
              and check / checkmate detection.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.two,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  rulesContainer: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  ruleCard: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  glyph: {
    fontSize: 20,
    lineHeight: 26,
  },
  generalTitle: {
    marginBottom: Spacing.one,
  },
});
