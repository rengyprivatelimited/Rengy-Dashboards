"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bell, ChevronDown, Mail, MapPin, Pencil, Search, SendHorizonal, UserRound, X } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { useParams, useRouter } from "next/navigation";
import {
  buildFinTechExportUrl,
  getFinTechPartner,
  sendFinTechChatMessage,
  updateFinTechPartner,
  type FinTechPartnerDetail,
} from "@/features/admin/api/fintech-partners";

type Tab = "overview" | "account" | "chat";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-3 rounded-full bg-[#e3e7ee] ${className ?? ""}`} />;
}

function DetailStat({ label, value, isLoading }: { label: string; value: string; isLoading?: boolean }) {
  return (
    <div>
      <div className="text-[13px] text-[#8b93a2]">
        {label} <span className="text-[#c7ccd6]">.</span>
      </div>
      <div className="mt-1 text-[16px] font-semibold leading-none text-[#202738]">
        {isLoading ? <div className="h-4 w-32 rounded bg-[#e3e7ee]" /> : value}
      </div>
    </div>
  );
}

export default function FinTechPartnerDetailPage() {
  const router = useRouter();
  const params = useParams<{ partnerId: string }>();
  const [tab, setTab] = useState<Tab>("overview");
  const [partner, setPartner] = useState<FinTechPartnerDetail | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    providerType: "",
    primaryPerson: "",
    primaryContact: "",
    primaryEmail: "",
    address: "",
    url: "",
    remarks: "",
    foundedIn: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ id: string; message: string }>>([]);

  const partnerId = useMemo(() => {
    const raw = params?.partnerId ?? "";
    const digits = raw.replace(/[^\d]/g, "");
    const parsed = Number(digits);
    return Number.isFinite(parsed) ? parsed : null;
  }, [params]);

  useEffect(() => {
    let isActive = true;

    const loadPartner = async () => {
      if (!partnerId) return;
      try {
        const result = await getFinTechPartner(partnerId);
        if (!isActive) return;
        setPartner(result);
        setEditForm({
          name: result.name ?? "",
          providerType: result.type ?? "",
          primaryPerson: result.poc ?? "",
          primaryContact: result.phone ?? "",
          primaryEmail: result.email ?? "",
          address: result.address ?? "",
          url: result.website ?? "",
          remarks: result.remarks ?? "",
          foundedIn: result.foundedIn ?? "",
        });
      } catch (error) {
        console.error("Failed to load fin-tech partner", error);
      }
    };

    loadPartner();
    return () => {
      isActive = false;
    };
  }, [partnerId]);

  const isLoading = !partner;
  const partnerName = partner?.name ?? "";
  const partnerLocation = partner?.location ?? "";
  const partnerPoc = partner?.poc ?? "";
  const partnerEmail = partner?.email ?? "";
  const partnerPhone = partner?.phone ?? "";
  const partnerLogoText = partner?.name ? partner.name.slice(0, 4).toLowerCase() : "";

  const handleSave = async () => {
    if (!partnerId) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await updateFinTechPartner(partnerId, editForm);
      setPartner((prev) =>
        prev
          ? {
              ...prev,
              name: editForm.name || prev.name,
              type: editForm.providerType || prev.type,
              poc: editForm.primaryPerson || prev.poc,
              phone: editForm.primaryContact || prev.phone,
              email: editForm.primaryEmail || prev.email,
              address: editForm.address || prev.address,
              website: editForm.url || prev.website,
              remarks: editForm.remarks || prev.remarks,
              foundedIn: editForm.foundedIn || prev.foundedIn,
            }
          : prev,
      );
      setEditOpen(false);
    } catch (error) {
      console.warn("Failed to update fin-tech partner", error);
      setActionError("Unable to save partner details right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    const message = chatMessage.trim();
    if (!message || !partnerId) return;
    setChatMessage("");
    try {
      await sendFinTechChatMessage({ leadId: partnerId, message });
      setChatLog((prev) => [{ id: `${Date.now()}`, message }, ...prev]);
    } catch (error) {
      console.warn("Failed to send chat message", error);
    }
  };

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
                <h1 className="text-[16px] font-semibold leading-none text-[#1f2532]">
                  {isLoading ? <span className="inline-block h-4 w-28 rounded bg-[#e3e7ee]" /> : partnerName}
                </h1>
              </button>
              <button
                className="inline-flex h-9 items-center gap-1 rounded-full border border-[#cfd6e3] bg-white px-4 text-[13px] text-[#5b6474]"
                onClick={() => window.open(buildFinTechExportUrl(), "_blank", "noopener,noreferrer")}
              >
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
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1b1e5a] text-[18px] font-semibold uppercase text-[#4ad5cb]">
                      {isLoading ? <span className="h-4 w-10 rounded bg-[#2b2f7a]" /> : partnerLogoText}
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div className="min-w-[220px]">
                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <div className="h-8 w-56 rounded bg-[#e3e7ee]" />
                        ) : (
                          <h2 className="text-[32px] font-semibold leading-none text-[#222938]">{partnerName}</h2>
                        )}
                        <button onClick={() => setEditOpen(true)}>
                          <Pencil className="h-4 w-4 text-[#6e7584]" />
                        </button>
                      </div>
                      <div className="mt-3 text-[13px] text-[#7e8696]">
                        {isLoading ? (
                          <SkeletonLine className="h-3 w-40" />
                        ) : (
                          <>
                            Bank ID: {partner?.bankId ?? "-"} <span className="mx-2 text-[#c6cbd5]">.</span>
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#5a6273]">
                        <MapPin className="h-5 w-5" />
                        {isLoading ? <SkeletonLine className="h-3 w-36" /> : partnerLocation || "-"}
                      </div>
                      <div className="mt-3 text-[13px] text-[#8b93a2]">
                        {isLoading ? <SkeletonLine className="h-3 w-44" /> : `Onboarded On: ${partner?.onboardedOn ?? "-"}`}
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="text-[13px] text-[#8a92a0]">POC :</div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#2a3140]">
                        <div className="h-7 w-7 rounded-full bg-[#d8b08f]" />
                        {isLoading ? <SkeletonLine className="h-3 w-28" /> : partnerPoc || "-"}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#2a3140]">
                        <Mail className="h-4 w-4" />
                        {isLoading ? <SkeletonLine className="h-3 w-40" /> : partnerEmail || "-"}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#2a3140]">
                        <UserRound className="h-4 w-4" />
                        {isLoading ? <SkeletonLine className="h-3 w-24" /> : partnerPhone || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-[110px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#11a7b7] text-[18px] font-semibold text-white shadow-lg">
                    P
                  </div>
                </div>

                <div className={`rounded-2xl border border-[#e3e7ee] bg-white p-6 ${isLoading ? "animate-pulse" : ""}`}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Business Details</h3>
                    <button onClick={() => setEditOpen(true)}>
                      <Pencil className="h-4 w-4 text-[#6e7584]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-20 gap-y-10 md:grid-cols-2">
                    <DetailStat label="Email Address" value={partnerEmail || "-"} isLoading={isLoading} />
                    <DetailStat label="Phone" value={partnerPhone || "-"} isLoading={isLoading} />
                    <DetailStat label="Company Address" value={partner?.address ?? "-"} isLoading={isLoading} />
                    <DetailStat label="GST Number" value={partner?.gstNumber ?? "-"} isLoading={isLoading} />
                  </div>
                </div>

                <div className={`rounded-2xl border border-[#e3e7ee] bg-white p-6 ${isLoading ? "animate-pulse" : ""}`}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Performance Overview</h3>
                    <button onClick={() => setEditOpen(true)}>
                      <Pencil className="h-4 w-4 text-[#6e7584]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-20 gap-y-10 md:grid-cols-2">
                    <DetailStat label="Approval Rate" value={partner?.approvalRate ?? "-"} isLoading={isLoading} />
                    <DetailStat label="Resubmissions Needed" value={partner?.resub ?? "-"} isLoading={isLoading} />
                    <DetailStat label="Average Disbursal Time" value={partner?.avg ?? "-"} isLoading={isLoading} />
                    <DetailStat label="Total Loans" value={partner?.loans ?? "-"} isLoading={isLoading} />
                    <DetailStat label="Total No. of Rejections" value={partner?.rejectedLoans ?? "-"} isLoading={isLoading} />
                    <DetailStat label="Rejection Percentage" value={partner?.rejectedRate ?? "-"} isLoading={isLoading} />
                  </div>
                </div>

                <div className={`rounded-2xl border border-[#e3e7ee] bg-white p-6 ${isLoading ? "animate-pulse" : ""}`}>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-[#edeafd] p-3 text-[#1f243b]"><UserRound className="h-5 w-5" /></div>
                    <h3 className="text-[16px] font-semibold leading-none text-[#1f2533]">Remarks</h3>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Type Remarks"
                    defaultValue={partner?.remarks ?? ""}
                    className="w-full rounded-xl border border-[#d6dbe5] p-3 text-sm outline-none"
                  />
                </div>
              </>
            ) : null}

            {tab === "account" ? (
              <div className="rounded-2xl border border-[#e3e7ee] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[18px] font-semibold text-[#1f2533]">Account Settings</div>
                    <div className="text-[12px] text-[#8b93a2]">Partner account details</div>
                  </div>
                  <button onClick={() => setEditOpen(true)} className="text-[#6e7584]">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
                  <DetailStat label="Partner Name" value={partnerName || "-"} isLoading={isLoading} />
                  <DetailStat label="Type" value={partner?.type ?? "-"} isLoading={isLoading} />
                  <DetailStat label="Primary Contact" value={partnerPoc || "-"} isLoading={isLoading} />
                  <DetailStat label="Primary Email" value={partnerEmail || "-"} isLoading={isLoading} />
                  <DetailStat label="Primary Phone" value={partnerPhone || "-"} isLoading={isLoading} />
                  <DetailStat label="Website" value={partner?.website ?? "-"} isLoading={isLoading} />
                  <DetailStat label="Address" value={partner?.address ?? "-"} isLoading={isLoading} />
                  <DetailStat label="Founded In" value={partner?.foundedIn ?? "-"} isLoading={isLoading} />
                </div>
              </div>
            ) : null}
            {tab === "chat" ? (
              <div className="rounded-2xl border border-[#e3e7ee] bg-white">
                <div className="border-b border-[#e3e7ee] px-5 py-4">
                  <div className="text-[18px] font-semibold text-[#1f2533]">Chat</div>
                  <div className="text-[12px] text-[#8b93a2]">Send a message to this partner</div>
                </div>
                <div className="min-h-[320px] space-y-3 px-5 py-4 text-[12px] text-[#4b5563]">
                  {chatLog.length === 0 ? (
                    <div className="rounded-md border border-[#e6eaf1] bg-[#fafbfc] px-3 py-3 text-[12px] text-[#8b93a2]">
                      No messages yet.
                    </div>
                  ) : (
                    chatLog.map((item) => (
                      <div key={item.id} className="rounded-xl border border-[#e6eaf1] bg-[#f8fafc] px-3 py-2">
                        {item.message}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center gap-2 border-t border-[#e3e7ee] px-5 py-4">
                  <input
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    placeholder="Type a message"
                    className="h-9 flex-1 rounded-md border border-[#d7dde8] px-3 text-[12px] outline-none"
                  />
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-[#11163f] px-3 text-[12px] font-semibold text-white"
                    onClick={handleSendMessage}
                  >
                    Send
                    <SendHorizonal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <aside className="flex h-full w-full max-w-[380px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-[20px] font-medium text-[#1b2230]">Edit Partner</div>
              <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setEditOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-4 py-4 text-[11px] text-[#2b3445]">
              {actionError ? (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                  {actionError}
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Partner Name*</label>
                  <input
                    value={editForm.name}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Type</label>
                  <input
                    value={editForm.providerType}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, providerType: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Contact Name</label>
                  <input
                    value={editForm.primaryPerson}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryPerson: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Contact</label>
                  <input
                    value={editForm.primaryContact}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryContact: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Email</label>
                  <input
                    value={editForm.primaryEmail}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryEmail: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Website</label>
                  <input
                    value={editForm.url}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, url: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Address</label>
                  <input
                    value={editForm.address}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Founded In</label>
                  <input
                    value={editForm.foundedIn}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, foundedIn: event.target.value }))}
                    className="h-8 w-full rounded border border-[#d5dbe6] px-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-semibold">Remarks</label>
                <textarea
                  rows={4}
                  value={editForm.remarks}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, remarks: event.target.value }))}
                  className="w-full rounded border border-[#d5dbe6] p-2 text-[11px]"
                />
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-2">
              <button className="h-8 rounded border border-[#cfd4df] bg-white text-[11px] font-semibold text-[#30384a]" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button
                className="h-8 rounded bg-[#11163f] text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
