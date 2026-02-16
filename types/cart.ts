export interface CartItem {
    id: string; // cartId from backend (for removal/updates)
    productId: number; // actual product ID
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface Cart {
    items: CartItem[];
}