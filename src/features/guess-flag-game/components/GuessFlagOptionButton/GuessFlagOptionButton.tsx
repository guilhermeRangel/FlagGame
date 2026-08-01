import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '@/shared/theme';
import type { GuessFlagOption, GuessFlagOptionState } from '@/features/guess-flag-game/types';

type GuessFlagOptionButtonProps = {
  readonly option: GuessFlagOption;
  readonly state: GuessFlagOptionState;
  readonly isSelected: boolean;
  readonly onPress: (optionId: string) => void;
};

const STATE_LABELS: Record<GuessFlagOptionState, string> = {
  idle: 'Toque para responder',
  correct: 'Resposta correta',
  incorrect: 'Resposta incorreta',
  disabled: 'Opção desabilitada',
};

const STATE_ICONS: Record<GuessFlagOptionState, string> = {
  idle: '•',
  correct: '✓',
  incorrect: '✕',
  disabled: '—',
};

export function GuessFlagOptionButton({
  option,
  state,
  isSelected,
  onPress,
}: GuessFlagOptionButtonProps) {
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
  const iconColor =
    state === 'correct' ? colors.success : state === 'incorrect' ? colors.danger : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${option.countryName}. ${STATE_LABELS[state]}.`}
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={() => onPress(option.id)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor, borderColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.icon, { borderColor: iconColor }]}>
        <Text style={[styles.iconText, { color: iconColor }]}>{STATE_ICONS[state]}</Text>
      </View>
      <Text style={[styles.countryName, state === 'disabled' && styles.disabledText]}>
        {option.countryName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  icon: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: fontSizes.sm,
    fontWeight: '800',
  },
  countryName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
