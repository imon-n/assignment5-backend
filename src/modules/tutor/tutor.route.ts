import express from "express";
import {
    getTutorsController,
    getTutorByIdController,
    createTutorController,
    updateTutorProfileController,
    AvailabilityController,
    getTutorSessions,
    getTutorAvailabilityController,
    getMyTutorProfiles,
  
} from "./tutor.controller"
import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";

const router = express.Router();

router.get("/tutors", getTutorsController)
 router.get("/tutors/:id", getTutorByIdController)
router.post(
  "/tutor/profile",
 authMiddleware(UserRole.TUTOR),
  createTutorController
);

router.put("/tutor/profile", authMiddleware(UserRole.TUTOR), updateTutorProfileController);
router.get(
  "/profile/me",
   authMiddleware(UserRole.TUTOR),
  getMyTutorProfiles
);

router.patch(
  "/profile/me",
  authMiddleware(UserRole.TUTOR),
  updateTutorProfileController
);
router.post("/tutor/availability", authMiddleware(UserRole.TUTOR), AvailabilityController);
router.get(
  "/tutor/:id/availability",
  getTutorAvailabilityController
);
router.get(
  "/sessions",
  authMiddleware(UserRole.TUTOR),
  getTutorSessions
);
export default router;