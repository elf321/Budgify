import { apiClient } from './apiClient';
import { CreateTargetInput, TargetStatus } from '../types';

export async function getTargetStatusList(userId: number): Promise<TargetStatus[]> {
    const response = await apiClient.get(`/targets/user/${userId}`);
    if (!Array.isArray(response)) {
        return [];
    }
    return response.map((item) => ({
        ...item,
        targetAmount: Number(item.targetAmount) || 0,
        currentSpent: Number(item.currentSpent) || 0,
        remainingAmount: Number(item.remainingAmount) || 0,
        progressPercentage: Number(item.progressPercentage) || 0,
    }));
}

export async function createTarget(userId: number, input: CreateTargetInput): Promise<void> {
    await apiClient.post(`/targets/user/${userId}`, input);
}
