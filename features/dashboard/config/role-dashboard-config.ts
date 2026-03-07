import { ROLE_LABELS, RoleSlug } from "@/features/auth/auth-config";

export type StatItem = {
  value: string;
  label: string;
  note: string;
};

export const NAV_BY_ROLE: Record<RoleSlug, string[]> = {
  admin: [
    "Dashboard",
    "Approval Management",
    "Leads & Projects",
    "Vendor Management",
    "Team Management",
    "Loan Management",
    "Partners",
    "Supply Chain Management",
    "Reports",
    "Tickets",
    "Support",
    "Settings",
  ],
  "design-team": ["Dashboard", "Requests", "Design Workflow", "Reports", "Tickets"],
  "operations-team": [
    "Dashboard",
    "Approval Management",
    "Leads & Projects",
    "Vendor Management",
    "Team Management",
    "Partners",
    "Supply Chain Management",
    "Reports",
    "Tickets",
    "Support",
  ],
  "net-metering-team": ["Dashboard", "Projects", "Reports", "Tickets & Alerts", "Contact"],
  "loan-team": ["Dashboard", "Loan Requests", "Reports", "Ticket & Alerts", "Vendor Management", "Fin-Tech Partners"],
  "sales-team": ["Dashboard", "Leads", "Vendor Management", "Reports", "Tickets"],
  "amc-team": ["Dashboard", "AMC Requests", "Subscribers", "Technicians", "Tickets & Alerts", "Reports"],
  "finance-team": ["Dashboard", "Payments", "Projects", "Vendor Disbursal", "Reports", "Tickets & Alerts", "Contact"],
  "supply-chain-team": [
    "Dashboard",
    "Procurement",
    "Dispatch Management",
    "Inventory Hub",
    "Reports",
    "Tickets",
    "Vehicles & Drivers",
  ],
};

export const STATS_BY_ROLE: Record<RoleSlug, StatItem[]> = {
  admin: [
    { value: "INR 3.8 Cr", label: "Total Revenue Impact", note: "+6% growth vs last month" },
    { value: "1202", label: "Active Projects", note: "+8% higher than last month" },
    { value: "40%", label: "Overall SLA Compliance", note: "+4% adherence improvement" },
    { value: "INR 62 Lakh", label: "Pending Collections", note: "-4% overdue invoices" },
  ],
  "design-team": [
    { value: "18", label: "Total pending initial design requests", note: "-2% last month" },
    { value: "15", label: "Pending DPRs", note: "+2% from last month" },
    { value: "15", label: "Pending BOMs after DPR creation", note: "Total DPR created: 100" },
    { value: "12", label: "Approval SLA breach", note: "DPR approvals delayed beyond 1 day SLA" },
    { value: "2.1 days", label: "Average DPR Upload Time", note: "From assignment to submission" },
    { value: "18", label: "Total DPR sent", note: "Sent BOM awaiting approval" },
    { value: "18", label: "Total DPR Approved", note: "Sent BOM approved" },
    { value: "78%", label: "First time approval rate", note: "Approval rate in %" },
  ],
  "operations-team": [
    { value: "12", label: "BOM Received", note: "+6% vs last month" },
    { value: "70%", label: "Dispatch Pending Projects", note: "+5% vs last month" },
    { value: "54", label: "Active BOMs in Procurement", note: "+4% vs last month" },
    { value: "19", label: "Projects require extra material / re-dispatch", note: "12% requires review" },
    { value: "19", label: "Part material pending projects", note: "+3% vs last week" },
    { value: "19", label: "Avg Days in Procurement", note: "97% dispatch on time" },
    { value: "12", label: "Projects In-Transit", note: "+10% vs last week" },
    { value: "70", label: "Dispatched Count", note: "+4% vs last month" },
    { value: "120", label: "No. of materials shortage", note: "2 items are critical" },
    { value: "120", label: "Part material in transit", note: "2 items arriving critically late" },
  ],
  "net-metering-team": [
    { value: "18", label: "Pending Documents", note: "-18% vs this month" },
    { value: "38", label: "Documents Sent", note: "+18% vs this month" },
    { value: "18", label: "Avg. Approval Time", note: "+18% vs this month" },
    { value: "18", label: "Load Extension Cases", note: "-18% vs this month" },
    { value: "180", label: "Total applications", note: "+18% vs this month" },
    { value: "38", label: "Meter Installed", note: "+18% vs this month" },
  ],
  "loan-team": [
    { value: "82%", label: "Loan Approval Rate", note: "+6% vs last month" },
    { value: "3.8 Days", label: "Avg. Approval Time", note: "-0.4 days vs last month" },
    { value: "12", label: "Pending Documents", note: "2 bank statement | 3 electricity bill" },
    { value: "INR 42.5 Lakh", label: "Total Value of Approved Cases", note: "+12% vs last month" },
    { value: "INR 42.5 Lakh", label: "Total Amount Disbursed", note: "+12.5% vs last month" },
  ],
  "sales-team": [
    { value: "126", label: "New Leads", note: "+12% this week" },
    { value: "42%", label: "Lead to DPR Conversion", note: "+3% this month" },
    { value: "28", label: "Pending Site Visits", note: "7 due today" },
    { value: "INR 1.2 Cr", label: "Pipeline Value", note: "+18% vs last month" },
  ],
  "amc-team": [
    { value: "240", label: "Total AMC Subscribed", note: "+4% vs last month" },
    { value: "INR 24 Cr", label: "AMC Revenue", note: "+12% vs last month" },
    { value: "70%", label: "AMC Renewal Rate", note: "+12% vs last month" },
    { value: "120", label: "Open Tickets", note: "+20% vs last month" },
    { value: "42", label: "Maintenance Completed", note: "Improved by 12% vs last month" },
  ],
  "finance-team": [
    { value: "INR 24.6 Cr", label: "Total Payments Collected", note: "+8% payment flow this month" },
    { value: "185", label: "Projects Cleared 80% Payment", note: "+8% this month" },
    { value: "INR 4.8 Cr", label: "Pending Payment Dues", note: "43 projects in red zone" },
    { value: "INR 2.5 Lakhs", label: "Overdue Payments", note: "Payment delayed beyond 15 days" },
  ],
  "supply-chain-team": [
    { value: "12", label: "BOM Received", note: "+6% vs last month" },
    { value: "70%", label: "Dispatch Pending Projects", note: "+5% vs last month" },
    { value: "54", label: "Active BOMs in Procurement", note: "+4% vs last month" },
    { value: "19", label: "Projects require extra material / re-dispatch", note: "12% projects again due to damage" },
    { value: "19", label: "Part material pending projects", note: "+3% vs last week" },
    { value: "19", label: "Avg Days in Procurement", note: "97% dispatch on time" },
    { value: "12", label: "Projects In-Transit", note: "+10% vs last week" },
    { value: "70", label: "Dispatched Count", note: "+4% dispatch vs last month" },
    { value: "120", label: "No. of materials shortage", note: "2 items are flagged critical" },
    { value: "120", label: "Part material in transit", note: "2 items arriving critically late" },
  ],
};

const ROLES_WITH_OWN_HERO: RoleSlug[] = ["design-team", "loan-team", "sales-team", "amc-team", "finance-team", "supply-chain-team"];
const OVERVIEW_TITLED_ROLES: RoleSlug[] = ["sales-team", "supply-chain-team"];

export function getRoleTitle(role: RoleSlug): string {
  if (OVERVIEW_TITLED_ROLES.includes(role)) {
    return "Overview";
  }
  if (role === "amc-team") {
    return "AMC CRM";
  }
  return ROLE_LABELS[role];
}

export function hasRoleSpecificHero(role: RoleSlug): boolean {
  return ROLES_WITH_OWN_HERO.includes(role);
}
