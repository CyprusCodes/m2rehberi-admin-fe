import { apiClient } from "@/lib/apiClient";
import { advertisementEndpoints } from "@/lib/endpoints";

export interface Advertisement {
  advertisementId: number;
  title: string;
  description?: string | null;
  imageUrl: string;
  targetUrl?: string | null;
  advertiserUserId: number;
  approvedBy?: number | null;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalNote?: string | null;
  rejectNote?: string | null;
  approvedAt?: string | null;
  placementZone: 'login_page' | 'onboarding' | 'page_top' | 'page_bottom' | 'sidebar' | 'popup' | 'banner';
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  clickCount: number;
  viewCount: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Related user data
  advertiserUser?: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedByUser?: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface CreateAdvertisementPayload {
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl?: string;
  advertiserUserId?: number;
  approvedBy?: number;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalNote?: string;
  rejectNote?: string;
  approvedAt?: string;
  placementZone: 'login_page' | 'onboarding' | 'page_top' | 'page_bottom' | 'sidebar' | 'popup' | 'banner';
  startDate: string;
  endDate: string;
  status?: 'active' | 'inactive' | 'expired' | 'scheduled';
  clickCount?: number;
  viewCount?: number;
  priority?: number;
}

export interface UpdateAdvertisementPayload extends Partial<CreateAdvertisementPayload> {}

export interface AdvertisementsResponse {
  data: Advertisement[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Fetch all advertisements
export const fetchAdvertisements = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  approvalStatus?: string;
  placementZone?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}): Promise<AdvertisementsResponse> => {
  const res = await apiClient.get(advertisementEndpoints.getAll, { params });
  return res.data;
};

// Fetch advertisement by ID
export const fetchAdvertisementById = async (id: string | number): Promise<{ data: Advertisement }> => {
  const res = await apiClient.get(advertisementEndpoints.getById(String(id)));
  return res.data;
};

// Create new advertisement
export const createAdvertisement = async (payload: CreateAdvertisementPayload): Promise<{ insertedAdvertisementId: number }> => {
  const res = await apiClient.post(advertisementEndpoints.create, payload);
  return res.data;
};

// Update existing advertisement
export const updateAdvertisement = async (id: string | number, payload: UpdateAdvertisementPayload): Promise<{ data: Advertisement; message: string }> => {
  const res = await apiClient.put(advertisementEndpoints.update(String(id)), payload);
  return res.data;
};

// Delete advertisement
export const deleteAdvertisement = async (id: string | number): Promise<{ message: string }> => {
  const res = await apiClient.delete(advertisementEndpoints.delete(String(id)));
  return res.data;
};

// Approve advertisement
export const approveAdvertisement = async (id: string | number, approvalNote?: string): Promise<{ data: Advertisement; message: string }> => {
  const res = await apiClient.patch(advertisementEndpoints.approve(String(id)), {
    approval_note: approvalNote,
  });
  return res.data;
};

// Reject advertisement
export const rejectAdvertisement = async (id: string | number, rejectNote: string): Promise<{ data: Advertisement; message: string }> => {
  const res = await apiClient.patch(advertisementEndpoints.reject(String(id)), {
    reject_note: rejectNote,
  });
  return res.data;
};
