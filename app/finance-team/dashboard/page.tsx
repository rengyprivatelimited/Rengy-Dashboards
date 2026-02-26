import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("finance-team");
  return <RoleDashboard role="finance-team" userName={userName} />;
}
