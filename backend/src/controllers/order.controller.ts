import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../middleware/error.middleware";
import * as orderService from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createOrderHandler = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;
  const order = await orderService.createOrder(username, req.body);
  res.status(HTTP_STATUS.CREATED).json(order);
});

export const listOrdersHandler = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;
  const orders = await orderService.listOrdersForUser(username);
  res.status(HTTP_STATUS.OK).json(orders);
});

export const getOrderHandler = asyncHandler(async (req: Request, res: Response) => {
  const username = req.user!.username;
  const order = await orderService.getOrderById(username, req.params.id);

  if (!order) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Order not found");
  }

  res.status(HTTP_STATUS.OK).json(order);
});
