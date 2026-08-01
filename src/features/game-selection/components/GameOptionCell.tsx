import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius, fontSizes, spacing } from '@/shared/theme';
import type { GameOption } from '@/features/game-selection/types';

type GameOptionCellProps = {
  option: GameOption;
  onPress: (option: GameOption) => void;
};

export function GameOptionCell({ option, onPress }: GameOptionCellProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.title}
      accessibilityState={{ disabled: !option.isAvailable }}
      disabled={!option.isAvailable}
      onPress={() => onPress(option)}
      style={({ pressed }) => [
        styles.cell,
        !option.isAvailable && styles.cellDisabled,
        pressed && option.isAvailable ? styles.cellPressed : null,
      ]}
    >
      <View style={styles.iconWrapper}>
        <Text style={styles.iconText}>{option.isAvailable ? '▶' : '⏳'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !option.isAvailable && styles.titleDisabled]}>{option.title}</Text>
        <Text style={[styles.description, !option.isAvailable && styles.titleDisabled]}>
          {option.description}
        </Text>
        {!option.isAvailable ? (
          <Text style={styles.badge}>{option.badge ?? 'Em breve'}</Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>{option.isAvailable ? '›' : '•'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  cellDisabled: {
    opacity: 0.7,
    backgroundColor: '#0f1c31',
  },
  cellPressed: {
    backgroundColor: colors.surfacePressed,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  titleDisabled: {
    color: colors.textSecondary,
  },
  description: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.xl,
    marginLeft: spacing.sm,
  },
});
