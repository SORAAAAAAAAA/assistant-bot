export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });


    if (response.status === 401) {
        console.warn('Session expired. Logging out.');

        localStorage.removeItem('token');

        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }

        throw new Error('Unauthorized');
    }

    return response;
}
