"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  src: string;
  medium: string;
  dimensions: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  hasItem: (id: number) => boolean;
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
    if (items.some((i) => i.id === item.id)) return;
    persist([...items, item]);
  };

  const removeItem = (id: number) => persist(items.filter((i) => i.id !== id));
  const clearCart = () => persist([]);
  const hasItem = (id: number) => items.some((i) => i.id === id);
  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, hasItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
