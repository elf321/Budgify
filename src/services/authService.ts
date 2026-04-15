const API_URL = "http://localhost:8080/api/users";

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        throw new Error("Login Failed!");
    }
    return response.json();
};

export const register = async (userData: any) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Register Failed!");
    }
    return response.json();
};
