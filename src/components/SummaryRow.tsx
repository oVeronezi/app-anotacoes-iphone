import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soma, useMes } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { partesBRL } from '@/utils/money';

const GAP = 12;
const TAMANHO_PREFIXO = 13;

export function SummaryRow() {
  const mes = useMes();
  const [largura, setLargura] = useState(0);

  const gastos = soma(mes.fixos) + soma(mes.variaveis);
  const saldo = mes.salario - gastos;

  const colunas = [
    {
      rotulo: 'Saldo',
      cor: saldo < 0 ? cores.rosa : cores.verde,
      ...partesBRL(saldo),
      corValor: saldo < 0 ? cores.rosa : cores.texto,
    },
    { rotulo: 'Salário', cor: cores.verde, ...partesBRL(mes.salario), corValor: cores.texto },
    { rotulo: 'Gastos', cor: cores.rosa, ...partesBRL(gastos), corValor: cores.texto },
  ];

  // O número fica em 24 px quando cabe; se algum valor for longo, as três colunas
  // diminuem juntas. O "R$" é menor e fica fora da conta (≈ 0,62 em por caractere).
  const larguraColuna = (largura - GAP * 2) / 3;
  const maiorPrefixo = Math.max(...colunas.map((c) => c.prefixo.length));
  const maiorNumero = Math.max(...colunas.map((c) => c.numero.length));
  const disponivel = larguraColuna - maiorPrefixo * TAMANHO_PREFIXO * 0.62;
  const tamanho = largura ? Math.min(24, Math.floor(disponivel / (maiorNumero * 0.62))) : 24;

  return (
    <View style={styles.bloco}>
      <Text style={tipo.tituloSecao}>Resumo</Text>
      <View style={styles.linha} onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
        {colunas.map((c) => {
          const conteudo = (
            <>
              <Text style={[styles.rotulo, { color: c.cor, borderBottomColor: c.cor }]}>
                {c.rotulo}
              </Text>
              <Text
                style={[styles.valor, { color: c.corValor, fontSize: tamanho }]}
                numberOfLines={1}>
                <Text style={styles.prefixo}>{c.prefixo}</Text>
                {c.numero}
              </Text>
            </>
          );
          return c.rotulo === 'Salário' ? (
            <Pressable
              key={c.rotulo}
              style={styles.coluna}
              onPress={() => router.push({ pathname: '/item', params: { secao: 'salario' } })}
              accessibilityLabel="Editar salário">
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
