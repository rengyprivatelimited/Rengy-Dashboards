"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { DEMO_USERS, ROLE_LABELS, findDemoUser, getDashboardPath } from "@/features/auth/auth-config";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const user = findDemoUser(username, password);

    if (!user) {
      setErrorMessage("Invalid username or password. Use demo credentials listed below.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    document.cookie = "rengy_auth=1; Path=/; Max-Age=86400; SameSite=Lax";
    document.cookie = `rengy_role=${user.role}; Path=/; Max-Age=86400; SameSite=Lax`;
    document.cookie = `rengy_name=${encodeURIComponent(user.name)}; Path=/; Max-Age=86400; SameSite=Lax`;
    router.push(getDashboardPath(user.role));
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#d4d4d6] px-4 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[760px] items-center justify-center bg-[#f8f8f8] p-6 sm:p-10">
        <div className="w-full max-w-[360px] text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40.8125 24H24V40.8125L19.7969 36.6094V19.7969H34.5V15.5938L40.8125 24Z" fill="#121212" />
              <path d="M24 55.1875H40.8125V38.375L45.0156 42.5781V59.3906H30.3125V63.5938L24 55.1875Z" fill="#121212" />
              <path d="M37.7109 50.4219C32.1094 50.4219 30.7344 47.8789 29.8125 45.2656C29.2773 43.7461 29.1484 43.3867 27.2695 43.3867V39.3516C31.9922 39.3516 33.0039 42.207 33.6094 43.9102C34.1953 45.5586 34.4883 46.3867 37.7109 46.3867V50.4219Z" fill="#121212" />
              <path d="M45 23.9531V35.7617L48.8789 41.6133V23.9531H45ZM45 37.2422L44.1328 35.9336L38.9688 28.1211L36.2266 23.9531H32.3477V24.1953L36.2266 30.0469L40.4688 36.4609L45 43.293V43.5H48.8789V43.2891L45 37.2422Z" fill="#121212" />
            </svg>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[#080808] sm:text-[48px]">Welcome Team Member</h1>
          <p className="mt-5 text-xl text-[#111111]">Sign in to your Admin Panel</p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              required
              className="h-14 w-full rounded-none border-none bg-[#e3e3e3] px-4 text-lg text-[#2a2a2a] outline-none placeholder:text-[#9da1a8] focus:ring-2 focus:ring-[#5dd3cb]/70"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="h-14 w-full rounded-none border-none bg-[#e3e3e3] px-4 pr-12 text-lg text-[#2a2a2a] outline-none placeholder:text-[#9da1a8] focus:ring-2 focus:ring-[#5dd3cb]/70"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6a7a] hover:text-[#4f4a58]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="pt-1 text-right">
              <Link href="/forgot-password" className="text-sm font-medium text-[#676b74] hover:text-[#3f434c]">
                Forgot password?
              </Link>
            </div>

            {errorMessage ? (
              <p className="rounded border border-[#f4c9c9] bg-[#fff3f3] px-3 py-2 text-left text-sm text-[#9c3030]">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-[10px] bg-[#54cfc7] text-2xl font-semibold text-white transition-colors hover:bg-[#46c0b8]"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-7 rounded border border-[#d7d7d7] bg-[#fcfcfc] p-3 text-left">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5d5d5d]">Demo Credentials</div>
            <div className="max-h-[190px] space-y-1 overflow-auto pr-1 text-xs text-[#333]">
              {DEMO_USERS.map((user) => (
                <div key={user.username} className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 border-b border-[#ececec] py-1">
                  <span className="font-medium">{ROLE_LABELS[user.role]}</span>
                  <span>{user.username}</span>
                  <span>{user.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
