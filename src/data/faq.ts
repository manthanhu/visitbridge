export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is VisitBridge?",
    answer: "VisitBridge is a platform that connects college students with top companies for organized campus visits. We aggregate student demand across institutions — once enough students express interest, we coordinate the visit with the company. Think of it as group-buying for career experiences.",
  },
  {
    id: "faq-2",
    question: "How does the threshold system work?",
    answer: "Each visit has a minimum number of students required (usually 20-40). Once that threshold is met, the visit is confirmed and scheduled. You only pay once the threshold is reached. If a visit doesn't get enough interest, you're never charged.",
  },
  {
    id: "faq-3",
    question: "What types of visits are available?",
    answer: "We offer four types: Internship visits (meet hiring teams), Placement drives (direct recruitment pipeline), Workshops (hands-on technical sessions), and Events (hackathons, tech talks, campus tours). Each type is clearly labeled so you know what to expect.",
  },
  {
    id: "faq-4",
    question: "Can students from any college join?",
    answer: "Absolutely. That's the core idea. A single college might not have enough students interested in visiting NVIDIA's GPU lab, but students from 10 colleges together definitely do. We break down institutional barriers to give every student equal access.",
  },
  {
    id: "faq-5",
    question: "What does the fee cover?",
    answer: "The fee covers visit coordination, company liaison, logistics planning, and on-site facilitation. It does not cover travel or accommodation. Fees typically range from ₹800 to ₹2,000 depending on the company and visit type.",
  },
  {
    id: "faq-6",
    question: "What happens after I join a visit?",
    answer: "You'll receive a confirmation with visit details, preparation materials, and a suggested agenda. On the day of the visit, our team handles coordination. After the visit, many companies follow up with interested students for internship or placement opportunities.",
  },
  {
    id: "faq-7",
    question: "Is my payment refundable?",
    answer: "If a visit is cancelled by the company or doesn't reach its threshold, you receive a full refund. If you cancel your spot after the visit is confirmed, refund eligibility depends on timing — full refund if 7+ days before, 50% if 3-7 days before.",
  },
  {
    id: "faq-8",
    question: "How are companies selected?",
    answer: "We partner with companies that actively hire from Indian campuses and have a track record of strong engineering culture. Every company on our platform has agreed to provide meaningful access — not just a marketing tour, but real interaction with engineers and hiring teams.",
  },
]
