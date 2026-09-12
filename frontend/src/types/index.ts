export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  accentColor: string;
  tag?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface Order {
  _id: string;
  username: string;
  items: CartItem[];
  shipping: ShippingDetails;
  cardLast4: string;
  cardholderName: string;
  total: number;
  status: string;
  createdAt: string;
}
