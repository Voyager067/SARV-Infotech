import { env } from "../config/env";
import { AppError } from "../middleware/error.middleware";
import { HTTP_STATUS } from "../constants";
import { signToken } from "../utils/jwt";
import { LoginRequestBody } from "../types";

export const login = ({ username, password }: LoginRequestBody): { token: string; username: string } => {
  if (username !== env.adminUsername || password !== env.adminPassword) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid username or password");
  }

  const token = signToken({ username });
  return { token, username };
};
