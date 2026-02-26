import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("amc-team");
  return <RoleDashboard role="amc-team" userName={userName} />;
}
