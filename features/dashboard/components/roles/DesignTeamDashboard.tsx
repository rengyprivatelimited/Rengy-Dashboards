import { DesignDashboardBody, DesignOverviewTable, DesignRequestsTable } from "./legacy-role-views";

type DesignTeamDashboardProps = {
  userName: string;
  section?: string;
};

export function DesignTeamDashboard({ userName, section }: DesignTeamDashboardProps) {
  if (section === "requests") {
    return <DesignRequestsTable />;
  }
  if (section === "design-workflow") {
    return (
      <section className="h-[calc(100vh-96px)] overflow-hidden pt-4">
        <DesignOverviewTable />
      </section>
    );
  }
  return <DesignDashboardBody userName={userName} />;
}

