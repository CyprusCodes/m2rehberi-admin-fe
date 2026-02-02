import { apiClient } from '@/lib/apiClient'
import { gameTypeEndpoints } from '@/lib/endpoints'

export interface GameType {
  gameTypeId: number
  gameTypeCode: string
  title: string
  subtitle?: string | null
  badge?: string | null
  iconUrl?: string | null
  gradientColors?: string[] | null
  glowColor?: string | null
  isActive: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface GameTypesResponse {
  data: GameType[]
}

export interface GameTypeResponse {
  data: GameType
}

export interface CreateGameTypePayload {
  gameTypeCode: string
  title: string
  subtitle?: string | null
  badge?: string | null
  iconUrl?: string | null
  gradientColors?: string[] | null
  glowColor?: string | null
  isActive?: boolean
  sortOrder?: number
}

export interface UpdateGameTypePayload {
  gameTypeCode?: string
  title?: string
  subtitle?: string | null
  badge?: string | null
  iconUrl?: string | null
  gradientColors?: string[] | null
  glowColor?: string | null
  isActive?: boolean
  sortOrder?: number
}

export const fetchGameTypes = async (): Promise<GameTypesResponse> => {
  const { data } = await apiClient.get(gameTypeEndpoints.getAll)
  return data as GameTypesResponse
}

export const fetchActiveGameTypes = async (): Promise<GameTypesResponse> => {
  const { data } = await apiClient.get(gameTypeEndpoints.getActive)
  return data as GameTypesResponse
}

export const fetchGameTypeById = async (id: number | string): Promise<GameTypeResponse> => {
  const { data } = await apiClient.get(gameTypeEndpoints.getById(id))
  return data as GameTypeResponse
}

export const createGameType = async (payload: CreateGameTypePayload): Promise<GameTypeResponse> => {
  const { data } = await apiClient.post(gameTypeEndpoints.create, payload)
  return data as GameTypeResponse
}

export const updateGameType = async (id: number | string, payload: UpdateGameTypePayload): Promise<GameTypeResponse> => {
  const { data } = await apiClient.put(gameTypeEndpoints.update(id), payload)
  return data as GameTypeResponse
}
