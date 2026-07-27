import type { RegisterRequest, LoginRequest, LoginResponse, RegisterResponse } from '@ai-assistant/shared';

const baseURL = import.meta.env.VITE_BASE_URL;

async function handleResponse(response: Response) {
    const contentType = response.headers.get("content-type");
    let data = null;
    
    if (contentType && contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch (e) {
            // Ignore parse errors, handled below
        }
    }

    if (!response.ok) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        
        if (response.status === 401) {
            errorMessage = 'Invalid credentials.';
        } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
        }

        if (data && data.message) {
            if (Array.isArray(data.message)) {
                errorMessage = data.message.join(', ');
            } else if (typeof data.message === 'string') {
                errorMessage = data.message;
            }
        }
        
        throw new Error(errorMessage);
    }

    return data;
}

export async function registerService(formData: RegisterRequest): Promise<RegisterResponse> {
    try {
        const response = await fetch(baseURL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
}

export async function loginService(formData: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch(baseURL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return await handleResponse(response);
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
}