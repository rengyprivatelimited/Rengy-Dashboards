import { redirect } from "next/navigation";
import { getDashboardPath } from "@/features/auth/auth-config";
import { parseAndValidateRole } from "@/features/auth/server-guard";

type DashboardPageProps = {
  params: Promise<{
    role: string;
  }>;
};

export default async function DashboardByRolePage({ params }: DashboardPageProps) {
  const role = await parseAndValidateRole(params);
  redirect(getDashboardPath(role));
}
