import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/Icone';
import { COR_SECAO } from '@/components/ItemRow';
import { useFinance, type Secao } from '@/store/useFinance';
import { cores, fontes, LARGURA_MAX, tipo } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';
import { centavosParaCampo, digitosParaCentavos } from '@/utils/money';
import { nomeDoMes } from '@/utils/month';

const OPCOES: { secao: Secao; rotulo: string }[] = [
  { secao: 'fixos', rotulo: 'Fixo' },
  { secao: 'variaveis', rotulo: 'Variável' },
  { secao: 'compras', rotulo: 'Compra' },
  { secao: 'contas', rotulo: 'Conta' },
];

const ROTULO_VALOR: Partial<Record<Secao, string>> = {
  compras: 'Valor estimado',
  contas: 'Valor total',
};

const ehSecao = (v: unknown): v is Secao => OPCOES.some((o) => o.secao === v);

function fechar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function ItemModal() {
  const params = useLocalSearchParams<{ secao?: string; id?: string }>();
  const insets = useSafeAreaInsets();
  const ehSalario = params.secao === 'salario';
  const secaoOrigem = ehSecao(params.secao) ? params.secao : undefined;

  const mesAtual = useFinance((s) => s.mesAtual);
  const original = useFinance((s) => {
    if (!secaoOrigem || !params.id) return undefined;
    const lista =
      secaoOrigem === 'compras' || secaoOrigem === 'contas'
        ? s[secaoOrigem]
        : (s.meses[s.mesAtual]?.[secaoOrigem] ?? []);
    return lista.find((i) => i.id === params.id);
  });
  const salarioAtual = useFinance((s) => s.meses[s.mesAtual]?.salario ?? 0);
  const { salvarItem, removerItem, setSalario } = useFinance.getState();

  const editando = !!original && !!secaoOrigem;
  const [secao, setSecao] = useState<Secao>(secaoOrigem ?? 'variaveis');
  const [titulo, setTitulo] = useState(original?.titulo ?? '');
  const [valor, setValor] = useState(ehSalario ? salarioAtual : (original?.valor ?? 0));
  const [erro, setErro] = useState('');

  const salvar = () => {
    if (ehSalario) {
      setSalario(valor);
      return fechar();
    }
    if (!titulo.trim()) return setErro('Dê um título ao item.');
    salvarItem(
      secao,
      { titulo: titulo.trim(), valor },
      editando ? { secao: secaoOrigem, id: original.id } : undefined,
    );
    fechar();
  };

  const excluir = () => {
    if (editando) removerItem(secaoOrigem, original.id);
    fechar();
  };

  const tituloTela = ehSalario
    ? `Salário de ${nomeDoMes(mesAtual)}`
    : editando
      ? 'Editar item'
      : 'Novo item';

  return (
    <View style={styles.tela}>
      <Pressable style={StyleSheet.absoluteFill} onPress={fechar} accessibilityLabel="Fechar" />
      {/* Perto do topo para ficar acima do teclado do iPhone (~336 pt no iPhone 11). */}
      <View style={[styles.folha, { marginTop: areaSegura('top', insets.top, 16) }]}>
        <View style={styles.topo}>
          <Text style={[tipo.tituloSecao, styles.flex]}>{tituloTela}</Text>
          <Pressable onPress={fechar} hitSlop={12} accessibilityLabel="Fechar">
            <Icone nome="fechar" cor={cores.textoSecundario} tamanho={22} />
          </Pressable>
        </View>

        {!ehSalario && (
          <>
            <Text style={styles.rotulo}>Seção</Text>
            <View style={styles.segmentos}>
              {OPCOES.map((o) => {
                const ativo = o.secao === secao;
                return (
                  <Pressable
                    key={o.secao}
                    onPress={() => setSecao(o.secao)}
                    style={[
                      styles.segmento,
                      ativo && { backgroundColor: COR_SECAO[o.secao], borderColor: COR_SECAO[o.secao] },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: ativo }}>
                    <Text style={[styles.segmentoTexto, ativo && { color: cores.fundo }]}>
                      {o.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.rotulo}>Título</Text>
            <TextInput
              value={titulo}
              onChangeText={(t) => {
                setTitulo(t);
                setErro('');
              }}
              placeholder="Ex.: Aluguel"
              placeholderTextColor={cores.textoSecundario}
              style={styles.campo}
              autoFocus={!editando}
              returnKeyType="next"
              maxLength={60}
            />
          </>
        )}

        <Text style={styles.rotulo}>{ehSalario ? 'Valor' : (ROTULO_VALOR[secao] ?? 'Valor')}</Text>
        <View style={[styles.campo, styles.campoValor]}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            value={centavosParaCampo(valor)}
            onChangeText={(t) => setValor(digitosParaCentavos(t))}
            keyboardType="number-pad"
            inputMode="numeric"
            style={[styles.campoTexto, styles.flex]}
            autoFocus={ehSalario}
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
  topo: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  flex: { flex: 1 },
  rotulo: { ...tipo.rotulo, color: cores.textoSecundario, marginTop: 8 },
  segmentos: { flexDirection: 'row', gap: 8 },
  segmento: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.textoSecundario,
    alignItems: 'center',
  },
  segmentoTexto: { fontFamily: fontes.medium, fontSize: 15, color: cores.texto },
  campo: {
    ...tipo.item,
    backgroundColor: cores.fundo,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
  },
  campoValor: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 0 },
  prefixo: { ...tipo.item, color: cores.textoSecundario, fontSize: 17 },
  campoTexto: { ...tipo.valor, fontSize: 17, paddingVertical: 12, outlineStyle: 'none' } as object,
  erro: { ...tipo.item, fontSize: 14, color: cores.rosa },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 16 },
  botao: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  botaoSalvar: { backgroundColor: cores.rosa },
  botaoExcluir: { borderWidth: 1, borderColor: cores.rosa },
  botaoTexto: { fontFamily: fontes.semibold, fontSize: 16 },
});
