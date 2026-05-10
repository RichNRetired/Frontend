export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price);
};

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

/**
 * Converts a raw DB order ID into an Amazon-style display ID.
 * Format: RNR-YYMM-XXXXXXX
 * e.g. order 48 placed May 2026 → RNR-2605-0000048
 */
export const formatOrderId = (orderId: number, createdAt?: string): string => {
    const date = createdAt ? new Date(createdAt) : new Date();
    const yy = String(date.getFullYear()).slice(2);           // "26"
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // "05"
    const id = String(orderId).padStart(7, "0");              // "0000048"
    return `RNR-${yy}${mm}-${id}`;
};