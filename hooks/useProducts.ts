import {
    useGetProductsQuery,
    useGetProductQuery,
    useGetProductsByLocationQuery,
    useGetProductBySlugQuery,
} from "@/features/product/productApi";

export const useProducts = () => {
    return useGetProductsQuery();
};

export const useProductsByLocation = (
    locationId: number,
    page?: number,
    size?: number,
    sortBy?: string
) => {
    return useGetProductsByLocationQuery({
        locationId,
        page: page || 0,
        size: size || 10,
        sortBy: sortBy || "createdAt",
    });
};

export const useProduct = (id: number) => {
    return useGetProductQuery(id);
};

export const useProductBySlug = (slug: string) => {
    return useGetProductBySlugQuery(slug);
};
