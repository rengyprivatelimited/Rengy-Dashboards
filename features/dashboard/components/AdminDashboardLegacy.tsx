"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RootSidebar } from "@/components/RootSidebar";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Download,
  Search,
} from "lucide-react";
import { AdminDashboardStat } from "@/features/dashboard/api/admin-dashboard";
import { getAdminDashboardDataWithToken } from "@/features/dashboard/api/admin-dashboard";

const teams = [
  { name: "Sales Team", href: "/sales-team/dashboard", open: 12, new: 12, pending: 12 },
  { name: "Net Metering Team", href: "/net-metering-team/dashboard", open: 12, new: 12, pending: 12 },
  { name: "Loan Team", href: "/loan-team/dashboard", open: 12, new: 12, pending: 13 },
  { name: "Design Team", href: "/design-team/dashboard", open: 12, new: 12, pending: 13 },
  { name: "Finance Team", href: "/finance-team/dashboard", open: 12, new: 13, pending: 12 },
  { name: "Operations Team", href: "/operations-team/dashboard", open: 12, new: 12, pending: 12 },
  { name: "Supply Chain Team", href: "/supply-chain-team/dashboard", open: 12, new: 12, pending: 14 },
  { name: "AMC Team", href: "/amc-team/dashboard", open: 12, new: 12, pending: 12 },
];

const topPerformers = [1, 2, 3, 4, 5];
const milestoneMaxValue = 60;
const milestoneTicks = [10, 20, 30, 40, 50, 60];
const milestoneFunnelData = [
  { stage: "New Lead", value: 38, color: "bg-[#c7d8d5]" },
  { stage: "Site Survey done", value: 52, color: "bg-[#5bcaa5]" },
  { stage: "DPR Approval", value: 28, color: "bg-[#b5d8cb]" },
  { stage: "Procurement", value: 36, color: "bg-[#8ccdb6]" },
  { stage: "Installation", value: 44, color: "bg-[#6fd4b0]"},
  { stage: "Net metering", value: 49, color: "bg-[#5bcaa5]" },
  { stage: "Project Handover", value: 34, color: "bg-[#579f86]" },
];

function StatCard({
  value,
  title,
  note,
}: {
  value: string;
  title: string;
  note: string;
}) {
  return (
    <div className="rounded-md border border-[#d7dde7] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-semibold leading-none tracking-[-0.01em] text-[#202225] lg:text-[2rem]">
            {value}
          </div>
          <div className="mt-1.5 text-sm font-semibold text-[#202225]">{title}</div>
        </div>
        <div className="mt-2 h-10 w-16 bg-[url('/chart.png')] bg-contain bg-center bg-no-repeat" />
      </div>
      <div className="mt-1.5 text-xs text-[#8c95a3]">{note}</div>
    </div>
  );
}

function TeamCard({
  name,
  href,
  open,
  newCount,
  pending,
}: {
  name: string;
  href: string;
  open: number;
  newCount: number;
  pending: number;
}) {
  return (
    <div className="w-[280px] shrink-0 rounded-md border border-[#d7dde7] bg-gradient-to-b from-[#edf1fb] to-[#f7f9ff] p-3">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1f2b46]">
        <CircleDot className="h-4 w-4 text-[#5b74c6]" />
        <span>{name}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-[#5b6475]">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#1a1f2c]">{open}</div>
          <div className="mt-0.5 whitespace-normal break-words text-[11px] leading-4">Open</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#1a1f2c]">{newCount}</div>
          <div className="mt-0.5 whitespace-normal break-words text-[11px] leading-4">New Service</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#1a1f2c]">{pending}</div>
          <div className="mt-0.5 whitespace-normal break-words text-[11px] leading-4">Pending Up</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[#cfd7e6] pt-2">
        <span className="text-xs font-semibold text-[#1f2b46]">View Details</span>
        <Link
          href={href}
          aria-label={`Go to ${name} dashboard`}
          className="rounded-sm bg-[#111433] px-2 py-1 text-xs text-white"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function SideAction({ title }: { title: string }) {
  return (
    <button className="w-full rounded-sm border border-[#1e2442] bg-white px-3 py-2 text-xs font-semibold text-[#1e2442]">
      {title}
    </button>
  );
}

type AdminDashboardLegacyProps = {
  stats?: AdminDashboardStat[];
};

export function AdminDashboardLegacy({ stats }: AdminDashboardLegacyProps) {
  const fallbackCards: AdminDashboardStat[] = [
    {
      value: "INR 3.8 Cr",
      title: "Total Revenue Impact",
      note: "+6% growth points vs last year",
    },
    {
      value: "1202",
      title: "Active Projects",
      note: "+8% higher than last month",
    },
    {
      value: "40%",
      title: "Overall SLA Compliance",
      note: "+4 percent above/under performance",
    },
    {
      value: "INR 62 Lakh",
      title: "Pending Collections",
      note: "+4 percent achievement in overdue invoices",
    },
  ];

  const [statCards, setStatCards] = useState<AdminDashboardStat[]>(
    stats && stats.length >= 4 ? stats.slice(0, 4) : fallbackCards,
  );

  useEffect(() => {
    const parseCookie = (name: string) => {
      const escaped = name.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : "";
    };

    const accessToken = parseCookie("rengy_access_token");
    if (!accessToken) return;

    let isMounted = true;
    getAdminDashboardDataWithToken(accessToken, 32).then((result) => {
      if (!isMounted) return;
      if (result.stats.length >= 4) {
        setStatCards(result.stats.slice(0, 4));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Dashboard" />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <header className="flex h-12 items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-4 lg:px-6">
            <div className="text-base font-semibold">Admin</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-48 items-center gap-2 rounded-sm border border-[#d8dee8] bg-white px-2.5 text-sm text-[#8f97a6] md:flex">
                <Search className="h-4 w-4" />
                Search
              </div>
              <Bell className="h-4 w-4 text-[#4a5160]" />
              <Link href="/logout" className="flex items-center gap-1 rounded px-1 py-0.5">
                <div className="h-6 w-6 rounded-full bg-[#d89d77]" />
                <span className="text-sm text-[#4c5564]">Rajesh B</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7f8898]" />
              </Link>
            </div>
          </header>

          <div className="flex min-w-0 flex-col gap-4 p-3 lg:p-4 xl:flex-row">
            <section className="min-w-0 flex-1">
              <h1 className="text-4xl font-medium leading-none text-[#1d2028] lg:text-5xl">Hi Akhil</h1>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                  <StatCard key={card.title} value={card.value} title={card.title} note={card.note} />
                ))}
              </div>

              <div className="mt-4 min-w-0 overflow-hidden rounded-md border border-[#d7dde7] bg-white p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#202433]">Teams</h2>
                  <div className="flex items-center gap-2 text-xs text-[#7f8898]">
                    <button className="rounded border border-[#d5dbe5] px-2 py-1">Last 7 Days</button>
                    <button className="rounded border border-[#d5dbe5] px-2 py-1">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 min-w-0 w-full max-w-full overflow-x-auto pb-1">
                  <div className="inline-flex gap-2 whitespace-nowrap">
                    {teams.map((team) => (
                      <TeamCard
                        key={team.name}
                        name={team.name}
                        href={team.href}
                        open={team.open}
                        newCount={team.new}
                        pending={team.pending}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
                <div className="rounded-md border border-[#d7dde7] bg-white p-3 xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Milestones Progress Funnel</h3>
                    <button className="rounded border border-[#d5dbe5] px-2 py-1 text-xs text-[#7f8898]">
                      Last 7 Days
                    </button>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <div className="min-w-[660px]">
                      <div className="border-l border-[#cfd6e4] pl-3">
                        <div className="space-y-2">
                          {milestoneFunnelData.map((item) => {
                            const width = Math.max(0, Math.min(100, (item.value / milestoneMaxValue) * 100));
                            return (
                              <div key={item.stage} className="flex items-center gap-3">
                                <div
                                  className={`h-12 rounded-sm ${item.color}`}
                                  style={{ width: `${width}%` }}
                                />
                                <span className="whitespace-nowrap text-lg text-[#62728a]">{item.stage}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 border-t border-[#cfd6e4] pt-2">
                          <div className="grid grid-cols-6 text-sm text-[#7f8898]">
                            {milestoneTicks.map((tick) => (
                              <span key={tick}>{tick}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-[#d7dde7] bg-white p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Top Performers</h3>
                    <button className="rounded border border-[#d5dbe5] px-2 py-1 text-xs text-[#7f8898]">
                      Vendors
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {topPerformers.map((n) => (
                      <div
                        key={n}
                        className="flex items-center justify-between rounded border border-[#dce2ec] bg-[#f9fbff] px-2 py-2"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#1f2a44]">Athul</div>
                          <div className="text-xs text-[#67b598]">95% SLA Compliance</div>
                        </div>
                        <div className="text-sm font-semibold text-[#f2be2f]">4/5</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div className="rounded-md border border-[#d7dde7] bg-white p-3">
                  <h3 className="text-base font-semibold">installation Status Overview</h3>
                  <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row">
                    <div className="relative h-28 w-28 rounded-full border-[14px] border-[#b6edd8] border-r-[#28b883] border-t-[#56d5a6]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-semibold leading-none">158</div>
                          <div className="text-sm text-[#7e8797]">Total</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-[#6f7887] sm:ml-8">
                      <div>Inspection and Maintenance 45</div>
                      <div>Performance Monitoring 44</div>
                      <div>Repair & Replacement 45</div>
                      <div>Emergency Support 46</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-[#d7dde7] bg-white p-3">
                  <h3 className="text-base font-semibold">Material Dispatch & Delivery</h3>
                  <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row">
                    <div className="relative h-28 w-28 rounded-full border-[14px] border-[#b7edd8] border-l-[#4fd0a5] border-r-[#27b882]">
                      <div className="absolute inset-0 rounded-full border-[2px] border-[#d9efe6]" />
                    </div>
                    <div className="space-y-1 text-xs text-[#6f7887] sm:ml-8">
                      <div>Modules 49</div>
                      <div>Inverters 41</div>
                      <div>Structures 48</div>
                      <div>Bos 48</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-[#d7dde7] bg-white p-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-base font-semibold">
                    <span className="text-[#4376d0]">~</span> SLA Trend by Team
                  </h3>
                  <button className="rounded bg-[#15183b] px-3 py-1.5 text-xs text-white">Sales Team</button>
                </div>
                <div className="mt-3 h-48 rounded-md border border-[#dce3ed] bg-gradient-to-b from-[#f4fbfa] to-[#d7f4f0] p-3">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-x-0 bottom-2 h-[1px] bg-[#cad3e0]" />
                    <div className="absolute inset-x-0 bottom-8 h-[1px] border-t border-dashed border-[#d3dce9]" />
                    <div className="absolute inset-x-0 bottom-14 h-[1px] border-t border-dashed border-[#d3dce9]" />
                    <div className="absolute inset-x-0 bottom-20 h-[1px] border-t border-dashed border-[#d3dce9]" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                      <path
                        d="M0,95 C65,98 85,90 140,85 C190,74 210,84 260,76 C300,72 336,62 400,55"
                        fill="none"
                        stroke="#33c3a0"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute bottom-6 right-2 rounded border border-[#d7dde7] bg-white px-2 py-1.5 text-xs text-[#6c7483] md:right-20">
                      <div className="font-semibold text-[#e05f4b]">SLA Breach: 1/8</div>
                      <div>Breach Rate 12 percent</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="w-full rounded-md border border-[#d7dde7] bg-[#f9fafc] p-3 xl:w-[300px] xl:shrink-0">
              <div className="text-lg font-semibold">Quick Actions</div>
              <div className="mt-2 space-y-1.5">
                <button className="w-full rounded-sm bg-[#171b45] px-3 py-2 text-sm font-semibold text-white">
                  Add Users
                </button>
                <SideAction title="Broadcast Message" />
                <SideAction title="Check Tickets" />
              </div>

              <div className="mt-4 text-lg font-semibold">Alerts & Breaches (3)</div>
              <div className="mt-1.5 space-y-1.5">
                <div className="rounded-sm border border-[#f1dfc8] bg-[#fff4e8] p-2">
                  <div className="text-xs text-[#f49a2c]">Low AOV #0125</div>
                  <div className="mt-1 text-sm font-semibold">Lead #1025</div>
                  <div className="text-xs text-[#7f8797]">Bangladesh, AOV Workflow</div>
                  <div className="mt-1.5 text-xs text-[#5f6778]">Vendor not assigned for 20 hrs (SLA is 24 hrs)</div>
                  <button className="mt-2 w-full rounded-sm border border-[#1f2547] py-1.5 text-xs font-semibold text-[#1f2547]">
                    Assign Vendor
                  </button>
                </div>
                <div className="rounded-sm border border-[#f1dfc8] bg-[#fff4e8] p-2">
                  <div className="text-xs text-[#f49a2c]">Delayed</div>
                  <div className="mt-1 text-sm font-semibold">Lead #1025</div>
                  <div className="text-xs text-[#7f8797]">Bangladesh, AOV Workflow</div>
                  <div className="mt-1.5 text-xs text-[#5f6778]">Survey delayed by 2 days (SLA is 3 days)</div>
                  <button className="mt-2 w-full rounded-sm border border-[#1f2547] py-1.5 text-xs font-semibold text-[#1f2547]">
                    Send Reminder
                  </button>
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold">Priority Tasks (2)</div>
              <div className="mt-2 rounded-sm border border-[#d7dde7] bg-white p-2">
                <div className="text-xs text-[#7f8797]">Payment Follow-up</div>
                <div className="text-sm font-semibold">Lead #1025</div>
                <div className="text-xs text-[#7f8797]">Bangalore, AOV Workflow</div>
                <div className="mt-1.5 text-xs text-[#5f6778]">Customer accepted quotation, 60% advance pending for 3 days</div>
                <button className="mt-2 w-full rounded-sm border border-[#1f2547] py-1.5 text-xs font-semibold text-[#1f2547]">
                  Take Action
                </button>
              </div>

              <div className="mt-4 rounded-sm border border-[#d7dde7] bg-white p-2">
                <div className="text-xs text-[#7f8797]">Team Performance Review</div>
                <div className="text-xs text-[#7f8797]">Team Performance Review</div>
                <div className="mt-1 text-sm font-semibold">
                  Sales Rep &quot;Nirav&quot; has 7 active leads, conversion 5% below avg.
                </div>
                <button className="mt-2 w-full rounded-sm border border-[#1f2547] py-1.5 text-xs font-semibold text-[#1f2547]">
                  Schedule 1:1
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
