import { Package, CreditCard, Truck, Headset } from 'lucide-react';

interface FaqsCategoriesProps {
    activeCategory: string;
    onSelectCategory: (id: string) => void;
}

const categories = [
    { id: 'tracking', icon: <Package size={24} strokeWidth={2} />, label: 'Tracking' },
    { id: 'billing', icon: <CreditCard size={24} strokeWidth={2} />, label: 'Billing' },
    { id: 'services', icon: <Truck size={24} strokeWidth={2} />, label: 'Services' },
    { id: 'support', icon: <Headset size={24} strokeWidth={2} />, label: 'Support' },
];

export default function FaqsCategories({ activeCategory, onSelectCategory }: FaqsCategoriesProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full px-8 mb-8 animate-[popIn_0.5s_ease-out_forwards]">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`group flex flex-row items-center gap-3.5 p-3.5 bg-white/40 backdrop-blur-xl border rounded-[20px] transition-all duration-500 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full
                            ${isActive
                                ? 'border-white/90 bg-white/60 -translate-y-1 shadow-xl z-20'
                                : 'border-white/60 hover:-translate-y-1 hover:shadow-xl hover:bg-white/60 hover:border-white/90 z-10'}`}
                    >
                        {/* Icon box — left side */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                            ${isActive
                                ? 'bg-[#E23B4E]/10 text-[#E23B4E]'
                                : 'bg-black/5 text-[#1A1C1E]/40 group-hover:bg-[#E23B4E]/10 group-hover:text-[#E23B4E]'}`}>
                            {cat.icon}
                        </div>

                        {/* Label — right side, fills remaining space */}
                        <span className={`flex-1 text-left text-[11px] font-bold uppercase tracking-wider font-['JetBrains_Mono',monospace] transition-colors truncate
                            ${isActive ? 'text-[#E23B4E]' : 'text-[#1A1C1E]/70 group-hover:text-[#1A1C1E]'}`}>
                            {cat.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}