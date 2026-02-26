import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardPath, isRoleSlug } from "@/features/auth/auth-config";

export default async function Page() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("rengy_auth")?.value === "1";
  const roleCookie = cookieStore.get("rengy_role")?.value;

  if (!isAuth || !roleCookie || !isRoleSlug(roleCookie)) {
    redirect("/login");
  }

  redirect(getDashboardPath(roleCookie));
}
