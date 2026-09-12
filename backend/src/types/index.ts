export interface AuthTokenPayload {
  username: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingDetailsInput {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PaymentDetailsInput {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
}

export interface CreateOrderRequestBody {
  items: OrderItemInput[];
  shipping: ShippingDetailsInput;
  payment: PaymentDetailsInput;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}
