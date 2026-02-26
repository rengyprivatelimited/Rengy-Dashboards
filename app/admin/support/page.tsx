import PageImpl from "@/app/support/page";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminSectionPage() {
  await requireRole("admin");
  return <PageImpl />;
}
