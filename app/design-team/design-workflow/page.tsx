import { RoleDashboard } from "@/features/dashboard/components";
import { requireRole } from "@/features/auth/server-guard";

export default async function DesignTeamWorkflowPage() {
  const { userName } = await requireRole("design-team");
  return <RoleDashboard role="design-team" userName={userName} section="design-workflow" />;
}
