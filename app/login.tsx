import { useState } from 'react';
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
  YStack
} from "tamagui"
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { Facebook, AtSign } from "@tamagui/lucide-icons";

interface ErrorType {
  email?: string,
  password?: string,
}

const Login = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
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
      setErrors(newErrors);
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const handleSubmit = async() => {
    setLoading(true);
    if (handleValidation()) {
      try {
        await login();
      } catch (error) {
        setErrors({ error: 'Login failed' });
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const login = async() => {
    const response: any = await axios.post('http://192.168.1.47:3001/auth/login', {
      username: formData.email,
      password: formData.password
    });
    // console.log('Login response:', response.data);
    if (response.data?.error) {
      setErrors({
        error: response.data.message
      });
    } else {
      await AsyncStorage.setItem('userToken', response.data.accessToken);
      setErrors({});
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
      >
        Login with Facebook
      </Button>
    )
  }

  const GoogleButton = () => {
    return (
      <Button
        style={styles.shadow}
        marginTop={30}
        backgroundColor="#df4930"
        borderRadius={30}
        size="$5"
        icon={<AtSign />}
        disabled={loading}
      >
        Login with Google
      </Button>
    )
  }

  const ErrorText = () => {
    return (
      <Text style={{
        color: '#d62121',
        textAlign: 'center',
        marginTop: 5,
        display: Object.keys(errors).length > 0 ? 'block' : 'none'
      }}>
        {Object.values(errors).join('\n')}
      </Text>
    );
  }

  return (
      <ImageBackground
        source={require('@/assets/images/bg.png')}
        style={styles.image}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
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
              <ErrorText />
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
                  <GoogleButton />
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
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    paddingTop: 100,
    alignSelf: 'center',
    backgroundColor: 'none',
  },
  formFooter: {
    flex: 1,
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