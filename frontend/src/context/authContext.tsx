import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return true;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const { exp } = JSON.parse(jsonPayload);
        if (!exp) return false;

        return exp * 1000 < Date.now();
    } catch (e) {
        return true; // we treat it invalid if cannot parse
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const isAuthBypassed = import.meta.env.VITE_BYPASS_AUTH === 'true';
    const [token, setToken] = useState<string | null>(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && isTokenExpired(storedToken)) {
            localStorage.removeItem('token');
            return null;
        }
        return storedToken;
    });

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: isAuthBypassed || !!token && !isTokenExpired(token),
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
