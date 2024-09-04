import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import {
  Button,
  Form, H2,
  Input, Separator,
  Spinner,
  styled,
  useTheme,
  Text
} from "tamagui"
import { User } from "@tamagui/lucide-icons"
export interface ErrorType {
  email?: string,
  password?: string,
}

const Login = () => {
  const theme = useTheme();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    } else {
      console.log("Form data:", formData);
      return true;
    }
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      console.log("Form submitted", formData);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const SubmitButton = styled(Button, {
    backgroundColor: theme.primary,
    marginTop: 10,
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

  return (
    <View style={styles.container}>
      <Form
        style={styles.form}
        gap="$2"
        onSubmit={() => handleSubmit() }
        borderRadius="$4"
        backgroundColor="#000000"
        padding="$2"
      >
        <H2 marginBottom={30} alignSelf="center" color={theme.primary}>Sign In</H2>
        <Input
          backgroundColor="white"
          borderColor="#e3e3e3"
          color={theme.primary}
          onChangeText={(value) => handleChange("email", value)}
        />
        <Input
          backgroundColor="white"
          borderColor="#e3e3e3"
          color={theme.primary}
          secureTextEntry={true}
          onChangeText={(value) => handleChange("password", value)}
        />
        <Form.Trigger asChild>
          <SubmitButton>Submit</SubmitButton>
        </Form.Trigger>
      </Form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f3f3f3',
  },
  form: {
    // flex: 1,
    backgroundColor: 'transparent',
    // shadowColor: '#8b8b8b',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
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

export default Login;
