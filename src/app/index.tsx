import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackupBar } from '@/components/BackupBar';
import { CopyMonthCard } from '@/components/CopyMonthCard';
import { Fab } from '@/components/Fab';
import { MonthHeader } from '@/components/MonthHeader';
import { Section } from '@/components/Section';
import { SummaryRow } from '@/components/SummaryRow';
import { useFinance, useMes } from '@/store/useFinance';
import { cores, LARGURA_MAX } from '@/theme';

export default function Inicio() {
  const insets = useSafeAreaInsets();
  const mes = useMes();
  const compras = useFinance((s) => s.compras);

  return (
    <View style={styles.tela}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.conteudo,
          { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 110 },
        ]}>
        <View style={styles.coluna}>
          <MonthHeader />
          <SummaryRow />
          <CopyMonthCard />
          <Section secao="fixos" itens={mes.fixos} />
          <Section secao="variaveis" itens={mes.variaveis} />
          <Section secao="compras" itens={compras} rotuloTotal="Total planejado" />
          <BackupBar />
        </View>
      </ScrollView>
      <Fab />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: 16, alignItems: 'center' },
  coluna: { width: '100%', maxWidth: LARGURA_MAX, gap: 32 },
});
