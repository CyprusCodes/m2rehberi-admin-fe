import { apiClient } from "@/lib/apiClient";
import { adminUserEndpoints, serverOwnerRequestEndpoints } from "@/lib/endpoints";

export interface XestPaginationMetadata {
  pageSize: number;
  from: number;
  to: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filterableAttributes: unknown[];
  sortableAttributes: string[];
  startCursor: string | null;
  endCursor: string | null;
  links: {
    self: string;
    first: string;
    previous: string | null;
    next: string | null;
    last: string | null;
  };
}

export type UserRow = {
  user_id: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  phone_number: string | null;
  user_status: string;
  email_verify_status: string;
  email_verify_code: string | null;
  email_verify_at: string | null;
};

export type UsersPaginated = {
  metadata: XestPaginationMetadata;
  data: UserRow[];
};

export const fetchUsers = async (query: string = "?page_size=50&sort_by=-users.user_id"): Promise<UsersPaginated> => {
  const url = `${adminUserEndpoints.getAll}${query.startsWith("?") ? query : `?${query}`}`;
  const res = await apiClient.get(url);
  return res.data as UsersPaginated;
};

export type UserStats = {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  bannedUsers: number;
  unverifiedEmails: number;
  usersLast30Days: number;
  usersPrevious30Days: number;
};

export const fetchUserStats = async (): Promise<{ stats: UserStats }> => {
  const res = await apiClient.get(adminUserEndpoints.getStats);
  return res.data as { stats: UserStats };
};

export const banUser = async (userId: number | string) => {
  const res = await apiClient.post(adminUserEndpoints.ban(String(userId)));
  return res.data as { userId: number; userStatus: string };
};

export const unbanUser = async (userId: number | string) => {
  const res = await apiClient.post(adminUserEndpoints.unban(String(userId)));
  return res.data as { userId: number; userStatus: string };
};

export const verifyUserEmail = async (userId: number | string) => {
  const res = await apiClient.post(adminUserEndpoints.verifyEmail(String(userId)));
  return res.data as { userId: number; emailVerifyStatus: string };
};

export const sendPasswordResetEmail = async (email: string) => {
  const res = await apiClient.post(adminUserEndpoints.sendPasswordReset, { requestedEmail: email });
  return res.data as { requestId: number };
};

// Server owner requests
export type ServerOwnerRequestRow = {
  requestId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  selectedUserType: 'server_owner' | 'streamer';
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export const fetchServerOwnerRequests = async (): Promise<{ data: ServerOwnerRequestRow[] }> => {
  const res = await apiClient.get(serverOwnerRequestEndpoints.getAll);
  return res.data as { data: ServerOwnerRequestRow[] };
};

export const createServerOwnerRequest = async (userId: number, message: string, selectedUserType: number) => {
  const res = await apiClient.post(serverOwnerRequestEndpoints.create, { userId, message, selectedUserType });
  return res.data as { requestId: number };
};

export const approveServerOwnerRequest = async (requestId: number, userId?: number) => {
  const res = await apiClient.post(serverOwnerRequestEndpoints.approve(requestId), { userId });
  return res.data as { requestId: number; status: string };
};

export const rejectServerOwnerRequest = async (requestId: number, reason: string, userId?: number) => {
  const res = await apiClient.post(serverOwnerRequestEndpoints.reject(requestId), { reason, userId });
  return res.data as { requestId: number; status: string; reason: string };
};


