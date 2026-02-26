import { notFound, redirect } from "next/navigation";
import { isRoleSlug } from "@/features/auth/auth-config";

type DashboardSectionPageProps = {
  params: Promise<{
    role: string;
    section: string;
  }>;
};

export default async function DashboardByRoleSectionPage({ params }: DashboardSectionPageProps) {
  const { role: rawRole, section } = await params;
  if (!isRoleSlug(rawRole)) notFound();
  const role = rawRole;

  if (!(role === "design-team" && (section === "design-workflow" || section === "requests"))) {
    notFound();
  }

  redirect(`/design-team/${section}`);
}
