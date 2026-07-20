import { type RegisterRequest, type LoginRequest } from '@ai-assistant/shared';

export async function registerService(formData: RegisterRequest): Promise<string> {

    const baseURL = import.meta.env.VITE_BASE_URL;

    try {
        const registerResponse = await fetch(baseURL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        return registerResponse.text();

    } catch (error) {
        throw new Error('Failed to register', error);
    }
}

export async function loginService(formData: LoginRequest): Promise<string> {

    const baseURL = import.meta.env.VITE_BASE_URL;

    try {
        const loginResponse = await fetch(baseURL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        return loginResponse.text();

    } catch (error) {
        throw new Error('Failed to log in', error);
    }
}