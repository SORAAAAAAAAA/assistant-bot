import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqsAccordionProps {
    currentFaqs: FaqItem[];
    openQuestions: Set<number>;
    toggleQuestion: (index: number) => void;
}

export default function FaqsAccordion({ currentFaqs, openQuestions, toggleQuestion }: FaqsAccordionProps) {
    return (
        <div className="w-full pb-16 px-16 -mx-16">
            <div className="space-y-4 flex flex-col w-full items-center">
                {currentFaqs.map((faq, index) => {
                    const isOpen = openQuestions.has(index);
                    return (
                        <div
                            key={index}
                            onClick={() => toggleQuestion(index)}
                            className={`w-full group flex flex-col px-8 py-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer relative animate-[popIn_0.4s_ease-out_forwards] shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                                ${isOpen ? 'z-[50] -translate-y-2 scale-[1.01] shadow-2xl border-white/90 bg-white/60' : 'z-10 hover:z-[40] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl hover:bg-white/60 hover:border-white/90'}`}
                            style={{ animationDelay: `${index * 0.04}s` }}
                        >
                            <div className="flex items-center justify-between gap-5 w-full">
                                <div className="flex items-center gap-5 w-full">
                                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/60 flex items-center justify-center border border-white shadow-sm relative overflow-visible transition-transform duration-500 group-hover:scale-105">
                                        <span className={`font-['JetBrains_Mono',monospace] font-bold text-sm transition-colors ${isOpen ? 'text-[#E23B4E]' : 'text-[#1A1C1E]/50 group-hover:text-[#E23B4E]'}`}>
                                            Q
                                        </span>
                                    </div>

                                    <h3 className={`w-full text-[14px] font-bold transition-colors leading-tight pr-4
                                        ${isOpen ? 'text-[#E23B4E]' : 'text-[#1A1C1E] group-hover:text-[#E23B4E]'}`}>
                                        {faq.q}
                                    </h3>
                                </div>

                                <div className={`p-2 rounded-lg transition-all flex-shrink-0 duration-500
                                    ${isOpen ? 'bg-black/5 text-[#E23B4E] opacity-100' : 'opacity-30 group-hover:opacity-100 text-[#1A1C1E]'}`}>
                                    <ChevronDown size={20} strokeWidth={2.5} className={`transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] 
                                ${isOpen ? 'max-h-[500px] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
                                <div className="h-px w-full bg-black/5 mb-4 ml-[60px]" />
                                <p className="text-[13px] text-[#1A1C1E]/80 font-medium leading-relaxed pl-[60px] pr-4 pb-2">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    );
                })}

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
    );
}