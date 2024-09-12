import * as React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { H5, XStack, YStack } from "tamagui";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

interface PropsType {
  title: string,
  description: string,
  url: string,
  shadow?: boolean,
}

export default function LessonCard(props: PropsType = {
  title: '',
  description: '',
  url: '',
  shadow: true
}) {
  return (
    <View style={styles.container}>
      <XStack
        alignItems="center"
        gap="$4"
        backgroundColor="#F1F1F1"
        borderRadius="$8"
        paddingHorizontal={30}
        paddingVertical={20}
        shadowColor={'rgb(132,66,185)'}
        shadowOffset={{
          width: 0,
          height: 1
        }}
        shadowOpacity={0.3}
        shadowRadius={3}
      >
        <YStack flex={1}>
          <H5 fontWeight="bold" color="$primary">{ props.title }</H5>
          <Text>
            { props.description }
          </Text>
        </YStack>
        <MaterialIcon name='verified' size={30} color="gray"/>
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
});
