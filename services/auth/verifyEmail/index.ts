import { apiClient } from "@/lib/apiClient";
import { frontendUserEndpoints } from "@/lib/endpoints";

export interface VerifyEmailData {
  email: string;
  verifyCode: string;
}

export interface VerifyEmailResponse {
  message: string;
  user?: {
    userId: number;
    email: string;
    emailVerifyStatus: string;
    userStatus: string;
  };
  newCodeSent?: boolean;
  error?: string;
}

export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<VerifyEmailResponse>(frontendUserEndpoints.verifyEmail, data);
  return response.data;
};
