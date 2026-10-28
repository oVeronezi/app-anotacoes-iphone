// Importa só os pesos usados (o índice do pacote traz todos os 18).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useCarregado } from '@/store/useFinance';
import { cores } from '@/theme';

SplashScreen.preventAutoHideAsync();

const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.texto,
    primary: cores.rosa,
    border: cores.superficie,
  },
};

export default function RootLayout() {
  const [fontesProntas] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const carregado = useCarregado();
  const pronto = fontesProntas && carregado;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  // Até carregar fontes e dados salvos, só o fundo (também é o que vai no HTML estático).
  if (!pronto) return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ThemeProvider value={tema}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="item"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
