import 'react-native-reanimated';
import 'expo-dev-client';
import { useCallback, useEffect, useState } from 'react';
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
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    async function checkLoginStatus() {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }

    async function prepare() {
      await checkLoginStatus();
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (loaded) {
        setIsReady(true);
      }
    }
    prepare().then();
  }, [loaded]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
      if (!isLoggedIn) {
        router.replace('/register');
      }
    }
  }, [isReady, isLoggedIn]);

  if (!isReady) {
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
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false, presentation: 'modal' }} />
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
