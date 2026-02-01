import axios from "./axios";


export interface ApiCartItem {
  cartId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export const getCart = async (): Promise<ApiCartItem[]> => {
  const response = await axios.get("api/cart");
  return response.data;
};


export const addToCart = async (
  productId: number,
  qty: number,
  size?: string
): Promise<void> => {
  const params: any = { productId, qty };
  if (size) params.size = size;
  await axios.post("api/cart/add", null, {
    params,
  });
};


export const updateCartItem = async (
  cartId: number,
  quantity: number
): Promise<void> => {
  await axios.put(`api/cart/${cartId}`, null, {
    params: { qty: quantity },
  });
};


export const removeFromCart = async (cartId: number): Promise<void> => {
  await axios.delete(`api/cart/${cartId}`);
};


export const mergeCart = async (
  items: { productId: number; quantity: number }[]
): Promise<void> => {
  await axios.post("api/cart/merge", items);
};
