import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { chaveDoMes, somarMeses } from '@/utils/month';

export type Item = {
  id: string;
  titulo: string;
  valor: number; // centavos
};

export type Compra = Item & {
  comprado: boolean;
};

export type Pagamento = {
  id: string;
  valor: number; // centavos
  data: string; // "2026-10-30"
};

export type Conta = Item & {
  pagamentos: Pagamento[];
};

export type Mes = {
  salario: number; // centavos
  fixos: Item[];
  variaveis: Item[];
};

export type Dados = {
  meses: Record<string, Mes>; // chave = "2026-11"
  compras: Compra[]; // fora dos meses: lista única
  contas: Conta[]; // fora dos meses: dívidas pagas aos poucos
};

export type Secao = 'fixos' | 'variaveis' | 'compras' | 'contas';

type ItemEditado = { titulo: string; valor: number };

type Estado = Dados & {
  mesAtual: string;
  ultimoBackup: string | null; // ISO
  irParaMes: (delta: number) => void;
  setSalario: (centavos: number) => void;
  salvarItem: (secao: Secao, dados: ItemEditado, origem?: { secao: Secao; id: string }) => void;
  removerItem: (secao: Secao, id: string) => void;
  alternarComprado: (id: string) => void;
  salvarPagamento: (contaId: string, valor: number, id?: string) => void;
  removerPagamento: (contaId: string, id: string) => void;
  copiarDoMesAnterior: () => void;
  importar: (dados: Dados) => void;
  marcarBackup: () => void;
};

export const MES_VAZIO: Mes = { salario: 0, fixos: [], variaveis: [] };

const novoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const soma = (itens: Item[]) => itens.reduce((total, item) => total + item.valor, 0);

export const totalPago = (conta: Conta) =>
  conta.pagamentos.reduce((total, p) => total + p.valor, 0);

/** Quanto ainda falta pagar (pode ser negativo se pagou a mais). */
export const falta = (conta: Conta) => conta.valor - totalPago(conta);

/** Data local de hoje no formato "2026-10-30". */
const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const mesVazio = (mes: Mes | undefined) =>
  !mes || (mes.salario === 0 && mes.fixos.length === 0 && mes.variaveis.length === 0);

// Na exportação estática (Node) não existe localStorage.
const semArmazenamento: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// Se o navegador bloquear o armazenamento, o persist nunca termina de carregar e a tela
// fica vazia; aqui o erro vira "sem dados salvos" e o app abre mesmo assim.
const armazenamentoSeguro: StateStorage = {
  getItem: (nome) => AsyncStorage.getItem(nome).catch(() => null),
  setItem: (nome, valor) => AsyncStorage.setItem(nome, valor).catch(() => {}),
  removeItem: (nome) => AsyncStorage.removeItem(nome).catch(() => {}),
};

export const useFinance = create<Estado>()(
  persist(
    (set, get) => {
      const alterarMes = (alterar: (mes: Mes) => Mes) =>
        set((s) => ({
          meses: { ...s.meses, [s.mesAtual]: alterar(s.meses[s.mesAtual] ?? MES_VAZIO) },
        }));

      const alterarConta = (id: string, alterar: (conta: Conta) => Conta) =>
        set((s) => ({ contas: s.contas.map((c) => (c.id === id ? alterar(c) : c)) }));

      const tirarItem = (secao: Secao, id: string) => {
        if (secao === 'compras') {
          set((s) => ({ compras: s.compras.filter((c) => c.id !== id) }));
        } else if (secao === 'contas') {
          set((s) => ({ contas: s.contas.filter((c) => c.id !== id) }));
        } else {
          alterarMes((mes) => ({ ...mes, [secao]: mes[secao].filter((i) => i.id !== id) }));
        }
      };

      return {
        meses: {},
        compras: [],
        contas: [],
        mesAtual: chaveDoMes(),
        ultimoBackup: null,

        irParaMes: (delta) => set((s) => ({ mesAtual: somarMeses(s.mesAtual, delta) })),

        setSalario: (centavos) => alterarMes((mes) => ({ ...mes, salario: centavos })),

        salvarItem: (secao, dados, origem) => {
          // Editando sem trocar de seção: atualiza no lugar.
          if (origem && origem.secao === secao) {
            if (secao === 'compras') {
              set((s) => ({
                compras: s.compras.map((c) => (c.id === origem.id ? { ...c, ...dados } : c)),
              }));
            } else if (secao === 'contas') {
              alterarConta(origem.id, (c) => ({ ...c, ...dados }));
            } else {
              alterarMes((mes) => ({
                ...mes,
                [secao]: mes[secao].map((i) => (i.id === origem.id ? { ...i, ...dados } : i)),
              }));
            }
            return;
          }
          if (origem) tirarItem(origem.secao, origem.id);
          const id = origem?.id ?? novoId();
          if (secao === 'compras') {
            set((s) => ({ compras: [...s.compras, { id, ...dados, comprado: false }] }));
          } else if (secao === 'contas') {
            set((s) => ({ contas: [...s.contas, { id, ...dados, pagamentos: [] }] }));
          } else {
            alterarMes((mes) => ({ ...mes, [secao]: [...mes[secao], { id, ...dados }] }));
          }
        },

        removerItem: tirarItem,

        alternarComprado: (id) =>
          set((s) => ({
            compras: s.compras.map((c) => (c.id === id ? { ...c, comprado: !c.comprado } : c)),
          })),

        salvarPagamento: (contaId, valor, id) =>
          alterarConta(contaId, (c) => ({
            ...c,
            pagamentos: id
              ? c.pagamentos.map((p) => (p.id === id ? { ...p, valor } : p))
              : [...c.pagamentos, { id: novoId(), valor, data: hoje() }],
          })),

        removerPagamento: (contaId, id) =>
          alterarConta(contaId, (c) => ({
            ...c,
            pagamentos: c.pagamentos.filter((p) => p.id !== id),
          })),

        copiarDoMesAnterior: () => {
          const { meses, mesAtual } = get();
          const anterior = meses[somarMeses(mesAtual, -1)];
          if (!anterior) return;
          alterarMes((mes) => ({
            ...mes,
            salario: anterior.salario,
            fixos: [...mes.fixos, ...anterior.fixos.map((f) => ({ ...f, id: novoId() }))],
          }));
        },

        importar: (dados) => set({ meses: dados.meses, compras: dados.compras, contas: dados.contas }),

        marcarBackup: () => set({ ultimoBackup: new Date().toISOString() }),
      };
    },
    {
      name: 'financas',
      version: 2,
      // v1 não tinha contas.
      migrate: (salvo, versao) => {
        const estado = salvo as Partial<Dados>;
        return versao < 2 ? { ...estado, contas: [] } : estado;
      },
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? semArmazenamento : armazenamentoSeguro,
      ),
      partialize: (s) => ({
        meses: s.meses,
        compras: s.compras,
        contas: s.contas,
        ultimoBackup: s.ultimoBackup,
      }),
    },
  ),
);

export function useMes(): Mes {
  return useFinance((s) => s.meses[s.mesAtual] ?? MES_VAZIO);
}

/** true depois que os dados salvos no aparelho foram carregados. */
export function useCarregado(): boolean {
  return useSyncExternalStore(
    useFinance.persist.onFinishHydration,
    useFinance.persist.hasHydrated,
    () => false,
  );
}

/**
 * Confere se um objeto lido de um arquivo de backup tem o formato de Dados.
 * Backups antigos não têm `contas`; quem chama usa [] nesse caso.
 */
export function validarDados(
  valor: unknown,
): valor is Omit<Dados, 'contas'> & { contas?: Conta[] } {
  if (!valor || typeof valor !== 'object') return false;
  const { meses, compras, contas = [] } = valor as Partial<Dados>;
  const itemOk = (i: unknown) =>
    !!i &&
    typeof (i as Item).id === 'string' &&
    typeof (i as Item).titulo === 'string' &&
    Number.isInteger((i as Item).valor);
  const pagamentoOk = (p: unknown) =>
    !!p &&
    typeof (p as Pagamento).id === 'string' &&
    typeof (p as Pagamento).data === 'string' &&
    Number.isInteger((p as Pagamento).valor);
  if (!meses || typeof meses !== 'object' || !Array.isArray(compras) || !Array.isArray(contas)) {
    return false;
  }
  return (
    compras.every((c) => itemOk(c) && typeof c.comprado === 'boolean') &&
    contas.every((c) => itemOk(c) && Array.isArray(c.pagamentos) && c.pagamentos.every(pagamentoOk)) &&
    Object.values(meses).every(
      (m) =>
        !!m &&
        Number.isInteger(m.salario) &&
        Array.isArray(m.fixos) &&
        Array.isArray(m.variaveis) &&
        m.fixos.every(itemOk) &&
        m.variaveis.every(itemOk),
    )
  );
}
