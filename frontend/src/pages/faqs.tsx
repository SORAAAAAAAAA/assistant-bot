import { useState } from 'react';
import { Package, CreditCard, Truck, Headset, ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqsPage() {
    const [activeCategory, setActiveCategory] = useState('tracking');
    const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set([0]));

    const categories = [
        { id: 'tracking', icon: <Package size={24} strokeWidth={2} />, label: 'Tracking' },
        { id: 'billing', icon: <CreditCard size={24} strokeWidth={2} />, label: 'Billing' },
        { id: 'services', icon: <Truck size={24} strokeWidth={2} />, label: 'Services' },
        { id: 'support', icon: <Headset size={24} strokeWidth={2} />, label: 'Support' },
    ];

    const faqs = {
        tracking: [
            { q: "How can I track my shipment in real-time?", a: "You can track your cargo using the 12-digit Waybill number provided at the time of booking. Enter it in the tracking bar on our homepage for real-time status updates." },
            { q: "What does 'In Transit' mean for my freight?", a: "Your shipment is currently moving within our network toward its final destination. It has left the origin facility but has not yet reached the local delivery terminal." },
            { q: "Can I change the delivery address after dispatch?", a: "Rerouting is possible subject to current location and additional fees. Please contact support immediately with your Waybill number." }
        ],
        billing: [
            { q: "How are freight shipping rates calculated?", a: "Rates are based on the origin, destination, freight class, and the dimensional weight (dim weight) of your shipment." },
            { q: "What payment methods do you accept for invoices?", a: "We accept bank transfers, corporate checks, and all major credit cards. Approved accounts can also operate on net-30 terms." }
        ],
        services: [{ q: "Do you handle hazardous materials?", a: "Yes, we handle select classes of HAZMAT. Specialized documentation is required." }],
        support: [{ q: "How do I file a damage claim?", a: "Claims must be filed within 7 days of delivery. Navigate to the Claims portal and provide photos and the original invoice." }]
    };

    const currentFaqs = faqs[activeCategory as keyof typeof faqs] || [];

    return (
        <div className="h-full w-full bg-[#E5E7EB] overflow-hidden font-['Inter',system-ui,sans-serif] select-text relative">

            {/* ── BACKGROUND LAYERS (Adapted directly from History) ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-40" />
            <div className="blob-1 absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-[#E23B4E]/[0.3] blur-[50px] rounded-full pointer-events-none" />
            <div className="blob-2 absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] bg-[#E08A1E]/[0.35] blur-[60px] rounded-full pointer-events-none" />
            <div className="blob-3 absolute top-[20%] left-[30%] w-[40vw] h-[40vw] bg-[#3B82F6]/[0.2] blur-[40px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
                
                .blob-1 { animation: drift 20s infinite alternate ease-in-out; }
                .blob-2 { animation: drift 25s infinite alternate-reverse ease-in-out; }
                .blob-3 { animation: drift 15s infinite alternate ease-in-out; }

                @keyframes drift {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(10vw, 15vh) scale(1.1); }
                    100% { transform: translate(-5vw, -10vh) scale(0.95); }
                }

                @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                
                .history-main-title { 
                    font-family: 'Hanken Grotesk', sans-serif; 
                    font-weight: 800; font-size: 2.8rem; color: #E23B4E; 
                    // text-transform: uppercase; 
                    letter-spacing: -0.05em; line-height: 1; 
                }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* ── MAIN CONTAINER ── */}
            <div className="max-w-[1000px] mx-auto relative z-10 h-full overflow-y-auto no-scrollbar flex flex-col pt-8 px-8 items-center">

                {/* HEADER */}
                <header className="w-full flex flex-col items-start mb-8 px-8 animate-[popIn_0.4s_ease-out_forwards] relative z-[100]">
                    <div className="history-main-title mb-2">FAQs</div>
                    <p className="font-['JetBrains_Mono',monospace] text-black text-[14px] font-bold uppercase tracking-[0.2em] opacity-80">
                        Frequently Asked Questions
                    </p>
                </header>

                {/* CATEGORY TABS (Glassmorphic Cards) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-8 mb-8 animate-[popIn_0.5s_ease-out_forwards]">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenQuestions(new Set());
                            }}
                            className={`group flex flex-col items-center justify-center p-5 bg-white/40 backdrop-blur-xl border rounded-[24px] transition-all duration-500 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                                ${activeCategory === cat.id
                                    ? 'border-white/90 bg-white/60 -translate-y-2 scale-[1.02] shadow-xl z-20'
                                    : 'border-white/60 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:bg-white/60 hover:border-white/90 z-10'}`}
                        >
                            <div className={`mb-3 transition-transform duration-500 ${activeCategory === cat.id ? 'scale-110 text-[#E23B4E]' : 'text-[#1A1C1E]/40 group-hover:text-[#E23B4E] group-hover:scale-110'}`}>
                                {cat.icon}
                            </div>
                            <span className={`text-[11px] font-bold uppercase tracking-wider font-['JetBrains_Mono',monospace] transition-colors
                                ${activeCategory === cat.id ? 'text-[#E23B4E]' : 'text-[#1A1C1E]/70 group-hover:text-[#1A1C1E]'}`}>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* FAQ ACCORDION LIST */}
                <div className="w-full pb-16 px-16 -mx-16">
                    <div className="space-y-4 flex flex-col w-full items-center">
                        {currentFaqs.map((faq, index) => (
                            <div
                                key={index}
                                onClick={() => setOpenQuestions(prev => {
                                    const next = new Set(prev);
                                    next.has(index) ? next.delete(index) : next.add(index);
                                    return next;
                                })}
                                className={`w-full group flex flex-col px-8 py-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer relative animate-[popIn_0.4s_ease-out_forwards] shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                                    ${openQuestions.has(index) ? 'z-[50] -translate-y-2 scale-[1.01] shadow-2xl border-white/90 bg-white/60' : 'z-10 hover:z-[40] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl hover:bg-white/60 hover:border-white/90'}`}
                                style={{ animationDelay: `${index * 0.04}s` }}
                            >
                                {/* Header Row */}
                                <div className="flex items-center justify-between gap-5 w-full">
                                    <div className="flex items-center gap-5 w-full">
                                        {/* Q Icon Box */}
                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/60 flex items-center justify-center border border-white shadow-sm relative overflow-visible transition-transform duration-500 group-hover:scale-105">
                                            <span className={`font-['JetBrains_Mono',monospace] font-bold text-sm transition-colors ${openQuestions.has(index) ? 'text-[#E23B4E]' : 'text-[#1A1C1E]/50 group-hover:text-[#E23B4E]'}`}>
                                                Q
                                            </span>
                                        </div>

                                        {/* Question Text */}
                                        <h3 className={`w-full text-[14px] font-bold transition-colors leading-tight pr-4
                                            ${openQuestions.has(index) ? 'text-[#E23B4E]' : 'text-[#1A1C1E] group-hover:text-[#E23B4E]'}`}>
                                            {faq.q}
                                        </h3>
                                    </div>

                                    {/* Expand/Collapse Icon */}
                                    <div className={`p-2 rounded-lg transition-all flex-shrink-0 duration-500
                                        ${openQuestions.has(index) ? 'bg-black/5 text-[#E23B4E] opacity-100' : 'opacity-30 group-hover:opacity-100 text-[#1A1C1E]'}`}>
                                        <ChevronDown size={20} strokeWidth={2.5} className={`transition-transform duration-500 ease-in-out ${openQuestions.has(index) ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </div>

                                {/* Answer Content (Animated Collapse) */}
                                <div className={`overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] 
                                    ${openQuestions.has(index) ? 'max-h-[500px] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
                                    <div className="h-px w-full bg-black/5 mb-4 ml-[60px]" />
                                    <p className="text-[13px] text-[#1A1C1E]/80 font-medium leading-relaxed pl-[60px] pr-4 pb-2">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {currentFaqs.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.5s_ease-out_forwards] py-20">
                                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/60 mb-6 shadow-sm">
                                    <HelpCircle size={24} strokeWidth={1.5} className="text-[#6B7280] opacity-40" />
                                </div>
                                <h2 className="font-['JetBrains_Mono',monospace] text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">
                                    No FAQs found
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}