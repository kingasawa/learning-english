import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  Button,
  Form,
  H2,
  Input,
  Spinner,
  useTheme,
  Text,
  H6,
  XStack,
  YStack, AlertDialog,
} from "tamagui";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { userLogin, userResetPassword } from "@/services/apiService";
import { AlertToast } from "@/components/AlertToast";

interface ErrorType {
  email?: string,
  password?: string,
}

const Login = () => {
  const bgImage = require('@/assets/images/bg4.png');
  const theme = useTheme();
  const router = useRouter();
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [emailReset, setEmailReset] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleValidation = () => {
    const newErrors: ErrorType = {};

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    }

    setLoading(false);
    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Lỗi', Object.values(newErrors).join(', '))
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async() => {
    setLoading(true);
    if (handleValidation()) {
      try {
        await login();
      } catch (error) {
        showToast('error', 'Lỗi', 'Đăng nhập thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const login = async() => {
    setLoading(true);
    const response: any = await userLogin({
      username: formData.email,
      password: formData.password
    });
    if (response?.error) {
      showToast('error', 'Lỗi', response.message);
    } else {
      await AsyncStorage.setItem('userToken', response.accessToken);
      setLoading(false)
      router.replace('/')
    }
  };

  const showToast = (type: string, message: string, description: string) => {
    Toast.show({
      type: type,
      text1: message,
      text2: description
    });
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleReset = async() => {
    if (emailReset && validateEmail(emailReset)) {
      setLoading(true);
      const response: any = await userResetPassword({
        email: emailReset,
      });
      if (response?.error) {
        setResetError(response.message);
      } else {
        setResetForm(false)
      }
      setLoading(false);
      showToast('success', 'Thành công', 'Mật khẩu mới đã được gửi đến email')
    } else {
      setResetError('Hãy nhập vào email của bạn');
    }
  }

  const ResetPassword = () => {
    return (
      <AlertDialog open={resetForm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={1}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            margin={15}
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
            y={-100}
          >
            <YStack gap="$4">
              <AlertDialog.Title color="$yellow">Cấp lại mật khẩu</AlertDialog.Title>
              <AlertDialog.Description>
                Một mật khẩu mới sẽ được gửi đến email đăng nhập của bạn.
              </AlertDialog.Description>
              <Input
                style={styles.shadow}
                size="$5"
                borderRadius={10}
                backgroundColor="white"
                borderColor="#e3e3e3"
                focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
                color={theme.primary}
                placeholder="Nhập địa chỉ email"
                placeholderTextColor="#bbb"
                textContentType="emailAddress"
                onChangeText={(value) => setEmailReset(value)}
              />
              <Text color="$yellow" marginBottom={15}>{resetError}</Text>
              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button backgroundColor="gray" onPress={() => setResetForm(false)}>Đóng</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button disabled={!emailReset} backgroundColor="$yellow" onPress={() => handleReset()}>
                    Gửi đi
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
        style={styles.image}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <ResetPassword />
            <AlertToast />
            <Form
              style={styles.form}
              gap="$2"
              onSubmit={() => handleSubmit() }
            >
              <H2 style={styles.shadow} color="$primary" alignSelf="center" marginBottom={20}>Đăng nhập</H2>
              <H6 alignSelf="center" marginBottom={5} color="$primary">Đăng nhập để sử dụng</H6>
              <Input
                style={styles.shadow}
                size="$5"
                borderRadius={30}
                backgroundColor="white"
                borderColor="#e3e3e3"
                focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
                color={theme.primary}
                placeholder="Nhập địa chỉ email"
                placeholderTextColor="#bbb"
                textContentType="emailAddress"
                onChangeText={(value) => handleChange("email", value)}
              />
              <Input
                style={styles.shadow}
                size="$5"
                borderRadius={30}
                backgroundColor="white"
                borderColor="#e3e3e3"
                focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
                color={theme.primary}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#bbb"
                secureTextEntry={true}
                onChangeText={(value) => handleChange("password", value)}
              />
              <Form.Trigger asChild>
                <Button
                  style={styles.shadow}
                  marginTop={30}
                  backgroundColor="$primary"
                  borderRadius={30}
                  size="$5"
                  icon={loading ? <Spinner /> : null}
                  disabled={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Trigger>
            </Form>
            <XStack justifyContent="center">
              <YStack gap="$6" justifyContent="center">
                <YStack gap="$3" alignItems="center">
                  <Text color="$secondary" onPress={() => setResetForm(true)}>Bạn quên mật khẩu?</Text>
                  <Text color="$secondary"><Link href={"/register"}>Bạn chưa có tài khoản?</Link></Text>
                </YStack>
              </YStack>
            </XStack>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 50
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: 'none',
  },
  shadow: {
    shadowColor: 'rgb(135,184,199)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
});

export default Login;
