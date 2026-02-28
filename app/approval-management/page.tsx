"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  Building2,
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
import {
  buildLoanFilesDownloadUrl,
  getApprovalManagementData,
  submitApprovalAction,
} from "@/features/admin/api/approval-management";

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
  documents: Array<{
    name: string;
    url: string;
    type: string;
    size: string;
    uploadedAt: string;
  }>;
  projectId: string;
  fintechName: string | null;
  fintechType: string | null;
};

type ApprovalTab = "Installation Request" | "Onboarding" | "AMC Request";
type DrawerMode = "view" | "edit";
type InstallationRow = {
  ticketId: string;
  projectId: string;
  customer: string;
  raisedBy: string;
  dateCreated: string;
  installationDateTime: string;
  poc: string;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    size: string;
    uploadedAt: string;
  }>;
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

function parseHumanDate(value: string): Date | null {
  const raw = value.trim();
  if (!raw || raw === "-") return null;

  if (raw.includes(",")) {
    const [datePart, timePart] = raw.split(",");
    const [day, month, year] = datePart.trim().split("-").map(Number);
    if (!day || !month || !year) return null;
    const [hour, minute, second] = timePart.trim().split(":").map(Number);
    return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  }

  if (raw.includes("-")) {
    const [day, month, year] = raw.split("-").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDays(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const text = rounded % 1 === 0 ? String(rounded.toFixed(0)) : String(rounded.toFixed(1));
  return `${text} days`;
}

function getInstallationStatusTone(status: InstallationRow["status"]): string {
  if (status === "Approved") return "text-[#1a8f2e]";
  if (status === "Not Approved") return "text-[#ef4444]";
  return "text-[#f59e0b]";
}

export default function ApprovalManagementPage() {
  const [installationRows, setInstallationRows] = useState<InstallationRow[]>([]);
  const [onboardingRows, setOnboardingRows] = useState<ApprovalRow[]>([]);
  const [amcRows, setAmcRows] = useState<AmcRow[]>([]);
  const [activeTab, setActiveTab] = useState<ApprovalTab>("Onboarding");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRow | null>(null);
  const [selectedInstallation, setSelectedInstallation] = useState<InstallationRow | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [editNotes, setEditNotes] = useState("");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    vendor: "",
    category: "",
    source: "",
  });
  const [draftFilters, setDraftFilters] = useState({
    dateFrom: "",
    dateTo: "",
    vendor: "",
    category: "",
    source: "",
  });
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const tabs = useMemo(
    () => [
      { label: "Installation Request" as const, count: String(installationRows.length).padStart(2, "0") },
      { label: "Onboarding" as const, count: String(onboardingRows.length).padStart(2, "0") },
      { label: "AMC Request" as const, count: String(amcRows.length).padStart(2, "0") },
    ],
    [installationRows.length, onboardingRows.length, amcRows.length],
  );

  const stats = useMemo(() => {
    const totalRequests = installationRows.length + onboardingRows.length + amcRows.length;
    const approved = installationRows.filter((row) => row.status === "Approved").length;
    const rejected = installationRows.filter((row) => row.status === "Not Approved").length;
    const pendingInstallations = installationRows.filter((row) => row.status === "Pending Approval").length;
    const pending = pendingInstallations + onboardingRows.length + amcRows.length;

    const approvalDurations = installationRows
      .filter((row) => row.status === "Approved")
      .map((row) => {
        const start = parseHumanDate(row.dateCreated);
        const end = parseHumanDate(row.installationDateTime);
        if (!start || !end) return null;
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return Number.isFinite(diff) && diff >= 0 ? diff : null;
      })
      .filter((value): value is number => value !== null);

    const avgApproveTime =
      approvalDurations.length > 0
        ? formatDays(approvalDurations.reduce((sum, value) => sum + value, 0) / approvalDurations.length)
        : "-";

    return {
      totalRequests,
      pending,
      approved,
      rejected,
      avgApproveTime,
    };
  }, [amcRows.length, installationRows, onboardingRows.length]);

  const approvalRows = activeTab === "Onboarding" ? onboardingRows : [];
  const activeRows =
    activeTab === "Installation Request"
      ? installationRows
      : activeTab === "Onboarding"
        ? onboardingRows
        : amcRows;
  const canNextPage = activeRows.length >= perPage;

  const extractId = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    return digits || null;
  };

  const handleDownload = (ids: string | null) => {
    if (!ids) return;
    const url = buildLoanFilesDownloadUrl(ids);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const runApprovalAction = async (action: "approve" | "reject" | "resubmit" | "save", payload: {
    ticketId?: string;
    projectId?: string;
    type?: "installation" | "onboarding" | "amc";
    notes?: string;
  }) => {
    try {
      setActionError(null);
      await submitApprovalAction({ action, ...payload });
      if (action === "approve" || action === "reject") {
        setInstallationRows((prev) =>
          prev.map((row) =>
            row.ticketId === payload.ticketId
              ? { ...row, status: action === "approve" ? "Approved" : "Not Approved" }
              : row,
          ),
        );
      }
    } catch (error) {
      console.error("Approval action failed", error);
      setActionError("Action failed. API endpoint may be unavailable.");
    }
  };
  const openViewDrawer = (row: ApprovalRow) => {
    setDrawerMode("view");
    setSelectedRequest(row);
  };

  const openEditDrawer = (row: ApprovalRow) => {
    setDrawerMode("edit");
    setSelectedRequest(row);
  };

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setLoadError(null);
    getApprovalManagementData({
      search: searchTerm,
      page,
      perPage,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      vendor: filters.vendor,
      category: filters.category,
      source: filters.source,
    })
      .then((result) => {
        if (!isMounted) return;
        setInstallationRows(result.installationRows);
        setOnboardingRows(result.onboardingRows);
        setAmcRows(result.amcRows);
      })
      .catch((error) => {
        console.error("Approval management API failed.", error);
        if (!isMounted) return;
        setLoadError("Failed to load approval data. Please try again.");
        setInstallationRows([]);
        setOnboardingRows([]);
        setAmcRows([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, page, perPage, filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!selectedRequest) return;
    setEditNotes(selectedRequest.description ?? "");
  }, [selectedRequest, drawerMode]);

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

            {loadError ? (
              <div className="mt-3 rounded border border-[#f1c1c1] bg-[#fff5f5] px-3 py-2 text-[13px] text-[#b91c1c]">
                {loadError}
              </div>
            ) : null}
            {actionError ? (
              <div className="mt-2 rounded border border-[#f1c1c1] bg-[#fff5f5] px-3 py-2 text-[13px] text-[#b91c1c]">
                {actionError}
              </div>
            ) : null}

            <section className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-4">
              <StatCard
                value={String(stats.totalRequests)}
                title="Total Requests"
                note="Across installation, onboarding, and AMC requests"
              />
              <StatCard
                value={String(stats.pending)}
                title="Pending Approvals"
                note={`${stats.rejected} rejected installation request${stats.rejected === 1 ? "" : "s"}`}
                emphasized
              />
              <StatCard
                value={stats.avgApproveTime}
                title="Avg Approve time"
                note="Based on approved installation requests"
              />
              <StatCard
                value={String(stats.approved)}
                title="Approved"
                note="Approved installation requests"
              />
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
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search"
                    className="h-full w-full bg-transparent text-[12px] text-[#111827] outline-none placeholder:text-[#9aa2b1]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative" ref={filterDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftFilters(filters);
                        setIsFilterOpen((prev) => !prev);
                      }}
                      className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-sm text-[#6b7280]"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                    {isFilterOpen && (
                      <div className="absolute right-0 top-11 z-20 w-[260px] rounded-xl border border-[#d8dde5] bg-white p-3 shadow-lg">
                        <div className="text-sm font-semibold text-[#111827]">Filter by</div>
                        <div className="mt-2 space-y-2 text-xs text-[#4b5563]">
                          <div>
                            <div className="mb-1 text-[11px] font-semibold">Date From</div>
                            <input
                              type="date"
                              value={draftFilters.dateFrom}
                              onChange={(event) =>
                                setDraftFilters((prev) => ({ ...prev, dateFrom: event.target.value }))
                              }
                              className="h-8 w-full rounded border border-[#d8dde5] px-2"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] font-semibold">Date To</div>
                            <input
                              type="date"
                              value={draftFilters.dateTo}
                              onChange={(event) =>
                                setDraftFilters((prev) => ({ ...prev, dateTo: event.target.value }))
                              }
                              className="h-8 w-full rounded border border-[#d8dde5] px-2"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] font-semibold">Vendor</div>
                            <input
                              value={draftFilters.vendor}
                              onChange={(event) =>
                                setDraftFilters((prev) => ({ ...prev, vendor: event.target.value }))
                              }
                              placeholder="Vendor name"
                              className="h-8 w-full rounded border border-[#d8dde5] px-2"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] font-semibold">Category</div>
                            <input
                              value={draftFilters.category}
                              onChange={(event) =>
                                setDraftFilters((prev) => ({ ...prev, category: event.target.value }))
                              }
                              placeholder="Category"
                              className="h-8 w-full rounded border border-[#d8dde5] px-2"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] font-semibold">Source</div>
                            <input
                              value={draftFilters.source}
                              onChange={(event) =>
                                setDraftFilters((prev) => ({ ...prev, source: event.target.value }))
                              }
                              placeholder="Source"
                              className="h-8 w-full rounded border border-[#d8dde5] px-2"
                            />
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="h-8 rounded border border-[#d8dde5] text-xs text-[#4b5563]"
                            onClick={() => {
                              setDraftFilters({ dateFrom: "", dateTo: "", vendor: "", category: "", source: "" });
                              setFilters({ dateFrom: "", dateTo: "", vendor: "", category: "", source: "" });
                              setPage(1);
                              setIsFilterOpen(false);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="h-8 rounded bg-[#11163f] text-xs font-semibold text-white"
                            onClick={() => {
                              setFilters(draftFilters);
                              setPage(1);
                              setIsFilterOpen(false);
                            }}
                          >
                            Apply
                          </button>
                        </div>
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
                          {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                              <tr key={`inst-skel-${idx}`} className="h-[56px] text-[14px] text-[#111827]">
                                {Array.from({ length: 8 }).map((__, colIdx) => (
                                  <td key={`inst-skel-${idx}-${colIdx}`} className="border border-t-0 border-[#e4e7ec] px-3">
                                    <div className="h-3 w-full max-w-[140px] rounded bg-[#e3e7ee]" />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            installationRows.map((row, index) => (
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
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      const id = extractId(row.projectId) ?? extractId(row.ticketId);
                                      handleDownload(id);
                                    }}
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page {page}</div>
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]"
                          onClick={() => setPerPage(10)}
                        >
                          Show {perPage} rows
                          <ChevronDown className="ml-2 h-3.5 w-3.5" />
                        </button>
                        <button
                          className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                          Previous
                        </button>
                        <button
                          className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                          onClick={() => setPage((prev) => (canNextPage ? prev + 1 : prev))}
                        >
                          Next
                        </button>
                      </div>
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
                          {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                              <tr key={`amc-skel-${idx}`} className="h-[56px] text-[14px] text-[#111827]">
                                {Array.from({ length: 7 }).map((__, colIdx) => (
                                  <td key={`amc-skel-${idx}-${colIdx}`} className="border border-t-0 border-[#e4e7ec] px-3">
                                    <div className="h-3 w-full max-w-[180px] rounded bg-[#e3e7ee]" />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            amcRows.map((row, index) => (
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page {page}</div>
                      <div className="flex items-center gap-2">
                        <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">
                          Show {perPage} rows
                          <ChevronDown className="ml-2 h-3.5 w-3.5" />
                        </button>
                        <button
                          className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                          Previous
                        </button>
                        <button
                          className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                          onClick={() => setPage((prev) => (canNextPage ? prev + 1 : prev))}
                        >
                          Next
                        </button>
                      </div>
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
                          {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                              <tr key={`onb-skel-${idx}`} className="h-[56px] text-[14px] text-[#111827]">
                                {Array.from({ length: 10 }).map((__, colIdx) => (
                                  <td key={`onb-skel-${idx}-${colIdx}`} className="border border-t-0 border-[#e4e7ec] px-3">
                                    <div className="h-3 w-full max-w-[180px] rounded bg-[#e3e7ee]" />
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            approvalRows.map((row, index) => (
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
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      const id = extractId(row.projectId) ?? extractId(row.ticketId);
                                      handleDownload(id);
                                    }}
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex items-center justify-between px-1 text-sm text-[#111827]">
                      <div>Page {page}</div>
                      <div className="flex items-center gap-4">
                        <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-sm text-[#4b5563]">
                          Show {perPage} rows
                          <ChevronDown className="ml-2 h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          >
                            Previous
                          </button>
                          <button className="h-8 w-7 rounded bg-[#0f1136] text-[12px] font-semibold text-white">
                            {page}
                          </button>
                          <button
                            className="h-8 rounded border border-[#d1d5db] px-3 text-[12px] text-[#4b5563]"
                            onClick={() => setPage((prev) => (canNextPage ? prev + 1 : prev))}
                          >
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
                  Installation Requests{" "}
                  <span className={`text-[24px] ${getInstallationStatusTone(selectedInstallation.status)}`}>
                    {selectedInstallation.status}
                  </span>
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
                    <div>{selectedInstallation.projectId}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Installation Time & Date</div>
                    <div>{selectedInstallation.installationDateTime}</div>
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
                    <div>{selectedInstallation.poc}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Documents</h3>
              <div className="mt-3 space-y-2">
                {selectedInstallation.documents.length === 0 ? (
                  <div className="rounded-md border border-[#dbe2ee] bg-[#f9fafb] px-3 py-2 text-xs text-[#6b7280]">
                    No documents attached.
                  </div>
                ) : (
                  selectedInstallation.documents.map((doc, index) => (
                    <div
                      key={`${doc.name}-${index}`}
                      className="flex items-center justify-between rounded-md border border-[#dbe2ee] bg-[#f3f6fb] px-2 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-[#3b82f6]" />
                        <div>
                          <div className="text-xs font-semibold text-[#1f2937]">{doc.name}</div>
                          <div className="text-[11px] text-[#9aa2b1]">{doc.uploadedAt}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded border border-[#cad3e2] bg-white p-1"
                          onClick={() => {
                            if (doc.url) {
                              window.open(doc.url, "_blank", "noopener,noreferrer");
                              return;
                            }
                            const id = extractId(selectedInstallation.projectId) ?? extractId(selectedInstallation.ticketId);
                            handleDownload(id);
                          }}
                        >
                          <Download className="h-3.5 w-3.5 text-[#355f8a]" />
                        </button>
                        <button type="button" className="rounded bg-[#131740] p-1">
                          <Eye className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                className="mt-4 h-10 w-full rounded bg-[#131740] text-sm font-semibold text-white"
                onClick={() =>
                  runApprovalAction("resubmit", {
                    ticketId: selectedInstallation.ticketId,
                    projectId: selectedInstallation.projectId,
                    type: "installation",
                  })
                }
              >
                Request Resubmission
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="h-10 rounded border border-[#fca5a5] text-sm font-semibold text-[#ef4444]"
                onClick={() =>
                  runApprovalAction("reject", {
                    ticketId: selectedInstallation.ticketId,
                    projectId: selectedInstallation.projectId,
                    type: "installation",
                  })
                }
              >
                Reject
              </button>
              <button
                className="h-10 rounded bg-[#131740] text-sm font-semibold text-white"
                onClick={() =>
                  runApprovalAction("approve", {
                    ticketId: selectedInstallation.ticketId,
                    projectId: selectedInstallation.projectId,
                    type: "installation",
                  })
                }
              >
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
                    <div>{selectedRequest.time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                  <div>
                    <div className="text-xs text-[#6b7280]">Project / Lead ID</div>
                    <div>{selectedRequest.projectId}</div>
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
                      <div>{selectedRequest.fintechName ?? "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#355f8a]" />
                    <div>
                      <div className="text-xs text-[#6b7280]">Type</div>
                      <div>{selectedRequest.fintechType ?? "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 border-b border-[#e6eaf0] pb-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">Documents</h3>
              <div className="mt-3 space-y-2">
                {selectedRequest.documents.length === 0 ? (
                  <div className="rounded-md border border-[#dbe2ee] bg-[#f9fafb] px-3 py-2 text-xs text-[#6b7280]">
                    No documents attached.
                  </div>
                ) : (
                  selectedRequest.documents.map((doc, index) => (
                    <div
                      key={`${doc.name}-${index}`}
                      className="flex items-center justify-between rounded-md border border-[#dbe2ee] bg-[#f3f6fb] px-2 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-[#3b82f6]" />
                        <div>
                          <div className="text-xs font-semibold text-[#1f2937]">{doc.name}</div>
                          <div className="text-[11px] text-[#9aa2b1]">{doc.uploadedAt}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded border border-[#cad3e2] bg-white p-1"
                          onClick={() => {
                            if (doc.url) {
                              window.open(doc.url, "_blank", "noopener,noreferrer");
                              return;
                            }
                            const id = extractId(selectedRequest.projectId) ?? extractId(selectedRequest.ticketId);
                            handleDownload(id);
                          }}
                        >
                          <Download className="h-3.5 w-3.5 text-[#355f8a]" />
                        </button>
                        <button type="button" className="rounded bg-[#131740] p-1">
                          <Eye className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-[22px] font-semibold text-[#111827]">
                {drawerMode === "edit" ? "Notes" : "Description"}
              </h3>
              {drawerMode === "edit" ? (
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(event) => setEditNotes(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[#d4dae4] bg-white px-3 py-2 text-sm text-[#374151]"
                  placeholder="Type notes"
                />
              ) : (
                <div className="mt-2 rounded-md border border-[#d4dae4] bg-[#fafafa] px-3 py-3 text-sm text-[#374151]">
                  {selectedRequest.description}
                </div>
              )}
            </div>

            <div className={`mt-6 grid gap-3 ${drawerMode === "edit" ? "grid-cols-3" : "grid-cols-2"}`}>
              {drawerMode === "edit" ? (
                <button
                  className="h-10 rounded border border-[#d1d5db] text-sm font-semibold text-[#374151]"
                  onClick={() =>
                    runApprovalAction("save", {
                      ticketId: selectedRequest.ticketId,
                      projectId: selectedRequest.projectId,
                      type: "onboarding",
                      notes: editNotes,
                    })
                  }
                >
                  Save
                </button>
              ) : null}
              <button
                className="h-10 rounded border border-[#fca5a5] text-sm font-semibold text-[#ef4444]"
                onClick={() =>
                  runApprovalAction("reject", {
                    ticketId: selectedRequest.ticketId,
                    projectId: selectedRequest.projectId,
                    type: "onboarding",
                  })
                }
              >
                Reject
              </button>
              <button
                className="h-10 rounded bg-[#131740] text-sm font-semibold text-white"
                onClick={() =>
                  runApprovalAction("approve", {
                    ticketId: selectedRequest.ticketId,
                    projectId: selectedRequest.projectId,
                    type: "onboarding",
                  })
                }
              >
                Approve
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
