import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JWT_EXPIRES_IN } from "../constants";
import { AuthTokenPayload } from "../types";

export const signToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
