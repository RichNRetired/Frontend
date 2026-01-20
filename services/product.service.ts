import axios from './axios';

export const getProducts = async () => {
    const response = await axios.get('/products');
    return response.data;
};

export const getProduct = async (id: string) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};

export const searchProducts = async (query: string) => {
    const response = await axios.get(`/products/search?q=${query}`);
    return response.data;
};