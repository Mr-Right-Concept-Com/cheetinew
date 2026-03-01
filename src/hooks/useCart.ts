import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  type: "hosting" | "cloud" | "domain" | "email" | "addon";
  name: string;
  description?: string;
  price: number;
  period: "monthly" | "yearly" | "biennial" | "once";
  quantity: number;
  metadata?: Record<string, unknown>;
}

const CART_KEY = "cheetihost_cart";

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if same item exists
      const existing = prev.find(
        (i) => i.type === item.type && i.name === item.name && i.period === item.period
      );
      if (existing) {
        toast.info(`${item.name} is already in your cart`);
        return prev;
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { ...item, id: crypto.randomUUID() }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0; // No tax for now
  const total = subtotal + tax;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: items.length,
    subtotal,
    tax,
    total,
  };
};
