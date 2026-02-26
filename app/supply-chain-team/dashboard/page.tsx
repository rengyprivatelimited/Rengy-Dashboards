import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRole("supply-chain-team");
  return <RoleDashboard role="supply-chain-team" userName={userName} />;
}
