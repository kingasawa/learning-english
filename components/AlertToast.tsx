import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Spinner, XStack, YStack} from "tamagui";
import {BadgeAlert} from "@tamagui/lucide-icons";

export const HEIGHT = 60;
export const WIDTH = 340;
export const BORDER_RADIUS = 6;

const toastConfig = {
  base: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#00a5c4', backgroundColor: '#f3fcff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        color: '#00a5c4'
      }}
      text2Style={{
        fontSize: 15,
        color: '#00a5c4'
      }}
    />
  ),
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#67ad00', backgroundColor: '#f3ffe5' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        color: '#67ad00'
      }}
      text2Style={{
        fontSize: 15,
        color: '#67ad00'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#a10303', backgroundColor: '#feece9' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        color: '#a10303'
      }}
      text2Style={{
        fontSize: 15,
        color: '#b20303'
      }}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#ee9005', backgroundColor: '#fff4de' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        color: '#dc8400'
      }}
      text2Style={{
        fontSize: 15,
        color: '#ee9005'
      }}
    />
  ),
  custom: (props) => (
    <TouchableOpacity
      testID="toastTouchableContainer"
      style={[styles.base, styles.leadingBorder]}
      >
    <View
      testID="toastcontentContainer"
      style={styles.contentContainer}
      >
      <XStack gap="$2">
        <BadgeAlert color="#ee9005" />
        <YStack>
          <Text
            testID="toastText1"
            style={styles.text1}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            Text 1
          </Text>
          <Text
            testID="toastText2"
            style={styles.text2}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            this is text 2
          </Text>
        </YStack>
      </XStack>
    </View>
    </TouchableOpacity>
  )
};

/*
  2. Pass the config as prop to the Toast component instance
*/
export function AlertToast(props) {
  return (
    <Toast config={toastConfig} />
  );
}

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    height: HEIGHT,
    width: WIDTH,
    borderRadius: BORDER_RADIUS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: BORDER_RADIUS,
    elevation: 2,
    backgroundColor: '#fff4de'
  },
  leadingBorder: {
    borderLeftWidth: 5,
    borderLeftColor: '#ee9005'
  },
  contentContainer: {
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start' // In case of RTL, the text will start from the right
  },
  text1: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#ee9005',
    width: '100%' // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  },
  text2: {
    fontSize: 12,
    color: '#ee9005',
    width: '100%' // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  }
});
