import { useGetProductsQuery, useGetProductQuery } from '@/features/product/productApi';

export const useProducts = () => {
    return useGetProductsQuery();
};

export const useProduct = (id: number) => {
    return useGetProductQuery(id);
};
