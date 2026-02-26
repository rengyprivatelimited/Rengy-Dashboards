import { AdminDashboardLegacy } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  return <AdminDashboardLegacy />;
}
