import axios from './axios';
import {
    GetProductsByLocationParams,
    Product,
    ProductBreadcrumbItem,
    ProductFilterOptions,
    ProductFilterRequest,
    ProductsResponse,
} from '../features/product/productTypes';

export const getProducts = async (params: GetProductsByLocationParams): Promise<ProductsResponse> => {
    const response = await axios.get('/products', { params });
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};

export const getRelatedProducts = async (
    productId: number,
    page = 0,
    size = 8
): Promise<ProductsResponse> => {
    const response = await axios.get(`/products/${productId}/related`, {
        params: { page, size },
    });
    return response.data;
};

export const getNewArrivals = async (page = 0, size = 10): Promise<ProductsResponse> => {
    const response = await axios.get('/products/new-arrivals', { params: { page, size } });
    return response.data;
};

export const getFeaturedProducts = async (page = 0, size = 10): Promise<ProductsResponse> => {
    const response = await axios.get('/products/featured', { params: { page, size } });
    return response.data;
};

export const getBestSellers = async (page = 0, size = 10): Promise<ProductsResponse> => {
    const response = await axios.get('/products/best-sellers', { params: { page, size } });
    return response.data;
};

export const filterProducts = async (filter: ProductFilterRequest): Promise<ProductsResponse> => {
    const params: Record<string, string | number | boolean | string[]> = {};

    Object.entries(filter).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        params[`filter.${key}`] = value as string | number | boolean | string[];
    });

    const response = await axios.get('/products/filter', { params });
    return response.data;
};

export const getFilterOptions = async (params: {
    sectionId?: number;
    categoryId?: number;
    subCategoryId?: number;
}): Promise<ProductFilterOptions> => {
    const response = await axios.get('/products/filter/options', { params });
    return response.data;
};

export const getProductBreadcrumb = async (params: {
    sectionId?: number;
    categoryId?: number;
    subCategoryId?: number;
}): Promise<ProductBreadcrumbItem[]> => {
    const response = await axios.get('/products/breadcrumb', { params });
    return response.data;
};