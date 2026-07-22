import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    icon: ReactNode;
    label: string;
    isOpen: boolean;
    onClick?: () => void;
    to?: string;
    isDanger?: boolean;
    isPrimary?: boolean;
}

export function NavItem({
    icon,
    label,
    isOpen,
    onClick,
    to,
    isDanger = false,
    isPrimary = false
}: NavItemProps) {

    // Reduced the mb-3 gap down to mb-2 for a slightly tighter transition between the primary button and the rest of the nav
    const baseStyles = isPrimary
        ? "bg-red-600/60 hover:bg-red-500/80 backdrop-blur-md border border-red-400/40 text-white shadow-sm mb-1"
        : isDanger
            ? "hover:bg-red-500/40 hover:text-white border border-transparent hover:border-red-400/30 text-red-200"
            : "text-red-100 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 hover:shadow-sm";

    // Replaced py-2 with py-1.5 to reduce the vertical height of every button
    const commonClasses = `flex items-center w-full rounded-full transition-all duration-200 group py-0.5 ${isOpen ? 'px-2.5' : 'justify-center px-0'} ${baseStyles}`;

    const innerContent = (
        <>
            <div className={`flex items-center justify-center flex-shrink-0 w-6 h-6 transition-transform duration-300 ${!isOpen ? 'group-hover:scale-110' : ''}`}>
                {icon}
            </div>

            <div className={`overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center
                ${isOpen ? 'max-w-[200px] opacity-100 ml-2.5' : 'max-w-0 opacity-0 ml-0'}
            `}>
                {/* Added 'leading-none' to remove extra built-in spacing above and below the text */}
                <span className="whitespace-nowrap font-medium text-[13px] leading-none tracking-wide">
                    {label}
                </span>
            </div>
        </>
    );

    if (to) {
        return (
            <Link
                to={to}
                onClick={onClick}
                className={commonClasses}
                title={!isOpen ? label : undefined}
            >
                {innerContent}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={commonClasses}
            title={!isOpen ? label : undefined}
        >
            {innerContent}
        </button>
    );
}