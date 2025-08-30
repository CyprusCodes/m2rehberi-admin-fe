import { apiClient } from "@/lib/apiClient";
import { systemSettingEndpoints } from "@/lib/endpoints";

export type SystemSetting = {
    settingId?: number;
    settingKey: string;
    settingValue: string;
    settingType: string;
    description: string;
    isPublic: boolean;
    settingStatus: string;
    createdAt: string;
    updatedAt: string;
};


export const getSystemSettings = async () => {
  const response = await apiClient.get(systemSettingEndpoints.getAll);
  const list = Array.isArray((response as any)?.data?.systemSettings)
    ? (response as any).data.systemSettings
    : [];

  const mapped: SystemSetting[] = list.map((item: any) => ({
    settingId: item.settingId,
    settingKey: item.settingKey,
    settingValue: String(item.settingValue),
    settingType: item.settingType,
    description: item.description,
    isPublic: Boolean(item.isPublic),
    settingStatus: item.settingStatus,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return { data: mapped };
};  

export const createSystemSetting = async (setting: SystemSetting) => {
  const payload = {
    description: setting.description,
    isPublic: setting.isPublic,
    settingKey: setting.settingKey,
    settingStatus: setting.settingStatus,
    settingType: setting.settingType,
    settingValue: setting.settingValue,
  };
  const response = await apiClient.post(systemSettingEndpoints.create, payload);
  return response.data;
};

export const updateSystemSetting = async (setting: SystemSetting) => {
  if (!setting.settingId) throw new Error("settingId is required");
  const payload = {
    description: setting.description,
    isPublic: setting.isPublic,
    settingKey: setting.settingKey,
    settingStatus: setting.settingStatus,
    settingType: setting.settingType,
    settingValue: setting.settingValue,
  };
  const response = await apiClient.put(systemSettingEndpoints.update(setting.settingId), payload);
  return response.data;
};

export const deleteSystemSetting = async (settingId: number) => {
  const response = await apiClient.delete(systemSettingEndpoints.delete(settingId));
  return response.data;
};