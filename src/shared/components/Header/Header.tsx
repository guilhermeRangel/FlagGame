import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius, fontSizes, spacing } from '@/shared/theme';

type HeaderProps = {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  backText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  rightAction: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
