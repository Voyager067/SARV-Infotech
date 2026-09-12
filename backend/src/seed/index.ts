import { connectDatabase } from "../config/db";
import { ProductModel } from "../models/product.model";
import { productsSeed } from "./products.seed";
import mongoose from "mongoose";

const run = async (): Promise<void> => {
  await connectDatabase();
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(productsSeed);
  console.log(`[seed] inserted ${productsSeed.length} products`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
