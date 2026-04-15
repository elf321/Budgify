import { apiClient } from './apiClient';

export async function getAllCategories() {
    try {
        const response = await apiClient.get('/categories');
        if (Array.isArray(response)) return response;
        if (response && Array.isArray((response as any).data)) return (response as any).data;
        return [];
    } catch (error) {
        console.error("An error occurred while loading the categories:", error);
        throw error;
    }
}