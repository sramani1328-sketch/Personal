import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { MessagesList } from "./MessagesList";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const rows = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .catch(() => []);
  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Incoming submissions from the public contact form."
      />
      <Card>
        {rows.length === 0 ? (
          <p className="text-sm text-white/50">No messages yet.</p>
        ) : (
          <MessagesList
            messages={rows.map((r) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              subject: r.subject,
              message: r.message,
              read: r.read,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        )}
      </Card>
    </>
  );
}
