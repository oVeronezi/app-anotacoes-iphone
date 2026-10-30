import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/Icone';
import { COR_SECAO } from '@/components/ItemRow';
import { falta, useFinance } from '@/store/useFinance';
import { cores, fontes, LARGURA_MAX, tipo } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';
import { formatBRL } from '@/utils/money';

function fechar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function Menu() {
  const insets = useSafeAreaInsets();
  const restante = useFinance((s) => s.contas.reduce((t, c) => t + Math.max(0, falta(c)), 0));
  const temContas = useFinance((s) => s.contas.length > 0);

  return (
    <View style={styles.tela}>
      <Pressable style={StyleSheet.absoluteFill} onPress={fechar} accessibilityLabel="Fechar menu" />
      {/* Logo abaixo do cabeçalho (4 de margem + 56 de altura), do lado do botão ⋯. */}
      <View style={[styles.coluna, { marginTop: areaSegura('top', insets.top, 60) }]}>
        <View style={styles.cartao}>
          <Pressable
            style={({ pressed }) => [styles.opcao, pressed && styles.opcaoPressionada]}
            onPress={() => router.replace('/contas')}
            accessibilityRole="button"
            accessibilityLabel="Abrir contas">
            <View style={[styles.icone, { backgroundColor: COR_SECAO.contas }]}>
              <Icone nome="contas" cor={cores.fundo} tamanho={16} />
            </View>
            <View style={styles.textos}>
              <Text style={styles.titulo}>Contas</Text>
              <Text style={styles.subtitulo}>
                {temContas ? `Falta ${formatBRL(restante)}` : 'Dívidas pagas aos poucos'}
              </Text>
            </View>
            <Icone nome="direita" cor={cores.textoSecundario} tamanho={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 9, 0.5)',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  coluna: { width: '100%', maxWidth: LARGURA_MAX, alignItems: 'flex-start' },
  cartao: {
    minWidth: 240,
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  opcaoPressionada: { backgroundColor: cores.fundo },
  icone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: 2 },
  titulo: { fontFamily: fontes.semibold, fontSize: 16, color: cores.texto },
  subtitulo: { ...tipo.item, fontSize: 13, color: cores.textoSecundario },
});
