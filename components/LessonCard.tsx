import * as React from 'react';
import { View, StyleSheet, Text, Pressable } from "react-native";
import { XStack, YStack, Image, H6, Button, H5 } from "tamagui";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

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
        <YStack flex={1} gap="$1">
          <H5 fontWeight="bold" color="$primary">{ props.title }</H5>
          <Text style={{ fontSize: 13 }}>
            { props.description }
          </Text>
        </YStack>
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
});
