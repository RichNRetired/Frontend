export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'shipped' | 'delivered';
    createdAt: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}