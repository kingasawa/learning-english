import * as React from 'react';
import { View, StyleSheet, Text, ImageBackground, ScrollView } from "react-native";
import { H3, XStack, YStack, Button } from "tamagui";
import { useRef } from "react";
import {router} from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = async() => {
    await AsyncStorage.setItem('visit', 'true');
    router.push('/learn');
  }

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
          <YStack gap="$2" marginTop={15}>
            <H3 alignSelf="center" color="$primary">Trước khi sử dụng</H3>
            <Text style={{ textAlign: 'center' }}>Một số điều bạn cần biết khi sử dụng Bot Talk</Text>
            <YStack marginTop={15} gap="$2">
              <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                Các tính năng trên thiết bị mà ứng dụng cần truy cập
              </Text>
              <XStack
                alignItems="center"
                gap="$4"
                padding={10}
                shadowColor={'rgb(132,66,185)'}
                shadowOffset={{
                  width: 0,
                  height: 1
                }}
                shadowOpacity={0.3}
                shadowRadius={3}
              >
                <View style={{ backgroundColor: '#ffa31a', padding: 10, borderRadius: 50 }}>
                  <MaterialIcon name='mic' size={20} color="white"/>
                </View>
                <YStack flex={1} gap="$1">
                  <Text style={{ fontSize: 13 }}>
                    Ứng dụng yêu cầu quyền truy cập vào Microphone của thiết bị để cung cấp các tính năng tương tác bằng giọng nói.
                  </Text>
                </YStack>
              </XStack>
              <XStack
                alignItems="center"
                gap="$4"
                padding={10}
                shadowColor={'rgb(132,66,185)'}
                shadowOffset={{
                  width: 0,
                  height: 1
                }}
                shadowOpacity={0.3}
                shadowRadius={3}
              >
                <View style={{ backgroundColor: '#bbb', padding: 10, borderRadius: 50 }}>
                  <MaterialIcon name='graphic-eq' size={20} color="white"/>
                </View>
                <YStack flex={1} gap="$1">
                  <Text style={{ fontSize: 13 }}>
                    Ứng dụng muốn sử dụng tính năng nhận diện giọng nói để nhận diện âm thanh bạn nói ra để tương tác với AI.
                  </Text>
                </YStack>
              </XStack>
              <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                Tính riêng tư và bảo mật
              </Text>
              <XStack
                alignItems="center"
                gap="$4"
                padding={10}
                shadowColor={'rgb(132,66,185)'}
                shadowOffset={{
                  width: 0,
                  height: 1
                }}
                shadowOpacity={0.3}
                shadowRadius={3}
              >
                <View style={{ backgroundColor: '#ff7b7b', padding: 10, borderRadius: 50 }}>
                  <MaterialIcon name='close' size={20} color="white"/>
                </View>
                <YStack flex={1} gap="$1">
                  <Text style={{ fontSize: 13 }}>
                    Chúng tôi không lưu trữ thông tin giọng nói hoặc dữ liệu âm thanh. Tất cả các xử lý liên quan đến âm thanh và giọng nói đều được thực hiện cục bộ.
                  </Text>
                </YStack>
              </XStack>
              <XStack
                alignItems="center"
                gap="$4"
                padding={10}
                shadowColor={'rgb(132,66,185)'}
                shadowOffset={{
                  width: 0,
                  height: 1
                }}
                shadowOpacity={0.3}
                shadowRadius={3}
              >
                <View style={{ backgroundColor: '#ff7b7b', padding: 10, borderRadius: 50 }}>
                  <MaterialIcon name='cloud-off' size={20} color="white"/>
                </View>
                <YStack flex={1} gap="$1">
                  <Text style={{ fontSize: 13 }}>
                    Dữ liệu âm thanh từ "Microphone" và "Nhận diện giọng nói" không chia sẻ với bên thứ 3.
                  </Text>
                </YStack>
              </XStack>
              <Button
                size="$5"
                marginTop={15}
                backgroundColor="$primary"
                onPress={() => handleSubmit()}
              >
                Tôi đã hiểu
              </Button>
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
  scrollView: {
    paddingTop: 10,
    borderRadius: 15,
    marginBottom: 80
  },
});
