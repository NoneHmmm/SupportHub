import api from "../libs/axios";
import type {
  Ticket,
  TicketMessage,
  TicketDetail,
  CreateTicketPayload,
  CreateTicketResponse,
  TicketFilters,
  Pagination,
} from "../types/Ticket";

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  status: number;
  message: string;
  data: T;
}

// ────────────── Customer ──────────────

export const createTicket = async (
  payload: CreateTicketPayload,
  images?: File[],
) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  if (payload.type) formData.append("type", payload.type);
  if (payload.priority) formData.append("priority", payload.priority);
  if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
  if (payload.dueDate) formData.append("dueDate", payload.dueDate);
  if (images) {
    images.forEach((image) => formData.append("images", image));
  }
  const response = await api.post<SingleResponse<Ticket>>("/tickets", formData);
  return response.data;
};

export const getMyTickets = async (filters?: TicketFilters) => {
  const response = await api.get<PaginatedResponse<Ticket>>("/tickets/my", {
    params: filters,
  });
  return response.data;
};

export const getTicketById = async (id: string) => {
  const response = await api.get<SingleResponse<TicketDetail>>(
    `/tickets/${id}`,
  );
  return response.data;
};

export const closeTicket = async (id: string) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/close`,
  );
  return response.data;
};

export const replyToTicket = async (id: string, message: string) => {
  const response = await api.post<SingleResponse<TicketMessage>>(
    `/tickets/${id}/reply`,
    { message },
  );
  return response.data;
};

export const rateTicket = async (id: string, rating: number) => {
  const response = await api.post<SingleResponse<Ticket>>(
    `/tickets/${id}/rating`,
    { rating },
  );
  return response.data;
};

// ────────────── Admin / Leader ──────────────

export const getAllTickets = async (filters?: TicketFilters) => {
  const response = await api.get<PaginatedResponse<Ticket>>("/tickets", {
    params: filters,
  });
  return response.data;
};

export const assignTicket = async (id: string, assignedTo: string) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/assign`,
    { assignedTo },
  );
  return response.data;
};

export const updateTicketPriority = async (
  id: string,
  priority: string,
) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/priority`,
    { priority },
  );
  return response.data;
};

export const updateTicketStatus = async (id: string, status: string) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/status`,
    { status },
  );
  return response.data;
};

export const transferTicket = async (id: string, assignedTo: string) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/transfer`,
    { assignedTo },
  );
  return response.data;
};

export const reopenTicket = async (id: string) => {
  const response = await api.patch<SingleResponse<Ticket>>(
    `/tickets/${id}/reopen`,
  );
  return response.data;
};
