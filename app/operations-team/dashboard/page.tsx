import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("operations-team");
  return <RoleDashboard role="operations-team" userName={userName} />;
}
