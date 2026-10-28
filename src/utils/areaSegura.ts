import { Platform } from 'react-native';

type Lado = 'top' | 'bottom' | 'left' | 'right';

/**
 * Margem da área segura (notch, barra de gestos) somada a um espaço extra.
 *
 * Na web usa o env() do CSS direto: no app instalado do iPhone o valor medido pelo
 * react-native-safe-area-context pode chegar 0 e a data ficava atrás da barra de status.
 * O max() mantém o valor do JS quando ele é maior (na moldura de pré-visualização do PC).
 */
export function areaSegura(lado: Lado, valorJs: number, extra = 0): number {
  if (Platform.OS !== 'web') return valorJs + extra;
  return `calc(max(env(safe-area-inset-${lado}), ${valorJs}px) + ${extra}px)` as unknown as number;
}
