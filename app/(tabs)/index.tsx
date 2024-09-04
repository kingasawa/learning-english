import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'tamagui';
import * as Speech from 'expo-speech';

export default function App() {

  const speak = () => {
    const thingToSay = 'Hi, How do you do ?';
    Speech.speak(thingToSay, {
      language: 'en-US',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ alignSelf: 'center' }}>version @1.0.1</Text>
      <Text style={{ alignSelf: 'center' }}>@trancatkhanh</Text>
      <Button style={{ marginTop: 15, alignSelf: 'center' }} onPress={() => speak()}>Test sound</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f1f1',
    padding: 8,
  },
});
