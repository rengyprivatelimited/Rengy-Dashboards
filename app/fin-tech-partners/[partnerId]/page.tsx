"use client";

import { useState } from "react";
import { Bell, ChevronDown, Mail, MapPin, Pencil, Search, UserRound, ArrowLeft } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { useRouter } from "next/navigation";

type Tab = "overview" | "account" | "chat";

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[13px] text-[#8b93a2]">
        {label} <span className="text-[#c7ccd6]">.</span>
      </div>
      <div className="mt-1 text-[16px] font-semibold leading-none text-[#202738]">{value}</div>
    </div>
  );
}

export default function FinTechPartnerDetailPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Fin-Tech Partners" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Overview</div>
            <div className="flex items-center gap-3">
              <div className="hidden h-8 w-[182px] items-center gap-2 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-2.5 text-[11px] text-[#8f97a6] md:flex">
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

          <section className="space-y-6 px-6 py-6">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-3" onClick={() => router.push("/fin-tech-partners")}>
                <ArrowLeft className="h-4 w-4 text-[#1f2532]" />
                <h1 className="text-[16px] font-semibold leading-none text-[#1f2532]">ICICI Bank</h1>
              </button>
              <button className="inline-flex h-9 items-center gap-1 rounded-full border border-[#cfd6e3] bg-white px-4 text-[13px] text-[#5b6474]">
                Export
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-11 w-full items-center gap-2 rounded-lg bg-white p-1 text-[13px] font-medium text-[#7b8495]">
              <button
                className={`min-w-[180px] rounded py-1 ${tab === "overview" ? "bg-[#11163f] text-white" : ""}`}
                onClick={() => setTab("overview")}
              >
                Overview
              </button>
              <button
                className={`min-w-[220px] rounded py-1 ${tab === "account" ? "bg-[#11163f] text-white" : ""}`}
                onClick={() => setTab("account")}
              >
                Account Settings
              </button>
              <button
                className={`min-w-[120px] rounded py-1 ${tab === "chat" ? "bg-[#11163f] text-white" : ""}`}
                onClick={() => setTab("chat")}
              >
                Chat
              </button>
            </div>

            {tab === "overview" ? (
              <>
                <div className="relative rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <div className="h-[170px] rounded-xl bg-gradient-to-r from-[#986f39] via-[#5588b2] to-[#d4dae4]" />
                  <div className="-mt-8 ml-6 h-[78px] w-[78px] rounded-2xl border border-[#d8dcef] bg-[#f1ecff] p-2 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1b1e5a] text-[22px] font-semibold text-[#4ad5cb]">
                      ecofy
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[32px] font-semibold leading-none text-[#222938]">ICICI Bank</h2>
                        <Pencil className="h-4 w-4 text-[#6e7584]" />
                      </div>
                      <div className="mt-3 text-[13px] text-[#7e8696]">Bank ID: B-0029 <span className="mx-2 text-[#c6cbd5]">.</span></div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#5a6273]">
                        <MapPin className="h-5 w-5" />
                        Bangalore, Karnataka
                      </div>
                      <div className="mt-3 text-[13px] text-[#8b93a2]">Onboarded On: 12 May 2025</div>
                    </div>

                    <div className="pt-1">
                      <div className="text-[13px] text-[#8a92a0]">POC :</div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#2a3140]">
                        <div className="h-7 w-7 rounded-full bg-[#d8b08f]" />
                        Rajesh Sharma
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#2a3140]">
                        <Mail className="h-4 w-4" />
                        rajesh@suntechinstall.in
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-[110px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#11a7b7] text-[18px] font-semibold text-white shadow-lg">
                    P
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Business Details</h3>
                    <Pencil className="h-4 w-4 text-[#6e7584]" />
                  </div>
                  <div className="grid grid-cols-1 gap-x-20 gap-y-10 md:grid-cols-2">
                    <DetailStat label="Email Address" value="info@abcpvtltd.com" />
                    <DetailStat label="Phone" value="+9198765 43210" />
                    <DetailStat label="Company Address" value="3rd pahae, HSR layout, Bangalore, Karnataka" />
                    <DetailStat label="GST Number" value="384646384" />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Performance Overview</h3>
                    <Pencil className="h-4 w-4 text-[#6e7584]" />
                  </div>
                  <div className="grid grid-cols-1 gap-x-20 gap-y-10 md:grid-cols-2">
                    <DetailStat label="Approval Time" value="15 Days" />
                    <DetailStat label="Resubmissions Needed" value="4" />
                    <DetailStat label="Average Disbursal Time" value="6" />
                    <DetailStat label="Average Disbursal Percentage" value="40%" />
                    <DetailStat label="Total No. of Rejections" value="12" />
                    <DetailStat label="Rejection Percentage" value="8%" />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Remarks</h3>
                  </div>
                  <textarea rows={6} placeholder="Type Remarks" className="w-full rounded-xl border border-[#d6dbe5] p-3 text-sm outline-none" />
                </div>
              </>
            ) : null}

            {tab === "account" ? (
              <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6 text-base text-[#6f7787]">
                Account Settings content.
              </div>
            ) : null}
            {tab === "chat" ? (
              <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6 text-base text-[#6f7787]">
                Chat content.
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

