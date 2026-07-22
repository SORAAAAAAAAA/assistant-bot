interface SidebarHeaderProps {
    isOpen: boolean;
    toggle: () => void;
}

export function SidebarHeader({ isOpen, toggle }: SidebarHeaderProps) {
    return (
        <button
            onClick={toggle}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className="flex items-center w-full p-1 mb-6 rounded-lg group hover:opacity-80 focus:outline-none transition-colors"
        >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-sm overflow-hidden group-hover:bg-white/20 transition-colors">
                <img
                    src="../../images/Seiwa-Logo.png"
                    alt="Seiwa Kaiun Logo"
                    className="w-12 h-12 object-contain"
                />
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out flex items-center
                ${isOpen ? 'max-w-[200px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
            `}>
                <span className="font-['Cambria'] font-semibold text-white tracking-wide text-[18px] whitespace-nowrap drop-shadow-md">
                    SKPI Chatbot
                </span>
            </div>
        </button>
    );
}