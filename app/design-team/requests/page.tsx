import { RoleDashboard } from "@/features/dashboard/components";
import { requireRoleOrAdmin } from "@/features/auth/server-guard";

export default async function DesignTeamRequestsPage() {
  const { userName } = await requireRoleOrAdmin("design-team");
  return <RoleDashboard role="design-team" userName={userName} section="requests" />;
}
