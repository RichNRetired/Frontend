import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Section, Category, Subcategory, Filters } from '@/types/catalog';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, ''),
        credentials: 'include',
        prepareHeaders: (headers) => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const tokenType = typeof window !== 'undefined' ? localStorage.getItem('tokenType') || 'Bearer' : 'Bearer';
                if (token) headers.set('Authorization', `${tokenType} ${token}`);
            } catch (e) {

            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Get all sections
        getSections: builder.query<Section[], void>({
            query: () => '/api/catalog/sections',
        }),

        // Get categories by section
        getCategories: builder.query<Category[], number>({
            query: (sectionId) => `/api/catalog/categories?sectionId=${sectionId}`,
        }),

        // Get subcategories by category
        getSubcategories: builder.query<Subcategory[], number>({
            query: (categoryId) => `/api/catalog/subcategories?categoryId=${categoryId}`,
        }),

        // Get filters by subcategory
        getFilters: builder.query<Filters, number>({
            query: (subCategoryId) => `/api/catalog/filters?subCategoryId=${subCategoryId}`,
        }),
    }),
});

export const {
    useGetSectionsQuery,
    useGetCategoriesQuery,
    useGetSubcategoriesQuery,
    useGetFiltersQuery
} = categoryApi;
