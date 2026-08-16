import type { ContactMessage, Reply, ScheduleItem, Update, LiveChat, ChatMessage } from "../live/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      if (body && typeof body.error === "string") message = body.error;
    } catch {}
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

function formatUpdateTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

interface ServerAnnouncement {
  id: number;
  title: string | null;
  body: string;
  priority: string;
  created_at: string;
}

interface ServerScheduleItem {
  id: number;
  time: string;
  end: string;
  event: string;
  location: string;
  original_time: string | null;
  adjustment_reason: string | null;
}

interface ServerMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  resolved: boolean;
  replies: Reply[];
  created_at: string;
}

export function serverUpdateToUpdate(item: ServerAnnouncement): Update {
  return { id: item.id, timestamp: formatUpdateTime(item.created_at), title: item.title || undefined, body: item.body };
}

export function serverScheduleToSchedule(item: ServerScheduleItem): ScheduleItem {
  return {
    id: item.id,
    time: item.time,
    end: item.end,
    event: item.event,
    location: item.location,
    originalTime: item.original_time || undefined,
    adjustmentReason: item.adjustment_reason || undefined,
  };
}

export function serverMessageToMessage(item: ServerMessage): ContactMessage {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    message: item.message,
    timestamp: formatMessageTime(item.created_at),
    resolved: item.resolved,
    replies: item.replies || [],
  };
}

interface ServerSubscriber {
  id: number;
  email: string;
  consent_at: string;
  unsubscribed_at: string | null;
}

export const api = {
  subscribe: (email: string) => apiFetch<{ status: "ok" | "already" | "back" }>("/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
  getSubscribers: () => apiFetch<{ subscribers: ServerSubscriber[] }>("/subscribers"),
  getSession: () => apiFetch<{ authed: boolean }>("/session"),
  login: (password: string) => apiFetch<{ ok: boolean }>("/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => apiFetch<{ ok: boolean }>("/logout", { method: "POST" }),

  getAnnouncements: async () => {
    const data = await apiFetch<{ announcements: ServerAnnouncement[] }>("/announcements");
    return data.announcements.map(serverUpdateToUpdate);
  },
  postAnnouncement: (title: string, body: string) =>
    apiFetch<{ announcement: ServerAnnouncement }>("/announcements", {
      method: "POST",
      body: JSON.stringify({ title: title || undefined, body }),
    }),
  deleteAnnouncement: (id: number) =>
    apiFetch<{ status: string }>(`/announcements/${id}`, { method: "DELETE" }),

  getSchedule: async () => {
    const data = await apiFetch<{ schedule: ServerScheduleItem[] }>("/schedule");
    return data.schedule.map(serverScheduleToSchedule);
  },
  postScheduleItem: (item: Omit<ScheduleItem, "id">) =>
    apiFetch<{ item: ServerScheduleItem }>("/schedule", {
      method: "POST",
      body: JSON.stringify({ time: item.time, end: item.end, event: item.event, location: item.location }),
    }),
  patchScheduleItem: (id: number, patch: Partial<ScheduleItem> & { adjustmentReason?: string }) =>
    apiFetch<{ item: ServerScheduleItem }>(`/schedule/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(patch.time !== undefined ? { time: patch.time } : {}),
        ...(patch.end !== undefined ? { end: patch.end } : {}),
        ...(patch.event !== undefined ? { event: patch.event } : {}),
        ...(patch.location !== undefined ? { location: patch.location } : {}),
        ...(patch.adjustmentReason !== undefined ? { adjustmentReason: patch.adjustmentReason } : {}),
      }),
    }),
  deleteScheduleItem: (id: number) =>
    apiFetch<{ status: string }>(`/schedule/${id}`, { method: "DELETE" }),

  getMessages: async () => {
    const data = await apiFetch<{ messages: ServerMessage[] }>("/messages");
    return data.messages.map(serverMessageToMessage);
  },
  postMessage: (name: string, email: string, message: string) =>
    apiFetch<{ id: number }>("/messages", { method: "POST", body: JSON.stringify({ name, email, message }) }),
  patchMessageResolved: (id: number, resolved: boolean) =>
    apiFetch<{ status: string }>(`/messages/${id}`, { method: "PATCH", body: JSON.stringify({ resolved }) }),
  patchMessageReply: (id: number, body: string) =>
    apiFetch<{ status: string }>(`/messages/${id}`, { method: "PATCH", body: JSON.stringify({ reply: { body } }) }),
  deleteMessage: (id: number) =>
    apiFetch<{ status: string }>(`/messages/${id}`, { method: "DELETE" }),

  startChat: (name: string, email?: string) =>
    apiFetch<{ chat: LiveChat; position: number }>("/chat/start", {
      method: "POST",
      body: JSON.stringify({ name, email: email || undefined }),
    }),
  getChat: (id: number) =>
    apiFetch<{ chat: LiveChat; position: number }>(`/chat/${id}`),
  sendChatMessage: (id: number, body: string) =>
    apiFetch<{ status: string }>(`/chat/${id}`, { method: "POST", body: JSON.stringify({ body }) }),
  getChats: () =>
    apiFetch<{ waitingCount: number; queue: LiveChat[]; active: LiveChat[] }>("/chats"),
  claimChat: (id: number) =>
    apiFetch<{ status: string }>(`/chat/${id}/claim`, { method: "POST" }),
  sendStaffMessage: (id: number, body: string) =>
    apiFetch<{ status: string }>(`/chat/${id}/staff`, { method: "POST", body: JSON.stringify({ body }) }),
  closeChat: (id: number) =>
    apiFetch<{ status: string }>(`/chat/${id}/close`, { method: "POST" }),
};