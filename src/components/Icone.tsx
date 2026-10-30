import Svg, { Path } from 'react-native-svg';

// Traços no estilo Lucide (ISC), em uma grade 24×24.
const CAMINHOS = {
  fixos: ['m17 2 4 4-4 4', 'M3 11v-1a4 4 0 0 1 4-4h14', 'm7 22-4-4 4-4', 'M21 13v1a4 4 0 0 1-4 4H3'],
  variaveis: [
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  ],
  compras: ['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
  esquerda: ['m15 18-6-6 6-6'],
  direita: ['m9 18 6-6-6-6'],
  mais: ['M5 12h14', 'M12 5v14'],
  check: ['M20 6 9 17l-5-5'],
  fechar: ['M18 6 6 18', 'm6 6 12 12'],
  copiar: ['M8 8h12v12H8z', 'M4 16V4h12'],
  contas: [
    'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z',
    'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8',
    'M12 17.5v-11',
  ],
  menu: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  info: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', 'M12 16v-4', 'M12 8h.01'],
};

export type NomeIcone = keyof typeof CAMINHOS;

type Props = { nome: NomeIcone; cor: string; tamanho?: number; espessura?: number };

export function Icone({ nome, cor, tamanho = 20, espessura = 2 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      {CAMINHOS[nome].map((d) => (
        <Path
          key={d}
          d={d}
          stroke={cor}
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
