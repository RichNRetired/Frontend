export const getCurrentUser = () => {
    // Logic to get current user from localStorage or context
    return JSON.parse(localStorage.getItem('user') || 'null');
};

export const setCurrentUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const clearCurrentUser = () => {
    localStorage.removeItem('user');
};