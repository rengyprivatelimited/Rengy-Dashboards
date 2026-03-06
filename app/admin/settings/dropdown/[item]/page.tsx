import PageImpl from "@/app/settings/dropdown/[item]/page";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminSettingsItemPage() {
  await requireRole("admin");
  return <PageImpl />;
}
