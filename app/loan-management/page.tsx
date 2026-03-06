"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  Landmark,
  ListChecks,
  Mail,
  MapPin,
  MoreVertical,
  PencilLine,
  Phone,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import {
  LOAN_STATUS_OPTIONS,
  buildLoanDownloadUrl,
  deleteLoan,
  getLoanRequests,
  getLoanStatuses,
  updateLoanStatus,
  uploadLoanAttachments,
  type LoanRequestRow,
  type LoanStatus,
  type LoanStatusRow,
} from "@/features/admin/api/loan-management";

const statusOptions: LoanStatus[] = LOAN_STATUS_OPTIONS;

function statusClassName(status: LoanStatus) {
  if (status === "Documents Pending") return "bg-[#f8dcc5] text-[#8a5a2a]";
  if (status === "Rejected") return "bg-[#fbe0e0] text-[#d92f2f]";
  if (status === "Hold") return "bg-[#dde0ee] text-[#273067]";
  if (status === "Disbursed") return "bg-[#dff1df] text-[#2d7a3a]";
  if (status === "Approved") return "bg-[#dbeede] text-[#2f7b3d]";
  return "bg-[#d8edd9] text-[#2f7736]";
}

function PageSelect({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58] disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
        onClick={onPrev}
        disabled={page <= 1}
      >
        Previous
      </button>
      <button className="h-8 min-w-[28px] rounded-md bg-[#12153f] px-2 text-xs font-semibold text-white">
        {page}
      </button>
      <button
        className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58] disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

function AttachmentCell({
  count,
  rowId,
  onDownload,
}: {
  count: number;
  rowId: number;
  onDownload?: (rowId: number) => void;
}) {
  const label = count > 0 ? `${count} File${count > 1 ? "s" : ""} attached` : "No files";
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {count > 0 ? (
        <button
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#cfd5df] text-[#244f80]"
          onClick={(event) => {
            event.stopPropagation();
            onDownload?.(rowId);
          }}
        >
          <Download className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="h-[54px]">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="border-b border-[#dce1e8] px-2">
          <div className="h-3 w-full animate-pulse rounded bg-[#e6eaf2]" />
        </td>
      ))}
    </tr>
  );
}

export default function LoanManagementPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "status">("requests");
  const [requestRows, setRequestRows] = useState<LoanRequestRow[]>([]);
  const [statusRows, setStatusRows] = useState<LoanStatusRow[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [openStatusRow, setOpenStatusRow] = useState<number | null>(null);
  const [viewRow, setViewRow] = useState<LoanStatusRow | null>(null);
  const [viewMode, setViewMode] = useState<"requests" | "status" | null>(null);
  const [updateRow, setUpdateRow] = useState<LoanStatusRow | null>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [requestPage, setRequestPage] = useState(1);
  const [statusPage, setStatusPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [requestTotalPages, setRequestTotalPages] = useState(1);
  const [statusTotalPages, setStatusTotalPages] = useState(1);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  const [isSavingUpdate, setIsSavingUpdate] = useState(false);
  const [updateStatusValue, setUpdateStatusValue] = useState<LoanStatus>("Documents Pending");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const htmlTarget = event.target as HTMLElement;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpenMenuRow(null);
      }
      if (filterRef.current && !filterRef.current.contains(target)) {
        setShowFilter(false);
      }
      if (!htmlTarget.closest("[data-status-menu]")) {
        setOpenStatusRow(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isActive = true;
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setRequestPage(1);
      setStatusPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let isActive = true;
    setIsLoadingRequests(true);
    setLoadError(null);
    getLoanRequests({
      loanApprove: 0,
      perPage,
      page: requestPage,
      search: debouncedSearch,
      paymentType: paymentTypeFilter,
      status: statusFilter,
    })
      .then((result) => {
        if (!isActive) return;
        setRequestRows(result.rows);
        setRequestTotalPages(result.pagination.totalPages);
      })
      .catch((error) => {
        console.warn("Failed to load loan requests", error);
        if (isActive) setLoadError("Unable to load loan requests right now.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingRequests(false);
      });

    return () => {
      isActive = false;
    };
  }, [debouncedSearch, paymentTypeFilter, statusFilter, requestPage, perPage]);

  useEffect(() => {
    let isActive = true;
    setIsLoadingStatuses(true);
    setLoadError(null);
    getLoanStatuses({
      loanApprove: 1,
      perPage,
      page: statusPage,
      search: debouncedSearch,
      paymentType: paymentTypeFilter,
      status: statusFilter,
    })
      .then((result) => {
        if (!isActive) return;
        setStatusRows(result.rows);
        setStatusTotalPages(result.pagination.totalPages);
      })
      .catch((error) => {
        console.warn("Failed to load loan statuses", error);
        if (isActive) setLoadError("Unable to load loan statuses right now.");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingStatuses(false);
      });

    return () => {
      isActive = false;
    };
  }, [debouncedSearch, paymentTypeFilter, statusFilter, statusPage, perPage]);

  useEffect(() => {
    if (!updateRow) return;
    setUpdateStatusValue(updateRow.status);
    setUpdateRemarks(updateRow.remarks === "--" ? "" : updateRow.remarks);
  }, [updateRow]);

  const rows = useMemo(() => (activeTab === "requests" ? requestRows : statusRows), [activeTab, requestRows, statusRows]);
  const currentPage = activeTab === "requests" ? requestPage : statusPage;
  const currentTotalPages = activeTab === "requests" ? requestTotalPages : statusTotalPages;

  const getViewRow = (row: LoanRequestRow | LoanStatusRow): LoanStatusRow => {
    const existing = statusRows.find((statusRow) => statusRow.id === row.id);
    if (existing) return existing;
    return {
      ...row,
      updatedOn: row.requestedOn,
      status: "Documents Pending",
      remarks: "--",
      disbursedAmount: "Rs 5,12,000",
      pendingAmount: "Rs 5,12,000",
      region: "Kerala",
    };
  };

  const selectedStatus = updateRow
    ? updateStatusValue
    : "Documents Pending";

  const handleDownload = (rowId: number) => {
    const url = buildLoanDownloadUrl([rowId]);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (rowId: number, mode: "requests" | "status") => {
    if (!window.confirm("Delete this loan request?")) return;
    try {
      await deleteLoan(rowId);
      if (mode === "requests") {
        setRequestRows((prev) => prev.filter((item) => item.id !== rowId));
      } else {
        setStatusRows((prev) => prev.filter((item) => item.id !== rowId));
      }
    } catch (error) {
      console.warn("Failed to delete loan", error);
    }
  };

  const handleSaveUpdate = async () => {
    if (!updateRow || isSavingUpdate) return;
    setIsSavingUpdate(true);
    try {
      await updateLoanStatus({
        id: updateRow.id,
        status: updateStatusValue,
        remarks: updateRemarks,
      });
      setStatusRows((prev) =>
        prev.map((row) =>
          row.id === updateRow.id
            ? {
                ...row,
                status: updateStatusValue,
                remarks: updateRemarks || "--",
              }
            : row,
        ),
      );
      setUpdateRow(null);
    } catch (error) {
      console.warn("Failed to update loan status", error);
    } finally {
      setIsSavingUpdate(false);
    }
  };

  const handleUploadFiles = async (files: FileList | null) => {
    if (!updateRow || !files || files.length === 0) return;
    try {
      await uploadLoanAttachments(updateRow.id, Array.from(files));
      setUpdateRow((prev) =>
        prev
          ? {
              ...prev,
              attachments: prev.attachments,
            }
          : prev,
      );
    } catch (error) {
      console.warn("Failed to upload loan files", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Loan Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[54px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[21px] font-semibold text-[#1f2937]">Loan Team</div>
            <div className="flex items-center gap-2">
              <div className="hidden h-9 w-[210px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
                <Search className="h-4 w-4" />
                Search
              </div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-[#d89d77]" />
                <span className="text-[13px] text-[#4c5564]">Rajesh B</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
              </div>
            </div>
          </header>

          <div className="p-4">
            <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Loan Management</h1>

            <section className="mt-4 rounded-md border border-[#d8dde5] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              {loadError ? (
                <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {loadError}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex h-8 w-[260px] rounded bg-[#eef1f6] p-0.5 text-sm font-semibold">
                  <button
                    className={`flex-1 rounded ${
                      activeTab === "requests" ? "bg-[#11163f] text-white" : "text-[#7a8494]"
                    }`}
                    onClick={() => {
                      setActiveTab("requests");
                      setOpenMenuRow(null);
                      setOpenStatusRow(null);
                      setViewRow(null);
                      setViewMode(null);
                    }}
                  >
                    Loan Requests
                  </button>
                  <button
                    className={`flex-1 rounded ${
                      activeTab === "status" ? "bg-[#11163f] text-white" : "text-[#7a8494]"
                    }`}
                    onClick={() => {
                      setActiveTab("status");
                      setOpenMenuRow(null);
                      setOpenStatusRow(null);
                      setViewRow(null);
                      setViewMode(null);
                    }}
                  >
                    Loan Status
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-[220px] items-center gap-2 rounded border border-[#d8dde5] px-3 text-xs text-[#9aa2b1]">
                    <Search className="h-4 w-4" />
                    <input
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      placeholder="Search"
                      className="h-full w-full bg-transparent text-xs text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                    />
                  </div>
                  <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-xs text-[#7a8494]">
                    Customise
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <div className="relative" ref={filterRef}>
                    <button
                      className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] px-3 text-xs text-[#7a8494]"
                      onClick={() => setShowFilter((prev) => !prev)}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {showFilter ? (
                      <div className="absolute right-0 top-11 z-30 w-56 rounded-xl border border-[#d9dce2] bg-white p-3 text-xs shadow-[0_10px_20px_rgba(16,24,40,0.12)]">
                        <div className="mb-2 border-b border-[#ebedf2] pb-2 font-medium text-[#535a68]">
                          Filter by
                        </div>
                        <label className="mb-1 block text-[11px] font-semibold text-[#6a7180]">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(event) => {
                            setStatusFilter(event.target.value);
                            setRequestPage(1);
                            setStatusPage(1);
                          }}
                          className="h-8 w-full rounded border border-[#dfe3eb] bg-white px-2 text-[11px]"
                        >
                          <option value="">All</option>
                          {statusOptions.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <label className="mt-3 mb-1 block text-[11px] font-semibold text-[#6a7180]">Payment Type</label>
                        <input
                          value={paymentTypeFilter}
                          onChange={(event) => {
                            setPaymentTypeFilter(event.target.value);
                            setRequestPage(1);
                            setStatusPage(1);
                          }}
                          placeholder="e.g. EMI"
                          className="h-8 w-full rounded border border-[#dfe3eb] px-2 text-[11px]"
                        />
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            className="flex-1 rounded border border-[#d1d7e0] px-2 py-1 text-[11px] text-[#5f6675]"
                            onClick={() => {
                              setStatusFilter("");
                              setPaymentTypeFilter("");
                              setRequestPage(1);
                              setStatusPage(1);
                            }}
                          >
                            Clear
                          </button>
                          <button
                            className="flex-1 rounded bg-[#11163f] px-2 py-1 text-[11px] text-white"
                            onClick={() => setShowFilter(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-auto rounded-md border border-[#dce1e8]">
                {activeTab === "requests" ? (
                  <table className="w-full min-w-[1180px] table-fixed border-separate border-spacing-0 text-left text-xs">
                    <colgroup>
                      <col className="w-[42px]" />
                      <col className="w-[140px]" />
                      <col className="w-[140px]" />
                      <col className="w-[30px]" />
                      <col className="w-[190px]" />
                      <col className="w-[120px]" />
                      <col className="w-[130px]" />
                      <col className="w-[160px]" />
                      <col className="w-[120px]" />
                      <col className="w-[90px]" />
                    </colgroup>
                    <thead>
                      <tr className="h-10 bg-[#d4dfdd] text-[#55606f]">
                        <th className="border-b border-[#dce1e8] px-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" />
                        </th>
                        <th className="border-b border-[#dce1e8] px-2">Loan Ref No</th>
                        <th className="border-b border-[#dce1e8] px-2">customer</th>
                        <th className="border-b border-[#dce1e8] px-2 text-center">
                          <ArrowUpDown className="mx-auto h-3.5 w-3.5" />
                        </th>
                        <th className="border-b border-[#dce1e8] px-2">Vendor</th>
                        <th className="border-b border-[#dce1e8] px-2">Project Value</th>
                        <th className="border-b border-[#dce1e8] px-2">Bank /NBFC</th>
                        <th className="border-b border-[#dce1e8] px-2">Attachements</th>
                        <th className="border-b border-[#dce1e8] px-2">Requested On</th>
                        <th className="border-b border-[#dce1e8] px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingRequests
                        ? Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={`req-${index}`} columns={10} />)
                        : rows.map((row) => (
                            <tr
                              key={row.id}
                              className="h-[54px] cursor-pointer odd:bg-[#f8f9fb]"
                              onClick={() => {
                                setOpenMenuRow(null);
                                setOpenStatusRow(null);
                                setViewRow(getViewRow(row));
                                setViewMode("requests");
                              }}
                            >
                              <td className="border-b border-[#dce1e8] px-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-[#bac3d1]"
                                  onClick={(event) => event.stopPropagation()}
                                />
                              </td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.loanRefNo}</td>
                              <td className="border-b border-[#dce1e8] px-2">{row.customer}</td>
                              <td className="border-b border-[#dce1e8] px-2" />
                              <td className="border-b border-[#dce1e8] px-2">{row.vendor}</td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.projectValue}</td>
                              <td className="border-b border-[#dce1e8] px-2">{row.bank}</td>
                              <td className="border-b border-[#dce1e8] px-2">
                                <AttachmentCell
                                  count={row.attachments?.length ?? 0}
                                  rowId={row.id}
                                  onDownload={handleDownload}
                                />
                              </td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.requestedOn}</td>
                              <td className="relative border-b border-[#dce1e8] px-2">
                                <div ref={openMenuRow === row.id ? menuRef : null} className="relative">
                                  <button
                                    className="rounded p-1 text-[#1f2430]"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setOpenMenuRow(openMenuRow === row.id ? null : row.id);
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {openMenuRow === row.id ? (
                                    <div className="absolute right-0 top-7 z-20 w-28 rounded-lg border border-[#d9dce1] bg-white py-1 shadow-[0_8px_18px_rgba(16,24,40,0.12)]">
                                      <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#4b5563] hover:bg-[#f5f7fb]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setViewRow(getViewRow(row));
                                          setViewMode("requests");
                                          setOpenMenuRow(null);
                                        }}
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                      </button>
                                      <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#e02424] hover:bg-[#fff5f5]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleDelete(row.id, "requests");
                                          setOpenMenuRow(null);
                                        }}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full min-w-[1680px] table-fixed border-separate border-spacing-0 text-left text-xs">
                    <colgroup>
                      <col className="w-[42px]" />
                      <col className="w-[90px]" />
                      <col className="w-[130px]" />
                      <col className="w-[25px]" />
                      <col className="w-[160px]" />
                      <col className="w-[110px]" />
                      <col className="w-[110px]" />
                      <col className="w-[160px]" />
                      <col className="w-[110px]" />
                      <col className="w-[130px]" />
                      <col className="w-[120px]" />
                      <col className="w-[120px]" />
                      <col className="w-[90px]" />
                      <col className="w-[80px]" />
                    </colgroup>
                    <thead>
                      <tr className="h-10 bg-[#d4dfdd] text-[#55606f]">
                        <th className="border-b border-[#dce1e8] px-2">
                          <input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" />
                        </th>
                        <th className="border-b border-[#dce1e8] px-2">Loan Ref No</th>
                        <th className="border-b border-[#dce1e8] px-2">customer</th>
                        <th className="border-b border-[#dce1e8] px-2 text-center">
                          <ArrowUpDown className="mx-auto h-3.5 w-3.5" />
                        </th>
                        <th className="border-b border-[#dce1e8] px-2">Vendor</th>
                        <th className="border-b border-[#dce1e8] px-2">Project Value</th>
                        <th className="border-b border-[#dce1e8] px-2">Bank /NBFC</th>
                        <th className="border-b border-[#dce1e8] px-2">Attachements</th>
                        <th className="border-b border-[#dce1e8] px-2">Updated On</th>
                        <th className="border-b border-[#dce1e8] px-2">Status</th>
                        <th className="border-b border-[#dce1e8] px-2">Remarks</th>
                        <th className="border-b border-[#dce1e8] px-2">Disbursed Amount</th>
                        <th className="border-b border-[#dce1e8] px-2">Pending Amount</th>
                        <th className="border-b border-[#dce1e8] px-2">Region</th>
                        <th className="border-b border-[#dce1e8] px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingStatuses
                        ? Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={`status-${index}`} columns={14} />)
                        : statusRows.map((row) => (
                            <tr
                              key={row.id}
                              className="h-[54px] cursor-pointer odd:bg-[#f8f9fb]"
                              onClick={() => {
                                setOpenMenuRow(null);
                                setOpenStatusRow(null);
                                setViewRow(row);
                                setViewMode("status");
                              }}
                            >
                              <td className="border-b border-[#dce1e8] px-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-[#bac3d1]"
                                  onClick={(event) => event.stopPropagation()}
                                />
                              </td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.loanRefNo}</td>
                              <td className="border-b border-[#dce1e8] px-2">{row.customer}</td>
                              <td className="border-b border-[#dce1e8] px-2" />
                              <td className="border-b border-[#dce1e8] px-2">{row.vendor}</td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.projectValue}</td>
                              <td className="border-b border-[#dce1e8] px-2">{row.bank}</td>
                              <td className="border-b border-[#dce1e8] px-2">
                                <AttachmentCell
                                  count={row.attachments?.length ?? 0}
                                  rowId={row.id}
                                  onDownload={handleDownload}
                                />
                              </td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.updatedOn}</td>
                              <td className="border-b border-[#dce1e8] px-2">
                                <div className="relative inline-block" data-status-menu>
                                  <button
                                    className={`inline-flex min-w-[88px] items-center justify-between rounded px-2.5 py-1 text-[10px] ${statusClassName(row.status)}`}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setOpenStatusRow(openStatusRow === row.id ? null : row.id);
                                    }}
                                  >
                                    {row.status}
                                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                  </button>
                                  {openStatusRow === row.id ? (
                                    <div className="absolute left-0 top-8 z-30 w-[108px] rounded border border-[#d1d5de] bg-white py-1 shadow-[0_10px_18px_rgba(15,23,42,0.16)]">
                                      {statusOptions.map((statusOption, index) => (
                                        <button
                                          key={statusOption}
                                          className="flex w-full items-center justify-between px-2 py-1.5 text-left text-[10px] text-[#111827] hover:bg-[#f3f5f8]"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setStatusRows((prev) =>
                                              prev.map((currentRow) =>
                                                currentRow.id === row.id
                                                  ? { ...currentRow, status: statusOption }
                                                  : currentRow,
                                              ),
                                            );
                                            setOpenStatusRow(null);
                                          }}
                                        >
                                          <span>{statusOption}</span>
                                          {index === 0 ? (
                                            <ChevronDown className="h-3 w-3 rotate-180 text-[#414b5a]" />
                                          ) : null}
                                        </button>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                              <td className="border-b border-[#dce1e8] px-2">{row.remarks}</td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.disbursedAmount}</td>
                              <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.pendingAmount}</td>
                              <td className="border-b border-[#dce1e8] px-2">{row.region}</td>
                              <td className="relative border-b border-[#dce1e8] px-2">
                                <div ref={openMenuRow === row.id ? menuRef : null} className="relative">
                                  <button
                                    className="rounded p-1 text-[#1f2430]"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setOpenMenuRow(openMenuRow === row.id ? null : row.id);
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {openMenuRow === row.id ? (
                                    <div className="absolute right-0 top-7 z-20 w-28 rounded-lg border border-[#d9dce1] bg-white py-1 shadow-[0_8px_18px_rgba(16,24,40,0.12)]">
                                      <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#4b5563] hover:bg-[#f5f7fb]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setViewRow(row);
                                          setViewMode("status");
                                          setOpenMenuRow(null);
                                        }}
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                        View
                                      </button>
                                      <button
                                        className="mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-sm border border-[#2f7df6] px-2 py-2 text-left text-xs text-[#2f7df6]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setUpdateRow(row);
                                          setViewRow(null);
                                          setViewMode(null);
                                          setOpenMenuRow(null);
                                        }}
                                      >
                                        <PencilLine className="h-3.5 w-3.5" />
                                        Update
                                      </button>
                                      <button
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#e02424] hover:bg-[#fff5f5]"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleDelete(row.id, "status");
                                          setOpenMenuRow(null);
                                        }}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-[#111827]">
                <div className="flex items-center gap-3">
                  <span>
                    Page {currentPage} of {currentTotalPages}
                  </span>
                  <div className="relative">
                    <select
                      value={perPage}
                      onChange={(event) => {
                        setPerPage(Number(event.target.value));
                        setRequestPage(1);
                        setStatusPage(1);
                      }}
                      className="h-8 rounded-md border border-[#d1d5db] bg-white px-3 text-xs text-[#6b7280]"
                    >
                      {[10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          Show {size} rows
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#6b7280]" />
                  </div>
                </div>
                <PageSelect
                  page={currentPage}
                  totalPages={currentTotalPages}
                  onPrev={() => {
                    if (activeTab === "requests") {
                      setRequestPage((prev) => Math.max(1, prev - 1));
                    } else {
                      setStatusPage((prev) => Math.max(1, prev - 1));
                    }
                  }}
                  onNext={() => {
                    if (activeTab === "requests") {
                      setRequestPage((prev) => Math.min(requestTotalPages, prev + 1));
                    } else {
                      setStatusPage((prev) => Math.min(statusTotalPages, prev + 1));
                    }
                  }}
                />
              </div>
            </section>
          </div>
        </main>
      </div>

      {viewRow ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20">
          {viewMode === "requests" ? (
            <aside className="h-full w-full max-w-[392px] overflow-y-auto border-l border-[#dfe3ea] bg-white shadow-[-10px_0_24px_rgba(15,23,42,0.14)]">
              <div className="border-b border-[#dfe3ea] px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[24px] font-semibold leading-none text-[#1f2432]">{viewRow.loanRefNo}</div>
                    <div className="mt-1 text-xs font-medium leading-none text-[#2a3141]">{viewRow.customer}</div>
                  </div>
                  <button
                    className="rounded border border-[#b7beca] p-1 text-[#596273] hover:bg-[#eef1f5]"
                    onClick={() => {
                      setViewRow(null);
                      setViewMode(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 px-4 py-3 text-[10px]">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Customer name</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.customer}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Requested On</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.requestedOn}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Vendor</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.vendor}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Vendor Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.vendorPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Project Value</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.projectValue}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Landmark className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Bank/NBFC</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.bank}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Bank POC</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.bankPocName}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Contact</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.bankPocPhone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#d9dce4] pt-3">
                  <label className="mb-1 block text-xs font-semibold text-[#1f2532]">Assigned To</label>
                  <div className="relative">
                    <select className="h-8 w-full appearance-none rounded border border-[#bcc5d5] bg-[#edf0f3] px-2 text-[10px] text-[#1d2433]">
                      <option>{viewRow.assignedTo || "Unassigned"}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-[#576074]" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1f2532]">Attachments</label>
                  <div className="overflow-hidden rounded-md border border-[#c9d1de]">
                    <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#cfd9d7] px-3 py-2 text-[11px] font-medium text-[#4a5566]">
                      <span>File Required</span>
                      <span>Files Submitted</span>
                      <span>Action</span>
                    </div>
                    {viewRow.attachments.length ? (
                      viewRow.attachments.map((file, index) => (
                        <div
                          key={`${file.id}-${index}`}
                          className="grid grid-cols-[1fr_1fr_1fr] items-center border-t border-[#dfe3ea] bg-[#f4f5f7] px-3 py-3"
                        >
                          <div className="text-[11px] font-medium text-[#1d2433]">{file.type}</div>
                          <div>
                            <div className="text-[10px] font-medium text-[#1d2433]">{file.reference}</div>
                            <button
                              className="mt-1 inline-flex items-center gap-1 rounded border border-[#b6c0d2] bg-white px-1.5 py-0.5 text-[10px] text-[#273247]"
                              onClick={(event) => event.stopPropagation()}
                            >
                              1 File attached
                              <Download className="h-3.5 w-3.5 text-[#1d4f84]" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#4ad66d] bg-[#e8ffef] text-[#2f9e44]">OK</span>
                            <button className="rounded border border-[#f2a0a0] bg-white px-2 py-1 text-[10px] text-[#e53935]">
                              Request Re - Submit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border-t border-[#dfe3ea] bg-[#f4f5f7] px-3 py-3 text-[11px] text-[#6b7280]">
                        No attachments submitted.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="h-8 rounded border border-[#a9b3c5] bg-[#f7f8fa] text-[10px] font-semibold text-[#252d3f]"
                    onClick={() => {
                      setViewRow(null);
                      setViewMode(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white">
                    Mark Loan Request Submitted
                  </button>
                </div>
              </div>
            </aside>
          ) : (
            <aside className="h-full w-full max-w-[392px] overflow-y-auto border-l border-[#dfe3ea] bg-white shadow-[-10px_0_24px_rgba(15,23,42,0.14)]">
              <div className="border-b border-[#dfe3ea] px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[24px] font-semibold leading-none text-[#1f2432]">{viewRow.loanRefNo}</div>
                    <div className="mt-1 text-xs font-medium leading-none text-[#2a3141]">{viewRow.customer}</div>
                  </div>
                  <button
                    className="rounded border border-[#b7beca] p-1 text-[#596273] hover:bg-[#eef1f5]"
                    onClick={() => {
                      setViewRow(null);
                      setViewMode(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 px-4 py-3 text-[10px]">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Customer</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.customer}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Customer Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.customerPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Vendor</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.vendor}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Vendor Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.vendorPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Bank POC</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.bankPocName}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Bank POC Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.bankPocPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">vendor email</div>
                      <div className="mt-1 break-all text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.vendorEmail}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Project Value</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.projectValue}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Landmark className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Bank/NBFC</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.bank}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Updated on</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.updatedOn}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Disbursed Amount</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.disbursedAmount === "--" ? "Rs 5,12,000" : viewRow.disbursedAmount}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ListChecks className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Status</div>
                      <div className="mt-1 inline-block rounded-[3px] bg-[#f5d2ab] px-2 py-[3px] text-[10px] font-medium text-[#87592d]">
                        {viewRow.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Pending Amount</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">
                        {viewRow.pendingAmount === "--" ? "Rs 5,12,000" : viewRow.pendingAmount}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Region</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.region}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1f2532]">Remarks</label>
                    <div className="min-h-[72px] rounded-md border border-[#ccd3df] bg-[#f7f8fa] p-2 text-[10px] text-[#7a8292]">
                    {viewRow.remarks}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1f2532]">Files</label>
                  <div className="space-y-2">
                    {viewRow.attachments.length ? (
                      viewRow.attachments.map((file, index) => (
                      <div
                        key={`${file.id}-${index}`}
                        className="flex items-center justify-between rounded-md border border-[#c7d2e4] bg-[#dfe7f5] p-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-white p-1.5">
                            <FileText className="h-3.5 w-3.5 text-[#3a7bd5]" />
                          </div>
                          <div>
                            <div className="text-[12px] font-semibold text-[#1f2532]">{file.name}</div>
                            <div className="text-[10px] text-[#6f7788]">{file.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded border border-[#b7c2d8] bg-white p-1 text-[#204b7a]"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (file.url) {
                                window.open(file.url, "_blank", "noopener,noreferrer");
                              } else {
                                handleDownload(viewRow.id);
                              }
                            }}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="rounded bg-[#10153d] p-1 text-white"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (file.url) {
                                window.open(file.url, "_blank", "noopener,noreferrer");
                              } else {
                                handleDownload(viewRow.id);
                              }
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      ))
                    ) : (
                      <div className="rounded-md border border-[#c7d2e4] bg-[#f7f8fa] p-2 text-[10px] text-[#6f7788]">
                        No files uploaded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      ) : null}

      {updateRow ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <aside className="h-full w-full max-w-[430px] overflow-y-auto border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-2xl font-medium text-[#1b2230]">Update</div>
              <button
                className="rounded border border-[#ced4df] p-1 text-[#5a6373] hover:bg-[#f2f4f8]"
                onClick={() => setUpdateRow(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 px-4 py-3 text-[10px] text-[#2b3445]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[#6f7788]">Loan Ref No</label>
                  <input value={updateRow.loanRefNo} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Customer Name*</label>
                  <input value={updateRow.customer} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Customer Number</label>
                  <input value={updateRow.customerPhone} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Project Value</label>
                  <input value={updateRow.projectValue} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1f2532]">Vendor*</label>
                  <div className="relative">
                    <select className="h-8 w-full appearance-none rounded border border-[#e0e4ec] bg-[#f9fafc] px-2">
                      <option>{updateRow.vendor}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#697283]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Vendor Phone</label>
                  <input value={updateRow.vendorPhone} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[#6f7788]">Bank /NBFC</label>
                <input value={updateRow.bank} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-[#1f2532]">Region</label>
                  <div className="relative">
                    <select className="h-8 w-full appearance-none rounded border border-[#e0e4ec] bg-[#f9fafc] px-2">
                      <option>{updateRow.region}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#697283]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1f2532]">Status</label>
                  <div className="relative">
                    <select
                      className="h-8 w-full appearance-none rounded border border-[#e0e4ec] bg-[#f8dcc5] px-2 outline-none"
                      value={selectedStatus}
                      onChange={(event) => {
                        const newStatus = event.target.value as LoanStatus;
                        setUpdateStatusValue(newStatus);
                      }}
                    >
                      {statusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#697283]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Project Value</label>
                  <input value={updateRow.projectValue} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Updated on</label>
                  <input value={updateRow.updatedOn} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1f2532]">Disbursed Amount*</label>
                  <input value={updateRow.disbursedAmount === "--" ? "Rs 5,12,000" : updateRow.disbursedAmount} readOnly className="h-8 w-full rounded border border-[#d2d8e2] bg-white px-2 font-semibold" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1f2532]">Pending Amount*</label>
                  <input value={updateRow.pendingAmount === "--" ? "Rs 5,12,000" : updateRow.pendingAmount} readOnly className="h-8 w-full rounded border border-[#d2d8e2] bg-white px-2 font-semibold" />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[#1f2532]">Files</label>
                <div className="space-y-1.5">
                  {updateRow.attachments.length ? (
                    updateRow.attachments.map((file, index) => (
                      <div
                        key={`${file.id}-${index}`}
                        className="flex items-center justify-between rounded border border-[#cfd7e7] bg-[#eaf1ff] p-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-white p-1">
                            <FileText className="h-3.5 w-3.5 text-[#3a7bd5]" />
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold">{file.name}</div>
                            <div className="text-[9px] text-[#6f7788]">{file.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded border border-[#ef8f8f] p-1 text-[#e24b4b]"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="rounded bg-[#10153d] p-1 text-white"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded border border-[#cfd7e7] bg-[#f7f8fa] p-2 text-[10px] text-[#6f7788]">
                      No files uploaded.
                    </div>
                  )}
                  <button
                    className="flex h-8 w-full items-center justify-center gap-1 rounded border border-[#3f4a67] bg-white text-[10px] font-semibold text-[#303954]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => handleUploadFiles(event.target.files)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[#1f2532]">Remarks</label>
                <textarea
                  rows={4}
                  value={updateRemarks}
                  onChange={(event) => setUpdateRemarks(event.target.value)}
                  className="w-full rounded border border-[#d5dbe6] p-2 text-[10px] outline-none focus:border-[#2f7df6]"
                  placeholder="Type Remarks"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3">
                <button
                  className="h-8 rounded border border-[#cfd4df] bg-white text-[10px] font-semibold text-[#30384a]"
                  onClick={() => setUpdateRow(null)}
                >
                  Cancel
                </button>
                <button
                  className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white"
                  onClick={handleSaveUpdate}
                  disabled={isSavingUpdate}
                >
                  {isSavingUpdate ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
