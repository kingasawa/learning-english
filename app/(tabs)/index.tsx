import * as React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from "react-native";
import { Button, H5, XStack, YStack } from "tamagui";
import * as Speech from 'expo-speech';
import NamedStyles = StyleSheet.NamedStyles;
const bgImage = require('@/assets/images/bg4.png');

export default function App() {

  const speak = () => {
    const thingToSay = 'Hi, How do you do ?';
    Speech.speak(thingToSay, {
      language: 'en-US',
    });
  };

  return (
      <ImageBackground
        source={bgImage}
        style={styles.imageBackground}
      >
        <View style={styles.container}>
          <XStack
            alignItems="center"
            gap="$4"
            backgroundColor="$yellow"
            padding={15}
            paddingTop={80}
            shadowColor={'rgb(132,66,185)'}
            shadowOffset={{
              width: 0,
              height: 1
            }}
            shadowOpacity={0.3}
            shadowRadius={3}
          >
            <Image
              source={require('@/assets/images/img.png')}
              style={styles.image}
            />
            <YStack flex={1}>
              <H5>Vì cộng đồng</H5>
              <Text>
                Ứng dụng này được tạo ra cho mục đích chia sẻ cộng đồng, vì thế ứng dụng sẽ không thu bất cứ khoản phí nào, cũng như sẽ không xuất hiện quảng cáo trên ứng dụng.
              </Text>
            </YStack>
          </XStack>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  image: {
    width: 80,
    height: 80
  },
});
