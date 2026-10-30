import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icone } from '@/components/Icone';
import { useFinance } from '@/store/useFinance';
import { cores, tipo } from '@/theme';
import { nomeDoMes } from '@/utils/month';

export function MonthHeader() {
  const mesAtual = useFinance((s) => s.mesAtual);
  const irParaMes = useFinance((s) => s.irParaMes);

  return (
    <View style={styles.linha}>
      <Pressable
        onPress={() => router.push('/menu')}
        hitSlop={8}
        style={[styles.lateral, styles.menu]}
        accessibilityRole="button"
        accessibilityLabel="Menu">
        <Icone nome="menu" cor={cores.textoSecundario} tamanho={24} espessura={3.5} />
      </Pressable>
      <Pressable
        onPress={() => irParaMes(-1)}
        hitSlop={12}
        style={styles.seta}
        accessibilityLabel="Mês anterior">
        <Icone nome="esquerda" cor={cores.rosa} tamanho={24} espessura={2.5} />
      </Pressable>
      <Text style={styles.mes}>{nomeDoMes(mesAtual)}</Text>
      <Pressable
        onPress={() => irParaMes(1)}
        hitSlop={12}
        style={styles.seta}
        accessibilityLabel="Próximo mês">
        <Icone nome="direita" cor={cores.rosa} tamanho={24} espessura={2.5} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/info')}
        hitSlop={8}
        style={[styles.lateral, styles.info]}
        accessibilityRole="button"
        accessibilityLabel="Informações sobre seus dados">
        <Icone nome="info" cor={cores.textoSecundario} tamanho={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  seta: { padding: 4 },
  mes: { ...tipo.mes, minWidth: 190, textAlign: 'center' },
  lateral: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: { left: -4 },
  info: { right: -4 },
});
