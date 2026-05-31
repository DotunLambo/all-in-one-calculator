import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/SiteShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Utilikit" },
      { name: "description", content: "Privacy policy for Utilikit, including information about advertising and cookies." },
      { property: "og:title", content: "Privacy Policy — Utilikit" },
      { property: "og:description", content: "How Utilikit handles your data, cookies, and advertising." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ToolShell title="Privacy Policy" subtitle="Last updated: May 31, 2026">
      <div className="space-y-5 text-foreground">
        <section>
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p className="mt-2 text-muted-foreground">
            Utilikit ("we", "our", "us") operates this website to provide free
            online calculators and converters. This Privacy Policy explains what
            information we collect and how it is used.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Information we collect</h2>
          <p className="mt-2 text-muted-foreground">
            We do not require accounts and do not collect personal information
            directly. Calculations you perform happen entirely in your browser
            and are not transmitted to or stored by us. Currency exchange rates
            are fetched from a third-party public API.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies and advertising</h2>
          <p className="mt-2 text-muted-foreground">
            Utilikit uses Google AdSense to display advertisements. Google and
            its partners may use cookies and similar technologies to serve ads
            based on your prior visits to this website and other sites on the
            internet.
          </p>
          <ul className="mt-3 list-disc pl-6 text-muted-foreground space-y-1">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalised advertising by visiting <a className="text-primary hover:underline" href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google Ads Settings</a>.</li>
            <li>You may opt out of third-party vendor use of cookies for personalised advertising by visiting <a className="text-primary hover:underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">www.aboutads.info</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="mt-2 text-muted-foreground">
            We may use privacy-friendly analytics to understand aggregate
            traffic patterns. No personally identifying information is collected
            for this purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Third-party links</h2>
          <p className="mt-2 text-muted-foreground">
            Our site may contain links to third-party sites. We are not
            responsible for the privacy practices of those external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Children's privacy</h2>
          <p className="mt-2 text-muted-foreground">
            Utilikit is intended for a general audience and is not directed to
            children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes</h2>
          <p className="mt-2 text-muted-foreground">
            We may update this policy from time to time. Continued use of the
            site after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-muted-foreground">
            For privacy-related questions, contact us at
            <span className="font-medium"> privacy@utilikit.app</span>.
          </p>
        </section>
      </div>
    </ToolShell>
  );
}
