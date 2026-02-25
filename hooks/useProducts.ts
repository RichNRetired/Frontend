import {
    useFilterProductsQuery,
    useGetBestSellersQuery,
    useGetFeaturedProductsQuery,
    useGetNewArrivalsQuery,
    useGetProductQuery,
    useGetProductsByLocationQuery,
    useGetRelatedProductsQuery,
} from "@/features/product/productApi";

const DEFAULT_LOCATION_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_LOCATION_ID || 1);

export const useProducts = (locationId: number = DEFAULT_LOCATION_ID) => {
    return useGetProductsByLocationQuery({
        locationId,
        page: 0,
        limit: 20,
    });
};

export const useProductsByLocation = (
    locationId: number,
    page?: number,
    limit?: number,
    sortBy?: string
) => {
    return useGetProductsByLocationQuery({
        locationId,
        page: page || 0,
        limit: limit || 20,
        sortBy,
    });
};

export const useFilteredProducts = (filter: Parameters<typeof useFilterProductsQuery>[0]) => {
    return useFilterProductsQuery(filter);
};

export const useProduct = (id: number) => {
    return useGetProductQuery(id);
};

export const useRelatedProducts = (productId: number, page?: number, size?: number) => {
    return useGetRelatedProductsQuery({
        productId,
        page: page || 0,
        size: size || 8,
    });
};

export const useNewArrivals = (page?: number, size?: number) =>
    useGetNewArrivalsQuery({ page: page || 0, size: size || 10 });

export const useFeaturedProducts = (page?: number, size?: number) =>
    useGetFeaturedProductsQuery({ page: page || 0, size: size || 10 });

export const useBestSellers = (page?: number, size?: number) =>
    useGetBestSellersQuery({ page: page || 0, size: size || 10 });
