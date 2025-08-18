import { authEndpoints } from '@/lib/endpoints';
import { apiClient } from '@/lib/apiClient';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post(authEndpoints.login, { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get(authEndpoints.me);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post(authEndpoints.logout);
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post(authEndpoints.refreshToken);
  return response.data;
};