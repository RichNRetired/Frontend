import { fetcher } from "@/lib/api";
import { Section, Category, Subcategory, Filters } from "@/types/catalog";

export const getSections = () => {
    return fetcher<Section[]>("/api/catalog/sections");
};

export const getCategories = (sectionId: number) => {
    return fetcher<Category[]>(`/api/catalog/categories?sectionId=${sectionId}`);
};

export const getSubcategories = (categoryId: number) => {
    return fetcher<Subcategory[]>(
        `/api/catalog/subcategories?categoryId=${categoryId}`
    );
};

export const getFilters = (subCategoryId: number) => {
    return fetcher<Filters>(`/api/catalog/filters?subCategoryId=${subCategoryId}`);
};
