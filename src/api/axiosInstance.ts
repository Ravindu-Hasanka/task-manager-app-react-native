import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://60a21a08745cd70017576014.mockapi.io/api/v1',
  timeout: 10000,
});
