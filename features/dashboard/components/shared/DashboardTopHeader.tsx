import Link from "next/link";

type DashboardTopHeaderProps = {
  roleTitle: string;
  userName: string;
  compactTitle?: boolean;
};

export function DashboardTopHeader({ roleTitle, userName, compactTitle = false }: DashboardTopHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#d7dce5] bg-white px-4">
      <div className={`${compactTitle ? "text-[18px]" : "text-sm"} font-semibold text-[#1e2536]`}>{roleTitle}</div>
      <div className="flex items-center gap-3">
        <div className="hidden h-8 w-48 items-center rounded border border-[#e5e9f0] bg-[#fafcff] px-3 text-xs text-[#7a8394] md:flex">
          Search
        </div>
        <div className="h-8 w-8 rounded-full bg-[#d8a47b]" />
        <div className="text-xs text-[#3b4455]">{userName}</div>
        <Link href="/logout" className="rounded border border-[#1c244a] px-2 py-1 text-xs font-semibold text-[#1c244a]">
          Logout
        </Link>
      </div>
    </header>
  );
}
