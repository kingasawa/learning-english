import * as React from 'react';
import {View, StyleSheet, Text, ImageBackground, ScrollView, Linking } from "react-native";
import { H3, XStack, YStack, Button, AlertDialog } from "tamagui";
import LessonCard from "@/components/LessonCard";
import { AIConfigModal } from "@/components/AIConfigModal";
// import { MaterialIcons } from "@expo/vector-icons";
import {useRef, useState} from "react";

export default function App() {
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);
  // const [openHelp, setOpenHelp] = useState<boolean>(false);

  return (
      <ImageBackground
        source={bgImage}
        style={styles.imageBackground}
      >
        <View style={styles.container}>
          {/*<XStack justifyContent="flex-end" alignItems="center" style={styles.header} >*/}
          {/*  <Button*/}
          {/*    size="$2"*/}
          {/*    icon={<MaterialIcons name="info" size={18} />}*/}
          {/*    onPress={() => setOpenHelp(true)}*/}
          {/*  >*/}
          {/*    <Text style={{ color: 'white', fontSize: 12 }}>HƯỚNG DẪN</Text>*/}
          {/*  </Button>*/}
          {/*</XStack>*/}
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
                description="Những học sinh đang trò chuyện với nhau trong 1 lớp học tiếng anh"
                context="classroom"
                img={require('@/assets/images/lesson/classroom.webp')}
              />
              <LessonCard
                title="Quán cà phê"
                description="Bạn đang gặp đồng nghiệp mới và trò chuyện với họ trong 1 quán cafe"
                context="coffeeShop"
                img={require('@/assets/images/lesson/coffee-shop.webp')}
              />
              <LessonCard
                title="Buổi cắm trại"
                description="Bạn đang đi du lịch cùng những người bạn mới, trao đổi bằng tiếng anh với họ."
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
  header: {

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
