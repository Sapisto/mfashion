"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function itemKey(productId: string, size?: string, color?: string) {
  return `${productId}:${size ?? ""}:${color ?? ""}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        const key = itemKey(item.productId, item.size, item.color);
        set((state) => {
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.size, i.color) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.size, i.color) === key
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + (item.quantity ?? 1),
                        i.stock
                      ),
                    }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
          };
        });
      },

      removeItem(productId, size, color) {
        const key = itemKey(productId, size, color);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.size, i.color) !== key
          ),
        }));
      },

      updateQuantity(productId, quantity, size, color) {
        const key = itemKey(productId, size, color);
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.size, i.color) === key
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: "aie-cart" }
  )
);
