import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function RoleDashboardPage() {
  const { userName } = await requireRoleOrAdmin("supply-chain-team");
  return <RoleDashboard role="supply-chain-team" userName={userName} />;
}
