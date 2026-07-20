import type { ReactNode } from 'react';

interface NavItemProps {
    icon: ReactNode;
    label: string;
    isOpen: boolean;
    onClick: () => void;
    isDanger?: boolean;
    isPrimary?: boolean;
}

export function NavItem({ icon, label, isOpen, onClick, isDanger = false, isPrimary = false }: NavItemProps) {

    // Define base styles depending on whether it's a primary action (New Inquiry), danger, or normal link
    const baseStyles = isPrimary
        ? "bg-red-600/60 hover:bg-red-500/80 backdrop-blur-md border border-red-400/40 text-white shadow-lg mb-8"
        : isDanger
            ? "hover:bg-red-500/40 hover:text-white border border-transparent hover:border-red-400/30 text-red-200"
            : "text-red-100 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 hover:shadow-sm";

    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full rounded-xl transition-all duration-200 group p-3 ${baseStyles}`}
            title={!isOpen ? label : undefined}
        >
            <div className={`flex items-center justify-center flex-shrink-0 w-6 h-6 transition-transform duration-200 ${isOpen ? '' : 'group-hover:scale-110'}`}>
                {icon}
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out flex items-center
                ${isOpen ? 'max-w-[200px] opacity-100 ml-3' : 'max-w-0 opacity-0 ml-0'}
            `}>
                <span className="whitespace-nowrap font-medium text-sm tracking-wide">
                    {label}
                </span>
            </div>
        </button>
    );
}