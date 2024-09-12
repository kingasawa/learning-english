import * as React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, Button } from "react-native";
import { H3, H5, XStack, YStack } from "tamagui";
import LessonCard from "@/components/LessonCard";
import * as Speech from 'expo-speech';
const bgImage = require('@/assets/images/bg4.png');

export default function App() {
  const speak = async() => {
    const thingToSay = 'How are you today';
    const voices = await Speech.getAvailableVoicesAsync();
    // console.log('voices', voices);
    Speech.speak(thingToSay, {
      language: 'en-US',
      // pitch: 0.8,
      rate: 0.6
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
            borderRadius="$8"
            padding={15}
            shadowColor={'rgb(132,66,185)'}
            shadowOffset={{
              width: 0,
              height: 1
            }}
            shadowOpacity={0.3}
            shadowRadius={3}
          >
           <YStack gap="$2" alignItems="center">
             <Image
               source={require('@/assets/images/img.png')}
               style={styles.image}
             />
             <Text>v1.0.0</Text>
           </YStack>
            <YStack flex={1}>
              <H5 fontWeight="bold">Vì cộng đồng</H5>
              <Text>
                Ứng dụng này được tạo ra cho mục đích chia sẻ cộng đồng, vì thế ứng dụng sẽ không thu bất cứ khoản phí nào, cũng như sẽ không xuất hiện quảng cáo trên ứng dụng.
              </Text>
            </YStack>
          </XStack>
          <YStack gap="$3" marginTop={15}>
            <H3 alignSelf="center">Có gì ở version 1.0.1</H3>
            <Text style={{ textAlign: 'center' }}>Ở version tiếp theo sẽ có các tính năng mới như bên dưới. Hãy bật thông báo để update ngay khi có bản cập nhật mới</Text>
            <LessonCard
              title="Học từ vựng qua ảnh"
              description="Hình ảnh sẽ hiện lên và các bạn đoán từ vựng đúng"
              url=""
            />
            <LessonCard
              title="Tăng kỹ năng nghe"
              description="Bạn sẽ nghe 1 từ và chọn vào hình ảnh đúng với từ mà bạn nghe được"
              url=""
            />
            <LessonCard
              title="Đọc hiểu và nói"
              description="Nhiều câu truyện nhiều cấp độ, hãy cố gắng vượt qua nó."
              url=""
            />
          </YStack>
          <Button title="Press to test sound" onPress={speak} />
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 60,
    justifyContent: 'flex-start'
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
