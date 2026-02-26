import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getDashboardPath, isRoleSlug, RoleSlug } from "@/features/auth/auth-config";

export async function requireRole(expectedRole: RoleSlug) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("rengy_auth")?.value === "1";
  const userRole = cookieStore.get("rengy_role")?.value;

  if (!isAuth) {
    redirect("/login");
  }

  if (!userRole || !isRoleSlug(userRole)) {
    redirect("/login");
  }

  if (userRole !== expectedRole) {
    redirect(getDashboardPath(userRole));
  }

  const userName = decodeURIComponent(cookieStore.get("rengy_name")?.value ?? "Akhil");
  return { userName };
}

export async function parseAndValidateRole(params: Promise<{ role: string }>) {
  const { role } = await params;
  if (!isRoleSlug(role)) {
    notFound();
  }
  return role;
}

