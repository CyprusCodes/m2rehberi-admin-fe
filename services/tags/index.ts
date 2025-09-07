import { apiClient } from "@/lib/apiClient";
import { tagEndpoints } from "@/lib/endpoints";

export interface Tag {
  tagId: number;
  name: string;
  description?: string;
  color: string;
  parentId?: number;
  isActive: boolean | number;
  topicsCount: number;
  createdAt: string;
  updatedAt: string;
  parentName?: string;
}

export interface CreateTagPayload {
  name: string;
  description?: string;
  color?: string;
  parentId?: number;
}

export interface UpdateTagPayload {
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface TagsResponse {
  data: Tag[];
}

export interface TagResponse {
  data: Tag;
  message?: string;
}

export interface TagStats {
  totalTags: number;
  parentCategories: number;
  subCategories: number;
  activeTags: number;
  inactiveTags: number;
  totalTopics: number;
  mostPopularTag: string;
  mostPopularCount: number;
  tagsLast30Days: number;
  tagsPrevious30Days: number;
  usagePercentage: number;
}

export interface TagStatsResponse {
  stats: TagStats;
}

// Fetch all tags
export const fetchTags = async (): Promise<TagsResponse> => {
  const res = await apiClient.get(tagEndpoints.getAll);
  return res.data as TagsResponse;
};

// Fetch tag by ID
export const fetchTagById = async (id: number | string): Promise<TagResponse> => {
  const res = await apiClient.get(tagEndpoints.getById(id));
  return res.data as TagResponse;
};

// Create new tag
export const createTag = async (payload: CreateTagPayload): Promise<TagResponse> => {
  const res = await apiClient.post(tagEndpoints.create, payload);
  return res.data as TagResponse;
};

// Update existing tag
export const updateTag = async (id: number | string, payload: UpdateTagPayload): Promise<TagResponse> => {
  const res = await apiClient.put(tagEndpoints.update(id), payload);
  return res.data as TagResponse;
};

// Delete tag
export const deleteTag = async (id: number | string): Promise<{ message: string; deletedCount: number }> => {
  const res = await apiClient.delete(tagEndpoints.delete(id));
  return res.data as { message: string; deletedCount: number };
};

// Fetch tag statistics
export const fetchTagStats = async (): Promise<TagStatsResponse> => {
  const res = await apiClient.get(tagEndpoints.getStats);
  return res.data as TagStatsResponse;
};

export const fetchActiveTags = async (): Promise<TagsResponse> => {
  const res = await apiClient.get(tagEndpoints.getActiveTags);
  return res.data as TagsResponse;
};
