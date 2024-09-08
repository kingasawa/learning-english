import * as React from 'react';
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  Text,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import {
  AlertDialog,
  Button,
  H3,
  Input,
  Label,
  ListItem,
  Spinner,
  XStack,
  YGroup,
  YStack,
  RadioGroup, Form,
} from 'tamagui';
import {
  Blend,
  CalendarDays,
  LogOut,
  Mail,
  FilePen
} from '@tamagui/lucide-icons'
import moment from "moment";
import { useEffect, useState } from "react";
import { getProfile, userUpdate } from '../../services/apiService';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AlertToast} from "@/components/AlertToast";
import Toast from "react-native-toast-message";

export default function AccountScreen() {
  const router = useRouter();
  const [account, setAccount] = useState<any>({});
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    birthday: '',
    gender: '',
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('aaaa');
  //     getUserInfo().then();
  //   }, [])
  // );

  const bgImage = require('@/assets/images/bg4.png');
  useEffect(() => {
    getUserInfo().then();
  }, []);

  const handleChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleOptionItemChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const updateUserInfo = async() => {
    console.log('formData', formData);
    if (handleValidate()) {
      setLoading(true);
      const response: any = await userUpdate(formData);
      console.log('updateUserInfo', response);
      if (response?.error) {
        showToast('error', 'Error', response.message);
        console.log('heeeeee');
      } else {
        getUserInfo().then();
        showToast('success', 'Updated', 'Your personal info was updated successfully');
      }
      setOpen(false);
      setLoading(false)
    }
  }

  const getUserInfo = async() => {
    const userInfo = await getProfile();
    const dataInfo = {
      fullName: userInfo.fullName,
      birthday: userInfo.birthday,
      email: userInfo.email,
      gender: userInfo.gender || 'Male',
    }
    setAccount(dataInfo);
    setFormData(dataInfo);
    setLoadingScreen(false);
  }

  const handleLogOut = async() => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login')
  }
  const handleValidate = () => {
    const isValidDate = moment(formData.birthday, 'DD/MM/YYYY', true).isValid();
    console.log('isValidDate', isValidDate);
    if (!isValidDate) {
      setOpen(false);
      showToast('error', 'Error', 'Invalid date format (DD/MM/YYYY)');
    }
    return isValidDate;
  }

  if (loadingScreen) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Fetching account data...</Text>
      </View>
    );
  }

  const Dialog = () => {
    return (
      <AlertDialog open={open}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay
              key="overlay"
              animation="quick"
              opacity={1}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <AlertDialog.Content
              backgroundColor="rgba(0,0,0,0.60)"
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
              enterStyle={{ x: 0, y: -10, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              x={0}
              scale={1}
              opacity={1}
              y={-100}
            >
              <YStack gap="$2">
                <AlertDialog.Title color="$yellow">Edit Info</AlertDialog.Title>
                <AlertDialog.Description color="$yellow">
                  Please correct your information.
                </AlertDialog.Description>
                <Form
                  // style={styles.form}
                  gap="$4"
                  // onSubmit={() => handleSubmit() }
                >
                  <YStack padding="$3" minWidth={300} gap="$2">
                    <XStack alignItems="center" space="$4">
                      <Label width={60} htmlFor="fullName">
                        Name
                      </Label>
                      <Input
                        backgroundColor="white"
                        color="$primary"
                        flex={1}
                        id="fullName"
                        defaultValue={account.fullName}
                        onChangeText={(value) => handleChange("fullName", value)}
                      />
                    </XStack>
                    <XStack alignItems="center" space="$4">
                      <Label width={60} htmlFor="birthday">
                        Birthday
                      </Label>
                      <Input
                        backgroundColor="white"
                        color="$primary" flex={1}
                        id="birthday"
                        defaultValue={account.birthday}
                        onChangeText={(value) => handleChange("birthday", value)}
                      />
                    </XStack>
                    <XStack alignItems="center" space="$4">
                      <Label width={65} htmlFor="birthday">
                        Gender
                      </Label>
                      <RadioGroup
                        aria-labelledby="Select one item"
                        defaultValue={account.gender || 'Male'}
                        name="form"
                        onValueChange={handleOptionItemChange}
                      >
                        <XStack gap="$4">
                          <XStack alignItems="center" gap="$2">
                            <RadioGroup.Item value="Male" id="radiogroup-male">
                              <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor="radiogroup-male">
                              Male
                            </Label>
                          </XStack>
                          <XStack alignItems="center" gap="$2">
                            <RadioGroup.Item value="Female" id="radiogroup-female">
                              <RadioGroup.Indicator />
                            </RadioGroup.Item>
                            <Label htmlFor="radiogroup-female">
                              Female
                            </Label>
                          </XStack>
                        </XStack>
                      </RadioGroup>
                    </XStack>
                  </YStack>
                </Form>
                <XStack gap="$3" justifyContent="flex-end">
                  <AlertDialog.Cancel asChild>
                    <Button backgroundColor="gray" onPress={() => setOpen(false)}>Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button
                      backgroundColor="$yellow"
                      onPress={() => updateUserInfo()}
                      icon={loading ? <Spinner /> : null}
                    >
                      Update
                    </Button>
                  </AlertDialog.Action>
                </XStack>
              </YStack>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </TouchableWithoutFeedback>
      </AlertDialog>
    )
  }

  const showToast = (type, message, description) => {
    Toast.show({
      type: type,
      text1: message,
      text2: description
    });
  }

  const LogoutConfirm = () => {
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
              <AlertDialog.Title color="$red">Logout</AlertDialog.Title>
              <AlertDialog.Description>
                Do you really want to logout? Please confirm.
              </AlertDialog.Description>
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button backgroundColor="gray" onPress={() => setOpenConfirm(false)}>Close</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button backgroundColor="$red" onPress={() => handleLogOut()}>
                    Logout
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
    <ImageBackground
      source={bgImage}
      style={styles.imageBackground}
    >
      <AlertToast />
      <XStack flex={1} justifyContent="center">
        <YStack gap="$6">
          <Dialog />
          <LogoutConfirm />
          <YStack alignSelf="center">
            <Image
              source={require('@/assets/images/account-circle.png')}
              style={styles.image}
            />
            <H3 color="$primary" alignSelf="center">{account.fullName}</H3>
          </YStack>
          <XStack $sm={{ flexDirection: 'column' }} style={styles.shadow}>
            <YGroup alignSelf="center" width={320} size="$5" space={0.3}>
              <YGroup.Item>
                <ListItem
                  backgroundColor="$transparent"
                  title={account.email}
                  subTitle="Email"
                  icon={Mail}
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  backgroundColor="$transparent"
                  title={account.gender || 'No data'}
                  subTitle="Gender"
                  icon={Blend}
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  backgroundColor="$transparent"
                  title={account.birthday || 'No data'}
                  subTitle="Age"
                  icon={CalendarDays}
                />
              </YGroup.Item>
            </YGroup>
          </XStack>
          <YStack gap="$2">
            <Button
              backgroundColor="$secondary"
              icon={<FilePen />}
              onPress={() => setOpen(true)}
            >
              Edit
            </Button>
            <Button
              backgroundColor="$red"
              icon={<LogOut />}
              onPress={() => setOpenConfirm(true)}
            >
              Logout
            </Button>
          </YStack>
        </YStack>
      </XStack>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    marginTop: 80,
    width: 150,
    height: 150
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: 'rgb(242,200,255)',
  },
});
