'use client';

import React, { useState } from 'react';
import {
    MessageSquare,
    Clock,
    HelpCircle,
    HeadphonesIcon,
    Plus,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    onMenuClick?: (menu: string) => void;
    activeMenu?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, activeMenu = 'chat' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'history', label: 'History', icon: Clock },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
        { id: 'support', label: 'Support', icon: HeadphonesIcon },
    ];

    const handleMenuClick = (id: string) => {
        onMenuClick?.(id);
    };

    return (
        <div
            className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
                }`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        SK
                    </div>
                    {!isCollapsed && (
                        <div>
                            <div className="font-semibold text-xl text-gray-900">Seiwa Kaiun</div>
                            <div className="text-xs text-gray-500 -mt-1">Philippines, Inc.</div>
                            <div className="text-[10px] text-red-600 font-medium">Logistics Intelligence</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-10"
            >
                {isCollapsed ? (
                    <ChevronRight size={18} className="text-gray-600" />
                ) : (
                    <ChevronLeft size={18} className="text-gray-600" />
                )}
            </button>

            {/* Navigation */}
            <div className="flex-1 px-3 py-6 overflow-y-auto">
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-red-600" : ""} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* New Inquiry Button */}
                <div className="mt-8 px-3">
                    <button
                        onClick={() => onMenuClick?.('new-inquiry')}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-2xl font-medium text-sm transition-all active:scale-[0.985]"
                    >
                        <Plus size={18} />
                        {!isCollapsed && <span>New Inquiry</span>}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                        title="Settings"
                    >
                        <Settings size={20} />
                        {!isCollapsed && <span className="text-sm">Settings</span>}
                    </button>

                    <button
                        className="flex-1 flex items-center justify-center gap-2 p-3 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;