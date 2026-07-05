import { create } from "zustand";
import type { User } from "../types/User";
import * as AuthService from "../services/AuthService";
import { toast } from "sonner";
import axios from "axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  getUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  refreshToken: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.loginUser(email, password);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({
        user,
        token,
        isAuthenticated: true,
      });
      toast.success("Đăng nhập thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Đăng ký thất bại");
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await AuthService.logoutUser();
    } catch {
      // Silently ignore logout API errors
    }
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, token: null, isLoading: false });
  },
  register: async (fullName: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.registerUser(
        fullName,
        email,
        password,
      );
      toast.success(
        response.message || "Đăng ký thành công! Vui lòng đăng nhập",
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Đăng ký thất bại");
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.forgotPassword(email);
      toast.success("Email đặt lại mật khẩu đã được gửi");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Gửi email thất bại");
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await AuthService.resetPassword(token, newPassword);
      toast.success("Mật khẩu đã được đặt lại thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Đặt lại mật khẩu thất bại",
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    set({ isLoading: true });
    try {
      const response = await AuthService.getProfile();
      const user = response.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
