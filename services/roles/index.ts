import { apiClient } from '@/lib/apiClient'

export interface Role {
  userTypeId: number
  userType: string
  userTypeLabel: string
}

export interface RolesResponse {
  data: Role[]
}

export const fetchRequestableRoles = async (): Promise<RolesResponse> => {
  const { data } = await apiClient.get('/front/roles?onlyRequestables=true')
  return data as RolesResponse
}