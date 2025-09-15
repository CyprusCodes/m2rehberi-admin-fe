import { apiClient } from '@/lib/apiClient';
import { streamerPostReportEndpoints } from '@/lib/endpoints';

export interface StreamerPostReportStats {
  total: number;
  pending: number;
  reviewed: number;
  rejected: number;
}

export const streamerPostReportService = {
  getStats: async (): Promise<StreamerPostReportStats> => {
    const response = await apiClient.get(streamerPostReportEndpoints.stats);
    return response.data;
  },
};
