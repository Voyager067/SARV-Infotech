import { AppError } from "../middleware/error.middleware";
import { HTTP_STATUS } from "../constants";
import { OrderModel } from "../models/order.model";
import { CreateOrderRequestBody } from "../types";

export const createOrder = (username: string, body: CreateOrderRequestBody) => {
  const { items, shipping, payment } = body;

  if (!items || items.length === 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Cannot place an order with an empty cart");
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cardLast4 = payment.cardNumber.replace(/\s+/g, "").slice(-4);

  return OrderModel.create({
    username,
    items,
    shipping,
    cardLast4,
    cardholderName: payment.cardholderName,
    total,
  });
};

export const listOrdersForUser = (username: string) =>
  OrderModel.find({ username }).sort({ createdAt: -1 }).lean();

export const getOrderById = (username: string, id: string) =>
  OrderModel.findOne({ _id: id, username }).lean();
