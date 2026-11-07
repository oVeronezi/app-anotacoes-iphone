import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ItemRow } from '@/components/ItemRow';
import { BarraSelecao, TituloSelecionavel, useSelecao } from '@/components/Selecao';
import { soma, type Item, type Secao } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { formatBRL } from '@/utils/money';

const TITULOS: Record<Secao, string> = {
  fixos: 'Fixos',
  variaveis: 'Variáveis',
  compras: 'Compras',
  contas: 'Contas',
};

const VAZIO: Record<Secao, string> = {
  fixos: 'Nenhum gasto fixo neste mês.',
  variaveis: 'Nenhum gasto variável neste mês.',
  compras: 'Nada na lista de compras.',
  contas: 'Nenhuma conta cadastrada.',
};

export function Tracejado() {
  return <View style={styles.tracejado} />;
}

type Props = { secao: Secao; itens: Item[]; rotuloTotal?: string };

export function Section({ secao, itens, rotuloTotal = 'Total' }: Props) {
  const selecao = useSelecao(
    secao,
    itens.map((i) => i.id),
  );

  return (
    <View>
      <TituloSelecionavel titulo={TITULOS[secao]} selecao={selecao} />
      {itens.length === 0 ? (
        <Text style={styles.vazio}>{VAZIO[secao]}</Text>
      ) : (
        itens.map((item, i) => (
          <Fragment key={item.id}>
            {i > 0 && <Tracejado />}
            <ItemRow
              secao={secao}
              item={item}
              selecionando={selecao.ativo}
              selecionado={selecao.estaSelecionado(item.id)}
              onAlternar={() => selecao.alternar(item.id)}
            />
          </Fragment>
        ))
      )}
      <BarraSelecao selecao={selecao} />
      <View style={styles.totalLinha}>
        <Text style={styles.totalRotulo}>{rotuloTotal}</Text>
        <Text style={styles.totalValor}>{formatBRL(soma(itens))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tracejado: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: cores.textoSecundario,
  },
  vazio: {
    ...tipo.item,
    color: cores.textoSecundario,
    paddingVertical: 14,
  },
  totalLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: cores.textoSecundario,
    paddingTop: 12,
    marginTop: 2,
  },
  totalRotulo: {
    ...tipo.rotulo,
    color: cores.textoSecundario,
  },
  totalValor: {
    ...tipo.valor,
    fontFamily: fontes.semibold,
  },
});
