import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, ProductsResponse } from "./productTypes";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || '').trim()}/api`,
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
        // Get all products - legacy endpoint
        getProducts: builder.query<ProductsResponse, void>({
            query: () => "/products",
            providesTags: ["Products"],
        }),

        // Get products by location with pagination and sorting
        getProductsByLocation: builder.query<
            ProductsResponse,
            {
                locationId: number;
                page?: number;
                size?: number;
                sortBy?: string;
            }
        >({
            query: ({ locationId, page = 0, size = 10, sortBy = "createdAt" }) => ({
                url: "/products",
                params: {
                    locationId,
                    page,
                    size,
                    sortBy,
                },
            }),
            providesTags: ["Products"],
        }),

        // Get product details by ID
        getProduct: builder.query<Product, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        // Get product by slug (alternative endpoint)
        getProductBySlug: builder.query<Product, string>({
            query: (slug) => ({
                url: `/products/${slug}`,
                method: "GET",
            }),
            providesTags: (result) => [{ type: "Products", id: result?.id }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductsByLocationQuery,
    useGetProductQuery,
    useGetProductBySlugQuery,
} = productApi;
