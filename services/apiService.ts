// services/apiService.js
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosRequestConfig} from "axios/index";

// Khởi tạo Axios instance với cấu hình cơ bản
const axiosConfig: AxiosRequestConfig = {
  // baseURL: 'http://192.168.1.45:3001',  // URL gốc của API
  baseURL: 'https://simplecode.online',  // URL gốc của API
  timeout: 10000,  // Thời gian chờ tối đa là 10 giây
  headers: {
    'Content-Type': 'application/json',  // Định dạng JSON
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

export const getExampleData = async () => {
  try {
    const response = await api.get('/example');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postExampleData = async (data) => {
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

export const userLogin = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    return {
      error: true,
      message: error.message,
    }
  }
};

export const userRegister = async (data) => {
  try {
    const response = await api.post('/user/register', data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const userUpdate = async (data) => {
  try {
    const response = await api.post('/auth/update', data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
