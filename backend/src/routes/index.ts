import { Router } from "express";
import { authRouter } from "./auth.routes";
import { productRouter } from "./product.routes";
import { orderRouter } from "./order.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/orders", orderRouter);
