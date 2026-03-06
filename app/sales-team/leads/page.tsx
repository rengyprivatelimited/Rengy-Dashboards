import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function SalesLeadsPage() {
  const { userName } = await requireRoleOrAdmin("sales-team");
  return <RoleDashboard role="sales-team" userName={userName} section="leads" />;
}
