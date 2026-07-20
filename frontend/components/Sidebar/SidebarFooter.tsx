import { LogOut } from 'lucide-react';
import { NavItem } from './NavItem';

interface SidebarFooterProps {
    isOpen: boolean;
}

export function SidebarFooter({ isOpen }: SidebarFooterProps) {
    return (
        <div className="mt-auto pt-4 flex flex-col gap-2 relative z-10 border-t border-white/10">
            {/* Left Side: Profile Avatar & Name */}
            <button
                onClick={() => alert("Navigating to Profile...")}
                className={`flex items-center w-full p-2 rounded-xl transition-colors group
                    ${isOpen ? 'hover:bg-black/20 bg-black/10' : 'hover:bg-white/10'}
                `}
                title={!isOpen ? "Profile" : undefined}
            >
                <div className="w-9 h-9 rounded-full bg-red-900 flex items-center justify-center flex-shrink-0 border border-white/20 overflow-hidden shadow-md">
                    <img
                        src="https://ui-avatars.com/api/?name=Ali&background=7f1d1d&color=fef2f2"
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out flex flex-col items-start text-left
                    ${isOpen ? 'max-w-[200px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
                `}>
                    <span className="text-sm font-semibold whitespace-nowrap text-white">Ali</span>
                    <span className="text-[11px] text-red-200/70 whitespace-nowrap mt-0.5">View Profile</span>
                </div>
            </button>

            {/* Right Side: Log Out Icon (Reusing NavItem) */}
            <NavItem
                icon={<LogOut size={18} />}
                label="Log Out"
                isOpen={isOpen}
                onClick={() => alert("Logging out...")}
                isDanger={true}
            />
        </div>
    );
}