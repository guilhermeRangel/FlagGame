# Handoff — Continuação do projeto Flag Game

## Intenção deste handoff

Este documento existe para que o próximo modelo entenda rapidamente o estado atual do projeto e continue de forma consistente. A meta principal é evoluir o app sem recomeçar do zero, preservando a estrutura já criada e evitando regressões.

## Contexto do projeto

- App mobile em React Native + Expo + TypeScript.
- Stack atual: Expo SDK 54 (`expo ~54.0.36`), React Native 0.81.5, React 19.1 e TypeScript 5.9.
- A linha do SDK 54 foi escolhida para manter compatibilidade com o Expo Go 54 em aparelhos físicos Android e iOS via QR Code.
- Objetivo atual: manter o fluxo principal funcional e continuar refinando a experiência do jogo de bandeiras.
- O fluxo já implementado é: Splash → Welcome → Information → Game Selection → Flag Game.

## Estado atual confirmado

- Navegação tipada e centralizada, com pilha corrigida: Welcome usa `navigate` (não `replace`) para abrir a seleção de jogos, então o botão voltar funciona em toda a cadeia Welcome → Information/Game Selection → Flag Game.
- Orientação por tela: Welcome e Information ficam livres (padrão do sistema); Game Selection e Flag Game são travadas em `PORTRAIT` (não mais `LANDSCAPE`).
- Tela de seleção de jogos implementada com `FlatList` (`flex: 1` explícito) rolável, 10 opções (1 disponível, 9 "em breve").
- Tela Welcome com tema musical local em loop, controlado pelo botão Música/Silencioso com `expo-audio`.
- Tela de jogo principal com grade de 3 colunas por linha e 30 bandeiras sorteadas por rodada, dentro de um `ScrollView`.
- O catálogo contém as 262 bandeiras RGI de países/regiões e subdivisões disponíveis no Unicode Emoji 17.0: 259 regionais mais Inglaterra, Escócia e País de Gales.
- Cada card aceita quatro interações; ao atingir o limite ele é desabilitado, recebe aparência esgotada e deixa de atualizar o estado.
- Information, Game Selection e Flag Game usam 32 px de padding horizontal pelo token `spacing.xl`; o `ScreenContainer` mantém 24 px como padrão para as demais telas.
- Estrutura organizada em [src/app](src/app), [src/features](src/features) e [src/shared](src/shared).
- Tema compartilhado e componentes reutilizáveis existentes.
- O projeto passou na validação de tipos com `npx tsc --noEmit`.
- Testado manualmente no emulador Android via `adb` (navegação completa Welcome → Game Selection → volta, e Game Selection → Flag Game), confirmando orientação e rolagem corretas.

## Arquivos e áreas importantes

- [App.tsx](App.tsx): ponto de entrada da aplicação.
- [src/app/navigation/AppNavigator.tsx](src/app/navigation/AppNavigator.tsx): fluxo principal de telas e rotas.
- [src/features/welcome/screens/WelcomeScreen.tsx](src/features/welcome/screens/WelcomeScreen.tsx): tela inicial; usa `navigate` para preservar a pilha de navegação.
- [src/shared/theme/index.ts](src/shared/theme/index.ts): cores, espaçamentos, tipografia e tokens visuais.
- [src/shared/components/ScreenContainer/ScreenContainer.tsx](src/shared/components/ScreenContainer/ScreenContainer.tsx): wrapper comum das telas.
- [src/features/flag-game/screens/FlagGameScreen.tsx](src/features/flag-game/screens/FlagGameScreen.tsx): gameplay principal, grade 5 colunas em `ScrollView`, portrait.
- [src/features/flag-game/data/flags.data.ts](src/features/flag-game/data/flags.data.ts): catálogo Unicode com 262 bandeiras; 30 são sorteadas por rodada.
- [src/features/flag-game/components/InteractiveFlagCard.tsx](src/features/flag-game/components/InteractiveFlagCard.tsx): card adaptado para grade (larguras percentuais).
- [src/features/game-selection/screens/GameSelectionScreen.tsx](src/features/game-selection/screens/GameSelectionScreen.tsx): tela de seleção dos modos, portrait.
- [src/shared/assets/audio/welcome-theme.wav](src/shared/assets/audio/welcome-theme.wav): tema original de 12 segundos usado na Welcome.
- [scripts/generate-welcome-theme.mjs](scripts/generate-welcome-theme.mjs): gerador reproduzível do tema musical.
- [scripts/generate-flags-data.mjs](scripts/generate-flags-data.mjs): gerador do catálogo a partir do `emoji-test.txt` oficial.

## Últimas correções aplicadas (mais recentes primeiro)

- Adicionado áudio real ao botão da Welcome com `expo-audio`, incluído no Expo Go do SDK 54; o áudio começa apenas após o toque do usuário e pode ser pausado pelo mesmo botão.
- Corrigido o `ScreenContainer` para usar uma `View` interna, evitando que o `SafeAreaView` do iOS ignore o padding do conteúdo. Information, Game Selection e Flag Game agora usam 32 px somente nas laterais.
- Expandido o catálogo de 30 para 262 bandeiras RGI do Unicode Emoji 17.0, mantendo 30 itens aleatórios por rodada por desempenho e legibilidade.
- Ao completar quatro toques, o card da bandeira agora fica desabilitado, muda para cores de indisponibilidade e exibe o texto “Indisponível”.
- Migrado o projeto do SDK 57 para o Expo SDK 54 para abrir no Expo Go 54 por QR Code; dependências Expo/React Native foram alinhadas e validadas com Expo Doctor.
- Corrigido bug de navegação: `WelcomeScreen` chamava `navigation.replace(ROUTES.GAME_SELECTION)`, removendo a Welcome da pilha e quebrando o botão voltar em Game Selection. Trocado para `navigation.navigate(...)`.
- Trocada a orientação de `GameSelectionScreen` e `FlagGameScreen` de `LANDSCAPE` para `PORTRAIT`.
- `GameSelectionScreen`: adicionado `style={{ flex: 1 }}` ao `FlatList` para garantir rolagem confiável em qualquer orientação.
- `FlagGameScreen`: lista horizontal (`FlatList`) trocada por `ScrollView` com grade `flexWrap`; atualmente são 3 colunas por linha, com cards mais largos para melhorar a leitura dos países.
- `flags.data.ts`: expandido de 10 para 30 países; `getRandomFlags` corrigido para embaralhar mesmo quando a quantidade pedida é igual ao total (antes retornava a ordem original sem embaralhar).
- `InteractiveFlagCard`: redimensionado para caber em colunas estreitas (largura percentual, fontes menores, `numberOfLines`/`ellipsizeMode` para evitar overflow).

## Regras importantes para o próximo modelo

- Preserve a arquitetura atual; não reescreva o projeto do zero.
- Use aliases absolutos com `@` já configurados.
- Mantenha tipagem forte e evite qualquer regressão em navegação.
- Prefira mudanças pequenas e localizadas.
- Para áudio, use `expo-audio` compatível com o SDK 54; não reintroduza `expo-av`, que está obsoleto.
- Para manter estabilidade, teste com `npx tsc --noEmit` antes de afirmar que está pronto.

## Armadilhas conhecidas (aprendidas durante a validação)

- **Larguras percentuais em grade com `flexWrap`**: evite usar exatamente `33.33%` em três colunas, pois o arredondamento do Yoga pode derrubar o último card para outra linha. A grade usa `width: '31%'` com `justifyContent: 'space-between'`.
- **`adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1`** não é um "relaunch limpo": o argumento numérico injeta esse tanto de eventos de toque aleatórios após abrir o app. Para reabrir sem efeitos colaterais, use `adb shell am start -n <pkg>/<activity>` (ou `force-stop` + `am start`).
- **Restauração de estado de navegação**: forçar reabertura via deep link (`am start -a VIEW -d exp://...`) pode restaurar a última tela aberta (não a Splash), e remontar telas anteriores da pilha ao mesmo tempo — isso pode causar corrida entre travamentos de orientação de telas diferentes. Para testar orientação de forma confiável, prefira navegar manualmente (tela a tela) a partir de um estado limpo (`pm clear` ou `force-stop`) em vez de confiar em deep link direto após uso prévio do app.

## Comandos úteis

- `npm install`
- `npx tsc --noEmit`
- `npx expo start`
- `npx expo start --clear` para gerar um QR Code com cache limpo
- `npx expo start --android`
- `npx expo run:android` (build nativo, caminho mais confiável de validação no Android)
- `adb devices` para validar o emulador antes de rodar no Android

## Observações conhecidas

- O catálogo segue o Unicode Emoji 17.0. A bandeira de Sark e as bandeiras por tag (Inglaterra, Escócia e País de Gales) podem cair para letras/bandeira preta em versões antigas do sistema, dependendo da fonte de emojis do aparelho.
- Alguns warnings de depreciação podem aparecer em `SafeAreaView`, mas não bloquearam a execução.
- A execução no Android depende de um emulador ativo e acessível pelo ADB.
- O objetivo agora é continuar evoluindo a experiência, não refazer a base.

## Prioridade recomendada

1. Manter o fluxo atual estável (navegação e orientação já validadas ponta a ponta).
2. Melhorar UI/UX e conteúdo do jogo.
3. Adicionar novos modos apenas se a base continuar estável.
4. Validar sempre com TypeScript e pelo menos um teste de execução no emulador.
