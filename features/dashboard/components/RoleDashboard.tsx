"use client";

import { RoleSlug } from "@/features/auth/auth-config";
import { DashboardTopHeader } from "@/features/dashboard/components/shared/DashboardTopHeader";
import { RoleNavigationMenu } from "@/features/dashboard/components/shared/RoleNavigationMenu";
import {
  getRoleTitle,
  hasRoleSpecificHero,
  NAV_BY_ROLE,
} from "@/features/dashboard/config/role-dashboard-config";
import { usePathname } from "next/navigation";
import { AmcDashboard } from "./roles/AmcDashboard";
import { DesignTeamDashboard } from "./roles/DesignTeamDashboard";
import { FinanceDashboard } from "./roles/FinanceDashboard";
import { LoanDashboard } from "./roles/LoanDashboard";
import { NetMeteringDashboard } from "./roles/NetMeteringDashboard";
import { OperationsDashboard } from "./roles/OperationsDashboard";
import { SalesDashboard } from "./roles/SalesDashboard";
import { SupplyChainDashboard } from "./roles/SupplyChainDashboard";

type RoleDashboardProps = {
  role: RoleSlug;
  userName: string;
  section?: string;
};

function DashboardBody({ role, userName, section }: { role: RoleSlug; userName: string; section?: string }) {
  if (role === "design-team") {
    return <DesignTeamDashboard userName={userName} section={section} />;
  }

  if (role === "operations-team") {
    return <OperationsDashboard />;
  }

  if (role === "net-metering-team") {
    return <NetMeteringDashboard />;
  }

  if (role === "loan-team") {
    return <LoanDashboard userName={userName} />;
  }

  if (role === "finance-team") {
    return <FinanceDashboard userName={userName} />;
  }

  if (role === "supply-chain-team") {
    return <SupplyChainDashboard userName={userName} />;
  }

  if (role === "amc-team") {
    return <AmcDashboard userName={userName} />;
  }

  if (role === "sales-team") {
    return <SalesDashboard userName={userName} />;
  }

  return null;
}

export function RoleDashboard({ role, userName, section }: RoleDashboardProps) {
  const pathname = usePathname();
  const nav = NAV_BY_ROLE[role];
  const roleTitle = getRoleTitle(role);
  const isNetMetering = role === "net-metering-team";
  const isFinanceTeam = role === "finance-team";
  const isAmcTeam = role === "amc-team";
  const hasOwnHero = hasRoleSpecificHero(role);
  const activeItem = (() => {
    if (role === "design-team") {
      if (pathname?.includes("/design-workflow")) return "Design Workflow";
      if (pathname?.includes("/requests")) return "Requests";
      return "Dashboard";
    }

    if (role === "admin") {
      if (pathname?.includes("/approval-management")) return "Approval Management";
      if (pathname?.includes("/leads-projects")) return "Leads & Projects";
      if (pathname?.includes("/vendor-management")) return "Vendor Management";
      if (pathname?.includes("/team-management")) return "Team Management";
      if (pathname?.includes("/loan-management")) return "Loan Management";
      if (pathname?.includes("/fin-tech-partners")) return "Partners";
      if (pathname?.includes("/inventory-management")) return "Supply Chain Management";
      if (pathname?.includes("/reports")) return "Reports";
      if (pathname?.includes("/ticket-alerts")) return "Tickets";
      if (pathname?.includes("/support")) return "Support";
      if (pathname?.includes("/settings")) return "Settings";
      return "Dashboard";
    }

    return "Dashboard";
  })();

  return (
    <div className="min-h-screen bg-[#eceff4] text-[#141b29]">
      <div className="flex min-h-screen">
        <aside
          className={`hidden border-r border-[#d9deea] xl:block ${
            isAmcTeam ? "w-[240px] bg-white" : isNetMetering ? "w-[240px] bg-[#f7f9fc]" : "w-[240px] bg-white"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-[#e9edf6] px-4">
            <div className="text-lg font-semibold tracking-wide text-[#1a2140]">RENGY</div>
          </div>
          <RoleNavigationMenu
            role={role}
            navItems={nav}
            activeItem={activeItem}
            compactText={isNetMetering}
            netMeteringContactMenu={isNetMetering}
            financeContactMenu={isFinanceTeam}
          />
        </aside>

        <main className="flex-1">
          <DashboardTopHeader roleTitle={roleTitle} userName={userName} compactTitle={isNetMetering} />

          <div className={hasOwnHero ? "pb-4 pl-4 pr-0 pt-0 xl:pb-5 xl:pl-5 xl:pr-0 xl:pt-0" : "p-4 xl:p-5"}>
            {!hasOwnHero ? (
              <h1 className={`${isNetMetering ? "text-[52px]" : "text-5xl"} font-medium leading-none tracking-[-0.02em] text-[#171f2d]`}>
                Hi {userName}
              </h1>
            ) : null}
            <div className={hasOwnHero ? "" : "mt-4"}>
              <DashboardBody role={role} userName={userName} section={section} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
