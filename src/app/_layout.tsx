// Importa só os pesos usados (o índice do pacote traz todos os 18).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PhoneFrame } from '@/components/PhoneFrame';
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

const opcoesModal = {
  presentation: 'transparentModal',
  animation: 'fade',
  contentStyle: { backgroundColor: 'transparent' },
} as const;

export default function RootLayout() {
  const [fontesProntas] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const carregado = useCarregado();
  const pronto = fontesProntas && carregado;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  // Service worker (gerado no `npm run build`) deixa o app funcionando offline.
  useEffect(() => {
    if (Platform.OS === 'web' && !__DEV__ && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Até carregar fontes e dados salvos, só o fundo (também é o que vai no HTML estático).
  if (!pronto) return <View style={{ flex: 1, backgroundColor: cores.fundo }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: cores.fundo }}>
      <ThemeProvider value={tema}>
        <StatusBar style="light" />
        <PhoneFrame>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="item" options={opcoesModal} />
            <Stack.Screen name="info" options={opcoesModal} />
          </Stack>
        </PhoneFrame>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
