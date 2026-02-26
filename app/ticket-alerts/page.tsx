"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type TicketPriority = "High" | "Medium";
type TicketStatus = "Resolved" | "Open";

type TicketRow = {
  id: number;
  ticketId: string;
  raisedBy: string;
  team: string;
  description: string;
  date: string;
  time: string;
  priority: TicketPriority;
  assignedTo: string;
  status: TicketStatus;
};

type AlertRow = {
  id: number;
  title: string;
  description: string;
  severity: "Success" | "Info" | "Error";
  unread: boolean;
};

const initialTickets: TicketRow[] = mockData.ticketAlerts.tickets as TicketRow[];
const initialAlerts: AlertRow[] = mockData.ticketAlerts.alerts as AlertRow[];
const ticketTeams: string[] = mockData.ticketAlerts.teams as string[];
const ticketPriorities: string[] = mockData.ticketAlerts.priorities as string[];
const ticketStatuses: string[] = mockData.ticketAlerts.statusOptions as string[];

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
          <button key={page} className="h-8 w-7 rounded-md border border-[#d5d9e1] text-[#606979]">{page}</button>
        ))}
        <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-[#414a58]">Next</button>
      </div>
    </div>
  );
}

export default function TicketAlertsPage() {
  const [activeTab, setActiveTab] = useState<"alerts" | "tickets">("alerts");
  const [tickets, setTickets] = useState<TicketRow[]>(initialTickets);
  const [alerts, setAlerts] = useState<AlertRow[]>(initialAlerts);
  const [showFilter, setShowFilter] = useState(false);
  const [openTicket, setOpenTicket] = useState<TicketRow | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeFilter(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", closeFilter);
    return () => document.removeEventListener("mousedown", closeFilter);
  }, []);

  const unreadCount = alerts.filter((item) => item.unread).length;

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Ticket & Alerts" />

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
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Tickets &amp; Notifications</h1>
                <p className="mt-1 text-[14px] text-[#6f7888]">Manage alerts and escalations</p>
              </div>
              <button className="inline-flex h-11 items-center gap-2 rounded bg-[#11163f] px-4 text-[15px] font-semibold text-white" onClick={() => setShowCreate(true)}>
                Raise a Ticket
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex h-9 w-[280px] rounded border border-[#dde1e8] bg-[#f2f4f7] p-0.5 text-[15px] font-semibold">
                <button className={`flex-1 rounded ${activeTab === "alerts" ? "bg-[#11163f] text-white" : "text-[#7a8494]"}`} onClick={() => setActiveTab("alerts")}>Alerts</button>
                <button className={`flex-1 rounded ${activeTab === "tickets" ? "bg-[#11163f] text-white" : "text-[#7a8494]"}`} onClick={() => setActiveTab("tickets")}>Tickets</button>
              </div>

              {activeTab === "alerts" ? (
                <div className="flex items-center gap-3 text-[13px] text-[#6f7787]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#bcc5d2]"
                      onChange={() => setAlerts((prev) => prev.map((item) => ({ ...item, unread: false })))}
                    />
                    Mark as all read
                  </label>
                  <span className="rounded bg-[#d8e7ff] px-2 py-1 text-[#2f4b84]">Unread : {unreadCount} | Total :{alerts.length}</span>
                </div>
              ) : null}
            </div>

            {activeTab === "alerts" ? (
              <div className="mt-3 space-y-2">
                {alerts.map((alert) => (
                  <article key={alert.id} className={`rounded-lg border border-[#dde3ec] p-3 ${alert.unread ? "bg-[#eeecff]" : "bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full p-1.5 ${alert.severity === "Error" ? "bg-[#fde1e1]" : "bg-[#e5ecff]"}`}>
                        <Mail className="h-3.5 w-3.5 text-[#5f6a82]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-semibold text-[#202737]">{alert.title}</h3>
                          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${alert.severity === "Success" ? "bg-[#d8f3da] text-[#2f8c41]" : alert.severity === "Info" ? "bg-[#ffe9cf] text-[#9a6a2a]" : "bg-[#ffe0e0] text-[#cf3535]"}`}>
                            {alert.severity === "Error" ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {alert.severity}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[14px] text-[#303846]">{alert.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-[#e4e8ef] pt-2 text-[13px] text-[#444e5e]">
                      <span>Jan 17 , 18:00</span>
                      <label className="inline-flex items-center gap-2 text-[#878f9d]">
                        <input type="checkbox" checked={!alert.unread} onChange={() => setAlerts((prev) => prev.map((item) => (item.id === alert.id ? { ...item, unread: !item.unread } : item)))} className="h-4 w-4 rounded border-[#bcc5d2]" />
                        {alert.unread ? "Mark as unread" : "Mark as read"}
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-8 w-[190px] items-center gap-2 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9aa2b1]">
                    <Search className="h-3.5 w-3.5" />
                    Search
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={filterRef}>
                      <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-3 text-[11px] text-[#7a8494]" onClick={() => setShowFilter((prev) => !prev)}>
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      {showFilter ? (
                        <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-[#d9dce2] bg-white py-1.5 text-xs shadow-[0_10px_20px_rgba(16,24,40,0.12)]">
                          <div className="border-b border-[#ebedf2] px-3 py-2 font-medium text-[#535a68]">Filter by</div>
                          <button className="flex w-full items-center justify-between px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]"><span>Date Range</span><CalendarDays className="h-3.5 w-3.5" /></button>
                          {[...ticketTeams, ...ticketPriorities, ...ticketStatuses].map((item) => (
                            <label key={item} className="flex w-full items-center gap-2 px-3 py-2 text-[#5f6675] hover:bg-[#f7f8fb]">
                              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#cad1dd]" />
                              {item}
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] px-3 text-[11px] text-[#7a8494]">Sort<ChevronDown className="h-3.5 w-3.5" /></button>
                    <span className="rounded bg-[#d8e7ff] px-2 py-1 text-[13px] text-[#2f4b84]">Open : {tickets.filter((item) => item.status === "Open").length}</span>
                  </div>
                </div>

                <div className="overflow-auto rounded-lg border border-[#dce1e8] bg-white">
                  <table className="w-full min-w-[1700px] text-left text-[14px]">
                    <thead>
                      <tr className="h-10 bg-[#d4dfdd] text-[#55606f]">
                        <th className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" /></th>
                        <th className="px-2">Ticket ID</th>
                        <th className="px-2 text-[#8f97a8]">?</th>
                        <th className="px-2">Raised by</th>
                        <th className="px-2">Description</th>
                        <th className="px-2">Time &amp; Date</th>
                        <th className="px-2">Priority</th>
                        <th className="px-2">Assigned to</th>
                        <th className="px-2">Status</th>
                        <th className="px-2" />
                        <th className="px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((row) => (
                        <tr key={row.id} className="h-[58px] cursor-pointer border-t border-[#e6eaf1] odd:bg-[#f8f9fb]" onClick={() => setOpenTicket(row)}>
                          <td className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" onClick={(event) => event.stopPropagation()} /></td>
                          <td className="px-2">{row.ticketId}</td>
                          <td className="px-2" />
                          <td className="px-2"><div>{row.raisedBy}</div><div className="font-semibold">{row.team}</div></td>
                          <td className="px-2">{row.description}</td>
                          <td className="px-2"><div className="font-semibold">{row.date}</div><div>{row.time}</div></td>
                          <td className="px-2"><span className={`rounded px-2 py-1 text-[12px] font-semibold ${row.priority === "High" ? "bg-[#ffe3e3] text-[#eb3737]" : "bg-[#f4edd8] text-[#9a7931]"}`}>{row.priority}</span></td>
                          <td className="px-2"><select className="h-8 w-[140px] rounded border border-[#d7dce7] bg-[#f7f8fb] px-2 text-[13px]" onClick={(event) => event.stopPropagation()}><option>{row.assignedTo}</option></select></td>
                          <td className="px-2"><span className={`rounded px-2 py-1 text-[12px] font-semibold ${row.status === "Resolved" ? "bg-[#cbefcf] text-[#1e9642]" : "bg-[#ffe4e4] text-[#ea3b3b]"}`}>{row.status}</span></td>
                          <td className="px-2 text-[#9aa1af]"><MessageSquare className="h-4 w-4" /></td>
                          <td className="px-2 text-[#586071]"><MoreVertical className="h-4 w-4" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination />
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {openTicket ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <aside className="flex h-full w-full max-w-[515px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="border-b border-[#e4e7ee] px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[30px] font-medium leading-none text-[#1b2230]">Ticket Overview</h3>
                    <span className="rounded bg-[#e7ecff] px-2 py-0.5 text-[12px] text-[#304b82]">{openTicket.status}</span>
                    <span className={`text-[12px] font-semibold ${openTicket.priority === "High" ? "text-[#e23a3a]" : "text-[#997b2c]"}`}>{openTicket.priority}</span>
                  </div>
                  <div className="mt-1 text-[12px] text-[#687184]">Ticket ID: {openTicket.ticketId}</div>
                </div>
                <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setOpenTicket(null)}><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-[#e4e7ee] px-4 py-4 text-[14px]">
              <div className="flex gap-2"><Building2 className="mt-0.5 h-4 w-4 text-[#1f4b84]" /><div><div className="text-[#465062]">Project</div><div className="mt-1 font-semibold text-[#1f2532]">SunPower Solutions</div></div></div>
              <div className="flex gap-2"><User className="mt-0.5 h-4 w-4 text-[#1f4b84]" /><div><div className="text-[#465062]">Raised by</div><div className="mt-1 font-semibold text-[#1f2532]">{openTicket.raisedBy} ({openTicket.team})</div></div></div>
              <div className="flex gap-2"><Clock3 className="mt-0.5 h-4 w-4 text-[#1f4b84]" /><div><div className="text-[#465062]">Reported on</div><div className="mt-1 font-semibold text-[#1f2532]">{openTicket.date}, {openTicket.time}</div></div></div>
            </div>

            <div className="px-4 py-3">
              <h4 className="text-[24px] font-semibold text-[#1f2532]">Activity Timeline</h4>
              <textarea rows={4} placeholder="Add you Remarks" className="mt-2 w-full rounded border border-[#d5dbe6] bg-[#f4f5ff] p-3 text-[14px] outline-none" />
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
              <button className="h-10 rounded border border-[#1d2340] bg-white text-[16px] font-semibold text-[#1d2340]">Assign / Reassign</button>
              <button className="h-10 rounded bg-[#11163f] text-[16px] font-semibold text-white" onClick={() => {
                setTickets((prev) => prev.map((item) => (item.id === openTicket.id ? { ...item, status: "Resolved" } : item)));
                setOpenTicket(null);
              }}>Mark as Resolved</button>
            </div>
          </aside>
        </div>
      ) : null}

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <aside className="flex h-full w-full max-w-[520px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="border-b border-[#e4e7ee] px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[30px] font-medium leading-none text-[#1b2230]">Create New Ticket</h3>
                  <div className="mt-1 text-[12px] text-[#687184]">Ticket ID: #{1000 + tickets.length + 1}</div>
                </div>
                <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setShowCreate(false)}><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-4 text-[14px] text-[#1f2532]">
              <div><label className="mb-1 block font-semibold">Requested Team *</label><select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5"><option>Select</option></select></div>
              <div><label className="mb-1 block font-semibold">Priority*</label><select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5"><option>Select</option></select></div>
              <div><label className="mb-1 block font-semibold">Assigned to</label><select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5"><option>Select Team</option></select></div>
              <div><label className="mb-1 block font-semibold">POC*</label><select className="h-10 w-full rounded border border-[#d6dbe6] bg-[#f6f7fa] px-2.5"><option>Manager</option></select></div>
              <div className="col-span-2"><label className="mb-1 block font-semibold">Remarks</label><textarea rows={4} placeholder="Add you Remarks" className="w-full rounded border border-[#d5dbe6] bg-[#f4f5ff] p-3 text-[14px] outline-none" /></div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-4">
              <button className="h-10 rounded border border-[#1d2340] bg-white text-[16px] font-semibold text-[#1d2340]" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="h-10 rounded bg-[#11163f] text-[16px] font-semibold text-white" onClick={() => {
                setTickets((prev) => [{
                  id: Date.now(),
                  ticketId: `#${1000 + prev.length}`,
                  raisedBy: "Athul",
                  team: "Sales Team",
                  description: "New ticket raised from drawer",
                  date: "12-10-2025",
                  time: "10:30 PM",
                  priority: "Medium",
                  assignedTo: "Admin_John",
                  status: "Open",
                }, ...prev]);
                setShowCreate(false);
                setActiveTab("tickets");
              }}>Raise</button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
