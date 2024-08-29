import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'tamagui';
import * as Speech from 'expo-speech';

export default function App() {

  const speak = () => {
    const thingToSay = 'What are you doing ?';
    Speech.speak(thingToSay, {
      language: 'en-US',
    });
  };

  return (
    <View style={styles.container}>
      <Button>Plain</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
