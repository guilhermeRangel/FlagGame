import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/shared/components/AppButton';
import { MEMORY_GAME_DIFFICULTY_CONFIG } from '@/features/memory-game/constants/memoryGame.constants';
import type { MemoryGameDifficulty } from '@/features/memory-game/types';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type MemoryGameResultProps = {
  readonly difficulty: MemoryGameDifficulty;
  readonly moves: number;
  readonly bestStreak: number;
  readonly onChangeDifficulty: () => void;
  readonly onBackToGames: () => void;
};

export function MemoryGameResult({
  difficulty,
  moves,
  bestStreak,
  onChangeDifficulty,
  onBackToGames,
}: MemoryGameResultProps) {
  const difficultyLabel = MEMORY_GAME_DIFFICULTY_CONFIG[difficulty].label;

  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityLabel={`Partida concluída no nível ${difficultyLabel}, em ${moves} jogadas. Melhor sequência: ${bestStreak}.`}
        style={styles.heading}
      >
        <Text style={styles.celebration}>✓</Text>
        <View style={styles.headingText}>
          <Text accessibilityRole="header" style={styles.title}>
            Todos os pares encontrados!
          </Text>
          <Text style={styles.summary}>
            {difficultyLabel} · {moves} jogadas · melhor sequência {bestStreak}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Trocar dificuldade"
          variant="secondary"
          onPress={onChangeDifficulty}
          style={styles.action}
        />
        <AppButton
          title="Voltar aos jogos"
          variant="secondary"
          onPress={onBackToGames}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.successSurface,
    borderColor: colors.success,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  celebration: {
    color: colors.success,
    fontSize: fontSizes.xl,
    fontWeight: '900',
  },
  headingText: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  summary: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
