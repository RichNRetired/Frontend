export interface Product {
    id: number;
    name: string;
    brand: string;
    slug: string;
    description: string;
    mrp: number;
    price: number;
    stock: number;
    returnable: boolean;
    images: string[];
    attributes: Record<string, string>;
    short_description: string;
    discount_percent: number;
    tax_percent: number;
    average_rating: number;
    total_reviews: number;
    cod_available: boolean;
    delivery_days: number;
    is_active: boolean;
}

export interface ProductsResponse {
    content: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}