import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/Icone';
import { useFinance } from '@/store/useFinance';
import { cores, fontes, LARGURA_MAX, tipo } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';
import { exportarDadosAtuais } from '@/utils/backup';

function fechar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

function Bloco({ titulo, cor, children }: { titulo: string; cor: string; children: ReactNode }) {
  return (
    <View style={styles.bloco}>
      <Text style={[styles.blocoTitulo, { color: cor }]}>{titulo}</Text>
      {children}
    </View>
  );
}

function Item({ children }: { children: ReactNode }) {
  return (
    <View style={styles.item}>
      <Text style={styles.marcador}>•</Text>
      <Text style={styles.texto}>{children}</Text>
    </View>
  );
}

const forte = (t: string) => <Text style={styles.forte}>{t}</Text>;

export default function InfoModal() {
  const insets = useSafeAreaInsets();
  const ultimoBackup = useFinance((s) => s.ultimoBackup);

  return (
    <View style={styles.tela}>
      <Pressable style={StyleSheet.absoluteFill} onPress={fechar} accessibilityLabel="Fechar" />
      <View
        style={[
          styles.folha,
          {
            marginTop: areaSegura('top', insets.top, 16),
            marginBottom: areaSegura('bottom', insets.bottom, 16),
          },
        ]}>
        <View style={styles.topo}>
          <Text style={[tipo.tituloSecao, styles.flex]}>Seus dados</Text>
          <Pressable onPress={fechar} hitSlop={12} accessibilityLabel="Fechar">
            <Icone nome="fechar" cor={cores.textoSecundario} tamanho={22} />
          </Pressable>
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.conteudo}>
          <Text style={styles.texto}>
            Tudo o que você anota fica {forte('só neste iPhone')}. Nada vai para a internet: não
            tem conta, senha nem nuvem. Por isso, se os dados forem apagados, não dá para
            recuperar sem um backup.
          </Text>

          <Bloco titulo="Pode ficar tranquilo" cor={cores.verde}>
            <Item>Fechar o app ou tirá-lo da lista de apps abertos.</Item>
            <Item>Reiniciar ou desligar o iPhone.</Item>
            <Item>Ficar sem internet (o app funciona offline).</Item>
            <Item>Receber atualizações do app.</Item>
          </Bloco>

          <Bloco titulo="Pode apagar seus dados" cor={cores.rosa}>
            <Item>
              Apagar o {forte('ícone do app')} da Tela de Início.
            </Item>
            <Item>
              Em Ajustes → Apps → Safari, tocar em {forte('Limpar Histórico e Dados dos Sites')}.
            </Item>
            <Item>
              Em Ajustes → Apps → Safari → Avançado → {forte('Dados dos Sites')}, remover o site do
              app (vercel.app).
            </Item>
            <Item>Trocar de iPhone ou restaurar o aparelho sem ter exportado um backup.</Item>
          </Bloco>

          <Bloco titulo="Atenção" cor={cores.rosa}>
            <Item>
              Use sempre pelo {forte('ícone da Tela de Início')}. O app instalado e o site aberto no
              Safari guardam dados {forte('separados')}: o que você anota em um não aparece no outro.
            </Item>
            <Item>
              Aberto direto no Safari (sem instalar), o iPhone pode apagar os dados se o site ficar
              uns 7 dias sem ser aberto. O app instalado não tem esse problema.
            </Item>
            <Item>Na aba anônima (navegação privada) nada fica salvo.</Item>
          </Bloco>

          <Bloco titulo="Como se proteger" cor={cores.texto}>
            <Item>
              Toque em {forte('Exportar')} pelo menos uma vez por mês e salve o arquivo em Arquivos
              ou no iCloud Drive.
            </Item>
            <Item>
              Para trocar de iPhone: Exportar no aparelho antigo e {forte('Importar')} no novo.
            </Item>
            <Item>Não mande o arquivo de backup para outras pessoas: ele tem todos os seus valores.</Item>
          </Bloco>
        </ScrollView>

        <Text style={styles.data}>
          {ultimoBackup
            ? `Último backup: ${new Date(ultimoBackup).toLocaleDateString('pt-BR')}`
            : 'Você ainda não fez nenhum backup.'}
        </Text>
        <View style={styles.acoes}>
          <Pressable style={[styles.botao, styles.botaoSecundario]} onPress={fechar}>
            <Text style={styles.botaoTexto}>Entendi</Text>
          </Pressable>
          <Pressable style={[styles.botao, styles.botaoPrincipal]} onPress={exportarDadosAtuais}>
            <Text style={[styles.botaoTexto, { color: cores.fundo }]}>Exportar agora</Text>
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
    flex: 1,
    width: '100%',
    maxWidth: LARGURA_MAX,
    backgroundColor: cores.superficie,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  topo: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  conteudo: { gap: 20, paddingBottom: 8 },
  bloco: { gap: 8 },
  blocoTitulo: { ...tipo.rotulo, fontSize: 13 },
  item: { flexDirection: 'row', gap: 8 },
  marcador: { ...tipo.item, color: cores.textoSecundario, lineHeight: 22 },
  texto: { ...tipo.item, fontSize: 15, lineHeight: 22, flex: 1 },
  forte: { fontFamily: fontes.semibold },
  data: { ...tipo.item, fontSize: 13, color: cores.textoSecundario, textAlign: 'center' },
  acoes: { flexDirection: 'row', gap: 12 },
  botao: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  botaoPrincipal: { backgroundColor: cores.rosa },
  botaoSecundario: { borderWidth: 1, borderColor: cores.textoSecundario },
  botaoTexto: { fontFamily: fontes.semibold, fontSize: 16, color: cores.texto },
});
