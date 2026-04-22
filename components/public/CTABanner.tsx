import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTABanner({ linkedin }: { linkedin: string }) {
  return (
    <section className="bg-dark text-white">
      <div className="container-page py-14 md:py-24 text-center">
        <h2 className="font-display text-h1 text-white">Let's Build Something Together</h2>
        <p className="mt-4 max-w-xl mx-auto text-white/70 text-lead">
          Open to M&A roles, corporate finance opportunities, and strategic advisory conversations.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/contact" variant="dark" size="lg">
            <Mail size={18} /> Get In Touch
          </Button>
          {linkedin ? (
            <Button href={linkedin} variant="secondary" size="lg" external>
              <Linkedin size={18} /> Connect on LinkedIn
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
