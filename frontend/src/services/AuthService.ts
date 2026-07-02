import api from "../libs/axios";

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const response = await api.post("/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};
