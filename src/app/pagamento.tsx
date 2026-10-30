import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/Icone';
import { falta, useFinance } from '@/store/useFinance';
import { cores, fontes, LARGURA_MAX, tipo } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';
import { centavosParaCampo, digitosParaCentavos, formatBRL } from '@/utils/money';

function fechar() {
  if (router.canGoBack()) router.back();
  else router.replace('/contas');
}

export default function PagamentoModal() {
  const params = useLocalSearchParams<{ conta?: string; id?: string }>();
  const insets = useSafeAreaInsets();

  const conta = useFinance((s) => s.contas.find((c) => c.id === params.conta));
  const original = conta?.pagamentos.find((p) => p.id === params.id);
  const { salvarPagamento, removerPagamento } = useFinance.getState();

  const editando = !!original;
  const [valor, setValor] = useState(original?.valor ?? 0);
  const [erro, setErro] = useState('');

  const salvar = () => {
    if (!conta) return fechar();
    if (valor <= 0) return setErro('Informe um valor.');
    salvarPagamento(conta.id, valor, original?.id);
    fechar();
  };

  const excluir = () => {
    if (conta && original) removerPagamento(conta.id, original.id);
    fechar();
  };

  return (
    <View style={styles.tela}>
      <Pressable style={StyleSheet.absoluteFill} onPress={fechar} accessibilityLabel="Fechar" />
      {/* Perto do topo para ficar acima do teclado do iPhone (~336 pt no iPhone 11). */}
      <View style={[styles.folha, { marginTop: areaSegura('top', insets.top, 16) }]}>
        <View style={styles.topo}>
          <Text style={[tipo.tituloSecao, styles.flex]}>
            {editando ? 'Editar pagamento' : 'Novo pagamento'}
          </Text>
          <Pressable onPress={fechar} hitSlop={12} accessibilityLabel="Fechar">
            <Icone nome="fechar" cor={cores.textoSecundario} tamanho={22} />
          </Pressable>
        </View>

        {conta && (
          <Text style={styles.subtitulo}>
            {conta.titulo} · Falta {formatBRL(Math.max(0, falta(conta)))}
          </Text>
        )}

        <Text style={styles.rotulo}>Valor pago</Text>
        <View style={styles.campo}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            value={centavosParaCampo(valor)}
            onChangeText={(t) => {
              setValor(digitosParaCentavos(t));
              setErro('');
            }}
            keyboardType="number-pad"
            inputMode="numeric"
            style={[styles.campoTexto, styles.flex]}
            autoFocus
            selectTextOnFocus={false}
            onSubmitEditing={salvar}
          />
        </View>

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <View style={styles.acoes}>
          {editando && (
            <Pressable style={[styles.botao, styles.botaoExcluir]} onPress={excluir}>
              <Text style={[styles.botaoTexto, { color: cores.rosa }]}>Excluir</Text>
            </Pressable>
          )}
          <Pressable style={[styles.botao, styles.botaoSalvar]} onPress={salvar}>
            <Text style={[styles.botaoTexto, { color: cores.fundo }]}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 9, 0.72)',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  folha: {
    width: '100%',
    maxWidth: LARGURA_MAX,
    backgroundColor: cores.superficie,
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  topo: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  subtitulo: { ...tipo.item, fontSize: 14, color: cores.textoSecundario },
  rotulo: { ...tipo.rotulo, color: cores.textoSecundario, marginTop: 8 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: cores.fundo,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  prefixo: { ...tipo.item, color: cores.textoSecundario, fontSize: 17 },
  campoTexto: { ...tipo.valor, fontSize: 17, paddingVertical: 12, outlineStyle: 'none' } as object,
  erro: { ...tipo.item, fontSize: 14, color: cores.rosa },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 16 },
  botao: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  botaoSalvar: { backgroundColor: cores.rosa },
  botaoExcluir: { borderWidth: 1, borderColor: cores.rosa },
  botaoTexto: { fontFamily: fontes.semibold, fontSize: 16 },
});
