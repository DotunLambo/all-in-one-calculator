import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Utilikit — Feedback, Support & Partnerships" },
      { name: "description", content: "Send questions, bug reports, feature requests or partnership enquiries to the Utilikit team — we read every message from readers around the world." },
      { name: "keywords", content: "contact Utilikit, calculator support, feedback, partnership, Dotun Lambo contact" },
      { property: "og:title", content: "Contact Utilikit" },
      { property: "og:description", content: "Reach the Utilikit team with feedback, questions or partnership requests." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <ToolShell
      title="Contact us"
      subtitle="Have a question, suggestion or partnership request? We'd love to hear from you."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              required
              rows={5}
              placeholder="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" /> Send message
          </Button>
          {sent && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Thanks for reaching out! We'll get back to you as soon as possible.
            </p>
          )}
        </form>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg text-primary-foreground shrink-0" style={{ background: "var(--gradient-hero)" }}>
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">hello@utilikit.app</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg text-primary-foreground shrink-0" style={{ background: "var(--gradient-hero)" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Built by</h3>
              <p className="text-sm text-muted-foreground">Dotun Lambo</p>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6" style={{ background: "var(--gradient-card)" }}>
            <h3 className="font-semibold">About this project</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Utilikit is designed and developed by Dotun Lambo as a free,
              fast suite of everyday calculators and converters for everyone.
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
