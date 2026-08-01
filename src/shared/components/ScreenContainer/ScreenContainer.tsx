import { ReactNode } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ViewStyle } from 'react-native';
import type { StatusBarStyle } from 'react-native';
import { colors } from '@/shared/theme';

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}> 
      <StatusBar barStyle={resolvedStatusBarStyle} backgroundColor={backgroundColor} />
      <SafeAreaView style={[styles.container, style, { backgroundColor }]}>{children}</SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
