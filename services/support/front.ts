import { apiClient } from "@/lib/apiClient";
import { frontSupportEndpoints } from "@/lib/endpoints";

export type FrontSupportCategory = {
  category_id: number;
  name: string;
  description?: string;
  is_active: boolean | number;
  sort_order: number;
};

export type FrontSupportTicket = {
  ticket_id: number;
  user_id: number;
  category_id: number;
  title: string;
  description?: string;
  status: 'open'|'pending'|'in_progress'|'resolved'|'closed';
  priority: 'low'|'normal'|'high'|'urgent';
  assigned_to?: number | null;
  last_message_at?: string | null;
  last_message_text?: string | null;
  created_at: string;
  updated_at: string;
};

export type FrontSupportMessage = {
  message_id: number;
  ticket_id: number;
  author_id: number;
  message: string;
  replied_to_message_id?: number | null;
  is_internal: boolean | number;
  is_seen: boolean | number;
  created_at: string;
};

export async function fetchFrontSupportCategories() {
  const { data } = await apiClient.get(frontSupportEndpoints.getCategories);
  return data as { data: FrontSupportCategory[] };
}

export async function createFrontSupportTicket(payload: { categoryId: number; title: string; description: string; priority?: 'low'|'normal'|'high'|'urgent' }) {
  const { data } = await apiClient.post(frontSupportEndpoints.createTicket, payload);
  return data as { insertedTicketId: number };
}

export async function fetchMyFrontSupportTickets() {
  const { data } = await apiClient.get(frontSupportEndpoints.myTickets);
  return data as { data: FrontSupportTicket[] };
}

export async function fetchFrontSupportMessages(ticketId: number) {
  const { data } = await apiClient.get(frontSupportEndpoints.getMessages(ticketId));
  return data as { data: FrontSupportMessage[] };
}

export async function createFrontSupportMessage(ticketId: number, payload: { message: string; repliedToMessageId?: number }) {
  const { data } = await apiClient.post(frontSupportEndpoints.createMessage(ticketId), payload);
  return data as { insertedMessageId: number };
}
