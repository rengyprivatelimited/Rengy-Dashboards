"use client";

import type { ReactNode } from "react";
import { Bell, CalendarDays, ChevronDown, Search, SlidersHorizontal, Star } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

const kpis = mockData.reports.kpis;
const baseRows = mockData.reports.baseRows;

function PanelAction() {
  return (
    <div className="flex items-center gap-1">
      <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d7dce6] bg-white px-2.5 text-[10px] text-[#8a92a2]">
        <CalendarDays className="h-3.5 w-3.5" />
        Last 7 Days
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button className="inline-flex h-8 w-7 items-center justify-center rounded border border-[#d7dce6] bg-white text-[#9da5b3]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-[#e4e8ef] px-2 py-3 text-xs text-[#394151]">
      <div className="flex items-center gap-3">
        <span>Page 1 of 10</span>
        <button className="inline-flex h-8 items-center rounded border border-[#cbd2dd] px-3 text-xs text-[#6f7787]">
          Show 20 rows
          <ChevronDown className="ml-2 h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58]">Previous</button>
        <button className="h-8 w-7 rounded-md bg-[#12153f] text-xs font-semibold text-white">1</button>
        {["2", "4", "5", "6", "7"].map((page) => (
          <button key={page} className="h-8 w-7 rounded-md border border-[#d5d9e1] text-xs text-[#606979]">
            {page}
          </button>
        ))}
        <button className="h-8 rounded-md border border-[#d5d9e1] px-3 text-xs text-[#414a58]">Next</button>
      </div>
    </div>
  );
}

type SectionTableProps = {
  title: string;
  columns: string[];
  rowRenderer: (row: (typeof baseRows)[number], index: number) => ReactNode;
};

function SectionTable({ title, columns, rowRenderer }: SectionTableProps) {
  return (
    <section className="mt-4 rounded-lg border border-[#e2e6ed] bg-white p-3">
      <div className="border-b border-[#e3e7ee] pb-2">
        <h3 className="text-[14px] font-semibold leading-none text-[#1f2533]">{title}</h3>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex h-8 w-[150px] items-center gap-2 rounded border border-[#d8dde5] px-2.5 text-[11px] text-[#9aa2b1]">
          <Search className="h-3.5 w-3.5" />
          Search
        </div>
        <PanelAction />
      </div>

      <div className="mt-2 overflow-auto rounded-md border border-[#dce1e8]">
        <table className="w-full min-w-[1050px] text-left text-[12px]">
          <thead>
            <tr className="h-9 bg-[#d4dfdd] text-[#607081]">
              <th className="px-2">
                <input type="checkbox" className="h-4 w-4 rounded border-[#bcc5d2]" />
              </th>
              {columns.map((column) => (
                <th key={column} className="px-2 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baseRows.map((row, index) => (
              <tr key={`${row.id}-${index}`} className="h-[52px] border-t border-[#e6eaf1] odd:bg-[#f8f9fb]">
                <td className="px-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#bcc5d2]" />
                </td>
                {rowRenderer(row, index)}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </section>
  );
}

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Reports" />

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
              <h1 className="text-[18px] font-semibold leading-none text-[#1d2028]">Hi Akhil</h1>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] bg-white px-3 text-[11px] text-[#7c8596]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Monthly
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] bg-white px-3 text-[11px] text-[#7c8596]">
                  All
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 items-center gap-1 rounded border border-[#d8dde5] bg-white px-3 text-[11px] text-[#7c8596]">
                  Export
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2 2xl:grid-cols-4">
              {kpis.map((item) => (
                <article key={item.subtitle} className="rounded-lg border border-[#d8dde6] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[18px] font-semibold leading-none text-[#202634]">{item.title}</div>
                      <div className="mt-1 text-[12px] font-medium leading-tight text-[#222a38]">{item.subtitle}</div>
                      <div className="mt-1 text-[10px] text-[#39a965]">{item.note}</div>
                    </div>
                    <svg viewBox="0 0 72 36" className="h-8 w-14 text-[#1dbd65]">
                      <path d="M2 30 C16 28,18 12,30 16 C42 20,46 8,56 10 C62 12,66 4,70 2" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[2fr_1.1fr]">
              <section className="rounded-lg border border-[#e2e6ed] bg-white p-3">
                <div className="flex items-center justify-between border-b border-[#e3e7ee] pb-2">
                  <h3 className="text-[14px] font-semibold leading-none text-[#1f2533]">Project Through Funnel</h3>
                  <PanelAction />
                </div>
                <div className="mt-3 rounded border border-[#e5e9f0] p-2">
                  <div className="space-y-0.5">
                    {[
                      ["Site Survey", 52, "#4cc69f"],
                      ["DPR Approval", 24, "#bde8d8"],
                      ["Procurement", 33, "#8cd9c1"],
                      ["Installation", 42, "#64d4ae"],
                      ["Net metering", 47, "#59c8a3"],
                      ["Project Handover", 31, "#4f9d84"],
                    ].map(([label, width, color]) => (
                      <div key={label as string} className="flex items-center gap-2">
                        <div className="h-7" style={{ width: `${width}%`, backgroundColor: color as string }} />
                        <span className="text-[10px] text-[#7a8292]">{label as string}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between border-t border-[#eef1f6] px-2 pt-1 text-[9px] text-[#9da5b3]">
                    {["10", "20", "30", "40", "50", "60"].map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[#e2e6ed] bg-white p-3">
                <div className="flex items-center justify-between border-b border-[#e3e7ee] pb-2">
                  <h3 className="text-[14px] font-semibold leading-none text-[#1f2533]">SLA Performance</h3>
                  <PanelAction />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div
                    className="h-44 w-44 rounded-full"
                    style={{
                      background:
                        "conic-gradient(#f6a403 0deg 126deg,#ef4444 126deg 180deg,#10b981 180deg 360deg)",
                    }}
                  >
                    <div className="m-[30px] h-[116px] w-[116px] rounded-full bg-white" />
                  </div>
                  <div className="space-y-4 text-[11px]">
                    {[
                      ["Complaint", "48", "#ef4444"],
                      ["Delayed", "48", "#f6a403"],
                      ["Pending", "48", "#10b981"],
                    ].map(([label, value, color]) => (
                      <div key={label as string} className="flex items-center gap-2 text-[#596275]">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color as string }} />
                        <span className="w-16">{label as string}</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <SectionTable
              title="Vendor Performance"
              columns={["Vendor ID", "Vendor Name", "Avg Install Time", "⇵", "Proof Accuracy", "⇵", "Rating", "⇵", "SLA %", "⇵"]}
              rowRenderer={(row, index) => (
                <>
                  <td className="px-2">{row.id}</td>
                  <td className="px-2">{row.vendorName}</td>
                  <td className="px-2 font-semibold">3 Days</td>
                  <td className="px-2" />
                  <td className="px-2">
                    <span className={`rounded px-1.5 py-0.5 font-semibold ${index === 1 ? "bg-[#ffe9e4] text-[#e9472e]" : "bg-[#d4f3d6] text-[#17a34b]"}`}>
                      {index === 1 ? "40%" : "50%"}
                    </span>
                  </td>
                  <td className="px-2" />
                  <td className="px-2">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star className="h-4 w-4 fill-[#f3d116] text-[#f3d116]" />
                      10/10
                    </span>
                  </td>
                  <td className="px-2" />
                  <td className="px-2">{index === 0 ? "10%" : "10"}</td>
                  <td className="px-2" />
                </>
              )}
            />

            <SectionTable
              title="Loan Disbursement Status"
              columns={["Lead ID", "Customer Name", "Vendor Name", "Bank/NBFC", "Disbursed Amount", "Status", "Date of Disbursed", "⇵"]}
              rowRenderer={(_, index) => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">Murugan</td>
                  <td className="px-2">{index === 0 ? "Sun Flowers" : "AMC Solar"}</td>
                  <td className="px-2">{index % 2 === 0 ? "HDFC Bank" : "Fibe"}</td>
                  <td className="px-2 font-semibold">{index === 4 ? "--" : "Rs 2,50,000"}</td>
                  <td className="px-2">
                    <span className={`rounded px-2 py-1 text-[12px] font-semibold ${index === 4 ? "bg-[#f6ebc6] text-[#947028]" : "bg-[#c9f0cd] text-[#159e3f]"}`}>
                      {index === 4 ? "Pending" : "Disbursed"}
                    </span>
                  </td>
                  <td className="px-2 font-semibold">12-02-2025</td>
                  <td className="px-2" />
                </>
              )}
            />

            <SectionTable
              title="Installation Performance Table"
              columns={["Project ID", "Customer Name", "Vendor Name", "installation Start", "installation Completed", "Verified On", "Verified By"]}
              rowRenderer={() => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">Murugan</td>
                  <td className="px-2">Sun Flowers</td>
                  <td className="px-2 font-semibold">12-02-2025</td>
                  <td className="px-2 font-semibold">12-02-2025</td>
                  <td className="px-2 font-semibold">12-02-2025</td>
                  <td className="px-2 font-semibold">Admin</td>
                </>
              )}
            />

            <SectionTable
              title="Sales Team Report"
              columns={["Lead ID", "Vendor Name", "Vendor Phone", "Sales Rep", "Sales Rep contact", "Stage", "Substage"]}
              rowRenderer={(row) => (
                <>
                  <td className="px-2">{row.id}</td>
                  <td className="px-2">{row.vendorName}</td>
                  <td className="px-2">{row.phone}</td>
                  <td className="px-2 font-semibold">{row.rep}</td>
                  <td className="px-2">{row.repContact}</td>
                  <td className="px-2 font-semibold">New Lead</td>
                  <td className="px-2 font-semibold">Site survey Scheduled</td>
                </>
              )}
            />

            <SectionTable
              title="Design Team Report"
              columns={["Project ID", "Vendor Name", "Vendor Phone", "Team POC", "Team POC Contact", "Stage", "Substage"]}
              rowRenderer={(row) => (
                <>
                  <td className="px-2">{row.id}</td>
                  <td className="px-2">{row.vendorName}</td>
                  <td className="px-2">{row.phone}</td>
                  <td className="px-2 font-semibold">{row.rep}</td>
                  <td className="px-2">{row.repContact}</td>
                  <td className="px-2 font-semibold">DPR Approval</td>
                  <td className="px-2 font-semibold">DPR Send</td>
                </>
              )}
            />

            <SectionTable
              title="Finance Team Report"
              columns={["Lead ID", "Vendor Name", "Vendor Phone", "Team POC", "Team POC Contact", "Stage", "Substage"]}
              rowRenderer={(_, index) => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">{index === 0 ? "Sun Flowers" : "AMC Solar"}</td>
                  <td className="px-2">{index === 0 ? "+123123123" : "12-02-2025"}</td>
                  <td className="px-2 font-semibold">Athul</td>
                  <td className="px-2">+182391823</td>
                  <td className="px-2 font-semibold">Payment</td>
                  <td className="px-2 font-semibold">{index === 0 ? "60% Payment Done" : index === 1 ? "Full payment Done" : "DPR Send"}</td>
                </>
              )}
            />

            <SectionTable
              title="AMC Team Report"
              columns={["Project ID", "Vendor Name", "Vendor Phone", "Team POC", "Team POC Contact", "Stage", "Substage"]}
              rowRenderer={(_, index) => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">{index === 0 ? "Sun Flowers" : "AMC Solar"}</td>
                  <td className="px-2">{index === 0 ? "+123123123" : "12-02-2025"}</td>
                  <td className="px-2 font-semibold">Athul</td>
                  <td className="px-2">+182391823</td>
                  <td className="px-2 font-semibold">{index === 0 ? "AMC Requested" : "Payment"}</td>
                  <td className="px-2 font-semibold">{index === 0 ? "60% Payment Done" : index === 1 ? "Full payment Done" : "DPR Send"}</td>
                </>
              )}
            />

            <SectionTable
              title="Net metering Team"
              columns={["Project ID", "Vendor Name", "Vendor Phone", "Team POC", "Team POC Contact", "Stage", "Substage"]}
              rowRenderer={(_, index) => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">{index === 0 ? "Sun Flowers" : "AMC Solar"}</td>
                  <td className="px-2">{index === 0 ? "+123123123" : "12-02-2025"}</td>
                  <td className="px-2 font-semibold">Athul</td>
                  <td className="px-2">+182391823</td>
                  <td className="px-2 font-semibold">Net Metering</td>
                  <td className="px-2 font-semibold">File Submitted to EB by vendor</td>
                </>
              )}
            />

            <SectionTable
              title="Supply Chain Team"
              columns={["Project ID", "Vendor Name", "Vendor Phone", "Team POC", "Team POC Contact", "Stage", "Substage"]}
              rowRenderer={(_, index) => (
                <>
                  <td className="px-2">#123123</td>
                  <td className="px-2">{index === 0 ? "Sun Flowers" : "AMC Solar"}</td>
                  <td className="px-2">{index === 0 ? "+123123123" : "12-02-2025"}</td>
                  <td className="px-2 font-semibold">Athul</td>
                  <td className="px-2">+182391823</td>
                  <td className="px-2 font-semibold">Dispatch</td>
                  <td className="px-2 font-semibold">Module Delivered</td>
                </>
              )}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
