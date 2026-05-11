"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ItemType = "original" | "print";

export interface CartItem {
  id: number;
  type: ItemType;
  title: string;
  price: number;
  src: string;
  medium: string;
  dimensions: string;
}

/** Unique key for a cart slot */
const key = (id: number, type: ItemType) => `${id}-${type}`;

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, type: ItemType) => void;
  clearCart: () => void;
  hasItem: (id: number, type: ItemType) => boolean;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  hasItem: () => false,
  total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kuzayart_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("kuzayart_cart", JSON.stringify(next));
  };

  const addItem = (item: CartItem) => {
    if (items.some((i) => key(i.id, i.type) === key(item.id, item.type))) return;
    persist([...items, item]);
  };

  const removeItem = (id: number, type: ItemType) =>
    persist(items.filter((i) => key(i.id, i.type) !== key(id, type)));

  const clearCart = () => persist([]);

  const hasItem = (id: number, type: ItemType) =>
    items.some((i) => key(i.id, i.type) === key(id, type));

  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, hasItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
