"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiProxyBaseUrl } from "@/lib/api/client";

function getCookieValue(name: string): string {
  const escaped = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function logout() {
      const userId = getCookieValue("rengy_user_id");
      const accessToken = getCookieValue("rengy_access_token");

      if (userId) {
        try {
          await fetch(`${getApiProxyBaseUrl()}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({ userId: Number(userId) }),
          });
        } catch (error) {
          console.error("Backend logout failed", error);
        }
      }

      clearCookie("rengy_auth");
      clearCookie("rengy_role");
      clearCookie("rengy_name");
      clearCookie("rengy_access_token");
      clearCookie("rengy_refresh_token");
      clearCookie("rengy_user_type");
      clearCookie("rengy_user_id");

      if (isMounted) {
        router.replace("/login");
        router.refresh();
      }
    }

    logout();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eceff4] text-[#1f2b46]">
      <p className="text-sm font-medium">Logging out...</p>
    </main>
  );
}
