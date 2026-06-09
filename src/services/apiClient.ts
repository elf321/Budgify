const BASE_URL = 'http://localhost:8080/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

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
    post: async <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(data),
        });
        const body = await parseJsonSafely(response);
        if (!response.ok) {
            const message =
                (body && typeof body === 'object' && ('message' in body) && (body as any).message) ||
                `HTTP ${response.status}`;
            throw new Error(message);
        }
        return body as T;
    },
    get: async <T = unknown>(endpoint: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: buildHeaders(false),
        });
        const body = await parseJsonSafely(response);
        if (!response.ok) {
            const message =
                (body && typeof body === 'object' && ('message' in body) && (body as any).message) ||
                `HTTP ${response.status}`;
            throw new Error(message);
        }
        return body as T;
    }
};

function buildHeaders(includeJson = true): Record<string, string> {
    const headers: Record<string, string> = {};
    if (includeJson) {
        headers['Content-Type'] = 'application/json';
    }
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }
    return headers;
}
