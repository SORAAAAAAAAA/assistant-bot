import { useState } from 'react';
import { Package, CreditCard, Truck, Headset, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQPage() {
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
        <div className="h-full overflow-y-auto bg-white w-full py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold mb-3">
                    <HelpCircle size={14} />
                    <span className="tracking-normal">FAQs</span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 text-center tracking-tight">
                    <span className="text-red-600">Frequently asked questions</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-center text-sm md:text-base max-w-2xl mb-12">
                    Choose a plan that fits your logistics needs and budget. No hidden fees, no surprises—just straightforward pricing for powerful freight management.
                </p>
                <br />

                {/* 4 Large Category Buttons with Icons restored */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setOpenQuestion(null);
                            }}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-200 border
                                ${activeCategory === cat.id
                                    ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`mb-4 ${activeCategory === cat.id ? 'text-red-600' : 'text-gray-400'}`}>
                                {cat.icon}
                            </div>
                            <span className="text-sm font-semibold text-center">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion List (Spaced out, clean rounded rectangles) */}
                <div className="w-full space-y-4">
                    {currentFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-[#f8f9fc] rounded-2xl overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center"
                            >
                                <span className="font-medium text-gray-900 pr-8">{faq.q}</span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 
                                    ${openQuestion === index ? 'bg-red-600 text-white' : 'bg-white text-red-600 shadow-sm border border-gray-200'}`}>
                                    {openQuestion === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openQuestion === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}

                    {currentFaqs.length === 0 && (
                        <div className="text-center py-12 text-gray-500 bg-[#f8f9fc] rounded-2xl">
                            No questions available for this category yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}