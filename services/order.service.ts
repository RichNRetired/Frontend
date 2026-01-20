import axios from './axios';

export const createOrder = async (orderData: any) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
};

export const getOrders = async () => {
    const response = await axios.get('/orders');
    return response.data;
};

export const getOrder = async (id: string) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
};