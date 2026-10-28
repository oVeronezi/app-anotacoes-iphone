import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFinance } from '@/store/useFinance';
import { cores, fontes, tipo } from '@/theme';
import { confirmar, escolherBackup, exportarBackup } from '@/utils/backup';

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

export function BackupBar() {
  const ultimoBackup = useFinance((s) => s.ultimoBackup);
  const temDados = useFinance((s) => Object.keys(s.meses).length > 0 || s.compras.length > 0);
  const [agora] = useState(() => Date.now());

  const atrasado =
    temDados && (!ultimoBackup || agora - new Date(ultimoBackup).getTime() > TRINTA_DIAS);

  const exportar = async () => {
    const { meses, compras, marcarBackup } = useFinance.getState();
    if (await exportarBackup({ meses, compras })) marcarBackup();
  };

  const importar = async () => {
    const dados = await escolherBackup();
    if (!dados) return;
    const ok = await confirmar(
      'Importar backup',
      'Os dados atuais deste aparelho serão substituídos pelos do arquivo.',
    );
    if (ok) useFinance.getState().importar(dados);
  };

  return (
    <View style={styles.bloco}>
      <Text style={[tipo.tituloSecao]}>Backup</Text>
      {atrasado && (
        <Text style={styles.lembrete}>
          {ultimoBackup
            ? 'Faz mais de um mês desde o último backup. Exporte um novo arquivo.'
            : 'Seus dados ficam só neste aparelho. Exporte um backup de vez em quando.'}
        </Text>
      )}
      <View style={styles.linha}>
        <Pressable style={[styles.botao, styles.principal]} onPress={exportar}>
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
