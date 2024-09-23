import 'react-native-reanimated';
import { useCallback } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from "@/tamagui.config";
import type { Theme } from "@react-navigation/native/src/types";
import {
  useColorScheme,
  View,
  StyleSheet,
  ImageBackground
} from "react-native";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import NamedStyles = StyleSheet.NamedStyles;

SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const DefaultTheme: Theme = {
    dark: false,
    colors: {
      primary: '#0c52ac',
      background: 'rgb(255,255,255)',
      card: 'rgb(255, 255, 255)',
      text: '#0c52ac',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    },
  };
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (!loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loaded) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/images/splash.png')}
          style={styles.image}
        />
      </View>
    );
  }

  return (
    <TamaguiProvider  config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={DefaultTheme}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="record" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </View>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create<NamedStyles<any>>({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%"
  },
});
