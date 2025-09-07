import { apiClient } from "@/lib/apiClient";
import { adminSupportCategoryEndpoints } from "@/lib/endpoints";

export interface SupportCategory {
  category_id: number;
  name: string;
  description?: string;
  is_active: number | boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SupportCategoriesResponse = { data: SupportCategory[] };

export const fetchSupportCategories = async (): Promise<SupportCategoriesResponse> => {
  const res = await apiClient.get(adminSupportCategoryEndpoints.getAll);
  return res.data as SupportCategoriesResponse;
};

export const createSupportCategory = async (payload: { name: string; description?: string; isActive?: boolean; sortOrder?: number }): Promise<{ insertedCategoryId: number }> => {
  const res = await apiClient.post(adminSupportCategoryEndpoints.create, payload);
  return res.data as { insertedCategoryId: number };
};

export const updateSupportCategory = async (id: number, payload: { name: string; description?: string; isActive: boolean; sortOrder: number }): Promise<{ success: boolean }> => {
  const res = await apiClient.put(adminSupportCategoryEndpoints.update(id), payload);
  return res.data as { success: boolean };
};

export const deleteSupportCategory = async (id: number): Promise<{ success: boolean }> => {
  const res = await apiClient.delete(adminSupportCategoryEndpoints.delete(id));
  return res.data as { success: boolean };
};

