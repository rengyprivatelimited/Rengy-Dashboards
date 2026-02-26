"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Bell, ChevronDown, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type DropdownRow = {
  id: number;
  name: string;
  role: string;
  code: string;
  status: "Active" | "Inactive";
  time: string;
};

const itemMeta = Object.fromEntries(
  (mockData.settings.dropdownCards as Array<{ slug: string; title: string; subtitle: string }>).map((card) => [
    card.slug,
    { title: card.title, subtitle: card.subtitle },
  ]),
) as Record<string, { title: string; subtitle: string }>;

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

export default function DropdownSettingsDetailPage() {
  const params = useParams<{ item: string }>();
  const item = params.item;
  const meta = itemMeta[item] ?? { title: "Modules", subtitle: "Solar panel modules and specifications" };
  const [rows, setRows] = useState<DropdownRow[]>(mockData.settings.dropdownRows as DropdownRow[]);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Settings" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Admin</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-[240px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
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
            <div className="flex items-center gap-2">
              <Link
                href="/settings?tab=dropdown"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#cdd4e0] bg-white text-[#5f6878] hover:bg-[#f2f4f8]"
                aria-label="Back to settings"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Settings</h1>
            </div>

            <div className="mt-4 overflow-hidden rounded border border-[#d8dde5] bg-white">
              <div className="flex">
                <Link href="/settings?tab=dashboard" className="inline-flex h-8 min-w-[145px] items-center border-r border-[#d8dde5] px-4 text-[12px] text-[#80889a]">
                  Dashboard Preference
                </Link>
                <Link href="/settings?tab=notifications" className="inline-flex h-8 min-w-[145px] items-center border-r border-[#d8dde5] px-4 text-[12px] text-[#80889a]">
                  Notifications
                </Link>
                <Link href="/settings?tab=documents" className="inline-flex h-8 min-w-[145px] items-center border-r border-[#d8dde5] px-4 text-[12px] text-[#80889a]">
                  Document Settings
                </Link>
                <Link href="/settings?tab=dropdown" className="inline-flex h-8 min-w-[145px] items-center px-4 text-[12px] font-semibold text-[#1c232f] shadow-[inset_0_-3px_0_#3ad2be]">
                  Dropdown Settings
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e2535]">{meta.title} Dropdown Values</h2>
                <p className="mt-1 text-[13px] text-[#596273]">{meta.subtitle}</p>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded bg-[#11163f] px-4 text-[14px] font-semibold text-white">
                Add New {meta.title === "Modules" ? "Module" : "Value"}
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 overflow-auto rounded-lg border border-[#dce1e8] bg-white">
              <table className="w-full min-w-[1200px] text-left text-[14px]">
                <thead>
                  <tr className="h-11 bg-[#d4dfdd] text-[#55606f]">
                    <th className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" /></th>
                    <th className="px-2">Value Name</th>
                    <th className="px-2">Code/Internal ID</th>
                    <th className="px-2 text-[#8f97a8]">?</th>
                    <th className="px-2">Status</th>
                    <th className="px-2">Time</th>
                    <th className="px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="h-[54px] border-t border-[#e6eaf1] odd:bg-[#f8f9fb]">
                      <td className="px-2"><input type="checkbox" className="h-4 w-4 rounded border-[#bac3d1]" /></td>
                      <td className="px-2">
                        <div>{row.name}</div>
                        <div className="font-semibold">{row.role}</div>
                      </td>
                      <td className="px-2">{row.code}</td>
                      <td className="px-2" />
                      <td className="px-2">
                        <span className={`rounded px-2 py-1 text-[12px] font-semibold ${row.status === "Inactive" ? "bg-[#ffe4e4] text-[#ea3b3b]" : "bg-[#cbefcf] text-[#1e9642]"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2">{row.time}</td>
                      <td className="px-2">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-[#5a6273] hover:bg-[#eef2f8]"
                            onClick={() =>
                              setRows((prev) =>
                                prev.map((entry) =>
                                  entry.id === row.id ? { ...entry, status: entry.status === "Active" ? "Inactive" : "Active" } : entry,
                                ),
                              )
                            }
                            title="Toggle status"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <button
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-[#dc3d3d] hover:bg-[#fff1f1]"
                            onClick={() => setRows((prev) => prev.filter((entry) => entry.id !== row.id))}
                            title="Delete value"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
    </div>
  );
}
