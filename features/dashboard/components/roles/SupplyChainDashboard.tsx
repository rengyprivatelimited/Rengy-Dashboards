import { SupplyChainDashboardBody } from "./legacy-role-views";

type SupplyChainDashboardProps = {
  userName: string;
};

export function SupplyChainDashboard({ userName }: SupplyChainDashboardProps) {
  return <SupplyChainDashboardBody userName={userName} />;
}
