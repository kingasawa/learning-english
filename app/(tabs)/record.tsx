import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import {
  Button,
  XStack,
  YGroup,
  ListItem,
  styled,
  Avatar,
  YStack,
  Spinner,
} from "tamagui";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Mic, MicOff, Volume2, Wifi, WifiOff } from "@tamagui/lucide-icons"
import { AIConfigModal } from "@/components/AIConfigModal"
import { sendMessageToBot } from "@/services/apiService"

export default function RecordScreen() {
  interface conversationTypes {
    id: number,
    user: boolean,
    message: string
  }
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [conversation, setConversation] = useState<conversationTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState('');
  const [status, setStatus] = useState<string>('');
  const [results, setResults] = useState<string>('');

  function botSpeak (text: string){
    Speech.speak(text, {
      language: 'en-US',
      pitch: 0.8,
      rate: 0.5
    });
  }

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

  async function startRecording() {
    resetState();
    try {
      // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async function stopRecording() {
    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  const onSpeechStart = (e: any) => {
    setStatus('speech start');
    setRecording(true);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setStatus('speech recognize')
  };

  const onSpeechEnd = (e: any) => {
    setStatus('speech end')
    setRecording(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setStatus('speech error')
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const message = e.value?.length ? e.value.join(' ') : '...';
    const newMessage: conversationTypes = {
      id: conversation.length + 1,
      user: true,
      message
    }
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    onBotChat(message, e.value || []).then()
  };

  async function onBotChat(message: string, messages: string[]){
    const response = await sendMessageToBot({ message, messages }).then()
    const newMessage: conversationTypes = {
      id: conversation.length + 1,
      user: false,
      message: response.message
    }
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    botSpeak(response.message);
    setLoading(false);
  }

  const resetState = () => {
    setError('');
    setResults('');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        style={styles.image}
      >
      <AIConfigModal />
      <Text>status: {status}</Text>
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
        <TouchableHighlight onPress={startRecording}>
          <Text style={styles.action}>Start Recognizing</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={startRecording}>
          <Text style={styles.action}>Stop Recognizing</Text>
        </TouchableHighlight>
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
  socket_status: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
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
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
});
