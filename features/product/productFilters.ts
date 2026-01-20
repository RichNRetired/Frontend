export const productFilters = {
    category: '',
    priceRange: [0, 1000],
    size: '',
    color: '',
};

export const applyFilters = (products: any[], filters: typeof productFilters) => {
    return products.filter((product) => {
        if (filters.category && product.category !== filters.category) return false;
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
        if (filters.size && !product.sizes.includes(filters.size)) return false;
        if (filters.color && product.color !== filters.color) return false;
        return true;
    });
};