"use server"

import { apiClient } from '@/lib/apiClient'
import { authEndpoints } from '@/lib/endpoints'

export const checkEmail = async (email: string) => {
  const response = await apiClient.post(authEndpoints.checkEmail, { email })
  return response.data
}
