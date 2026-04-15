const BASE_URL = 'http://localhost:8080/api';

async function parseJsonSafely(response: Response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export const apiClient = {
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const body = await parseJsonSafely(response);
        if (!response.ok) {
            const message =
                (body && typeof body === 'object' && ('message' in body) && (body as any).message) ||
                `HTTP ${response.status}`;
            throw new Error(message);
        }
        return body;
    },
    get: async (endpoint: string) => {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        const body = await parseJsonSafely(response);
        if (!response.ok) {
            const message =
                (body && typeof body === 'object' && ('message' in body) && (body as any).message) ||
                `HTTP ${response.status}`;
            throw new Error(message);
        }
        return body;
    }
};