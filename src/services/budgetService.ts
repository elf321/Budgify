import { apiClient } from './apiClient';
import { Budget } from '../types'; 

export async function getUserBudgets(userId: number): Promise<Budget[]> {
    try {
        console.log(`${userId} için bütçe isteği atılıyor...`);
        const response = await apiClient.get(`/budgets/user/${userId}`);
        
        console.log("apiClient'dan gelen veri:", response); 
        
        return response as Budget[]; 
    } catch (error) {
        console.error("getUserBudgets Hatası:", error);
        return [];
    }
}

export async function createBudget(input: any): Promise<Budget> {
    const response = await apiClient.post('/budgets', input);
    return response as Budget;
}