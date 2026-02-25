export interface Section {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
}

export interface CatalogProductSummary {
    id: number;
    name: string;
    status?: string;
    slug?: string;
    brand?: string;
    shortDescription?: string;
    description?: string;
    price?: number;
    taxPercent?: number;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    stock?: number;
    minPrice?: number;
    maxPrice?: number;
    totalStock?: number;
}

export interface Category {
    id: number;
    name: string;
    isActive: boolean;
    parent?: string;
    subCategories?: string[];
    products?: CatalogProductSummary[];
    slug?: string;
    section?: Section;
}

export interface Subcategory {
    id: number;
    name: string;
    isActive: boolean;
    category: Category;
}

export type Filters = Record<string, string[]>;
