import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants";
import * as authService from "../services/auth.service";

export const loginHandler = (req: Request, res: Response): void => {
  const result = authService.login(req.body);
  res.status(HTTP_STATUS.OK).json(result);
};
