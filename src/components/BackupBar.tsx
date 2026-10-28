import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFinance } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { confirmar, escolherBackup, exportarDadosAtuais } from '@/utils/backup';

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

export function BackupBar() {
  const ultimoBackup = useFinance((s) => s.ultimoBackup);
  const temDados = useFinance((s) => Object.keys(s.meses).length > 0 || s.compras.length > 0);
  const [agora] = useState(() => Date.now());

  const atrasado =
    temDados && (!ultimoBackup || agora - new Date(ultimoBackup).getTime() > TRINTA_DIAS);

  const importar = async () => {
    const dados = await escolherBackup();
    if (!dados) return;
    const ok = await confirmar(
      'Importar backup',
      'Todos os dados atuais deste iPhone serão apagados e substituídos pelos do arquivo. ' +
        'Se quiser guardar os atuais, cancele e exporte um backup antes.',
    );
    if (ok) useFinance.getState().importar(dados);
  };

  return (
    <View style={styles.bloco}>
      <Text style={[tipo.tituloSecao]}>Backup</Text>
      {atrasado && (
        <Pressable onPress={() => router.push('/info')} accessibilityRole="link">
          <Text style={styles.lembrete}>
            {ultimoBackup
              ? 'Faz mais de um mês desde o último backup. Exporte um novo arquivo.'
              : 'Seus dados ficam só neste iPhone. Exporte um backup de vez em quando.'}{' '}
            <Text style={styles.saibaMais}>Saiba mais</Text>
          </Text>
        </Pressable>
      )}
      <View style={styles.linha}>
        <Pressable style={[styles.botao, styles.principal]} onPress={exportarDadosAtuais}>
          <Text style={[styles.textoBotao, { color: cores.fundo }]}>Exportar</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={importar}>
          <Text style={styles.textoBotao}>Importar</Text>
        </Pressable>
      </View>
      {ultimoBackup && (
        <Text style={styles.data}>
          Último backup: {new Date(ultimoBackup).toLocaleDateString('pt-BR')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: 12 },
  lembrete: {
    ...tipo.item,
    fontSize: 14,
    color: cores.rosa,
  },
  saibaMais: { fontFamily: fontes.semibold, textDecorationLine: 'underline' },
  linha: { flexDirection: 'row', gap: 12 },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: cores.superficie,
  },
  principal: { backgroundColor: cores.rosa },
  textoBotao: { fontFamily: fontes.semibold, fontSize: 15, color: cores.texto },
  data: { ...tipo.item, fontSize: 13, color: cores.textoSecundario },
});
