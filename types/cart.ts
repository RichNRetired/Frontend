export interface CartItem {
    id: string; // cartId from backend (for removal/updates)
    productId: number; // actual product ID
    variantId: number;
    categoryId?: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
    size?: string;
    mrp?: number;
    discountPercentage?: number;
}

export interface Cart {
    items: CartItem[];
}