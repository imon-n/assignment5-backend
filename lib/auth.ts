import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { nextCookies } from "better-auth/next-js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  baseURL: "https://assignment5-backend-f7q4.onrender.com",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "https://assignment5-frontend-seven.vercel.app",
    "https://assignment5-backend-f7q4.onrender.com",
  ],



  // 🔥 extra safety (important in production)
  advanced: {
    useSecureCookies: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
      },
      phone: {
        type: "string",
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false, // 👉 testing time false রাখো
  },
plugins:[nextCookies()],
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});