"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Bell,
  ChevronDown,
  ChevronRight,
  Filter,
  MoreVertical,
  NotebookText,
  Search,
  MessageSquareText,
  Phone,
  Pencil,
  MapPin,
  WalletCards,
  X,
  ArrowUpDown,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";
import { getLeadsProjectsData } from "@/features/admin/api/leads-projects";

type ProjectRow = {
  id: string;
  customer: string;
  vendor: string;
  stage: string;
  projectValue: string;
  amountPaid: string;
  dueAmount: string;
  paymentType: string;
  paymentStatus: string;
  assignedTo: string;
  statusRaw?: string;
};

type LeadRow = {
  id: string;
  customer: string;
  vendor: string;
  source: string;
  address: string;
  milestone: "New Lead" | "Site Survey";
  amountPaid: string;
  dueAmount: string;
  assignedTo: string;
  statusRaw?: string;
  createdAt?: string;
};

type DetailContext =
  | { type: "project"; row: ProjectRow; index: number }
  | { type: "lead"; row: LeadRow; index: number };

type DrawerMode = "create" | "view" | "edit" | "detail-edit";

type LeadFormData = {
  leadId: string;
  leadSource: string;
  type: string;
  expectedInstallationDate: string;
  name: string;
  address: string;
  vendor: string;
  assignedTo: string;
  phone: string;
  email: string;
  state: string;
  district: string;
};

type ProjectDetailEditForm = {
  projectType: string;
  customerName: string;
  customerContact: string;
  customerEmail: string;
  vendorAssigned: string;
  vendorPhone: string;
  vendorEmail: string;
  capacityRequirement: string;
  serviceConnectionNumber: string;
  electricityBill: string;
  address: string;
};

type DetailMetric = {
  label: string;
  value: string;
  valueClass?: string;
};

type DetailSubtask = {
  title: string;
  date: string;
  tag?: string;
  metrics: DetailMetric[];
};

type MilestoneTabData = {
  completedText: string;
  subtasks: DetailSubtask[];
};

type ProjectDetailTab = "Milestone" | "Payments History" | "Remarks";

type PaymentHistoryRow = {
  projectId: string;
  transactionId: string;
  paymentType: string;
  paymentByName: string;
  paymentByRole: string;
  milestone: string;
  amount: string;
};

type PaymentFilterParent = "Vendor" | "Payment Type" | "Milestone" | "Customer" | "Date Range";
type RemarksSortParent = "Team" | "Date Range";
type FloatingPosition = { top: number; left: number };

const fallbackProjects: ProjectRow[] = mockData.leadsProjects.projects as ProjectRow[];
const fallbackLeads: LeadRow[] = mockData.leadsProjects.leads as LeadRow[];

const milestoneTabs = [
  "Lead Added",
  "Site Survey Completed",
  "Payments",
  "DPR Approval",
  "Procurement",
  "Dispatch",
  "Installation",
  "Net metering",
] as const;

type MilestoneTab = (typeof milestoneTabs)[number];

const leadMilestoneTabs = ["Lead Added", "Site Survey Completed"] as const;
type LeadMilestoneTab = (typeof leadMilestoneTabs)[number];

const milestoneDataByTab: Record<MilestoneTab, MilestoneTabData> = {
  "Lead Added": {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "Lead Added",
        date: "12-05-2025",
        metrics: [
          { label: "Source", value: "Vendor App" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Site Survey Scheduled",
        date: "12-05-2025",
        metrics: [
          { label: "Source", value: "Vendor App" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  "Site Survey Completed": {
    completedText: "3/2 Completed",
    subtasks: [
      {
        title: "Site Survey Completed",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Initial Quote Send",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "BOM Prepared",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  Payments: {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "60% Amount Paid",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Amount Credited", value: "Rs 4,50,000" },
          { label: "Payment Type", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Full Payment Paid",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Amount Credited", value: "Rs 4,50,000" },
          { label: "Payment Type", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  "DPR Approval": {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "DPR Send",
        date: "12-05-2025",
        metrics: [
          { label: "Design Status", value: "Approved", valueClass: "text-[#16a34a]" },
          { label: "BOM Status", value: "In Progress" },
          { label: "DPR Status", value: "Approved", valueClass: "text-[#16a34a]" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "DPR Not Approved",
        date: "12-05-2025",
        metrics: [
          { label: "Design Status", value: "Not Approved", valueClass: "text-[#ef4444]" },
          { label: "BOM Status", value: "Not Approved", valueClass: "text-[#ef4444]" },
          { label: "DPR Status", value: "Not Approved", valueClass: "text-[#ef4444]" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  Procurement: {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "Procurement Started",
        date: "12-05-2025",
        metrics: [
          { label: "Bill No", value: "N-123-12" },
          { label: "BOM Cost", value: "Rs 4,50,000" },
          { label: "Total Material Cost", value: "Rs 4,50,000" },
          { label: "Variance", value: "Rs 4,50,000" },
          { label: "Variance Date", value: "12-03-2025" },
          { label: "Material list", value: "4/4" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Material Procured",
        date: "12-05-2025",
        metrics: [
          { label: "Bill No", value: "N-123-12" },
          { label: "BOM Cost", value: "Rs 4,50,000" },
          { label: "Total Material Cost", value: "Rs 4,50,000" },
          { label: "Variance", value: "Rs 4,50,000" },
          { label: "Variance Date", value: "12-03-2025" },
          { label: "Material list", value: "4/4" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  Dispatch: {
    completedText: "4/4 Completed",
    subtasks: [
      {
        title: "Module Delivered",
        date: "12-05-2025",
        metrics: [
          { label: "Item", value: "Module" },
          { label: "Delivered at", value: "12-05-2025" },
          { label: "Time", value: "12:30 PM" },
          { label: "Proof Updated", value: "1/4  View Proofs" },
        ],
      },
      {
        title: "Inverter Delivered",
        date: "12-05-2025",
        metrics: [
          { label: "Item", value: "Inverter" },
          { label: "Delivered at", value: "12-05-2025" },
          { label: "Time", value: "12:30 PM" },
          { label: "Proof Updated", value: "1/4  View Proofs" },
        ],
      },
      {
        title: "Structure Delivered",
        date: "12-05-2025",
        metrics: [
          { label: "Item", value: "Inverter" },
          { label: "Delivered at", value: "12-05-2025" },
          { label: "Time", value: "12:30 PM" },
          { label: "Proof Updated", value: "1/4  View Proofs" },
        ],
      },
      {
        title: "BOS Delivered",
        date: "12-05-2025",
        metrics: [
          { label: "Item", value: "BOS" },
          { label: "Delivered at", value: "12-05-2025" },
          { label: "Time", value: "12:30 PM" },
          { label: "Proof Updated", value: "1/4  View Proofs" },
        ],
      },
    ],
  },
  Installation: {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "System Installed Started",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "12-01-2025" },
          { label: "End Date", value: "12-05-2025" },
          { label: "Proof uploaded", value: "4/4" },
        ],
      },
      {
        title: "System Installation Completed",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "12-01-2025" },
          { label: "End Date", value: "12-05-2025" },
          { label: "Proof uploaded", value: "4/4" },
        ],
      },
    ],
  },
  "Net metering": {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "File Created",
        date: "12-05-2025",
        metrics: [
          { label: "Load Extension", value: "Yes" },
          { label: "Stage", value: "Inspection" },
          { label: "Region", value: "Kerala" },
        ],
      },
      {
        title: "File Submitted to EB by Vendor",
        date: "12-05-2025",
        metrics: [
          { label: "Load Extension", value: "Yes" },
          { label: "Stage", value: "Inspection" },
          { label: "Region", value: "Kerala" },
        ],
      },
      {
        title: "Net Metering Completed",
        date: "12-05-2025",
        metrics: [
          { label: "Load Extension", value: "Yes" },
          { label: "Stage", value: "Inspection" },
          { label: "Region", value: "Kerala" },
        ],
      },
    ],
  },
};

const leadMilestoneDataByTab: Record<LeadMilestoneTab, MilestoneTabData> = {
  "Lead Added": {
    completedText: "2/2 Completed",
    subtasks: [
      {
        title: "Lead Added",
        date: "12-05-2025",
        metrics: [
          { label: "Source", value: "Vendor App" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Site Survey Sheduled",
        date: "12-05-2025",
        metrics: [
          { label: "Source", value: "Vendor App" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
  "Site Survey Completed": {
    completedText: "3/3 Completed",
    subtasks: [
      {
        title: "Site Survey Completed",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "Ongoing",
        tag: "Quote Accepted",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
      {
        title: "BOM Prepared",
        date: "12-05-2025",
        metrics: [
          { label: "Project Value", value: "Rs 4,50,000" },
          { label: "Final Quotation", value: "Rs 4,50,000" },
          { label: "Authority", value: "Athul (Vendor)" },
        ],
      },
    ],
  },
};

const paymentHistoryRows: PaymentHistoryRow[] = [
  { projectId: "#1023", transactionId: "#123123", paymentType: "UPI", paymentByName: "Athul", paymentByRole: "Customer", milestone: "Site Survey", amount: "Rs 5,12,000" },
  { projectId: "#1023", transactionId: "#123123", paymentType: "Direct Payment", paymentByName: "Athul", paymentByRole: "Vendor", milestone: "Site Survey", amount: "Rs 5,12,000" },
  { projectId: "#1023", transactionId: "#123123", paymentType: "Bank Transfer", paymentByName: "Athul", paymentByRole: "Vendor", milestone: "Site Survey", amount: "Rs 5,12,000" },
  { projectId: "#1023", transactionId: "#123123", paymentType: "Murugan", paymentByName: "Athul", paymentByRole: "Vendor", milestone: "Site Survey", amount: "Rs 2,50,000" },
  { projectId: "#1023", transactionId: "#123123", paymentType: "Murugan", paymentByName: "Athul", paymentByRole: "Vendor", milestone: "Procurement", amount: "Rs 2,50,000" },
  { projectId: "#1023", transactionId: "#123123", paymentType: "Murugan", paymentByName: "Athul", paymentByRole: "Vendor", milestone: "New Lead", amount: "Rs 2,50,000" },
];

const remarksItems = [
  { id: "1", name: "Athul", team: "Sales Team", date: "Jan 17, 18:00", text: "12 hrs after loan per-approval if vendor not acknowledged" },
  { id: "2", name: "Athul", team: "Sales Team", date: "Jan 17, 18:00", text: "12 hrs after loan per-approval if vendor not acknowledged" },
  { id: "3", name: "Athul", team: "Sales Team", date: "Jan 17, 18:00", text: "12 hrs after loan per-approval if vendor not acknowledged" },
  { id: "4", name: "Athul", team: "Sales Team", date: "Jan 17, 18:00", text: "12 hrs after loan per-approval if vendor not acknowledged" },
];

function getFloatingPosition(anchorRect: DOMRect, panelWidth: number, panelHeight: number, gap = 6): FloatingPosition {
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = anchorRect.right - panelWidth;
  if (left < margin) left = margin;
  if (left + panelWidth > viewportWidth - margin) left = viewportWidth - panelWidth - margin;

  let top = anchorRect.bottom + gap;
  if (top + panelHeight > viewportHeight - margin) top = anchorRect.top - panelHeight - gap;
  if (top < margin) top = margin;

  return { top, left };
}

function getNestedFloatingPosition(anchorRect: DOMRect, panelWidth: number, panelHeight: number, gap = 6): FloatingPosition {
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = anchorRect.right + gap;
  if (left + panelWidth > viewportWidth - margin) left = anchorRect.left - panelWidth - gap;
  if (left < margin) left = margin;

  let top = anchorRect.top;
  if (top + panelHeight > viewportHeight - margin) top = viewportHeight - panelHeight - margin;
  if (top < margin) top = margin;

  return { top, left };
}

function StatCard({ value, title, note, danger }: { value: string; title: string; note: string; danger?: boolean }) {
  return (
    <div className={`rounded-md border px-4 py-3 ${danger ? "border-[#f4a4a4] bg-[#fff6f6]" : "border-[#cedbe8] bg-[#f8fbff]"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[24px] font-semibold leading-[1] tracking-[-0.02em] text-[#111827]">{value}</div>
          <div className="mt-1.5 text-[20px] font-medium leading-[1.1] text-[#111827]">{title}</div>
        </div>
        <div className="mt-2 h-9 w-16 rounded-r-full border-b-2 border-r-2 border-[#38ce91]" />
      </div>
      <p className={`mt-1.5 text-[13px] ${danger ? "text-[#ef4444]" : "text-[#8e95a3]"}`}>{note}</p>
    </div>
  );
}

function stageClass(stage: string) {
  if (stage === "New Lead") return "bg-[#e1e5ff] text-[#3547c4]";
  return "bg-[#fff4dd] text-[#b26a00]";
}

function paymentClass(status: string) {
  if (status.toLowerCase().includes("full")) return "bg-[#e4f4e6] text-[#1a8f2e]";
  return "bg-[#ffe8e8] text-[#ef4444]";
}

function parseLooseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;

  if (raw.includes(",")) {
    const [datePart, timePart] = raw.split(",");
    const [day, month, year] = datePart.trim().split("-").map(Number);
    if (!day || !month || !year) return null;
    const [hour, minute, second] = timePart.trim().split(":").map(Number);
    return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  }

  if (raw.includes("-")) {
    const [day, month, year] = raw.split("-").map(Number);
    if (!day || !month || !year) {
      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStatus(value: string | undefined): string {
  return (value ?? "").toLowerCase();
}

function hasAny(status: string | undefined, keywords: string[]): boolean {
  const text = normalizeStatus(status);
  return keywords.some((keyword) => text.includes(keyword));
}

function defaultForm(leadId: string): LeadFormData {
  return { leadId, leadSource: "Google Ads", type: "Residency", expectedInstallationDate: "", name: "", address: "", vendor: "Rohith", assignedTo: "Rohith", phone: "", email: "sample@gmail.com", state: "Kerala", district: "Thrissur" };
}

function defaultProjectDetailEditForm(customerName: string): ProjectDetailEditForm {
  return {
    projectType: "Residency",
    customerName,
    customerContact: "+91 962273512",
    customerEmail: "customer@gmail.com",
    vendorAssigned: "ABC",
    vendorPhone: "+91 962273512",
    vendorEmail: "abc@gmail.com",
    capacityRequirement: "9",
    serviceConnectionNumber: "12345",
    electricityBill: "962273512",
    address: "1st cross, HSR Layout, Bangalore - 560098",
  };
}

export default function LeadsProjectsPage() {
  const [activeTopTab, setActiveTopTab] = useState<"Projects" | "Leads">("Projects");
  const [projects, setProjects] = useState<ProjectRow[]>(fallbackProjects);
  const [leads, setLeads] = useState<LeadRow[]>(fallbackLeads);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [form, setForm] = useState<LeadFormData>(defaultForm("#121212"));
  const [projectDetailEditForm, setProjectDetailEditForm] = useState<ProjectDetailEditForm>(defaultProjectDetailEditForm("Athul"));
  const [detailContext, setDetailContext] = useState<DetailContext | null>(null);
  const [activeMilestoneTab, setActiveMilestoneTab] = useState<MilestoneTab>("Lead Added");
  const [activeLeadMilestoneTab, setActiveLeadMilestoneTab] = useState<LeadMilestoneTab>("Lead Added");
  const [activeDetailTab, setActiveDetailTab] = useState<ProjectDetailTab>("Milestone");
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);
  const [activePaymentFilterPanel, setActivePaymentFilterPanel] = useState<PaymentFilterParent | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const paymentFilterRef = useRef<HTMLDivElement | null>(null);
  const paymentFilterButtonRef = useRef<HTMLButtonElement | null>(null);
  const paymentFilterPanelRef = useRef<HTMLDivElement | null>(null);
  const paymentVendorButtonRef = useRef<HTMLButtonElement | null>(null);
  const paymentVendorPanelRef = useRef<HTMLDivElement | null>(null);
  const [paymentFilterPos, setPaymentFilterPos] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [paymentVendorPos, setPaymentVendorPos] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [isRemarksSortOpen, setIsRemarksSortOpen] = useState(false);
  const [activeRemarksSortPanel, setActiveRemarksSortPanel] = useState<RemarksSortParent | null>(null);
  const [selectedRemarksTeams, setSelectedRemarksTeams] = useState<string[]>([]);
  const [selectedRemarkFlags, setSelectedRemarkFlags] = useState<string[]>([]);
  const remarksSortRef = useRef<HTMLDivElement | null>(null);
  const remarksSortButtonRef = useRef<HTMLButtonElement | null>(null);
  const remarksSortPanelRef = useRef<HTMLDivElement | null>(null);
  const remarksTeamButtonRef = useRef<HTMLButtonElement | null>(null);
  const remarksTeamPanelRef = useRef<HTMLDivElement | null>(null);
  const [remarksSortPos, setRemarksSortPos] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [remarksTeamPos, setRemarksTeamPos] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const projectStats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((row) =>
      hasAny(row.statusRaw ?? row.stage, ["complete", "completed", "installed", "delivered"]),
    ).length;
    const delayed = projects.filter((row) => hasAny(row.statusRaw ?? row.stage, ["delay", "delayed", "overdue", "late"])).length;
    const onTime = projects.filter((row) => hasAny(row.statusRaw ?? row.stage, ["on time", "ontime"])).length;
    const healthBase = total > 0 ? total : 1;
    const healthPercent = Math.round(((healthBase - delayed) / healthBase) * 100);

    return {
      total,
      completed,
      delayed,
      healthPercent,
      onTime,
    };
  }, [projects]);

  const leadStats = useMemo(() => {
    const total = leads.length;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const newThisMonth = leads.filter((row) => {
      const date = parseLooseDate(row.createdAt);
      if (!date) return false;
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const converted = leads.filter((row) =>
      hasAny(row.statusRaw ?? row.milestone, ["converted", "won", "approved", "project"]),
    ).length;
    const lost = leads.filter((row) =>
      hasAny(row.statusRaw ?? row.milestone, ["lost", "rejected", "declined", "closed"]),
    ).length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return {
      total,
      newThisMonth,
      conversionRate,
      lost,
    };
  }, [leads]);

  useEffect(() => {
    let isMounted = true;

    getLeadsProjectsData({ search: searchTerm })
      .then((result) => {
        if (!isMounted) return;
        setProjects(result.projects);
        setLeads(result.leads);
      })
      .catch((error) => {
        console.error("Leads & projects API failed. Using fallback data.", error);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (paymentFilterRef.current && !paymentFilterRef.current.contains(target)) {
        setIsPaymentFilterOpen(false);
        setActivePaymentFilterPanel(null);
      }
      if (remarksSortRef.current && !remarksSortRef.current.contains(target)) {
        setIsRemarksSortOpen(false);
        setActiveRemarksSortPanel(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    const updateFloatingPositions = () => {
      if (isPaymentFilterOpen && paymentFilterButtonRef.current && paymentFilterPanelRef.current) {
        const anchor = paymentFilterButtonRef.current.getBoundingClientRect();
        const panel = paymentFilterPanelRef.current;
        setPaymentFilterPos(getFloatingPosition(anchor, panel.offsetWidth, panel.offsetHeight));
      }
      if (isPaymentFilterOpen && activePaymentFilterPanel === "Vendor" && paymentVendorButtonRef.current && paymentVendorPanelRef.current) {
        const anchor = paymentVendorButtonRef.current.getBoundingClientRect();
        const panel = paymentVendorPanelRef.current;
        setPaymentVendorPos(getNestedFloatingPosition(anchor, panel.offsetWidth, panel.offsetHeight));
      }

      if (isRemarksSortOpen && remarksSortButtonRef.current && remarksSortPanelRef.current) {
        const anchor = remarksSortButtonRef.current.getBoundingClientRect();
        const panel = remarksSortPanelRef.current;
        setRemarksSortPos(getFloatingPosition(anchor, panel.offsetWidth, panel.offsetHeight));
      }
      if (isRemarksSortOpen && activeRemarksSortPanel === "Team" && remarksTeamButtonRef.current && remarksTeamPanelRef.current) {
        const anchor = remarksTeamButtonRef.current.getBoundingClientRect();
        const panel = remarksTeamPanelRef.current;
        setRemarksTeamPos(getNestedFloatingPosition(anchor, panel.offsetWidth, panel.offsetHeight));
      }
    };

    const raf = requestAnimationFrame(updateFloatingPositions);
    window.addEventListener("resize", updateFloatingPositions);
    window.addEventListener("scroll", updateFloatingPositions, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateFloatingPositions);
      window.removeEventListener("scroll", updateFloatingPositions, true);
    };
  }, [isPaymentFilterOpen, activePaymentFilterPanel, isRemarksSortOpen, activeRemarksSortPanel]);

  const openCreateDrawer = () => {
    const generatedLeadId = `#${121212 + projects.length}`;
    setDrawerMode("create");
    setSelectedRowIndex(null);
    setForm(defaultForm(generatedLeadId));
    setIsDrawerOpen(true);
  };

  const openViewDrawer = (row: ProjectRow, index: number) => {
    setSelectedRowIndex(index);
    setDetailContext({ type: "project", row, index });
    setActiveMilestoneTab("Lead Added");
    setActiveDetailTab("Milestone");
    setIsPaymentFilterOpen(false);
    setActivePaymentFilterPanel(null);
    setIsRemarksSortOpen(false);
    setActiveRemarksSortPanel(null);
  };

  const openLeadDetail = (row: LeadRow, index: number) => {
    setSelectedRowIndex(index);
    setDetailContext({ type: "lead", row, index });
    setActiveLeadMilestoneTab(row.milestone === "Site Survey" ? "Site Survey Completed" : "Lead Added");
    setActiveDetailTab("Milestone");
    setIsPaymentFilterOpen(false);
    setActivePaymentFilterPanel(null);
    setIsRemarksSortOpen(false);
    setActiveRemarksSortPanel(null);
  };

  const vendorOptions = ["ABC", "Sun solutions"];
  const filteredVendors = vendorOptions.filter((item) => item.toLowerCase().includes(vendorSearch.toLowerCase()));

  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor) ? prev.filter((item) => item !== vendor) : [...prev, vendor],
    );
  };

  const remarksTeamOptions = ["Loan Team", "Sales Team", "Ops Team", "Admin", "Finance Team", "Net meter Team", "Finance Team"];
  const remarksStatusFlags = ["Opened", "Closed", "High Priority", "Medium Priority"];

  const toggleRemarksTeam = (team: string) => {
    setSelectedRemarksTeams((prev) =>
      prev.includes(team) ? prev.filter((item) => item !== team) : [...prev, team],
    );
  };

  const toggleRemarkFlag = (flag: string) => {
    setSelectedRemarkFlags((prev) =>
      prev.includes(flag) ? prev.filter((item) => item !== flag) : [...prev, flag],
    );
  };

  const openEditDrawer = (row: ProjectRow, index: number) => {
    setDrawerMode("edit");
    setSelectedRowIndex(index);
    setForm({ leadId: "#121212", leadSource: "Google Ads", type: "Residency", expectedInstallationDate: "", name: row.customer, address: "1st cross, HSR Layout, Bangalore - 560098", vendor: row.vendor, assignedTo: row.assignedTo, phone: "+91 9988776655", email: "sample@gmail.com", state: "Kerala", district: "Thrissur" });
    setIsDrawerOpen(true);
  };

  const openDetailEditDrawer = () => {
    if (!detailRow) return;
    setDrawerMode("detail-edit");
    setProjectDetailEditForm(defaultProjectDetailEditForm(detailRow.customer));
    setIsDrawerOpen(true);
  };

  const onSaveDrawer = () => {
    if (drawerMode === "create") {
      const newLead: LeadRow = {
        id: "#1023",
        customer: form.name || "New Customer",
        vendor: form.vendor,
        source: form.leadSource || "Vendor App",
        address: form.address || "1st cross, HSR Layout, Bangalore - 560098",
        milestone: "New Lead",
        amountPaid: "-",
        dueAmount: "-",
        assignedTo: form.assignedTo,
      };
      setLeads((prev) => {
        const updated = [...prev, newLead];
        setDetailContext({ type: "lead", row: updated[updated.length - 1], index: updated.length - 1 });
        setActiveTopTab("Leads");
        return updated;
      });
      setActiveLeadMilestoneTab("Lead Added");
      setActiveDetailTab("Milestone");
      setIsDrawerOpen(false);
      return;
    }

    if (drawerMode === "edit" && selectedRowIndex !== null) {
      setProjects((prev) => prev.map((item, idx) => idx === selectedRowIndex ? { ...item, customer: form.name, vendor: form.vendor, assignedTo: form.assignedTo } : item));
    }

    setIsDrawerOpen(false);
  };

  const pageTitle = useMemo(() => {
    if (drawerMode === "create") return "Create New Lead";
    if (drawerMode === "edit") return "Edit Lead";
    return "Create New Lead";
  }, [drawerMode]);

  const isLeadDetail = detailContext?.type === "lead";
  const detailRow = detailContext?.row ?? null;
  const leadDetailRow = detailContext?.type === "lead" ? detailContext.row : null;

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Leads & Projects" />

        <main className="min-w-0 flex-1">
          <header className="flex h-12 items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-4 lg:px-6">
            {detailRow ? (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setDetailContext(null)}
                  className="inline-flex h-6 w-6 items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                Project Details
              </div>
            ) : (
              <div className="text-base font-semibold">Admin</div>
            )}
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-48 items-center gap-2 rounded-sm border border-[#d8dee8] bg-white px-2.5 text-sm text-[#8f97a6] md:flex"><Search className="h-4 w-4" />Search</div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 rounded px-1 py-0.5"
                >
                  <div className="h-6 w-6 rounded-full bg-[#d89d77]" />
                  <span className="text-sm text-[#4c5564]">Rajesh B</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
                </button>
                {isUserMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[140px] rounded border border-[#d8dee8] bg-white p-1 shadow-[0_8px_20px_rgba(17,24,39,0.12)]">
                    <Link
                      href="/logout"
                      className="block rounded px-3 py-2 text-sm font-medium text-[#c03232] hover:bg-[#f7f8fb]"
                    >
                      Logout
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="p-3 lg:p-4">
            {detailRow ? (
              <section className="rounded-md border border-[#d8dde5] bg-[#f8f9fb] p-2.5">
                <div className="rounded-md border border-[#e2e7ef] bg-white p-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[24px] font-semibold leading-none text-[#111827]">#123123</h2>
                      <p className="mt-1.5 text-[12px] text-[#4b5563]">
                        Customer name : <span className="font-semibold">{detailRow.customer}</span>
                        {"   "}Project type : <span className="font-semibold">Residency</span>
                        {"   "}Vendor : <span className="font-semibold">ABC Solutions</span>
                      </p>
                    </div>
                    <div className="w-[160px]">
                      <div className="text-[11px] text-[#6b7280]">Assigned to:</div>
                      <button className="mt-1 inline-flex h-8 w-full items-center justify-between rounded border border-[#d4dae4] bg-[#f2f5fb] px-2 text-[12px] font-semibold text-[#1f2937]">
                        Athul
                        <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-5 gap-x-4 gap-y-2 border-t border-[#e6eaf0] pt-2.5 text-xs">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#f59e0b]" />Project Value</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#111827]">Rs 5,12,000</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#f59e0b]" />Amount Paid</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#16a34a]">Rs 5,12,000</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#f59e0b]" />Due Amount</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#ef4444]">Rs 5,12,000</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#22c55e]" />Payment Type</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#111827]">Loan</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><NotebookText className="h-3.5 w-3.5 text-[#f97316]" />Current Milestone</div>
                      <button className="mt-0.5 inline-flex h-8 w-full items-center justify-between rounded border border-[#d4dae4] bg-[#f2f5fb] px-2 text-[12px] font-semibold">
                        {isLeadDetail ? (leadDetailRow?.milestone === "New Lead" ? "Lead Added" : "Site Survey") : "Handover"}
                        <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
                      </button>
                    </div>
                    {isLeadDetail && (
                      <>
                        <div>
                          <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#22c55e]" />Amount Paid to Vendor</div>
                          <div className="mt-0.5 text-sm font-semibold text-[#16a34a]">Rs 3,12,000</div>
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1 text-[#6b7280]"><WalletCards className="h-3.5 w-3.5 text-[#ef4444]" />Due Amount to Vendor</div>
                          <div className="mt-0.5 text-sm font-semibold text-[#ef4444]">Rs 2,12,000</div>
                        </div>
                      </>
                    )}
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><CalendarDays className="h-3.5 w-3.5 text-[#22a447]" />Start Date</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#111827]">12-10-2025</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><CalendarDays className="h-3.5 w-3.5 text-[#22a447]" />Expected Installation Date</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#111827]">12-10-2025</div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><Phone className="h-3.5 w-3.5 text-[#f59e0b]" />Customer Contact</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#111827]">+9129132132</div>
                    </div>
                    <div className="col-span-2">
                      <div className="inline-flex items-center gap-1 text-[#6b7280]"><MapPin className="h-3.5 w-3.5 text-[#f97316]" />Address</div>
                      <div className="mt-0.5 truncate text-sm font-semibold text-[#111827]">1st cross, HSR Layout, Bangalore - 560098</div>
                    </div>
                  </div>

                  {!isLeadDetail && (
                    <div className="mt-2.5 grid grid-cols-3 gap-4 border-t border-[#e6eaf0] pt-2.5">
                    <div className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-[#4f63ff]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#6b7280]">Overall Progress</div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded bg-[#dbe3ff]"><div className="h-1.5 w-[60%] rounded bg-[#5b70ff]" /></div>
                          <span className="text-xs font-semibold">60%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-[#3153d8]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#6b7280]">Payment Progress</div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded bg-[#dbe3ff]"><div className="h-1.5 w-[40%] rounded bg-[#3153d8]" /></div>
                          <span className="text-xs font-semibold">40%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-[#4b63ff]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] text-[#6b7280]">Milestone</div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex flex-1 items-center gap-1">
                            {Array.from({ length: 9 }).map((_, idx) => (
                              <span key={`milestone-dot-${idx}`} className={`h-1.5 w-3 rounded-full ${idx < 7 ? "bg-[#4b63ff]" : "bg-[#dbe3ff]"}`} />
                            ))}
                          </div>
                          <span className="text-xs font-semibold">9/7</span>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}

                  <div className="mt-3 flex h-8 w-[340px] rounded-sm bg-[#eef1f6] p-0.5 text-[12px] font-medium">
                    {(isLeadDetail ? (["Milestone", "Remarks"] as const) : (["Milestone", "Payments History", "Remarks"] as const)).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveDetailTab(tab)}
                        className={`flex-1 rounded-sm ${activeDetailTab === tab ? "bg-[#131740] text-white" : "text-[#3c4655]"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeDetailTab === "Milestone" && (
                    <>
                      <div className="mt-2.5 flex items-center gap-1 overflow-x-auto rounded border border-[#d8dde5] bg-[#f7faf8] px-1.5 py-1 text-[10px] text-[#374151]">
                        {(isLeadDetail ? leadMilestoneTabs : milestoneTabs).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              if (isLeadDetail) setActiveLeadMilestoneTab(tab as LeadMilestoneTab);
                              else setActiveMilestoneTab(tab as MilestoneTab);
                            }}
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 ${
                              (isLeadDetail ? activeLeadMilestoneTab === tab : activeMilestoneTab === tab)
                                ? "border-[#1fb84f] bg-[#e8f9ee] text-[#0f8e49]"
                                : "border-[#e1e5ec] bg-white text-[#4b5563]"
                            }`}
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-2 rounded border border-[#d5dbe6] bg-[#eef2f6] px-2.5 py-1.5 text-xs text-[#4b5563]">
                        <Circle className="h-3 w-3" />
                        Completed on 28-07-2025
                      </div>

                      <div className="mt-2.5 rounded border border-[#d8dde5] bg-white p-2.5">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>Subtask</span>
                          <span className="text-[#15803d]">
                            {isLeadDetail ? leadMilestoneDataByTab[activeLeadMilestoneTab].completedText : milestoneDataByTab[activeMilestoneTab].completedText}
                          </span>
                        </div>
                        {(isLeadDetail ? leadMilestoneDataByTab[activeLeadMilestoneTab].subtasks : milestoneDataByTab[activeMilestoneTab].subtasks).map((subtask, index) => (
                          <div key={`${subtask.title}-${index}`} className="mt-2 rounded border border-[#d8dde5] bg-[#fcfdfd] p-2.5 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#22c55e]" />
                                <span>
                                  <span className="block text-[13px] font-semibold leading-tight">
                                    {subtask.title}
                                    {subtask.tag && <span className="ml-1 rounded bg-[#e9fbec] px-1 py-0.5 text-[9px] font-semibold text-[#0f8e49]">{subtask.tag}</span>}
                                  </span>
                                  <span className="block text-[10px] text-[#8b95a7]">Sub task</span>
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-[#4b5563]">
                                <CalendarDays className="h-3 w-3" />
                                {subtask.date}
                              </span>
                            </div>
                            <div
                              className="mt-1 grid gap-1.5 text-[11px]"
                              style={{ gridTemplateColumns: `repeat(${Math.min(subtask.metrics.length, 4)}, minmax(0, 1fr))` }}
                            >
                              {subtask.metrics.slice(0, 4).map((metric) => (
                                <div key={`${subtask.title}-${metric.label}`}>
                                  <div className={`font-semibold leading-tight ${metric.valueClass ?? "text-[#111827]"}`}>{metric.value}</div>
                                  <div className="text-[#6b7280]">{metric.label}</div>
                                </div>
                              ))}
                            </div>
                            {subtask.metrics.length > 4 && (
                              <div className="mt-1.5 grid gap-1.5 text-[11px]" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                                {subtask.metrics.slice(4).map((metric) => (
                                  <div key={`${subtask.title}-more-${metric.label}`}>
                                    <div className={`font-semibold leading-tight ${metric.valueClass ?? "text-[#111827]"}`}>{metric.value}</div>
                                    <div className="text-[#6b7280]">{metric.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button type="button" onClick={openDetailEditDrawer} className="h-9 w-[165px] rounded bg-[#131740] text-sm font-semibold text-white">Edit</button>
                      </div>
                    </>
                  )}

                  {!isLeadDetail && activeDetailTab === "Payments History" && (
                    <div className="mt-2.5 rounded border border-[#d8dde5] bg-white p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-8 w-[240px] items-center gap-2 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9aa2b1]">
                          <Search className="h-3.5 w-3.5" />
                          Search
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div ref={paymentFilterRef} className="relative">
                            <button
                              ref={paymentFilterButtonRef}
                              type="button"
                              onClick={() => {
                                setIsPaymentFilterOpen((prev) => {
                                  const next = !prev;
                                  if (!next) setActivePaymentFilterPanel(null);
                                  return next;
                                });
                              }}
                              className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#7b8595]"
                            >
                              <Filter className="h-3.5 w-3.5" />
                              Filter
                            </button>

                            {isPaymentFilterOpen && (
                              <>
                                <div
                                  ref={paymentFilterPanelRef}
                                  className="fixed z-40 w-[178px] overflow-hidden rounded-[16px] border border-[#d6d9e0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
                                  style={{ top: paymentFilterPos.top, left: paymentFilterPos.left }}
                                >
                                  <div className="bg-[#eef1f5] px-3 py-2 text-[12px] font-semibold text-[#2d3443]">Filter by</div>
                                  <button className="flex h-11 w-full items-center justify-between border-t border-[#eceff4] px-3 text-left text-[11px] text-[#5e6675]">
                                    Date Range
                                    <CalendarDays className="h-3.5 w-3.5 text-[#6b7280]" />
                                  </button>
                                  {(["Vendor", "Payment Type", "Milestone", "Customer"] as const).map((item) => (
                                    <button
                                      key={item}
                                      ref={item === "Vendor" ? paymentVendorButtonRef : undefined}
                                      type="button"
                                      onClick={() => setActivePaymentFilterPanel(item)}
                                      className="flex h-11 w-full items-center justify-between border-t border-[#eceff4] px-3 text-left text-[11px] text-[#5e6675] hover:bg-[#f8fafc]"
                                    >
                                      {item}
                                      <ChevronRight className="h-3.5 w-3.5 text-[#6b7280]" />
                                    </button>
                                  ))}
                                </div>

                                {activePaymentFilterPanel === "Vendor" && (
                                  <div
                                    ref={paymentVendorPanelRef}
                                    className="fixed z-50 w-[188px] overflow-hidden rounded-[22px] border border-[#d6d9e0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
                                    style={{ top: paymentVendorPos.top, left: paymentVendorPos.left }}
                                  >
                                    <div className="bg-[#eef1f5] px-4 py-2 text-[13px] font-semibold capitalize text-[#2d3443]">vendor</div>
                                    <div className="flex h-11 items-center gap-2 border-t border-[#eceff4] px-4 text-[#5e6675]">
                                      <Search className="h-5 w-5" />
                                      <input
                                        value={vendorSearch}
                                        onChange={(event) => setVendorSearch(event.target.value)}
                                        placeholder="Search"
                                        className="h-full w-full bg-transparent text-[11px] outline-none placeholder:text-[#7f8898]"
                                      />
                                    </div>
                                    {filteredVendors.map((vendor) => (
                                      <label key={vendor} className="flex h-11 cursor-pointer items-center gap-3 border-t border-[#eceff4] px-4 text-[11px] text-[#5e6675]">
                                        <input
                                          type="checkbox"
                                          checked={selectedVendors.includes(vendor)}
                                          onChange={() => toggleVendor(vendor)}
                                          className="h-4 w-4 rounded border-[#a3acbb]"
                                        />
                                        {vendor}
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9ca3af]">Milestone<ChevronDown className="h-3.5 w-3.5" /></button>
                          <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9ca3af]">Customise<ChevronDown className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>

                      <div className="mt-2 overflow-auto rounded border border-[#e4e7ec]">
                        <table className="w-full min-w-[930px] table-fixed border-separate border-spacing-0 text-left">
                          <colgroup>
                            <col className="w-[38px]" />
                            <col className="w-[105px]" />
                            <col className="w-[130px]" />
                            <col className="w-[120px]" />
                            <col className="w-[130px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                          </colgroup>
                          <thead>
                            <tr className="h-9 bg-[#d8e2df] text-[11px] font-semibold text-[#1f2937]">
                              <th className="rounded-l-md border-b border-[#e4e7ec] px-2"><input type="checkbox" className="h-3.5 w-3.5 rounded border-[#c5ccd8]" /></th>
                              <th className="border-b border-[#e4e7ec] px-2">Project ID</th>
                              <th className="border-b border-[#e4e7ec] px-2">Transaction ID</th>
                              <th className="border-b border-[#e4e7ec] px-2">Payment Type</th>
                              <th className="border-b border-[#e4e7ec] px-2">Payment By</th>
                              <th className="border-b border-[#e4e7ec] px-2">Milstone</th>
                              <th className="rounded-r-md border-b border-[#e4e7ec] px-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentHistoryRows.map((row, index) => (
                              <tr key={`${row.transactionId}-${index}`} className="h-[44px] text-[11px] text-[#111827]">
                                <td className="border-b border-[#e4e7ec] px-2"><input type="checkbox" className="h-3.5 w-3.5 rounded border-[#c5ccd8]" /></td>
                                <td className="border-b border-[#e4e7ec] px-2">{row.projectId}</td>
                                <td className="border-b border-[#e4e7ec] px-2">{row.transactionId}</td>
                                <td className="border-b border-[#e4e7ec] px-2">{row.paymentType}</td>
                                <td className="border-b border-[#e4e7ec] px-2">
                                  <div className="font-medium">{row.paymentByName}</div>
                                  <div className="text-[10px] text-[#6b7280]">{row.paymentByRole}</div>
                                </td>
                                <td className="border-b border-[#e4e7ec] px-2"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${stageClass(row.milestone)}`}>{row.milestone}</span></td>
                                <td className="border-b border-[#e4e7ec] px-2 font-semibold">{row.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#111827]">
                        <div className="flex items-center gap-2">
                          <span>Page 1 of 10</span>
                          <button className="inline-flex h-7 items-center rounded border border-[#d1d5db] px-2.5 text-[11px] text-[#4b5563]">Show 10 rows<ChevronDown className="ml-1.5 h-3.5 w-3.5" /></button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="h-7 rounded border border-[#d1d5db] px-2.5 text-[10px] text-[#6b7280]">Previous</button>
                          {[1, 2, 4, 5, 6, 7].map((page) => (
                            <button key={page} className={`h-7 min-w-7 rounded border px-2 text-[10px] ${page === 1 ? "border-[#131740] bg-[#131740] text-white" : "border-[#d1d5db] text-[#6b7280]"}`}>{page}</button>
                          ))}
                          <button className="h-7 rounded border border-[#d1d5db] px-2.5 text-[10px] text-[#6b7280]">Next</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDetailTab === "Remarks" && (
                    <div className="mt-2.5 rounded border border-[#d8dde5] bg-white p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex h-8 w-[240px] items-center gap-2 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9aa2b1]">
                          <Search className="h-3.5 w-3.5" />
                          Search
                        </div>
                        <div ref={remarksSortRef} className="relative">
                          <button
                            ref={remarksSortButtonRef}
                            type="button"
                            onClick={() => {
                              setIsRemarksSortOpen((prev) => {
                                const next = !prev;
                                if (!next) setActiveRemarksSortPanel(null);
                                return next;
                              });
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#7b8595]"
                          >
                            <Filter className="h-3.5 w-3.5" />
                            Filter
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>

                          {isRemarksSortOpen && (
                            <>
                              <div
                                ref={remarksSortPanelRef}
                                className="fixed z-40 w-[178px] overflow-hidden rounded-[16px] border border-[#d6d9e0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
                                style={{ top: remarksSortPos.top, left: remarksSortPos.left }}
                              >
                                <div className="bg-[#eef1f5] px-3 py-2 text-[12px] font-semibold text-[#2d3443]">Sort by</div>
                                <button className="flex h-11 w-full items-center justify-between border-t border-[#eceff4] px-3 text-left text-[11px] text-[#5e6675]">
                                  Date Range
                                  <CalendarDays className="h-3.5 w-3.5 text-[#6b7280]" />
                                </button>
                                <button
                                  ref={remarksTeamButtonRef}
                                  type="button"
                                  onClick={() => setActiveRemarksSortPanel("Team")}
                                  className="flex h-11 w-full items-center justify-between border-t border-[#eceff4] px-3 text-left text-[11px] text-[#5e6675] hover:bg-[#f8fafc]"
                                >
                                  Team
                                  <ChevronRight className="h-3.5 w-3.5 text-[#6b7280]" />
                                </button>
                                {remarksStatusFlags.map((flag) => (
                                  <label key={flag} className="flex h-11 cursor-pointer items-center gap-3 border-t border-[#eceff4] px-3 text-[11px] text-[#5e6675]">
                                    <input
                                      type="checkbox"
                                      checked={selectedRemarkFlags.includes(flag)}
                                      onChange={() => toggleRemarkFlag(flag)}
                                      className="h-4 w-4 rounded border-[#a3acbb]"
                                    />
                                    {flag}
                                  </label>
                                ))}
                              </div>

                              {activeRemarksSortPanel === "Team" && (
                                <div
                                  ref={remarksTeamPanelRef}
                                  className="fixed z-50 w-[188px] overflow-hidden rounded-[22px] border border-[#d6d9e0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
                                  style={{ top: remarksTeamPos.top, left: remarksTeamPos.left }}
                                >
                                  <div className="bg-[#eef1f5] px-4 py-2 text-[13px] font-semibold text-[#2d3443]">Team</div>
                                  {remarksTeamOptions.map((team, index) => (
                                    <label key={`${team}-${index}`} className="flex h-11 cursor-pointer items-center gap-3 border-t border-[#eceff4] px-4 text-[11px] text-[#5e6675]">
                                      <input
                                        type="checkbox"
                                        checked={selectedRemarksTeams.includes(team)}
                                        onChange={() => toggleRemarksTeam(team)}
                                        className="h-4 w-4 rounded border-[#a3acbb]"
                                      />
                                      <span className={team === "Admin" ? "rounded border border-dashed border-[#1d9bf0] px-1 py-0.5 text-[#3b4453]" : ""}>{team}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="text-[20px] font-semibold text-[#1f2937]">Add your Remarks here</div>
                        <textarea
                          placeholder="Add your Remarks"
                          className="mt-2 h-[84px] w-full resize-none rounded border border-[#d8dde5] bg-[#f3f5fc] p-2.5 text-[11px] text-[#111827] outline-none placeholder:text-[#9aa2b1]"
                        />
                      </div>

                      <div className="mt-2.5 space-y-2">
                        {remarksItems.map((item) => (
                          <div key={item.id} className="rounded border border-[#d8dde5] bg-white px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#d8ddff,#8a93f0)] text-[10px] font-semibold text-[#20224f]">A</div>
                              <span className="text-[11px] font-semibold text-[#111827]">{item.name}</span>
                              <span className="rounded bg-[#e8f0ff] px-1.5 py-0.5 text-[9px] font-semibold text-[#2b4d87]">{item.team}</span>
                              <span className="text-[10px] font-semibold text-[#4b5563]">{item.date}</span>
                            </div>
                            <div className="pl-7 pt-1 text-[11px] text-[#111827]">{item.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button type="button" onClick={openDetailEditDrawer} className="h-9 w-[165px] rounded bg-[#131740] text-sm font-semibold text-white">Edit</button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-[32px] font-medium leading-none text-[#111827]">Leads and Projects</h1>
                    <p className="mt-1 text-sm text-[#7a8494]">Manage your Lead and Projects here</p>
                  </div>
                  <button type="button" onClick={openCreateDrawer} className="rounded bg-[#131740] px-4 py-2 text-sm font-semibold text-white">Create New Lead</button>
                </div>
                <div className="mt-4 flex h-9 w-[320px] rounded bg-[#eaedf5] p-1 text-sm font-semibold">
                  {(["Projects", "Leads"] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setActiveTopTab(tab)} className={`flex-1 rounded ${activeTopTab === tab ? "bg-[#131740] text-white" : "text-[#3c4655]"}`}>{tab}</button>
                  ))}
                </div>
                <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-4">
                  {activeTopTab === "Projects" ? (
                    <>
                      <StatCard value={String(projectStats.total)} title="Total Projects" note="From live project list" />
                      <StatCard value={String(projectStats.completed)} title="Lifetime Completed Projects" note="Derived from project status" />
                      <StatCard value={String(projectStats.delayed)} title="Delayed Projects" note="Delayed/overdue statuses" />
                      <StatCard value={`${projectStats.healthPercent}%`} title="Project Delivery Health" note="On-time vs delayed" />
                    </>
                  ) : (
                    <>
                      <StatCard value={String(leadStats.total)} title="Leads(Lifetime)" note="From live lead list" />
                      <StatCard value={String(leadStats.newThisMonth)} title="New leads this Month" note="Based on lead created date" />
                      <StatCard value={`${leadStats.conversionRate}%`} title="Conversion rate" note="Converted vs total leads" />
                      <StatCard value={String(leadStats.lost)} title="Overall Lead Lost" note="Lost/declined leads" danger />
                    </>
                  )}
                </section>
                <section className="mt-4 rounded-md border border-[#d8dde5] bg-white">
                  <div className="flex items-center justify-between gap-2 border-b border-[#e4e7ec] p-3">
                  <div className="flex h-9 w-[260px] items-center gap-2 rounded border border-[#d8dde5] px-3 text-[12px] text-[#9aa2b1]">
                    <Search className="h-4 w-4" />
                    <input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search"
                      className="h-full w-full bg-transparent text-[12px] text-[#111827] outline-none placeholder:text-[#9aa2b1]"
                    />
                  </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#6b7280]"><Filter className="h-4 w-4" />Filter</button>
                      <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#9ca3af]">Milestone<ChevronDown className="h-3.5 w-3.5" /></button>
                      <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#9ca3af]">Customise<ChevronDown className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="overflow-x-auto">
                      {activeTopTab === "Projects" ? (
                        <table className="w-[1600px] table-fixed border-separate border-spacing-0 text-left">
                          <colgroup><col className="w-[42px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[120px]" /><col className="w-[110px]" /><col className="w-[100px]" /><col className="w-[100px]" /><col className="w-[110px]" /><col className="w-[130px]" /><col className="w-[120px]" /><col className="w-[100px]" /></colgroup>
                          <thead><tr className="sticky top-0 z-10 h-[46px] bg-[#d8e2df] text-[12px] font-semibold text-[#1f2937]"><th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" /></th><th className="border border-[#e4e7ec] border-r-0 px-2"><div className="flex items-center gap-1">Project ID <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" /></div></th><th className="border border-[#e4e7ec] border-r-0 px-2">Customer</th><th className="border border-[#e4e7ec] border-r-0 px-2">Vendor</th><th className="border border-[#e4e7ec] border-r-0 px-2">Stages</th><th className="border border-[#e4e7ec] border-r-0 px-2">Project values</th><th className="border border-[#e4e7ec] border-r-0 px-2">Amount Paid</th><th className="border border-[#e4e7ec] border-r-0 px-2">Due Amount</th><th className="border border-[#e4e7ec] border-r-0 px-2">Payment type</th><th className="border border-[#e4e7ec] border-r-0 px-2">Payment Status</th><th className="border border-[#e4e7ec] border-r-0 px-2">Assigned to</th><th className="rounded-r-md border border-[#e4e7ec] px-2">Action</th></tr></thead>
                          <tbody>{projects.map((row, index) => (<tr key={`${row.id}-${index}`} onClick={() => openViewDrawer(row, index)} className="h-[56px] cursor-pointer text-[12px] text-[#111827] hover:bg-[#f8fbff]"><td className="border border-t-0 border-[#e4e7ec] px-2"><input type="checkbox" onClick={(event) => event.stopPropagation()} className="h-4 w-4 rounded border-[#c5ccd8]" /></td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.id}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.customer}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.vendor}</td><td className="border border-t-0 border-[#e4e7ec] px-2"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${stageClass(row.stage)}`}>{row.stage}</span></td><td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.projectValue}</td><td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.amountPaid}</td><td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.dueAmount}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.paymentType}</td><td className="border border-t-0 border-[#e4e7ec] px-2"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${paymentClass(row.paymentStatus)}`}>{row.paymentStatus}</span></td><td className="border border-t-0 border-[#e4e7ec] px-2"><div className="inline-flex items-center gap-2 rounded border border-[#d6dbe7] bg-[#f4f6fb] px-2 py-1">{row.assignedTo}<ChevronDown className="h-3.5 w-3.5 text-[#798398]" /></div></td><td className="border border-t-0 border-[#e4e7ec] px-2"><div className="flex items-center gap-1"><button type="button" onClick={(e) => e.stopPropagation()} className="inline-flex h-6 w-6 items-center justify-center"><MessageSquareText className="h-3.5 w-3.5 text-[#9aa2b1]" /></button><button type="button" onClick={(event) => { event.stopPropagation(); openEditDrawer(row, index); }} className="inline-flex h-6 w-6 items-center justify-center"><Pencil className="h-3.5 w-3.5 text-[#111827]" /></button><button type="button" onClick={(e) => e.stopPropagation()} className="inline-flex h-6 w-6 items-center justify-center"><MoreVertical className="h-3.5 w-3.5 text-[#111827]" /></button></div></td></tr>))}</tbody>
                        </table>
                      ) : (
                        <table className="w-[1300px] table-fixed border-separate border-spacing-0 text-left">
                          <colgroup><col className="w-[42px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[180px]" /><col className="w-[100px]" /><col className="w-[100px]" /><col className="w-[100px]" /></colgroup>
                          <thead><tr className="sticky top-0 z-10 h-[46px] bg-[#d8e2df] text-[12px] font-semibold text-[#1f2937]"><th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" /></th><th className="border border-[#e4e7ec] border-r-0 px-2"><div className="flex items-center gap-1">lead ID <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" /></div></th><th className="border border-[#e4e7ec] border-r-0 px-2">Customer</th><th className="border border-[#e4e7ec] border-r-0 px-2">Vendor</th><th className="border border-[#e4e7ec] border-r-0 px-2">Source</th><th className="border border-[#e4e7ec] border-r-0 px-2">Address</th><th className="border border-[#e4e7ec] border-r-0 px-2">Milestone</th><th className="border border-[#e4e7ec] border-r-0 px-2">Amount Paid</th><th className="rounded-r-md border border-[#e4e7ec] px-2">Due Amount</th></tr></thead>
                          <tbody>{leads.map((row, index) => (<tr key={`${row.id}-${index}`} onClick={() => openLeadDetail(row, index)} className="h-[56px] cursor-pointer text-[12px] text-[#111827] hover:bg-[#f8fbff]"><td className="border border-t-0 border-[#e4e7ec] px-2"><input type="checkbox" onClick={(event) => event.stopPropagation()} className="h-4 w-4 rounded border-[#c5ccd8]" /></td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.id}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.customer}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.vendor}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.source}</td><td className="border border-t-0 border-[#e4e7ec] px-2">{row.address}</td><td className="border border-t-0 border-[#e4e7ec] px-2"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${stageClass(row.milestone)}`}>{row.milestone}</span></td><td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.amountPaid}</td><td className="border border-t-0 border-[#e4e7ec] px-2 font-semibold">{row.dueAmount}</td></tr>))}</tbody>
                        </table>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]"><div>Page 1 of 10</div><button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">Show 10 rows<ChevronDown className="ml-2 h-3.5 w-3.5" /></button></div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/45" onClick={() => setIsDrawerOpen(false)}>
          <aside className={`absolute right-0 top-0 h-full overflow-y-auto border-l border-[#d9dee7] bg-white p-4 ${drawerMode === "detail-edit" ? "w-[520px]" : "w-[560px]"}`} onClick={(event) => event.stopPropagation()}>
            {drawerMode === "detail-edit" ? (
              <>
                <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3">
                  <div>
                    <h2 className="text-[24px] font-semibold leading-none text-[#111827]">#123123</h2>
                    <p className="mt-1 text-[11px] text-[#4b5563]">Customer name : <span className="font-semibold">{detailRow?.customer ?? "Murugan"}</span></p>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"><X className="h-4 w-4" /></button>
                </div>

                <div className="mt-3">
                  <h3 className="text-[24px] font-semibold text-[#111827]">project Details</h3>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { key: "projectType", label: "Project Type" },
                      { key: "customerName", label: "Customer Name*" },
                      { key: "customerContact", label: "Customer Contact*" },
                      { key: "customerEmail", label: "Customer Email Id*" },
                      { key: "vendorAssigned", label: "Vendor Assigned*" },
                      { key: "vendorPhone", label: "Vendor Phone*" },
                      { key: "vendorEmail", label: "Vendor Email Id*" },
                      { key: "capacityRequirement", label: "Capacity Requirement" },
                      { key: "serviceConnectionNumber", label: "Service Connection Number" },
                      { key: "electricityBill", label: "Electricity Bill" },
                    ].map((field) => (
                      <div key={field.key}>
                        <div className="text-xs font-semibold text-[#374151]">{field.label}</div>
                        <input
                          value={(projectDetailEditForm as Record<string, string>)[field.key]}
                          onChange={(e) => setProjectDetailEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm"
                        />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <div className="text-xs font-semibold text-[#374151]">Address*</div>
                      <input
                        value={projectDetailEditForm.address}
                        onChange={(e) => setProjectDetailEditForm((prev) => ({ ...prev, address: e.target.value }))}
                        className="mt-1 h-9 w-full rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="h-10 rounded border border-[#131740] text-sm font-semibold text-[#131740]">Cancel</button>
                  <button type="button" onClick={onSaveDrawer} className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">Save</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3"><h2 className="text-[24px] font-semibold text-[#111827]">{pageTitle}</h2><button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"><X className="h-4 w-4" /></button></div>

                <div className="mt-4">
                  <h3 className="text-[24px] font-semibold text-[#111827]">Lead Details</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { key: "leadId", label: "Lead ID" },
                      { key: "leadSource", label: "Lead Source*" },
                      { key: "type", label: "Type*" },
                      { key: "expectedInstallationDate", label: "Expected Installation Date" },
                      { key: "name", label: "Name*" },
                      { key: "address", label: "Address*" },
                      { key: "vendor", label: "Vendor *" },
                      { key: "assignedTo", label: "Assigned to*" },
                      { key: "phone", label: "Phone*" },
                      { key: "email", label: "Email*" },
                      { key: "state", label: "State*" },
                      { key: "district", label: "District*" },
                    ].map((field) => (
                      <div key={field.key}>
                        <div className="text-xs font-semibold text-[#374151]">{field.label}</div>
                        {drawerMode === "view" ? (
                          <div className="mt-1 h-9 rounded border border-[#d4dae4] bg-[#f7f8fa] px-2 py-2 text-sm text-[#374151]">{(form as Record<string, string>)[field.key]}</div>
                        ) : (
                          <input value={(form as Record<string, string>)[field.key]} onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))} className="mt-1 h-9 w-full rounded border border-[#d4dae4] px-2 text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3"><button type="button" onClick={() => setIsDrawerOpen(false)} className="h-10 rounded border border-[#d1d5db] text-sm font-semibold text-[#4b5563]">Cancel</button><button type="button" onClick={onSaveDrawer} className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">Save</button></div>
              </>
            )}
          </aside>
        </div>
      )}

    </div>
  );
}

