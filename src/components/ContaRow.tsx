import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icone } from '@/components/Icone';
import { COR_SECAO, ItemRow } from '@/components/ItemRow';
import { falta, totalPago, type Conta } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { formatBRL } from '@/utils/money';

/** "2026-10-30" -> "30/10/2026" */
const dataBR = (data: string) => data.split('-').reverse().join('/');

export function ContaRow({ conta }: { conta: Conta }) {
  const restante = falta(conta);
  const quitada = restante <= 0;

  return (
    <View>
      <ItemRow secao="contas" item={conta} />
      <View style={styles.detalhes}>
        {conta.pagamentos.map((p) => (
          <Pressable
            key={p.id}
            style={styles.pagamento}
            onPress={() =>
              router.push({ pathname: '/pagamento', params: { conta: conta.id, id: p.id } })
            }
            accessibilityLabel={`Editar pagamento de ${formatBRL(p.valor)} em ${dataBR(p.data)}`}>
            <Text style={styles.textoPagamento}>{dataBR(p.data)}</Text>
            <Text style={[styles.textoPagamento, styles.valorPagamento]}>
              −{formatBRL(p.valor)}
            </Text>
          </Pressable>
        ))}

        {quitada ? (
          <View style={styles.status}>
            <Icone nome="check" cor={cores.verde} tamanho={16} espessura={3} />
            <Text style={[styles.textoStatus, { color: cores.verde }]}>Quitada</Text>
          </View>
        ) : (
          <View style={styles.status}>
            <Text style={styles.textoStatus}>
              Pago {formatBRL(totalPago(conta))} · Falta{' '}
              <Text style={styles.falta}>{formatBRL(restante)}</Text>
            </Text>
          </View>
        )}

        <Pressable
          style={styles.botao}
          onPress={() => router.push({ pathname: '/pagamento', params: { conta: conta.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar pagamento em ${conta.titulo}`}>
          <Icone nome="mais" cor={COR_SECAO.contas} tamanho={16} espessura={2.5} />
          <Text style={styles.textoBotao}>Adicionar pagamento</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Alinha com o título do ItemRow (ícone de 32 + gap de 12).
  detalhes: { paddingLeft: 44, paddingBottom: 14, gap: 8 },
  pagamento: { flexDirection: 'row', justifyContent: 'space-between' },
  textoPagamento: { ...tipo.valor, fontSize: 14, color: cores.textoSecundario },
  valorPagamento: { color: cores.verde },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  textoStatus: { ...tipo.item, fontSize: 14, color: cores.textoSecundario },
  falta: { fontFamily: fontes.semibold, color: cores.texto },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COR_SECAO.contas,
    marginTop: 2,
  },
  textoBotao: { fontFamily: fontes.medium, fontSize: 14, color: COR_SECAO.contas },
});
