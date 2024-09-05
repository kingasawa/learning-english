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
}

const Register = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: any, value: any) => {
    console.log('value', value);
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
      console.log("Form data:", formData);
      return true;
    }
  };

  const handleSubmit = async() => {
    setLoading(true);
    if (handleValidation()) {
      try {
        // const response: any = await axios.post('https://simplecode.online/users', formData);
        console.log('formData', formData);
        const response: any = await axios.post('http://localhost:3001/users', formData);
        console.log('Login successful:', response.data);
        await AsyncStorage.setItem('userToken', response.data.user?.token);
        setErrors({});
        router.replace('/')
      } catch (error) {
        setErrors({ error: 'Login failed' });
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const ErrorText = () => {
    console.log('errors', Object.values(errors));
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
                Register
              </Button>
            </Form.Trigger>
            <ErrorText />
          </Form>
          <XStack style={styles.formFooter}>
            <YStack gap="$3" justifyContent="flex-end">
              <Text color="$secondary"><Link href={"/login"}>Already an account? Login now</Link></Text>
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

export default Register;