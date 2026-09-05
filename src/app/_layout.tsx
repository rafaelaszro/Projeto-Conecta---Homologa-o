/**
 * Layout raiz do aplicativo.
 *
 * Carrega a tipografia oficial (Poppins) antes de exibir qualquer tela e define
 * a navegação em pilha usada pelas telas de autenticação.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

import { CORES } from '@/constants/theme';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fontesCarregadas, erroNasFontes] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontesCarregadas || erroNasFontes) {
      SplashScreen.hideAsync();
    }
  }, [fontesCarregadas, erroNasFontes]);

  if (!fontesCarregadas && !erroNasFontes) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: CORES.FUNDO },
        }}
      />
    </>
  );
}
