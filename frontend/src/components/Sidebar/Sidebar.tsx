import { useState } from 'react';
import {
    MessageSquare, History, HelpCircle,
    LifeBuoy, Settings, LogOut, Plus
} from 'lucide-react';
import { useAuth } from '@/context/authContext';

export function Sidebar() {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    const topItems = [
        { icon: <MessageSquare size={20} />, label: 'Chat' },
        { icon: <History size={20} />, label: 'History' },
        { icon: <HelpCircle size={20} />, label: 'FAQs' },
    ];

    const bottomItems = [
        { icon: <LifeBuoy size={20} />, label: 'Support' },
        { icon: <Settings size={20} />, label: 'Settings' },
    ];

    const handleLogout = () => {
        logout();
    }

    return (
        <aside
            className={`h-screen flex flex-col transition-all duration-300 py-5 relative z-50 overflow-hidden flex-shrink-0 text-red-50
            bg-gradient-to-b from-red-950/50 to-red-950/30 backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.25)]
        ${isOpen ? 'w-72 px-4' : 'w-20 px-3'}
      `}
        >
            {/* 1. Header: Clickable Logo Toggle */}
            <div className={`flex items-center mb-8 transition-all duration-300 ${isOpen ? 'justify-start' : 'justify-center'}`}>

                {/* Branding Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    className={`flex items-center overflow-hidden transition-all duration-300 rounded-lg group hover:opacity-80 focus:outline-none
                        ${isOpen ? 'p-1 -ml-1 w-full' : 'p-0 justify-center'}
                    `}
                >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm overflow-hidden group-hover:bg-white/20 transition-colors">
                        <img
                            src="../../images/Seiwa-Logo.png"
                            alt="Seiwa Kaiun Logo"
                            className="w-12 h-12 object-contain"
                        />
                    </div>

                    <span className={`ml-3 font-semibold text-white tracking-wide text-[15px] whitespace-nowrap drop-shadow-md transition-all duration-300 
                        ${isOpen ? 'opacity-100' : 'w-0 opacity-0 hidden'}
                    `}>
                        Seiwa Kaiun
                    </span>
                </button>

            </div>

            {/* 2. Glass "New Inquiry" Button */}
            <button
                onClick={() => alert("Open New Inquiry Modal")}
                className={`flex items-center bg-red-600/60 hover:bg-red-500/80 backdrop-blur-md border border-red-400/40 text-white transition-all duration-300 mb-8 flex-shrink-0 shadow-lg group
          ${isOpen ? 'w-full px-4 py-3 rounded-xl space-x-3' : 'p-3 mx-auto justify-center rounded-xl w-12 h-12'}
        `}
            >
                <Plus size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span
                    className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 text-shadow-sm
            ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0 hidden'}
          `}
                >
                    New Inquiry
                </span>
            </button>

            {/* 3. Main Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 scrollbar-hide">
                {topItems.map((item, index) => (
                    <NavItem
                        key={index}
                        item={item}
                        isOpen={isOpen}
                        onClick={() => alert(`You clicked: ${item.label}`)}
                    />
                ))}
            </nav>

            {/* 4. Bottom Section */}
            <div className="mt-auto pt-4 flex flex-col gap-1.5 border-t border-white/10">

                {/* Support & Settings Links */}
                {bottomItems.map((item, index) => (
                    <NavItem
                        key={index}
                        item={item}
                        isOpen={isOpen}
                        onClick={() => alert(`You clicked: ${item.label}`)}
                    />
                ))}

                {/* Profile & Log Out Container */}
                <div
                    className={`mt-3 flex items-center transition-all duration-300
                        ${isOpen
                            ? 'w-full justify-between bg-black/20 hover:bg-black/30 rounded-2xl p-1.5 border border-white/5 shadow-inner'
                            : 'flex-col gap-3 bg-transparent border-none'
                        }
                    `}
                >
                    {/* Left Side: Profile Avatar & Name */}
                    <button
                        onClick={() => alert("Navigating to Profile...")}
                        className={`flex items-center transition-colors group rounded-xl
                            ${isOpen ? 'px-1.5 py-1' : 'p-0 w-full justify-center'}
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
                        {isOpen && (
                            <div className="ml-3 flex flex-col items-start overflow-hidden text-left">
                                <span className="text-sm font-semibold whitespace-nowrap text-white">Ali</span>
                                <span className="text-[11px] text-red-200/70 whitespace-nowrap mt-0.5">View Profile</span>
                            </div>
                        )}
                    </button>

                    {/* Right Side: Log Out Icon */}
                    <button
                        onClick={handleLogout}
                        className={`p-2 rounded-xl transition-all flex-shrink-0
                            ${isOpen
                                ? 'text-red-300 hover:text-white hover:bg-red-500/50 mr-1'
                                : 'text-red-400 hover:text-white hover:bg-red-500/40 w-11 h-11 flex items-center justify-center'
                            }
                        `}
                        title={!isOpen ? "Log Out" : undefined}
                    >
                        <LogOut size={18} />
                    </button>
                </div>

            </div>
        </aside>
    );
}

// Reusable Navigation Item Component
function NavItem({ item, isOpen, isDanger = false, onClick }: { item: any, isOpen: boolean, isDanger?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full rounded-xl transition-all duration-200 group
        ${isOpen ? 'px-4 py-3' : 'p-3 justify-center mx-auto w-12 h-12'}
        ${isDanger
                    ? 'hover:bg-red-500/40 hover:text-white border border-transparent hover:border-red-400/30'
                    : 'text-red-100 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 hover:shadow-sm'
                }
      `}
            title={!isOpen ? item.label : undefined}
        >
            <span className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? '' : 'group-hover:scale-110'}`}>
                {item.icon}
            </span>
            {isOpen && (
                <span className="ml-4 whitespace-nowrap font-medium text-sm tracking-wide">
                    {item.label}
                </span>
            )}
        </button>
    );
}