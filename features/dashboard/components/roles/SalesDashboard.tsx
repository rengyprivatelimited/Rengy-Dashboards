import { SalesDashboardBody } from "./legacy-role-views";

type SalesDashboardProps = {
  userName: string;
};

export function SalesDashboard({ userName }: SalesDashboardProps) {
  return <SalesDashboardBody userName={userName} />;
}
