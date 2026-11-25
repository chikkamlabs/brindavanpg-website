import { faqsQuery, type Faq, type PortableTextBlock } from "./schemas";

export interface FaqView {
  _id: string;
  question: string;
  answerText: string;
  display_order: number;
  pg?: {
    _id: string;
    name: string;
  } | null;
}

export const FALLBACK_FAQS: FaqView[] = [
  {
    _id: "fallback-faq-1",
    question: "What meals and utilities are included in the monthly PG rent?",
    answerText:
      "Your monthly rent includes 3-time freshly cooked homestyle meals (breakfast, lunch, and dinner), high-speed fiber Wi-Fi, daily room housekeeping, RO purified drinking water, 24/7 hot water, and power backup. Washing machines and biometric security are also included with no hidden maintenance fees.",
    display_order: 1,
    pg: null,
  },
  {
    _id: "fallback-faq-2",
    question: "What is the security deposit and notice period policy?",
    answerText:
      "We require a refundable security deposit (typically ₹10,000 to ₹15,000 depending on the room sharing option) at the time of check-in. Residents only need to share a 30-day advance notice before vacating, and the deposit is refunded smoothly after a standard room handover.",
    display_order: 2,
    pg: null,
  },
  {
    _id: "fallback-faq-3",
    question: "Are both AC and Non-AC sharing rooms available?",
    answerText:
      "Yes! We offer 2 Bed Sharing, 3 Bed Sharing, and 4 Bed Sharing configurations across both AC and cross-ventilated Non-AC rooms. Every resident receives an individual bed, comfortable mattress, dedicated wardrobe, and personal study/work desk space.",
    display_order: 3,
    pg: null,
  },
  {
    _id: "fallback-faq-4",
    question: "How is safety and entry managed for working professionals and students?",
    answerText:
      "All Brindavan PG residences feature biometric main-door access, 24/7 CCTV surveillance across common areas and entrances, and attentive on-site wardens. Residents enjoy flexible 24-hour biometric entry so late work shifts or early commutes are completely hassle-free.",
    display_order: 4,
    pg: null,
  },
  {
    _id: "fallback-faq-5",
    question: "Can I visit the PG property before booking my bed?",
    answerText:
      "Absolutely. You can schedule an in-person or video tour by tapping Enquire Now, selecting any room card, or calling us directly at 7893194224. Our residence manager will walk you through available rooms, dining spaces, and nearby commute options.",
    display_order: 5,
    pg: null,
  },
];

function extractFaqAnswerText(
  answer: PortableTextBlock[] | string | undefined,
  fallback = ""
): string {
  if (typeof answer === "string") {
    return answer.trim() || fallback;
  }

  if (!Array.isArray(answer) || answer.length === 0) {
    return fallback;
  }

  const paragraphs = answer
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((span) => span.text || "").join("")
        : ""
    )
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return paragraphs.join("\n\n") || fallback;
}

function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(
    projectId &&
      projectId.trim().length > 0 &&
      projectId !== "your_sanity_project_id"
  );
}

export async function getFaqsData(): Promise<{
  faqs: FaqView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      faqs: [...FALLBACK_FAQS],
      source: "fallback",
    };
  }

  try {
    const { sanityClient } = await import("./sanity");
    const docs = await sanityClient.fetch<Faq[]>(
      faqsQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return {
        faqs: [...FALLBACK_FAQS],
        source: "fallback",
      };
    }

    const mapped: FaqView[] = docs
      .filter((doc) => doc?.question?.trim())
      .map((doc, index) => {
        const fallback = FALLBACK_FAQS[index % FALLBACK_FAQS.length];
        return {
          _id: doc._id,
          question: doc.question.trim(),
          answerText: extractFaqAnswerText(doc.answer, fallback.answerText),
          display_order:
            typeof doc.display_order === "number"
              ? doc.display_order
              : index + 1,
          pg: doc.pg ?? null,
        };
      })
      .sort((a, b) => a.display_order - b.display_order);

    if (mapped.length === 0) {
      return {
        faqs: [...FALLBACK_FAQS],
        source: "fallback",
      };
    }

    return {
      faqs: mapped,
      source: "sanity",
    };
  } catch {
    return {
      faqs: [...FALLBACK_FAQS],
      source: "fallback",
    };
  }
}
