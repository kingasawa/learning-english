import 'react-native-reanimated';
import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from "@/tamagui.config";
import type { Theme } from "@react-navigation/native/src/types";
import { useColorScheme, Keyboard, TouchableWithoutFeedback, View, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const DefaultTheme: Theme = {
    dark: false,
    colors: {
      primary: '#364684',
      background: '#364684',
      card: 'rgb(255, 255, 255)',
      text: '#364684',
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
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (loaded) {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare().then();
  }, [loaded]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
      if (!isLoggedIn) {
        // router.replace('/login');
      }
    }
  }, [isReady, isLoggedIn]);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('@/assets/images/bottalk.gif')}
          style={styles.splashImage}
          resizeMode="contain"
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
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </Stack>
        </View>
      </ThemeProvider>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
