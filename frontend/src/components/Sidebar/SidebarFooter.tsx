import { LogOut } from 'lucide-react';
import { NavItem } from './NavItem';

interface SidebarFooterProps {
    isOpen: boolean;
}

export function SidebarFooter({ isOpen }: SidebarFooterProps) {
    return (
        <div className="mt-auto pt-4 flex flex-col gap-2 relative z-10 border-t border-white/10">
            {/* Log Out Icon (Reusing NavItem) */}
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