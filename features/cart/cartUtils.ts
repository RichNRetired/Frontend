export const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartItemCount = (items: any[]) => {
    return items.reduce((count, item) => count + item.quantity, 0);
};