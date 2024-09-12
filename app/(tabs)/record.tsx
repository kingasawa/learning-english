import { useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
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
import {socket} from "@/socket";
import {Audio, InterruptionModeIOS} from 'expo-av';
import { StatusBar } from 'expo-status-bar'
import * as Speech from 'expo-speech';
import {Recording} from "expo-av/build/Audio/Recording";
import * as Haptics from 'expo-haptics';
import { Mic, MicOff, Volume2, Wifi, WifiOff } from "@tamagui/lucide-icons"
import { AIConfigModal } from "@/components/AIConfigModal"

export default function RecordScreen() {
  interface conversationTypes {
    id: number,
    user: boolean,
    message: string
  }
  const bgImage = require('@/assets/images/bg4.png');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState<Recording>();
  const [conversation, setConversation] = useState<conversationTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function botSpeak (text: string){
    Speech.speak(text, {
      language: 'en-US',
      pitch: 0.8,
      rate: 0.5
    });
  }

  useEffect(() => {
    if (!recording) return;

    recording.setOnRecordingStatusUpdate(async (status) => {
      console.log('Recording status:', status);
      if (status.isDoneRecording) {
        console.log('Recording is done.');
        if (!status.canRecord) {
          console.log('Cannot record further.');
        } else {
          console.log('Ready to record again.');
        }
      }
    });
    return () => {
      recording.setOnRecordingStatusUpdate(null);
    };
  }, [recording]);


  useEffect(() => {
    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server');
    }

    function onDisconnect() {
      setIsConnected(false);
      setLoading(false);
      console.log('Disconnected from server');
    }

    function onSpeech(data: string){
      const newMessage: conversationTypes = {
        id: conversation.length + 1,
        user: true,
        message: data
      }
      setConversation((prevConversation) => [...prevConversation, newMessage]);
    }

    function onBotChat(data: string){
      console.log('Sending text to botSpeak');
      const newMessage: conversationTypes = {
        id: conversation.length + 1,
        user: false,
        message: data
      }
      setConversation((prevConversation) => [...prevConversation, newMessage]);
      botSpeak(data);
      setLoading(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('translate', onSpeech);
    socket.on('bot_chat', onBotChat);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('translate', onSpeech);
      socket.off('bot_chat', onBotChat);
      socket.disconnect(); // Disconnect the socket when component unmounts
    };
  }, []);

  async function startRecording() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      console.log('Requesting permissions..');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access microphone was denied.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      console.log('Starting recording...');
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    console.log('Stopping recording..');
    setLoading(true);
    if (recording) {
      await Audio.setAudioModeAsync(
        {
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        }
      );
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      recording.setOnRecordingStatusUpdate(null);
      setRecording(undefined);
      console.log('Recording stopped and stored at', uri);
      await uploadToGCS(uri);
    }
  }

  const uploadToGCS = async (uri: string | null) => {
    if (uri) {
      try {
        console.log('Now, uploading to backend by call socket...');
        const response = await fetch(uri);
        const blob = await response.blob();
        socket.emit('uploadFile', {
          blob,
        });
        console.log('Waiting for response from server...');
      } catch (error) {
        setLoading(false);
        console.error('Error uploading file:', error);
      }
    }
  };

  const CustomListItem = styled(ListItem, {
    backgroundColor: '$transparent',
  })

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        style={styles.image}
      >
      <AIConfigModal />
        <XStack $sm={{ flexDirection: 'column', marginVertical: 5 }}>
          <YGroup alignSelf="center">
            <YGroup.Item>
              <CustomListItem
                color={isConnected ? 'lightgreen' : 'red'}
                icon={isConnected ? Wifi : WifiOff}
                title={isConnected ? 'CONNECTED TO THE SERVER' : 'DISCONNECTED FROM THE SERVER'}
              />
            </YGroup.Item>
          </YGroup>
        </XStack>
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
          recording || loading
            ? <Button circular backgroundColor="$red" onPress={stopRecording} icon={loading ? <Spinner size="small" /> : MicOff} size="$6" disabled={loading} />
            : <Button circular backgroundColor="$primary" color="white" onPress={startRecording} icon={Mic} size="$6" disabled={!isConnected} />
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
  }
});
