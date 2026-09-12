import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants";
import { AppError } from "../middleware/error.middleware";
import * as productService from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listProductsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productService.listProducts();
  res.status(HTTP_STATUS.OK).json(products);
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Product not found");
  }

  res.status(HTTP_STATUS.OK).json(product);
});
