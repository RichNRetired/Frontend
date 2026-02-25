export interface Product {
    status?: string;
    id: number;
    name: string;
    brand: string;
    sku?: string;
    slug: string;
    description: string;
    short_description: string;
    mrp: number;
    price: number;
    discount_percent: number;
    tax_percent: number;
    stock: number;
    returnable: boolean;
    images: Array<{
        id: number;
        imageUrl: string;
        isPrimary: boolean;
        position: number;
    }>;
    attributes: Record<string, string>;
    average_rating: number;
    total_reviews: number;
    cod_available: boolean;
    delivery_days: number;
    is_active: boolean;
    main_image?: string;
    thumbnail_image?: string;
    medium_image?: string;
    created_at?: string;
}
