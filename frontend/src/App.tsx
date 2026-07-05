import { Navigate, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PageNotFound from "./pages/PageNotFound";
import SupportLayout from "./layouts/SupportLayout";
import PortalPage from "./pages/tickets/PortalPage";
import MyTicketsPage from "./pages/tickets/MyTicketPage";
import CreateTicketPage from "./pages/tickets/CreateTicketPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "sonner";
import { socket } from "./socket/socket";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/support/*" element={<SupportLayout />}>
          <Route index element={<Navigate to="/support/portal" replace />} />
          <Route path="portal" element={<PortalPage />} />
          <Route path="my-tickets" element={<MyTicketsPage />} />
          <Route path="create-ticket" element={<CreateTicketPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
