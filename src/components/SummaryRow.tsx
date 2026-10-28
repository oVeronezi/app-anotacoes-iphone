import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { soma, useMes } from '@/store/useFinance';
import { cores, tipo } from '@/theme';
import { formatBRL } from '@/utils/money';

const GAP = 12;

export function SummaryRow() {
  const mes = useMes();
  const [largura, setLargura] = useState(0);

  const gastos = soma(mes.fixos) + soma(mes.variaveis);
  const saldo = mes.salario - gastos;

  const colunas = [
    {
      rotulo: 'Saldo',
      cor: saldo < 0 ? cores.rosa : cores.verde,
      texto: formatBRL(saldo),
      corValor: saldo < 0 ? cores.rosa : cores.texto,
    },
    { rotulo: 'Salário', cor: cores.verde, texto: formatBRL(mes.salario), corValor: cores.texto },
    { rotulo: 'Gastos', cor: cores.rosa, texto: formatBRL(gastos), corValor: cores.texto },
  ];

  // 24 px quando cabe; diminui junto para as três colunas quando algum valor é longo.
  const larguraColuna = (largura - GAP * 2) / 3;
  const maiorTexto = Math.max(...colunas.map((c) => c.texto.length));
  const tamanho = largura ? Math.min(24, Math.floor(larguraColuna / (maiorTexto * 0.6))) : 24;

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
                {c.texto}
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
});
