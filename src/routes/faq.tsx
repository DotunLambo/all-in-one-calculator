import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Utilikit Calculators, Currency & Privacy Answered" },
      { name: "description", content: "Answers to the top questions about Utilikit: how our calculators work, currency rate sources, mobile support, ads, privacy and how to get in touch." },
      { name: "keywords", content: "Utilikit FAQ, calculator help, currency converter accuracy, calculator privacy, Utilikit support, AdSense questions" },
      { property: "og:title", content: "Utilikit FAQ — Answers to Common Questions" },
      { property: "og:description", content: "How Utilikit calculators, currency rates, ads and privacy work." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    question: "What is Utilikit?",
    answer: "Utilikit is a free collection of everyday online tools, including a calculator, BMI estimator, currency converter, and converters for length, weight, temperature, volume, and time. Everything runs in your browser — no account required."
  },
  {
    question: "Is Utilikit free to use?",
    answer: "Yes, every tool on Utilikit is completely free to use. We support the site through advertising, including Google AdSense."
  },
  {
    question: "How accurate are the currency conversions?",
    answer: "Currency rates are fetched from a public exchange-rate API and updated regularly. Rates are approximate and should not be used for financial or trading decisions without independent verification."
  },
  {
    question: "Which currencies are supported?",
    answer: "We support major world currencies including the US Dollar (USD), Euro (EUR), British Pound (GBP), Japanese Yen (JPY), Nigerian Naira (NGN), and many more."
  },
  {
    question: "Does Utilikit store my calculations?",
    answer: "No. All calculations are performed locally in your browser. We do not store or transmit the values you enter."
  },
  {
    question: "Can I use Utilikit on mobile?",
    answer: "Yes. The site is designed to be responsive and works well on phones, tablets, and desktop browsers."
  },
  {
    question: "Why do I see ads on the site?",
    answer: "We use Google AdSense to keep Utilikit free. Ads are based on the page content and, in some cases, your browsing history. You can manage personalised ad preferences through Google Ads Settings."
  },
  {
    question: "How do I contact Utilikit?",
    answer: "For questions, feedback, or privacy concerns, reach out via privacy@utilikit.app or visit the About and Privacy pages."
  },
];

function FAQPage() {
  return (
    <ToolShell
      title="Frequently Asked Questions"
      subtitle="Quick answers to the most common questions about Utilikit."
    >
      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ToolShell>
  );
}
