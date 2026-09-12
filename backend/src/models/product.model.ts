import { Schema, model, InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    accentColor: { type: String, required: true },
    tag: { type: String },
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof productSchema> & { _id: string };

export const ProductModel = model("Product", productSchema);
