import Link from "next/link";
import type { RoleSlug } from "@/features/auth/auth-config";
import { ClipboardList, ContactRound, LayoutDashboard, Repeat2, Route, Settings, Truck, Wrench } from "lucide-react";
import type { ReactNode } from "react";

type RoleNavigationMenuProps = {
  role: RoleSlug;
  navItems: string[];
  activeItem?: string;
  collapsed?: boolean;
  compactText?: boolean;
  financeContactMenu?: boolean;
  netMeteringContactMenu?: boolean;
};

function getAdminIconKey(item: string):
  | "dashboard"
  | "approval"
  | "leads"
  | "vendor"
  | "team"
  | "loan"
  | "partners"
  | "inventory"
  | "reports"
  | "tickets"
  | "support"
  | "settings"
  | null {
  switch (item) {
    case "Dashboard":
      return "dashboard";
    case "Approval Management":
      return "approval";
    case "Leads & Projects":
    case "Leads":
    case "Projects":
      return "leads";
    case "Vendor Management":
    case "Vendor Disbursal":
      return "vendor";
    case "Team Management":
    case "Subscribers":
      return "team";
    case "Loan Management":
    case "Loan Requests":
    case "Payments":
      return "loan";
    case "Partners":
    case "Fin-Tech Partners":
      return "partners";
    case "Supply Chain Management":
    case "Inventory Hub":
    case "Procurement":
      return "inventory";
    case "Reports":
      return "reports";
    case "Tickets":
    case "Ticket & Alerts":
    case "Tickets & Alerts":
      return "tickets";
    case "Support":
      return "support";
    case "Settings":
      return "settings";
    default:
      return null;
  }
}

function renderAdminIcon(
  key:
    | "dashboard"
    | "approval"
    | "leads"
    | "vendor"
    | "team"
    | "loan"
    | "partners"
    | "inventory"
    | "reports"
    | "tickets"
    | "support"
    | "settings",
) {
  switch (key) {
    case "dashboard":
      return (
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 2H2.66667C2.29848 2 2 2.29848 2 2.66667V7.33333C2 7.70152 2.29848 8 2.66667 8H6C6.36819 8 6.66667 7.70152 6.66667 7.33333V2.66667C6.66667 2.29848 6.36819 2 6 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.332 2H9.9987C9.63051 2 9.33203 2.29848 9.33203 2.66667V4.66667C9.33203 5.03486 9.63051 5.33333 9.9987 5.33333H13.332C13.7002 5.33333 13.9987 5.03486 13.9987 4.66667V2.66667C13.9987 2.29848 13.7002 2 13.332 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.332 8H9.9987C9.63051 8 9.33203 8.29848 9.33203 8.66667V13.3333C9.33203 13.7015 9.63051 14 9.9987 14H13.332C13.7002 14 13.9987 13.7015 13.9987 13.3333V8.66667C13.9987 8.29848 13.7002 8 13.332 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 10.668H2.66667C2.29848 10.668 2 10.9664 2 11.3346V13.3346C2 13.7028 2.29848 14.0013 2.66667 14.0013H6C6.36819 14.0013 6.66667 13.7028 6.66667 13.3346V11.3346C6.66667 10.9664 6.36819 10.668 6 10.668Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "approval":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12.668 7.33203H18.0013" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.668 12H18.0013" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.668 16.668H18.0013" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 15.3333L7.33333 16.6667L10 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 8.66536L7.33333 9.9987L10 7.33203" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "leads":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M16.6654 18V16.6667C16.6654 15.9594 16.3844 15.2811 15.8843 14.781C15.3842 14.281 14.7059 14 13.9987 14H9.9987C9.29145 14 8.61318 14.281 8.11308 14.781C7.61298 15.2811 7.33203 15.9594 7.33203 16.6667V18" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.9987 11.3333C13.4715 11.3333 14.6654 10.1394 14.6654 8.66667C14.6654 7.19391 13.4715 6 11.9987 6C10.5259 6 9.33203 7.19391 9.33203 8.66667C9.33203 10.1394 10.5259 11.3333 11.9987 11.3333Z" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "vendor":
    case "team":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.6667 11.3333C12.1394 11.3333 13.3333 10.1394 13.3333 8.66667C13.3333 7.19391 12.1394 6 10.6667 6C9.19391 6 8 7.19391 8 8.66667C8 10.1394 9.19391 11.3333 10.6667 11.3333Z" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.8667 14H8.66667C7.95942 14 7.28115 14.281 6.78105 14.781C6.28095 15.2811 6 15.9594 6 16.6667V18" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 14.3333V13.3333C14 12.9797 14.1405 12.6406 14.3905 12.3905C14.6406 12.1405 14.9797 12 15.3333 12C15.687 12 16.0261 12.1405 16.2761 12.3905C16.5262 12.6406 16.6667 12.9797 16.6667 13.3333V14.3333" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.402 14.668H13.2673C12.9363 14.668 12.668 14.9363 12.668 15.2673V17.402C12.668 17.733 12.9363 18.0013 13.2673 18.0013H17.402C17.733 18.0013 18.0013 17.733 18.0013 17.402V15.2673C18.0013 14.9363 17.733 14.668 17.402 14.668Z" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "loan":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11.332 15.3333H13.332V16.6667C13.332 16.8435 13.4023 17.013 13.5273 17.1381C13.6523 17.2631 13.8219 17.3333 13.9987 17.3333H15.332C15.5088 17.3333 15.6784 17.2631 15.8034 17.1381C15.9285 17.013 15.9987 16.8435 15.9987 16.6667V14.6667C16.3092 14.5633 16.5914 14.3889 16.8229 14.1575C17.0543 13.9261 17.2286 13.6439 17.332 13.3333H17.9987C18.1755 13.3333 18.3451 13.2631 18.4701 13.1381C18.5951 13.013 18.6654 12.8435 18.6654 12.6667V11.3333C18.6654 11.1565 18.5951 10.987 18.4701 10.8619C18.3451 10.7369 18.1755 10.6667 17.9987 10.6667H17.332C17.332 10.1492 17.2115 9.63881 16.9801 9.17595C16.7487 8.7131 16.4127 8.31049 15.9987 8V6C15.5847 6 15.1764 6.09639 14.8061 6.28153C14.4358 6.46667 14.1138 6.73548 13.8654 7.06667L13.6654 7.33333H11.332C10.2712 7.33333 9.25375 7.75476 8.5036 8.50491C7.75346 9.25505 7.33203 10.2725 7.33203 11.3333V12C7.33203 12.5175 7.45251 13.0279 7.68394 13.4907C7.91537 13.9536 8.25138 14.3562 8.66536 14.6667V16.6667C8.66536 16.8435 8.7356 17.013 8.86063 17.1381C8.98565 17.2631 9.15522 17.3333 9.33203 17.3333H10.6654C10.8422 17.3333 11.0117 17.2631 11.1368 17.1381C11.2618 17.013 11.332 16.8435 11.332 16.6667V15.3333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.668 10.668H14.6746" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33203 9.33203V9.9987C5.33203 10.3523 5.47251 10.6915 5.72256 10.9415C5.9726 11.1916 6.31174 11.332 6.66536 11.332H7.33203" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "partners":
    case "inventory":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5.33203 8H7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33203 10.668H7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33203 13.332H7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33203 16H7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.0013 5.33203H8.0013C7.26492 5.33203 6.66797 5.92898 6.66797 6.66536V17.332C6.66797 18.0684 7.26492 18.6654 8.0013 18.6654H16.0013C16.7377 18.6654 17.3346 18.0684 17.3346 17.332V6.66536C17.3346 5.92898 16.7377 5.33203 16.0013 5.33203Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 5.33203V18.6654" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 8.66797H17.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 12H17.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 15.332H17.3333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "reports":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9.33203 5.33203V7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 5.33203V7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.668 5.33203V7.9987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.0013 6.66797H8.0013C7.26492 6.66797 6.66797 7.26492 6.66797 8.0013V17.3346C6.66797 18.071 7.26492 18.668 8.0013 18.668H16.0013C16.7377 18.668 17.3346 18.071 17.3346 17.3346V8.0013C17.3346 7.26492 16.7377 6.66797 16.0013 6.66797Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.33203 10.668H13.332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.33203 13.332H14.6654" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.33203 16H12.6654" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "tickets":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5.99316 14.8932C6.09118 15.1404 6.11301 15.4114 6.05583 15.6712L5.34583 17.8645C5.32295 17.9757 5.32886 18.091 5.36301 18.1993C5.39716 18.3076 5.4584 18.4053 5.54094 18.4833C5.62347 18.5613 5.72456 18.617 5.83463 18.6449C5.94469 18.6729 6.06007 18.6723 6.16983 18.6432L8.44516 17.9778C8.6903 17.9292 8.94418 17.9505 9.17783 18.0392C10.6014 18.704 12.2141 18.8446 13.7313 18.4363C15.2484 18.028 16.5727 17.0969 17.4703 15.8074C18.3679 14.5179 18.7812 12.9528 18.6374 11.3882C18.4935 9.82362 17.8016 8.36014 16.6839 7.25596C15.5661 6.15178 14.0943 5.47785 12.5281 5.35309C10.9619 5.22833 9.40192 5.66075 8.12345 6.57405C6.84499 7.48736 5.93018 8.82285 5.54042 10.3449C5.15066 11.867 5.311 13.4778 5.99316 14.8932Z" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9.33203V11.9987" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14.668H12.0067" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "support":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 11.332H8C8.35362 11.332 8.69276 11.4725 8.94281 11.7226C9.19286 11.9726 9.33333 12.3117 9.33333 12.6654V14.6654C9.33333 15.019 9.19286 15.3581 8.94281 15.6082C8.69276 15.8582 8.35362 15.9987 8 15.9987H7.33333C6.97971 15.9987 6.64057 15.8582 6.39052 15.6082C6.14048 15.3581 6 15.019 6 14.6654V11.332ZM6 11.332C6 10.5441 6.15519 9.76388 6.45672 9.03593C6.75825 8.30798 7.20021 7.64654 7.75736 7.08939C8.31451 6.53224 8.97595 6.09028 9.7039 5.78875C10.4319 5.48723 11.2121 5.33203 12 5.33203C12.7879 5.33203 13.5681 5.48723 14.2961 5.78875C15.0241 6.09028 15.6855 6.53224 16.2426 7.08939C16.7998 7.64654 17.2417 8.30798 17.5433 9.03593C17.8448 9.76388 18 10.5441 18 11.332M18 11.332V14.6654C18 15.019 17.8595 15.3581 17.6095 15.6082C17.3594 15.8582 17.0203 15.9987 16.6667 15.9987H16C15.6464 15.9987 15.3072 15.8582 15.0572 15.6082C14.8071 15.3581 14.6667 15.019 14.6667 14.6654V12.6654C14.6667 12.3117 14.8071 11.9726 15.0572 11.7226C15.3072 11.4725 15.6464 11.332 16 11.332H18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 14.668V16.0013C18 16.7085 17.719 17.3868 17.219 17.8869C16.7189 18.387 16.0406 18.668 15.3333 18.668H12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "settings":
      return <Settings className="h-4 w-4" aria-hidden="true" />;
  }
}

function getMenuIcon(item: string) {
  const adminIconKey = getAdminIconKey(item);
  if (adminIconKey) {
    return renderAdminIcon(adminIconKey);
  }

  switch (item) {
    case "Requests":
    case "Loan Requests":
    case "AMC Requests":
      return <ClipboardList className="h-4 w-4" aria-hidden="true" />;
    case "Design Workflow":
      return <Route className="h-4 w-4" aria-hidden="true" />;
    case "Follow Ups":
      return <Repeat2 className="h-4 w-4" aria-hidden="true" />;
    case "Dispatch Management":
    case "Vehicles & Drivers":
      return <Truck className="h-4 w-4" aria-hidden="true" />;
    case "Technicians":
      return <Wrench className="h-4 w-4" aria-hidden="true" />;
    case "Contact":
      return <ContactRound className="h-4 w-4" aria-hidden="true" />;
    default:
      return <LayoutDashboard className="h-4 w-4" aria-hidden="true" />;
  }
}

export function RoleNavigationMenu({
  role,
  navItems,
  activeItem,
  collapsed = false,
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

    if (role === "sales-team" && item === "Leads") {
      return "/sales-team/leads";
    }
    if (role === "sales-team" && item === "Reports") {
      return "/sales-team/reports";
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
              const icon = getMenuIcon(item);
              const baseColorClass = isActive
                ? "bg-[#dff8f1] font-semibold text-[#24a87c]"
                : "text-[#596173] hover:bg-[#f3f6fb]";
              const className = collapsed
                ? `mx-auto flex h-9 w-9 items-center justify-center rounded ${baseColorClass}`
                : `flex w-full items-center gap-2 whitespace-nowrap rounded px-3 py-2 text-left ${
                    compactText ? "text-[11px] font-medium" : "text-sm"
                  } ${baseColorClass}`;
              const content = collapsed ? (
                icon
              ) : (
                <>
                  <span className="shrink-0">{icon}</span>
                  <span>{item}</span>
                </>
              );

              if (href) {
                return (
                  <Link href={href} className={className} title={collapsed ? item : undefined}>
                    {content}
                  </Link>
                );
              }

              return (
                <button type="button" className={className} title={collapsed ? item : undefined}>
                  {content}
                </button>
              );
            })()}
            {!collapsed && netMeteringContactMenu && item === "Contact" ? (
              <RoleSubmenu>
                <div className="rounded px-2 py-1">Customers</div>
                <div className="rounded px-2 py-1">Vendors</div>
              </RoleSubmenu>
            ) : null}
            {!collapsed && financeContactMenu && item === "Contact" ? (
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
