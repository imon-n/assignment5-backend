import * as DashboardService from "./dashboard.service";
import { Request, Response } from "express";

export const getStudentDashboardOverview = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    // Check Authentication
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dashboard =
      await DashboardService.getStudentDashboardOverview(user.id);

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: dashboard,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};