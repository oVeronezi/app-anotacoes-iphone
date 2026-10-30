export const cores = {
  fundo: '#1A1719',
  superficie: '#262124',
  texto: '#F1EAE4',
  textoSecundario: 'rgba(241, 234, 228, 0.55)',
  rosa: '#FF8EDD',
  verde: '#638C6A',
  azul: '#006CC6',
  amarelo: '#E0A84F',
};

export const fontes = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
};

export const tipo = {
  tituloSecao: { fontFamily: fontes.semibold, fontSize: 22, color: cores.texto },
  item: { fontFamily: fontes.regular, fontSize: 16, color: cores.texto },
  valor: {
    fontFamily: fontes.regular,
    fontSize: 16,
    color: cores.texto,
    fontVariant: ['tabular-nums' as const],
  },
  valorResumo: {
    fontFamily: fontes.semibold,
    fontSize: 24,
    color: cores.texto,
    fontVariant: ['tabular-nums' as const],
  },
  rotulo: {
    fontFamily: fontes.medium,
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
  mes: {
    fontFamily: fontes.medium,
    fontSize: 15,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    color: cores.texto,
  },
};

// Largura do iPhone 11 (pt): a coluna nunca passa disso.
export const LARGURA_MAX = 414;
