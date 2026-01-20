import axios from './axios';

export const getCart = async () => {
    const response = await axios.get('/cart');
    return response.data;
};

export const addToCart = async (item: any) => {
    const response = await axios.post('/cart', item);
    return response.data;
};

export const removeFromCart = async (itemId: string) => {
    const response = await axios.delete(`/cart/${itemId}`);
    return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    const response = await axios.patch(`/cart/${itemId}`, { quantity });
    return response.data;
};