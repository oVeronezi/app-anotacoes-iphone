import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFinance, type Secao } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { confirmar } from '@/utils/backup';

export type Selecao = ReturnType<typeof useSelecao>;

/** Modo de seleção de uma lista: marca vários itens e exclui de uma vez. */
export function useSelecao(secao: Secao, ids: string[]) {
  const removerItens = useFinance((s) => s.removerItens);
  const [ativo, setAtivo] = useState(false);
  const [marcados, setMarcados] = useState<Set<string>>(() => new Set());

  // Lista esvaziou (ex.: trocou de mês): sai do modo de seleção.
  if (ativo && ids.length === 0) {
    setAtivo(false);
    setMarcados(new Set());
  }

  // Só conta o que ainda está na lista.
  const selecionados = ids.filter((id) => marcados.has(id));
  const todos = ids.length > 0 && selecionados.length === ids.length;

  const cancelar = () => {
    setAtivo(false);
    setMarcados(new Set());
  };

  return {
    ativo,
    selecionados,
    todos,
    total: ids.length,
    estaSelecionado: (id: string) => marcados.has(id),
    alternarModo: () => (ativo ? cancelar() : setAtivo(true)),
    alternar: (id: string) =>
      setMarcados((atual) => {
        const novo = new Set(atual);
        if (novo.has(id)) novo.delete(id);
        else novo.add(id);
        return novo;
      }),
    alternarTodos: () => setMarcados(todos ? new Set() : new Set(ids)),
    excluir: async () => {
      const n = selecionados.length;
      if (n === 0) return;
      const ok = await confirmar(
        `Excluir ${n} ${n === 1 ? 'item' : 'itens'}?`,
        'Essa ação não pode ser desfeita.',
      );
      if (!ok) return;
      removerItens(secao, selecionados);
      cancelar();
    },
  };
}

/** Título da seção com o botão "Selecionar" / "Cancelar" à direita. */
export function TituloSelecionavel({ titulo, selecao }: { titulo: string; selecao: Selecao }) {
  return (
    <View style={styles.titulo}>
      <Text style={tipo.tituloSecao}>{titulo}</Text>
      {selecao.total > 0 && (
        <Pressable
          onPress={selecao.alternarModo}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={selecao.ativo ? `Cancelar seleção em ${titulo}` : `Selecionar itens em ${titulo}`}>
          <Text style={styles.link}>{selecao.ativo ? 'Cancelar' : 'Selecionar'}</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Barra exibida durante a seleção: marcar todos e excluir os marcados. */
export function BarraSelecao({ selecao }: { selecao: Selecao }) {
  if (!selecao.ativo) return null;
  const n = selecao.selecionados.length;
  return (
    <View style={styles.barra}>
      <Pressable onPress={selecao.alternarTodos} hitSlop={8} accessibilityRole="button">
        <Text style={styles.link}>{selecao.todos ? 'Desmarcar todos' : 'Selecionar todos'}</Text>
      </Pressable>
      <Pressable
        onPress={selecao.excluir}
        disabled={n === 0}
        style={({ pressed }) => [
          styles.excluir,
          n === 0 && styles.desabilitado,
          pressed && { opacity: 0.8 },
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: n === 0 }}
        accessibilityLabel={`Excluir ${n} selecionados`}>
        <Text style={styles.excluirTexto}>Excluir ({n})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  link: { fontFamily: fontes.medium, fontSize: 15, color: cores.rosa },
  barra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  excluir: {
    backgroundColor: cores.rosa,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  desabilitado: { opacity: 0.4 },
  excluirTexto: { fontFamily: fontes.semibold, fontSize: 15, color: cores.fundo },
});
