import { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  Button,
  Form, H2,
  Input,
  Spinner,
  useTheme,
  Text,
  H6,
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { userRegister } from "@/services/apiService";
import { AlertToast } from "@/components/AlertToast";
import Toast from "react-native-toast-message";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";

interface ErrorType {
  fullName?: string,
  email?: string,
  password?: string,
  confirm?: string,
}

const bgImage = require('@/assets/images/bg4.png');

const Register = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [pushToken, setPushToken] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    pushToken: ""
  });

  const handleAddNotifications = async () => {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      return (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } else {
      return ""
    }
  };

  const handleChange = (field: any, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleValidation = () => {
    Keyboard.dismiss;
    const newErrors: ErrorType = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.fullName) {
      newErrors.fullName = "FullName is required";
    }

    if (formData.password && formData.confirm !== formData.password) {
      console.log('formData.confirm', formData.confirm);
      console.log('formData.password', formData.password);
      newErrors.confirm = "Password not matching";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Error', Object.values(newErrors).join(', '))
      return false;
    } else {
      console.log("Form data:", formData);
      return true;
    }
  };

  const handleSubmit = async() => {
    setLoading(true);
    if (handleValidation()) {
      try {
        await register()
      } catch (error) {
        showToast('error', 'Error', 'Register failed')
        console.error('Register failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const register = async() => {
    const token = await handleAddNotifications();
    console.log('token', token);
    const response: any = await userRegister({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      pushToken: token,
      notification: token.length > 0
    });
    if (response?.error) {
      showToast('error', 'Error', response.message);
    } else {
      await AsyncStorage.setItem('userToken', response.user?.accessToken);
      router.replace('/')
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showToast = (type: string, message: string, description: string) => {
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
            <H2 style={styles.shadow} color="$primary" alignSelf="center" marginBottom={30}>Member Register</H2>
            <H6 alignSelf="center" marginBottom={5} color="$primary">Create a new account</H6>
            <Input
              style={styles.shadow}
              size="$5"
              borderRadius={30}
              backgroundColor="white"
              borderColor="#e3e3e3"
              focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
              color={theme.primary}
              placeholder="Enter your full name"
              placeholderTextColor="#bbb"
              textContentType="emailAddress"
              onChangeText={(value) => handleChange("fullName", value)}
            />
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
            <Input
              style={styles.shadow}
              size="$5"
              borderRadius={30}
              backgroundColor="white"
              borderColor="#e3e3e3"
              focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
              color={theme.primary}
              placeholder="Confirm your password"
              placeholderTextColor="#bbb"
              secureTextEntry={true}
              onChangeText={(value) => handleChange("confirm", value)}
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
                disabledStyle={{ backgroundColor: 'gray' }}
              >
                Register
              </Button>
            </Form.Trigger>
          </Form>
          <View style={{ flex: 1, alignSelf: 'center', marginBottom: 50 }}>
            <Text marginTop={20} marginBottom={10} color="$secondary"><Link href={"/login"}>Already an account? Login now</Link></Text>
          </View>
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
    paddingTop: 50,
    paddingBottom: 10,
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

export default Register;
