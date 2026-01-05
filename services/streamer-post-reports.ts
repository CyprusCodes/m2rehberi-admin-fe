import { apiClient } from '@/lib/apiClient';
import { streamerPostReportEndpoints } from '@/lib/endpoints';

export interface StreamerPostReportStats {
  total: number;
  pending: number;
  reviewed: number;
  rejected: number;
}

export type StreamerPostReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface StreamerPostReportRow {
  id: number;
  post_id: number;
  reporter_user_id: number;
  reported_streamer_id: number;
  reason?: string;
  status: StreamerPostReportStatus;
  created_at: string;
  updated_at: string;
  // Post details
  post_content: string;
  post_published_at: string;
  like_count: number;
  comment_count: number;
  repost_count: number;
  visibility: string;
  // Reporter user details
  reporter_first_name: string;
  reporter_last_name: string;
  reporter_email: string;
  // Reported streamer details
  streamer_handle: string;
  streamer_display_name: string;
  streamer_avatar_url?: string;
  streamer_is_verified: boolean;
  // Streamer user details
  streamer_first_name: string;
  streamer_last_name: string;
  streamer_email: string;
}

export interface StreamerPostReportsResponse {
  data: StreamerPostReportRow[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const fetchStreamerPostReports = async (params?: {
  page?: number;
  pageSize?: number;
  status?: StreamerPostReportStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}): Promise<StreamerPostReportsResponse> => {
  const response = await apiClient.get(streamerPostReportEndpoints.list, { params });
  return response.data;
};

export const updateStreamerPostReportStatus = async (
  id: string | number,
  status: StreamerPostReportStatus
): Promise<{ reportId: number; status: string }> => {
  const response = await apiClient.patch(streamerPostReportEndpoints.updateStatus(id), { status });
  return response.data;
};

export const deleteStreamerPostByReport = async (
  id: string | number
): Promise<{ postId: number; deleted: boolean }> => {
  const response = await apiClient.delete(streamerPostReportEndpoints.deletePost(id));
  return response.data;
};

export const streamerPostReportService = {
  getStats: async (): Promise<StreamerPostReportStats> => {
    const response = await apiClient.get(streamerPostReportEndpoints.stats);
    return response.data;
  },
};
