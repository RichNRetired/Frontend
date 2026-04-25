import { Product } from "./productTypes";

export const getProductImageUrls = (product: Partial<Product> | null | undefined): string[] => {
    if (!product) return [];

    const urlsFromImages = (product.images || [])
        .map((image) => image?.imageUrl)
        .filter((url): url is string => Boolean(url));

    const fallback = [product.main_image, product.medium_image, product.thumbnail_image]
        .filter((url): url is string => Boolean(url));

    const baseImages = [...new Set([...urlsFromImages, ...fallback])];

    // If no product-level images, fall back to variant images
    if (baseImages.length === 0) {
        const variantImages = (product.variants || [])
            .filter((v) => v.isActive && v.imageUrl)
            .map((v) => v.imageUrl as string);
        return [...new Set(variantImages)];
    }

    return baseImages;
};

export const getPrimaryProductImage = (product: Partial<Product> | null | undefined): string | undefined => {
    return getProductImageUrls(product)[0];
};
