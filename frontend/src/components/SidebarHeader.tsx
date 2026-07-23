import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarHeaderProps {
    isOpen: boolean;
    toggle: () => void;
}

export function SidebarHeader({ isOpen, toggle }: SidebarHeaderProps) {
    return (
        <div className={`flex items-center w-full mb-4 transition-all duration-300 ${isOpen ? 'justify-between px-1' : 'justify-center'}`}>

            {/* LEFT SIDE: Logo & Title */}
            <div className="flex items-center">

                {/* Logo Container */}
                <button
                    onClick={!isOpen ? toggle : undefined}
                    disabled={isOpen} // Disables click when open so it acts like a static image
                    className={`relative w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm overflow-hidden transition-all duration-300 ${!isOpen ? 'hover:bg-white/20 group cursor-pointer' : 'cursor-default'}`}
                >
                    {/* Seiwa Logo */}
                    <img
                        src="../../images/Seiwa-Logo.png"
                        alt="Seiwa Kaiun Logo"
                        className={`absolute inset-0 m-auto w-6 h-6 object-contain transition-opacity duration-200 ${!isOpen ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'}`}
                    />

                    {/* Hover State: Open Sidebar Icon (Only renders when closed) */}
                    {!isOpen && (
                        <div className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                            <PanelLeftOpen size={20} strokeWidth={2.5} />
                        </div>
                    )}
                </button>

                {/* App Title */}
                <div className={`overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center
                    ${isOpen ? 'max-w-[200px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
                `}>
                    <span className="font-['Cambria'] font-semibold text-white tracking-wide text-[14px] whitespace-nowrap drop-shadow-md">
                        SKPI Chatbot
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Close Button (Only visible when Open) */}
            <div className={`overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center
                ${isOpen ? 'max-w-[40px] opacity-100' : 'max-w-0 opacity-0'}
            `}>
                <button
                    onClick={toggle}
                    title="Collapse Sidebar"
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none flex-shrink-0"
                >
                    <PanelLeftClose size={20} strokeWidth={2.5} />
                </button>
            </div>

        </div>
    );
}