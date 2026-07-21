import { LogOut } from 'lucide-react';
import { NavItem } from './NavItem';
import { useAuth } from '@/context/authContext';

interface SidebarFooterProps {
    isOpen: boolean;
}

export function SidebarFooter({ isOpen }: SidebarFooterProps) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    }
    return (
        <div className="mt-auto pt-4 flex flex-col gap-2 relative z-10 border-t border-white/10">
            <NavItem
                icon={<LogOut size={18} />}
                label="Log Out"
                isOpen={isOpen}
                onClick={handleLogout}
                isDanger={true}
            />
        </div>
    );
}