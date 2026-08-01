import { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import type { StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/shared/theme';

type ScreenStatusBarStyle = StatusBarStyle | 'light' | 'dark' | 'auto';

type ScreenContainerProps = {
  readonly children: ReactNode;
  readonly style?: ViewStyle;
  readonly backgroundColor?: string;
  readonly statusBarStyle?: ScreenStatusBarStyle;
};

function normalizeStatusBarStyle(style: ScreenStatusBarStyle | undefined): StatusBarStyle {
  switch (style) {
    case 'light':
    case 'light-content':
      return 'light-content';
    case 'dark':
    case 'dark-content':
      return 'dark-content';
    case 'auto':
    default:
      return 'default';
  }
}

export function ScreenContainer({
  children,
  style,
  backgroundColor = colors.background,
  statusBarStyle = 'light',
}: ScreenContainerProps) {
  const resolvedStatusBarStyle = normalizeStatusBarStyle(statusBarStyle);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar barStyle={resolvedStatusBarStyle} backgroundColor={backgroundColor} />
      <View style={[styles.container, style, { backgroundColor }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
