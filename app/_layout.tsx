import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback, useEffect, useState} from 'react';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {useColorScheme, View, StyleSheet, Image } from 'react-native';
import {createTokens, TamaguiProvider} from 'tamagui';
import { tamaguiConfig } from "@/tamagui.config";

SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
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
    }
  }, [isReady]);

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
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
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
