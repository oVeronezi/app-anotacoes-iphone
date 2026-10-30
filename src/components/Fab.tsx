import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icone } from '@/components/Icone';
import { cores } from '@/theme';
import { areaSegura } from '@/utils/areaSegura';

type Props = { params?: Record<string, string> };

export function Fab({ params }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/item', params })}
      style={({ pressed }) => [
        styles.botao,
        {
          bottom: areaSegura('bottom', insets.bottom, 20),
          right: areaSegura('right', insets.right, 20),
        },
        pressed && { transform: [{ scale: 0.94 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Adicionar item">
      <Icone nome="mais" cor={cores.fundo} tamanho={28} espessura={2.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.rosa,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
