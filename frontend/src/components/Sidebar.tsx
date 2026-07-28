import { useState, useEffect } from 'react';
import { MessageSquare, History, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { SidebarBackground } from './SidebarBackground';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { NavItem } from './NavItem';
import { SidebarRecents } from './sidebarRecents';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when navigating
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const iconClass = `transition-all duration-300 w-[16px] h-[16px]`;

    const topItems = [
        { icon: <MessageSquare className={iconClass} />, label: 'New chat', path: '/chat', onClick: () => window.dispatchEvent(new Event('reset-chat')) },
        { icon: <History className={iconClass} />, label: 'Search chats', path: '/history' },
    ];

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-3 left-3 z-[60] p-2 bg-white/70 backdrop-blur-md border border-white/40 rounded-xl text-[#4a040b] shadow-sm hover:bg-white transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`h-[100dvh] flex flex-col py-4 z-[100] overflow-hidden flex-shrink-0 text-red-50 bg-[#4a040b] border-r border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.25)] transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                fixed md:relative inset-y-0 left-0
                ${isMobileOpen ? 'translate-x-0 w-64 px-2' : '-translate-x-full md:translate-x-0'}
                ${!isMobileOpen ? (isOpen ? 'w-64 px-2' : 'w-14 px-1.5') : ''}
                `}
            >
                {/* Close Button for Mobile inside Sidebar */}
                <button
                    className="md:hidden absolute top-4 right-2 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors z-50"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <X className="w-5 h-5" />
                </button>

                <SidebarBackground />

                <SidebarHeader isOpen={isMobileOpen ? true : isOpen} toggle={() => setIsOpen(!isOpen)} />

                <nav className="flex-1 flex flex-col overflow-hidden relative z-10 mt-2">
                    <div className="space-y-1.5 shrink-0">
                        {topItems.map((item, index) => (
                            <NavItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                isOpen={isMobileOpen ? true : isOpen}
                                to={item.path}
                                onClick={item.onClick}
                            />
                        ))}
                    </div>

                    <SidebarRecents isOpen={isMobileOpen ? true : isOpen} />
                </nav>

                <SidebarFooter isOpen={isMobileOpen ? true : isOpen} />
            </aside>
        </>
    );
}