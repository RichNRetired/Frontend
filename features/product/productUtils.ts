import { Product } from "./productTypes";

export const getProductImageUrls = (product: Partial<Product> | null | undefined): string[] => {
    if (!product) return [];

    const urlsFromImages = (product.images || [])
        .map((image) => image?.imageUrl)
        .filter((url): url is string => Boolean(url));

    const fallback = [product.main_image, product.medium_image, product.thumbnail_image]
        .filter((url): url is string => Boolean(url));

    return [...new Set([...urlsFromImages, ...fallback])];
};

export const getPrimaryProductImage = (product: Partial<Product> | null | undefined): string | undefined => {
    return getProductImageUrls(product)[0];
};
