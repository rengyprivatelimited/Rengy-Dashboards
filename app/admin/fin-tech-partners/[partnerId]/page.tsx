import PageImpl from "@/app/fin-tech-partners/[partnerId]/page";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminPartnerPage() {
  await requireRole("admin");
  return <PageImpl />;
}
