"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronDown,
  Grid3X3,
  List,
  Pencil,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import {
  getFinTechPartner,
  getFinTechPartners,
  type FinTechPartner,
  type FinTechPartnerDetail,
} from "@/features/admin/api/fintech-partners";

type ViewMode = "grid" | "list";

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-3 text-[11px] text-[#7b8495]">
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function PartnerLogo({ name, logoUrl }: { name: string; logoUrl: string }) {
  if (logoUrl) {
    return (
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#d6dce6] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={name} className="h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d6dce6] bg-white">
      <div className="h-4 w-5 rounded-sm border border-[#8a8a8a]">
        <div className="mt-1 h-px w-full bg-[#8a8a8a]" />
      </div>
    </div>
  );
}

export default function FinTechPartnersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [partners, setPartners] = useState<FinTechPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPartnerId, setEditPartnerId] = useState<number | null>(null);
  const [editPartner, setEditPartner] = useState<FinTechPartnerDetail | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    let isActive = true;
    const loadPartners = async () => {
      try {
        setIsLoading(true);
        const results = await getFinTechPartners({ search: "", page: 1, perPage: 10 });
        if (!isActive) return;
        setPartners(results);
      } catch (error) {
        console.error("Failed to load fin-tech partners", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadPartners();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadPartnerDetail = async () => {
      if (!editOpen || !editPartnerId) return;
      setIsEditLoading(true);
      try {
        const result = await getFinTechPartner(editPartnerId);
        if (!isActive) return;
        setEditPartner(result);
      } catch (error) {
        console.error("Failed to load fin-tech partner detail", error);
      } finally {
        if (isActive) setIsEditLoading(false);
      }
    };

    loadPartnerDetail();
    return () => {
      isActive = false;
    };
  }, [editOpen, editPartnerId]);

  const editPartnerLabel = useMemo(() => {
    if (isEditLoading) return "Loading...";
    return editPartner?.name ?? "Fin-tech Partner";
  }, [editPartner, isEditLoading]);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]">
      <div className="flex">
        <RootSidebar activeLabel="Fin-Tech Partners" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[50px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Admin</div>
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

          <section className="mx-auto max-w-[1280px] p-4">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <h1 className="text-[24px] font-semibold leading-none text-[#1d2028]">Fin-tech Partners</h1>
                <p className="mt-0.5 text-[11px] text-[#8a92a0]">You can see the all Fin-Tech Partners here</p>
              </div>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#181d52] px-3.5 text-[11px] font-semibold text-white"
                onClick={() => setCreateOpen(true)}
              >
                Create New
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex h-8 w-[162px] items-center gap-2 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-3 text-[11px] text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                Search
              </div>
              <div className="flex items-center gap-2">
                <FilterButton label="Type" />
                <FilterButton label="Location" />
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${viewMode === "grid" ? "border-[#11163f] text-[#11163f]" : "border-[#e2e7ef] text-[#9aa2b1]"} bg-[#fbfcff]`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md border ${viewMode === "list" ? "border-[#11163f] text-[#11163f]" : "border-[#e2e7ef] text-[#9aa2b1]"} bg-[#fbfcff]`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={`skeleton-${idx}`}
                        className="rounded-xl border border-[#e7ebf1] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-xl border border-[#e7ebf1] bg-[#eef1f6]" />
                          <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-[#e3e7ee]" />
                            <div className="h-2.5 w-16 rounded bg-[#eef1f6]" />
                          </div>
                        </div>
                        <div className="my-3 h-px bg-[#e6ebf2]" />
                        <div className="grid grid-cols-2 gap-y-3">
                          {Array.from({ length: 4 }).map((__, colIdx) => (
                            <div key={`sk-${idx}-${colIdx}`}>
                              <div className="h-2 w-12 rounded bg-[#eef1f6]" />
                              <div className="mt-2 h-3 w-20 rounded bg-[#e3e7ee]" />
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 h-7 w-full rounded-md bg-[#e3e7ee]" />
                      </div>
                    ))
                  : partners.map((item) => (
                      <article
                        key={item.id}
                        className="cursor-pointer rounded-xl border border-[#e7ebf1] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        onClick={() => router.push(`/fin-tech-partners/ft-${item.id}`)}
                      >
                        <div className="rounded-lg bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PartnerLogo name={item.name} logoUrl={item.logoUrl} />
                              <div>
                                <h3 className="text-[13px] font-medium text-[#343b47]">{item.name}</h3>
                                <div className="text-[10px] text-[#80899a]">{item.sub}</div>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 h-px bg-[#e6ebf2]" />
                          <div className="grid grid-cols-2 gap-y-3">
                            <div>
                              <div className="text-[10px] text-[#939baa]">POC</div>
                              <div className="mt-1 text-[11px] font-semibold text-[#3d4451]">{item.poc}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[#939baa]">Location</div>
                              <div className="mt-1 text-[11px] font-semibold text-[#3d4451]">{item.location}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[#939baa]">Email</div>
                              <div className="mt-1 text-[11px] font-semibold text-[#3d4451]">{item.email}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[#939baa]">Phone</div>
                              <div className="mt-1 text-[11px] font-semibold text-[#3d4451]">{item.phone}</div>
                            </div>
                          </div>
                        </div>
                        <button className="mt-3 h-7 w-full rounded-md bg-[#181d52] text-[11px] font-semibold text-white">Chat</button>
                      </article>
                    ))}
              </div>
            ) : (
              <div className="mt-3 overflow-auto rounded-lg border border-[#dce1e8] bg-white">
                <table className="w-full min-w-[1700px] text-left text-xs">
                  <thead>
                    <tr className="h-10 bg-[#d4dfdd] text-[#475260]">
                      <th className="px-2"><input type="checkbox" className="h-4 w-4" /></th>
                      <th className="px-2">Name</th>
                      <th className="px-2">⇵</th>
                      <th className="px-2">POC</th>
                      <th className="px-2">Location</th>
                      <th className="px-2">Type</th>
                      <th className="px-2">Total No Of Loans</th>
                      <th className="px-2">Disbursed No</th>
                      <th className="px-2">Resubmission needed</th>
                      <th className="px-2">Logins</th>
                      <th className="px-2">Avg Disbursed Time</th>
                      <th className="px-2">Approved Loans</th>
                      <th className="px-2">Approval Rate</th>
                      <th className="px-2">Rejected Rate</th>
                      <th className="px-2">Rejected Loans</th>
                      <th className="px-2">Phone</th>
                      <th className="px-2">Email</th>
                      <th className="px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading
                      ? Array.from({ length: 8 }).map((_, idx) => (
                          <tr key={`row-skel-${idx}`} className="h-12 border-t border-[#e6eaf1] odd:bg-[#f8f9fb]">
                            {Array.from({ length: 18 }).map((__, colIdx) => (
                              <td key={`cell-${idx}-${colIdx}`} className="px-2">
                                <div className="h-3 w-full max-w-[120px] rounded bg-[#e3e7ee]" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : partners.map((row) => (
                          <tr
                            key={row.id}
                            className="h-12 cursor-pointer border-t border-[#e6eaf1] odd:bg-[#f8f9fb]"
                            onClick={() => router.push(`/fin-tech-partners/ft-${row.id}`)}
                          >
                            <td className="px-2"><input type="checkbox" className="h-4 w-4" onClick={(event) => event.stopPropagation()} /></td>
                            <td className="px-2">
                              <div className="flex items-center gap-2">
                                <PartnerLogo name={row.name} logoUrl={row.logoUrl} />
                                <div>
                                  <div className="font-medium">{row.name}</div>
                                  <div className="text-[10px] text-[#7c8596]">{row.sub}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2" />
                            <td className="px-2">{row.poc}</td>
                            <td className="px-2">{row.location}</td>
                            <td className="px-2 font-semibold">{row.type}</td>
                            <td className="px-2">{row.loans}</td>
                            <td className="px-2">{row.disbursed}</td>
                            <td className="px-2">{row.resub}</td>
                            <td className="px-2">{row.logins}</td>
                            <td className="px-2">{row.avg}</td>
                            <td className="px-2">{row.approved}</td>
                            <td className="px-2"><span className="rounded bg-[#daf2da] px-2 py-0.5 text-[10px] font-semibold text-[#1b9e30]">{row.approvalRate}</span></td>
                            <td className="px-2"><span className="rounded bg-[#fbe8db] px-2 py-0.5 text-[10px] font-semibold text-[#c16b1e]">{row.rejectedRate}</span></td>
                            <td className="px-2">{row.rejectedLoans}</td>
                            <td className="px-2">{row.phone}</td>
                            <td className="px-2">{row.email}</td>
                            <td className="px-2">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEditPartnerId(row.id);
                                  setEditPartner(null);
                                  setEditOpen(true);
                                }}
                                className="text-[#6d7483]"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-[#e6eaf1] px-3 py-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span>Page 1 of 10</span>
                    <button className="inline-flex h-8 items-center rounded border border-[#d1d5db] px-3 text-xs text-[#6b7280]">
                      Show 10 rows
                      <ChevronDown className="ml-2 h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-8 rounded border border-[#d1d5db] px-3">Previous</button>
                    <button className="h-8 w-7 rounded bg-[#0f1136] text-white">1</button>
                    {["2", "4", "5", "6", "7"].map((n) => (
                      <button key={n} className="h-8 w-7 rounded border border-[#d1d5db]">{n}</button>
                    ))}
                    <button className="h-8 rounded border border-[#d1d5db] px-3">Next</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <aside className="flex h-full w-full max-w-[360px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-[24px] font-medium leading-none text-[#1b2230]">Edit {editPartnerLabel}</div>
              <button
                className="rounded border border-[#ced4df] p-1 text-[#5a6373]"
                onClick={() => setEditOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-4 py-3 text-[10px] text-[#2b3445]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-semibold">Partner Name*</label>
                  <input
                    value={isEditLoading ? "" : editPartner?.name ?? ""}
                    readOnly
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Partner Logo</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">
                    Upload jpg./jpg
                    <span className="inline-flex h-6 items-center gap-1 rounded bg-[#11163f] px-2 text-[10px] text-white">
                      Upload <Upload className="h-3 w-3" />
                    </span>
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Region*</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">
                    {isEditLoading ? "Loading..." : editPartner?.location ?? "-"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Founded In</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">
                    {isEditLoading ? "Loading..." : editPartner?.foundedIn ?? "-"}
                    <Calendar className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Contact Name</label>
                  <input
                    value={isEditLoading ? "" : editPartner?.poc ?? ""}
                    readOnly
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Contact</label>
                  <input
                    value={
                      isEditLoading
                        ? ""
                        : editPartner
                          ? `${editPartner.email || "-"} / ${editPartner.phone || "-"}`
                          : ""
                    }
                    readOnly
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">URL</label>
                  <input
                    value={isEditLoading ? "" : editPartner?.website ?? ""}
                    readOnly
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Address</label>
                  <input
                    value={isEditLoading ? "" : editPartner?.address ?? ""}
                    readOnly
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Upload Files</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">
                    Upload Files
                    <span className="inline-flex h-6 items-center gap-1 rounded bg-[#11163f] px-2 text-[10px] text-white">
                      Upload <Upload className="h-3 w-3" />
                    </span>
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Type Of Fintech Partner</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">
                    {isEditLoading ? "Loading..." : editPartner?.type ?? "-"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Partner View</label>
                  <button className="flex h-8 w-full items-center justify-between rounded border border-[#d5dbe6] bg-[#f3f4f6] px-2">Select <ChevronDown className="h-3.5 w-3.5" /></button>
                </div>
              </div>
        
              <div>
                <label className="mb-1 block font-semibold">Remarks <span className="font-normal text-[#6f7788]">( Reason for rejection )</span></label>
                <textarea
                  rows={4}
                  defaultValue={editPartner?.remarks ?? ""}
                  className="w-full rounded border border-[#d5dbe6] p-2 text-[10px]"
                  placeholder={isEditLoading ? "Loading..." : "Type Remarks"}
                />
              </div>
            </div>
            <div className="mt-auto space-y-2 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 rounded border border-[#cfd4df] bg-white text-[10px] font-semibold text-[#30384a]" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white" onClick={() => setEditOpen(false)}>Save</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 rounded border border-[#f08f8f] bg-white text-[10px] font-semibold text-[#e53935]">Deactivate Account</button>
                <button className="h-8 rounded bg-[#eb2f2f] text-[10px] font-semibold text-white">Delete Account</button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
          <aside className="flex h-full w-full max-w-[540px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-[24px] font-medium leading-none text-[#1b2230]">Add New Lead</div>
              <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setCreateOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-4 py-4 text-[12px] text-[#1f2532]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-[#2c3445]">Lead ID</label>
                  <input value="#121212" readOnly className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Customer Name*</label>
                  <input value="Name" readOnly className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Email*</label>
                  <input value="email" readOnly className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#2c3445]">Phone</label>
                  <input value="Phone" readOnly className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Address*</label>
                  <input value="Address" readOnly className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3" />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Assign Vendor</label>
                  <button className="flex h-10 w-full items-center justify-between rounded-lg border border-[#d5dbe6] bg-[#f3f4f6] px-3">
                    Select
                    <ChevronDown className="h-4 w-4 text-[#1f2532]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-3">
              <button className="h-9 rounded border border-[#1d2340] bg-white text-[14px] font-semibold text-[#1d2340]" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button className="h-9 rounded bg-[#11163f] text-[14px] font-semibold text-white" onClick={() => setCreateOpen(false)}>
                Save
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

