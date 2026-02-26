import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#d4d4d6] px-4 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[760px] items-center justify-center bg-[#f8f8f8] p-6 sm:p-10">
        <div className="w-full max-w-[420px] text-center">
          <h1 className="text-3xl font-semibold text-[#111111]">Forgot Password</h1>
          <p className="mt-3 text-base text-[#60646d]">
            Enter your registered email and we&apos;ll send you a reset link.
          </p>

          <form className="mt-8 space-y-4 text-left">
            <label htmlFor="email" className="block text-sm font-medium text-[#4f5563]">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-12 w-full border border-[#d0d3db] bg-white px-4 text-base text-[#2a2a2a] outline-none placeholder:text-[#9da1a8] focus:ring-2 focus:ring-[#5dd3cb]/70"
            />

            <button
              type="submit"
              className="h-12 w-full rounded-[10px] bg-[#54cfc7] text-lg font-semibold text-white transition-colors hover:bg-[#46c0b8]"
            >
              Send Reset Link
            </button>
          </form>

          <Link href="/login" className="mt-5 inline-block text-sm font-medium text-[#676b74] hover:text-[#3f434c]">
            Back to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
