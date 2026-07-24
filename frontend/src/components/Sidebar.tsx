import { useState } from 'react';
import { MessageSquare, History, HelpCircle } from 'lucide-react';

import { SidebarBackground } from './SidebarBackground';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { NavItem } from './NavItem';
import { SidebarRecents } from './sidebarRecents';
<<<<<<< HEAD

=======
>>>>>>> main

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const iconClass = `transition-all duration-300 w-[16px] h-[16px]`;

    const topItems = [
        { icon: <MessageSquare className={iconClass} />, label: 'New chat', path: '/chat', onClick: () => window.dispatchEvent(new Event('reset-chat')) },
        { icon: <History className={iconClass} />, label: 'Search chats', path: '/history' },
        { icon: <HelpCircle className={iconClass} />, label: 'FAQs', path: '/faqs' },
    ];

    return (
        <aside
            className={`h-screen flex flex-col py-4 relative z-50 overflow-hidden flex-shrink-0 text-red-50 bg-[#4a040b] border-r border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.25)] transition-[width,padding] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'w-64 px-2' : 'w-14 px-1.5'}`}
        >
            <SidebarBackground />

            <SidebarHeader isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

            <nav className="flex-1 flex flex-col overflow-hidden relative z-10">
                <div className="space-y-1.5 shrink-0">
                    {topItems.map((item, index) => (
                        <NavItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            isOpen={isOpen}
                            to={item.path}
                            onClick={item.onClick}
                        />
                    ))}
                </div>

                <SidebarRecents isOpen={isOpen} />
            </nav>

            <SidebarFooter isOpen={isOpen} />
        </aside>
    );
}