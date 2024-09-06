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
  XStack,
  YStack
} from "tamagui"
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";

interface ErrorType {
  email?: string,
  password?: string,
  confirm?: string,
}

const Register = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

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
      setErrors(newErrors);
      return false;
    } else {
      setErrors({});
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
        setErrors({ error: 'Register failed' });
        console.error('Register failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const register = async() => {
    const response: any = await axios.post('http://192.168.1.47:3001/user/register', {
      email: formData.email,
      password: formData.password
    });
    // console.log('Register response:', response.data);
    if (response.data?.error) {
      setErrors({
        error: response.data.message
      });
    } else {
      await AsyncStorage.setItem('userToken', response.data.user?.accessToken);
      setErrors({});
      router.replace('/')
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
            <ErrorText />
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