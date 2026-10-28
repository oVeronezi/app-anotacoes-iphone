import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { cores, fontes } from '@/theme';

// iPhone 11: 414×896 pt, notch com 48 pt de área segura no topo e 34 pt na base.
const LARGURA = 414;
const ALTURA = 896;
const BORDA = 10;
const INSETS_IPHONE_11 = { top: 48, bottom: 34, left: 0, right: 0 };

/**
 * No navegador do computador, mostra o app numa moldura do tamanho do iPhone 11
 * para pré-visualizar. No celular (ou em janela pequena) não muda nada.
 */
export function PhoneFrame({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  const ehComputador = Platform.OS === 'web' && width > 500 && height > 700;

  if (!ehComputador) return <>{children}</>;

  const alturaTotal = ALTURA + BORDA * 2 + 56; // moldura + legenda
  const escala = Math.min(1, height / alturaTotal);

  return (
    <View style={styles.fundo}>
      <View style={{ alignItems: 'center', transform: [{ scale: escala }] }}>
        <View style={styles.moldura}>
          <SafeAreaInsetsContext.Provider value={INSETS_IPHONE_11}>
            <View style={styles.tela}>{children}</View>
          </SafeAreaInsetsContext.Provider>
          <View style={styles.notch} pointerEvents="none" />
          <View style={styles.barraInicial} pointerEvents="none" />
        </View>
        <Text style={styles.legenda}>Pré-visualização · iPhone 11 (414×896)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#0E0C0D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moldura: {
    width: LARGURA + BORDA * 2,
    height: ALTURA + BORDA * 2,
    borderRadius: 56,
    borderWidth: BORDA,
    borderColor: '#000',
    backgroundColor: cores.fundo,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  tela: { flex: 1, overflow: 'hidden', borderRadius: 46 },
  notch: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 210,
    height: 30,
    backgroundColor: '#000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  barraInicial: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: cores.texto,
  },
  legenda: {
    marginTop: 16,
    fontFamily: fontes.medium,
    fontSize: 12,
    color: cores.textoSecundario,
    letterSpacing: 0.6,
  },
});
