import { kv } from "@/lib/content";
import { siteSettings } from "@/lib/db/schema";
import { saveSiteSettings } from "@/lib/admin/actions";
import { PageHeader, Card, Field, TextArea } from "@/components/admin/AdminUI";
import { SaveBar } from "@/components/admin/SaveBar";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await kv(siteSettings);

  return (
    <>
      <PageHeader
        title="Site Settings"
        subtitle="Global defaults used across every page and SEO metadata."
      />
      <form action={saveSiteSettings} className="space-y-6">
        <Card>
          <h2 className="font-display text-lg mb-4">Brand & SEO</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Site Title"
              name="site_title"
              defaultValue={s.site_title}
              placeholder="Shoaib Ramani — …"
            />
            <Field label="GA4 Measurement ID" name="ga4_id" defaultValue={s.ga4_id} placeholder="G-XXXXXXX" />
            <div className="md:col-span-2">
              <TextArea
                label="Meta Description"
                name="meta_description"
                defaultValue={s.meta_description}
                rows={3}
              />
            </div>
            <ImageUploader label="Default OG Image" name="og_image" defaultValue={s.og_image} />
            <ImageUploader label="Favicon" name="favicon" defaultValue={s.favicon} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Contact & Socials</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Primary Email" name="email" defaultValue={s.email} type="email" />
            <Field label="Phone" name="phone" defaultValue={s.phone} />
            <Field label="LinkedIn URL" name="linkedin" defaultValue={s.linkedin} />
            <Field label="Footer Tagline" name="footer_tagline" defaultValue={s.footer_tagline} />
          </div>
        </Card>

        <SaveBar />
      </form>
    </>
  );
}
