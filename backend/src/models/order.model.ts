import { Schema, model, InferSchemaType } from "mongoose";
import { ORDER_STATUS } from "../constants";

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingSchema = new Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    username: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    shipping: { type: shippingSchema, required: true },
    cardLast4: { type: String, required: true },
    cardholderName: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: ORDER_STATUS.PAID },
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof orderSchema> & { _id: string };

export const OrderModel = model("Order", orderSchema);
