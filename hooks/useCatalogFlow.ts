import { useState, useEffect } from 'react';
import {
    useGetSectionsQuery,
    useGetCategoriesQuery,
    useGetSubcategoriesQuery,
    useGetFiltersQuery,
} from '@/features/category/categoryApi';

export interface CatalogFlowState {
    sectionId: number | null;
    categoryId: number | null;
    subCategoryId: number | null;
    search?: string;
}

export function useCatalogFlow(initialSearch?: string) {
    const [state, setState] = useState<CatalogFlowState>({
        sectionId: null,
        categoryId: null,
        subCategoryId: null,
        search: initialSearch,
    });

    // Queries - skip when dependencies are not set
    const sectionsQuery = useGetSectionsQuery();
    const categoriesQuery = useGetCategoriesQuery(state.sectionId!, {
        skip: !state.sectionId,
    });
    const subcategoriesQuery = useGetSubcategoriesQuery(state.categoryId!, {
        skip: !state.categoryId,
    });
    const filtersQuery = useGetFiltersQuery(state.subCategoryId!, {
        skip: !state.subCategoryId,
    });

    // Handle section selection - reset children
    const setSectionId = (sectionId: number | null) => {
        setState({
            sectionId,
            categoryId: null,
            subCategoryId: null,
        });
    };

    // Handle category selection - reset children
    const setCategoryId = (categoryId: number | null) => {
        setState((prev) => ({
            ...prev,
            categoryId,
            subCategoryId: null,
        }));
    };

    // Handle subcategory selection
    const setSubCategoryId = (subCategoryId: number | null) => {
        setState((prev) => ({
            ...prev,
            subCategoryId,
        }));
    };

    return {
        // State
        state,

        // Setters
        setSectionId,
        setCategoryId,
        setSubCategoryId,

        // Queries
        sections: sectionsQuery.data || [],
        categories: categoriesQuery.data || [],
        subcategories: subcategoriesQuery.data || [],
        filters: filtersQuery.data || {},

        // Loading states
        isLoadingSections: sectionsQuery.isLoading,
        isLoadingCategories: categoriesQuery.isLoading,
        isLoadingSubcategories: subcategoriesQuery.isLoading,
        isLoadingFilters: filtersQuery.isLoading,

        // Error states
        errorSections: sectionsQuery.error,
        errorCategories: categoriesQuery.error,
        errorSubcategories: subcategoriesQuery.error,
        errorFilters: filtersQuery.error,
    };
}
