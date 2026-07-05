import type { User } from "./User";

export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type TicketType = "bug" | "feature" | "task" | "other";

export interface Ticket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  type: TicketType | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  senderId: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  recipientId?: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  assignedTo?: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  dueDate?: string;
  closedAt?: string;
  resolvedAt?: string;
  tags: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  _id: string;
  ticketId: string;
  senderId: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  recipientId?: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  message: string;
  isRead: boolean;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  _id: string;
  ticketId: string;
  uploadedBy: string | Pick<User, "_id" | "fullName" | "email" | "avatar">;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetail {
  ticket: Ticket;
  messages: TicketMessage[];
  attachments: Attachment[];
}

export interface CreateTicketResponse {
  ticket: Ticket;
  attachments: Attachment[];
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  type?: TicketType;
  priority?: TicketPriority;
  tags?: string[];
  dueDate?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  type?: TicketType;
  search?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
