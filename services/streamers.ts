import { apiClient } from "@/lib/apiClient";
import { streamerEndpoints } from "@/lib/endpoints";

export interface Streamer {
  id: number;
  user_id?: number | null;
  handle: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  main_link_url?: string | null;
  kick_url?: string | null;
  youtube_url?: string | null;
  twitch_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  x_url?: string | null;
  website_url?: string | null;
  socials_json?: any | null;
  is_active: boolean;
  is_verified: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_note?: string | null;
  rejected_note?: string | null;
  approved_at?: string | null;
  approved_by?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateStreamerPayload {
  handle: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  main_link_url?: string;
  kick_url?: string;
  youtube_url?: string;
  twitch_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  x_url?: string;
  website_url?: string;
  socials_json?: any;
  is_verified?: boolean;
}

export interface UpdateStreamerPayload extends Partial<CreateStreamerPayload> {}

export const fetchStreamers = async (): Promise<{ data: Streamer[] }> => {
  const res = await apiClient.get(streamerEndpoints.getAll);
  return res.data;
};

export const fetchStreamerById = async (id: string | number): Promise<{ data: Streamer }> => {
  const res = await apiClient.get(streamerEndpoints.getById(id));
  return res.data;
};

export const createStreamer = async (payload: CreateStreamerPayload): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.post(streamerEndpoints.create, payload);
  return res.data;
};

export const updateStreamer = async (id: string | number, payload: UpdateStreamerPayload): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.put(streamerEndpoints.update(id), payload);
  return res.data;
};

export const deleteStreamer = async (id: string | number): Promise<{ message: string }> => {
  const res = await apiClient.delete(streamerEndpoints.delete(id));
  return res.data;
};

export const approveStreamer = async (id: string | number, approvalNote?: string): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.approve(id), { approval_note: approvalNote });
  return res.data;
};

export const rejectStreamer = async (id: string | number, rejectedNote: string): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.reject(id), { rejected_note: rejectedNote });
  return res.data;
};

export const toggleStreamerStatus = async (id: string | number, status: 'active' | 'inactive'): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.toggleStatus(id), { status });
  return res.data;
};

export const toggleStreamerVerification = async (id: string | number, isVerified: boolean): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.toggleVerification(id), { is_verified: isVerified });
  return res.data;
};