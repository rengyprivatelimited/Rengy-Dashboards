import Link from "next/link";
import type { RoleSlug } from "@/features/auth/auth-config";
import type { ReactNode } from "react";

type RoleNavigationMenuProps = {
  role: RoleSlug;
  navItems: string[];
  activeItem?: string;
  compactText?: boolean;
  financeContactMenu?: boolean;
  netMeteringContactMenu?: boolean;
};

export function RoleNavigationMenu({
  role,
  navItems,
  activeItem,
  compactText = false,
  financeContactMenu = false,
  netMeteringContactMenu = false,
}: RoleNavigationMenuProps) {
  const getHref = (item: string) => {
    if (item === "Dashboard") {
      return role === "admin" ? "/admin/dashboard" : `/${role}/dashboard`;
    }

    if (role === "design-team") {
      if (item === "Requests") return "/design-team/requests";
      if (item === "Design Workflow") return "/design-team/design-workflow";
    }

    if (role === "admin") {
      const adminMap: Record<string, string> = {
        "Approval Management": "/admin/approval-management",
        "Leads & Projects": "/admin/leads-projects",
        "Vendor Management": "/admin/vendor-management",
        "Team Management": "/admin/team-management",
        "Loan Management": "/admin/loan-management",
        Partners: "/admin/fin-tech-partners",
        "Supply Chain Management": "/admin/inventory-management",
        Reports: "/admin/reports",
        Tickets: "/admin/ticket-alerts",
        Support: "/admin/support",
        Settings: "/admin/settings",
      };
      return adminMap[item] ?? null;
    }
    return null;
  };

  return (
    <nav className="p-3">
      <ul className="space-y-1">
        {navItems.map((item, idx) => (
          <li key={item}>
            {(() => {
              const href = getHref(item);
              const isActive = activeItem ? activeItem === item : idx === 0;
              const className = `block w-full whitespace-nowrap rounded px-3 py-2 text-left ${
                compactText ? "text-[11px] font-medium" : "text-sm"
              } ${isActive ? "bg-[#dff8f1] font-semibold text-[#24a87c]" : "text-[#596173] hover:bg-[#f3f6fb]"}`;

              if (href) {
                return (
                  <Link href={href} className={className}>
                    {item}
                  </Link>
                );
              }

              return (
                <button className={className}>
                  {item}
                </button>
              );
            })()}
            {netMeteringContactMenu && item === "Contact" ? (
              <RoleSubmenu>
                <div className="rounded px-2 py-1">Customers</div>
                <div className="rounded px-2 py-1">Vendors</div>
              </RoleSubmenu>
            ) : null}
            {financeContactMenu && item === "Contact" ? (
              <RoleSubmenu>
                <div className="rounded border-b border-[#e4e8f0] px-2 py-1 font-semibold text-[#273146]">Fin-Tech Partners</div>
                <div className="rounded px-2 py-1">Customers</div>
                <div className="rounded px-2 py-1">Vendors</div>
              </RoleSubmenu>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RoleSubmenu({ children }: { children: ReactNode }) {
  return <div className="ml-4 mt-1 space-y-1 text-[10px] text-[#8a94a7]">{children}</div>;
}
