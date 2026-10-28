# Planejamento — App de Finanças Mensais (PWA)

Oct 27, 2026 · @luis felipe veronezi

## Visão geral

Um app de controle financeiro mensal, de uso pessoal, feito em React Native com Expo e publicado como PWA. A pessoa instala no iPhone pelo Safari ("Adicionar à Tela de Início"), sem App Store, sem Mac e sem custo.

- **Usuário:** uma pessoa, um iPhone.
- **Desenvolvimento:** Windows + Android (testes no navegador e no Expo Go).
- **Custo:** R$ 0 (hospedagem grátis na Vercel ou Netlify).
- **Dados:** salvos no próprio aparelho, com backup por arquivo.

## Requisitos funcionais

Tudo é organizado por mês. Cada mês tem seu salário e seus gastos; a lista de Compras é única e aparece igual em todos os meses, e o topo da tela troca de mês com as setas ‹ ›.

### Resumo

| Campo | Como é calculado |
| --- | --- |
| Salário | Valor digitado para o mês (editável tocando nele) |
| Gastos | Soma de Fixos + Variáveis. **Compras não entram** |
| Saldo atual | Salário − Gastos, atualizado a cada item adicionado ou removido |

Saldo negativo aparece em rosa, com sinal de menos.

### Fixos

- Lista de gastos fixos com **título** e **valor** (ex.: Aluguel — R$ 1.200,00).
- Adicionar, editar e excluir itens.
- Mostra o total da seção.

### Variáveis

- Mesma estrutura dos Fixos: título + valor.
- Adicionar, editar e excluir itens.
- Mostra o total da seção.

### Compras

- Lista do que se pretende comprar: título + valor estimado.
- Caixinha para marcar como "comprado" (item fica riscado).
- Mostra o total planejado, **sem afetar Saldo nem Gastos**.

**A lista de Compras é a mesma em todos os meses.** Trocar de mês não apaga nem esconde nada: um item só sai da lista quando você o exclui. Itens marcados como comprados continuam lá, riscados, até serem excluídos.

### Geral

- Botão rosa "+" flutuante abre um formulário para escolher a seção (Fixo, Variável ou Compra), título e valor.
- Valores em reais, formato brasileiro (R$ 1.234,56).
- Funciona offline.

## Design

Segue o exemplo enviado: fundo escuro, destaque rosa, títulos de seção em destaque e listas separadas por linhas tracejadas.

### Paleta

Tema escuro com a paleta escolhida: **creme #F1EAE4** e **rosa #FF8EDD** são as cores principais; azul e verde aparecem só em detalhes.

| Uso | Cor |
| --- | --- |
| Fundo | #1A1719 (quase preto, levemente quente) |
| Superfície (cards, formulário) | #262124 |
| Texto principal, valores e títulos | #F1EAE4 (creme) |
| Texto secundário e linhas tracejadas | #F1EAE4 com 55% de opacidade |
| Destaque: botão +, setas do mês, caixinha "comprado" | #FF8EDD (rosa) |
| Ícone do botão + (sobre o rosa) | #1A1719 |
| Rótulo Gastos e saldo negativo | #FF8EDD (rosa) |
| Rótulo Salário e saldo positivo | #638C6A (verde) |
| Ícone Fixos | #006CC6 (azul) |
| Ícone Variáveis | #638C6A (verde) |
| Ícone Compras | #FF8EDD (rosa) |

### Tipografia

Uma fonte só em todo o app: **Inter** (Google Fonts), sem serifa e fácil de ler em tela pequena.

- **Títulos de seção** (Resumo, Fixos, Variáveis, Compras): Inter SemiBold, 22 px.
- **Itens e valores:** Inter Regular, 16 px; valores alinhados à direita com números de largura fixa (`tabular-nums`).
- **Valores do Resumo:** Inter SemiBold, 24 px.
- **Rótulos pequenos** (SALDO, SALÁRIO, GASTOS): Inter Medium, 12 px, maiúsculas.
- **Cabeçalho do mês:** Inter Medium, 15 px, maiúsculas com espaçamento (NOVEMBRO DE 2026).

### Layout da tela

1. Cabeçalho com ‹ mês › centralizado.
2. **Resumo** em três colunas (Saldo · Salário · Gastos) com rótulos sublinhados em cor, como no exemplo.
3. **Fixos**, **Variáveis** e **Compras** em sequência: ícone redondo colorido, título à esquerda, valor à direita, linha tracejada entre itens e total no fim.
4. Botão "+" rosa fixo no canto inferior direito.
5. Tocar num item abre edição; arrastar para o lado mostra "Excluir".

Uma tela só, rolando, sem barra de abas. O banner "premium" do exemplo fica de fora.

## Stack técnica

| Parte | Escolha | Por quê |
| --- | --- | --- |
| Base | Expo (versão atual) + TypeScript | Um código só, exporta para web |
| Navegação | Expo Router | Padrão do Expo; só 1 tela + 1 modal |
| Estado | Zustand com `persist` | Simples e salva sozinho |
| Armazenamento | AsyncStorage (vira localStorage na web) | Funciona offline no iPhone |
| Fontes | `@expo-google-fonts/inter` | Visual do exemplo |
| Lista com arrastar | `react-native-gesture-handler` | Deslizar para excluir |
| PWA | `manifest.json` + service worker (Workbox) | Instalável e offline |
| Hospedagem | Vercel (grátis, HTTPS) | Deploy pelo navegador |

### Estrutura de pastas

```
app/
  _layout.tsx        fontes, tema, PWA meta tags
  index.tsx          tela principal (Resumo + seções)
  item.tsx           modal adicionar/editar
components/
  MonthHeader.tsx    ‹ mês ›
  SummaryRow.tsx     Saldo · Salário · Gastos
  Section.tsx        título + lista + total
  ItemRow.tsx        ícone, título, valor, swipe
  Fab.tsx            botão +
store/
  useFinance.ts      dados, ações e cálculos
utils/
  money.ts           centavos <-> "R$ 1.234,56"
public/
  manifest.json, ícones 192/512, apple-touch-icon
```

## Modelo de dados e cálculos

Valores são guardados em **centavos (número inteiro)** para evitar erros de arredondamento; só viram "R$ 1.234,56" na hora de exibir.

```ts
type Item = {
  id: string;
  titulo: string;
  valor: number;        // centavos
};

type Compra = Item & {
  comprado: boolean;
};

type Mes = {
  salario: number;      // centavos
  fixos: Item[];
  variaveis: Item[];
};

type Dados = {
  meses: Record<string, Mes>;  // chave = "2026-11"
  compras: Compra[];           // fora dos meses: lista única
};
```

Cálculos de cada mês:

```latex
\text{Gastos} = \sum \text{Fixos} + \sum \text{Variáveis}
```

```latex
\text{Saldo} = \text{Salário} - \text{Gastos}
```

```latex
\text{Total de Compras} = \sum \text{Compras} \quad \text{(não entra no Saldo)}
```

**Mês novo:** ao abrir um mês vazio, o app oferece "Copiar salário e fixos do mês anterior", já que fixos se repetem. Compras não precisam ser copiadas: a lista fica fora dos meses e aparece em todos eles.

## Etapas de desenvolvimento

Sete etapas em sequência; cada uma termina com algo testável no navegador do Windows.

- [x] **1. Projeto base** — `npx create-expo-app`, TypeScript, Expo Router, fontes e cores do tema. Teste: tela escura com as cores e a fonte do tema.
- [x] **2. Dados** — store Zustand com persist, funções de cálculo e formatação em R$. Teste: valores sobrevivem a recarregar a página.
- [x] **3. Tela principal** — cabeçalho de mês, Resumo e as três seções lendo da store.
- [x] **4. Adicionar e editar** — botão +, modal com seção/título/valor, edição do salário, deslizar para excluir.
- [x] **5. Compras e mês novo** — caixinha "comprado", total planejado, copiar fixos do mês anterior.
- [x] **6. PWA** — manifest, ícones, meta tags do iOS, service worker, `npx expo export -p web`.
- [x] **7. Backup** — exportar e importar os dados em arquivo .json.

Tempo estimado para quem está começando: um a dois fins de semana. Comigo gerando o código, as etapas 1 a 6 saem de uma vez.

## Publicação e instalação no iPhone

O app vira um site com link próprio; o iPhone instala pelo Safari em menos de um minuto.

**Publicar (no Windows):**

1. Subir o projeto para um repositório no GitHub.
2. Criar conta grátis na Vercel e importar o repositório.
3. Comando de build: `npx expo export -p web`; pasta de saída: `dist`.
4. A Vercel gera um link (ex.: `minhas-financas.vercel.app`). Cada atualização no GitHub publica sozinha.

**Instalar (no iPhone):**

1. Abrir o link no **Safari** (precisa ser o Safari).
2. Tocar em Compartilhar → "Adicionar à Tela de Início".
3. O ícone aparece na tela e o app abre em tela cheia, funcionando offline.

## Riscos e decisões em aberto

### Riscos

| Risco | Como lidar |
| --- | --- |
| Dados ficam só naquele iPhone; trocar de aparelho ou apagar dados do Safari perde tudo | Botão de backup (.json) e lembrete mensal para exportar |
| Sem sincronização entre aparelhos | Se precisar no futuro, adicionar Supabase (grátis) com login |
| Instalar pelo Chrome no iPhone não funciona bem | Instruir a usar o Safari |

### Decisões para você confirmar

- [ ] Fixos devem ter um "pago / não pago", descontando do saldo só quando pagos? (Plano atual: desconta sempre.)
- [ ] Ao marcar uma compra como "comprado", ela deve virar um gasto Variável automaticamente? (Plano atual: não.)
- [ ] Além do salário, precisa registrar outras rendas (extra, freela)?
- [ ] Variáveis precisam de data ou categoria?
