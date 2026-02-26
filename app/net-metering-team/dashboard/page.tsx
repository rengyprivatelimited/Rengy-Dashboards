import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("net-metering-team");
  return <RoleDashboard role="net-metering-team" userName={userName} />;
}
