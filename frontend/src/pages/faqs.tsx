import { useState } from 'react';
import { Package, CreditCard, Truck, Headset, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FaqsPage() {
    const [activeCategory, setActiveCategory] = useState('tracking');
    const [openQuestion, setOpenQuestion] = useState<number | null>(0);

    const categories = [
        { id: 'tracking', icon: <Package size={32} />, label: 'Tracking & Delivery' },
        { id: 'billing', icon: <CreditCard size={32} />, label: 'Rates & Billing' },
        { id: 'services', icon: <Truck size={32} />, label: 'Services & Freight' },
        { id: 'support', icon: <Headset size={32} />, label: 'Claims & Support' },
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
        <div className="relative h-full w-full bg-white overflow-hidden font-['Inter',system-ui,sans-serif] select-text">

            {/* ── BACKGROUND LAYERS ── */}
            {/* Kept only the grid layer */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-[-1]" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
                
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Scrollable Main Content */}
            <div className="relative z-10 h-full overflow-y-auto no-scrollbar py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-gray-200 shadow-sm text-red-600 text-xs font-bold mb-3 uppercase tracking-wider font-['JetBrains_Mono',monospace]">
                        <HelpCircle size={14} />
                        <span>FAQs</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-ultrabold text-[#1A1C1E] mb-6 text-center tracking-tight font-['Hanken_Grotesk',sans-serif]">
                        <span className="uppercase text-[#E23B4E]">Frequently Asked Questions</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-700 font-medium text-center text-sm md:text-base max-w-2xl mb-12 drop-shadow-sm">
                        Choose a plan that fits your logistics needs and budget. No hidden fees, no surprises—just straightforward pricing for powerful freight management.
                    </p>
                    <br />

                    {/* 4 Large Category Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setOpenQuestion(null);
                                }}
                                className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 border shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl
                                    ${activeCategory === cat.id
                                        ? 'border-[#E23B4E] bg-white text-[#E23B4E] shadow-md'
                                        : 'border-gray-200 bg-white/60 text-gray-700 hover:border-gray-300 hover:bg-white'
                                    }`}
                            >
                                <div className={`mb-4 transition-transform duration-300 ${activeCategory === cat.id ? 'scale-110 text-[#E23B4E]' : 'text-gray-500'}`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-sm font-bold text-center ${activeCategory === cat.id ? 'text-[#E23B4E]' : 'text-[#1A1C1E]'}`}>
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="w-full space-y-4">
                        {currentFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-3xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md hover:border-gray-300"
                            >
                                <button
                                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center"
                                >
                                    <span className="font-bold text-[#1A1C1E] pr-8">{faq.q}</span>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm border
                                        ${openQuestion === index ? 'bg-[#E23B4E] border-[#E23B4E] text-white' : 'bg-gray-50 border-gray-200 text-[#E23B4E]'}`}>
                                        {openQuestion === index ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
                                    </div>
                                </button>

                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openQuestion === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="h-px w-full bg-black/5 mb-4" />
                                    <p className="text-gray-700 font-medium text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {currentFaqs.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-3xl font-bold">
                                No questions available for this category yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}