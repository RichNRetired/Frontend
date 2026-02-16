export interface Section {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
}

export interface Category {
    id: number;
    name: string;
    isActive: boolean;
    section: Section;
}

export interface Subcategory {
    id: number;
    name: string;
    isActive: boolean;
    category: Category;
}

export type Filters = Record<string, string[]>;
