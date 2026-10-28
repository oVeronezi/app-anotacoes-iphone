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

export type Mes = {
  salario: number; // centavos
  fixos: Item[];
  variaveis: Item[];
};

export type Dados = {
  meses: Record<string, Mes>; // chave = "2026-11"
  compras: Compra[]; // fora dos meses: lista única
};

export type Secao = 'fixos' | 'variaveis' | 'compras';

type ItemEditado = { titulo: string; valor: number };

type Estado = Dados & {
  mesAtual: string;
  ultimoBackup: string | null; // ISO
  irParaMes: (delta: number) => void;
  setSalario: (centavos: number) => void;
  salvarItem: (secao: Secao, dados: ItemEditado, origem?: { secao: Secao; id: string }) => void;
  removerItem: (secao: Secao, id: string) => void;
  alternarComprado: (id: string) => void;
  copiarDoMesAnterior: () => void;
  importar: (dados: Dados) => void;
  marcarBackup: () => void;
};

export const MES_VAZIO: Mes = { salario: 0, fixos: [], variaveis: [] };

const novoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const soma = (itens: Item[]) => itens.reduce((total, item) => total + item.valor, 0);

export const mesVazio = (mes: Mes | undefined) =>
  !mes || (mes.salario === 0 && mes.fixos.length === 0 && mes.variaveis.length === 0);

// Na exportação estática (Node) não existe localStorage.
const semArmazenamento: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useFinance = create<Estado>()(
  persist(
    (set, get) => {
      const alterarMes = (alterar: (mes: Mes) => Mes) =>
        set((s) => ({
          meses: { ...s.meses, [s.mesAtual]: alterar(s.meses[s.mesAtual] ?? MES_VAZIO) },
        }));

      const tirarItem = (secao: Secao, id: string) => {
        if (secao === 'compras') {
          set((s) => ({ compras: s.compras.filter((c) => c.id !== id) }));
        } else {
          alterarMes((mes) => ({ ...mes, [secao]: mes[secao].filter((i) => i.id !== id) }));
        }
      };

      return {
        meses: {},
        compras: [],
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
          } else {
            alterarMes((mes) => ({ ...mes, [secao]: [...mes[secao], { id, ...dados }] }));
          }
        },

        removerItem: tirarItem,

        alternarComprado: (id) =>
          set((s) => ({
            compras: s.compras.map((c) => (c.id === id ? { ...c, comprado: !c.comprado } : c)),
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

        importar: (dados) => set({ meses: dados.meses, compras: dados.compras }),

        marcarBackup: () => set({ ultimoBackup: new Date().toISOString() }),
      };
    },
    {
      name: 'financas',
      version: 1,
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? semArmazenamento : AsyncStorage,
      ),
      partialize: (s) => ({ meses: s.meses, compras: s.compras, ultimoBackup: s.ultimoBackup }),
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

/** Confere se um objeto lido de um arquivo de backup tem o formato de Dados. */
export function validarDados(valor: unknown): valor is Dados {
  if (!valor || typeof valor !== 'object') return false;
  const { meses, compras } = valor as Partial<Dados>;
  const itemOk = (i: unknown) =>
    !!i &&
    typeof (i as Item).id === 'string' &&
    typeof (i as Item).titulo === 'string' &&
    Number.isInteger((i as Item).valor);
  if (!meses || typeof meses !== 'object' || !Array.isArray(compras)) return false;
  return (
    compras.every((c) => itemOk(c) && typeof c.comprado === 'boolean') &&
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
