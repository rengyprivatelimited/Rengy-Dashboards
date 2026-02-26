import PageImpl from "@/app/leads-projects/page";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminSectionPage() {
  await requireRole("admin");
  return <PageImpl />;
}
