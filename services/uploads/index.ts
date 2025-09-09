import { apiClient } from "@/lib/apiClient";
import { uploadEndpoints } from "@/lib/endpoints";

export interface UploadAssetResponse {
  data: {
    url: string;
    bucket: string;
    key: string;
    etag?: string;
    versionId?: string | null;
    size?: number | null;
  };
}

export const uploadAsset = async (file: File): Promise<UploadAssetResponse> => {
  const formData = new FormData();
  formData.append("upload", file);

  const res = await apiClient.post(uploadEndpoints.asset, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

