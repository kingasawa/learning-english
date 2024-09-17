import * as React from 'react';
import { View, StyleSheet, Text, Pressable } from "react-native";
import { H5, XStack, YStack, Image, H6, Button } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from "expo-router";

interface PropsType {
  title: string,
  description: string,
  img?: any,
  context: string
}

export default function LessonCard(props: PropsType = {
  title: '',
  description: '',
  img: undefined,
  context: ''
}) {
  const router = useRouter()
  const handleSelectContext = async(context: string) => {
    await AsyncStorage.setItem('context', context);
    router.replace('/record');
  }

  return (
    <Pressable onPress={() => handleSelectContext(props.context)}>
    <View style={styles.container}>
      <XStack
        alignItems="center"
        gap="$4"
        backgroundColor="#FFF"
        borderRadius="$8"
        padding={10}
        shadowColor={'rgb(132,66,185)'}
        shadowOffset={{
          width: 0,
          height: 1
        }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <Image
          borderRadius={12}
          height={90}
          width={90}
          source={props.img}
        />
        {/*<LinearGradient*/}
        {/*  colors={['rgba(0,0,0,0.8)', 'transparent']}*/}
        {/*  style={styles.background}*/}
        {/*/>*/}
        <YStack flex={1} gap="$1">
          <H6 fontWeight="bold" color="$primary">{ props.title }</H6>
          <Text style={{ fontSize: 12 }}>
            { props.description }
          </Text>
          <Button backgroundColor="$secondary" size="$1">Tham gia</Button>
        </YStack>
        <MaterialIcon name='verified' size={30} color="gray"/>
      </XStack>
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  // background: {
  //   borderRadius: 15,
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   height: 100,
  // },
});
