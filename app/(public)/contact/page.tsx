import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";
import { kv } from "@/lib/content";
import { siteSettings } from "@/lib/db/schema";

export const revalidate = 60;
export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await kv(siteSettings);
  return (
    <div className="container-page py-16 md:py-24">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <span className="gold-rule">Get in touch</span>
          <h1 className="mt-4 font-display text-h1 text-navy">Let's Talk</h1>
          <p className="mt-4 text-muted text-lead max-w-md">
            Open to M&A roles, FP&A opportunities, and strategic finance conversations. Reach out below.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            {settings.email ? (
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-gold" />
                <a href={`mailto:${settings.email}`} className="text-slate hover:text-navy">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gold" />
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="text-slate hover:text-navy">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-gold" />
              <span className="text-slate">Woburn, Massachusetts, USA</span>
            </li>
            {settings.linkedin ? (
              <li className="flex items-start gap-3">
                <Linkedin size={18} className="mt-0.5 text-gold" />
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate hover:text-navy"
                >
                  linkedin.com/in/shoaib-ramani
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="rounded-2xl bg-white border border-border p-6 md:p-8 shadow-card">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
