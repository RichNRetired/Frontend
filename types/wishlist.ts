export interface WishlistItem {
    productId: number;
    productName: string;
    image: string;
    price: number;
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
