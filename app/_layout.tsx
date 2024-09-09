import 'react-native-reanimated';
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
import { Stack, Redirect, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NamedStyles = StyleSheet.NamedStyles;
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync().then();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        console.log('try error', e);
      }
    }
  }

  useEffect(() => {
    async function checkLoginStatus() {
      const token = await AsyncStorage.getItem('userToken');
      console.log('token', token);
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
    registerForPushNotificationsAsync().then()
  }, [loaded]);

  const onLayoutRootView = useCallback(async () => {
    console.log('isLoggedIn', isLoggedIn);
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
            <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
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
