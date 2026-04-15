import { apiClient } from './apiClient';
import { Transaction } from '../types'; 

export async function createTransaction(input: any) {
    const response = await apiClient.post('/transactions/add', input);
    return response;
}

export async function getUserTransactions(userId: number): Promise<Transaction[]> {
    const response = await apiClient.get(`/transactions/user/${userId}`);
    return response;
}