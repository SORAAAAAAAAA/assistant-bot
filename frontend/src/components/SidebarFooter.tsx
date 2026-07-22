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
        <div className="w-full mt-auto pl-1 pt-4 flex items-center relative z-10 border-t border-white/10">

            {/* Avatar — always visible, pinned left (mirrors nav icon behaviour) */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm font-bold text-white shadow-sm select-none">
                {initial}
            </div>

            {/* Username — takes remaining space, slides in */}
            <div className={`flex-1 overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isOpen ? 'opacity-100 ml-2 max-w-full' : 'opacity-0 ml-0 max-w-0'}
            `}>
                <span className="text-sm font-semibold text-red-50 truncate whitespace-nowrap block">
                    {userName}
                </span>
            </div>

            {/* Logout button — pinned to far right, slides in */}
            <div className={`flex-shrink-0 overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isOpen ? 'max-w-[40px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}
            `}>
                <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 rounded-xl text-red-200 hover:text-white hover:bg-red-500/40 transition-all duration-300"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                </button>
            </div>

        </div>
    );
}