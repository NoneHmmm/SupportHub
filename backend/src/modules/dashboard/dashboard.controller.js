import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import * as dashboardService from "./dashboard.service.js";

export const getGeneralDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getGeneralDashboard(req.user);
    sendSuccess(res, 200, "Lấy thông tin dashboard thành công", data);
});

export const getAdminDashboard = asyncHandler(async (_req, res) => {
    const data = await dashboardService.getAdminDashboard();
    sendSuccess(res, 200, "Lấy thông tin admin dashboard thành công", data);
});

export const getAgentDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getAgentDashboard(req.user);
    sendSuccess(res, 200, "Lấy thông tin agent dashboard thành công", data);
});

export const getCustomerDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getCustomerDashboard(req.user);
    sendSuccess(res, 200, "Lấy thông tin customer dashboard thành công", data);
});
