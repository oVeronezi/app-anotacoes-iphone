import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icone } from '@/components/Icone';
import { useFinance, type Compra, type Item, type Secao } from '@/store/useFinance';
import { cores, tipo } from '@/theme';
import { formatBRL } from '@/utils/money';

export const COR_SECAO: Record<Secao, string> = {
  fixos: cores.azul,
  variaveis: cores.verde,
  compras: cores.rosa,
  contas: cores.amarelo,
};

type Props = {
  secao: Secao;
  item: Item | Compra;
  /** Modo de seleção: tocar marca/desmarca em vez de abrir o item. */
  selecionando?: boolean;
  selecionado?: boolean;
  onAlternar?: () => void;
};

export function ItemRow({ secao, item, selecionando = false, selecionado = false, onAlternar }: Props) {
  const alternarComprado = useFinance((s) => s.alternarComprado);
  const comprado = secao === 'compras' && (item as Compra).comprado;

  const abrir = () =>
    router.push({ pathname: '/item', params: { secao, id: item.id } });

  if (selecionando) {
    return (
      <Pressable
        onPress={onAlternar}
        style={styles.linha}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selecionado }}
        accessibilityLabel={`Selecionar ${item.titulo}`}>
        <View style={[styles.caixa, selecionado && styles.caixaMarcada]}>
          {selecionado && <Icone nome="check" cor={cores.fundo} tamanho={16} espessura={3} />}
        </View>
        <Text style={[styles.titulo, comprado && styles.riscado]} numberOfLines={2}>
          {item.titulo}
        </Text>
        <Text style={[tipo.valor, comprado && styles.riscado]}>{formatBRL(item.valor)}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={abrir} style={styles.linha} accessibilityLabel={`Editar ${item.titulo}`}>
      {secao === 'compras' ? (
        <Pressable
          onPress={() => alternarComprado(item.id)}
          hitSlop={8}
          style={[styles.caixa, comprado && styles.caixaMarcada]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: comprado }}
          accessibilityLabel={`Marcar ${item.titulo} como comprado`}>
          {comprado && <Icone nome="check" cor={cores.fundo} tamanho={16} espessura={3} />}
        </Pressable>
      ) : (
        <View style={[styles.icone, { backgroundColor: COR_SECAO[secao] }]}>
          <Icone nome={secao} cor={cores.fundo} tamanho={16} />
        </View>
      )}
      <Text style={[styles.titulo, comprado && styles.riscado]} numberOfLines={2}>
        {item.titulo}
      </Text>
      <Text style={[tipo.valor, comprado && styles.riscado]}>{formatBRL(item.valor)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    backgroundColor: cores.fundo,
  },
  icone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixa: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: cores.rosa,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaMarcada: { backgroundColor: cores.rosa },
  titulo: { ...tipo.item, flex: 1 },
  riscado: {
    textDecorationLine: 'line-through',
    color: cores.textoSecundario,
  },
});
