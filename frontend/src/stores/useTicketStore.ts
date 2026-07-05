import { create } from "zustand";
import type {
  Ticket,
  TicketMessage,
  TicketDetail,
  CreateTicketPayload,
  TicketFilters,
  Pagination,
} from "../types/Ticket";
import * as TicketService from "../services/TicketService";
import { toast } from "sonner";
import axios from "axios";

interface TicketState {
  // Data
  tickets: Ticket[];
  currentTicket: TicketDetail | null;
  myTickets: Ticket[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;

  // Customer actions
  createTicket: (
    payload: CreateTicketPayload,
    images?: File[],
  ) => Promise<Ticket | undefined>;
  getMyTickets: (filters?: TicketFilters) => Promise<void>;
  getTicketById: (id: string) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;
  replyToTicket: (id: string, message: string) => Promise<TicketMessage | undefined>;
  rateTicket: (id: string, rating: number) => Promise<void>;

  // Admin / Leader actions
  getAllTickets: (filters?: TicketFilters) => Promise<void>;
  assignTicket: (id: string, assignedTo: string) => Promise<void>;
  updatePriority: (id: string, priority: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  transferTicket: (id: string, assignedTo: string) => Promise<void>;
  reopenTicket: (id: string) => Promise<void>;

  // Utils
  resetCurrentTicket: () => void;
  clearError: () => void;
}

const useTicketStore = create<TicketState>((set, get) => ({
  // ──────────── Initial state ────────────
  tickets: [],
  currentTicket: null,
  myTickets: [],
  pagination: null,
  loading: false,
  error: null,

  // ──────────── Customer actions ────────────

  createTicket: async (payload: CreateTicketPayload, images?: File[]) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.createTicket(payload, images);
      toast.success(response.message || "Tạo ticket thành công");
      // response.data = { ticket, attachments } — unwrap the ticket object
      return response.data?.ticket ?? null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message || "Tạo ticket thất bại";
        toast.error(msg);
        set({ error: msg });
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
        set({ error: "Đã xảy ra lỗi không xác định" });
      }
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  getMyTickets: async (filters?: TicketFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.getMyTickets(filters);
      set({
        myTickets: response.data,
        pagination: response.pagination,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Lấy danh sách ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  getTicketById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.getTicketById(id);
      set({ currentTicket: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Lấy thông tin ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  closeTicket: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.closeTicket(id);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Đóng ticket thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Đóng ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  replyToTicket: async (id: string, message: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.replyToTicket(id, message);
      toast.success(response.message || "Gửi phản hồi thành công");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message || "Gửi phản hồi thất bại";
        toast.error(msg);
        set({ error: msg });
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
        set({ error: "Đã xảy ra lỗi không xác định" });
      }
      return undefined;
    } finally {
      set({ loading: false });
    }
  },

  rateTicket: async (id: string, rating: number) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.rateTicket(id, rating);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Đánh giá ticket thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Đánh giá ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  // ──────────── Admin / Leader actions ────────────

  getAllTickets: async (filters?: TicketFilters) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.getAllTickets(filters);
      set({
        tickets: response.data,
        pagination: response.pagination,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Lấy danh sách ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  assignTicket: async (id: string, assignedTo: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.assignTicket(id, assignedTo);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Phân công ticket thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Phân công ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  updatePriority: async (id: string, priority: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.updateTicketPriority(id, priority);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Cập nhật mức độ ưu tiên thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Cập nhật mức độ ưu tiên thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.updateTicketStatus(id, status);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Cập nhật trạng thái thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Cập nhật trạng thái thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  transferTicket: async (id: string, assignedTo: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.transferTicket(id, assignedTo);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Chuyển ticket thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Chuyển ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  reopenTicket: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await TicketService.reopenTicket(id);
      set({ currentTicket: { ...get().currentTicket!, ticket: response.data } });
      toast.success(response.message || "Mở lại ticket thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Mở lại ticket thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      set({ loading: false });
    }
  },

  // ──────────── Utils ────────────

  resetCurrentTicket: () => {
    set({ currentTicket: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTicketStore;
