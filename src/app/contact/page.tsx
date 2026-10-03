import type { Metadata } from "next";
import { MUPPETS } from "@/lib/muppets";
import { Badge, Card } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch, or subscribe to the newsletter for theory updates and new archetypes.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Badge color="var(--accent)">Contact</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">Get in touch</h1>
      <p className="mt-3 text-lg text-text-secondary">
        Questions, bug reports, or a fan theory you think belongs on the site — we read everything.
      </p>

      <Card className="mt-8">
        <ContactForm />
      </Card>

      <h2 className="font-display mt-14 text-2xl font-normal">Join the newsletter</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Occasional emails about new archetypes and theory updates. No spam.
      </p>
      <Card className="mt-4">
        <NewsletterForm muppets={MUPPETS} />
      </Card>
    </div>
  );
}
