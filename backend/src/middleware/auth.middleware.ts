import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants";
import { verifyToken } from "../utils/jwt";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Missing or invalid authorization header" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
