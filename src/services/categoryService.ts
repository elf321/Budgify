import { apiClient } from './apiClient';
import { Category } from '../types';

export async function getCategoriesByType(type: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
    const response = await apiClient.get(`/categories/type/${type}`);
    return response as Category[];
}