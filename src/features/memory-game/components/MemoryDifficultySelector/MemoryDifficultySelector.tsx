import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  getMemoryGameCardCount,
  MEMORY_GAME_DIFFICULTIES,
  MEMORY_GAME_DIFFICULTY_CONFIG,
} from '@/features/memory-game/constants/memoryGame.constants';
import type { MemoryGameDifficulty } from '@/features/memory-game/types';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type MemoryDifficultySelectorProps = {
  readonly selectedDifficulty: MemoryGameDifficulty;
  readonly disabled?: boolean;
  readonly onSelect: (difficulty: MemoryGameDifficulty) => void;
};

export function MemoryDifficultySelector({
  selectedDifficulty,
  disabled = false,
  onSelect,
}: MemoryDifficultySelectorProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Escolha a dificuldade
      </Text>
      <Text style={styles.description}>Neste jogo, o nível define o tamanho do tabuleiro.</Text>

      <View style={styles.options}>
        {MEMORY_GAME_DIFFICULTIES.map((difficulty) => {
          const config = MEMORY_GAME_DIFFICULTY_CONFIG[difficulty];
          const cardCount = getMemoryGameCardCount(difficulty);
          const isSelected = difficulty === selectedDifficulty;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={`${config.label}. ${cardCount} cartas, ${config.pairCount} pares.`}
              accessibilityState={{ checked: isSelected, disabled }}
              disabled={disabled}
              key={difficulty}
              onPress={() => onSelect(difficulty)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
                disabled && styles.optionDisabled,
              ]}
            >
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {config.label}
              </Text>
              <Text style={styles.cardCount}>{cardCount}</Text>
              <Text style={styles.cardCaption}>cartas</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  optionSelected: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.primary,
  },
  optionPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  optionDisabled: {
    opacity: 0.7,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  cardCount: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  cardCaption: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
});
