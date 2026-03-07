"use client";

import { RoleSlug } from "@/features/auth/auth-config";
import { DashboardTopHeader } from "@/features/dashboard/components/shared/DashboardTopHeader";
import { RoleNavigationMenu } from "@/features/dashboard/components/shared/RoleNavigationMenu";
import {
  getRoleTitle,
  hasRoleSpecificHero,
  NAV_BY_ROLE,
} from "@/features/dashboard/config/role-dashboard-config";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LeadsProjectsPage from "@/app/leads-projects/page";
import TicketAlertsPage from "@/app/ticket-alerts/page";
import VendorManagementPage from "@/app/vendor-management/page";
import VendorDetailPage from "@/app/vendor-management/[vendorId]/page";
import { AmcDashboard } from "./roles/AmcDashboard";
import { DesignTeamDashboard } from "./roles/DesignTeamDashboard";
import { FinanceDashboard } from "./roles/FinanceDashboard";
import { LoanDashboard } from "./roles/LoanDashboard";
import { NetMeteringDashboard } from "./roles/NetMeteringDashboard";
import { OperationsDashboard } from "./roles/OperationsDashboard";
import { SalesDashboard } from "./roles/SalesDashboard";
import { SalesReportsDashboard } from "./roles/SalesReportsDashboard";
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
    if (section === "leads") {
      return <LeadsProjectsPage mode="sales-embedded" />;
    }
    if (section === "vendor-management") {
      return <VendorManagementPage mode="sales-embedded" />;
    }
    if (section === "vendor-management-detail") {
      return <VendorDetailPage mode="sales-embedded" />;
    }
    if (section === "reports") {
      return <SalesReportsDashboard />;
    }
    if (section === "ticket-alerts") {
      return <TicketAlertsPage mode="sales-embedded" />;
    }
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("rengy-role-sidebar-collapsed") === "1";
  });
  const [forceCompact, setForceCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1279px)");
    const handleChange = () => setForceCompact(media.matches);
    handleChange();

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const isCollapsed = collapsed || forceCompact;
  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rengy-role-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

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

    if (role === "sales-team") {
      if (pathname?.includes("/sales-team/leads")) return "Leads";
      if (pathname?.includes("/sales-team/vendor-management")) return "Vendor Management";
      if (pathname?.includes("/sales-team/reports")) return "Reports";
      if (pathname?.includes("/sales-team/ticket-alerts")) return "Tickets";
      return "Dashboard";
    }

    return "Dashboard";
  })();

  return (
    <div className="min-h-screen bg-[#eceff4] text-[#141b29]">
      <div className="flex min-h-screen">
        <aside
          className={`block border-r border-[#d9deea] ${
            isCollapsed ? "w-[76px]" : "w-[240px]"
          } ${isAmcTeam ? "bg-white" : isNetMetering ? "bg-[#f7f9fc]" : "bg-white"}`}
        >
          <div className="flex h-14 items-center justify-between border-b border-[#e9edf6] px-4">
            <div className={`font-semibold tracking-wide text-[#1a2140] ${isCollapsed ? "text-base" : "text-lg"}`}>
              {isCollapsed ? "R" : "RENGY"}
            </div>
            {!forceCompact ? (
              <button
                onClick={toggleSidebar}
                className="rounded border border-[#cfd6e2] p-1 text-[#5f6878] hover:bg-[#edf1f7]"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            ) : null}
          </div>
          <RoleNavigationMenu
            role={role}
            navItems={nav}
            activeItem={activeItem}
            collapsed={isCollapsed}
            compactText={isNetMetering}
            netMeteringContactMenu={isNetMetering}
            financeContactMenu={isFinanceTeam}
          />
        </aside>

        <main className="min-w-0 flex-1">
          <DashboardTopHeader roleTitle={roleTitle} userName={userName} compactTitle={isNetMetering} />

          <div className={`${hasOwnHero ? "pb-4 pl-4 pr-0 pt-0 xl:pb-5 xl:pl-5 xl:pr-0 xl:pt-0" : "p-4 xl:p-5"} min-w-0`}>
            {!hasOwnHero ? (
              <h1 className={`${isNetMetering ? "text-[52px]" : "text-5xl"} font-medium leading-none tracking-[-0.02em] text-[#171f2d]`}>
                Hi {userName}
              </h1>
            ) : null}
            <div className={`${hasOwnHero ? "" : "mt-4"} min-w-0`}>
              <DashboardBody role={role} userName={userName} section={section} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
