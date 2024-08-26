import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Button} from '@rneui/themed';
import {socket} from "@/socket";
import {Audio, InterruptionModeIOS} from 'expo-av';
import * as Speech from 'expo-speech';
import { Badge, Chip, Icon } from "@rneui/base";
import {Recording} from "expo-av/build/Audio/Recording";
import * as Haptics from 'expo-haptics';

export default function RecordScreen() {
  interface conversationTypes {
    id: number,
    user: boolean,
    message: string
  }

  const [isConnected, setIsConnected] = useState(false);
  const [recording, setRecording] = useState<Recording>();
  const [conversation, setConversation] = useState<conversationTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
    }

    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server');
    }

    function onDisconnect() {
      setIsConnected(false);
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

    function botSpeak (text: string){
      Speech.speak(text, {
        language: 'en-US',
      });
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
        console.log('Permission to access microphone was denied');
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
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.socket_status}>
        <Badge status={ isConnected ? 'success' : 'error' } />
        <Text style={{ marginLeft: 5, color: isConnected ? 'green' : 'red' }}>{ isConnected ? 'CONNECTED' : 'DISCONNECTED' }</Text>
      </View>
      <View style={styles.chat_box}>
        { conversation?.length > 0 && conversation.map((data, index) => {
          return data.user
            ? <Chip key={data.id+index} color="green" title={ data.message } containerStyle={{ marginVertical: 1, alignSelf: 'flex-end', maxWidth: '90%' }} />
            : <Chip key={data.id+index} color="gray" title={ data.message } containerStyle={{ marginVertical: 1, alignSelf: 'flex-start', maxWidth: '90%' }} />
        })}
      </View>
      <View style={styles.record}>
        {
          recording || loading
            ? <Button type="clear" loading={loading} onPress={stopRecording}>
              <Icon reverse name="mic-off" color="red" />
            </Button>
            : <Button type="clear" onPress={startRecording}>
              <Icon reverse name="mic" color="green" />
            </Button>
        }
      </View>
    </View>
  );
}
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f0f1f1',
    padding: 10,
  },
  chat_box: {
    padding: 15,
    height: screenHeight - 300,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  socket_status: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  record: {},
});
