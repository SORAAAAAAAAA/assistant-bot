import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { getLocalUserProfile } from '@/lib/userUtils';


interface SidebarFooterProps {
    isOpen: boolean;
}


export function SidebarFooter({ isOpen }: SidebarFooterProps) {
    const { logout } = useAuth();
    const userProfile = getLocalUserProfile();

    const handleLogout = () => {
        logout();
    };

    if (!userProfile) {
        return null;
    }

    return (
        <div className={`w-full  mt-auto pt-3 flex items-center relative z-10 border-t border-white/10 transition-all duration-300 ${isOpen ? 'px-2.5' : 'justify-center px-0'}`}>

            {/* Avatar */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold text-white shadow-sm select-none">
                {userProfile.fullName.charAt(0).toUpperCase()}
            </div>

            {/* Text container: Name and Subtitle */}
            <div className={`flex-1 flex flex-col justify-center items-start text-left overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isOpen ? 'opacity-100 ml-2.5 mr-2 max-w-full' : 'opacity-0 ml-0 max-w-0'}
            `}>
                <span className="text-[13px] font-semibold text-white truncate whitespace-nowrap block leading-tight">
                    {userProfile.fullName}
                </span>
                <span className="text-[11px] font-medium text-white/50 truncate whitespace-nowrap block">
                    {userProfile.department}
                </span>
            </div>

            {/* Logout button — pinned to far right, slides in */}
            <div className={`flex-shrink-0 overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isOpen ? 'max-w-[40px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}
            `}>
                <button
                    onClick={handleLogout}
                    title="Settings"
                    className="rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                >
                    <LogOut size={18} strokeWidth={2.5} />
                </button>
            </div>

        </div>
    );
}