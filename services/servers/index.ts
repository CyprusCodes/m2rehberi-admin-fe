import { apiClient } from "@/lib/apiClient";
import { serverEndpoints } from "@/lib/endpoints";

export interface ServersListParams {
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string;
  direction?: "next" | "previous";
  filters?: string; // pass-through for backend FILTERS JSON/string
  cursor?: string;
}

export interface CreateServerPayload {
  userId: number;
  serverName: string;
  description?: string;
  gameType: "metin2" | "minecraft" | "other";
  serverLevelRange?: string;
  serverDifficulty?: "Easy" | "Medium" | "Hard" | "Other";
  serverType?: string;
  location?: string;
  maxPlayers: number;
  tagId?: number;
  discordLink?: string | null;
  websiteLink?: string | null;
  youtubeLinks?: string[] | null;
  serverRules?: string;
  systems?: any;
  features?: any;
  events?: any;
}

export const fetchServers = async (params: ServersListParams = {}) => {
  const { page, pageSize, sortBy, direction, filters, cursor } = params;
  const res = await apiClient.get(serverEndpoints.getAll, {
    params: {
      page,
      page_size: pageSize,
      sort_by: sortBy,
      direction,
      filters,
      cursor,
    },
  });
  return res.data;
};

export const createServer = async (payload: CreateServerPayload) => {
  const res = await apiClient.post(serverEndpoints.create, payload);
  return res.data as { insertedServerId: number };
};

export const approveServer = async (
  id: number | string,
  payload: { approvalNote?: string }
) => {
  const res = await apiClient.put(serverEndpoints.approve(id), payload);
  return res.data as { serverId: number; status: "approved"; updated: any };
};

export const rejectServer = async (
  id: number | string,
  payload: { rejectNote?: string }
) => {
  const res = await apiClient.put(serverEndpoints.reject(id), payload);
  return res.data as { serverId: number; status: "rejected"; updated: any };
};

export const fetchServerById = async (id: string | number) => {
  const res = await apiClient.get(serverEndpoints.getById(String(id)));
  return res.data as { data: any };
};

export const fetchServerFeedback = async (id: string | number) => {
  const res = await apiClient.get(serverEndpoints.feedbackList(String(id)));
  return res.data as { data: any[] };
};

export const answerServerFeedback = async (
  id: string | number,
  payload: { feedbackId: number; response: string }
) => {
  const res = await apiClient.post(serverEndpoints.feedbackAnswer(String(id)), payload);
  return res.data as { feedbackId: number; serverId: number; updated: any };
};
