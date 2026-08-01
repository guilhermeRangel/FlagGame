import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { FlagVisual as FlagVisualValue } from '@/shared/domain/flags';

export type FlagVisualProps = {
  readonly visual: FlagVisualValue;
  readonly style?: StyleProp<ViewStyle>;
  readonly emojiStyle?: StyleProp<TextStyle>;
  readonly accessibilityLabel?: string;
};

export function FlagVisual({ visual, style, emojiStyle, accessibilityLabel }: FlagVisualProps) {
  const isAccessible = Boolean(accessibilityLabel);

  return (
    <View
      accessible={isAccessible}
      accessibilityRole={isAccessible ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={isAccessible ? 'yes' : 'no-hide-descendants'}
      style={[styles.container, style]}
    >
      {visual.type === 'emoji' ? (
        <Text accessible={false} style={[styles.emoji, emojiStyle]}>
          {visual.value}
        </Text>
      ) : (
        <Image
          accessible={false}
          resizeMode="contain"
          source={visual.source}
          style={styles.asset}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  asset: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 72,
    lineHeight: 84,
    textAlign: 'center',
  },
});
