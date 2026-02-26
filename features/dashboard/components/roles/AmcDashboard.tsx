import { AmcDashboardBody } from "./legacy-role-views";

type AmcDashboardProps = {
  userName: string;
};

export function AmcDashboard({ userName }: AmcDashboardProps) {
  return <AmcDashboardBody userName={userName} />;
}
