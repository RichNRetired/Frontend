export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};