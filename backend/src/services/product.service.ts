import { ProductModel } from "../models/product.model";

export const listProducts = () => ProductModel.find().sort({ createdAt: 1 }).lean();

export const getProductById = (id: string) => ProductModel.findById(id).lean();
