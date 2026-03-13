export interface WishlistItem {
    id: number;
    productId: number;
    variantId: number;
    variantSku: string;
    size: string;
    color: string;
    availableStock: number;
    isActive: boolean;
    note: string;
    priority: number;
    addedAt: string;
    priceChanged: boolean;
    oldPrice: number;
    backInStock: boolean;
    productName: string;
    productSlug: string;
    productBrand: string;
    productImage: string;
    productPrice: number;
    productMrp: number;
    discountPercentage: number;
    variantPrice: number;
    inStock: boolean;
}

export interface WishlistResponse {
    content: WishlistItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
    success?: boolean;
}

export interface AddWishlistRequest {
    productId: number;
    variantId: number;
    quantity: number;
}

export interface MoveWishlistToCartRequest {
    itemIds: number[];
    removeFromWishlist: boolean;
}
