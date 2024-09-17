import * as React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, Button, ScrollView } from "react-native";
import { H3, H5, XStack, YStack } from "tamagui";
import LessonCard from "@/components/LessonCard";
import * as Speech from 'expo-speech';
import { AIConfigModal } from "@/components/AIConfigModal";
import { useRef } from "react";

export default function App() {
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);

  return (
      <ImageBackground
        source={bgImage}
        style={styles.imageBackground}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            ref={scrollViewRef}
          >
          <AIConfigModal />
          <YStack gap="$1" marginTop={15}>
            <H3 alignSelf="center" color="$primary">Tình huống giao tiếp</H3>
            <Text style={{ textAlign: 'center' }}>Chọn 1 tình huống để thực hành giao tiếp</Text>
            <YStack marginTop={15} gap="$3">
              <LessonCard
                title="Lớp tiếng anh"
                description="Những học sinh đang trò chuyện với giáo viên trong 1 lớp học tiếng anh"
                context="classroom"
                img={require('@/assets/images/lesson/classroom.webp')}
              />
              <LessonCard
                title="Quán cà phê"
                description="Bạn đang gặp bạn bè người nước ngoài và trò chuyện với họ trong 1 quán cafe"
                context="coffee-shop"
                img={require('@/assets/images/lesson/coffee-shop.webp')}
              />
              <LessonCard
                title="Buổi cắm trại"
                description="Bạn đang đi du lịch cùng những người bạn thân, trao đổi bằng tiếng anh với họ."
                context="travel"
                img={require('@/assets/images/lesson/travel.webp')}
              />
            </YStack>
          </YStack>
          </ScrollView>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  scrollView: {
    paddingTop: 10,
    borderRadius: 15,
    marginBottom: 80
  },
});
