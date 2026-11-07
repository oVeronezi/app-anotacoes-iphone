import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContaRow } from '@/components/ContaRow';
import { Fab } from '@/components/Fab';
import { Icone } from '@/components/Icone';
import { ResumoColunas } from '@/components/ResumoColunas';
import { Tracejado } from '@/components/Section';
import { BarraSelecao, TituloSelecionavel, useSelecao } from '@/components/Selecao';
import { soma, totalPago, useFinance } from '@/store/useFinance';
import { cores, LARGURA_MAX, tipo } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function Contas() {
  const insets = useSafeAreaInsets();
  const contas = useFinance((s) => s.contas);
  const selecao = useSelecao(
    'contas',
    contas.map((c) => c.id),
  );

  const total = soma(contas);
  const pago = contas.reduce((t, c) => t + totalPago(c), 0);
  const falta = total - pago;

  return (
    <View style={styles.tela}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.conteudo,
          {
            paddingTop: areaSegura('top', insets.top, 4),
            paddingBottom: areaSegura('bottom', insets.bottom, 110),
          },
        ]}>
        <View style={styles.coluna}>
          <View style={styles.cabecalho}>
            <Pressable
              onPress={voltar}
              hitSlop={12}
              style={styles.voltar}
              accessibilityRole="button"
              accessibilityLabel="Voltar">
              <Icone nome="esquerda" cor={cores.rosa} tamanho={24} espessura={2.5} />
            </Pressable>
            <Text style={tipo.mes}>Contas</Text>
          </View>

          <ResumoColunas
            colunas={[
              { rotulo: 'Total', cor: cores.amarelo, valor: total },
              { rotulo: 'Pago', cor: cores.verde, valor: pago },
              {
                rotulo: 'Falta',
                cor: cores.rosa,
                valor: falta,
                corValor: falta < 0 ? cores.rosa : cores.texto,
              },
            ]}
          />

          <View>
            <TituloSelecionavel titulo="Contas" selecao={selecao} />
            {contas.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhuma conta cadastrada. Toque em + para adicionar uma.
              </Text>
            ) : (
              contas.map((conta, i) => (
                <Fragment key={conta.id}>
                  {i > 0 && <Tracejado />}
                  <ContaRow
                    conta={conta}
                    selecionando={selecao.ativo}
                    selecionado={selecao.estaSelecionado(conta.id)}
                    onAlternar={() => selecao.alternar(conta.id)}
                  />
                </Fragment>
              ))
            )}
            <BarraSelecao selecao={selecao} />
          </View>
        </View>
      </ScrollView>
      <Fab params={{ secao: 'contas' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: 16, alignItems: 'center' },
  coluna: { width: '100%', maxWidth: LARGURA_MAX, gap: 32 },
  // Mesma altura do MonthHeader.
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    minHeight: 56,
  },
  voltar: { position: 'absolute', left: -4, padding: 4 },
  vazio: { ...tipo.item, color: cores.textoSecundario, paddingVertical: 14 },
});
