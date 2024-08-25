import * as React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import * as Speech from 'expo-speech';
import {useEffect, useState} from "react";
import {Voice} from "expo-speech";

export default function App() {
  const [voice, setVoice] = useState([]);
  useEffect(() => {
    listVoices().then();
  }, []);

  const speak = () => {
    const thingToSay = 'What are you doing ?';
    console.log('voice', voice);
    Speech.speak(thingToSay, {
      language: 'en-US',
    });
  };

  const listVoices = async() => {
    let voices = await Speech.getAvailableVoicesAsync().then()
    const voiceList = voices.filter((voice) => {
      return voice.language === 'en-US';
    });
    setVoice(voiceList)
  };

  return (
    <View style={styles.container}>
      {/*<Text>{voice[0]}</Text>*/}
      <Button title="Press to hear some words" onPress={speak} />
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
