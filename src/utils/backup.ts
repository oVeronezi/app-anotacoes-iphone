import { Alert, Platform } from 'react-native';

import { validarDados, type Dados } from '@/store/useFinance';

export function confirmar(titulo: string, mensagem: string): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  return new Promise((resolve) =>
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]),
  );
}

export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${mensagem}`);
  else Alert.alert(titulo, mensagem);
}

/**
 * Gera o arquivo .json. No iPhone abre a folha de compartilhamento
 * (dá para salvar em Arquivos/iCloud); no computador, baixa o arquivo.
 * Retorna true se o backup foi entregue.
 */
export async function exportarBackup(dados: Dados): Promise<boolean> {
  if (Platform.OS !== 'web') {
    avisar('Backup', 'O backup está disponível na versão web do app.');
    return false;
  }
  const hoje = new Date().toISOString().slice(0, 10);
  const nome = `financas-${hoje}.json`;
  const conteudo = JSON.stringify({ app: 'minhas-financas', versao: 1, ...dados }, null, 2);
  const arquivo = new File([conteudo], nome, { type: 'application/json' });

  if (navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], title: nome });
      return true;
    } catch (erro) {
      if ((erro as Error).name === 'AbortError') return false;
      // Outros erros: tenta o download abaixo.
    }
  }

  const url = URL.createObjectURL(arquivo);
  const link = document.createElement('a');
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

/** Abre o seletor de arquivo e devolve os dados lidos, ou null se cancelado/inválido. */
export function escolherBackup(): Promise<Dados | null> {
  if (Platform.OS !== 'web') {
    avisar('Backup', 'A importação está disponível na versão web do app.');
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      const arquivo = input.files?.[0];
      if (!arquivo) return resolve(null);
      try {
        const lido = JSON.parse(await arquivo.text());
        if (validarDados(lido)) {
          resolve({ meses: lido.meses, compras: lido.compras });
          return;
        }
      } catch {
        // cai no aviso abaixo
      }
      avisar('Arquivo inválido', 'Esse arquivo não parece ser um backup do app.');
      resolve(null);
    };
    input.click();
  });
}
