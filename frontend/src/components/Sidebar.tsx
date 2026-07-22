import { useState } from 'react';
import { MessageSquare, History, HelpCircle, Plus } from 'lucide-react';

import { SidebarBackground } from './SidebarBackground';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { NavItem } from './NavItem';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const topItems = [
        { icon: <MessageSquare size={20} />, label: 'Chat', path: '/chat' },
        { icon: <History size={20} />, label: 'History', path: '/history' },
        { icon: <HelpCircle size={20} />, label: 'FAQs', path: '/faqs' },
    ];

    return (
        <aside
            className={`h-screen flex flex-col transition-all duration-500 ease-in-out py-5 px-4 relative z-50 overflow-hidden flex-shrink-0 text-red-50
            bg-white/5 backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.25)]
            ${isOpen ? 'w-64' : 'w-20'}
            `}
        >
            <SidebarBackground />

            <SidebarHeader isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

            <NavItem
                icon={<Plus size={20} />}
                label="New Chat"
                isOpen={isOpen}
                to="/chat"
                isPrimary={true}
            />

            <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 scrollbar-hide relative z-10">
                {topItems.map((item, index) => (
                    <NavItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        isOpen={isOpen}
                        to={item.path}
                    />
                ))}
            </nav>

            <SidebarFooter isOpen={isOpen} />
        </aside >
    );
}