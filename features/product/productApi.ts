import type {
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    QueryReturnValue,
} from "@reduxjs/toolkit/query";
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

const toFiniteNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (typeof value === "string" && value.trim() !== "") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    return null;
};

const resolvePrimaryVariant = (product: Product) => {
    const variants = Array.isArray(product.variants) ? product.variants : [];

    return (
        variants.find(
            (variant) =>
                variant?.isActive !== false &&
                toFiniteNumber(variant?.sellingPrice) !== null,
        ) ??
        variants.find((variant) => toFiniteNumber(variant?.sellingPrice) !== null) ??
        null
    );
};

const normalizeProduct = (product: Product): Product => {
    const primaryVariant = resolvePrimaryVariant(product);
    const basePrice = toFiniteNumber(product.price);
    const variantPrice = toFiniteNumber(primaryVariant?.sellingPrice);
    const resolvedPrice =
        basePrice !== null && basePrice > 0
            ? basePrice
            : (variantPrice ?? basePrice ?? 0);

    const baseMrp = toFiniteNumber(product.mrp);
    const variantMrp = toFiniteNumber(primaryVariant?.mrp);
    const resolvedMrp =
        baseMrp !== null && baseMrp > 0
            ? baseMrp
            : (variantMrp ?? baseMrp ?? resolvedPrice);

    return {
        ...product,
        price: resolvedPrice,
        mrp: resolvedMrp,
    };
};

const normalizeProductsResponse = (response: ProductsResponse): ProductsResponse => ({
    ...response,
    content: Array.isArray(response?.content)
        ? response.content.map(normalizeProduct)
        : [],
});

const hasGalleryImages = (product: Product) =>
    Array.isArray(product.images) && product.images.length > 0;

const mergeProductWithDetails = (product: Product, detail: Product): Product => ({
    ...detail,
    ...product,
    variants:
        Array.isArray(product.variants) && product.variants.length > 0
            ? product.variants
            : detail.variants,
    images: hasGalleryImages(product) ? product.images : detail.images,
    main_image: product.main_image || detail.main_image,
    thumbnail_image: product.thumbnail_image || detail.thumbnail_image,
    medium_image: product.medium_image || detail.medium_image,
    price: toFiniteNumber(product.price) ?? detail.price,
    mrp: toFiniteNumber(product.mrp) ?? detail.mrp,
});

type MaybePromise<T> = T | PromiseLike<T>;

type ProductBaseQuery = (
    arg: string | FetchArgs,
) => MaybePromise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>>;

const enrichProductsWithDetails = async (
    response: ProductsResponse,
    fetchWithBQ: ProductBaseQuery,
): Promise<QueryReturnValue<ProductsResponse, FetchBaseQueryError, FetchBaseQueryMeta>> => {
    const normalizedResponse = normalizeProductsResponse(response);
    const products = normalizedResponse.content;
    const productsNeedingDetails = products.filter(
        (product) => Number.isFinite(product.id) && !hasGalleryImages(product),
    );

    if (productsNeedingDetails.length === 0) {
        return { data: normalizedResponse };
    }

    const detailEntries = await Promise.all(
        productsNeedingDetails.map(async (product) => {
            const detailResult = await fetchWithBQ({ url: `/products/${product.id}` });

            if (detailResult.error || !detailResult.data) {
                return [product.id, null] as const;
            }

            return [product.id, detailResult.data as Product] as const;
        }),
    );

    const detailMap = new Map(detailEntries);

    return {
        data: {
            ...normalizedResponse,
            content: products.map((product) => {
                const detail = detailMap.get(product.id);

                if (!detail) return product;

                return normalizeProduct(mergeProductWithDetails(product, detail));
            }),
        },
    };
};

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (globalThis.window !== undefined) {
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
            transformResponse: (response: ProductsResponse) =>
                normalizeProductsResponse(response),
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
            transformResponse: (response: Product) => normalizeProduct(response),
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
            transformResponse: (response: ProductsResponse) =>
                normalizeProductsResponse(response),
            providesTags: ["Products"],
        }),

        getNewArrivals: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            async queryFn(args, _api, _extraOptions, fetchWithBQ) {
                const response = await fetchWithBQ({
                    url: "/products/new-arrivals",
                    params: {
                        page: args?.page ?? 0,
                        size: args?.size ?? 10,
                    },
                });

                if (response.error) {
                    return { error: response.error };
                }

                return enrichProductsWithDetails(
                    response.data as ProductsResponse,
                    fetchWithBQ,
                );
            },
            providesTags: ["Products"],
        }),

        getFeaturedProducts: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            async queryFn(args, _api, _extraOptions, fetchWithBQ) {
                const response = await fetchWithBQ({
                    url: "/products/featured",
                    params: {
                        page: args?.page ?? 0,
                        size: args?.size ?? 10,
                    },
                });

                if (response.error) {
                    return { error: response.error };
                }

                return enrichProductsWithDetails(
                    response.data as ProductsResponse,
                    fetchWithBQ,
                );
            },
            providesTags: ["Products"],
        }),

        getBestSellers: builder.query<ProductsResponse, { page?: number; size?: number } | void>({
            async queryFn(args, _api, _extraOptions, fetchWithBQ) {
                const response = await fetchWithBQ({
                    url: "/products/best-sellers",
                    params: {
                        page: args?.page ?? 0,
                        size: args?.size ?? 10,
                    },
                });

                if (response.error) {
                    return { error: response.error };
                }

                return enrichProductsWithDetails(
                    response.data as ProductsResponse,
                    fetchWithBQ,
                );
            },
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
