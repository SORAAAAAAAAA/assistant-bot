import { useState } from 'react';
import FaqsHeader from '../features/faqs/FaqsHeader';
import FaqsCategories from '../features/faqs/FaqsCategories';
import FaqsAccordion from '../features/faqs/FaqsAccordion';

const faqsData = {
    tracking: [
        { q: "How can I track my shipment in real-time?", a: "You can track your cargo using the 12-digit Waybill number provided at the time of booking. Enter it in the tracking bar on our homepage for real-time status updates." },
        { q: "What does 'In Transit' mean for my freight?", a: "Your shipment is currently moving within our network toward its final destination. It has left the origin facility but has not yet reached the local delivery terminal." },
        { q: "Can I change the delivery address after dispatch?", a: "Rerouting is possible subject to current location and additional fees. Please contact support immediately with your Waybill number." }
    ],
    billing: [
        { q: "How are freight shipping rates calculated?", a: "Rates are based on the origin, destination, freight class, and the dimensional weight (dim weight) of your shipment." },
        { q: "What payment methods do you accept for invoices?", a: "We accept bank transfers, corporate checks, and all major credit cards. Approved accounts can also operate on net-30 terms." }
    ],
    services: [
        { q: "Do you handle hazardous materials?", a: "Yes, we handle select classes of HAZMAT. Specialized documentation is required." }
    ],
    support: [
        { q: "How do I file a damage claim?", a: "Claims must be filed within 7 days of delivery. Navigate to the Claims portal and provide photos and the original invoice." }
    ]
};

export default function FaqsPage() {
    const [activeCategory, setActiveCategory] = useState('tracking');
    const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set([0]));

    const handleCategoryChange = (id: string) => {
        setActiveCategory(id);
        setOpenQuestions(new Set());
    };

    const toggleQuestion = (index: number) => {
        setOpenQuestions(prev => {
            const next = new Set(prev);
            next.has(index) ? next.delete(index) : next.add(index);
            return next;
        });
    };

    const currentFaqs = faqsData[activeCategory as keyof typeof faqsData] || [];

    return (
        <div className="h-full w-full bg-[#E5E7EB] overflow-hidden font-['Inter',system-ui,sans-serif] select-text relative">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-40" />
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
                    letter-spacing: -0.05em; line-height: 1; 
                }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Main Container */}
            <div className="max-w-[1000px] mx-auto relative z-10 h-full overflow-y-auto no-scrollbar flex flex-col pt-8 px-8 items-center">
                <FaqsHeader />
                <FaqsCategories activeCategory={activeCategory} onSelectCategory={handleCategoryChange} />
                <FaqsAccordion
                    currentFaqs={currentFaqs}
                    openQuestions={openQuestions}
                    toggleQuestion={toggleQuestion}
                />
            </div>
        </div>
    );
}