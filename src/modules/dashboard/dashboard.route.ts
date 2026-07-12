import express from "express";
import authMiddleware, { UserRole } from "../../midlewares/auth.middleware"
import * as DashboardController from "./dashboard.controller";
import { auth } from "../../../lib/auth";

const router = express.Router();

router.get(
  "/overview",
  authMiddleware(UserRole.STUDENT),
  DashboardController.getStudentDashboardOverview
);

export default router;