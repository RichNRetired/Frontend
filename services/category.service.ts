import axios from './axios';

export interface Category {
    id: number;
    name: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await axios.get('/categories');
    return response.data;
};
