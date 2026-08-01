import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, borderRadius, fontSizes, spacing } from '@/shared/theme';

type AppButtonVariant = 'primary' | 'secondary' | 'danger';

type AppButtonProps = {
  readonly title: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly variant?: AppButtonVariant;
  readonly accessibilityLabel?: string;
  readonly style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
  style,
}: AppButtonProps) {
  const buttonVariant =
    variant === 'danger' ? 'danger' : variant === 'secondary' ? 'secondary' : 'primary';
  const backgroundColor =
    buttonVariant === 'danger'
      ? colors.danger
      : buttonVariant === 'secondary'
        ? colors.surface
        : colors.primary;
  const titleColor =
    !disabled && buttonVariant === 'primary' ? colors.textOnPrimary : colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? colors.disabled
            : pressed
              ? buttonVariant === 'primary'
                ? colors.primaryPressed
                : buttonVariant === 'danger'
                  ? colors.dangerSurface
                  : colors.surfacePressed
              : backgroundColor,
        },
        style,
      ]}
    >
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
