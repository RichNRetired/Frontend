export interface Product {
    id: number;
    name: string;
    brand: string;
    slug: string;
    description: string;
    short_description: string;
    mrp: number;
    price: number;
    discount_percent: number;
    tax_percent: number;
    stock: number;
    returnable: boolean;
    images: string[];
    attributes: Record<string, string>;
    average_rating: number;
    total_reviews: number;
    cod_available: boolean;
    delivery_days: number;
    is_active: boolean;
}
