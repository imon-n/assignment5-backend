import express, {type Application} from "express";
import {toNodeHandler} from "better-auth/node";
import {auth} from "../lib/auth";
import cors from "cors";

import tutorRoute from "./modules/tutor/tutor.route";
import categoryRoute from "./modules/category/category.route";
import bookingRoute from "./modules/booking/booking.route";
import reviewRoute from "./modules/review/review.route";
import authRoute from "./modules/auth/auth.route";
import adminRoute from "./modules/admin/admin.route";
import paymentRoute from "./modules/payment/payment.route";
import * as PaymentController from "./modules/payment/payment.controller";
import cookieParser from "cookie-parser";
import { authHandler } from "./auth.route";
const app: Application = express();


app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://assignment5-frontend-seven.vercel.app",
    credentials: true,
  })
);
app.use(express.json());


// 🔥 AFTER middleware
app.all("/api/auth/*", authHandler);



app.use("/api", authRoute);
app.use("/api", tutorRoute);
app.use("/api", categoryRoute);
app.use("/api", bookingRoute);
app.use("/api", reviewRoute);
app.use("/api", adminRoute);
app.use("/api/v1/payments", paymentRoute);

app.get("/api/test-session", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  console.log("SESSION:", session);

  res.json(session);
});
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
