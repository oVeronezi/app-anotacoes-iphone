import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes, tipo } from '@/theme';
import { partesBRL } from '@/utils/money';

const GAP = 12;
const TAMANHO_PREFIXO = 13;

export type Coluna = {
  rotulo: string;
  cor: string; // cor do rótulo e do sublinhado
  valor: number; // centavos
  corValor?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Bloco "Resumo" com três colunas de valores lado a lado. */
export function ResumoColunas({ colunas }: { colunas: Coluna[] }) {
  const [largura, setLargura] = useState(0);
  const partes = colunas.map((c) => partesBRL(c.valor));

  // O número fica em 24 px quando cabe; se algum valor for longo, as colunas
  // diminuem juntas. O "R$" é menor e fica fora da conta (≈ 0,62 em por caractere).
  const larguraColuna = (largura - GAP * (colunas.length - 1)) / colunas.length;
  const maiorPrefixo = Math.max(...partes.map((p) => p.prefixo.length));
  const maiorNumero = Math.max(...partes.map((p) => p.numero.length));
  const disponivel = larguraColuna - maiorPrefixo * TAMANHO_PREFIXO * 0.62;
  const tamanho = largura ? Math.min(24, Math.floor(disponivel / (maiorNumero * 0.62))) : 24;

  return (
    <View style={styles.bloco}>
      <Text style={tipo.tituloSecao}>Resumo</Text>
      <View style={styles.linha} onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
        {colunas.map((c, i) => {
          const conteudo = (
            <>
              <Text style={[styles.rotulo, { color: c.cor, borderBottomColor: c.cor }]}>
                {c.rotulo}
              </Text>
              <Text
                style={[styles.valor, { color: c.corValor ?? cores.texto, fontSize: tamanho }]}
                numberOfLines={1}>
                <Text style={styles.prefixo}>{partes[i].prefixo}</Text>
                {partes[i].numero}
              </Text>
            </>
          );
          return c.onPress ? (
            <Pressable
              key={c.rotulo}
              style={styles.coluna}
              onPress={c.onPress}
              accessibilityLabel={c.accessibilityLabel}>
              {conteudo}
            </Pressable>
          ) : (
            <View key={c.rotulo} style={styles.coluna}>
              {conteudo}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: 16 },
  linha: { flexDirection: 'row', gap: GAP },
  coluna: { flex: 1, gap: 8, alignItems: 'flex-start' },
  rotulo: {
    ...tipo.rotulo,
    borderBottomWidth: 2,
    paddingBottom: 3,
  },
  valor: { ...tipo.valorResumo },
  prefixo: { fontFamily: fontes.medium, fontSize: TAMANHO_PREFIXO },
});
