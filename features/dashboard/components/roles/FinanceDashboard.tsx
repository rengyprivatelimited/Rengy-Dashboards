import { FinanceDashboardBody } from "./legacy-role-views";

type FinanceDashboardProps = {
  userName: string;
};

export function FinanceDashboard({ userName }: FinanceDashboardProps) {
  return <FinanceDashboardBody userName={userName} />;
}
