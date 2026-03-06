import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRoleOrAdmin("finance-team");
  return <RoleDashboard role="finance-team" userName={userName} />;
}
