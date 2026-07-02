import { Route, Routes } from "react-router";
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
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/support/*" element={<SupportLayout />}>
            <Route path="portal" element={<PortalPage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
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
