export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || "EKart";
export const CREATOR_NAME = import.meta.env.VITE_CREATOR_NAME || "Ritu Anand";

export const AUTH_STORAGE_KEY = "ekart_auth";
export const CART_STORAGE_KEY = "ekart_cart";

export const CURRENCY = "INR";
export const LOCALE = "en-IN";

export const CATEGORIES = [
  "All",
  "Tech",
  "Audio",
  "Wearables",
  "Home",
  "Gaming",
  "Clothing",
  "Jewellery",
] as const;
