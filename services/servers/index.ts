import { apiClient } from "@/lib/apiClient";
import {
  serverEndpoints,
  frontendServerEndpoints,
  adminFeedbackEndpoints,
} from "@/lib/endpoints";

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
  serverCoverImageUrl?: string | null;
  images?: string[] | null;
  systems?: any;
  features?: any;
  events?: any;
  showTimeStatus?: boolean;
  showDateTime?: string;
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

// Frontend (user) facing server APIs
export const createFrontendServer = async (payload: CreateServerPayload) => {
  const res = await apiClient.post(
    frontendServerEndpoints.createServer,
    payload
  );
  return res.data as { insertedServerId?: number; data?: any };
};

export const fetchFrontendUserServers = async () => {
  const res = await apiClient.get(frontendServerEndpoints.getUserServers);
  return res.data as { data: any[] };
};

export const fetchFrontendUserServerById = async (id: number | string) => {
  const res = await apiClient.get(
    frontendServerEndpoints.getUserServerById(id)
  );
  return res.data as { data: any };
};

export const updateFrontendUserServerStatus = async (
  id: number | string,
  payload: { status: "online" | "offline" | "maintenance" }
) => {
  const res = await apiClient.put(
    frontendServerEndpoints.updateUserServerStatus(String(id)),
    payload
  );
  return res.data as {
    serverId: number;
    status: "online" | "offline" | "maintenance";
    updated: any;
  };
};

export const updateFrontendUserServerDetails = async (
  id: number | string,
  payload: {
    serverName: string;
    description: string;
    serverDifficulty: "Easy" | "Medium" | "Hard" | "Other";
    serverLevelRange: string;
    serverType: string;
    tagId?: number | null;
    discordLink?: string | null;
    websiteLink?: string | null;
    youtubeLinks?: string[] | null;
    serverRules?: string | null;
    serverCoverImageUrl?: string | null;
    systems?: any;
    features?: any;
    events?: any;
    showTimeStatus?: boolean;
    showDateTime?: string | null;
  }
) => {
  const res = await apiClient.put(
    frontendServerEndpoints.updateUserServerDetails(String(id)),
    payload
  );
  return res.data as { serverId: number; status: "updated"; updated: any };
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

export const updateServerStatus = async (
  id: number | string,
  payload: { status: "online" | "offline" | "maintenance" }
) => {
  const res = await apiClient.put(
    serverEndpoints.updateStatus(String(id)),
    payload
  );
  return res.data as {
    serverId: number;
    status: "online" | "offline" | "maintenance";
    updated: any;
  };
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
  const res = await apiClient.post(
    serverEndpoints.feedbackAnswer(String(id)),
    payload
  );
  return res.data as { feedbackId: number; serverId: number; updated: any };
};

export const deleteServerFeedback = async (
  serverId: number | string,
  feedbackId: number | string
) => {
  const res = await apiClient.delete(
    adminFeedbackEndpoints.deleteById(String(serverId), String(feedbackId))
  );
  return res.data as {
    success: boolean;
    serverId: number;
    feedbackId: number;
    deleted: any;
  };
};

export const fetchActiveServers = async (params: ServersListParams = {}) => {
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
  console.log("fetchActiveServers", JSON.stringify(res.data.data, null, 2));
  return res.data;
};

// User liked servers interface
export interface LikedServer {
  server_id: number;
  server_name: string;
  status: 'online' | 'offline' | 'maintenance';
  server_cover_image_url?: string;
  liked_at: string;
  like_count: string | number;
  comment_count: number;
  average_rating: string | number;
}

export const fetchUserLikedServers = async (): Promise<{ data: LikedServer[] }> => {
  try {
    const response = await apiClient.get(frontendServerEndpoints.getUserLikedServers);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Like/Unlike server functionality
export interface LikeServerPayload {
  likeType: 'like' | 'dislike';
}

export const likeServer = async (serverId: number | string, payload: LikeServerPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(frontendServerEndpoints.likeServer(serverId), payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeServerLike = async (serverId: number | string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(frontendServerEndpoints.likeServer(serverId), { likeType: 'dislike' });
    return response.data;
  } catch (error) {
    throw error;
  }
};
