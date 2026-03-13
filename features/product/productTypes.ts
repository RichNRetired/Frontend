export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    size: string;
    color: string;
    mrp: number;
    costPrice: number;
    sellingPrice: number;
    isActive: boolean;
    availableStock: number;
}

export interface ProductImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    position: number;
}

export interface Product {
    status?: string;
    id: number;
    name: string;
    brand: string;
    sku?: string;
    slug: string;
    description: string;
    mrp: number;
    price: number;
    stock: number;
    returnable: boolean;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    attributes: Record<string, string>;
    category?: ProductCategory;
    variants?: ProductVariant[];
    images: ProductImage[];
    short_description?: string;
    discount_percent?: number;
    tax_percent?: number;
    in_stock?: boolean;
    stock_status?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | string;
    average_rating?: number;
    total_reviews?: number;
    cod_available?: boolean;
    delivery_days?: number;
    main_image?: string;
    thumbnail_image?: string;
    medium_image?: string;
    is_active?: boolean;
    created_at?: string;
}

export interface ProductsResponse {
    content: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface GetProductsByLocationParams {
    locationId: number;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    brand?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface ProductFilterRequest {
    search?: string;
    sectionId?: number;
    categoryId?: number;
    subCategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    brand?: string;
    size?: string;
    brands?: string[];
    inStockOnly?: boolean;
    minRating?: number;
    codAvailable?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface ProductFilterOptions {
    [key: string]: unknown;
}

export interface ProductBreadcrumbItem {
    id: number;
    level: string;
    name: string;
    link: string;
    slug: string;
    type: string;
    url: string;
}