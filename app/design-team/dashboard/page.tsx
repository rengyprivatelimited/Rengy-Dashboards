import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRoleOrAdmin("design-team");
  return <RoleDashboard role="design-team" userName={userName} />;
}
