import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  DIFFICULTY_CONFIG,
  GUESS_FLAG_DIFFICULTIES,
} from '@/features/guess-flag-game/constants/guessFlagGame.constants';
import type { GuessFlagDifficulty } from '@/features/guess-flag-game/types';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type GuessFlagDifficultySelectorProps = {
  readonly onSelect: (difficulty: GuessFlagDifficulty) => void;
};

export function GuessFlagDifficultySelector({ onSelect }: GuessFlagDifficultySelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.introduction}>
        <Text accessibilityRole="header" style={styles.title}>
          Escolha a dificuldade
        </Text>
        <Text style={styles.description}>
          Quanto maior o nível, mais desafiadoras serão as bandeiras e maior será a pontuação.
        </Text>
      </View>

      <View style={styles.options}>
        {GUESS_FLAG_DIFFICULTIES.map((difficulty, index) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          const accessibilityLabel = [
            `${config.label}, nível ${index + 1} de ${GUESS_FLAG_DIFFICULTIES.length}.`,
            config.description,
            `Exemplos: ${config.examples}.`,
            `Multiplicador ${config.multiplierLabel}.`,
          ].join(' ');

          return (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(260)} key={difficulty}>
              <Pressable
                accessibilityHint={`Inicia uma partida no nível ${config.label}`}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                onPress={() => onSelect(difficulty)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headingGroup}>
                    <Text style={styles.level}>
                      Nível {index + 1} de {GUESS_FLAG_DIFFICULTIES.length}
                    </Text>
                    <Text style={styles.cardTitle}>{config.label}</Text>
                  </View>

                  <View style={styles.multiplierBadge}>
                    <Text style={styles.multiplier}>{config.multiplierLabel}</Text>
                    <Text style={styles.multiplierCaption}>pontos</Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{config.description}</Text>
                <Text style={styles.examples}>
                  <Text style={styles.examplesLabel}>Exemplos: </Text>
                  {config.examples}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: spacing.lg,
  },
  introduction: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  options: {
    gap: spacing.md,
  },
  card: {
    width: '100%',
    minHeight: 150,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  cardPressed: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.primary,
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  headingGroup: {
    flex: 1,
  },
  level: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '800',
  },
  multiplierBadge: {
    minWidth: 64,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  multiplier: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '800',
  },
  multiplierCaption: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  cardDescription: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  examples: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  examplesLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
});
