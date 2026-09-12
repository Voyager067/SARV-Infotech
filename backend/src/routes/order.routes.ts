import { Router } from "express";
import { createOrderHandler, getOrderHandler, listOrdersHandler } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.post("/", createOrderHandler);
orderRouter.get("/", listOrdersHandler);
orderRouter.get("/:id", getOrderHandler);
