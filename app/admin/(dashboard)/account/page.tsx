import { getSessionAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { loginActivity } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/AdminUI";
import { AccountForm } from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const adm = await getSessionAdmin();
  if (!adm) return null;
  const activity = await db
    .select()
    .from(loginActivity)
    .where(eq(loginActivity.adminId, adm.id))
    .orderBy(desc(loginActivity.createdAt))
    .limit(20)
    .catch(() => []);

  return (
    <>
      <PageHeader title="Account" subtitle="Manage your email, password, and active sessions." />
      <AccountForm
        email={adm.email}
        activity={activity.map((a) => ({
          event: a.event,
          ipAddress: a.ipAddress,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
