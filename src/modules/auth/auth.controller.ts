// auth.controller.ts
import { Request, Response } from "express";
import {  getSessionUser, loginUser, registerUser, updateMe } from "./auth.service";



export const registerUserController = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
};

export const loginUserController = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
};




// auth.controller.ts
export const getMeController = async (req: Request, res: Response) => {
  try {
    // 🔥 Convert once here, then pass to service
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    
    console.log("Authorization:", req.headers.authorization);

    const user = await getSessionUser(headers);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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

