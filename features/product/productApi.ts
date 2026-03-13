import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    GetProductsByLocationParams,
    Product,
    ProductBreadcrumbItem,
    ProductFilterOptions,
    ProductFilterRequest,
    ProductsResponse,
} from "./productTypes";

const sanitizeFilter = (filter: ProductFilterRequest) => {
    const params: Record<string, string | number | boolean | string[]> = {};

    Object.entries(filter).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params[key] = value as string | number | boolean | string[];
    });

    return params;
};

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("accessToken");
                const tokenType = localStorage.getItem("tokenType") || "Bearer";

                if (token) {
                    headers.set("Authorization", `${tokenType} ${token}`);
                }
            }
            return headers;
        },
    }),

    tagTypes: ["Products"],

    endpoints: (builder) => ({
        getProductsByLocation: builder.query<ProductsResponse, GetProductsByLocationParams>({
            query: ({
                locationId,
                categoryId,
                minPrice,
                maxPrice,
                size,
                color,
                brand,
                sortBy,
                page = 0,
                limit = 20,
            }) => ({
                url: "/products",
                params: {
                    locationId,
                    categoryId,
                    minPrice,
                    maxPrice,
                    size,
                    color,
                    brand,
                    sortBy,
                    page,
                    limit,
                },
            }),
            providesTags: ["Products"],
        }),

        filterProducts: builder.query<ProductsResponse, ProductFilterRequest>({
            query: (filter) => ({
                url: "/products/filter",
                method: "POST",
                body: sanitizeFilter(filter),
            }),
            providesTags: ["Products"],
        }),

        getFilterOptions: builder.query<
            ProductFilterOptions,
            { sectionId?: number; categoryId?: number; subCategoryId?: number }
        >({
            query: (params) => ({
                url: "/products/filter/options",
                params,
            }),
            providesTags: ["Products"],
        }),

        getProductBreadcrumb: builder.query<
            ProductBreadcrumbItem[],
            { sectionId?: number; categoryId?: number; subCategoryId?: number }
        >({
            query: (params) => ({
                url: "/products/breadcrumb",
                params,
            }),
            providesTags: ["Products"],
        }),

        getProduct: builder.query<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        getRelatedProducts: builder.query<
            ProductsResponse,
            { productId: number; page?: number; size?: number }
        >({
            query: ({ productId, page = 0, size = 8 }) => ({
                url: `/products/${productId}/related`,
                params: { page, size },
            }),
            providesTags: ["Products"],
        }),

        getNewArrivals: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            query: (args) => ({
                url: "/products/new-arrivals",
                params: {
                    page: args?.page ?? 0,
                    size: args?.size ?? 10,
                },
            }),
            providesTags: ["Products"],
        }),

        getFeaturedProducts: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            query: (args) => ({
                url: "/products/featured",
                params: {
                    page: args?.page ?? 0,
                    size: args?.size ?? 10,
                },
            }),
            providesTags: ["Products"],
        }),

        getBestSellers: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            query: (args) => ({
                url: "/products/best-sellers",
                params: {
                    page: args?.page ?? 0,
                    size: args?.size ?? 10,
                },
            }),
            providesTags: ["Products"],
        }),
    }),
});

export const {
    useGetProductsByLocationQuery,
    useFilterProductsQuery,
    useGetFilterOptionsQuery,
    useGetProductBreadcrumbQuery,
    useGetProductQuery,
    useGetRelatedProductsQuery,
    useGetNewArrivalsQuery,
    useGetFeaturedProductsQuery,
    useGetBestSellersQuery,
} = productApi;
