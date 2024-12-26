import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { ContentType } from '@/lib/enums/http';
import { useToastStore } from '@/lib/models/toast';
import userUtils from '@/lib/models/user';

// Define custom interface for response
export interface CustomResponse<T = unknown> {
  data: T | null;
  status: number;
  message: string;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = '') {
    // Initialize axios instance with default config
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': ContentType.JSON,
      },
    });

    // Add request interceptor
    this.instance.interceptors.request.use((config) => {
      const user = userUtils.getUser();
      if (user) {
        config.headers['x-access-token'] = user.accessToken;
      }
      return config;
    });

    // Add response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        if (response?.data?.accessToken) {
          const user = userUtils?.getUser();
          if (user) {
            user.accessToken = response.data.accessToken;
            userUtils.saveUser(user);
            const { addToast } = useToastStore.getState();
            addToast({
              title: 'Token Refreshed',
              description: 'Token Refreshed',
            });
          }
        }
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Handle unauthorized
              break;
            case 403:
              // Handle forbidden
              break;
            case 404:
              // Handle not found
              break;
            default:
              // Handle other errors
              break;
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<CustomResponse<T>> {
    const response = await this.instance.get<T>(url, config);
    return this.handleResponse(response);
  }

  // POST request
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<CustomResponse<T>> {
    const response = await this.instance.post<T>(url, data, config);
    return this.handleResponse(response);
  }

  // Handle response
  private handleResponse<T>(response: AxiosResponse<T>): CustomResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }
}

const httpClient = new HttpClient();
export default httpClient;
