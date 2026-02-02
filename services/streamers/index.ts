import { apiClient } from "@/lib/apiClient";
import {
  streamerEndpoints,
  streamerPostReportEndpoints,
  adminPendingNotificationEndpoints,
} from "@/lib/endpoints";

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
  is_active: number;
  is_verified: number;
  approval_status: "pending" | "approved" | "rejected";
  approval_note?: string | null;
  rejected_note?: string | null;
  approved_at?: string | null;
  approved_by?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface StreamerPostReportStats {
  total: number;
  pending: number;
  reviewed: number;
  rejected: number;
}

export interface StreamerPostComment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: number | null;
  answer_user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface StreamerPostLike {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  liked_at: string;
}

export interface StreamerPost {
  id: number;
  streamer_id: number;
  content: string;
  published_at: string;
  scheduled_at?: string | null;
  reply_to_post_id?: number | null;
  repost_of_post_id?: number | null;
  visibility: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Streamer details
  handle: string;
  display_name: string;
  avatar_url?: string | null;
  is_verified: boolean;
  is_active: boolean;
  // Stats
  like_count: number;
  comment_count: number;
  repost_count: number;
  // Comments and likes
  comments?: StreamerPostComment[] | null;
  likes?: StreamerPostLike[] | null;
  // Original post details (for reposts)
  original_post_id?: number | null;
  original_post_content?: string | null;
  original_post_published_at?: string | null;
  original_streamer_handle?: string | null;
  original_streamer_display_name?: string | null;
  original_streamer_avatar_url?: string | null;
  original_streamer_is_verified?: boolean | null;
  // Parent post details (for replies)
  parent_post_id?: number | null;
  parent_post_content?: string | null;
  parent_post_published_at?: string | null;
  parent_streamer_handle?: string | null;
  parent_streamer_display_name?: string | null;
  parent_streamer_avatar_url?: string | null;
  parent_streamer_is_verified?: boolean | null;
}

export interface StreamerPostsResponse {
  data: StreamerPost[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateStreamerPayload {
  handle: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  badge_url?: string;
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

export interface AdminStopLivePayload {
  sendNotification?: boolean;
  notificationTitle?: string;
  notificationMessage?: string;
}

export const fetchStreamers = async (): Promise<Streamer[]> => {
  const res = await apiClient.get(streamerEndpoints.getAll);
  return res.data;
};

export const fetchStreamerById = async (
  id: string | number,
): Promise<{ data: Streamer }> => {
  const res = await apiClient.get(streamerEndpoints.getById(id));
  return res.data;
};

export const createStreamer = async (
  payload: CreateStreamerPayload,
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.post(streamerEndpoints.create, payload);
  return res.data;
};

export const updateStreamer = async (
  id: string | number,
  payload: UpdateStreamerPayload,
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.put(streamerEndpoints.update(id), payload);
  return res.data;
};

export const deleteStreamer = async (
  id: string | number,
): Promise<{ message: string }> => {
  const res = await apiClient.delete(streamerEndpoints.delete(id));
  return res.data;
};

export const approveStreamer = async (
  id: string | number,
  approvalNote?: string,
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.approve(id), {
    approval_note: approvalNote,
  });
  return res.data;
};

export const rejectStreamer = async (
  id: string | number,
  rejectedNote: string,
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.reject(id), {
    rejected_note: rejectedNote,
  });
  return res.data;
};

export const toggleStreamerStatus = async (
  id: string | number,
  status: "active" | "inactive",
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.toggleStatus(id), {
    status,
  });
  return res.data;
};

export const toggleStreamerVerification = async (
  id: string | number,
  isVerified: boolean,
): Promise<{ data: Streamer; message: string }> => {
  const res = await apiClient.patch(streamerEndpoints.toggleVerification(id), {
    is_verified: isVerified,
  });
  return res.data;
};

export const adminStopStreamerLive = async (
  id: string | number,
  payload: AdminStopLivePayload,
): Promise<{ status: string; data: any }> => {
  const res = await apiClient.post(streamerEndpoints.stopLive(id), payload);
  return res.data;
};

// Streamer Post Reports interfaces and functions
export interface StreamerPostReport {
  id: number;
  post_id: number;
  reporter_user_id: number;
  reported_streamer_id: number;
  reason?: string;
  status: "pending" | "reviewed" | "dismissed";
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
  reporter_username: string;
  reporter_email: string;
  // Reported streamer details
  streamer_handle: string;
  streamer_display_name: string;
  streamer_avatar_url?: string;
  streamer_is_verified: boolean;
  // Streamer user details
  streamer_username: string;
  streamer_email: string;
}

export interface StreamerPostReportDetail extends StreamerPostReport {
  // Additional details for the detail view
  reporter_first_name?: string;
  reporter_last_name?: string;
  streamer_banner_url?: string;
  streamer_bio?: string;
  streamer_is_active: boolean;
  streamer_first_name?: string;
  streamer_last_name?: string;
  post_created_at: string;
  post_updated_at: string;
}

export interface StreamerPostReportsResponse {
  data: StreamerPostReport[];
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
  status?: "pending" | "reviewed" | "dismissed";
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}): Promise<StreamerPostReportsResponse> => {
  const res = await apiClient.get(streamerPostReportEndpoints.list, { params });
  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
};

export const fetchStreamerPostReportById = async (
  id: string | number,
): Promise<{ data: StreamerPostReportDetail }> => {
  const res = await apiClient.get(streamerPostReportEndpoints.getById(id));
  return res.data;
};

export const updateStreamerPostReportStatus = async (
  id: string | number,
  status: "pending" | "reviewed" | "dismissed",
): Promise<{ reportId: number; status: string }> => {
  const res = await apiClient.patch(
    streamerPostReportEndpoints.updateStatus(id),
    { status },
  );
  return res.data;
};

export const deleteStreamerPost = async (
  id: string | number,
): Promise<{ postId: number; deleted: boolean }> => {
  const res = await apiClient.delete(
    streamerPostReportEndpoints.deletePost(id),
  );
  return res.data;
};

export const streamerPostReportService = {
  getStats: async (): Promise<StreamerPostReportStats> => {
    const response = await apiClient.get(streamerPostReportEndpoints.stats);
    return response.data;
  },
};

// Streamer Posts functions
export const fetchAllStreamerPosts = async (params?: {
  page?: number | string;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  filters?: any;
  direction?: string;
  cursor?: string;
}): Promise<
  StreamerPostsResponse & { nextCursor?: string; prevCursor?: string }
> => {
  const res = await apiClient.get("/admin/streamers/posts", { params });

  // Debug için response'u logla
  console.log("API Response:", res.data);

  const metadata = res.data.metadata || {};
  const pageSize = metadata.pageSize || 20;
  const total = metadata.total || 0;

  return {
    data: res.data.data || [],
    pagination: {
      page: 1,
      pageSize: pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: metadata.hasNextPage || false,
      hasPreviousPage: metadata.hasPreviousPage || false,
    },
    nextCursor: metadata.endCursor,
    prevCursor: metadata.startCursor,
  };
};

export const fetchStreamerPostById = async (
  id: string | number,
): Promise<{ data: StreamerPost }> => {
  const res = await apiClient.get(`/admin/streamers/posts/${id}`);
  return res.data;
};

// Notification Credits interfaces and functions
export interface NotificationCreditAssignment {
  id: number;
  streamer_id: number;
  assigned_by_admin_id: number;
  push_count: number;
  is_payment_received: boolean;
  payment_note?: string | null;
  created_at: string;
  admin_first_name?: string;
  admin_last_name?: string;
}

export interface StreamerNotificationLog {
  id: number;
  streamer_id: number;
  headline: string;
  message: string;
  audience: "followers" | "everyone";
  recipients_count: number;
  sent_at: string;
  created_at: string;
}

export interface StreamerNotificationCreditsResponse {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  history: NotificationCreditAssignment[];
  notificationLogs?: StreamerNotificationLog[];
}

export const fetchStreamerNotificationCredits = async (
  id: string | number,
): Promise<StreamerNotificationCreditsResponse> => {
  const res = await apiClient.get(streamerEndpoints.getNotificationCredits(id));
  return res.data.data;
};

export const assignStreamerNotificationCredits = async (
  id: string | number,
  payload: {
    pushCount: number;
    isPaymentReceived: boolean;
    paymentNote?: string;
  },
): Promise<{ success: boolean; insertedId: number; message: string }> => {
  const res = await apiClient.post(
    streamerEndpoints.assignNotificationCredits(id),
    payload,
  );
  return res.data.data;
};

// Stream History interfaces
export interface StreamHistoryRecord {
  id: number;
  streamer_id: number;
  platform: 'kick' | 'youtube' | 'twitch' | 'instagram' | 'tiktok' | 'x' | 'main';
  platform_url: string;
  stream_title?: string | null;
  started_at: string;
  stopped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StreamHistoryResponse {
  streamerId: number;
  history: StreamHistoryRecord[];
}

export const getStreamerStreamHistory = async (
  streamerId: string | number,
): Promise<StreamHistoryResponse> => {
  const res = await apiClient.get(`/admin/streamers/${streamerId}/stream-history`);
  return res.data.data;
};

// Pending Notifications
export interface PendingNotification {
  id: number;
  streamer_id: number;
  headline: string;
  message: string;
  audience: 'followers' | 'everyone';
  status: 'pending' | 'approved' | 'rejected';
  approval_note?: string | null;
  reject_reason?: string | null;
  approved_by?: number | null;
  approved_at?: string | null;
  rejected_by?: number | null;
  rejected_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
  streamer_handle: string;
  streamer_display_name: string;
  streamer_avatar_url?: string | null;
  approved_by_first_name?: string | null;
  approved_by_last_name?: string | null;
  rejected_by_first_name?: string | null;
  rejected_by_last_name?: string | null;
}

export interface PendingNotificationsResponse {
  notifications: PendingNotification[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const fetchPendingNotifications = async (
  params?: {
    status?: 'pending' | 'approved' | 'rejected';
    streamerId?: number;
    limit?: number;
    offset?: number;
  }
): Promise<PendingNotificationsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.streamerId) queryParams.append('streamerId', params.streamerId.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${adminPendingNotificationEndpoints.getAll}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const res = await apiClient.get(url);
    return res.data.data;
  } catch (error: any) {
    console.error('API Error in fetchPendingNotifications:', error);
    throw new Error(error?.response?.data?.message || 'Bildirimler yüklenirken bir hata oluştu');
  }
};

export const approvePendingNotification = async (
  notificationId: number,
  approvalNote?: string
): Promise<{ success: boolean; message: string; recipientsCount: number }> => {
  try {
    const res = await apiClient.post(adminPendingNotificationEndpoints.approve(notificationId), {
      approvalNote
    });
    return res.data.data;
  } catch (error: any) {
    console.error('API Error in approvePendingNotification:', error);
    console.error('Error response:', error?.response);
    throw new Error(error?.response?.data?.message || 'Bildirim onaylanırken bir hata oluştu');
  }
};

export const rejectPendingNotification = async (
  notificationId: number,
  rejectReason: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await apiClient.post(adminPendingNotificationEndpoints.reject(notificationId), {
      rejectReason
    });
    return res.data.data;
  } catch (error: any) {
    console.error('API Error in rejectPendingNotification:', error);
    throw new Error(error?.response?.data?.message || 'Bildirim reddedilirken bir hata oluştu');
  }
};
