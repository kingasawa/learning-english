import { useState } from 'react';
import { Check } from '@tamagui/lucide-icons'
import { View, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  Button,
  Form, H2,
  Input,
  Spinner,
  useTheme,
  Text,
  H6, Checkbox, XStack, YStack,
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { userRegister } from "@/services/apiService";
import { AlertToast } from "@/components/AlertToast";
import Toast from "react-native-toast-message";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { TermsOfService } from "@/components/TermsOfService"
import { PrivacyAndPolicy } from "@/components/PrivacyAndPolicy"

interface ErrorType {
  fullName?: string,
  email?: string,
  password?: string,
  confirm?: string,
  privacy?: string,
  term?: string
}

function CheckIcon() {
  return null;
}

const Register = () => {
  const bgImage = require('@/assets/images/bg4.png');
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAcceptTerms, setIsAcceptTerms] = useState(false);
  const [isAcceptPrivacy, setIsAcceptPrivacy] = useState(false);
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
      newErrors.password = "Mật khẩu không được để trống";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Hãy nhập tên của bạn";
    }

    if (formData.password && formData.confirm !== formData.password) {
      console.log('formData.confirm', formData.confirm);
      console.log('formData.password', formData.password);
      newErrors.confirm = "Mật khẩu không khớp";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Không đúng định dạng email";
    }

    if (!isAcceptTerms) {
      newErrors.term = "Bạn phải đồng ý các điều khoản dịch vụ"
    }

    if (!isAcceptPrivacy) {
      newErrors.privacy = "Bạn phải đồng ý các chính sách và quyền riêng tư"
    }

    if (Object.keys(newErrors).length > 0) {
      showToast('error', 'Lỗi', Object.values(newErrors)[0])
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
        showToast('error', 'Lỗi', 'Đăng ký thất bại')
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
    const response: any = await userRegister({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      pushToken: token,
      notification: token.length > 0
    });
    if (response?.error) {
      showToast('error', 'Lỗi', response.message);
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
            gap="$2"
            onSubmit={() => handleSubmit() }
          >
            <H2 style={styles.shadow} color="$primary" alignSelf="center" marginBottom={20}>Đăng ký</H2>
            <H6 alignSelf="center" marginBottom={5} color="$primary">Tạo một tài khoản</H6>
            <Input
              style={styles.shadow}
              size="$5"
              borderRadius={30}
              backgroundColor="white"
              borderColor="#e3e3e3"
              focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
              color={theme.primary}
              placeholder="Nhập vào tên của bạn"
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
            <Input
              style={styles.shadow}
              size="$5"
              borderRadius={30}
              backgroundColor="white"
              borderColor="#e3e3e3"
              focusStyle={{ borderColor: '$primary', borderWidth: 2 }}
              color={theme.primary}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor="#bbb"
              secureTextEntry={true}
              onChangeText={(value) => handleChange("confirm", value)}
            />
            <YStack gap="$2">
              <Text fontWeight="bold" marginTop={5}>Tôi đồng ý với:</Text>
              <XStack marginLeft={10} alignItems="center" gap="$2">
                <Checkbox
                  backgroundColor="white"
                  borderColor="gray"
                  pressStyle={{
                    backgroundColor: 'white'
                  }}
                  size="$5"
                  checked={isAcceptTerms}
                  onCheckedChange={() => setIsAcceptTerms(!isAcceptTerms)}
                >
                  {
                    isAcceptTerms ? <Check size={15} color="$primary"/> : <CheckIcon />
                  }
                </Checkbox>
                <TermsOfService />
              </XStack>
              <XStack marginLeft={10} marginTop={-20} alignItems="center" gap="$2">
                <Checkbox
                  backgroundColor="white"
                  borderColor="gray"
                  pressStyle={{
                    backgroundColor: 'white'
                  }}
                  size="$5"
                  checked={isAcceptPrivacy}
                  onCheckedChange={() => setIsAcceptPrivacy(!isAcceptPrivacy)}
                >
                  {
                    isAcceptPrivacy ? <Check size={15} color="$primary"/> : <CheckIcon />
                  }
                </Checkbox>
                <PrivacyAndPolicy />
              </XStack>
            </YStack>
            <Form.Trigger asChild>
              <Button
                style={styles.shadow}
                marginTop={10}
                backgroundColor="$primary"
                borderRadius={30}
                size="$5"
                icon={loading ? <Spinner /> : null}
                disabled={loading}
                disabledStyle={{ backgroundColor: 'gray' }}
              >
                Đăng ký
              </Button>
            </Form.Trigger>
          </Form>
          <View style={{ alignSelf: 'center', marginBottom: 50 }}>
            <Text marginTop={20} marginBottom={10} color="$secondary"><Link href={"/login"}>Bạn đã có tài khoản? Đăng nhập</Link></Text>
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
    paddingTop: 80,
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
