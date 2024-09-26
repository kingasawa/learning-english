import { useCallback, useEffect, useRef, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View, Linking } from "react-native";
import {
  Button,
  XStack,
  Avatar,
  YStack, AlertDialog,
} from "tamagui";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { Mic, MicOff, Volume2, X, Info } from "@tamagui/lucide-icons"
import { sendMessageToBot } from "@/services/apiService"
import { router, useFocusEffect } from "expo-router";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context } from "@/constants/Context";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import * as React from "react";
import {MaterialIcons} from "@expo/vector-icons";

export default function RecordScreen() {
  interface conversationTypes {
    role: string,
    content: string
  }
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [microphonePermission, setMicrophonePermission] = useState<boolean>(false);
  const [speechPermission, setSpeechPermission] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean>(false);
  const [conversation, setConversation] = useState<conversationTypes[]>([]);
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  const [error, setError] = useState<string>('');
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [helpMessage, setHelpMessage] = useState<string>('Nhấn vào Mic để nói');

  function botSpeak (text: string){
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1,
      rate: 0.8
    });
  }

  useFocusEffect(
    useCallback(() => {
      checkPermission().then();
      startLearning().then();
      return () => {
        stopLearning().then()
      };
    }, [])
  );

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).then();
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  async function checkPermission() {
    // const voiceAvailable = await Voice.isAvailable();
    const microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
    const speechStatus = await check(PERMISSIONS.IOS.SPEECH_RECOGNITION);
    setMicrophonePermission(microphoneStatus === RESULTS.GRANTED)
    setSpeechPermission(speechStatus === RESULTS.GRANTED)
    setPermission(microphonePermission && speechPermission);
  }

  async function startLearning() {
    const context: string = await AsyncStorage.getItem('context') || '';
    let content;
    switch (context) {
      case 'classroom':
        content = Context.classroom.content;
        break;
      case 'travel':
        content = Context.travel.content;
        break;
      case 'coffeeShop':
        content = Context.coffeeShop.content;
        break;
      default:
        content = await AsyncStorage.getItem('content') || '';
        break;
    }
    const contextMessage: conversationTypes = {
      role: 'system',
      content
    };

    const newUserMessage: conversationTypes = {
      role: 'user',
      content: Context.begin.content
    };

    const updatedConversation = [
      ...conversation,
      contextMessage,
      newUserMessage
    ]
    setConversation(updatedConversation);
    onBotChat(updatedConversation).then()
  }

  async function stopLearning() {
    await AsyncStorage.removeItem('context');
    setConversation([]);
  }

  async function startRecording() {
    setStatus('start recording');
    setHelpMessage('Nhấn lần nữa để dừng');
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
    setHelpMessage('Nhấn dấu X để thoát')
    setRecording(false);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      const newMessage: conversationTypes = {
        role: 'user',
        content: textMessage
      }
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation, newMessage];
        onBotChat(updatedConversation).then();
        return updatedConversation;
      });
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

  const onSpeechError = async(e: SpeechErrorEvent) => {
    await Voice.stop();
    setRecording(false);
    if (e.error?.code !== 'recognition_fail') {
      setStatus('recognition_fail')
      setError(JSON.stringify(e.error));
    } else {
      setOpenHelp(true);
      setStatus(e.error?.code || '')
      setError(JSON.stringify(e.error));
    }
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    const message = e.value?.length ? e.value.join(' ') : '...';
    if (message) {
      setTextMessage(message)
    }
  };

  async function onBotChat(conversation: conversationTypes[]){
    const response = await sendMessageToBot({ conversation }).then()
    const newMessage: conversationTypes = {
      role: 'assistant',
      content: response.message
    }
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    botSpeak(response.message);
  }

  const resetState = () => {
    setError('');
  };

  const handleQuit = async() => {
    router.replace('/')
  }

  const HelpDialog = () => {
    return (
      <AlertDialog open={openHelp}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={1}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            backgroundColor="rgba(0,0,0,0.70)"
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap="$4">
              <AlertDialog.Title color="$yellow">Hướng dẫn</AlertDialog.Title>
              <AlertDialog.Description>
                <Text style={{ color: '#ccc' }}>Để sử dụng vui lòng bật Microphone và Speech Recognition</Text>
              </AlertDialog.Description>
              <YStack>
                <XStack gap="$4" alignItems="center">
                  <Button
                    paddingHorizontal={5}
                    marginBottom={15}
                    size="$1"
                    backgroundColor="$yellow"
                    onPress={() => Linking.openSettings()}
                    icon={<MaterialIcons name="settings" size={10} />}
                  >
                    <Text style={{ fontSize: 8, color: 'white' }}>Cài đặt</Text>
                  </Button>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <Button
                    size="$1"
                    circular
                    backgroundColor="$yellow"
                    icon={<MaterialIcons name="mic" size={15} />}
                  />
                  <Text style={{ color: 'white', width: 145 }}>Microphone</Text>
                  <MaterialIcons name="toggle-on" color="green" size={40}/>
                </XStack>
                <XStack gap="$4" alignItems="center">
                  <Button
                    size="$1"
                    circular
                    backgroundColor="gray"
                    icon={<MaterialIcons name="graphic-eq" size={15} />}
                  />
                  <Text style={{ color: 'white', width: 145 }}>Speech Recognition</Text>
                  <MaterialIcons name="toggle-on" color="green" size={40}/>
                </XStack>
              </YStack>
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button backgroundColor="gray" onPress={() => setOpenHelp(false)}>Đã hiểu</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    backgroundColor="$yellow"
                    onPress={() => Linking.openSettings()}
                    icon={<MaterialIcons name="settings" size={20} />}
                  >
                    Cài đặt
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    )
  }

  const QuitConfirmModal = () => {
    return (
      <AlertDialog open={openConfirm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={1}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            backgroundColor="rgba(0,0,0,0.70)"
            marginHorizontal={30}
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap="$6">
              <AlertDialog.Title color="$red">Thoát</AlertDialog.Title>
              <AlertDialog.Description>
                Bạn có chắc là muốn rời khỏi cuộc trò chuyện này không?
              </AlertDialog.Description>
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button backgroundColor="gray" onPress={() => setOpenConfirm(false)}>Không</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button backgroundColor="$red" onPress={() => handleQuit()}>
                    Rời khỏi
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    )
  }

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
        <QuitConfirmModal />
        <HelpDialog />
        <View style={styles.help}>
          <XStack justifyContent="space-between">
            <Button
              unstyled
              circular
              backgroundColor="transparent"
              borderWidth={0}
              icon={<X size="$1" color="$red"/>}
              onPress={() => setOpenConfirm(true)}
            />
            <Text style={{ color: '$primary', fontSize: 12 }}>{ helpMessage }</Text>
            <Button
              unstyled
              circular
              backgroundColor="transparent"
              borderWidth={0}
              icon={<Info size="$1" color="$yellow"/>}
              onPress={() => console.log('info')}
            />
          </XStack>
        </View>
        <View style={styles.chat_box}>
          <ScrollView
            style={styles.scrollView}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            ref={scrollViewRef}
          >
            { conversation?.length > 0 && conversation.slice(2).map((data, index) => {
              return (
                <XStack
                  key={index}
                  alignItems="center"
                  justifyContent={data.role === 'user' ? 'flex-end' : 'flex-start'}
                  marginBottom={10}
                >
                  {
                    data.role === 'assistant' && (
                      <>
                        <Avatar circular size="$3" marginRight="$2" marginLeft="$2">
                          <Avatar.Image
                            accessibilityLabel="Cam"
                            source={require('@/assets/images/avatar-bot.jpg')}
                          />
                        </Avatar>
                      </>
                    )
                  }
                  <YStack
                    marginRight="$2"
                    padding="$3"
                    borderRadius="$4"
                    backgroundColor={data.role === 'user' ? '#ffd18c' : '#eee'}
                    maxWidth="80%"
                  >
                    <Text >
                      {data.content}
                    </Text>
                  </YStack>
                  {
                    data.role === 'assistant' && (
                      <Button
                        unstyled
                        icon={<Volume2 size="$1.5" color="#bbb"/>}
                        onPress={() => botSpeak(data.content)}
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
  },
  image: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  help: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(205,205,205,0.30)'
  },
  chat_box: {
    flex: 1,
  },
  record: {
    flex: 1,
    marginTop: 3,
    marginBottom: 35,
    maxHeight: 65,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  scrollView: {
    paddingTop: 10,
    borderRadius: 15,
  }
});
