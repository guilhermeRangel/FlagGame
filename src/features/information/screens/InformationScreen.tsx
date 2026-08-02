import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Header } from '@/shared/components/Header';
import { FLAG_ASSETS } from '@/shared/domain/flags';
import { colors, fontSizes, spacing } from '@/shared/theme';
import type { AppNavigationProp } from '@/shared/types/navigation';

export function InformationScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <ScreenContainer style={styles.container}>
      <Header title="Sobre o jogo" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroImage}>
          <Image
            source={FLAG_ASSETS.un}
            style={styles.heroFlag}
            resizeMode="contain"
            accessible={false}
          />
        </View>
        <Text style={styles.sectionTitle}>Flag World</Text>
        <Text style={styles.bodyText}>
          Flag World é um jogo criado para explorar bandeiras, países e curiosidades de forma leve e
          interativa. Nesta primeira versão, o jogador poderá selecionar diferentes modos de jogo e
          interagir com bandeiras animadas.
        </Text>
        <Text style={styles.sectionTitle}>Autor</Text>
        <Text style={styles.bodyText}>
          Criado por Guilherme Rangel, com apoio do ChatGPT e GitHub Copilot.
        </Text>
        <Text style={styles.sectionTitle}>Observação</Text>
        <Text style={styles.bodyText}>
          Esta é uma versão inicial do projeto. Novos modos de jogo, desafios e conteúdos poderão
          ser adicionados futuramente.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  heroImage: {
    height: 200,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroFlag: {
    width: 150,
    height: 110,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
});
