import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function DesignTeamRequestsPage() {
  const { userName } = await requireRole("design-team");
  return <RoleDashboard role="design-team" userName={userName} section="requests" />;
}
