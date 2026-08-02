import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlagVisual } from '@/shared/components/FlagVisual';
import type { FlagQuizChoice, FlagQuizOptionState } from '@/shared/gameplay/flag-quiz';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';

type FindFlagOptionCardProps = {
  readonly option: FlagQuizChoice;
  readonly position: number;
  readonly optionCount: number;
  readonly state: FlagQuizOptionState;
  readonly isSelected: boolean;
  readonly revealName: boolean;
  readonly onPress: (optionId: string) => void;
};

const STATE_LABELS: Record<Exclude<FlagQuizOptionState, 'idle'>, string> = {
  correct: 'Resposta correta',
  incorrect: 'Resposta incorreta',
  disabled: 'Opção não selecionada',
};

const STATE_ICONS: Record<Exclude<FlagQuizOptionState, 'idle'>, string> = {
  correct: '✓',
  incorrect: '✕',
  disabled: '—',
};

export function FindFlagOptionCard({
  option,
  position,
  optionCount,
  state,
  isSelected,
  revealName,
  onPress,
}: FindFlagOptionCardProps) {
  const isDisabled = state !== 'idle';
  const backgroundColor =
    state === 'correct'
      ? colors.successSurface
      : state === 'incorrect'
        ? colors.dangerSurface
        : state === 'disabled'
          ? colors.surfacePressed
          : colors.surface;
  const borderColor =
    state === 'correct' ? colors.success : state === 'incorrect' ? colors.danger : colors.border;
  const accessibilityLabel =
    state === 'idle'
      ? `Bandeira ${position} de ${optionCount}. Toque para responder.`
      : `${option.countryName}. ${STATE_LABELS[state]}.`;

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={() => onPress(option.id)}
      style={({ pressed }) => [
        styles.container,
        revealName && styles.containerWithName,
        { backgroundColor, borderColor },
        pressed && styles.pressed,
      ]}
    >
      <FlagVisual visual={option.visual} style={styles.flag} />

      {revealName && state !== 'idle' ? (
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={styles.resultRow}
        >
          <View style={[styles.icon, { borderColor }]}>
            <Text style={[styles.iconText, { color: borderColor }]}>{STATE_ICONS[state]}</Text>
          </View>
          <Text style={[styles.countryName, state === 'disabled' && styles.disabledText]}>
            {option.countryName}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 116,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  containerWithName: {
    minHeight: 154,
    gap: spacing.sm,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  flag: {
    width: 144,
    height: 84,
  },
  resultRow: {
    width: '100%',
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.pill,
  },
  iconText: {
    fontSize: fontSizes.sm,
    fontWeight: '800',
  },
  countryName: {
    maxWidth: '84%',
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '800',
    textAlign: 'center',
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
