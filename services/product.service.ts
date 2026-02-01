import axios from './axios';
import { Product, ProductsResponse } from '../features/product/productTypes';

export interface GetProductsParams {
    page?: number;
    size?: number;
    sortBy?: string;
    locationId: number;
}

export const getProducts = async (params: GetProductsParams): Promise<ProductsResponse> => {
    const response = await axios.get('/products', { params });
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};

export const searchProducts = async (query: string, locationId: number) => {
    const response = await axios.get('/products/search', {
        params: { q: query, locationId },
    });
    return response.data;
};