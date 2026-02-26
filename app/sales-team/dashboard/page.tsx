import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("sales-team");
  return <RoleDashboard role="sales-team" userName={userName} />;
}
