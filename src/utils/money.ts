/** Centavos (inteiro) -> "R$ 1.234,56". Negativos saem como "−R$ 1.234,56". */
export function formatBRL(centavos: number): string {
  const negativo = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  const reais = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = (abs % 100).toString().padStart(2, '0');
  return `${negativo ? '−' : ''}R$ ${reais},${cents}`;
}

/** Só os dígitos digitados viram centavos: "123456" -> 123456 (R$ 1.234,56). */
export function digitosParaCentavos(texto: string): number {
  const digitos = texto.replace(/\D/g, '').slice(0, 11);
  return digitos ? parseInt(digitos, 10) : 0;
}

/** Valor do campo de digitação, no formato "1.234,56" (sem o "R$"). */
export function centavosParaCampo(centavos: number): string {
  return formatBRL(centavos).replace(/^−?R\$ /, '');
}
