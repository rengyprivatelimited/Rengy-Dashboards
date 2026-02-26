"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Download,
  Mail,
  MapPin,
  Paperclip,
  Pencil,
  RefreshCw,
  Search,
  SendHorizonal,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";

type VendorTab = "overview" | "project" | "ticket" | "account" | "chat";

const docs = mockData.vendorDetail.docs;
const reviews = mockData.vendorDetail.reviews;
const projectCards = Array.from({ length: mockData.vendorDetail.projectCardsCount }, (_, i) => i + 1);
const ticketRows = mockData.vendorDetail.ticketRows;

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[#8b93a2]">{label}</div>
      <div className="mt-1 text-[16px] font-semibold leading-snug text-[#1f2533]">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[120px] rounded px-4 py-1.5 text-sm ${
        active ? "bg-[#11163f] text-white" : "text-[#7d8697]"
      }`}
    >
      {label}
    </button>
  );
}

export default function VendorDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<VendorTab>("overview");
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [projectSortOpen, setProjectSortOpen] = useState(false);
  const [ticketSortOpen, setTicketSortOpen] = useState(false);
  const projectSortRef = useRef<HTMLDivElement | null>(null);
  const ticketSortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (projectSortRef.current && !projectSortRef.current.contains(target)) {
        setProjectSortOpen(false);
      }
      if (ticketSortRef.current && !ticketSortRef.current.contains(target)) {
        setTicketSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Vendor Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Overview</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-[208px] items-center gap-2 rounded border border-[#d8dee8] bg-white px-2.5 text-[12px] text-[#8f97a6] md:flex">
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

          <section className="space-y-4 p-4">
            <button
              className="flex items-center gap-3 text-[#202736]"
              onClick={() => router.push("/vendor-management")}
            >
              <ArrowLeft className="h-4 w-4" />
              <h1 className="text-[16px] font-semibold leading-none">ABC Solar Ltd</h1>
            </button>

            <div className="flex h-10 w-full gap-1 rounded border border-[#e2e6ed] bg-[#f8f9fb] p-1 text-sm font-medium">
              <TabButton active={activeTab === "overview"} label="Overview" onClick={() => setActiveTab("overview")} />
              <TabButton active={activeTab === "project"} label="Project History" onClick={() => setActiveTab("project")} />
              <TabButton active={activeTab === "ticket"} label="Ticket History" onClick={() => setActiveTab("ticket")} />
              <TabButton active={activeTab === "account"} label="Account Settings" onClick={() => setActiveTab("account")} />
              <TabButton active={activeTab === "chat"} label="Chat" onClick={() => setActiveTab("chat")} />
            </div>

            {activeTab === "overview" ? (
              <>
                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-4">
                  <div className="h-[160px] rounded-xl bg-gradient-to-r from-[#8d693f] via-[#5a8aac] to-[#d4dbe4]" />
                  <div className="-mt-8 ml-4 h-[58px] w-[58px] rounded-xl border border-[#d8dcef] bg-[#f1ecff] p-1.5 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1b1e5a] text-[12px] font-semibold text-[#4ad5cb]">eco</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-4 px-2 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[16px] font-semibold leading-none text-[#222938]">SunTech Installations Pvt. Ltd.</h2>
                        <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <Star className="h-4 w-4 fill-[#f2ab2e] text-[#f2ab2e]" />
                        <span className="text-xs text-[#7a8394]">4.2 / (578)</span>
                      </div>
                      <div className="mt-2 text-sm text-[#7e8696]">Vendor ID: VND-0029 <span className="mx-2 text-[#c6cbd5]">.</span></div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#5a6273]"><MapPin className="h-4 w-4" />Bangalore, Karnataka</div>
                      <div className="mt-2 text-sm text-[#8b93a2]">Onboarded On: 12 May 2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#8a92a0]">POC :</div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#2a3140]"><div className="h-6 w-6 rounded-full bg-[#d8b08f]" />Rajesh Sharma</div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#2a3140]"><Mail className="h-4 w-4" />rajesh@suntechinstall.in</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-[#edeafd] p-2 text-[#1f243b]"><UserRound className="h-4 w-4" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Business Details</h3>
                    <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <StatLine label="Email Address" value="info@abcpvtltd.com" />
                    <StatLine label="Phone" value="+9198765 43210" />
                    <StatLine label="Company Address" value="3rd pahae, HSR layout, Bangalore, Karnataka" />
                    <StatLine label="GST Number" value="384646384" />
                  </div>
                  <div className="mt-6">
                    <div className="mb-2 text-sm text-[#8b93a2]">Documents Uploaded</div>
                    <div className="space-y-2">
                      {docs.map((doc, i) => (
                        <div key={`${doc}-${i}`} className="flex items-center justify-between rounded-lg border border-[#dfe3ea] bg-white px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-[#ffecec] px-2 py-1 text-[10px] font-semibold text-[#e45050]">PDF</div>
                            <div><div className="text-sm font-medium text-[#2a3140]">{doc}</div><div className="text-xs text-[#8b93a2]">200KB</div></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-[#2aa36b]"><Download className="h-4 w-4" /></button>
                            <button className="text-[#ef5353]"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-[#edeafd] p-2 text-[#1f243b]"><UserRound className="h-4 w-4" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Performance Overview</h3>
                    <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <StatLine label="Total Projects Assigned" value="27" />
                    <StatLine label="Projects Completed" value="21" />
                    <StatLine label="Ongoing Projects" value="6" />
                    <StatLine label="Average Installation Time" value="12 days" />
                    <StatLine label="Last Project Assigned" value="2 August 2025" />
                    <StatLine label="Delayed Projects" value="8" />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-[#edeafd] p-2 text-[#1f243b]"><UserRound className="h-4 w-4" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Remarks</h3>
                  </div>
                  <textarea rows={5} placeholder="Type Remarks" className="w-full rounded-lg border border-[#d6dbe5] p-3 text-sm outline-none" />
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-[#edeafd] p-2 text-[#1f243b]"><UserRound className="h-4 w-4" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Customer Reviews</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                    <div>
                      <div className="text-sm text-[#414a59]">Employee Reviews</div>
                      <div className="mt-2 text-[36px] font-semibold leading-none">4.7</div>
                      <div className="mt-2 flex gap-1 text-[#e0aa4c]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-current" : ""}`} />)}</div>
                      <div className="mt-1 text-[13px] text-[#8a92a0]">(578 Reviews)</div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {[["5 stars", "488", "w-[96%]"], ["4 stars", "74", "w-[30%]"], ["3 stars", "14", "w-[5%]"], ["2 stars", "0", "w-[0%]"], ["1 star", "0", "w-[0%]"]].map(([label, count, width]) => (
                        <div key={label} className="grid grid-cols-[56px_1fr_34px] items-center gap-2">
                          <span className="text-xs text-[#444c5c]">{label}</span>
                          <div className="h-2 rounded bg-[#eceff4]"><div className={`h-2 rounded bg-[#d9a14c] ${width}`} /></div>
                          <span className="text-xs text-[#8a92a0]">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 space-y-8">
                    {reviews.map((item) => (
                      <div key={item} className="border-t border-[#eceff4] pt-6 first:border-t-0 first:pt-0">
                        <div className="text-[13px] text-[#8a92a0]">Jan 20, 2024</div>
                        <div className="mt-2 flex gap-1 text-[#e0aa4c]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dbe2ff] text-xs font-semibold text-[#5d66d8]">AK</div>
                          <span className="text-sm font-medium text-[#202636]">Alex K.</span>
                        </div>
                        <p className="mt-3 max-w-[760px] text-[13px] text-[#2e3645]">Working at Sam.AI has been an incredible journey so far. The technology we&apos;re building is truly cutting-edge, and being a part of a team that&apos;s revolutionizing how people achieve their goals is immensely fulfilling.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {activeTab === "project" ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-9 w-[180px] items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#9aa2b1]">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                  <div className="relative" ref={projectSortRef}>
                    <button
                      onClick={() => setProjectSortOpen((p) => !p)}
                      className="inline-flex h-9 items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#7b8495]"
                    >
                      Sort By
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {projectSortOpen ? (
                      <div className="absolute right-0 top-10 z-20 w-[220px] overflow-hidden rounded-2xl border border-[#cfd4dc] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.18)]">
                        <div className="border-b border-[#e3e7ee] px-4 py-2 text-[14px] font-medium text-[#323a49]">Sort by</div>
                        {["Cost low - high", "Cost High - Low", "Status - Ongoing", "Status - Completed"].map((option) => (
                          <button key={option} className="flex w-full items-center gap-3 border-b border-[#e9edf2] px-4 py-2 text-left text-[13px] text-[#5d6574] last:border-b-0">
                            <span className="h-4 w-4 rounded border border-[#aeb7c5]" />
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                  {projectCards.map((item) => (
                    <article
                      key={item}
                      className="rounded-lg border border-[#e4e8ef] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_2px_6px_rgba(15,23,42,0.08),0_12px_26px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-[#3a404c]">Project AMC</h3>
                        <span className="rounded-full bg-[#e8f6e8] px-2 py-0.5 text-[12px] font-semibold text-[#229e2e]">Ongoing</span>
                      </div>
                      <div className="my-2 h-px bg-[#d9dde4]" />
                      <div className="grid grid-cols-2 gap-y-2">
                        <div>
                          <div className="text-[12px] text-[#858d9b]">Client</div>
                          <div className="mt-1 text-[14px] text-[#3e4552]">Rohith</div>
                        </div>
                        <div>
                          <div className="text-[12px] text-[#858d9b]">Cost Range</div>
                          <div className="mt-1 text-[14px] font-semibold text-[#3e4552]">Rs 1.5 Cr - Rs 2.5 Cr</div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}

            {activeTab === "ticket" ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-9 w-[180px] items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#9aa2b1]">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                  <div className="relative" ref={ticketSortRef}>
                    <button
                      onClick={() => setTicketSortOpen((p) => !p)}
                      className="inline-flex h-9 items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#7b8495]"
                    >
                      Sort By
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {ticketSortOpen ? (
                      <div className="absolute right-0 top-10 z-20 w-[170px] overflow-hidden rounded-xl border border-[#cfd4dc] bg-white shadow-[0_10px_20px_rgba(15,23,42,0.18)]">
                        <div className="border-b border-[#e3e7ee] px-3 py-2 text-[14px] font-medium text-[#323a49]">Sort by</div>
                        {["Pending", "Completed", "Open"].map((option) => (
                          <button key={option} className="flex w-full items-center gap-2 border-b border-[#e9edf2] px-3 py-2 text-left text-[13px] text-[#5d6574] last:border-b-0">
                            <span className="h-4 w-4 rounded border border-[#aeb7c5]" />
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#e3e7ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_20px_rgba(15,23,42,0.04)]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="h-11 text-[13px] text-[#7f8795]">
                        <th className="px-4">Ticket ID</th>
                        <th className="px-4">Project Name</th>
                        <th className="px-4">Status</th>
                        <th className="px-4">Created On</th>
                        <th className="px-4">Resolved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketRows.map((row, idx) => (
                        <tr key={`${row.id}-${idx}`} className="h-12 border-t border-[#edf1f6] text-[14px] text-[#2b3342]">
                          <td className="px-4 font-medium">{row.id}</td>
                          <td className="px-4 text-[#6f7787]">{row.project}</td>
                          <td className="px-4 align-middle">
                            <span
                              className={`inline-flex h-6 min-w-[70px] items-center justify-center rounded-full px-2 text-[11px] font-semibold leading-none text-white ${
                                row.status === "Pending" ? "bg-[#ef5350]" : row.status === "Open" ? "bg-[#f44336]" : "bg-[#20a12a]"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 text-[#596273]">{row.created}</td>
                          <td className="px-4 text-[#596273]">{row.resolved}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}

            {activeTab === "chat" ? (
              <div className="rounded-lg border border-[#e3e7ee] bg-white">
                <div className="flex items-center gap-3 border-b border-[#e3e7ee] bg-[#f5f6f8] px-4 py-2">
                  <div className="h-10 w-10 rounded-full bg-[#d0d2d9]" />
                  <div>
                    <div className="text-[26px] font-semibold leading-none text-[#1f2533]">Athul</div>
                    <div className="text-[16px] text-[#7f8795]">POC</div>
                  </div>
                </div>

                <div className="min-h-[420px] space-y-8 px-4 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#ced2da]" />
                    <div className="w-[320px] rounded-xl bg-[#f4c284] px-4 py-2 text-[16px] text-[#121830]">Hi good morning</div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <div className="w-[320px] rounded-xl border border-[#bfc6d3] bg-white px-3 py-2 text-[16px] text-[#121830]">Hi good morning</div>
                    <button className="rounded-full border border-[#bfc6d3] p-2 text-[#151a38]"><RefreshCw className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#ced2da]" />
                    <div className="w-[320px] rounded-xl bg-[#f4c284] px-4 py-2 text-[16px] text-[#121830]">Hi good morning</div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <div className="w-[320px] rounded-xl border border-[#bfc6d3] bg-white px-3 py-2 text-[16px] text-[#121830]">Hi good morning</div>
                    <button className="rounded-full border border-[#bfc6d3] p-2 text-[#151a38]"><RefreshCw className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 pb-4">
                  <div className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-[#f1f2f4] px-3 text-[#7a8190]">
                    <Paperclip className="h-5 w-5 text-[#1d223e]" />
                    <span className="text-[16px]">Type Something</span>
                  </div>
                  <button className="text-[#151a38]">
                    <SendHorizonal className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === "account" ? (
              <div className="max-w-[760px] space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold leading-none text-[#222938]">SunTech Installations Pvt. Ltd.</h2>
                    <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <Star className="h-4 w-4 fill-[#f2ab2e] text-[#f2ab2e]" />
                    <span className="text-xs text-[#7a8394]">4.2 / (578)</span>
                  </div>
                  <div className="mt-2 text-sm text-[#7e8696]">
                    Vendor ID: VND-0029 <span className="mx-2 text-[#c6cbd5]">.</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-[#5a6273]">
                    <MapPin className="h-4 w-4" />
                    Bangalore, Karnataka
                  </div>
                  <div className="mt-2 text-sm text-[#8b93a2]">Onboarded On: 12 May 2025</div>
                </div>

                <div className="flex gap-2">
                  <button className="h-9 w-[220px] rounded border border-[#ef5350] bg-white text-[12px] font-semibold text-[#ef5350]">
                    Deactivate Account
                  </button>
                  <button className="h-9 w-[220px] rounded bg-[#eb2f2f] text-[12px] font-semibold text-white">
                    Delete Account
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>

      {isEditDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <aside className="flex h-full w-full max-w-[360px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-[24px] font-medium leading-none text-[#1b2230]">Edit Vendor Details</div>
              <button className="rounded border border-[#ced4df] p-1 text-[#5a6373] hover:bg-[#f2f4f8]" onClick={() => setIsEditDrawerOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-4 py-3 text-[10px] text-[#2b3445]">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Vendor ID*", "VND-0029"],
                  ["Vendor Name*", "ABC"],
                  ["POC", "Athul"],
                  ["POC Phone", "+91999999999"],
                  ["POC Email", "athul@gmail.com"],
                  ["Address", "HSR Layout"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="mb-1 block font-semibold text-[#1f2532]">{label}</label>
                    <input value={value} readOnly className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2 text-[10px]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-3">
              <button className="h-8 rounded border border-[#cfd4df] bg-white text-[10px] font-semibold text-[#30384a]" onClick={() => setIsEditDrawerOpen(false)}>Cancel</button>
              <button className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white" onClick={() => setIsEditDrawerOpen(false)}>Save</button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
