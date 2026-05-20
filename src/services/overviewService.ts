import { apiClient } from './apiClient';
import { Overview } from '../types';

export async function getOverview(userId: number): Promise<Overview> {
    const response = await apiClient.get(`/overview/user/${userId}`);
    return response as Overview;
}
