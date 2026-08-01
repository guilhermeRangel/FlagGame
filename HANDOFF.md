# Handoff — Continuação do projeto Flag Game

## Intenção deste handoff
Este documento existe para que o próximo modelo entenda rapidamente o estado atual do projeto e continue de forma consistente. A meta principal é evoluir o app sem recomeçar do zero, preservando a estrutura já criada e evitando regressões.

## Contexto do projeto
- App mobile em React Native + Expo + TypeScript.
- Stack atual: Expo SDK 57, React Native 0.86 e TypeScript com tipagem forte.
- Objetivo atual: manter o fluxo principal funcional e continuar refinando a experiência do jogo de bandeiras.
- O fluxo já implementado é: Splash → Welcome → Information → Game Selection → Flag Game.

## Estado atual confirmado
- Navegação tipada e centralizada, com pilha corrigida: Welcome usa `navigate` (não `replace`) para abrir a seleção de jogos, então o botão voltar funciona em toda a cadeia Welcome → Information/Game Selection → Flag Game.
- Orientação por tela: Welcome e Information ficam livres (padrão do sistema); Game Selection e Flag Game são travadas em `PORTRAIT` (não mais `LANDSCAPE`).
- Tela de seleção de jogos implementada com `FlatList` (`flex: 1` explícito) rolável, 10 opções (1 disponível, 9 "em breve").
- Tela de jogo principal com grade de 5 colunas por linha, 30 bandeiras, dentro de um `ScrollView`.
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
- [src/features/flag-game/data/flags.data.ts](src/features/flag-game/data/flags.data.ts): dados das bandeiras (30 países).
- [src/features/flag-game/components/InteractiveFlagCard.tsx](src/features/flag-game/components/InteractiveFlagCard.tsx): card adaptado para grade (larguras percentuais).
- [src/features/game-selection/screens/GameSelectionScreen.tsx](src/features/game-selection/screens/GameSelectionScreen.tsx): tela de seleção dos modos, portrait.

## Últimas correções aplicadas (mais recentes primeiro)
- Corrigido bug de navegação: `WelcomeScreen` chamava `navigation.replace(ROUTES.GAME_SELECTION)`, removendo a Welcome da pilha e quebrando o botão voltar em Game Selection. Trocado para `navigation.navigate(...)`.
- Trocada a orientação de `GameSelectionScreen` e `FlagGameScreen` de `LANDSCAPE` para `PORTRAIT`.
- `GameSelectionScreen`: adicionado `style={{ flex: 1 }}` ao `FlatList` para garantir rolagem confiável em qualquer orientação.
- `FlagGameScreen`: lista horizontal (`FlatList`) trocada por `ScrollView` com grade `flexWrap` de 5 colunas por linha.
- `flags.data.ts`: expandido de 10 para 30 países; `getRandomFlags` corrigido para embaralhar mesmo quando a quantidade pedida é igual ao total (antes retornava a ordem original sem embaralhar).
- `InteractiveFlagCard`: redimensionado para caber em colunas estreitas (largura percentual, fontes menores, `numberOfLines`/`ellipsizeMode` para evitar overflow).

## Regras importantes para o próximo modelo
- Preserve a arquitetura atual; não reescreva o projeto do zero.
- Use aliases absolutos com `@` já configurados.
- Mantenha tipagem forte e evite qualquer regressão em navegação.
- Prefira mudanças pequenas e localizadas.
- Não adicione módulos de áudio nativos sem validar compatibilidade com Android; o uso anterior de `expo-av` causou crash nativo no emulador e foi removido do caminho verificado.
- Para manter estabilidade, teste com `npx tsc --noEmit` antes de afirmar que está pronto.

## Armadilhas conhecidas (aprendidas durante a validação)
- **Larguras percentuais em grade com `flexWrap`**: usar `width: '20%'` para 5 colunas pode arredondar e encaixar só 4 por linha (bug de arredondamento do Yoga). Solução aplicada: `width: '18%'` + `justifyContent: 'space-between'` no container da linha.
- **`adb shell monkey -p <pkg> -c android.intent.category.LAUNCHER 1`** não é um "relaunch limpo": o argumento numérico injeta esse tanto de eventos de toque aleatórios após abrir o app. Para reabrir sem efeitos colaterais, use `adb shell am start -n <pkg>/<activity>` (ou `force-stop` + `am start`).
- **Restauração de estado de navegação**: forçar reabertura via deep link (`am start -a VIEW -d exp://...`) pode restaurar a última tela aberta (não a Splash), e remontar telas anteriores da pilha ao mesmo tempo — isso pode causar corrida entre travamentos de orientação de telas diferentes. Para testar orientação de forma confiável, prefira navegar manualmente (tela a tela) a partir de um estado limpo (`pm clear` ou `force-stop`) em vez de confiar em deep link direto após uso prévio do app.

## Comandos úteis
- `npm install`
- `npx tsc --noEmit`
- `npx expo start`
- `npx expo start --android`
- `npx expo run:android` (build nativo, caminho mais confiável de validação no Android)
- `adb devices` para validar o emulador antes de rodar no Android

## Observações conhecidas
- Alguns warnings de depreciação podem aparecer em `SafeAreaView`, mas não bloquearam a execução.
- A execução no Android depende de um emulador ativo e acessível pelo ADB.
- O objetivo agora é continuar evoluindo a experiência, não refazer a base.

## Prioridade recomendada
1. Manter o fluxo atual estável (navegação e orientação já validadas ponta a ponta).
2. Melhorar UI/UX e conteúdo do jogo.
3. Adicionar novos modos apenas se a base continuar estável.
4. Validar sempre com TypeScript e pelo menos um teste de execução no emulador.
