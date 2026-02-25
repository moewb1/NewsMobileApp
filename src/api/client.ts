import axios from "axios";
import {ENV} from '../config/env'

type GNewsErrorPayload = {
  errors?: string [];
};

export const apiClient = axios.create ({
  baseURL: ENV.GNEWS_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status as number | undefined;
    const payload = error?.response?.data as GNewsErrorPayload | undefined;
    const firstApiError = payload?.errors?.[0];

    if (status === 401) {
      return Promise.reject(
        new Error('Unauthorized request. Check your GNEWS_API_KEY in .env'),
      );
    }
    if (status === 429) {
      return Promise.reject(
        new Error('Rate Limit reached. Try again later')
      )
    }
    return Promise.reject (
      new Error (firstApiError || 'Unable to fetch news')
    )
  }
)