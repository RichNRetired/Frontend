import axios from "./axios";

export interface CartSummaryItem {
  cartItemId: number;
  productId: number;
  variantId: number;
  color: string;
  size: string;
  productName: string;
  imageUrl: string;
  price: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
  discountPercentage: number;
}

export interface ApiCartItem {
  cartId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CartSummaryResponse {
  items: CartSummaryItem[];
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon?: string;
  couponApplied: boolean;
  message?: string;
  totalItems: number;
  totalMrp: number;
  totalSavings: number;
}

export const getCart = async (): Promise<ApiCartItem[]> => {
  const response = await axios.get("/cart");
  return response.data;
};

export const getCartSummary = async (
  couponCode?: string,
): Promise<CartSummaryResponse> => {
  const response = await axios.get("/cart/summary", {
    params: couponCode ? { couponCode } : undefined,
  });
  return response.data;
};


export const addToCart = async (
  productId: number,
  qty: number,
  size?: string
): Promise<void> => {
  const params: { productId: number; qty: number; size?: string } = { productId, qty };
  if (size) params.size = size;
  await axios.post("/cart/add", null, {
    params,
  });
};


export const updateCartItem = async (
  cartId: number,
  quantity: number
): Promise<void> => {
  await axios.put(`/cart/${cartId}`, null, {
    params: { qty: quantity },
  });
};


export const removeFromCart = async (cartId: number): Promise<void> => {
  await axios.delete(`/cart/${cartId}`);
};


export const mergeCart = async (
  items: { productId: number; quantity: number }[]
): Promise<void> => {
  await axios.post("/cart/merge", items);
};
