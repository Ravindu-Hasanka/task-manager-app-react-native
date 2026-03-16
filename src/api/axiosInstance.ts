import axios from 'axios';

import { normalizeApiError } from './api-error';

export const apiClient = axios.create({
  baseURL: 'https://60a21a08745cd70017576014.mockapi.io/api/v1',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error))
);
