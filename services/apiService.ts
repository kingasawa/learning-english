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

export const sendMessageToBot = async (data: conversationPayload) => {
  try {
    const response = await api.post('/user/talk', { conversation: data.conversation });
    return response.data;
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
    }
  }
};
