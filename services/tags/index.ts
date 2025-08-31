import { apiClient } from "@/lib/apiClient";
import { tagEndpoints } from "@/lib/endpoints";

export interface Tag {
  tagId: number;
  name: string;
  description?: string;
  color: string;
  parentId?: number;
  isActive: boolean;
  topicsCount: number;
  createdAt: string;
  updatedAt: string;
}

export const tagService = {
  // Get all tags
  getAll: async (): Promise<Tag[]> => {
    const response = await apiClient.get(tagEndpoints.getAll);
    return response.data.data;
  },
};
