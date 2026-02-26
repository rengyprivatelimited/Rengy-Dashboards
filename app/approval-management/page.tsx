"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  ChevronDown,
  Download,
  Eye,
  Folder,
  Filter,
  List,
  Mail,
  MoreVertical,
  Pencil,
  Search,
  User,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type ApprovalRow = {
  ticketId: string;
  source: string;
  name: string;
  email: string;
  category: string;
  time: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  attachments: string;
};

type ApprovalTab = "Installation Request" | "Onboarding" | "AMC Request";
type DrawerMode = "view" | "edit";
type InstallationRow = {
  ticketId: string;
  projectId: string;
  customer: string;
  raisedBy: string;
  dateCreated: string;
  attachments: string;
  status: "Not Approved" | "Approved" | "Pending Approval";
};
type AmcRow = {
  projectId: string;
  customer: string;
  address: string;
  customerContact: string;
  customerEmail: string;
  serviceRequested: string;
};

const installationRows: InstallationRow[] = mockData.approvalManagement.installationRows as InstallationRow[];
const onboardingRows: ApprovalRow[] = mockData.approvalManagement.onboardingRows as ApprovalRow[];
const amcRows: AmcRow[] = mockData.approvalManagement.amcRows as AmcRow[];

function StatCard({
  value,
  title,
  note,
  emphasized,
}: {
  value: string;
  title: string;
  note: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-4 py-3 ${
        emphasized
          ? "border-[#f4a4a4] bg-[#fff6f6]"
          : "border-[#cedbe8] bg-[#f8fbff]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[24px] font-semibold leading-[1] tracking-[-0.02em] text-[#111827]">
            {value}
          </div>
          <div className="mt-1.5 text-[20px] font-medium leading-[1] text-[#111827]">{title}</div>
        </div>
        <div className="mt-2 h-9 w-16 rounded-r-full border-b-2 border-r-2 border-[#38ce91]" />
      </div>
      <p className={`mt-1.5 text-[13px] ${emphasized ? "text-[#ef4444]" : "text-[#8e95a3]"}`}>{note}</p>
    </div>
  );
}

export default function ApprovalManagementPage() {
  const [activeTab, setActiveTab] = useState<ApprovalTab>("Onboarding");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRow | null>(null);
  const [selectedInstallation, setSelectedInstallation] = useState<InstallationRow | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const tabs = useMemo(
    () => [
      { label: "Installation Request" as const, count: String(installationRows.length).padStart(2, "0") },
      { label: "Onboarding" as const, count: String(onboardingRows.length).padStart(2, "0") },
      { label: "AMC Request" as const, count: String(amcRows.length).padStart(2, "0") },
    ],
    [],
  );

  const approvalRows = activeTab === "Onboarding" ? onboardingRows : [];
  const openViewDrawer = (row: ApprovalRow) => {
    setDrawerMode("view");
    setSelectedRequest(row);
  };

  const openEditDrawer = (row: ApprovalRow) => {
    setDrawerMode("edit");
    setSelectedRequest(row);
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isFilterOpen && !filterDropdownRef.current?.contains(target)) {
        setIsFilterOpen(false);
      }
      if (isUserMenuOpen && !userMenuRef.current?.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isFilterOpen, isUserMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen || !userMenuButtonRef.current) return;
    const rect = userMenuButtonRef.current.getBoundingClientRect();
    setUserMenuPosition({
      top: rect.bottom + 8,
      left: rect.right - 140,
    });
  }, [isUserMenuOpen]);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
          <RootSidebar activeLabel="Approval Management" />

          <main className="min-w-0 flex-1">
            <header className="flex h-12 items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-4 lg:px-6">
              <div className="text-base font-semibold text-[#1f2937]">Admin</div>
              <div className="flex items-center gap-4">
                <div className="hidden h-9 w-48 items-center gap-2 rounded-sm border border-[#d8dee8] bg-white px-2.5 text-sm text-[#8f97a6] md:flex">
                  <Search className="h-4 w-4" />
                  Search
                </div>
                <Bell className="h-4 w-4 text-[#4a5160]" />
                <div ref={userMenuRef} className="relative">
                  <button
                    ref={userMenuButtonRef}
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1 rounded px-1 py-0.5"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#d89d77]" />
                    <span className="text-sm text-[#4c5564]">Rajesh B</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
                  </button>
                  {isUserMenuOpen && userMenuPosition ? (
                    <div
                      className="fixed z-[100] w-[140px] rounded border border-[#d8dee8] bg-white p-1 shadow-[0_8px_20px_rgba(17,24,39,0.12)]"
                      style={{ top: userMenuPosition.top, left: userMenuPosition.left }}
                    >
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
            <h1 className="text-[32px] font-medium leading-none text-[#111827]">Approval Management</h1>

            <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-4">
              <StatCard value="132" title="Total Requests" note="+18 vs last 30 days" />
              <StatCard
                value="20"
                title="Pending Approvals"
                note="5 Loan requests rejected by 8 days"
                emphasized
              />
              <StatCard value="2.4 days" title="Avg Approve time" note="Avg Delays reduced by 8%" />
              <StatCard value="87" title="Approved" note="Improved by 12%" />
            </section>

            <section className="mt-4 rounded-md border border-[#d8dde5] bg-white">
              <div className="flex h-[42px] items-center border-b border-[#e4e7ec] bg-[#f6f7f9] text-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex h-full items-center gap-3 border-r border-[#e3e6ec] px-4 ${
                      activeTab === tab.label ? "border-b-[3px] border-b-[#2ec5b6] bg-white" : ""
                    }`}
                  >
                    <span className="text-[13px] text-[#4b5563]">{tab.label}</span>
                    <span className="rounded bg-[#ef4444] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 border-b border-[#e4e7ec] p-3">
                <div className="flex h-9 w-[260px] items-center gap-2 rounded border border-[#d8dde5] px-3 text-[12px] text-[#9aa2b1]">
                  <Search className="h-4 w-4" />
                  Search
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative" ref={filterDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#6b7280]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                    {isFilterOpen && (
                      <div className="absolute right-0 top-11 z-20 w-[230px] overflow-hidden rounded-xl border border-[#d8dde5] bg-white shadow-lg">
                        <div className="border-b border-[#eceef2] bg-[#edeff3] px-3 py-2 text-sm font-semibold text-[#111827]">
                          Filter by
                        </div>
                        {[
                          { label: "Date Range", icon: CalendarDays },
                          { label: "Vendor", icon: ChevronRight },
                          { label: "Category", icon: ChevronRight },
                          { label: "Source", icon: ChevronRight },
                        ].map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.label}
                              type="button"
                              className="flex w-full items-center justify-between border-b border-[#eceef2] px-3 py-2.5 text-left text-sm text-[#656d78] last:border-b-0"
                            >
                              {option.label}
                              <Icon className="h-4 w-4 text-[#757d89]" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#9ca3af]">
                    Customise
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                {activeTab === "Installation Request" ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-[1260px] table-fixed border-separate border-spacing-0 text-left">
                        <colgroup>
                          <col className="w-[42px]" />
                          <col className="w-[160px]" />
                          <col className="w-[160px]" />
                          <col className="w-[160px]" />
                          <col className="w-[190px]" />
                          <col className="w-[170px]" />
                          <col className="w-[160px]" />
                          <col className="w-[180px]" />
                        </colgroup>
                        <thead>
                          <tr className="sticky top-0 z-10 h-[46px] bg-[#d8e2df] text-[13px] font-semibold text-[#1f2937]">
                            <th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-3">
                              <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                            </th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Project ID</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Customer</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Raised By</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Date Created</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Attachments</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Status</th>
                            <th className="rounded-r-md border border-[#e4e7ec] px-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {installationRows.map((row, index) => (
                            <tr key={`${row.projectId}-${index}`} className="h-[56px] text-[14px] text-[#111827]">
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3 font-semibold">{row.projectId}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.customer}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.raisedBy}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.dateCreated}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <div className="flex items-center justify-between">
                                  <span>{row.attachments}</span>
                                  <button
                                    type="button"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#cfd6e2] text-[#355f8a]"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <span
                                  className={`rounded px-2 py-1 text-[12px] font-semibold ${
                                    row.status === "Approved"
                                      ? "bg-[#e4f4e6] text-[#1a8f2e]"
                                      : row.status === "Not Approved"
                                        ? "bg-[#ffe8e8] text-[#ef4444]"
                                        : "bg-[#fff3dd] text-[#d97706]"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRequest(null);
                                    setSelectedInstallation(row);
                                  }}
                                  className="rounded border border-[#79cf8f] bg-[#effaf2] px-2.5 py-1 text-[12px] font-semibold text-[#1a8f2e]"
                                >
                                  View and Approve
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page 1 of 10</div>
                      <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">
                        Show 10 rows
                        <ChevronDown className="ml-2 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : activeTab === "AMC Request" ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-[1260px] table-fixed border-separate border-spacing-0 text-left">
                        <colgroup>
                          <col className="w-[42px]" />
                          <col className="w-[130px]" />
                          <col className="w-[120px]" />
                          <col className="w-[260px]" />
                          <col className="w-[160px]" />
                          <col className="w-[170px]" />
                          <col className="w-[200px]" />
                        </colgroup>
                        <thead>
                          <tr className="sticky top-0 z-10 h-[46px] bg-[#d8e2df] text-[13px] font-semibold text-[#1f2937]">
                            <th className="rounded-l-md border border-[#e4e7ec] border-r-0 px-3">
                              <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                            </th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">
                              <div className="flex items-center gap-1">
                                <span>Project ID</span>
                                <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" />
                              </div>
                            </th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Customer</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Address</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Customer Contact</th>
                            <th className="border border-[#e4e7ec] border-r-0 px-3">Customer Email</th>
                            <th className="rounded-r-md border border-[#e4e7ec] px-3">Service Requested</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amcRows.map((row, index) => (
                            <tr key={`${row.projectId}-${index}`} className="h-[56px] text-[14px] text-[#111827]">
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.projectId}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.customer}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3 text-[12px] text-[#4b5563]">
                                {row.address}
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.customerContact}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.customerEmail}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.serviceRequested}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page 1 of 10</div>
                      <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">
                        Show 10 rows
                        <ChevronDown className="ml-2 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-[1572px] table-fixed border-separate border-spacing-0 text-left">
                        <colgroup>
                          <col className="w-[42px]" />
                          <col className="w-[120px]" />
                          <col className="w-[230px]" />
                          <col className="w-[180px]" />
                          <col className="w-[200px]" />
                          <col className="w-[150px]" />
                          <col className="w-[260px]" />
                          <col className="w-[120px]" />
                          <col className="w-[150px]" />
                          <col className="w-[120px]" />
                        </colgroup>
                        <thead>
                          <tr className="sticky top-0 z-10 h-[46px] bg-[#d8e2df] text-[13px] font-semibold text-[#1f2937]">
                            <th className="w-[42px] rounded-l-md border border-[#e4e7ec] border-r-0 px-3">
                              <input type="checkbox" className="h-4 w-4 rounded border-[#c5ccd8]" />
                            </th>
                            <th className="w-[120px] border border-[#e4e7ec] border-r-0 px-3">
                              <div className="flex items-center gap-1">
                                <span>Ticket ID</span>
                                <ArrowUpDown className="h-3 w-3 text-[#8b96a7]" />
                              </div>
                            </th>
                            <th className="w-[230px] border border-[#e4e7ec] border-r-0 px-3">Source</th>
                            <th className="w-[180px] border border-[#e4e7ec] border-r-0 px-3">Requested By</th>
                            <th className="w-[200px] border border-[#e4e7ec] border-r-0 px-3">Category</th>
                            <th className="w-[150px] border border-[#e4e7ec] border-r-0 px-3">Time</th>
                            <th className="min-w-[260px] border border-[#e4e7ec] border-r-0 px-3">Description</th>
                            <th className="w-[120px] border border-[#e4e7ec] border-r-0 px-3">Priority</th>
                            <th className="w-[150px] border border-[#e4e7ec] border-r-0 px-3">Attachments</th>
                            <th className="w-[120px] rounded-r-md border border-[#e4e7ec] px-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvalRows.map((row, index) => (
                            <tr
                              key={`${row.ticketId}-${index}`}
                              onClick={() => openViewDrawer(row)}
                              className="h-[56px] cursor-pointer text-[14px] text-[#111827] hover:bg-[#f8fbff]"
                            >
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <input
                                  type="checkbox"
                                  onClick={(event) => event.stopPropagation()}
                                  className="h-4 w-4 rounded border-[#c5ccd8]"
                                />
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.ticketId}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.source}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <div>{row.name}</div>
                                <div className="text-[13px] text-[#2563eb]">{row.email}</div>
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.category}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3 font-semibold">{row.time}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">{row.description}</td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <span
                                  className={`text-[13px] font-semibold ${
                                    row.priority === "High"
                                      ? "text-[#ef4444]"
                                      : row.priority === "Medium"
                                        ? "text-[#b08900]"
                                        : "text-[#1f7a4f]"
                                  }`}
                                >
                                  {row.priority}
                                </span>
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3 text-[13px] text-[#4b5563]">
                                {row.attachments}
                              </td>
                              <td className="border border-t-0 border-[#e4e7ec] px-3">
                                <div className="flex items-center gap-2 text-[#4b5563]">
                                  <button
                                    type="button"
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex h-6 w-6 items-center justify-center rounded border border-[#cfd6e2] text-[#355f8a]"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openViewDrawer(row);
                                    }}
                                    className="inline-flex h-6 w-6 items-center justify-center"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-[#9aa2b1]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openEditDrawer(row);
                                    }}
                                    className="inline-flex h-6 w-6 items-center justify-center"
                                  >
                                    <Pencil className="h-3.5 w-3.5 text-[#111827]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => event.stopPropagation()}
                                    className="inline-flex h-6 w-6 items-center justify-center"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5 text-[#111827]" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page 1 of 10</div>
                      <div className="flex items-center gap-4">
                        <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">
                          Show 10 rows
                          <ChevronDown className="ml-2 h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]">
                            Previous
                          </button>
                          <button className="h-8 w-7 rounded bg-[#0f1136] text-[12px] font-semibold text-white">
                            1
                          </button>
                          {["2", "4", "5", "6", "7"].map((page) => (
                            <button
                              key={page}
                              className="h-8 w-7 rounded border border-[#d1d5db] text-[12px] text-[#6b7280]"
                            >
                              {page}
                            </button>
                          ))}
                          <button className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]">
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
            </div>
          </main>
        </div>

      {selectedInstallation && (
        <div
          className="fixed inset-0 z-50 bg-black/45"
          onClick={() => setSelectedInstallation(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedInstallation(null);
          }}
        >
          <aside
            className="absolute right-0 top-0 h-full w-[430px] overflow-y-auto border-l border-[#d9dee7] bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3">
              <div>
                <h2 className="text-[24px] font-semibold text-[#111827]">
                  Installation Requests <span className="text-[24px] text-[#ef4444]">High</span>
                </h2>
                <p className="text-xs text-[#6b7280]">Ticket ID: {selectedInstallation.ticketId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInstallation(null)}
                className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Request Info</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Project /Lead ID</div>
                    <div>1FT-12312</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Installation Time & Date</div>
                    <div>12-12-2025, 10:30 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Customer Name</div>
                    <div>{selectedInstallation.customer}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">POC</div>
                    <div>Rahul Sharma (Vendor)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Documents</h3>
              <div className="mt-3 space-y-2">
                {["Screenshot.PNG", "Screenshot.PNG", "Screenshot.PNG"].map((fileName, index) => (
                  <div
                    key={`${fileName}-${index}`}
                    className="flex items-center justify-between rounded-md border border-[#dbe2ee] bg-[#f3f6fb] px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-[#3b82f6]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1f2937]">{fileName}</div>
                        <div className="text-[11px] text-[#9aa2b1]">12 June, 10:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="rounded border border-[#cad3e2] bg-white p-1">
                        <Download className="h-3.5 w-3.5 text-[#355f8a]" />
                      </button>
                      <button type="button" className="rounded bg-[#131740] p-1">
                        <Eye className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 h-10 w-full rounded bg-[#131740] text-sm font-semibold text-white">
                Request Resubmission
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="h-10 rounded border border-[#fca5a5] text-sm font-semibold text-[#ef4444]">
                Reject
              </button>
              <button className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">
                Approve
              </button>
            </div>
          </aside>
        </div>
      )}

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/45"
          onClick={() => setSelectedRequest(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedRequest(null);
          }}
        >
          <aside
            className="absolute right-0 top-0 h-full w-[430px] overflow-y-auto border-l border-[#d9dee7] bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#e6eaf0] pb-3">
              <div>
                <h2 className="text-[24px] font-semibold text-[#111827]">
                  {drawerMode === "edit" ? `Edit Approval ${selectedRequest.category} Request` : `${selectedRequest.category} Request`}{" "}
                  <span className="text-[24px] text-[#ef4444]">{selectedRequest.priority}</span>
                </h2>
                <p className="text-xs text-[#6b7280]">Ticket ID: {selectedRequest.ticketId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded border border-[#d1d5db] p-1 text-[#6b7280]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Request Info</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Source</div>
                    <div>{selectedRequest.source}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">POC</div>
                    <div>{selectedRequest.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Email</div>
                    <div>{selectedRequest.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <List className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Category</div>
                    <div>{selectedRequest.category}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Time & Date</div>
                    <div>{selectedRequest.time}, 10:30 PM</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Project / Lead ID</div>
                    <div>1FT-12312</div>
                  </div>
                </div>
              </div>
            </div>

            {drawerMode === "edit" && (
              <div className="mt-4 border-b border-[#e6eaf0] pb-4">
                <h3 className="text-[22px] font-semibold text-[#111827]">Fintech Info</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                    <div>
                      <div className="text-xs text-[#6b7280]">Fintech name</div>
                      <div>HDFC Bank</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                    <div>
                      <div className="text-xs text-[#6b7280]">Type</div>
                      <div>NBFC</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Documents</h3>
              <div className="mt-3 space-y-2">
                {["Screenshot.JPG", "Agreement.PDF", "Compliance.PNG"].map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center justify-between rounded-md border border-[#dbe2ee] bg-[#f3f6fb] px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-[#3b82f6]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1f2937]">{fileName}</div>
                        <div className="text-[11px] text-[#9aa2b1]">12 June, 10:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="rounded border border-[#cad3e2] bg-white p-1">
                        <Download className="h-3.5 w-3.5 text-[#355f8a]" />
                      </button>
                      <button type="button" className="rounded bg-[#131740] p-1">
                        <Eye className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">
                {drawerMode === "edit" ? "Notes" : "Description"}
              </h3>
              <div className="mt-2 rounded-md border border-[#d4dae4] bg-[#fafafa] px-3 py-3 text-sm text-[#374151]">
                {selectedRequest.description}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="h-10 rounded border border-[#fca5a5] text-sm font-semibold text-[#ef4444]">
                Reject
              </button>
              <button className="h-10 rounded bg-[#131740] text-sm font-semibold text-white">
                Approve
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

