import { apiClient } from '@/lib/apiClient'

export interface CreateServerOwnerRequestPayload {
  userId: number
  message: string
  selectedUserType: number
}

export interface CreateServerOwnerRequestResponse {
  requestId: number
}

export interface CheckUserRequestResponse {
  hasRequest: boolean
  request: {
    requestId: number
    userId: number
    message: string
    status: 'pending' | 'approved' | 'rejected'
    rejectReason: string | null
    selectedUserType: number
    selectedUserTypeName: string
    createdAt: string
    updatedAt: string
  } | null
}

export const createServerOwnerRequest = async (
  userId: number,
  message: string,
  selectedUserType: number
): Promise<CreateServerOwnerRequestResponse> => {
  const { data } = await apiClient.post('/front/roles/server-owner-requestable', {
    userId,
    message,
    selectedUserType
  })
  return data as CreateServerOwnerRequestResponse
}

export const checkUserServerOwnerRequest = async (): Promise<CheckUserRequestResponse> => {
  const { data } = await apiClient.get('/front/server-owner-requests/check')
  return data as CheckUserRequestResponse
}
