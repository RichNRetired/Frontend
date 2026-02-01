import { CartItem } from "@/features/cart/cartSlice";

export const calculateSubtotal = (items: CartItem[]) =>
  items.reduce((t, i) => t + i.price * i.quantity, 0);

export const calculateTax = (subtotal: number, rate = 0.1) =>
  subtotal * rate;

export const calculateTotal = (subtotal: number, tax: number) =>
  subtotal + tax;
