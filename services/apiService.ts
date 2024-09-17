import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosRequestConfig } from "axios";

const axiosConfig: AxiosRequestConfig = {
  baseURL: "https://simplecode.online",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}
const api = axios.create(axiosConfig);

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, logging out...');
    }
    console.log('error.response.data', error.response.data);
    error.response.data.error = true;
    return error.response;
  }
);

interface messagePayload {
  role: string,
  content: string,
}

interface conversationPayload {
  conversation: messagePayload[]
}

interface LoginPayload {
  username: string,
  password: string,
}

interface ResetPasswordPayload {
  email: string,
}

interface RegisterPayload {
  fullName: string,
  password: string,
  email: string,
  pushToken: string,
  notification: boolean
}

interface UpdatePayload {
  fullName?: string,
  password?: string,
  gender?: string,
  birthday?: string
}

interface UpdateNotificationPayload {
  notification: boolean,
  pushToken?: string,
}

export const getExampleData = async () => {
  try {
    const response = await api.get('/example');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postExampleData = async (data: any) => {
  try {
    const response = await api.post('/example', data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const userLogin = async (data: LoginPayload) => {
  try {
    const response = await api.post('/auth/login', data);
    console.log('response.data', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const userRegister = async (data: RegisterPayload) => {
  try {
    const response = await api.post('/user/register', data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const userUpdate = async (data: UpdatePayload) => {
  try {
    const response = await api.post('/auth/update', data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const updateNotification = async (data: UpdateNotificationPayload) => {
  console.log('data', data);
  try {
    const response = await api.post('/auth/notification', data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const userResetPassword = async (data: ResetPasswordPayload) => {
  console.log('data', data);
  try {
    const response = await api.post('/user/reset-password', data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const sendMessageToBot = async (data: conversationPayload) => {
  try {
    const response = await api.post('/user/talk', data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};
