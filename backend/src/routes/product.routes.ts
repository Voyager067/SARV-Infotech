import { Router } from "express";
import { getProductHandler, listProductsHandler } from "../controllers/product.controller";

export const productRouter = Router();

productRouter.get("/", listProductsHandler);
productRouter.get("/:id", getProductHandler);
