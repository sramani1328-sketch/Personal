import { db } from "@/lib/db/client";
import { resumeFiles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { ResumeUploader } from "./ResumeUploader";
import { formatDate } from "@/lib/utils";
import { FileDown, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResumeAdminPage() {
  const rows = await db
    .select()
    .from(resumeFiles)
    .orderBy(desc(resumeFiles.uploadedAt))
    .catch(() => []);

  return (
    <>
      <PageHeader
        title="Resume"
        subtitle="Upload a new PDF to replace the active download. The latest upload is served on /resume."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg mb-4">Upload new resume</h2>
          <ResumeUploader />
        </Card>
        <Card>
          <h2 className="font-display text-lg mb-4">Version history</h2>
          {rows.length === 0 ? (
            <p className="text-sm text-white/50">No resume uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileDown size={14} className="text-white/50" />
                      <span className="font-semibold truncate">{r.filename}</span>
                      {r.isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gold">
                          <CheckCircle size={12} /> Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      Uploaded {formatDate(r.uploadedAt)}
                    </div>
                  </div>
                  <a
                    href={r.blobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gold hover:text-gold-hi"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
