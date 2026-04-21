import { Download, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getActiveResume, kv } from "@/lib/content";
import { siteSettings } from "@/lib/db/schema";

export const revalidate = 60;
export const metadata = { title: "Resume" };

export default async function ResumePage() {
  const [resume, settings] = await Promise.all([getActiveResume(), kv(siteSettings)]);

  return (
    <div className="container-page py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="gold-rule">Resume</span>
        <h1 className="mt-4 font-display text-h1 text-navy">Download My Resume</h1>
        <p className="mt-4 text-muted text-lead">
          Corporate Development & Strategic Finance Analyst — available for M&A, FP&A, and Strategic Finance
          roles.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {resume ? (
            <Button href={resume.blobUrl} size="lg" external>
              <Download size={18} /> Download Resume (PDF)
            </Button>
          ) : (
            <Button href="/contact" size="lg">
              <Download size={18} /> Request Resume
            </Button>
          )}
          {settings.linkedin ? (
            <Button href={settings.linkedin} variant="secondary" size="lg" external>
              <Linkedin size={18} /> View on LinkedIn
            </Button>
          ) : null}
        </div>
      </div>

      {resume ? (
        <div className="mt-14 max-w-4xl mx-auto rounded-xl overflow-hidden border border-border bg-white shadow-card">
          <iframe
            title="Shoaib Ramani Resume"
            src={resume.blobUrl}
            className="w-full h-[780px]"
          />
        </div>
      ) : (
        <div className="mt-14 max-w-3xl mx-auto text-center text-muted">
          <p>A fresh resume will appear here soon. In the meantime, reach out on LinkedIn or via the contact form.</p>
        </div>
      )}
    </div>
  );
}
