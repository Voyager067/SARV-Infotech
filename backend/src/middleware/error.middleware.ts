import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : HTTP_STATUS.INTERNAL_ERROR;
  const message = err instanceof Error ? err.message : "Unexpected server error";

  if (statusCode === HTTP_STATUS.INTERNAL_ERROR) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};
