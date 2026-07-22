import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/authContext';

interface SidebarFooterProps {
    isOpen: boolean;
}

/** Safely decode a JWT and return its payload, or null on failure. */
function decodeJwtPayload(token: string | null): Record<string, unknown> | null {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function SidebarFooter({ isOpen }: SidebarFooterProps) {
    const { logout, token } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Decode the username from the JWT payload; fall back to "User" if unavailable
    const payload = decodeJwtPayload(token);
    const userName =
        (payload?.name as string) ||
        (payload?.username as string) ||
        (payload?.sub as string) ||
        "User";
    const initial = userName.charAt(0).toUpperCase();

    return (
        <div className={`w-full mt-auto pt-4 flex items-center relative z-10 border-t border-white/10 transition-all duration-300 ${isOpen ? 'justify-between px-1' : 'justify-center'}`}>

            {/* Profile Section (Left Side) - Only renders when Sidebar is open */}
            {isOpen && (
                <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm font-bold text-white shadow-sm select-none">
                        {initial}
                    </div>
                    <span className="text-sm font-semibold text-red-50 truncate">
                        {userName}
                    </span>
                </div>
            )}

            {/* Log Out Button (Right Side / Centered when collapsed) */}
            <button
                onClick={handleLogout}
                title="Log Out"
                className="flex flex-shrink-0 items-center justify-center p-1.5 rounded-xl text-red-200 hover:text-white hover:bg-red-500/40 transition-all duration-300"
            >
                <LogOut size={18} strokeWidth={2.5} />
            </button>

        </div>
    );
}