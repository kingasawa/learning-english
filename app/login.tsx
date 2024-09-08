import React, { useState } from 'react';
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
  YStack,
} from "tamagui";
import Toast, { ErrorToast } from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { Facebook, AtSign } from "@tamagui/lucide-icons";
import { userLogin } from '../services/apiService';
import { AlertToast } from "@/components/AlertToast";

interface ErrorType {
  email?: string,
  password?: string,
}

const bgImage = require('@/assets/images/bg4.png');
const Login = () => {
  const theme = useTheme();
  const router = useRouter();
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
      newErrors.password = "Password is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setLoading(false);
    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Error', Object.values(newErrors).join(', '))
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
        showToast('error', 'Error', 'Login Failed')
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
      showToast('error', 'Error', response.message);
    } else {
      await AsyncStorage.setItem('userToken', response.accessToken);
      setLoading(false)
      router.replace('/')
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const FacebookButton = () => {
    return (
      <Button
        style={styles.shadow}
        marginTop={30}
        backgroundColor="#4267B2"
        borderRadius={30}
        size="$5"
        icon={<Facebook />}
        disabled={loading}
        onPress={() => showToast('info', 'Info', 'Feature is not ready')}
      >
        Login with Facebook
      </Button>
    )
  }

  const showToast = (type, message, description) => {
    Toast.show({
      type: type,
      text1: message,
      text2: description
    });
  }

  return (
      <ImageBackground
        source={bgImage}
        style={styles.image}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <AlertToast />
            <Form
              style={styles.form}
              gap="$4"
              onSubmit={() => handleSubmit() }
            >
              <H2 style={styles.shadow} color="$primary" alignSelf="center" marginBottom={30}>Member Login</H2>
              <H6 alignSelf="center" marginBottom={5} color="$primary">Login to continue</H6>
              <Input
                style={styles.shadow}
                size="$5"
                borderRadius={30}
                backgroundColor="white"
                borderColor="#e3e3e3"
                focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
                color={theme.primary}
                placeholder="Enter your email address"
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
                placeholder="Enter your password"
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
                  Login
                </Button>
              </Form.Trigger>
            </Form>
            <XStack style={styles.formFooter}>
              <YStack gap="$6" justifyContent="center">
                <YStack gap="$3" alignItems="center">
                  <Text color="$secondary"><Link href={"/register"}>Forgot your password?</Link></Text>
                  <Text color="$secondary"><Link href={"/register"}>Don't have an account?</Link></Text>
                </YStack>
                <YStack>
                  <Text color="$secondary" alignSelf="center">Or</Text>
                  <FacebookButton />
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
  formFooter: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 60,
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
