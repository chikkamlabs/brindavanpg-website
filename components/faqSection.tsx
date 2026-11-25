"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FALLBACK_FAQS, type FaqView } from "@/lib/faqsStore";

interface FaqSectionProps {
  faqs?: FaqView[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const activeFaqs = faqs && faqs.length > 0 ? faqs : FALLBACK_FAQS;
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faqs"
      className="bg-light-sage text-deep-forest py-16 sm:py-20 lg:py-24 border-t border-deep-forest/10"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-sm sm:text-base font-semibold text-teal-green">
            Have Questions?
          </p>
          <h2
            className="mt-2 font-bold tracking-tight text-deep-forest text-balance"
            style={{ fontSize: "clamp(1.875rem, 3.2vw, 2.65rem)" }}
          >
            Have Questions? Check our faq&apos;s.
          </h2>
        </motion.div>

        <div className="mt-10 sm:mt-12 space-y-3.5">
          {activeFaqs.map((faq, idx) => {
            const isOpen = openFaqId === faq._id;
            const panelId = `faq-answer-${faq._id}`;
            const orderLabel = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={faq._id}
                className="rounded-2xl border border-deep-forest/12 bg-soft-off-white transition-colors duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFaq(faq._id)}
                  className="flex w-full min-h-[56px] items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-green"
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-teal-green tabular-nums shrink-0">
                      {orderLabel}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-deep-forest leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 text-teal-green shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, height: 0 }
                      }
                      animate={{ opacity: 1, height: "auto" }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, height: 0 }
                      }
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-deep-forest/10 px-5 py-4 pl-12 text-sm sm:text-base leading-relaxed text-slate-gray whitespace-pre-line">
                        {faq.answerText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
