import { apiClient } from "@/lib/apiClient";

export interface LotteryListParams {
  page?: string | number;
  pageSize?: string | number;
  sortBy?: string;
  direction?: "next" | "previous";
  filters?: string;
  cursor?: string;
}

export interface Lottery {
  lottery_id: number;
  creator_user_id: number;
  server_id?: number;
  title: string;
  description: string;
  prize_description: string;
  prize_image_url?: string;
  participation_rules: any;
  max_participants?: number;
  start_date: string;
  end_date: string;
  winner_count: number;
  status: "active" | "completed" | "cancelled" | "ended" | "draft";
  selection_method: string;
  created_at: string;
  updated_at: string;
  ended_at?: string;
  creator_first_name?: string;
  creator_last_name?: string;
  creator_email?: string;
  creator_user_type_id?: number;
  participant_count: number;
  winner_selected_count: number;
}

export interface LotteryParticipant {
  id: number;
  username: string;
  joinedAt: string;
  avatar?: string;
}

export interface LotteryStats {
  totalLotteries: number;
  activeLotteries: number;
  totalParticipants: number;
  completedLotteries: number;
}

// Admin lottery endpoints
export const fetchAdminLotteries = async (params: LotteryListParams = {}) => {
  const { page, pageSize, sortBy, direction, filters, cursor } = params;
  const res = await apiClient.get("/admin/lotteries", {
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

// Frontend lottery endpoints
export const fetchLotteries = async () => {
  const res = await apiClient.get("/front/lottery/list");
  return res.data as { data: Lottery[] };
};

export const fetchActiveLotteries = async () => {
  const res = await apiClient.get("/front/lottery/active");
  return res.data as { data: Lottery[] };
};

export const fetchLotteryById = async (lotteryId: string | number) => {
  const res = await apiClient.get(`/front/lottery/${lotteryId}`);
  return res.data as { data: Lottery };
};

// Admin lottery detail endpoint
export const fetchAdminLotteryById = async (lotteryId: string | number) => {
  const res = await apiClient.get(`/admin/lotteries/${lotteryId}`);
  return res.data as { data: any }; // Extended lottery data with all admin fields
};

// Admin lottery stats endpoint
export const fetchAdminLotteryStats = async (): Promise<LotteryStats> => {
  const res = await apiClient.get("/admin/lottery/stats");
  return res.data.data as LotteryStats;
};

export const fetchLotteryParticipants = async (lotteryId: string | number) => {
  const res = await apiClient.get(`/front/lottery/${lotteryId}/participants`);
  return res.data as { data: LotteryParticipant[] };
};

// Create lottery
export interface CreateLotteryPayload {
  title: string;
  description: string;
  prize_description: string;
  prize_image_url?: string;
  participation_rules: any;
  max_participants?: number;
  start_date: string;
  end_date: string;
  winner_count: number;
  selection_method: string;
  server_id?: number;
}

export const createLottery = async (payload: CreateLotteryPayload) => {
  const res = await apiClient.post("/front/lottery/create", payload);
  return res.data as { lottery_id: number; message: string };
};

// Join lottery
export const joinLottery = async (lotteryId: string | number) => {
  const res = await apiClient.post("/front/lottery/join", { lottery_id: lotteryId });
  return res.data as { success: boolean; message: string };
};

// Admin actions
export const endLottery = async (lotteryId: string | number) => {
  const res = await apiClient.put(`/front/lottery/${lotteryId}/end`);
  return res.data as { success: boolean; message: string };
};

export const selectWinners = async (lotteryId: string | number) => {
  const res = await apiClient.put(`/front/lottery/${lotteryId}/winners`);
  return res.data as { success: boolean; message: string; winners: any[] };
};

// Transform lottery data for admin table
// Helper function to determine user role based on user_type_id
const getUserRole = (userTypeId?: number) => {
  switch (userTypeId) {
    case 1: return 'admin'
    case 3: return 'serverOwner'
    case 4: return 'streamer'
    default: return 'user'
  }
}

export const transformLotteryData = (item: Lottery) => ({
  id: item.lottery_id,
  title: item.title,
  description: item.description,
  createdBy: {
    id: item.creator_user_id,
    username: `${item.creator_first_name || ''} ${item.creator_last_name || ''}`.trim() || item.creator_email || `User ${item.creator_user_id}`,
    role: getUserRole(item.creator_user_type_id)
  },
  createdAt: item.created_at,
  endDate: item.end_date,
  status: item.status,
  participantCount: parseInt(item.participant_count.toString()) || 0,
  maxParticipants: item.max_participants,
  winnerCount: item.winner_count,
  hasWinners: parseInt(item.winner_selected_count.toString()) > 0
});

// Calculate statistics from lottery data
export const calculateLotteryStats = (data: {
  data: Lottery[]
  pagination: { total_count: number }
}): LotteryStats => {
  const lotteries = data.data
  const activeLotteries = lotteries.filter(l => l.status === 'active').length
  const completedLotteries = lotteries.filter(l => l.status === 'completed' || l.status === 'ended').length
  const totalParticipants = lotteries.reduce((sum, lottery) => sum + parseInt(lottery.participant_count.toString()), 0)
  
  return {
    totalLotteries: data.pagination.total_count,
    activeLotteries,
    completedLotteries,
    totalParticipants,
  }
}