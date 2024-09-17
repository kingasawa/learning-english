import { useCallback, useEffect, useRef, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  XStack,
  Avatar,
  YStack,
} from "tamagui";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Mic, MicOff, Volume2 } from "@tamagui/lucide-icons"
import { sendMessageToBot } from "@/services/apiService"
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecordScreen() {
  interface conversationTypes {
    id: number,
    user: boolean,
    message: string
  }
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [conversation, setConversation] = useState<conversationTypes[]>([]);

  const [error, setError] = useState<string>('');
  const [textMessage, setTextMessage] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  function botSpeak (text: string){
    Speech.speak(text, {
      language: 'en-US',
      pitch: 0.8,
      rate: 0.5
    });
  }

  useFocusEffect(
    useCallback(() => {
      startLearning().then()
      return () => {
        stopLearning().then()
      };
    }, [])
  );

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  async function startLearning() {
    const context: string = await AsyncStorage.getItem('context') || '';
    console.log('context', context);
    setContext(context);
  }

  async function stopLearning() {
    const context = await AsyncStorage.removeItem('context');
    console.log('context', context);
    setContext('');
  }

  async function startRecording() {
    setStatus('start recording');
    setRecording(true);
    resetState();
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async function stopRecording() {
    setStatus('stop recording');
    setRecording(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      const newMessage: conversationTypes = {
        id: conversation.length + 1,
        user: true,
        message: textMessage
      }
      setConversation((prevConversation) => [...prevConversation, newMessage]);
      onBotChat(textMessage).then()
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  const onSpeechStart = (e: any) => {
    setStatus('speech start');
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setStatus('speech recognize')
  };

  const onSpeechEnd = (e: any) => {
    setStatus('speech end')
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setStatus('speech error')
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const message = e.value?.length ? e.value.join(' ') : '...';
    setTextMessage(message)
  };

  async function onBotChat(message: string){
    const response = await sendMessageToBot({ message, context }).then()
    const newMessage: conversationTypes = {
      id: conversation.length + 1,
      user: false,
      message: response.message
    }
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    botSpeak(response.message);
  }

  const resetState = () => {
    setError('');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        style={styles.image}
      >
        {
          error && (
            <YStack>
              <Text>status: {status}</Text>
              <Text>error: {error}</Text>
            </YStack>
          )
        }
      <View style={styles.chat_box}>
        <ScrollView
          style={styles.scrollView}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          ref={scrollViewRef}
        >
          { conversation?.length > 0 && conversation.map((data, index) => {
            return (
              <XStack
                key={data.id+index}
                alignItems="center"
                justifyContent={data.user ? 'flex-end' : 'flex-start'}
                marginBottom={10}
              >
                {
                  !data.user && (
                    <>
                      <Avatar circular size="$3" marginRight="$2" marginLeft="$2">
                        <Avatar.Image
                          accessibilityLabel="Cam"
                          src="https://www.buyourobot.com/wp-content/uploads/edd/2021/06/4028_cute_bot_thumb_reflection.jpg"
                        />
                      </Avatar>
                    </>
                  )
                }
                <YStack
                  marginRight="$2"
                  padding="$3"
                  borderRadius="$4"
                  backgroundColor={data.user ? '#ffd18c' : '#eee'}
                  maxWidth="80%"
                >
                  <Text >
                    {data.message}
                  </Text>
                </YStack>
                {
                  !data.user && (
                    <Button
                      unstyled
                      icon={<Volume2 size="$1.5" color="#bbb"/>}
                      onPress={() => botSpeak(data.message)}
                    />
                  )
                }
              </XStack>
            )
          })}
        </ScrollView>
      </View>
      <View style={styles.record}>
        {
          recording
            ? <Button circular backgroundColor="$red" onPress={stopRecording} icon={MicOff} size="$6" />
            : <Button circular backgroundColor="$primary" color="white" onPress={startRecording} icon={Mic} size="$6" />
        }
      </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  chat_box: {
    flex: 1,
    backgroundColor: 'rgba(24,24,24,0.29)',
    borderRadius: 8,
    shadowColor: '#464646',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  record: {
    flex: 1,
    marginTop: 3,
    marginBottom: 75,
    maxHeight: 65,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  scrollView: {
    paddingTop: 10,
    borderRadius: 15,
  }
});
