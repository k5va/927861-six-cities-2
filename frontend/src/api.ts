import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { errorHandle, Token } from './utils';

const BACKEND_URL = 'http://localhost:4000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['Authorization'] = token;
      }

      return config;
    }
  );

  api.interceptors.response.use((response) => response, (error: AxiosError) => {
    toast.dismiss();
    errorHandle(error);
    return Promise.reject(error);
  }
  );

  return api;
};
