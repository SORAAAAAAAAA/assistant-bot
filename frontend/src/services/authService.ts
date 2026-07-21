import type { RegisterRequest, LoginRequest, LoginResponse, RegisterResponse } from '@ai-assistant/shared';

const baseURL = import.meta.env.VITE_BASE_URL;

export async function registerService(formData: RegisterRequest): Promise<RegisterResponse> {

    const registerResponse = await fetch(baseURL + '/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })

    const data = await registerResponse.json();

    if (!registerResponse.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function loginService(formData: LoginRequest): Promise<LoginResponse> {

    const loginResponse = await fetch(baseURL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })

    const data = await loginResponse.json();

    if (!loginResponse.ok) {
        throw new Error(data.message);
    }

    return data;
}