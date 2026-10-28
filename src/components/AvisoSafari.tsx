import { router } from 'expo-router';
import { useSyncExternalStore } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { cores, fontes, tipo } from '@/theme';

const nada = () => () => {};

/** true só no Safari do iPhone com o site aberto numa aba (não instalado na Tela de Início). */
function abertoNoSafari() {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;
  // `standalone` só existe no Safari do iOS: false = aba do Safari, true = app instalado.
  return (navigator as Navigator & { standalone?: boolean }).standalone === false;
}

export function AvisoSafari() {
  const mostrar = useSyncExternalStore(nada, abertoNoSafari, () => false);
  if (!mostrar) return null;

  return (
    <Pressable style={styles.cartao} onPress={() => router.push('/info')} accessibilityRole="button">
      <Text style={styles.titulo}>Você está no Safari</Text>
      <Text style={styles.texto}>
        Instale pela Tela de Início (Compartilhar → Adicionar à Tela de Início). Os dados daqui e do
        app instalado são separados, e o Safari pode apagá-los se o site ficar uns 7 dias sem uso.
      </Text>
      <Text style={styles.link}>Saiba mais</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.rosa,
  },
  titulo: { fontFamily: fontes.semibold, fontSize: 15, color: cores.rosa },
  texto: { ...tipo.item, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: fontes.semibold, fontSize: 14, color: cores.rosa },
});
