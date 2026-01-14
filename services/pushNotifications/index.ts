import { apiClient } from "@/lib/apiClient";
import { pushNotificationEndpoints } from "@/lib/endpoints";

export interface PushNotification {
  id: number;
  headline: string;
  message: string;
  linkTo: "server" | "streamer_post" | "streamer" | "lottery" | null;
  linkToId: string | null;
  scheduledDate: string;
  scheduledTime: string;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePushNotificationPayload {
  headline: string;
  message: string;
  linkTo?: "server" | "streamer_post" | "streamer" | "lottery";
  linkToId?: string;
  scheduledAt?: string; // DATETIME format: "YYYY-MM-DD HH:mm:ss"
  sendNow?: boolean;
  targets?: number[];
}

export const getPushNotifications = async (queryParams?: string) => {
  const url = queryParams
    ? `${pushNotificationEndpoints.getAll}?${queryParams}`
    : pushNotificationEndpoints.getAll;
  const res = await apiClient.get(url);
  return res.data;
};

export const getPushNotificationById = async (id: number) => {
  const res = await apiClient.get(pushNotificationEndpoints.getById(id));
  return res.data as { notification: PushNotification };
};

export const createPushNotification = async (
  payload: CreatePushNotificationPayload
) => {
  const res = await apiClient.post(pushNotificationEndpoints.create, payload);
  return res.data as { pushNotificationId: number };
};

export const updatePushNotification = async (
  id: number,
  payload: CreatePushNotificationPayload
) => {
  const res = await apiClient.put(
    pushNotificationEndpoints.update(id),
    payload
  );
  return res.data;
};

export const deletePushNotification = async (id: number) => {
  const res = await apiClient.delete(pushNotificationEndpoints.delete(id));
  return res.data;
};

export const sendTestPushNotification = async (payload: {
  headline: string;
  message: string;
  linkTo?: "server" | "streamer_post" | "streamer" | "lottery";
  linkToId?: string;
  platform: "ios" | "android" | "all";
}) => {
  return apiClient.post(pushNotificationEndpoints.create, {
    ...payload,
    sendNow: true,
    targets: payload.platform === "all" ? [] : undefined,
  });
};
