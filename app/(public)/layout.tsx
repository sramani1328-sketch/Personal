import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { getNav, kv } from "@/lib/content";
import { siteSettings } from "@/lib/db/schema";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getNav(), kv(siteSettings)]);
  return (
    <>
      <Nav items={nav} linkedinUrl={settings.linkedin ?? ""} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer
        items={nav}
        tagline={settings.footer_tagline ?? ""}
        linkedin={settings.linkedin ?? ""}
        email={settings.email ?? ""}
      />
      {settings.ga4_id ? (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.ga4_id}');`,
            }}
          />
        </>
      ) : null}
    </>
  );
}
