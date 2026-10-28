import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icone } from '@/components/Icone';
import { mesVazio, useFinance } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { somarMeses } from '@/utils/month';

/** Aparece num mês vazio quando o mês anterior tem salário ou fixos. */
export function CopyMonthCard() {
  const mostrar = useFinance((s) => {
    const anterior = s.meses[somarMeses(s.mesAtual, -1)];
    return (
      mesVazio(s.meses[s.mesAtual]) &&
      !!anterior &&
      (anterior.salario > 0 || anterior.fixos.length > 0)
    );
  });
  const copiar = useFinance((s) => s.copiarDoMesAnterior);

  if (!mostrar) return null;

  return (
    <Pressable style={styles.cartao} onPress={copiar} accessibilityRole="button">
      <View style={styles.icone}>
        <Icone nome="copiar" cor={cores.fundo} tamanho={16} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.titulo}>Copiar salário e fixos do mês anterior</Text>
        <Text style={styles.sub}>Mês novo e vazio. Os gastos fixos costumam se repetir.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.rosa,
  },
  icone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.rosa,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, gap: 2 },
  titulo: { fontFamily: fontes.semibold, fontSize: 15, color: cores.texto },
  sub: { ...tipo.item, fontSize: 13, color: cores.textoSecundario },
});
