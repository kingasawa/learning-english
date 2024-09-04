import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  Button,
  Form, H2,
  Input, Separator,
  Spinner,
  styled,
  useTheme,
  Text, H5, H6, XStack
} from "tamagui"
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Stack, useRouter} from "expo-router";
import {Search} from "@tamagui/lucide-icons";

export interface ErrorType {
  email?: string,
  password?: string,
}

const Register = () => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFocus = (field: any) => {
    setErrors({
      ...errors,
      [field]: "",
    });
  };


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

    // Add more validation rules as needed

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
        setLoading(false); // Kết thúc trạng thái loading sau khi hoàn thành yêu cầu
      }
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const SubmitButton = styled(Button, {
    backgroundColor: theme.primary,
    marginTop: 10,
    padding: 20,
    pressStyle: {
      backgroundColor: theme.secondary
    }
  })

  const FacebookButton = styled(Button, {
    backgroundColor: theme.primary,
    marginTop: 10,
    pressStyle: {
      backgroundColor: theme.secondary
    }
  })

  const GoogleButton = styled(Button, {
    backgroundColor: theme.primary,
    marginTop: 10,
    pressStyle: {
      backgroundColor: theme.secondary
    }
  })

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <H2 alignSelf="center" marginBottom={30}>Register</H2>
          <Form
            style={styles.form}
            gap="$3"
            onSubmit={() => handleSubmit() }
            borderRadius="$10"
            padding="$5"
            paddingVertical="$6"
          >
            <H6 alignSelf="center" marginBottom={5} color="$primary">Create a new account</H6>
            <Input
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
              size="$5"
              borderRadius={30}
              backgroundColor="white"
              borderColor="#e3e3e3"
              focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
              color={theme.primary}
              placeholder="Confirm your password"
              placeholderTextColor="#bbb"
              secureTextEntry={true}
              blurOnSubmit={false}
              onChangeText={(value) => handleChange("password", value)}
            />
            <Form.Trigger asChild>
              <Button
                marginTop={30}
                backgroundColor="$primary"
                borderRadius={30}
                size="$5"
                icon={loading ? <Spinner /> : null}
                disabled={loading}
              >
                SUBMIT
              </Button>
            </Form.Trigger>
            <ErrorText />
          </Form>
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: '#fff',
    padding: 30
  },
  form: {
    // flex: 1,
    backgroundColor: 'white',
    shadowColor: 'rgba(3,20,40,0.31)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
});

export default Register;
