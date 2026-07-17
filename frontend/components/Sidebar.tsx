import React, { useState } from 'react';
import {
    MessageSquare,
    History,
    HelpCircle,
    LifeBuoy,
    Plus,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import NewInquiryModal from './NewInquiryModal';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Chat');

    const navItems = [
        { label: 'Chat', icon: MessageSquare },
        { label: 'History', icon: History },
        { label: 'FAQs', icon: HelpCircle },
        { label: 'Support', icon: LifeBuoy },
    ];

    return (
        <>
            <aside
                className={`relative flex h-screen flex-col bg-white/60 backdrop-blur-md border-r border-gray-100 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
            >
                {/* Header section matches Screenshot 2026-07-17 143152.jpg */}
                <div className={`flex items-center p-6 ${isCollapsed ? 'justify-center px-4' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-red-700">Seiwa Kaiun</h1>
                            <p className="text-xs text-gray-500 font-mono">Logistics Intelligence</p>
                        </div>
                    )}
                    {isCollapsed && <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">SK</div>}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-2 px-4 py-4">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.label}
                            isCollapsed={isCollapsed}
                            onClick={() => setActiveTab(item.label)}
                        />
                    ))}
                </nav>

                {/* Action Button & Footer */}
                <div className="px-4 pb-6 space-y-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`flex w-full items-center justify-center rounded-xl bg-red-50 py-3 text-red-700 transition-colors hover:bg-red-100
              ${isCollapsed ? 'px-0' : 'px-4'}
            `}
                    >
                        <Plus size={20} />
                        {!isCollapsed && <span className="ml-2 text-sm font-semibold">New Inquiry</span>}
                    </button>

                    <div className={`flex items-center text-gray-500 pt-4 border-t border-gray-100
            ${isCollapsed ? 'flex-col space-y-4' : 'justify-between'}
          `}>
                        <button className="hover:text-gray-800 transition-colors">
                            <Settings size={20} />
                        </button>

                        {/* Toggle Collapse Button */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hover:text-gray-800 transition-colors rounded-full p-1 bg-gray-50"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>

                        <button className="hover:text-red-500 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Render the Modal */}
            <NewInquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;