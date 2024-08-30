import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from "@/tamagui.config"
import type { Theme } from "@react-navigation/native/src/types";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// TypeScript types across all Tamagui APIs

export default function RootLayout() {

  const CustomTheme: Theme = {
    dark: false,
    colors: {
      primary: '#364684FF',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(54,70,132)',
      text: '#364684FF',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    },
  };

  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider  config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
