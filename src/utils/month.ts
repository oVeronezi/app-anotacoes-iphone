const NOMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/** Chave do mês no formato "2026-11". */
export function chaveDoMes(data = new Date()): string {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export function somarMeses(chave: string, delta: number): string {
  const [ano, mes] = chave.split('-').map(Number);
  return chaveDoMes(new Date(ano, mes - 1 + delta, 1));
}

/** "2026-11" -> "novembro de 2026" (o cabeçalho deixa em maiúsculas). */
export function nomeDoMes(chave: string): string {
  const [ano, mes] = chave.split('-').map(Number);
  return `${NOMES[mes - 1]} de ${ano}`;
}
