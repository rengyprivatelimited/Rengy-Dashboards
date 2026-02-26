"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Mail,
  MoreVertical,
  Search,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  User,
  X,
  PencilLine,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type Priority = "High" | "Medium";
type Status = "Open" | "Closed";

type SupportRow = {
  id: number;
  requestId: string;
  raisedBy: string;
  team: string;
  email: string;
  phone: string;
  priority: Priority;
  status: Status;
  openTime: string;
  closeTime: string;
  notes: string;
  assigned: "Admin_John" | "Assign now";
};

const initialRows: SupportRow[] = mockData.support.rows as SupportRow[];
const supportFilterVendors: string[] = mockData.support.filterVendors as string[];
const supportFilterStatuses: string[] = mockData.support.filterStatuses as string[];

function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-[#dfe5ee] px-3 py-2 text-xs">
      <div className="flex items-center gap-3">
        <span className="text-[#404957]">Page 1 of 10</span>
        <button className="inline-flex h-8 items-center rounded border border-[#cfd6e1] px-3 text-[#677082]">
          Show 10 rows
          <ChevronDown className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-[#414a58]">Previous</button>
        <button className="h-8 w-7 rounded-md bg-[#12153f] text-white">1</button>
        {["2", "4", "5", "6", "7"].map((page) => (
          <button key={page} className="h-8 w-7 rounded-md border border-[#d5d9e1] text-[#606979]">
            {page}
          </button>
        ))}
        <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-[#414a58]">Next</button>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [rows, setRows] = useState<SupportRow[]>(initialRows);
  const [showFilter, setShowFilter] = useState(false);
  const [showVendorMenu, setShowVendorMenu] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [viewRow, setViewRow] = useState<SupportRow | null>(null);
  const [editRow, setEditRow] = useState<SupportRow | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeMenus(event: MouseEvent) {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setShowFilter(false);
        setShowVendorMenu(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpenRowMenu(null);
      }
    }
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const openCount = rows.filter((row) => row.status === "Open").length;
  const closedCount = rows.filter((row) => row.status === "Closed").length;

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Support" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Admin</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-[220px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
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

          <section className="p-4">
            <h1 className="text-[32px] font-semibold text-[#1d2028]">Support</h1>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex h-9 w-[270px] items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                Search
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 rounded border border-[#d2dbeb] bg-[#e4efff] px-3 text-[14px] text-[#d32222]">Open : {openCount}</button>
                <button className="h-9 rounded border border-[#d2dbeb] bg-[#e4efff] px-3 text-[14px] text-[#243a66]">Closed : {closedCount}</button>
                <div className="relative" ref={filterRef}>
                  <button
                    className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] bg-white px-3 text-[13px] text-[#7a8494]"
                    onClick={() => setShowFilter((prev) => !prev)}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </button>
                  {showFilter ? (
                    <div className="absolute right-0 top-10 z-20 w-[270px] rounded-[18px] border border-[#d9dde4] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
                      <div className="border-b border-[#eceff4] px-4 py-2 text-[14px] font-semibold text-[#1f2542]">Filter by</div>
                      <button className="flex w-full items-center justify-between border-b border-[#eceff4] px-4 py-3 text-[13px] text-[#646b79]">
                        <span>Date Range</span>
                        <CalendarDays className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button
                          className="flex w-full items-center justify-between border-b border-[#eceff4] px-4 py-3 text-[13px] text-[#646b79]"
                          onClick={() => setShowVendorMenu((prev) => !prev)}
                        >
                          <span>Vendor</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        {showVendorMenu ? (
                          <div className="absolute left-0 top-[58px] z-30 w-[270px] rounded-[22px] border border-[#d9dde4] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]">
                            <div className="border-b border-dashed border-[#8d6bff] px-4 py-2 text-[14px] font-semibold text-[#1f2542]">
                              Vendors
                            </div>
                            {supportFilterVendors.map((vendor) => (
                              <label
                                key={vendor}
                                className="flex items-center gap-3 border-b border-dashed border-[#8d6bff] px-4 py-3 text-[13px] text-[#6a717f]"
                              >
                                <input type="checkbox" className="h-5 w-5 rounded border-[#bcc5d2]" />
                                {vendor}
                              </label>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      {supportFilterStatuses.map((item) => (
                        <label key={item} className="flex items-center gap-3 border-b border-[#eceff4] px-4 py-3 text-[13px] text-[#646b79] last:border-b-0">
                          <input type="checkbox" className="h-5 w-5 rounded border-[#bcc5d2]" />
                          {item}
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button className="inline-flex h-9 items-center gap-1 rounded border border-[#d8dde5] bg-white px-3 text-[13px] text-[#7a8494]">
                  Customise
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 overflow-auto rounded-lg border border-[#dce1e8] bg-white">
              <table className="w-full min-w-[2050px] text-left text-[14px]">
                <thead>
                  <tr className="h-11 bg-[#d4dfdd] text-[#55606f]">
                    <th className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" /></th>
                    <th className="px-2">Request ID</th>
                    <th className="px-2 text-[#8f97a8]">⇵</th>
                    <th className="px-2">Requested By</th>
                    <th className="px-2">Email</th>
                    <th className="px-2">Phone</th>
                    <th className="px-2">Priority</th>
                    <th className="px-2">Status</th>
                    <th className="px-2">Time</th>
                    <th className="px-2">Notes</th>
                    <th className="px-2">Assigned to</th>
                    <th className="px-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="h-[60px] border-t border-[#e6eaf1] odd:bg-[#f8f9fb]">
                      <td className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" /></td>
                      <td className="px-2">{row.requestId}</td>
                      <td className="px-2" />
                      <td className="px-2">
                        <div>{row.raisedBy}</div>
                        <div className="font-semibold">{row.team}</div>
                      </td>
                      <td className="px-2">{row.email}</td>
                      <td className="px-2">{row.phone}</td>
                      <td className="px-2">
                        <span className={row.priority === "High" ? "font-semibold text-[#eb3737]" : "font-semibold text-[#997b2c]"}>{row.priority}</span>
                      </td>
                      <td className="px-2">
                        <span className={`rounded px-2 py-1 text-[12px] font-semibold ${row.status === "Open" ? "bg-[#ffe3e3] text-[#eb3737]" : "bg-[#cbefcf] text-[#1e9642]"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2">
                        <div>{row.openTime}</div>
                        <div>{row.closeTime}</div>
                      </td>
                      <td className="max-w-[280px] px-2">{row.notes}</td>
                      <td className="px-2">
                        {row.assigned === "Admin_John" ? (
                          <button className="h-9 w-[150px] rounded border border-[#cfd6e2] bg-[#ebeff7] px-2 text-left font-semibold text-[#364764]">
                            Admin_John
                          </button>
                        ) : (
                          <button className="flex h-9 w-[150px] items-center justify-between rounded border border-[#f2a9a9] bg-[#ffe6e6] px-3 text-[#db3131]">
                            <span className="font-semibold">Assign now</span>
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                      <td className="relative px-2">
                        <div ref={openRowMenu === row.id ? menuRef : null} className="relative">
                          <button
                            className="rounded p-1 text-[#586071]"
                            onClick={() => setOpenRowMenu((prev) => (prev === row.id ? null : row.id))}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openRowMenu === row.id ? (
                            <div className="absolute right-0 top-7 z-30 w-[130px] overflow-hidden rounded-2xl border border-[#d9dde4] bg-white shadow-[0_12px_22px_rgba(15,23,42,0.14)]">
                              <button
                                className="flex h-11 w-full items-center gap-2 border-b border-[#ebedf2] px-3 text-[12px] text-[#6f7684]"
                                onClick={() => {
                                  setEditRow(row);
                                  setOpenRowMenu(null);
                                }}
                              >
                                <PencilLine className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                className="flex h-11 w-full items-center gap-2 border-b border-[#ebedf2] px-3 text-[12px] text-[#6f7684]"
                                onClick={() => {
                                  setViewRow(row);
                                  setOpenRowMenu(null);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                              <button
                                className="flex h-11 w-full items-center gap-2 px-3 text-[12px] text-[#ff3b3b]"
                                onClick={() => {
                                  setRows((prev) => prev.filter((item) => item.id !== row.id));
                                  setOpenRowMenu(null);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
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
              <Pagination />
            </div>
          </section>
        </main>
      </div>

      {viewRow ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <aside className="flex h-full w-full max-w-[560px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="border-b border-[#e4e7ee] px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-[#1b2230]">Unable to access dashboard after login</h3>
                    <span className={`text-[12px] font-semibold ${viewRow.priority === "High" ? "text-[#eb3737]" : "text-[#997b2c]"}`}>{viewRow.priority}</span>
                    <span className="rounded bg-[#f0f0f0] px-2 py-1 text-[12px]">{viewRow.status}</span>
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-[#2f3f61]">Ticket ID: {viewRow.requestId}</div>
                </div>
                <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setViewRow(null)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-b border-[#e4e7ee] px-4 py-4 text-[14px] text-[#1f2532]">
              <div className="flex gap-2">
                <Building2 className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Project</div>
                  <div className="font-semibold">SunPower Solutions</div>
                </div>
              </div>
              <div className="flex gap-2">
                <User className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Raised by</div>
                  <div className="font-semibold">{viewRow.raisedBy} ({viewRow.team})</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Phone</div>
                  <div className="font-semibold">{viewRow.phone}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Email</div>
                  <div className="font-semibold">{viewRow.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Time</div>
                  <div className="font-semibold">{viewRow.openTime}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Status</div>
                  <select
                    className="mt-1 h-8 w-[140px] rounded border border-[#d7dce7] bg-[#f7f8fb] px-2 text-[13px]"
                    value={viewRow.status}
                    onChange={(event) => {
                      const status = event.target.value as Status;
                      setViewRow((prev) => (prev ? { ...prev, status } : prev));
                      setRows((prev) => prev.map((row) => (row.id === viewRow.id ? { ...row, status } : row)));
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-4 py-3">
              <h4 className="text-[24px] font-semibold text-[#1f2532]">Assigned To</h4>
              <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-5 text-[14px] text-[#1f2532]">
                <div className="flex gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                  <div>
                    <div className="text-[#465062]">Contact Person</div>
                    <div className="font-semibold">Robert Wilson</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                  <div>
                    <div className="text-[#465062]">Team</div>
                    <div className="font-semibold">Operation Team</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                  <div>
                    <div className="text-[#465062]">Phone</div>
                    <div className="font-semibold">+1555-001</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                  <div>
                    <div className="text-[#465062]">Email</div>
                    <div className="font-semibold">alex@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
              <button className="h-9 rounded border border-[#1d2340] bg-white text-[14px] font-semibold text-[#1d2340]" onClick={() => setViewRow(null)}>
                Cancel
              </button>
              <button className="h-9 rounded bg-[#11163f] text-[14px] font-semibold text-white">Save</button>
            </div>
          </aside>
        </div>
      ) : null}

      {editRow ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <aside className="flex h-full w-full max-w-[560px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="border-b border-[#e4e7ee] px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-[#1b2230]">Unable to access dashboard after login</h3>
                    <span className="rounded bg-[#f0f0f0] px-2 py-1 text-[12px]">{editRow.status}</span>
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-[#2f3f61]">Ticket ID: {editRow.requestId}</div>
                </div>
                <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setEditRow(null)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-b border-[#e4e7ee] px-4 py-4 text-[14px] text-[#1f2532]">
              <div className="flex gap-2">
                <Building2 className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Project</div>
                  <div className="font-semibold">SunPower Solutions</div>
                </div>
              </div>
              <div className="flex gap-2">
                <User className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Raised by</div>
                  <div className="font-semibold">{editRow.raisedBy} ({editRow.team})</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Phone</div>
                  <div className="font-semibold">{editRow.phone}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Email</div>
                  <div className="font-semibold">{editRow.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Time</div>
                  <div className="font-semibold">{editRow.openTime}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-[#1f4b84]" />
                <div>
                  <div className="text-[#465062]">Status</div>
                  <div className="font-semibold">{editRow.status}</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3">
              <h4 className="text-[24px] font-semibold text-[#1f2532]">Assigned To</h4>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[14px]">
                <div>
                  <label className="mb-1 block font-semibold">Team*</label>
                  <select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5">
                    <option>Operation Team</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">POC*</label>
                  <select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5">
                    <option>Rohith</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Phone*</label>
                  <input value="Phone" readOnly className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Email*</label>
                  <input value="sample@gmail.com" readOnly className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Priority*</label>
                  <select
                    className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5"
                    value={editRow.priority}
                    onChange={(event) => setEditRow((prev) => (prev ? { ...prev, priority: event.target.value as Priority } : prev))}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
              <button className="h-9 rounded border border-[#1d2340] bg-white text-[14px] font-semibold text-[#1d2340]" onClick={() => setEditRow(null)}>
                Cancel
              </button>
              <button
                className="h-9 rounded bg-[#11163f] text-[14px] font-semibold text-white"
                onClick={() => {
                  if (!editRow) return;
                  setRows((prev) => prev.map((row) => (row.id === editRow.id ? editRow : row)));
                  setEditRow(null);
                }}
              >
                Update
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}


