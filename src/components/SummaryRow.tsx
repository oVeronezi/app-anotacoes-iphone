import { router } from 'expo-router';

import { ResumoColunas } from '@/components/ResumoColunas';
import { soma, useMes } from '@/store/useFinance';
import { cores } from '@/theme';

export function SummaryRow() {
  const mes = useMes();

  const gastos = soma(mes.fixos) + soma(mes.variaveis);
  const saldo = mes.salario - gastos;

  return (
    <ResumoColunas
      colunas={[
        {
          rotulo: 'Saldo',
          cor: saldo < 0 ? cores.rosa : cores.verde,
          valor: saldo,
          corValor: saldo < 0 ? cores.rosa : cores.texto,
        },
        {
          rotulo: 'Salário',
          cor: cores.verde,
          valor: mes.salario,
          onPress: () => router.push({ pathname: '/item', params: { secao: 'salario' } }),
          accessibilityLabel: 'Editar salário',
        },
        { rotulo: 'Gastos', cor: cores.rosa, valor: gastos },
      ]}
    />
  );
}
