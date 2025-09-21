import { apiClient } from "@/lib/apiClient";
import { frontendUserEndpoints } from "@/lib/endpoints";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  user: number | unknown;
  message: string;
}

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(frontendUserEndpoints.register, data);
  return response.data;
};
