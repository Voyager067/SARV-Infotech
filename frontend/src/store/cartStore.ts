import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_STORAGE_KEY } from "../constants";
import { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product._id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isDrawerOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
              },
            ],
            isDrawerOpen: true,
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      incrementItem: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decrementItem: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    { name: CART_STORAGE_KEY, partialize: (state) => ({ items: state.items }) }
  )
);

export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartCount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
