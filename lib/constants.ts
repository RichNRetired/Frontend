const backendUrl = (
    process.env.NEXT_PUBLIC_API_URL || "https://project-fnwy.onrender.com"
)
    .trim()
    .replace(/\/$/, "");

export const API_URL = `${backendUrl}/api`;

export const ITEMS_PER_PAGE = 20;

export const CATEGORIES = ['men', 'women', 'kids'];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];