# Handoff da sessão — Dificuldades do “Qual é a Bandeira?”

Data: 2026-08-01

## Objetivo

Adicionar ao quiz uma escolha inicial entre Fácil, Médio, Difícil e Especialista, com curadoria explícita para o público brasileiro, distribuição acumulada de bandeiras e pontuação proporcional ao desafio. A dificuldade permanece exclusiva de `guess-flag-game`; o domínio global de bandeiras e o jogo Bandeiras Giratórias não são alterados por essa classificação.

## Estado implementado

- A rota do quiz começa em `selecting-difficulty` e apresenta quatro cards em coluna com descrição, exemplos e multiplicador.
- Cada partida mantém dez rodadas e três alternativas quando o catálogo completo está disponível.
- O nível escolhido define a composição das respostas corretas e o multiplicador de toda a partida.
- HUD, feedback e resultado mostram o nível e o multiplicador.
- Jogar novamente cria novas rodadas no mesmo nível; Trocar dificuldade limpa a partida e retorna ao seletor; Voltar aos jogos retorna à seleção de jogos.
- O botão ou gesto de voltar durante a partida abandona o estado atual e retorna primeiro ao seletor.

As validações automatizadas, os bundles e o fluxo completo no emulador Android foram concluídos. A confirmação em aparelho físico continua pendente porque apenas `emulator-5554` estava conectado nesta sessão.

## Classificação editorial

O tipo público da feature é:

```ts
type GuessFlagDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
```

Todas as 262 bandeiras do catálogo foram atribuídas manualmente uma única vez:

| Nível        | Quantidade | Perfil                                               | Exemplos                      |
| ------------ | ---------: | ---------------------------------------------------- | ----------------------------- |
| Fácil        |         43 | Muito conhecidas no Brasil e no mundo                | Brasil, Estados Unidos, Japão |
| Médio        |         90 | Bandeiras frequentes em esportes, notícias e viagens | Camarões, Catar, Tailândia    |
| Difícil      |         70 | Países soberanos de menor exposição                  | Jordânia, Benin, Quirguistão  |
| Especialista |         59 | Prioriza territórios, dependências e ilhas raras     | Pitcairn, Tokelau, Clipperton |
| **Total**    |    **262** |                                                      |                               |

`FLAG_IDS_BY_DIFFICULTY` é a fonte revisável dessa curadoria. O validador compara a lista ao catálogo e informa IDs duplicados, desconhecidos ou não classificados. Em `__DEV__`, o módulo do hook executa uma asserção contra `FLAG_OPTIONS` ao ser carregado; não há API externa, população ou inferência dinâmica em runtime.

## Distribuição e geração

`DIFFICULTY_CONFIG` concentra labels, descrições, exemplos, multiplicadores e a composição base de dez rodadas:

| Nível escolhido | Fácil | Médio | Difícil | Especialista |
| --------------- | ----: | ----: | ------: | -----------: |
| Fácil           |    10 |     0 |       0 |            0 |
| Médio           |     3 |     7 |       0 |            0 |
| Difícil         |     1 |     3 |       6 |            0 |
| Especialista    |     1 |     1 |       3 |            5 |

O gerador agora recebe:

```ts
createGuessFlagGameQuestions(flags, {
  totalRounds,
  optionCount,
  difficulty,
  random,
});
```

Regras implementadas:

- respostas corretas não se repetem na partida;
- alternativas têm IDs e nomes únicos, incluem exatamente a correta e são embaralhadas;
- cada rodada conserva a `intrinsicDifficulty` da resposta;
- os dois distratores vêm sempre da mesma faixa intrínseca da resposta correta;
- se uma faixa não tiver itens suficientes para formar três alternativas, suas respostas são retiradas do pool elegível e a quota usa níveis inferiores já liberados;
- se nenhum fallback puder preservar as três opções únicas, a quantidade de rodadas é reduzida com segurança, sem emitir uma rodada inconsistente;
- `totalRounds` diferente de dez recebe uma distribuição proporcional inteira;
- RNG opcional preserva cenários determinísticos e Fisher–Yates não muta o catálogo recebido.

## Pontuação

A fórmula aplicada a cada acerto é:

```ts
Math.round((BASE_CORRECT_ANSWER_POINTS + streakBonus) * multiplier);
```

O bônus é 25 a partir do terceiro acerto consecutivo:

| Nível        | Multiplicador | Normal | Com bônus |
| ------------ | ------------: | -----: | --------: |
| Fácil        |            ×1 |    100 |       125 |
| Médio        |          ×1,2 |    120 |       150 |
| Difícil      |          ×1,6 |    160 |       200 |
| Especialista |            ×2 |    200 |       250 |

O multiplicador usado é o da dificuldade selecionada para a partida, inclusive quando uma rodada veio de uma faixa inferior da distribuição acumulada. Erros valem zero e reiniciam a sequência.

## Estado e navegação

O reducer passou a suportar `selecting-difficulty` e armazenar a dificuldade escolhida. O hook expõe `selectDifficulty`, `changeDifficulty`, `restartGame` e `difficulty`, além do estado e da rodada derivada.

```text
selecting-difficulty
  ↓ selectDifficulty
playing ↔ showing-feedback
  ↓ última rodada
finished
  ├── restartGame → playing no mesmo nível
  ├── changeDifficulty → selecting-difficulty
  └── Voltar aos jogos → Game Selection
```

`usePreventRemove` intercepta a saída nativa durante partida/resultado e chama `changeDifficulty`; uma segunda ação de voltar no seletor sai da rota. O fluxo não usa `push` nem cria cópias da tela.

## Decisões

- Manter a curadoria dentro da feature e não adicionar dificuldade ao tipo global `Flag`.
- Preferir listas explícitas de IDs a heurísticas automáticas, pois reconhecimento de bandeiras é cultural e subjetivo.
- Usar distribuição acumulada controlada para que níveis altos tenham predominância difícil sem eliminar totalmente bandeiras familiares.
- Aplicar o multiplicador do nível escolhido a toda a partida, tornando os quatro placares diretamente compreensíveis.
- Conservar a dificuldade intrínseca na rodada para gerar distratores coerentes e possibilitar análises futuras.
- Tratar catálogos reduzidos com fallback das respostas corretas para níveis inferiores, preservando a faixa intrínseca e três alternativas em toda rodada emitida.
- Não adicionar persistência, ranking, API, dependência ou alteração de rota nesta etapa.

## Arquivos novos

```text
src/features/guess-flag-game/
  components/GuessFlagDifficultySelector/
    GuessFlagDifficultySelector.tsx
    index.ts
  data/
    flag-difficulty.data.ts
  utils/
    validateFlagDifficultyClassification.ts

docs/handoffs/
  2026-08-01-guess-flag-difficulty.md
```

Arquivos existentes atualizados incluem constantes, tipos, gerador, regras de pontuação, reducer/hook, tela, HUD, feedback, resultado, `README.md` e `HANDOFF.md`.

## Validações

- [x] **Classificação:** 262 IDs; contagens 43/90/70/59; nenhuma duplicação, ausência ou ID desconhecido.
- [x] **Distribuições determinísticas:** 80 partidas, 20 seeds por nível, confirmaram as quatro matrizes exatas de dez rodadas.
- [x] **Rodadas:** dez corretas únicas, três alternativas únicas, correta presente e distratores sempre da mesma faixa intrínseca.
- [x] **Fallbacks:** catálogo vazio/reduzido, faixa incompleta, total/opções inválidos e dificuldade inválida retornaram estado seguro sem crash; as rodadas emitidas mantiveram três opções da mesma faixa.
- [x] **Pontuação:** 100/125, 120/150, 160/200, 200/250, multiplicador do nível selecionado e reset da sequência após erro.
- [x] **Reducer:** seleção inicial, resposta duplicada bloqueada, avanço, finalização, restart no mesmo nível, troca de nível e estado indisponível.
- [x] **TypeScript:** `npx tsc --noEmit --incremental false` passou.
- [x] **Lint:** `ESLINT_USE_FLAT_CONFIG=false npx eslint "src/**/*.{ts,tsx}" "scripts/*.mjs"` passou sem erros ou warnings de código; permaneceu apenas o aviso de depreciação do `.eslintrc` do ESLint 9.
- [x] **Dependências Expo:** `npx expo install --check` informou `Dependencies are up to date`.
- [x] **Expo Doctor:** `npx expo-doctor@latest` passou 18/18 verificações.
- [x] **Bundles Hermes:** `npx expo export --platform android` e `--platform ios` concluíram com sucesso, incluindo os 262 PNGs locais.
- [x] **Emulador Android:** Expo Go em `emulator-5554` validou os quatro cards, Fácil e Especialista no HUD, bandeiras sem `?`, acerto, erro, duas partidas completas, resultado, Jogar novamente, Trocar dificuldade, Voltar aos jogos e botão nativo Voltar.
- [ ] **Aparelho físico:** não havia aparelho físico conectado; ainda validar QR Code, layout, áudio e gestos em Android/iOS reais.

## Limitações

- A curadoria representa uma estimativa para o público brasileiro e precisará ser refinada com feedback real de jogadores.
- O quiz ainda não persiste pontuação por nível e não possui cronômetro ou ranking.
- Catálogos reduzidos podem produzir menos rodadas quando não há três bandeiras únicas em uma mesma faixa; uma rodada emitida nunca mistura distratores de níveis diferentes.
- A asserção completa da classificação roda somente em desenvolvimento; o gerador continua defensivo em produção.
- A experiência visual e o fluxo integral foram confirmados no emulador Android, mas ainda não em aparelho físico.

## Próximos passos

1. Percorrer pelo menos uma partida completa em aparelho físico Android e iOS via QR Code, conferindo layout, áudio, gesto/botão de voltar e leitores de tela.
2. Testar Medium e Difícil visualmente em aparelho real; a distribuição desses níveis já está coberta pelo harness determinístico.
3. Coletar feedback de jogadores brasileiros para mover IDs entre faixas quando houver evidência.
4. Se houver persistência futura, separar recordes por dificuldade e manter o storage fora da tela e do reducer puro.
