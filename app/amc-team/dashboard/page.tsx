import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRoleOrAdmin("amc-team");
  return <RoleDashboard role="amc-team" userName={userName} />;
}
