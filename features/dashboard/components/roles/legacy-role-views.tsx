"use client";

import { RoleSlug } from "@/features/auth/auth-config";
import { DashboardTopHeader } from "@/features/dashboard/components/shared/DashboardTopHeader";
import { RoleNavigationMenu } from "@/features/dashboard/components/shared/RoleNavigationMenu";
import { CalendarDays, ChevronDown, ChevronRight, Eye, MoreVertical, Trash2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getRoleTitle,
  hasRoleSpecificHero,
  NAV_BY_ROLE,
  StatItem,
  STATS_BY_ROLE,
} from "@/features/dashboard/config/role-dashboard-config";

type RoleDashboardProps = {
  role: RoleSlug;
  userName: string;
  section?: string;
};

type PanelCard = {
  title: string;
  subtitle?: string;
  action?: string;
};

type OperationsKpi = {
  value: string;
  title: string;
  note: string;
  danger?: boolean;
};

const operationsKpis: OperationsKpi[] = [
  { value: "132", title: "Total Active Projects", note: "+18 vs last 30 days" },
  { value: "2.4 days", title: "Average Delay (Days)", note: "Avg Delays reduced by 8%" },
  { value: "87%", title: "Projects On Track", note: "of total ongoing projects" },
  { value: "92%", title: "SLA Adherence Rate", note: "Improved by +4% vs last month" },
  { value: "20", title: "Rejected Loans", note: "5 Loan requests rejected by 8 days", danger: true },
  { value: "24", title: "Pending Installations", note: "across 6 vendors" },
  { value: "318", title: "Materials Delivered", note: "+45 since last month" },
  { value: "INR 1.24 Cr", title: "Total Payments", note: "across 93 projects" },
  { value: "14.6 days", title: "Avg Project Cycle Time", note: "reduced by 1.2 days" },
  { value: "15%", title: "% of total DPR rejected", note: "DPRs Rejected (x1)", danger: true },
];

const operationsTopPerformers = [1, 2, 3, 4, 5];

const operationsDispatchRows = Array.from({ length: 5 }, () => ({
  vendor: "SolarPrime Pvt. Ltd.",
  onTime: "4",
  csat: "3/4 Dispatched",
  resolution: "ATS Logistics",
  active: "18",
  score: "96",
}));

const operationsPipelineColumns = [
  { label: "04", title: "DPR Approval", tagOk: "DPR Sent", tagBad: "DPR Not Approved" },
  { label: "05", title: "Procurement", tagOk: "Procurement Started", tagBad: "Material Procured" },
  { label: "06", title: "Dispatch", tagOk: "Module Delivered", tagBad: "Inverter Delivered" },
];

type NetMeteringMetric = {
  value: string;
  title: string;
  note: string;
  down?: boolean;
};

const netMeteringMetricsTop: NetMeteringMetric[] = [
  { value: "18", title: "Pending Documents", note: "-18% vs this month", down: true },
  { value: "38", title: "Documents Sent", note: "+18% vs this month" },
  { value: "18", title: "Avg. Approval Time", note: "+18% vs this month" },
  { value: "18", title: "Load Extension Cases", note: "-18% vs this month", down: true },
];

const netMeteringMetricsBottom: NetMeteringMetric[] = [
  { value: "180", title: "Total applications", note: "+18% vs this month" },
  { value: "38", title: "Meter Installed", note: "+18% vs this month" },
];

const netMeteringApplications = Array.from({ length: 4 }, () => ({
  region: "TSPDCL - H...",
  state: "Hyderabad",
  docsSent: "02",
  pending: "01",
  total: "30",
}));

const netMeteringLoadRows = Array.from({ length: 18 }, (_, idx) => ({
  projectId: "#P001",
  customer: idx % 2 === 0 ? "Ramesh" : "Rajesh",
  customerPhone: "+91 998077554",
  vendor: idx % 2 === 0 ? "Ramesh" : "Rajesh",
  vendorPhone: "+91 998077554",
  paymentType: idx % 3 === 0 ? "Loan" : "Direct Payment",
  paymentCompletion: "45%",
  state: "Andra Pradesh",
  region: "TRPDCL - Vijayawada",
  status: idx % 3 === 0 ? "Docs Pending" : idx % 3 === 1 ? "Docs Sent" : "Meter Installed",
  slaRemaining: idx % 2 === 0 ? "02 days" : "07 days",
  evidence: "2 Files attached",
  remarks: idx % 2 === 0 ? "---" : "Received Transaction late",
}));

const loanRejectionRows = [
  { id: "PRD-205001", vendor: "Nidhi Jain", amount: "INR 4,50,000", reason: "Document Missing", assigned: "John" },
  { id: "PRD-205001", vendor: "Rajesh Iyer", amount: "INR 3,12,000", reason: "Bank not approved", assigned: "Rakesh" },
  { id: "PRD-205001", vendor: "Rajesh Iyer", amount: "INR 3,12,000", reason: "Document Missing", assigned: "Rakesh" },
  { id: "PRD-205001", vendor: "Nidhi Jain", amount: "INR 4,50,000", reason: "Bank not approved", assigned: "John" },
  { id: "PRD-205001", vendor: "Rajesh Iyer", amount: "INR 3,12,000", reason: "Bank not approved", assigned: "Rakesh" },
];

const loanPendingCards = [
  { docs: ["Aadhaar card"] },
  { docs: ["Bank statement", "Aadhaar card"] },
  { docs: ["Aadhaar card"] },
];

type SalesKpi = {
  value: string;
  title: string;
  note: string;
  danger?: boolean;
};

const salesKpis: SalesKpi[] = [
  { value: "250", title: "Total Leads Created", note: "+18 leads vs last 30 days" },
  { value: "INR 12.5 Cr", title: "Total Sales Revenue", note: "+INR 520K vs last 30 days" },
  { value: "INR 12.5 Cr", title: "Total Pipeline Value", note: "+INR 1.2 Cr profit vs last 30 days" },
  { value: "INR 2.5 Lakhs", title: "Pending Payment Projects", note: "5 projects delayed by 8 days", danger: true },
  { value: "120", title: "Deals Won", note: "+12 vs last 10 days" },
  { value: "INR 3.1 Lakhs", title: "Average Deal Size", note: "+INR 0.4 L vs last 30 days" },
  { value: "18 Days", title: "Avg Sales Cycle Length", note: "-2 days vs last 30 days" },
  { value: "03", title: "Leads Lost", note: "-5 vs last 30 days", danger: true },
];

const salesPaymentRows = Array.from({ length: 5 }, () => ({
  projectId: "PRD-205001",
  vendor: "Nidhi Jain",
  amount: "INR 4,50,000",
  type: "Loan",
  assigned: "John",
}));

const amcStats = [
  { value: "240", title: "Total AMC Subscribed", note: "+12% than last month" },
  { value: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹24 Cr", title: "AMC Revenue", note: "+12% than last month" },
  { value: "70%", title: "AMC Renewal Rate", note: "+12% than last month" },
  { value: "120", title: "Open Tickets", note: "120+ Last Month" },
  { value: "42", title: "Maintenance Completed", note: "Improved by 12% vs last month." },
];

const amcRecentRows = Array.from({ length: 6 }, (_, idx) => ({
  projectId: "#1023",
  customer: "Murugan",
  address: "4th Floor, RMZ Infinity, Old Madras Road, Bengaluru - 560016",
  contact: "+918912839123",
  email: "sampe@gmail.com",
  service: idx % 3 === 0 ? "Inspection & Maintenance" : idx % 3 === 1 ? "Repair & Replacement" : "Performance Monitoring",
  preferredDate: "12-02-2024",
  amcPlan: idx % 3 === 0 ? "Monthly Plan" : idx % 3 === 1 ? "Monthly Plan" : "Yearly Plan",
  requestId: idx % 2 === 0 ? "123123123" : "---",
  technician: "Technician_John",
  visitScheduled: idx % 2 === 0 ? "12-02-2024" : "---",
  lifecycleStatus: idx % 3 === 0 ? "Pending" : idx % 3 === 1 ? "Cancelled" : "Open",
  lifecycleTone: idx % 3 === 0 ? "pending" : idx % 3 === 1 ? "cancelled" : "open",
  projectStatus: idx % 3 === 0 ? "Closed" : idx % 3 === 1 ? "Open" : "Completed",
  projectTone: idx % 3 === 0 ? "closed" : idx % 3 === 1 ? "open" : "completed",
}));

type FinanceKpi = {
  value: string;
  title: string;
  note: string;
  danger?: boolean;
};

const financeKpis: FinanceKpi[] = [
  { value: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ 24.6 Cr", title: "Total Payments Collected", note: "+1Cr Payment vs last 30 days" },
  { value: "185", title: "Projects Cleared 60% Payment", note: "12 Projects vs last 30 days" },
  { value: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ 4.8 Cr", title: "Pending Payment Dues", note: "+12 Projects vs last 30 days" },
  { value: "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹2.5 Lakhs", title: "Overdue Payments", note: "5 projects delayed by 8 days", danger: true },
];

const financeOverdueRows = Array.from({ length: 4 }, (_, idx) => ({
  id: "PRD-205001",
  vendor: idx % 2 === 0 ? "Nidhi Jain" : "Rajesh Iyer",
  customer: "Ram Jain",
  amount: idx % 2 === 0 ? "Loan" : "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹3,12,000",
  type: idx % 2 === 0 ? "Loan" : "Direct Payment",
  assigned: idx % 2 === 0 ? "John" : "Rakesh",
}));

type SupplyKpi = {
  value: string;
  title: string;
  note: string;
  danger?: boolean;
};

const supplyKpis: SupplyKpi[] = [
  { value: "12", title: "BOM Received", note: "+5% vs last month" },
  { value: "70%", title: "Dispatch Pending Projects", note: "+5% vs last month" },
  { value: "54", title: "Active BOMs in Procurement", note: "+8 percent vs last month" },
  { value: "19", title: "Projects require extra material / re-dispatch", note: "12% require again due to damage" },
  { value: "19", title: "Part material Pending projects", note: "+3 percent vs last week" },
  { value: "19", title: "Avg Days in Procurement", note: "87% Dispatch On-Time" },
  { value: "12", title: "Projects In - Transit", note: "+12% vs last month" },
  { value: "70", title: "Dispatched Count", note: "+4 percent month on month" },
  { value: "120", title: "No of materials shortage", note: "2 items are running critically low", danger: true },
  { value: "120", title: "Part material in transit.", note: "2 items are running critically low", danger: true },
];

type DesignKpi = {
  value: string;
  title: string;
  note: string;
  danger?: boolean;
};

const designKpis: DesignKpi[] = [
  { value: "18", title: "Total pending initial design requests", note: "-2% last month" },
  { value: "15", title: "Pending DPRs", note: "+12% Form Last Month", danger: true },
  { value: "15", title: "Pending BOMs after DPR creation", note: "Total DPR Created :100", danger: true },
  { value: "12", title: "Approval SLA breach", note: "DPR approvals delayed beyond 1-day SLA" },
  { value: "2.1days", title: "Average DPR Upload Time", note: "From assignment to submission" },
  { value: "18", title: "Total DPR sent", note: "Sent Bom awaiting approval" },
  { value: "18", title: "Total DPR Approved", note: "Sent Bom Approved" },
  { value: "78%", title: "First time approval rate", note: "Approval rate in %" },
];

function OperationsKpiCard({ item }: { item: OperationsKpi }) {
  const renderValue = () => {
    if (item.value.toLowerCase().endsWith(" days")) {
      const numberPart = item.value.replace(/ days$/i, "");
      return (
        <div className="flex items-end gap-1">
          <span className="text-3xl font-semibold leading-none tracking-[-0.01em] text-[#202225] lg:text-[2rem]">
            {numberPart}
          </span>
          <span className="text-base font-semibold leading-none text-[#202225]">days</span>
        </div>
      );
    }

    if (item.value.startsWith("INR ")) {
      const normalized = item.value.replace("INR ", "INR ");
      return (
        <div className="text-3xl font-semibold leading-none tracking-[-0.01em] text-[#202225] whitespace-nowrap lg:text-[2rem]">
          {normalized}
        </div>
      );
    }

    return (
      <div className="text-3xl font-semibold leading-none tracking-[-0.01em] text-[#202225] whitespace-nowrap lg:text-[2rem]">
        {item.value}
      </div>
    );
  };

  return (
    <article
      className={`rounded-lg border px-4 py-3 ${
        item.danger ? "border-[#f0b4b4] bg-[#fff7f7]" : "border-[#cad5e3] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {renderValue()}
          <div className="mt-1.5 text-sm font-semibold leading-[1.2] text-[#202225]">{item.title}</div>
        </div>
        <div className="mt-2 h-10 w-16 bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat" />
      </div>
      <p className={`mt-1.5 text-xs ${item.danger ? "text-[#ef4444]" : "text-[#8c95a3]"}`}>{item.note}</p>
    </article>
  );
}

function OperationsFunnel() {
  const bars = [
    { label: "New Lead", width: "92%" },
    { label: "Site Survey done", width: "72%" },
    { label: "DPR Approval", width: "64%" },
    { label: "Procurement", width: "58%" },
    { label: "Installation", width: "55%" },
    { label: "Net metering", width: "52%" },
    { label: "Project Handover", width: "42%" },
  ];

  return (
    <article className="rounded-lg border border-[#d6deea] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-4xl font-medium text-[#1c2435]">Milestones Progress Funnel</h3>
        <button className="rounded border border-[#d7dce8] px-2 py-1 text-xs text-[#8992a3]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fafc] p-4">
        <div className="space-y-2">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div
                className={`h-8 rounded-sm ${
                  idx % 2 === 0 ? "bg-[#57d4a8]" : "bg-[#8de3c6]"
                }`}
                style={{ width: bar.width }}
              />
              <span className="text-xs text-[#677489]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function OperationsTopPerformers() {
  return (
    <article className="rounded-lg border border-[#d6deea] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[28px] font-medium text-[#1c2435]">Top Performers</h3>
        <button className="rounded border border-[#d7dce8] px-2 py-1 text-xs text-[#8992a3]">Vendors</button>
      </div>
      <div className="space-y-2">
        {operationsTopPerformers.map((idx) => (
          <article key={idx} className="flex items-center justify-between rounded border border-[#cde8c3] bg-[#f9fdf8] px-2 py-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded border border-[#b6c7ff] bg-[#eaf0ff]" />
              <div>
                <div className="text-sm font-semibold text-[#1a2335]">Athul</div>
                <div className="text-xs text-[#4cb067]">05% SLA Compliance</div>
              </div>
            </div>
            <div className="rounded bg-[#f1f3f8] px-2 py-1 text-sm font-semibold text-[#545d71]">4/5</div>
          </article>
        ))}
      </div>
    </article>
  );
}

function OperationsDispatchStatus() {
  return (
    <article className="rounded-lg border border-[#d6deea] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-4xl font-medium text-[#1c2435]">Dispatch Status</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d7dce8] px-2 py-1 text-xs text-[#8992a3]">Search</button>
          <button className="rounded border border-[#d7dce8] px-2 py-1 text-xs text-[#8992a3]">Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#dce3e9] text-[#2f3a4f]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Vendor Name</th>
              <th className="px-2 py-2 font-semibold">On-Time Installations</th>
              <th className="px-2 py-2 font-semibold">Avg CSAT Score (/5)</th>
              <th className="px-2 py-2 font-semibold">Avg Resolution Time (hrs)</th>
              <th className="px-2 py-2 font-semibold">Active Projects</th>
              <th className="px-2 py-2 font-semibold">Composite Score</th>
            </tr>
          </thead>
          <tbody>
            {operationsDispatchRows.map((row, idx) => (
              <tr key={`${row.vendor}-${idx}`} className="border-b border-[#e6ebf3] text-[#28334a]">
                <td className="px-2 py-3"><input type="checkbox" defaultChecked={idx === 0} /></td>
                <td className="px-2 py-3">{row.vendor}</td>
                <td className="px-2 py-3">{row.onTime}</td>
                <td className="px-2 py-3">{row.csat}</td>
                <td className="px-2 py-3">{row.resolution}</td>
                <td className="px-2 py-3">{row.active}</td>
                <td className="px-2 py-3">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function OperationsDonuts() {
  const legend = ["Inspection and Maintenance", "Performance Monitoring", "Repair & Replacement", "Emergency Support"];
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-lg border border-[#d6deea] bg-white p-4">
        <h3 className="text-4xl font-medium text-[#1c2435]">installation Status Overview</h3>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="relative h-44 w-72 overflow-hidden">
            <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[conic-gradient(#2bc190_0_25%,#49d8ad_25%_50%,#8ae8cb_50%_75%,#b9efe0_75%_100%)]" />
            <div className="absolute left-1/2 top-[72px] h-36 w-36 -translate-x-1/2 rounded-full bg-white" />
            <div className="absolute left-1/2 top-[116px] -translate-x-1/2 text-center">
              <div className="text-4xl font-bold text-[#1f2737]">158<span className="ml-1 text-lg font-medium text-[#616b80]">Total</span></div>
            </div>
          </div>
          <div className="space-y-2 text-xs text-[#5f6a80]">
            {legend.map((item) => (
              <div key={item} className="flex items-center justify-between gap-3">
                <span>{item}</span>
                <span>48</span>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="rounded-lg border border-[#d6deea] bg-white p-4">
        <h3 className="text-4xl font-medium text-[#1c2435]">Material Dispatch &amp; Delivery</h3>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#2abf8f_0_18%,#48d6aa_18%_35%,#8be7ca_35%_58%,#b8efe0_58%_100%)]">
            <div className="absolute inset-6 rounded-full bg-white" />
          </div>
          <div className="space-y-2 text-xs text-[#5f6a80]">
            <div className="flex items-center justify-between gap-3"><span>Modules</span><span>48</span></div>
            <div className="flex items-center justify-between gap-3"><span>Inverters</span><span>48</span></div>
            <div className="flex items-center justify-between gap-3"><span>Structures</span><span>48</span></div>
            <div className="flex items-center justify-between gap-3"><span>Bos</span><span>48</span></div>
          </div>
        </div>
      </article>
    </div>
  );
}

function OperationsPipeline() {
  return (
    <article className="rounded-lg border border-[#d6deea] bg-[#e7eef3] p-4">
      <h3 className="text-4xl font-medium text-[#1c2435]">My Pipeline</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        {operationsPipelineColumns.map((column) => (
          <section key={column.label} className="space-y-2">
            <div className="flex items-center">
              <span className="rounded bg-[#151a44] px-2 py-1 text-xs font-bold text-white">{column.label}</span>
              <div className="flex-1 rounded-r border border-[#d8dde7] bg-white px-3 py-1.5 text-sm font-medium text-[#2b3548]">{column.title}</div>
            </div>
            {[1, 2].map((card) => (
              <article key={`${column.label}-${card}`} className="rounded border border-[#dde3ec] bg-white">
                <div className="border-b border-[#e8edf4] px-3 py-2">
                  <div className="text-sm font-semibold text-[#273146]">Bangalore - Rooftop 5kW</div>
                  <div className="text-[11px] text-[#9aa3b2]">Lead ID : #1023</div>
                  <div className="mt-1 text-xs text-[#4b556a]">Ramesh (Customer)</div>
                  <div className="text-xs text-[#4b556a]">Adithya (vendor)</div>
                  <div className="text-xs text-[#96a0b0]">1st cross, HSR Layout, Bangalore - 560098</div>
                </div>
                <div className="grid grid-cols-3 gap-2 px-3 py-2 text-[10px] text-[#6d778a]">
                  <div>
                    <div className="font-semibold text-[#384154]">Approved</div>
                    <div>Design Status</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#384154]">In Progress</div>
                    <div>BOM Status</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#384154]">Approved</div>
                    <div>DPR Status</div>
                  </div>
                </div>
                <div className="border-t border-[#e8edf4] px-3 py-2">
                  <button className="w-full rounded bg-[#131740] px-2 py-1 text-left text-xs text-white">Athul (Vendor)</button>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#7a8599]">
                    <span>1/2 Sub tasks</span>
                    <span className={`rounded px-2 py-0.5 ${card === 1 ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#ffe3e3] text-[#ef4444]"}`}>
                      {card === 1 ? column.tagOk : column.tagBad}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

function OperationsRightRail() {
  const alerts = [
    { tag: "Damaged Item", chip: "Dispatch", note: "Inverter 5kW damaged at the site. Need replacement." },
    { tag: "Missing Item", chip: "Procurement", note: "Inverter 5kW damaged at the site. Need replacement." },
    { tag: "Structure Delivered", chip: "", note: "Structure delivered on 12th jan" },
  ];

  return (
    <aside className="w-full rounded-lg border border-[#d7deea] bg-[#f7f9fc] p-4 xl:w-[320px]">
      <h3 className="text-lg font-semibold text-[#2d3650]">Quick Actions</h3>
      <div className="mt-3 space-y-2">
        <button className="w-full rounded border border-[#141944] bg-[#141944] px-3 py-2 text-sm font-semibold text-white">Update the Prices</button>
        <button className="w-full rounded border border-[#1f2850] bg-white px-3 py-2 text-sm font-semibold text-[#1f2850]">Add Users</button>
        <button className="w-full rounded border border-[#1f2850] bg-white px-3 py-2 text-sm font-semibold text-[#1f2850]">Check Tickets</button>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#2d3650]">Alerts &amp; Breaches (3)</h3>
      <div className="mt-2 space-y-3">
        {alerts.map((alert) => (
          <article key={alert.tag} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="text-[10px] font-medium text-[#d2872e]">{alert.tag}</div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-2xl font-semibold text-[#273045]">Lead #1025</div>
              {alert.chip ? <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">{alert.chip}</span> : null}
            </div>
            <div className="text-xs text-[#8b95a7]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">{alert.note}</div>
            {alert.chip ? <button className="mt-3 w-full rounded border border-[#252d51] py-1.5 text-xs font-semibold text-[#252d51]">Send Reminder</button> : null}
          </article>
        ))}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#2d3650]">Priority Tasks (2)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#f1f3f8] px-2 py-1 text-[10px] text-[#656f83]">Structure delivery is 3 days overdue.</div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-2xl font-semibold text-[#273045]">Lead #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">Site Survey</span>
            </div>
            <div className="text-xs text-[#8b95a7]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">Customer accepted quotation, 60% advance pending for 3 days.</div>
            <button className="mt-3 w-full rounded border border-[#252d51] py-1.5 text-xs font-semibold text-[#252d51]">Take Action</button>
          </article>
        ))}
      </div>
    </aside>
  );
}

function NetMeteringMetricCard({ item }: { item: NetMeteringMetric }) {
  return (
    <article className="rounded-md border border-[#e5e9f1] bg-white px-5 py-4">
      <div className="text-[35px] font-semibold leading-none text-[#131a2b]">{item.value}</div>
      <div className="mt-2 text-[13px] font-medium leading-[1.3] text-[#1c2538]">{item.title}</div>
      <div className={`mt-2 text-[10px] font-semibold ${item.down ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{item.note}</div>
    </article>
  );
}

function NetMeteringRegionSection() {
  const bars = [
    { label: "Pending Docs", width: "100%" },
    { label: "Docs Sent", width: "92%" },
    { label: "Meter Installed", width: "78%" },
    { label: "Load Extension Cases", width: "54%" },
  ];

  return (
    <article className="rounded-md border border-[#e3e8f0] bg-white p-4">
      <h3 className="text-[34px] font-medium text-[#1b2436]">Region Wise Data</h3>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <button className="rounded border border-[#d9dee8] px-3 py-1.5 text-[#7f899b]">Bangalore</button>
        <button className="rounded border border-[#d9dee8] px-3 py-1.5 text-[#7f899b]">Karnataka</button>
        <button className="rounded border border-[#d9dee8] px-3 py-1.5 text-[#7f899b]">Last 7 Days</button>
      </div>
      <div className="mt-4 rounded bg-[#f7fbfa] p-3">
        <div className="space-y-2">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div
                className={`h-8 rounded-sm ${idx % 2 === 0 ? "bg-[#8ee4c8]" : "bg-[#acecd6]"}`}
                style={{ width: bar.width }}
              />
              <span className="text-xs text-[#6f7a8e]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function NetMeteringApplicationsTable() {
  return (
    <article className="rounded-md border border-[#e3e8f0] bg-white p-4">
      <h3 className="text-[34px] font-medium text-[#1b2436]">Region-wise Applications</h3>
      <div className="mt-3 flex items-center gap-2">
        <button className="rounded border border-[#d9dee8] px-3 py-1.5 text-xs text-[#7f899b]">Search</button>
        <button className="rounded border border-[#d9dee8] px-3 py-1.5 text-xs text-[#7f899b]">Filter</button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#e2e7ee] text-[#32405b]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Region</th>
              <th className="px-2 py-2 font-semibold">State</th>
              <th className="px-2 py-2 font-semibold">Docs Sent</th>
              <th className="px-2 py-2 font-semibold">Docs Pending</th>
              <th className="px-2 py-2 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {netMeteringApplications.map((row, idx) => (
              <tr key={`${row.region}-${idx}`} className="border-b border-[#edf1f6] text-[#2b364d]">
                <td className="px-2 py-2.5"><input type="checkbox" /></td>
                <td className="px-2 py-2.5 text-[#2291d0]">{row.region}</td>
                <td className="px-2 py-2.5">{row.state}</td>
                <td className="px-2 py-2.5">{row.docsSent}</td>
                <td className="px-2 py-2.5">{row.pending}</td>
                <td className="px-2 py-2.5">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function NetMeteringLoadCasesTable() {
  return (
    <article className="min-w-0 rounded-md border border-[#e3e8f0] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[36px] font-medium text-[#1b2436]">Load Extension Cases</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d9dee8] px-2 py-1 text-xs text-[#7f899b]">Search</button>
          <button className="rounded border border-[#d9dee8] px-2 py-1 text-xs text-[#7f899b]">Filter</button>
          <button className="rounded border border-[#d9dee8] px-2 py-1 text-xs text-[#7f899b]">Customise</button>
        </div>
      </div>
      <div className="mt-1 max-w-full overflow-x-auto overflow-y-hidden">
        <table className="min-w-[1600px] text-left text-xs">
          <thead>
            <tr className="bg-[#dce4e2] text-[#2f3c57]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Project ID</th>
              <th className="px-2 py-2 font-semibold">Customer</th>
              <th className="px-2 py-2 font-semibold">Customer Contact number</th>
              <th className="px-2 py-2 font-semibold">Vendor</th>
              <th className="px-2 py-2 font-semibold">Vendor Contact number</th>
              <th className="px-2 py-2 font-semibold">Payment Type</th>
              <th className="px-2 py-2 font-semibold">Payment completion (%)</th>
              <th className="px-2 py-2 font-semibold">State</th>
              <th className="px-2 py-2 font-semibold">Region</th>
              <th className="px-2 py-2 font-semibold">Status</th>
              <th className="px-2 py-2 font-semibold">SLA Remaining</th>
              <th className="px-2 py-2 font-semibold">Evidence</th>
              <th className="px-2 py-2 font-semibold">Remarks</th>
              <th className="px-2 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {netMeteringLoadRows.map((row, idx) => (
              <tr key={`${row.projectId}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-3"><input type="checkbox" /></td>
                <td className="px-2 py-3">{row.projectId}</td>
                <td className="px-2 py-3">{row.customer}</td>
                <td className="px-2 py-3">{row.customerPhone}</td>
                <td className="px-2 py-3">{row.vendor}</td>
                <td className="px-2 py-3">{row.vendorPhone}</td>
                <td className="px-2 py-3">{row.paymentType}</td>
                <td className="px-2 py-3">{row.paymentCompletion}</td>
                <td className="px-2 py-3">{row.state}</td>
                <td className="px-2 py-3">{row.region}</td>
                <td className="px-2 py-3">
                  <button className="inline-flex items-center gap-1 rounded border border-[#d6dce7] bg-[#f9fbff] px-2 py-1 text-[10px]">
                    {row.status}
                    <span className="text-[9px]">v</span>
                  </button>
                </td>
                <td className="px-2 py-3">{row.slaRemaining}</td>
                <td className="px-2 py-3">
                  <span className="inline-flex items-center gap-1">
                    {row.evidence}
                    <button className="text-[#2f6cb4]" aria-label="Download evidence">v</button>
                  </span>
                </td>
                <td className="px-2 py-3">{row.remarks}</td>
                <td className="px-2 py-3 text-[14px]">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function NetMeteringRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#e0e5ef] bg-[#f8fafd] p-4 xl:w-[320px]">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3 space-y-2">
        <button className="w-full rounded border border-[#191d47] bg-[#191d47] px-3 py-2 text-sm font-semibold text-white">
          Create New Application
        </button>
        <button className="w-full rounded border border-[#232d57] bg-white px-3 py-2 text-sm font-semibold text-[#232d57]">
          Quick Links
        </button>
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Alerts &amp; Breaches (3)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">
              Ticket has crossed its SLA response/resolution time
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
              <span className="rounded-full border border-[#f0ca97] bg-[#fff5e8] px-2 py-0.5 text-[10px] text-[#d4892d]">Delay From Discom</span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Send Reminder</button>
          </article>
        ))}
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Load extension cases</h3>
      <div className="mt-2 space-y-2">
        {[1, 2].map((i) => (
          <article key={`l-${i}`} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
          </article>
        ))}
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Newly Added Projects</h3>
      <div className="mt-2 space-y-2">
        {[1, 2].map((i) => (
          <article key={`n-${i}`} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function NetMeteringDashboardBody() {
  return (
    <div className="min-w-0 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4">
        <div className="flex items-center justify-end gap-2">
          <button className="rounded border border-[#d9dee8] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
          <button className="rounded border border-[#d9dee8] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {netMeteringMetricsTop.map((item) => (
            <NetMeteringMetricCard key={item.title} item={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {netMeteringMetricsBottom.map((item) => (
            <NetMeteringMetricCard key={item.title} item={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <NetMeteringRegionSection />
          <NetMeteringApplicationsTable />
        </div>

        <NetMeteringLoadCasesTable />
      </section>

      <NetMeteringRightRail />
    </div>
  );
}

export function OperationsDashboardBody() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {operationsKpis.map((kpi) => (
            <OperationsKpiCard key={kpi.title} item={kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
          <OperationsFunnel />
          <OperationsTopPerformers />
        </div>

        <OperationsDispatchStatus />
        <OperationsDonuts />
        <OperationsPipeline />
      </section>

      <OperationsRightRail />
    </div>
  );
}

function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={`${item.label}-${item.value}`} className="rounded border border-[#d7dce5] bg-white px-4 py-3">
          <div className="text-3xl font-semibold leading-none text-[#161b22]">{item.value}</div>
          <div className="mt-1 text-sm font-semibold text-[#1f2737]">{item.label}</div>
          <div className="mt-1 text-[11px] text-[#7a8496]">{item.note}</div>
        </article>
      ))}
    </div>
  );
}

function FunnelCard({ title, bars }: { title: string; bars: { label: string; width: string }[] }) {
  return (
    <article className="rounded border border-[#d7dce5] bg-white p-4">
      <h3 className="text-2xl font-medium text-[#131a26]">{title}</h3>
      <div className="mt-4 space-y-2">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <div className="h-9 rounded-sm bg-gradient-to-r from-[#42d6a5] to-[#bcefdc]" style={{ width: bar.width }} />
            <span className="text-xs text-[#647086]">{bar.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function DonutCard({ title }: { title: string }) {
  return (
    <article className="rounded border border-[#d7dce5] bg-white p-4">
      <h3 className="text-2xl font-medium text-[#131a26]">{title}</h3>
      <div className="mt-5 flex items-center justify-center gap-8">
        <div className="relative h-44 w-44 rounded-full bg-[conic-gradient(#2cc59a_0_30%,#f5aa11_30%_55%,#24b080_55%_75%,#f04444_75%_100%)] p-6">
          <div className="h-full w-full rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <div className="text-4xl font-bold text-[#202735]">158</div>
              <div className="text-sm text-[#718097]">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-[#516078]">
          <div>DPR Approved</div>
          <div>Total Revision Requests</div>
          <div>DPR Approval Pending</div>
          <div>DPR SLA Breach</div>
        </div>
      </div>
    </article>
  );
}

function GenericTable({ title }: { title: string }) {
  const rows = Array.from({ length: 6 }, (_, idx) => ({
    lead: `#10${23 + idx}`,
    customer: "Murugan",
    vendor: "Athul",
    updated: "12-02-2024",
    status: ["Initial Design Pending", "DPR Pending", "DPR Sent", "DPR Approved", "Revision Requested"][idx % 5],
  }));

  return (
    <article className="rounded border border-[#d7dce5] bg-white p-4">
      <h3 className="text-2xl font-medium text-[#131a26]">{title}</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-[#eaf1ef] text-[#2c3950]">
              <th className="px-3 py-2 font-semibold">Lead ID</th>
              <th className="px-3 py-2 font-semibold">Customer</th>
              <th className="px-3 py-2 font-semibold">Vendor</th>
              <th className="px-3 py-2 font-semibold">Last Updated</th>
              <th className="px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.lead}-${row.status}`} className="border-b border-[#e8ebf1] text-[#202836]">
                <td className="px-3 py-3">{row.lead}</td>
                <td className="px-3 py-3">{row.customer}</td>
                <td className="px-3 py-3">{row.vendor}</td>
                <td className="px-3 py-3">{row.updated}</td>
                <td className="px-3 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function LoanMetricCard({ item }: { item: StatItem }) {
  return (
    <article className="rounded-md border border-[#d9dfea] bg-white px-4 py-3">
      <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value.replace("INR ", "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹")}</div>
      <div className="mt-2 text-[14px] font-medium leading-[1.25] text-[#1f2738]">{item.label}</div>
      <div className={`mt-2 text-[10px] font-semibold ${item.note.includes("-") ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{item.note}</div>
    </article>
  );
}

function LoanFunnel() {
  const bars = [
    { label: "New Requests", width: "100%" },
    { label: "Submissions to Bank", width: "70%" },
    { label: "Approved by Bank", width: "50%" },
    { label: "No of Disbursed", width: "46%" },
    { label: "Rejected Loans", width: "36%" },
  ];

  return (
    <article className="h-full rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Loan Funnel</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`h-8 rounded-sm ${idx % 2 === 0 ? "bg-[#67dbb5]" : "bg-[#a8ecd6]"}`} style={{ width: bar.width }} />
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function LoanRejectionTable() {
  return (
    <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Loan Rejection Details</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#e3e8f0] text-[#36445f]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Project ID</th>
              <th className="px-2 py-2 font-semibold">Vendor</th>
              <th className="px-2 py-2 font-semibold">Amount Due</th>
              <th className="px-2 py-2 font-semibold">Reason</th>
              <th className="px-2 py-2 font-semibold">Assigned to</th>
              <th className="px-2 py-2 font-semibold">|</th>
            </tr>
          </thead>
          <tbody>
            {loanRejectionRows.map((row, idx) => (
              <tr key={`${row.id}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-2.5"><input type="checkbox" defaultChecked={idx === 0} /></td>
                <td className="px-2 py-2.5 font-semibold text-[#222b3e]">{row.id}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.vendor}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.amount}</td>
                <td className="px-2 py-2.5 text-[#ef4444]">{row.reason}</td>
                <td className="px-2 py-2.5">
                  <button className="inline-flex min-w-[90px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-[10px] text-[#70809a]">
                    {row.assigned}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function LoanPipelineBoard() {
  const columns = [
    { label: "01", name: "New Loan Verification", status: "DPR Sent" },
    { label: "02", name: "Submission to Banks/NBFC", status: "Procurement Started" },
    { label: "03", name: "Post Submission status", status: "Approved" },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-[#edf2f6] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">My Pipeline</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Customise</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Disbursed Only</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {columns.map((column) => (
          <section key={column.label} className="space-y-2">
            <div className="flex items-center">
              <span className="rounded bg-[#161b45] px-2 py-1 text-xs font-bold text-white">{column.label}</span>
              <div className="flex flex-1 items-center justify-between rounded-r border border-[#d8dfea] bg-white px-3 py-1.5 text-sm font-medium text-[#273146]">
                <span>{column.name}</span>
                {column.label === "03" ? <span className="text-lg leading-none text-[#6f7890]">+</span> : null}
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <article key={`${column.label}-${i}`} className="rounded-md border border-[#d3dae6] bg-white">
                <div className="border-b border-[#e3e9f3] px-3 py-3">
                  <div className="flex items-start justify-between">
                    <div className="text-[14px] font-semibold leading-none text-[#273146]">Bangalore - Rooftop 5kW</div>
                    <button className="text-[#4f586b]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®</button>
                  </div>
                  <div className="mt-1 text-[10px] text-[#9ca5b7]">Lead ID : #1023</div>
                  <div className="mt-1 text-xs text-[#353f54]">Ramesh (Customer )</div>
                  <div className="text-xs text-[#353f54]">Adithya (vendor)</div>
                  <div className="text-[11px] text-[#8f98aa]">1st cross, HSR Layout, Bangalore - 560098</div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-[#e3e9f3] bg-[#f7f9fd] px-3 py-2 text-[10px] text-[#6d778a]">
                  <div>
                    <div className="font-semibold text-[#384154]">NBFC</div>
                    <div>Bank name</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#384154]">12-01-2025</div>
                    <div>Submitted On</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#384154]">INR 4,50,000</div>
                    <div>Loan Requested</div>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <button className="w-full rounded bg-[#171c49] px-2 py-1.5 text-left text-xs text-white">Athul (Vendor)</button>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#66718a]">
                    <span>1/2 Sub tasks</span>
                    <span className="rounded bg-[#d8f7df] px-2 py-0.5 text-[#0f9f4a]">{column.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

function LoanRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Pending Documents</h3>
        <button className="text-[10px] text-[#8f99aa]">See more</button>
      </div>
      <div className="space-y-3">
        {loanPendingCards.map((card, idx) => (
          <article key={idx} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">Pending Documents</div>
            <div className="mt-2 text-[21px] font-semibold text-[#28324a]">Project #1025</div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 space-y-1">
              {card.docs.map((doc) => (
                <div key={doc} className="text-xs text-[#ef4444]">{doc}</div>
              ))}
            </div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Upload Now</button>
          </article>
        ))}
      </div>

      <div className="mt-5 mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Bank Performance</h3>
        <button className="text-[10px] text-[#8f99aa]">See all Partners</button>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#273146]">Bank name</div>
                <div className="text-[10px] text-[#84b37f]">{i === 2 ? "40%" : "70%"} Success Rate</div>
              </div>
              <button className="text-[10px] text-[#2c69ad] underline">Visit Bank Portal</button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function LoanDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4 pt-4">
        <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
        <div className="flex items-center justify-end gap-2">
          <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
          <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {STATS_BY_ROLE["loan-team"].map((item) => (
            <LoanMetricCard key={item.label} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.34fr_0.66fr] xl:items-stretch">
          <LoanFunnel />
          <LoanRejectionTable />
        </div>
        <LoanPipelineBoard />
      </section>
      <LoanRightRail />
    </div>
  );
}

function SalesKpiCard({ item }: { item: SalesKpi }) {
  return (
    <article className={`rounded-md border px-3 py-3 ${item.danger ? "border-[#f0b8b8] bg-[#fff8f8]" : "border-[#d8deea] bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value}</div>
          <div className="mt-2 text-[14px] font-medium leading-[1.25] text-[#1f2738]">{item.title}</div>
          <div className={`mt-2 text-[10px] font-semibold ${item.danger ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{item.note}</div>
        </div>
        <div
          className={`mt-2 h-10 w-16 ${item.danger ? "rounded-r-full border-b-2 border-r-2 border-[#f1a5a5]" : "bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat"}`}
        />
      </div>
    </article>
  );
}

function SalesRevenueFunnel() {
  const bars = [
    { label: "New Leads added", width: "100%" },
    { label: "Deals Won", width: "72%" },
    { label: "60% payment", width: "52%" },
    { label: "Final Payment", width: "46%" },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Revenue Funnel</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
        </div>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`h-8 rounded-sm ${idx % 2 === 0 ? "bg-[#8ee4c8]" : "bg-[#acecd6]"}`} style={{ width: bar.width }} />
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SalesPendingPayments() {
  return (
    <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Pending Payments</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Region</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#e3e8f0] text-[#36445f]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Project ID</th>
              <th className="px-2 py-2 font-semibold">Vendor</th>
              <th className="px-2 py-2 font-semibold">Amount Due</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 font-semibold">Assigned...</th>
              <th className="px-2 py-2 font-semibold">|</th>
            </tr>
          </thead>
          <tbody>
            {salesPaymentRows.map((row, idx) => (
              <tr key={`${row.projectId}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-2.5"><input type="checkbox" defaultChecked={idx === 0} /></td>
                <td className="px-2 py-2.5 font-semibold text-[#222b3e]">{row.projectId}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{idx % 2 === 0 ? row.vendor : "Rajesh Iyer"}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{idx % 2 === 0 ? row.amount : "INR 3,12,000"}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{idx % 2 === 0 ? "Loan" : "Direct Payment"}</td>
                <td className="px-2 py-2.5">
                  <button className="inline-flex min-w-[90px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-[10px] text-[#70809a]">
                    {idx % 2 === 0 ? "John" : "Rakesh"}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function SalesPipelineBoard() {
  const columns = [
    { label: "03", name: "New Lead", status: "Site Survey Sheduled", rep: "Assign a Sales Rep" },
    { label: "02", name: "Site Survey", status: "Finalize Quotation", rep: "Assign a Sales Rep" },
    { label: "03", name: "Payment", status: "60% Amount Paid", rep: "Assign a Sales Rep" },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-[#edf2f6] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">My Pipeline</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Customise</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {columns.map((column, colIdx) => (
          <section key={column.label + column.name} className="space-y-2">
            <div className="flex items-center">
              <span className="rounded bg-[#161b45] px-2 py-1 text-xs font-bold text-white">{column.label}</span>
              <div className="flex flex-1 items-center justify-between rounded-r border border-[#d8dfea] bg-white px-3 py-1.5 text-sm font-medium text-[#273146]">
                <span>{column.name}</span>
                <span className="text-lg leading-none text-[#6f7890]">+</span>
              </div>
            </div>

            {[1, 2, 3, 4].map((i) => (
              <article key={`${column.name}-${i}`} className="rounded-md border border-[#d3dae6] bg-white">
                <div className="border-b border-[#e3e9f3] px-3 py-3">
                  <div className="flex items-start justify-between">
                    <div className="text-[14px] font-semibold leading-none text-[#273146]">Bangalore - Rooftop 5kW</div>
                    <button className="text-[#4f586b]">...</button>
                  </div>
                  <div className="mt-1 text-[10px] text-[#9ca5b7]">Lead ID : #1023</div>
                  <div className="mt-1 text-xs text-[#353f54]">Ramesh (Customer )</div>
                  <div className="text-xs text-[#353f54]">Adithya (vendor)</div>
                  <div className="text-[11px] text-[#8f98aa]">1st cross, HSR Layout, Bangalore - 560098</div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-[#e3e9f3] bg-[#f7f9fd] px-3 py-2 text-[10px] text-[#6d778a]">
                  <div>
                    <div className={`font-semibold ${colIdx === 2 ? "text-[#1f2737]" : "text-[#1f2737]"}`}>INR 4,50,000</div>
                    <div>{colIdx === 0 ? "Source" : colIdx === 1 ? "Initial Quotation" : "Project Value"}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1f2737]">{colIdx === 0 ? "Ramesh VP" : "INR 4,50,000"}</div>
                    <div>{colIdx === 0 ? "Vendor Assigned" : colIdx === 1 ? "Final Quotation" : "Amount Paid"}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${colIdx === 2 ? "text-[#ef4444]" : "text-[#1f2737]"}`}>{colIdx === 0 ? "9th Jan 2025" : "INR 4,50,000"}</div>
                    <div>{colIdx === 0 ? "Survey Scheduled" : colIdx === 1 ? "Project Value" : "Due Amount"}</div>
                  </div>
                </div>

                {colIdx === 2 ? (
                  <div className="mx-3 mt-2 rounded bg-[#ffe6e6] px-2 py-1 text-[10px] text-[#ef4444]">Delayed Payment</div>
                ) : null}

                <div className="px-3 py-2">
                  <div className="mt-1 flex items-center justify-between text-xs text-[#66718a]">
                    <span>Sub tasks: {colIdx === 1 ? "2/5" : "1/2"} Done</span>
                    <span className="rounded bg-[#d8f7df] px-2 py-0.5 text-[#0f9f4a]">{column.status}</span>
                  </div>
                  <button className="mt-2 w-full rounded bg-[#171c49] px-2 py-1.5 text-left text-xs text-white">
                    {i % 2 === 0 ? "Athul (Sales Rep)" : column.rep}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

function SalesRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3 space-y-2">
        <button className="w-full rounded border border-[#191d47] bg-[#191d47] px-3 py-2 text-sm font-semibold text-white">Add New Lead</button>
        <button className="w-full rounded border border-[#232d57] bg-white px-3 py-2 text-sm font-semibold text-[#232d57]">Search Customers</button>
        <button className="w-full rounded border border-[#232d57] bg-white px-3 py-2 text-sm font-semibold text-[#232d57]">Search Vendors</button>
      </div>

      <div className="mt-5 mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Alerts &amp; Breaches (3)</h3>
        <button className="text-[10px] text-[#8f99aa]">See more</button>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">
              {i === 3 ? "Final Payment overdue 18 days" : "Survey delayed by 2 days (SLA=3 days)"}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">
                {i === 1 ? "New Lead" : i === 2 ? "Site Survey" : "Loan Applied"}
              </span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Assign Representative</button>
          </article>
        ))}
      </div>

      <div className="mt-5 mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Priority Tasks (3)</h3>
        <button className="text-[10px] text-[#8f99aa]">See more</button>
      </div>
      <article className="rounded border border-[#ececf2] bg-white p-2.5">
        <div className="rounded bg-[#eef1f7] px-2 py-1 text-[10px] text-[#4f5a71]">Payment Follow-up</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[14px] font-semibold text-[#28324a]">Lead #1085</div>
          <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">Site Survey</span>
        </div>
        <div className="text-xs text-[#8d97a8]">Chennai, 12kW Industrial</div>
        <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">Customer accepted quotation, 60% advance pending for 3 days.</div>
        <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Assign Representative</button>
      </article>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Top Performer</h3>
      <div className="mt-2 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <article key={`tp-${i}`} className="rounded border border-[#d8e8de] bg-[#f4fbf6] px-3 py-2">
            <div className="text-sm font-semibold text-[#273146]">Athul</div>
            <div className="text-[10px] font-semibold text-[#159947]">+12.6% from last month</div>
          </article>
        ))}
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-[#2a3550]">Least Performer</h3>
      <div className="mt-2 space-y-2">
        {[1, 2, 3].map((i) => (
          <article key={`lp-${i}`} className="rounded border border-[#f0dcdc] bg-[#fff7f7] px-3 py-2">
            <div className="text-sm font-semibold text-[#273146]">Athul</div>
            <div className="text-[10px] font-semibold text-[#ef4444]">-2.6% from last month</div>
          </article>
        ))}
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-[#2a3550]">Lead Sources</h3>
      <div className="mt-2 space-y-2">
        {["Vendor App", "Customer App", "Customer App", "Ads", "Referrals"].map((name, idx) => (
          <article key={`${name}-${idx}`} className="rounded border border-[#d8e8de] bg-[#f4fbf6] px-3 py-2">
            <div className="text-sm font-semibold text-[#273146]">{name}</div>
            <div className="text-[10px] font-semibold text-[#159947]">320 Leads</div>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function SalesDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="flex items-start justify-between pt-4">
          <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {salesKpis.slice(0, 4).map((item) => (
            <SalesKpiCard key={item.title} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {salesKpis.slice(4).map((item) => (
            <SalesKpiCard key={item.title} item={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.4fr_0.6fr] xl:items-stretch">
          <SalesRevenueFunnel />
          <SalesPendingPayments />
        </div>

        <SalesPipelineBoard />
      </section>
      <SalesRightRail />
    </div>
  );
}

function AmcStatCard({ item }: { item: { value: string; title: string; note: string } }) {
  return (
    <article className="rounded-md border border-[#d8deea] bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value}</div>
          <div className="mt-2 text-[14px] font-medium leading-[1.2] text-[#1f2738]">{item.title}</div>
          <div className="mt-2 text-[10px] font-semibold text-[#16a34a]">{item.note}</div>
        </div>
        <div className="mt-2 h-10 w-16 bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat" />
      </div>
    </article>
  );
}

function AmcTicketResolution() {
  const bars = [
    { value: "23", label: "Open", width: "100%" },
    { value: "22", label: "Assigned", width: "84%" },
    { value: "20", label: "Completed", width: "70%" },
    { value: "18", label: "Canceled Requests", width: "56%" },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Ticket Resolution</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2.5">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div
                className={`flex h-8 items-center rounded-sm px-3 ${idx % 2 === 0 ? "bg-[#8edfc6]" : "bg-[#afead7]"}`}
                style={{ width: bar.width }}
              >
                <span className="text-[13px] font-semibold leading-none text-[#152034]">{bar.value}</span>
              </div>
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function AmcCommonIssues() {
  const legend = ["Inspection & Maintenance", "Performance Monitoring", "Repair & Replacement", "Emergency Support"];
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 grid grid-cols-2 rounded-md bg-[#f2f4f8] p-1">
        <button className="rounded bg-[#191d47] py-1.5 text-sm font-medium text-white">Common Issues</button>
        <button className="rounded py-1.5 text-sm font-medium text-[#1f2737]">Subscriber chart</button>
      </div>
      <div className="mb-2 flex justify-end">
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="relative h-32 w-56 overflow-hidden">
          <div className="absolute left-1/2 top-5 h-44 w-44 -translate-x-1/2 rounded-full bg-[conic-gradient(#1fd292_0_25%,#69dfb3_25%_50%,#8fe5c8_50%_75%,#bdeedf_75%_100%)]" />
          <div className="absolute left-1/2 top-[40px] h-28 w-28 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute left-1/2 top-[98px] h-24 w-64 -translate-x-1/2 bg-white" />
          <div className="absolute left-1/2 top-[96px] -translate-x-1/2 text-center">
            <span className="text-[35px] font-semibold text-[#1f2737]">158</span>
            <span className="ml-1 text-sm text-[#616b80]">Total</span>
          </div>
        </div>
        <div className="space-y-2">
          {legend.map((item) => (
            <div key={item} className="flex min-w-[140px] items-center justify-between gap-2 text-[11px] text-[#6f7c92]">
              <span>{item}</span>
              <span>48</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function AmcRecentRequests() {
  const lifecycleClasses: Record<string, string> = {
    pending: "bg-[#f7e1c7] text-[#8b621f]",
    cancelled: "bg-[#f9d3d3] text-[#c73030]",
    open: "bg-[#f8dfbf] text-[#8a631e]",
    closed: "bg-[#d9f2d9] text-[#2f7a3e]",
  };

  const projectClasses: Record<string, string> = {
    closed: "bg-[#d9f2d9] text-[#2f7a3e]",
    open: "bg-[#f8dfbf] text-[#8a631e]",
    completed: "bg-[#d9f2d9] text-[#2f7a3e]",
  };

  return (
    <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Recent Requests</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Monthly</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Export</button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto overflow-y-hidden">
        <table className="min-w-[1700px] text-left text-xs">
          <thead>
            <tr className="bg-[#dce4e2] text-[#2f3c57]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Project ID</th>
              <th className="px-2 py-2 font-semibold">|</th>
              <th className="px-2 py-2 font-semibold">Customer</th>
              <th className="px-2 py-2 font-semibold">Address</th>
              <th className="px-2 py-2 font-semibold">Customer Contact</th>
              <th className="px-2 py-2 font-semibold">Customer Email</th>
              <th className="px-2 py-2 font-semibold">Service Requested</th>
              <th className="px-2 py-2 font-semibold">Preferred Visits Date</th>
              <th className="px-2 py-2 font-semibold">AMC Plan</th>
              <th className="px-2 py-2 font-semibold">Request ID</th>
              <th className="px-2 py-2 font-semibold">Technician Assigned</th>
              <th className="px-2 py-2 font-semibold">Visit Scheduled on</th>
              <th className="px-2 py-2 font-semibold">Project Status</th>
              <th className="px-2 py-2 font-semibold">Project Status</th>
              <th className="px-2 py-2 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {amcRecentRows.map((row, idx) => (
              <tr key={`${row.projectId}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-3"><input type="checkbox" /></td>
                <td className="px-2 py-3">{row.projectId}</td>
                <td className="px-2 py-3 text-[#99a3b6]"> </td>
                <td className="px-2 py-3">{row.customer}</td>
                <td className="px-2 py-3 max-w-[210px] text-[11px] text-[#525f77]">{row.address}</td>
                <td className="px-2 py-3">{row.contact}</td>
                <td className="px-2 py-3">{row.email}</td>
                <td className="px-2 py-3">{row.service}</td>
                <td className="px-2 py-3">{row.preferredDate}</td>
                <td className="px-2 py-3">{row.amcPlan}</td>
                <td className="px-2 py-3">{row.requestId}</td>
                <td className="px-2 py-3">
                  <button className="inline-flex min-w-[110px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-[10px] text-[#70809a]">
                    {row.technician}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-3">{row.visitScheduled}</td>
                <td className="px-2 py-3">
                  <button className={`inline-flex min-w-[85px] items-center justify-between rounded px-2 py-1 text-[10px] font-medium ${lifecycleClasses[row.lifecycleTone]}`}>
                    {row.lifecycleStatus}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-3">
                  <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${projectClasses[row.projectTone]}`}>
                    {row.projectStatus}
                  </span>
                </td>
                <td className="px-2 py-3 text-[14px]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#5e687d]">
        <div className="flex items-center gap-3">
        <span>Page 1 of 10</span>
        <button className="rounded border border-[#ccd4e1] px-2 py-1">Show 10 rows</button>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded border border-[#d5dce8] px-2 py-1">Previous</button>
          <button className="rounded bg-[#171c49] px-2 py-1 text-white">1</button>
          {[2, 3, 4, 5, 6, 7].map((n) => (
            <button key={n} className="rounded border border-[#d5dce8] px-2 py-1">{n}</button>
          ))}
          <button className="rounded border border-[#d5dce8] px-2 py-1">Next</button>
        </div>
      </div>
    </article>
  );
}

function AmcRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3">
        <button className="w-full rounded border border-[#191d47] bg-[#191d47] px-3 py-2 text-sm font-semibold text-white">Create New Ticket</button>
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">SLA Breach Alerts</h3>
      <div className="mt-2 space-y-3">
        {[1, 2, 3].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">Issue</div>
            <div className="mt-2 text-[14px] font-semibold text-[#28324a]">TKT-0998</div>
            <div className="mt-1 border-t border-[#eceff5] pt-2 text-xs text-[#7e889a]">
              {i === 1
                ? "Inverter not generating power post-rainfall."
                : i === 2
                ? "Remote Monitoring System showing zero data for last 24 hrs"
                : "Customer waiting for site visit confirmation. Reschedule immediately."}
            </div>
            <div className="mt-2 text-xs text-[#6e788c]">Assigned Technician: Arjun S</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">{i === 3 ? "Remind Vendor" : "Send Reminder"}</button>
          </article>
        ))}
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">AMC Visits</h3>
      <article className="mt-2 rounded border border-[#ececf2] bg-white p-2.5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <button className="rounded border border-[#d8deea] px-2 py-0.5">&lt;</button>
          <span className="font-semibold text-[#30394f]">Nov 2025</span>
          <button className="rounded border border-[#d8deea] px-2 py-0.5">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#8d96a7]">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <div key={d} className={`py-1 ${d === 17 ? "rounded-full bg-black text-white" : ""}`}>{d}</div>
          ))}
        </div>
      </article>
      <article className="mt-2 rounded border border-[#ececf2] bg-white p-2.5">
        <p className="text-xs text-[#6f7c92]">1st October, scheduled maintenance visit with Rajesh Kumar at 10:00 AM in Bangalore</p>
        <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Send Reminder</button>
      </article>
    </aside>
  );
}

export function AmcDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="min-w-0 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4 pt-4">
        <div className="flex items-start justify-between">
          <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {amcStats.map((item) => (
            <AmcStatCard key={item.title} item={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.52fr_0.48fr]">
          <AmcTicketResolution />
          <AmcCommonIssues />
        </div>

        <AmcRecentRequests />
      </section>
      <AmcRightRail />
    </div>
  );
}

function FinanceKpiCard({ item }: { item: FinanceKpi }) {
  return (
    <article className={`rounded-md border px-3 py-3 ${item.danger ? "border-[#f0b8b8] bg-[#fff8f8]" : "border-[#d8deea] bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value}</div>
          <div className="mt-2 text-[14px] font-medium leading-[1.25] text-[#1f2738]">{item.title}</div>
          <div className={`mt-2 text-[10px] font-semibold ${item.danger ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{item.note}</div>
        </div>
        <div
          className={`mt-2 h-10 w-16 ${item.danger ? "rounded-r-full border-b-2 border-r-2 border-[#f1a5a5]" : "bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat"}`}
        />
      </div>
    </article>
  );
}

function FinanceRevenueFunnel() {
  const bars = [
    { value: "23", label: "60% Payment Completed", width: "100%" },
    { value: "22", label: "Part Payments in Progress, <60%)", width: "74%" },
    { value: "20", label: "Fully Payment Completed", width: "60%" },
    { value: "18", label: "Overdue Payments", width: "42%" },
  ];
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Revenue Funnel</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2.5">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`flex h-8 items-center rounded-sm px-3 ${idx % 2 === 0 ? "bg-[#8edfc6]" : "bg-[#afead7]"}`} style={{ width: bar.width }}>
                <span className="text-[13px] font-semibold leading-none text-[#152034]">{bar.value}</span>
              </div>
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function FinanceOverdueTable() {
  return (
    <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Overdue Payments</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#e3e8f0] text-[#36445f]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Project ID</th>
              <th className="px-2 py-2 font-semibold">Vendor</th>
              <th className="px-2 py-2 font-semibold">Customer</th>
              <th className="px-2 py-2 font-semibold">Amount Due</th>
              <th className="px-2 py-2 font-semibold">Type</th>
              <th className="px-2 py-2 font-semibold">|</th>
              <th className="px-2 py-2 font-semibold">Assigned...</th>
              <th className="px-2 py-2 font-semibold">|</th>
              <th className="px-2 py-2 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {financeOverdueRows.map((row, idx) => (
              <tr key={`${row.id}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-2.5"><input type="checkbox" defaultChecked={idx === 0} /></td>
                <td className="px-2 py-2.5 font-semibold text-[#222b3e]">{row.id}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.vendor}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.customer}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.amount}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.type}</td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">|</td>
                <td className="px-2 py-2.5">
                  <button className="inline-flex min-w-[90px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-[10px] text-[#70809a]">
                    {row.assigned}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">|</td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function FinancePipelineBoard() {
  const columns = [
    { label: "03", name: "Payment", tagA: "Full Payment Paid", tagB: "Full Payment Paid", showAction: true },
    { label: "04", name: "Procurement", tagA: "Procurement Started", tagB: "Material Procured", showAction: false },
    { label: "05", name: "Handover", tagA: "RMS Installed", tagB: "Warranty Cards Issued", showAction: false },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-[#edf2f6] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">My Pipeline</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Customise</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {columns.map((column, colIdx) => (
          <section key={column.label} className="space-y-2">
            <div className="flex items-center">
              <span className="rounded bg-[#161b45] px-2 py-1 text-xs font-bold text-white">{column.label}</span>
              <div className="flex flex-1 items-center justify-between rounded-r border border-[#d8dfea] bg-white px-3 py-1.5 text-sm font-medium text-[#273146]">
                <span>{column.name}</span>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <article key={`${column.name}-${i}`} className="rounded-md border border-[#d3dae6] bg-white">
                <div className="border-b border-[#e3e9f3] px-3 py-3">
                  <div className="flex items-start justify-between">
                    <div className="text-[14px] font-semibold leading-none text-[#273146]">Bangalore - Rooftop 5kW</div>
                    <button className="text-[#4f586b]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®</button>
                  </div>
                  <div className="mt-1 text-[10px] text-[#9ca5b7]">Lead ID : #1023</div>
                  <div className="mt-1 text-xs text-[#353f54]">Ramesh</div>
                  <div className="text-[11px] text-[#8f98aa]">1st cross, HSR Layout, Bangalore - 560098</div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-[#e3e9f3] bg-[#f7f9fd] px-3 py-2 text-[10px] text-[#6d778a]">
                  <div>
                    <div className="font-semibold text-[#1f2737]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹4,50,000</div>
                    <div>{colIdx === 0 ? "Amount Credited" : colIdx === 1 ? "BOM Cost" : "Project Value"}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1f2737]">{colIdx === 0 ? "363727353" : colIdx === 1 ? "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹4,50,000" : "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹4,00,000"}</div>
                    <div>{colIdx === 0 ? "Transaction ID" : colIdx === 1 ? "Total Material cost" : "Amount Credited"}</div>
                  </div>
                  <div>
                    <div className={`font-semibold ${colIdx === 2 ? "text-[#ef4444]" : "text-[#1f2737]"}`}>{colIdx === 0 ? "12/12/2025" : colIdx === 1 ? "4/4" : "02/02/2024"}</div>
                    <div>{colIdx === 0 ? "Transaction Date" : colIdx === 1 ? "Material list" : "Transaction date"}</div>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <div className="mt-1 flex items-center justify-between text-xs text-[#66718a]">
                    <span>2/2 Sub tasks</span>
                    <span className="rounded bg-[#d8f7df] px-2 py-0.5 text-[#0f9f4a]">{i % 2 === 0 ? column.tagB : column.tagA}</span>
                  </div>
                  {colIdx === 2 ? <div className="mt-2 rounded bg-[#ffe6e6] px-2 py-1 text-[10px] text-[#ef4444]">Over Due Payment</div> : null}
                  <button className="mt-2 w-full rounded bg-[#171c49] px-2 py-1.5 text-center text-xs text-white">
                    {column.showAction ? "Confirm Payment" : "Athul (Sales Rep)"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

function FinanceRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3">
        <button className="w-full rounded border border-[#d8deea] bg-white px-3 py-2 text-sm font-semibold text-[#2d3650]">Export Finance Report</button>
      </div>
      <div className="mt-5 mb-2">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Alerts &amp; Breaches (3)</h3>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">
              {i === 1 ? "BOM vs Actual material cost comparison Alert" : "Final Payment overdue 18 days"}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
              <span className="rounded-full border border-[#f0ca97] bg-[#fff5e8] px-2 py-0.5 text-[10px] text-[#d4892d]">
                {i === 1 ? "Material price increase" : i === 2 ? "Loan Applied" : "Site Survey"}
              </span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">{i === 3 ? "Assign Representative" : "Send Reminder"}</button>
          </article>
        ))}
      </div>
      <div className="mt-5 mb-2">
        <h3 className="text-[15px] font-semibold text-[#2a3550]">Priority Tasks (2)</h3>
      </div>
      <article className="rounded border border-[#ececf2] bg-white p-2.5">
        <div className="rounded bg-[#eef1f7] px-2 py-1 text-[10px] text-[#4f5a71]">Payment Follow-up</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
          <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">Site Survey</span>
        </div>
        <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
        <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">Upload missing receipt</div>
        <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Assign Representative</button>
      </article>
    </aside>
  );
}

export function FinanceDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4 pt-4">
        <div className="flex items-start justify-between">
          <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {financeKpis.map((item) => (
            <FinanceKpiCard key={item.title} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.32fr_0.68fr] xl:items-stretch">
          <FinanceRevenueFunnel />
          <FinanceOverdueTable />
        </div>
        <FinancePipelineBoard />
      </section>
      <FinanceRightRail />
    </div>
  );
}

function SupplyKpiCard({ item }: { item: SupplyKpi }) {
  return (
    <article className="rounded-md border border-[#d8deea] bg-white px-3 py-3">
      <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value}</div>
      <div className="mt-2 text-[14px] font-medium leading-[1.25] text-[#1f2738]">{item.title}</div>
      <div className={`mt-2 text-[10px] font-semibold ${item.danger ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{item.note}</div>
    </article>
  );
}

function SupplyDispatchFunnel() {
  const bars = [
    { value: "23", label: "Dispatched", width: "100%" },
    { value: "22", label: "Pending", width: "80%" },
    { value: "20", label: "In - transits", width: "68%" },
    { value: "18", label: "Damage Reported", width: "52%" },
    { value: "10", label: "Missing Items Reported", width: "42%" },
  ];

  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Dispatch Funnel</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2.5">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`flex h-8 items-center rounded-sm px-3 ${idx % 2 === 0 ? "bg-[#8edfc6]" : "bg-[#afead7]"}`} style={{ width: bar.width }}>
                <span className="text-[13px] font-semibold leading-none text-[#152034]">{bar.value}</span>
              </div>
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SupplySafetyStock() {
  const rows = [
    { name: "Inverter 5kW", category: "Inverter", current: "12", safety: "25", gap: "-13" },
    { name: "Solar Panel 54...", category: "Module", current: "23", safety: "25", gap: "-2" },
    { name: "DC Cable 4mm", category: "BoS", current: "440m", safety: "540m", gap: "-100m" },
    { name: "Inverter 5kW", category: "Inverter", current: "12", safety: "25", gap: "-13" },
    { name: "DC Cable 4mm", category: "BoS", current: "440m", safety: "540m", gap: "-100m" },
  ];

  return (
    <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Safety Stock Alert</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
      </div>
      <div className="max-h-[212px] overflow-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#e3e8f0] text-[#36445f]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Material Name</th>
              <th className="px-2 py-2 font-semibold">Category</th>
              <th className="px-2 py-2 font-semibold">Current Stock</th>
              <th className="px-2 py-2 font-semibold">Safety Stock</th>
              <th className="px-2 py-2 font-semibold">Stock Gap</th>
              <th className="px-2 py-2 font-semibold">|</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row.name}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-2.5"><input type="checkbox" defaultChecked={idx === 0} /></td>
                <td className="px-2 py-2.5 font-semibold">{row.name}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.category}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.current}</td>
                <td className="px-2 py-2.5 text-[#6d778a]">{row.safety}</td>
                <td className={`px-2 py-2.5 ${row.gap.startsWith("-") ? "text-[#ef4444]" : "text-[#6d778a]"}`}>{row.gap}</td>
                <td className="px-2 py-2.5 text-[#9aa3b5]">|</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function SupplyDispatchStatus() {
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Dispatch Status</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-[#dce4e2] text-[#2f3c57]">
              <th className="px-2 py-2"><input type="checkbox" /></th>
              <th className="px-2 py-2 font-semibold">Lead ID</th>
              <th className="px-2 py-2 font-semibold">Tracking ID</th>
              <th className="px-2 py-2 font-semibold">Dispatch Status</th>
              <th className="px-2 py-2 font-semibold">New Installation</th>
              <th className="px-2 py-2 font-semibold">Procurement Status</th>
              <th className="px-2 py-2 font-semibold">Lositic Partner</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, idx) => (
              <tr key={idx} className="border-b border-[#ebeff5] text-[#28334a]">
                <td className="px-2 py-3"><input type="checkbox" /></td>
                <td className="px-2 py-3 font-semibold">#1023</td>
                <td className="px-2 py-3 font-semibold">#1023</td>
                <td className="px-2 py-3 font-semibold">4/4 Dispatched</td>
                <td className="px-2 py-3 font-semibold">{idx < 2 ? "Yes" : "No"}</td>
                <td className="px-2 py-3">
                  <button className="inline-flex min-w-[130px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-xs font-semibold text-[#33435f]">
                    {idx === 0 ? "Not Required" : "Required"}
                    <span>v</span>
                  </button>
                </td>
                <td className="px-2 py-3 font-semibold">ATS Logistics</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[#5e687d]">
        <span>Page 1 of 10</span>
        <button className="rounded border border-[#ccd4e1] px-2 py-1">Show 10 rows</button>
      </div>
    </article>
  );
}

function SupplyPipeline() {
  const columns = [
    { label: "01", name: "Procurement Stage", tag: "Lead Added" },
    { label: "02", name: "Dispatch", tag: "Module Delivered" },
  ];
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-[#edf2f6] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">My Pipeline</h3>
        <div className="flex items-center gap-2">
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Search</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Filter</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]">Customise</button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
          <button className="rounded border border-[#d8deea] bg-white px-2 py-1 text-[11px] text-[#8a94a6]"> </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {columns.map((column, colIdx) => (
          <section key={column.label} className="space-y-2">
            <div className="flex items-center">
              <span className="rounded bg-[#161b45] px-2 py-1 text-xs font-bold text-white">{column.label}</span>
              <div className="flex flex-1 items-center justify-between rounded-r border border-[#d8dfea] bg-white px-3 py-1.5 text-sm font-medium text-[#273146]">
                <span>{column.name}</span>
              </div>
            </div>
            {[1, 2].map((i) => (
              <article key={`${column.label}-${i}`} className="rounded-md border border-[#d3dae6] bg-white">
                <div className="border-b border-[#e3e9f3] px-3 py-3">
                  <div className="flex items-start justify-between">
                    <div className="text-[14px] font-semibold leading-none text-[#273146]">Bangalore - Rooftop 5kW</div>
                    <button className="text-[#4f586b]">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®</button>
                  </div>
                  <div className="mt-1 text-[10px] text-[#9ca5b7]">Lead ID : #1023</div>
                  <div className="mt-1 text-xs text-[#353f54]">Ramesh {colIdx === 1 ? "(Customer )" : ""}</div>
                  <div className="text-xs text-[#353f54]">Adithya (vendor)</div>
                  <div className="text-[11px] text-[#8f98aa]">1st cross, HSR Layout, Bangalore - 560098</div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-[#e3e9f3] bg-[#f7f9fd] px-3 py-2 text-[10px] text-[#6d778a]">
                  <div>
                    <div className="font-semibold text-[#1f2737]">{colIdx === 0 ? "Working Capital" : "Module"}</div>
                    <div>{colIdx === 0 ? "Loan Type" : "Item"}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1f2737]">{colIdx === 0 ? "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹4,50,000" : "12-11-2025"}</div>
                    <div>{colIdx === 0 ? "Loan requested" : "Delivered"}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1f2737]">{colIdx === 0 ? "12-01-2025" : "1/4"}</div>
                    <div>{colIdx === 0 ? "Request Date" : "Proof Updated"}</div>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <div className="mt-1 flex items-center justify-between text-xs text-[#66718a]">
                    <span>1/4 Sub tasks</span>
                    <span className="rounded bg-[#d8f7df] px-2 py-0.5 text-[#0f9f4a]">{column.tag}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

function SupplyRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3 space-y-2">
        <button className="w-full rounded border border-[#191d47] bg-[#191d47] px-3 py-2 text-sm font-semibold text-white">Track Shipment</button>
        <button className="w-full rounded border border-[#263055] py-2 text-sm font-semibold text-[#263055]">Upload Delivery proof</button>
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Alerts &amp; Breaches (3)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2, 3].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className={`rounded px-2 py-1 text-[10px] ${i === 3 ? "bg-[#ecfbef] text-[#2f9e4a]" : "bg-[#fff5ea] text-[#cc7a2d]"}`}>
              {i === 1 ? "Damaged Item" : i === 2 ? "Missing Item" : "Structure Delivered"}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Lead #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">{i === 1 ? "Dispatch" : i === 2 ? "Procurement" : "Site Survey"}</span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">{i === 3 ? "Structure delivered on 12th jan" : "Inverter 5kW damaged at the site. Need replacement."}</div>
            {i !== 3 ? <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Send Reminder</button> : null}
          </article>
        ))}
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Priority Tasks (2)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#eef1f7] px-2 py-1 text-[10px] text-[#4f5a71]">Structure delivery is 3 days overdue.</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Lead #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">Site Survey</span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">Customer accepted quotation, 60% advance pending for 3 days.</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Take Action</button>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function SupplyChainDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4 pt-4">
        <div className="flex items-start justify-between">
          <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {supplyKpis.slice(0, 5).map((item) => (
            <SupplyKpiCard key={item.title} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {supplyKpis.slice(5).map((item) => (
            <SupplyKpiCard key={item.title} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.44fr_0.56fr] xl:items-stretch">
          <SupplyDispatchFunnel />
          <SupplySafetyStock />
        </div>
        <SupplyDispatchStatus />
        <SupplyPipeline />
      </section>
      <SupplyRightRail />
    </div>
  );
}

function DesignKpiCard({ item }: { item: DesignKpi }) {
  return (
    <article className={`rounded-md border px-3 py-3 ${item.danger ? "border-[#f0b8b8] bg-[#fff8f8]" : "border-[#d8deea] bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[21px] font-semibold leading-none text-[#1b2233]">{item.value}</div>
          <div className="mt-2 text-[14px] font-medium leading-[1.2] text-[#1f2738]">{item.title}</div>
          <div className={`mt-2 text-[10px] font-semibold ${item.danger ? "text-[#ef4444]" : "text-[#6e778a]"}`}>{item.note}</div>
        </div>
        <div className={`${item.danger ? "hidden" : "mt-2 h-10 w-16 bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat"}`} />
      </div>
    </article>
  );
}

function DesignFunnel() {
  const bars = [
    { value: "23", label: "DPR Requests", width: "100%" },
    { value: "22", label: "BOM Pending", width: "80%" },
    { value: "20", label: "DPR Pending", width: "68%" },
    { value: "18", label: "Revision Requests", width: "52%" },
    { value: "10", label: "DPR Approved", width: "42%" },
  ];
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">Design Funnel</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="rounded bg-[#f8fbfa] p-3">
        <div className="space-y-2.5">
          {bars.map((bar, idx) => (
            <div key={bar.label} className="flex items-center gap-2">
              <div className={`flex h-8 items-center rounded-sm px-3 ${idx % 2 === 0 ? "bg-[#8edfc6]" : "bg-[#afead7]"}`} style={{ width: bar.width }}>
                <span className="text-[13px] font-semibold leading-none text-[#152034]">{bar.value}</span>
              </div>
              <span className="text-[10px] text-[#748098]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function DesignDprOverview() {
  const legend = [
    { label: "DPR Approved", color: "#10b981" },
    { label: "Total Revision Requests", color: "#059669" },
    { label: "DPR Approval Pending", color: "#f59e0b" },
    { label: "DPR SLA breached (approval delayed beyond 3 days)", color: "#ef4444" },
  ];
  return (
    <article className="rounded-md border border-[#dbe1ec] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[20px] font-medium text-[#1d2537]">DPR Overview</h3>
        <button className="rounded border border-[#d8deea] px-2 py-1 text-[11px] text-[#8a94a6]">Last 7 Days</button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="relative h-44 w-44 rounded-full bg-[conic-gradient(#f59e0b_0_32%,#10b981_32%_52%,#059669_52%_68%,#ef4444_68%_100%)] p-6">
          <div className="h-full w-full rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <div className="text-[40px] font-semibold text-[#202735]">158</div>
              <div className="text-sm text-[#718097]">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-[11px] text-[#516078]">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </span>
              <span>48</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function DesignOverviewTable() {
  type DesignWorkflowRow = {
    leadId: string;
    customer: string;
    vendor: string;
    vendorContact: string;
    initialStatus: "Sent" | "Pending";
    dprStatus: "DPR Send" | "Pending" | "DPR Approved By Client";
    dprSla: "On-track" | "Over Due" | "--";
    updatedOn: string;
  };

  const rows: DesignWorkflowRow[] = [
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Sent", dprStatus: "DPR Send", dprSla: "On-track", updatedOn: "26-02-2025" },
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Pending", dprStatus: "Pending", dprSla: "--", updatedOn: "26-02-2025" },
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Sent", dprStatus: "DPR Approved By Client", dprSla: "--", updatedOn: "26-02-2025" },
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Sent", dprStatus: "DPR Send", dprSla: "Over Due", updatedOn: "26-02-2025" },
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Sent", dprStatus: "DPR Send", dprSla: "On-track", updatedOn: "26-02-2025" },
    { leadId: "#1023", customer: "Murugan", vendor: "Athul", vendorContact: "+911231232", initialStatus: "Sent", dprStatus: "DPR Send", dprSla: "On-track", updatedOn: "26-02-2025" },
  ];

  const [openActionsFor, setOpenActionsFor] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<DesignWorkflowRow | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"initial" | "bom" | "dpr" | "sla" | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setFilterOpen(false);
        setActiveFilter(null);
      }
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setOpenActionsFor(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getTagClassName = (kind: "green" | "orange") => (
    kind === "green" ? "bg-[#dbf4de] text-[#1f8c38]" : "bg-[#fae5cc] text-[#b26d1f]"
  );

  const nestedFilterItems = {
    initial: ["Send", "Pending"],
    bom: ["Approved", "Pending"],
    dpr: ["DPR send", "Client Approved"],
    sla: ["On- Track", "Over Due"],
  };

  return (
    <>
      <article className="flex h-full min-w-0 flex-col rounded-md border border-[#dbe1ec] bg-white p-3">
        <div className="mb-4">
          <h3 className="text-[34px] font-semibold leading-tight text-[#1b2232]">Design Workflow</h3>
          <p className="mt-1 text-sm text-[#6f788d]">Manage the design workflow</p>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <input
            className="h-9 w-[220px] rounded border border-[#dbe1ec] bg-white px-3 text-xs text-[#6f788d] outline-none"
            placeholder="Search"
          />
          <div className="flex items-center gap-2">
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterOpen((prev) => !prev);
                  setActiveFilter(null);
                }}
                className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]"
              >
                Filter
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {filterOpen ? (
                <div className="absolute right-0 top-10 z-30 w-[290px] overflow-hidden rounded-[24px] border border-[#d7dbe4] bg-white shadow-[0_16px_28px_rgba(21,29,62,0.12)]">
                  <div className="border-b border-[#e7e9ef] px-6 py-3 text-[20px] font-semibold leading-none text-[#1a1f4f]">Filter by</div>
                  <button className="flex w-full items-center justify-between border-b border-[#e7e9ef] px-6 py-5 text-[15px] leading-none text-[#757575]">
                    <span>Date Range</span>
                    <CalendarDays className="h-5 w-5" />
                  </button>
                  <button onClick={() => setActiveFilter("initial")} className="flex w-full items-center justify-between border-b border-[#e7e9ef] px-6 py-5 text-[15px] leading-none text-[#757575]">
                    <span>Initial Design Status</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button onClick={() => setActiveFilter("bom")} className="flex w-full items-center justify-between border-b border-[#e7e9ef] px-6 py-5 text-[15px] leading-none text-[#757575]">
                    <span>BOM Status</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button onClick={() => setActiveFilter("dpr")} className="flex w-full items-center justify-between border-b border-[#e7e9ef] px-6 py-5 text-[15px] leading-none text-[#757575]">
                    <span>DPR Status</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button onClick={() => setActiveFilter("sla")} className="flex w-full items-center justify-between px-6 py-5 text-[15px] leading-none text-[#757575]">
                    <span>DPR Approval SLA</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
              {filterOpen && activeFilter ? (
                <div className="absolute right-[300px] top-[96px] z-40 w-[250px] overflow-hidden rounded-[20px] border border-[#d7dbe4] bg-white shadow-[0_16px_28px_rgba(21,29,62,0.12)]">
                  {nestedFilterItems[activeFilter].map((item) => (
                    <label key={item} className="flex cursor-pointer items-center gap-4 border-b border-[#e7e9ef] px-5 py-4 last:border-b-0">
                      <input type="checkbox" className="h-7 w-7 rounded-[8px] border-[#a6adb8] text-[#1a1f4f]" />
                      <span className="text-[15px] leading-none text-[#767676]">{item}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
            <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]">
              Assigned
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]">
              Customise
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="min-w-[1320px] text-left text-xs">
            <thead>
              <tr className="bg-[#dce7e4] text-[#26334f]">
                <th className="w-10 px-2 py-3"><input type="checkbox" /></th>
                <th className="px-2 py-3 font-medium">Lead ID</th>
                <th className="w-8 px-2 py-3 text-[#9ca4b5]">||</th>
                <th className="px-2 py-3 font-medium">Customer</th>
                <th className="px-2 py-3 font-medium">Vendor</th>
                <th className="px-2 py-3 font-medium">Vendor Contact</th>
                <th className="px-2 py-3 font-medium">Initial Design Status</th>
                <th className="px-2 py-3 font-medium">DPR Status</th>
                <th className="px-2 py-3 font-medium">DPR Approvals SLA</th>
                <th className="px-2 py-3 font-medium">Updated On</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.leadId}-${idx}`} className="cursor-pointer border-b border-[#ebeff5] text-[#28334a] hover:bg-[#f8fafc]" onClick={() => setSelectedRow(row)}>
                  <td className="px-2 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
                  <td className="px-2 py-4">{row.leadId}</td>
                  <td className="px-2 py-4 text-[#99a3b6]" />
                  <td className="px-2 py-4">{row.customer}</td>
                  <td className="px-2 py-4">{row.vendor}</td>
                  <td className="px-2 py-4">{row.vendorContact}</td>
                  <td className="px-2 py-4">
                    <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${getTagClassName(row.initialStatus === "Sent" ? "green" : "orange")}`}>
                      {row.initialStatus}
                    </span>
                  </td>
                  <td className="px-2 py-4">{row.dprStatus}</td>
                  <td className="px-2 py-4">
                    {row.dprSla === "--" ? (
                      <span className="font-semibold text-[#2d3446]">--</span>
                    ) : (
                      <span className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${getTagClassName(row.dprSla === "On-track" ? "green" : "orange")}`}>
                        {row.dprSla}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-4">{row.updatedOn}</td>
                  <td className="px-2 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block" ref={openActionsFor === idx ? actionsRef : null}>
                      <button className="rounded p-1 text-[#434a5d] hover:bg-[#f1f4f9]" onClick={() => setOpenActionsFor(openActionsFor === idx ? null : idx)}>
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openActionsFor === idx ? (
                        <div className="absolute right-0 top-7 z-20 w-[160px] overflow-hidden rounded-[14px] border border-[#e2e5ec] bg-white shadow-[0_12px_24px_rgba(22,30,58,0.12)]">
                          <button className="flex w-full items-center gap-2.5 border-b border-[#eceef3] px-4 py-3 text-lg text-[#737373]" onClick={() => { setSelectedRow(row); setOpenActionsFor(null); }}>
                            <Eye className="h-5 w-5" />
                            View
                          </button>
                          <button className="flex w-full items-center gap-2.5 px-4 py-3 text-lg text-[#737373]" onClick={() => setOpenActionsFor(null)}>
                            <Trash2 className="h-5 w-5" />
                            Archive
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#5e687d]">
          <div className="flex items-center gap-3">
            <span>Page 1 of 10</span>
            <button className="rounded border border-[#ccd4e1] px-2 py-1">Show 10 rows</button>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded border border-[#d5dce8] px-3 py-1.5">Previous</button>
            <button className="rounded bg-[#171c49] px-2.5 py-1.5 text-white">1</button>
            {[2, 4, 5, 6, 7].map((n) => (
              <button key={n} className="rounded border border-[#d5dce8] px-2.5 py-1.5">{n}</button>
            ))}
            <button className="rounded border border-[#d5dce8] px-3 py-1.5">Next</button>
          </div>
        </div>
      </article>

      {selectedRow ? (
        <div className="fixed inset-0 z-40">
          <button className="absolute inset-0 bg-[#13182f]/45" onClick={() => setSelectedRow(null)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-[360px] overflow-y-auto border-l border-[#dfe4ee] bg-white shadow-[-8px_0_24px_rgba(23,29,59,0.12)]">
            <div className="flex items-start justify-between border-b border-[#e8ebf2] px-4 py-4">
              <div>
                <h4 className="text-[28px] font-semibold leading-none text-[#2a2f42]">{selectedRow.customer}</h4>
                <p className="mt-1 text-xs text-[#7d8798]">Lead ID: #TK-1043</p>
              </div>
              <button className="rounded-full border border-[#cfd5e1] p-1 text-[#55607a]" onClick={() => setSelectedRow(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-4 py-4 text-xs text-[#5e697f]">
              <div>
                <div className="text-[#7f8899]">Customer</div>
                <div className="mt-1 text-sm text-[#2f384c]">Rahul Sharma</div>
              </div>
              <div>
                <div className="text-[#7f8899]">Vendor</div>
                <div className="mt-1 text-sm text-[#2f384c]">Rahul Sharma</div>
              </div>
              <div>
                <div className="text-[#7f8899]">Vendor Phone</div>
                <div className="mt-1 text-sm text-[#2f384c]">+1 555-001</div>
              </div>
              <div>
                <div className="text-[#7f8899]">Last Updated</div>
                <div className="mt-1 text-sm text-[#2f384c]">{selectedRow.updatedOn}</div>
              </div>
              <div>
                <div className="text-[#7f8899]">Preferred Visits Date</div>
                <div className="mt-1 text-sm text-[#2f384c]">25-03-2025</div>
              </div>
              <div>
                <div className="text-[#7f8899]">Service Requested</div>
                <div className="mt-1 text-sm text-[#2f384c]">Inspection &amp; Maintenance</div>
              </div>
              <div className="col-span-2">
                <div className="text-[#7f8899]">Design Status</div>
                <button className="mt-1 inline-flex min-w-[120px] items-center justify-between rounded border border-[#d8deea] bg-[#f8fbff] px-2 py-1 text-[11px] text-[#33435f]">
                  DPR Send
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function DesignRequestsTable() {
  const rows = Array.from({ length: 6 }, () => ({
    leadId: "#1023",
    customer: "Murugan",
    vendor: "Athul",
    vendorContact: "+911231232",
    region: "Karnataka",
    capacity: "3 kW",
    latLong: "L:12.9714\nG:12.9714",
    buildingType: "3 floor",
  }));

  return (
    <section className="pt-4">
      <article className="min-w-0 rounded-md border border-[#dbe1ec] bg-white p-3">
        <div className="mb-4">
          <h3 className="text-[34px] font-semibold leading-tight text-[#1b2232]">Requests</h3>
          <p className="mt-1 text-sm text-[#6f788d]">Manage Your Requests</p>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <input
            className="h-9 w-[220px] rounded border border-[#dbe1ec] bg-white px-3 text-xs text-[#6f788d] outline-none"
            placeholder="Search"
          />
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]">
              Filter
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]">
              Assigned
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8deea] bg-white px-3 text-xs text-[#8a94a6]">
              Customise
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mb-3 flex w-full max-w-[420px] items-center rounded bg-[#eef1f7] p-1 text-sm">
          <button className="w-1/2 rounded bg-[#171c49] py-1.5 font-semibold text-white">Initial Design Request</button>
          <button className="w-1/2 rounded py-1.5 font-medium text-[#48536b]">DPR Request</button>
        </div>

        <div className="max-w-full overflow-x-auto overflow-y-hidden">
          <table className="min-w-[1350px] text-left text-xs">
            <thead>
              <tr className="bg-[#dce7e4] text-[#26334f]">
                <th className="w-10 px-2 py-3"><input type="checkbox" /></th>
                <th className="px-2 py-3 font-medium">Lead ID</th>
                <th className="w-8 px-2 py-3 text-[#9ca4b5]">⇵</th>
                <th className="px-2 py-3 font-medium">Customer</th>
                <th className="px-2 py-3 font-medium">Vendor</th>
                <th className="px-2 py-3 font-medium">Vendor Contact</th>
                <th className="px-2 py-3 font-medium">Region</th>
                <th className="px-2 py-3 font-medium">Capacity (Kw)</th>
                <th className="px-2 py-3 font-medium">Latitude &amp; Longitude</th>
                <th className="px-2 py-3 font-medium">Building Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.leadId}-${idx}`} className="border-b border-[#ebeff5] text-[#28334a]">
                  <td className="px-2 py-4"><input type="checkbox" /></td>
                  <td className="px-2 py-4">{row.leadId}</td>
                  <td className="px-2 py-4 text-[#99a3b6]" />
                  <td className="px-2 py-4">{row.customer}</td>
                  <td className="px-2 py-4">{row.vendor}</td>
                  <td className="px-2 py-4">{row.vendorContact}</td>
                  <td className="px-2 py-4">{row.region}</td>
                  <td className="px-2 py-4">{row.capacity}</td>
                  <td className="px-2 py-4 whitespace-pre-line">{row.latLong}</td>
                  <td className="px-2 py-4">{row.buildingType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#5e687d]">
          <div className="flex items-center gap-3">
            <span>Page 1 of 10</span>
            <button className="rounded border border-[#ccd4e1] px-2 py-1">Show 10 rows</button>
          </div>
        </div>
      </article>
    </section>
  );
}
function DesignRightRail() {
  return (
    <aside className="w-full rounded-md border border-[#dfe4ee] bg-[#f8fafd] p-4 xl:sticky xl:top-0 xl:w-[320px] xl:self-start">
      <h3 className="text-[15px] font-semibold text-[#2a3550]">Quick Actions</h3>
      <div className="mt-3 space-y-2">
        <button className="w-full rounded border border-[#191d47] bg-[#191d47] px-3 py-2 text-sm font-semibold text-white">Upload DPR/BOM</button>
        <button className="w-full rounded border border-[#263055] py-2 text-sm font-semibold text-[#263055]">View Pending Approvals</button>
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Alerts &amp; Breaches (3)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#fff5ea] px-2 py-1 text-[10px] text-[#cc7a2d]">DPR Not approved by Client</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">DPR Send</span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Send Reminder</button>
          </article>
        ))}
      </div>

      <h3 className="mt-5 text-[15px] font-semibold text-[#2a3550]">Priority Tasks (2)</h3>
      <div className="mt-2 space-y-3">
        {[1, 2].map((i) => (
          <article key={i} className="rounded border border-[#ececf2] bg-white p-2.5">
            <div className="rounded bg-[#eef1f7] px-2 py-1 text-[10px] text-[#4f5a71]">Due Soon in 4 Days</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-[#28324a]">Project #1025</div>
              <span className="rounded-full border border-[#a8c4e4] bg-[#f4f9ff] px-2 py-0.5 text-[10px] text-[#2c69ad]">Payment Completed</span>
            </div>
            <div className="text-xs text-[#8d97a8]">Bangalore, 3kW Rooftop</div>
            <div className="mt-2 border-t border-[#eceff5] pt-2 text-xs text-[#6b7488]">Upload missing receipt</div>
            <button className="mt-3 w-full rounded border border-[#263055] py-1.5 text-xs font-semibold text-[#263055]">Send Reminder</button>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function DesignDashboardBody({ userName }: { userName: string }) {
  return (
    <div className="min-w-0 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="min-w-0 space-y-4 pt-4">
        <div className="flex items-start justify-between">
          <h1 className="text-[40px] font-medium leading-none tracking-[-0.02em] text-[#171f2d]">Hi {userName}</h1>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Monthly</button>
            <button className="rounded border border-[#d8deea] bg-white px-3 py-1.5 text-xs text-[#8a94a5]">Export</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {designKpis.map((item) => (
            <DesignKpiCard key={`${item.title}-${item.value}`} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.5fr_0.5fr]">
          <DesignFunnel />
          <DesignDprOverview />
        </div>
        <DesignOverviewTable />
      </section>
      <DesignRightRail />
    </div>
  );
}

function RightRail({ title, quickActions, cards }: { title: string; quickActions: string[]; cards: PanelCard[] }) {
  return (
    <aside className="w-full rounded border border-[#d9deea] bg-[#f7f9fc] p-4 xl:w-[320px]">
      <h3 className="text-lg font-semibold text-[#2a3346]">{title}</h3>
      <div className="mt-3 space-y-2">
        {quickActions.map((action, idx) => (
          <button
            key={action}
            className={`w-full rounded border px-3 py-2 text-sm font-semibold ${
              idx === 0 ? "border-[#191d47] bg-[#191d47] text-white" : "border-[#1e2750] bg-white text-[#1e2750]"
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {cards.map((card, idx) => (
          <article key={`${card.title}-${idx}`} className="rounded border border-[#ececf2] bg-white p-3">
            <div className="text-sm font-semibold text-[#252f43]">{card.title}</div>
            {card.subtitle ? <div className="mt-1 text-xs text-[#78839a]">{card.subtitle}</div> : null}
            {card.action ? (
              <button className="mt-3 w-full rounded border border-[#252d52] py-1.5 text-xs font-semibold text-[#252d52]">
                {card.action}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </aside>
  );
}

function DashboardBody({ role, userName, section }: { role: RoleSlug; userName: string; section?: string }) {
  if (role === "design-team") {
    if (section === "requests") {
      return <DesignRequestsTable />;
    }
    if (section === "design-workflow") {
      return <section className="h-[calc(100vh-96px)] overflow-hidden pt-4"><DesignOverviewTable /></section>;
    }
    return <DesignDashboardBody userName={userName} />;
  }

  if (role === "operations-team") {
    return <OperationsDashboardBody />;
  }

  if (role === "net-metering-team") {
    return <NetMeteringDashboardBody />;
  }

  if (role === "loan-team") {
    return <LoanDashboardBody userName={userName} />;
  }

  if (role === "finance-team") {
    return <FinanceDashboardBody userName={userName} />;
  }

  if (role === "supply-chain-team") {
    return <SupplyChainDashboardBody userName={userName} />;
  }

  if (role === "amc-team") {
    return <AmcDashboardBody userName={userName} />;
  }

  if (role === "sales-team") {
    return <SalesDashboardBody userName={userName} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <StatGrid items={STATS_BY_ROLE[role]} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <FunnelCard
            title="Milestones Progress Funnel"
            bars={[
              { label: "Site Survey done", width: "100%" },
              { label: "DPR Approval", width: "75%" },
              { label: "Procurement", width: "68%" },
              { label: "Installation", width: "60%" },
              { label: "Net metering", width: "52%" },
            ]}
          />
          <GenericTable title="Top Performers" />
          <GenericTable title="Teams" />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DonutCard title="Installation Status Overview" />
          <DonutCard title="Material Dispatch & Delivery" />
        </div>
        <GenericTable title="SLA Trend by Team" />
      </section>
      <RightRail
        title="Quick Actions"
        quickActions={["Add Users", "Broadcast Message", "Check Tickets"]}
        cards={[
          { title: "Alerts & Breaches (3)", subtitle: "Lead #1025 vendor not assigned for 36 hours", action: "Assign Vendor" },
          { title: "Priority Tasks (2)", subtitle: "Customer accepted quotation, payment pending", action: "Take Action" },
        ]}
      />
    </div>
  );
}

export function RoleDashboard({ role, userName, section }: RoleDashboardProps) {
  const pathname = usePathname();
  const nav = NAV_BY_ROLE[role];
  const roleTitle = getRoleTitle(role);
  const isNetMetering = role === "net-metering-team";
  const isFinanceTeam = role === "finance-team";
  const isAmcTeam = role === "amc-team";
  const hasOwnHero = hasRoleSpecificHero(role);
  const activeItem = role === "design-team"
    ? (
      pathname?.includes("/design-workflow")
        ? "Design Workflow"
        : pathname?.includes("/requests")
          ? "Requests"
          : "Dashboard"
    )
    : nav[0];

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
