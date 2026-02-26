import { LoanDashboardBody } from "./legacy-role-views";

type LoanDashboardProps = {
  userName: string;
};

export function LoanDashboard({ userName }: LoanDashboardProps) {
  return <LoanDashboardBody userName={userName} />;
}
