# Handoff da sessão — Memória das Bandeiras

Data: 2026-08-01

## Objetivo

Implementar a quarta modalidade com mecânica clássica de memória, quatro colunas, dificuldade baseada apenas na quantidade de cartas e som a cada par correto, preservando Expo SDK 54, Expo Go por QR Code e os três jogos existentes.

## Resultado entregue

- Quarto card habilitado como **Memória das Bandeiras**, com rota tipada `MemoryGame`.
- Configuração no início da própria tela:
  - Fácil: 20 cartas, 10 pares e 5 linhas;
  - Médio: 24 cartas, 12 pares e 6 linhas;
  - Difícil: 28 cartas, 14 pares e 7 linhas.
- `FlatList` responsiva com quatro colunas, padding lateral de 24 px e rolagem sem `ScrollView` aninhada.
- Verso neutro sem texto, emoji ou `?`; face revelada mostra somente o asset local da bandeira com `contain`.
- Flip de 220 ms com Reanimated e respeito à preferência de redução de movimento.
- HUD com pares, jogadas, sequência atual e melhor sequência, além de uma segunda linha centralizada
  com a última bandeira encontrada.
- Resultado inline, mantendo o tabuleiro completo visível, com jogar novamente, trocar dificuldade e voltar aos jogos.
- Nenhuma dependência, API, permissão ou plugin nativo novo.

## Regras e estado

O reducer próprio usa os estados:

```text
ready
  └── iniciar → playing
        ├── primeira carta → playing, 1 revelada
        ├── par correto → playing, par matched, sequência +1
        ├── par incorreto → resolving-mismatch
        │                    ├── 900 ms → começa o fechamento
        │                    └── 220 ms → playing, tabuleiro liberado
        └── último par → finished
```

- Uma jogada é contabilizada somente ao virar a segunda carta.
- Acerto mantém o par aberto e atualiza sequência e melhor sequência.
- O último país encontrado muda somente em um acerto, permanece após erros e é limpo em uma nova
  partida ou ao retornar à configuração.
- Erro zera apenas a sequência atual.
- Mesmo card, card já revelado/encontrado e terceiro toque durante erro são ignorados.
- O tabuleiro permanece bloqueado até as duas faces estarem visualmente fechadas.
- Timers usam `gameId`; ações antigas depois de restart/saída são ignoradas.
- Reiniciar, voltar e desmontar limpam timers e interrompem o player.
- Voltar durante partida/resultado retorna à configuração; voltar na configuração sai para a lista de jogos.

## Geração do tabuleiro

`createMemoryGameDeck(flags, { difficulty, random })` é puro, imutável e usa Fisher–Yates.

- Seleciona 10, 12 ou 14 bandeiras do catálogo inteiro; não usa a dificuldade editorial dos quizzes.
- Cada seleção gera exatamente duas cartas com `id` de instância diferente e `pairId` comum.
- IDs, nomes e identidades visuais são filtrados antes da seleção.
- `au/hm`, `cp/fr/mf`, `dg/io`, `ea/es`, `no/sj` e `um/us` nunca viram pares diferentes no mesmo tabuleiro.
- Catálogo inválido ou insuficiente retorna `[]`; a tela mostra estado indisponível em vez de um tabuleiro parcial.
- RNG injetável permite validar a mesma seed deterministicamente.

## Refatoração compartilhada

- `FlagVisual` foi promovido para `src/shared/components/FlagVisual/`.
- As equivalências foram promovidas para `src/shared/domain/flags/flagVisualIdentity.ts`.
- Os antigos caminhos em `shared/gameplay/flag-quiz` ficaram como reexports, preservando os dois quizzes.
- O gerador de quiz passou a consumir a identidade visual do domínio neutro.
- Bandeiras Giratórias não foi refatorado nesta etapa.

## Som e acessibilidade

- `useMemoryGameSounds` usa o WAV local `correct-answer.wav`.
- O som toca exatamente uma vez por evento de par confirmado, inclusive no último par.
- Não toca na primeira revelação nem em erro; o player volta ao início antes de cada reprodução.
- IDs de evento evitam repetição por rerender/toque rápido; falhas de áudio são absorvidas.
- Carta fechada anuncia somente posição; não expõe país nem visual.
- A primeira carta anuncia explicitamente o país e pede a segunda escolha.
- Par correto, erro e conclusão também são anunciados.
- Carta encontrada anuncia país e estado; matched usa ainda borda e marcador verdes.

## Validações executadas

- [x] Documentação versionada [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) e [`expo-audio`](https://docs.expo.dev/versions/v57.0.0/sdk/audio/) consultadas antes do código; SDK 54 preservado.
- [x] TypeScript estrito, ESLint completo e Prettier.
- [x] Expo Doctor: 18/18.
- [x] `npx expo install --check`: dependências atualizadas pelo mapa local, com aviso de offline.
- [x] Bundles Hermes Android e iOS com 262 PNGs e efeitos locais.
- [x] Harness com 150 tabuleiros: 50 seeds por nível, quantidades, pares, IDs, determinismo, imutabilidade e equivalências.
- [x] Auditoria dos 262 PNGs por pixels decodificados: seis famílias equivalentes cobertas; `um/us` não pode mais gerar quatro cartas com aparência dos Estados Unidos.
- [x] Regressão com 3.000 tabuleiros do catálogo completo: exatamente duas cartas por país e no máximo um par por identidade visual em todos os níveis.
- [x] Regressão com 400 quizzes: distribuições e alternativas únicas preservadas após ampliar as equivalências.
- [x] Reducer: ready/start, acerto, erro, sequência, melhor sequência, toque duplicado, bloqueio, fechamento em duas etapas, timer antigo, finalização, restart/reset e estado indisponível.
- [x] Regressão do último país: acerto define o nome, erro preserva, novo acerto substitui, último
      par mantém no resultado e restart/reset limpam.
- [x] Expo Go no emulador Android: quarto card, configuração Fácil/Difícil, 20 e 28 cartas, quatro colunas, HUD, PNG real, flip, erro, jogada e fechamento automático.
- [ ] Partida completa por toques e resultado no emulador.
- [ ] Aparelho físico por QR Code, reprodução audível, TalkBack, VoiceOver, redução de movimento e fluxo iOS por toques.

## Arquivos centrais

- `src/features/memory-game/screens/MemoryGameScreen.tsx`
- `src/features/memory-game/hooks/useMemoryGame.ts`
- `src/features/memory-game/hooks/useMemoryGameSounds.ts`
- `src/features/memory-game/state/memoryGame.reducer.ts`
- `src/features/memory-game/utils/createMemoryGameDeck.ts`
- `src/features/memory-game/components/MemoryCard/MemoryCard.tsx`
- `src/shared/components/FlagVisual/FlagVisual.tsx`
- `src/shared/domain/flags/flagVisualIdentity.ts`

## Observações para próximas sessões

- Não usar a curadoria editorial de países para determinar a dificuldade da memória.
- Se o tempo visual do erro mudar, preservar as duas fases: exposição e fechamento bloqueado.
- Não afirmar teste auditivo ou de leitor de tela até executá-lo em hardware real.
- O próximo refinamento natural é testar uma partida completa física e ajustar tamanho/tempo apenas com evidência do aparelho.
