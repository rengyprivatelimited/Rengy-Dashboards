import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("loan-team");
  return <RoleDashboard role="loan-team" userName={userName} />;
}
