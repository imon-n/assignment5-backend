// auth.controller.ts
import { Request, Response } from "express";
import {  getMeService, loginUser, registerUser, updateMe } from "./auth.service";



export const registerUserController = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
};

export const loginUserController = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
};



export const getMeController = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const user = await getMeService(token as string);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    console.error("getMe error:", err.message);

    if (err.message === "No token") {
      return res.status(401).json({ message: "No token" });
    }

    if (err.message === "Unauthorized") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};


export const updateMeController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await updateMe(user.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};

