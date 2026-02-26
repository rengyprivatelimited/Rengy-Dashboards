"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpDown,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
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
import { mockData } from "@/lib/mock-data";

type LoanRequestRow = {
  id: number;
  leadId: string;
  customer: string;
  vendor: string;
  projectValue: string;
  bank: string;
  requestedOn: string;
};

type LoanStatus = "Documents Pending" | "Rejected" | "Hold" | "Disbursed" | "Approved" | "Log In Pending";

type LoanStatusRow = LoanRequestRow & {
  updatedOn: string;
  status: LoanStatus;
  remarks: string;
  disbursedAmount: string;
  pendingAmount: string;
  region: string;
};

const loanRequests: LoanRequestRow[] = mockData.loanManagement.loanRequests as LoanRequestRow[];
const loanStatuses: LoanStatusRow[] = mockData.loanManagement.loanStatuses as LoanStatusRow[];

const statusOptions: LoanStatus[] = mockData.loanManagement.statusOptions as LoanStatus[];

function statusClassName(status: LoanStatus) {
  if (status === "Documents Pending") return "bg-[#f8dcc5] text-[#8a5a2a]";
  if (status === "Rejected") return "bg-[#fbe0e0] text-[#d92f2f]";
  if (status === "Hold") return "bg-[#dde0ee] text-[#273067]";
  if (status === "Disbursed") return "bg-[#dff1df] text-[#2d7a3a]";
  if (status === "Approved") return "bg-[#dbeede] text-[#2f7b3d]";
  return "bg-[#d8edd9] text-[#2f7736]";
}

function PageSelect() {
  return (
    <div className="flex items-center gap-2">
      <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58]">Previous</button>
      <button className="h-8 w-7 rounded-md bg-[#12153f] text-xs font-semibold text-white">1</button>
      {["2", "4", "5", "6", "7"].map((page) => (
        <button
          key={page}
          className="h-8 w-7 rounded-md border border-[#d5d9e1] text-xs text-[#606979]"
        >
          {page}
        </button>
      ))}
      <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58]">Next</button>
    </div>
  );
}

function AttachmentCell() {
  return (
    <div className="flex items-center gap-2">
      <span>2 Files attached</span>
      <button
        className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#cfd5df] text-[#244f80]"
        onClick={(event) => event.stopPropagation()}
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function LoanManagementPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "status">("requests");
  const [requestRows, setRequestRows] = useState<LoanRequestRow[]>(loanRequests);
  const [statusRows, setStatusRows] = useState<LoanStatusRow[]>(loanStatuses);
  const [showFilter, setShowFilter] = useState(false);
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [openStatusRow, setOpenStatusRow] = useState<number | null>(null);
  const [viewRow, setViewRow] = useState<LoanStatusRow | null>(null);
  const [viewMode, setViewMode] = useState<"requests" | "status" | null>(null);
  const [updateRow, setUpdateRow] = useState<LoanStatusRow | null>(null);
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

  const rows = activeTab === "requests" ? requestRows : statusRows;

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
    ? statusRows.find((item) => item.id === updateRow.id)?.status ?? "Documents Pending"
    : "Documents Pending";

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
                  <div className="flex h-9 w-[190px] items-center gap-2 rounded border border-[#d8dde5] px-3 text-xs text-[#9aa2b1]">
                    <Search className="h-4 w-4" />
                    Search
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
                      <div className="absolute right-0 top-11 z-30 w-32 rounded-xl border border-[#d9dce2] bg-white py-1.5 text-xs shadow-[0_10px_20px_rgba(16,24,40,0.12)]">
                        <div className="border-b border-[#ebedf2] px-3 py-2 font-medium text-[#535a68]">
                          Filter by
                        </div>
                        <button className="flex w-full items-center justify-between px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]">
                          <span>Date Range</span>
                          <CalendarDays className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex w-full items-center justify-between px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]">
                          <span>Region</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex w-full items-center justify-between px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]">
                          <span>Status</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex w-full items-center justify-between px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]">
                          <span>Vendor</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
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
                        <th className="border-b border-[#dce1e8] px-2">Lead ID</th>
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
                      {rows.map((row) => (
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
                          <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.leadId}</td>
                          <td className="border-b border-[#dce1e8] px-2">{row.customer}</td>
                          <td className="border-b border-[#dce1e8] px-2" />
                          <td className="border-b border-[#dce1e8] px-2">{row.vendor}</td>
                          <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.projectValue}</td>
                          <td className="border-b border-[#dce1e8] px-2">{row.bank}</td>
                          <td className="border-b border-[#dce1e8] px-2">
                            <AttachmentCell />
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
                                      setRequestRows((prev) => prev.filter((item) => item.id !== row.id));
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
                        <th className="border-b border-[#dce1e8] px-2">Lead ID</th>
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
                      {statusRows.map((row) => (
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
                          <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.leadId}</td>
                          <td className="border-b border-[#dce1e8] px-2">{row.customer}</td>
                          <td className="border-b border-[#dce1e8] px-2" />
                          <td className="border-b border-[#dce1e8] px-2">{row.vendor}</td>
                          <td className="border-b border-[#dce1e8] px-2 font-semibold">{row.projectValue}</td>
                          <td className="border-b border-[#dce1e8] px-2">{row.bank}</td>
                          <td className="border-b border-[#dce1e8] px-2">
                            <AttachmentCell />
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
                                      setStatusRows((prev) => prev.filter((item) => item.id !== row.id));
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
                  <span>Page 1 of 10</span>
                  <button className="inline-flex h-8 items-center rounded-md border border-[#d1d5db] px-3 text-xs text-[#6b7280]">
                    Show 20 rows
                    <ChevronDown className="ml-2 h-3.5 w-3.5" />
                  </button>
                </div>
                <PageSelect />
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
                    <div className="text-[24px] font-semibold leading-none text-[#1f2432]">{viewRow.leadId}</div>
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
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">Murugan</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Requested On</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">12-02-2022</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Vendor</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">Athul</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Vendor Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">+912312 1231</div>
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
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">Athul</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] text-[#3f495d]">Contact</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">+912312 1231</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#d9dce4] pt-3">
                  <label className="mb-1 block text-xs font-semibold text-[#1f2532]">Assigned To</label>
                  <div className="relative">
                    <select className="h-8 w-full appearance-none rounded border border-[#bcc5d5] bg-[#edf0f3] px-2 text-[10px] text-[#1d2433]">
                      <option>Athul</option>
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
                    {["Aadhaar card", "Pan card", "Bank Statement"].map((file, index) => (
                      <div key={file} className="grid grid-cols-[1fr_1fr_1fr] items-center border-t border-[#dfe3ea] bg-[#f4f5f7] px-3 py-3">
                        <div className="text-[11px] font-medium text-[#1d2433]">{file}</div>
                        <div>
                          {index < 2 ? (
                            <>
                              <div className="text-[10px] font-medium text-[#1d2433]">12312-123123-123123</div>
                              <button className="mt-1 inline-flex items-center gap-1 rounded border border-[#b6c0d2] bg-white px-1.5 py-0.5 text-[10px] text-[#273247]">
                                2 Files attached
                                <Download className="h-3.5 w-3.5 text-[#1d4f84]" />
                              </button>
                            </>
                          ) : (
                            <button className="inline-flex items-center gap-1 rounded border border-[#b6c0d2] bg-white px-1.5 py-0.5 text-[10px] text-[#273247]">
                              2 Files attached
                              <Download className="h-3.5 w-3.5 text-[#1d4f84]" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#4ad66d] bg-[#e8ffef] text-[#2f9e44]">✓</span>
                          <button className="rounded border border-[#f2a0a0] bg-white px-2 py-1 text-[10px] text-[#e53935]">
                            Request Re - Submit
                          </button>
                        </div>
                      </div>
                    ))}
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
                    <div className="text-[24px] font-semibold leading-none text-[#1f2432]">{viewRow.leadId}</div>
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
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">Athul</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Customer Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">+912312 1231</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Vendor</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">{viewRow.vendor.split(" ")[0]}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Vendor Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">+912312 1231</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <User className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Bank POC</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">Athul</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">Bank POC Phone</div>
                      <div className="mt-1 text-xs font-semibold leading-none text-[#1d2433]">+912312 1231</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="mt-0.5 h-4 w-4 text-[#1c4b7e]" strokeWidth={1.7} />
                    <div>
                      <div className="text-[12px] font-medium text-[#3f495d]">vendor email</div>
                      <div className="mt-1 break-all text-xs font-semibold leading-none text-[#1d2433]">sample@gmail.com</div>
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
                    {["Aadhaar card.PDF", "Bank Statement .PDF", "Pan card .PDF"].map((fileName) => (
                      <div key={fileName} className="flex items-center justify-between rounded-md border border-[#c7d2e4] bg-[#dfe7f5] p-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-white p-1.5">
                            <FileText className="h-3.5 w-3.5 text-[#3a7bd5]" />
                          </div>
                          <div>
                            <div className="text-[12px] font-semibold text-[#1f2532]">{fileName}</div>
                            <div className="text-[10px] text-[#6f7788]">12 June, 10:30 PM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="rounded border border-[#b7c2d8] bg-white p-1 text-[#204b7a]">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded bg-[#10153d] p-1 text-white">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                  <label className="mb-1 block text-[#6f7788]">Lead ID</label>
                  <input value="#121212" readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Customer Name*</label>
                  <input value={updateRow.customer} readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
                </div>
                <div>
                  <label className="mb-1 block text-[#6f7788]">Customer Number</label>
                  <input value="+912312312" readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
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
                  <input value="+912232312" readOnly className="h-8 w-full rounded border border-[#e0e4ec] bg-[#f9fafc] px-2" />
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
                        setStatusRows((prev) =>
                          prev.map((currentRow) =>
                            currentRow.id === updateRow.id ? { ...currentRow, status: newStatus } : currentRow,
                          ),
                        );
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
                  <div className="flex items-center justify-between rounded border border-[#cfd7e7] bg-[#eaf1ff] p-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded bg-white p-1">
                        <FileText className="h-3.5 w-3.5 text-[#3a7bd5]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold">Aadhaar card.PDF</div>
                        <div className="text-[9px] text-[#6f7788]">12 June, 10:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="rounded border border-[#ef8f8f] p-1 text-[#e24b4b]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded bg-[#10153d] p-1 text-white">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded border border-[#cfd7e7] bg-[#eaf1ff] p-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded bg-white p-1">
                        <FileText className="h-3.5 w-3.5 text-[#3a7bd5]" />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold">Bank statement.PDF</div>
                        <div className="text-[9px] text-[#6f7788]">12 June, 10:30 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="rounded border border-[#ef8f8f] p-1 text-[#e24b4b]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded bg-[#10153d] p-1 text-white">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <button className="flex h-8 w-full items-center justify-center gap-1 rounded border border-[#3f4a67] bg-white text-[10px] font-semibold text-[#303954]">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Files
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[#1f2532]">Remarks</label>
                <textarea
                  rows={4}
                  defaultValue={updateRow.remarks === "--" ? "" : updateRow.remarks}
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
                  onClick={() => setUpdateRow(null)}
                >
                  Save
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

