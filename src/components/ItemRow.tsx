import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Icone } from '@/components/Icone';
import { useFinance, type Compra, type Item, type Secao } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { formatBRL } from '@/utils/money';

export const COR_SECAO: Record<Secao, string> = {
  fixos: cores.azul,
  variaveis: cores.verde,
  compras: cores.rosa,
};

type Props = { secao: Secao; item: Item | Compra };

export function ItemRow({ secao, item }: Props) {
  const removerItem = useFinance((s) => s.removerItem);
  const alternarComprado = useFinance((s) => s.alternarComprado);
  const swipe = useRef<SwipeableMethods>(null);
  const comprado = secao === 'compras' && (item as Compra).comprado;

  const abrir = () =>
    router.push({ pathname: '/item', params: { secao, id: item.id } });

  return (
    <Swipeable
      ref={swipe}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          style={styles.excluir}
          onPress={() => {
            swipe.current?.close();
            removerItem(secao, item.id);
          }}
          accessibilityLabel={`Excluir ${item.titulo}`}>
          <Text style={styles.excluirTexto}>Excluir</Text>
        </Pressable>
      )}>
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
    </Swipeable>
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
  excluir: {
    backgroundColor: cores.rosa,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    marginLeft: 8,
  },
  excluirTexto: { fontFamily: fontes.semibold, fontSize: 15, color: cores.fundo },
});
