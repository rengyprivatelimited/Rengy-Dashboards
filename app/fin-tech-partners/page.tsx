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
  createFinTechPartner,
  deleteFinTechPartner,
  getFinTechPartner,
  getFinTechPartners,
  updateFinTechPartner,
  type FinTechPartner,
  type FinTechPartnerDetail,
  type FinTechPartnerInput,
} from "@/features/admin/api/fintech-partners";

type ViewMode = "grid" | "list";

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
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPartnerId, setEditPartnerId] = useState<number | null>(null);
  const [editPartner, setEditPartner] = useState<FinTechPartnerDetail | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<FinTechPartnerInput>({
    name: "",
    providerType: "",
    primaryPerson: "",
    primaryContact: "",
    primaryEmail: "",
    address: "",
    url: "",
    remarks: "",
    foundedIn: "",
    partnershipDate: "",
  });
  const [createForm, setCreateForm] = useState<FinTechPartnerInput>({
    name: "",
    providerType: "",
    primaryPerson: "",
    primaryContact: "",
    primaryEmail: "",
    address: "",
    url: "",
    remarks: "",
    foundedIn: "",
    partnershipDate: "",
  });
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let isActive = true;
    const loadPartners = async () => {
      try {
        setIsLoading(true);
        const result = await getFinTechPartners({
          search: debouncedSearch,
          providerType: typeFilter,
          location: locationFilter,
          page,
          perPage,
        });
        if (!isActive) return;
        setPartners(result.rows);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.warn("Failed to load fin-tech partners", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadPartners();
    return () => {
      isActive = false;
    };
  }, [debouncedSearch, typeFilter, locationFilter, page, perPage, refreshKey]);

  useEffect(() => {
    let isActive = true;

    const loadPartnerDetail = async () => {
      if (!editOpen || !editPartnerId) return;
      setIsEditLoading(true);
      try {
        const result = await getFinTechPartner(editPartnerId);
        if (!isActive) return;
        setEditPartner(result);
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
          partnershipDate: result.onboardedOn ?? "",
        });
      } catch (error) {
        console.warn("Failed to load fin-tech partner detail", error);
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

  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await createFinTechPartner(createForm);
      setCreateOpen(false);
      setCreateForm({
        name: "",
        providerType: "",
        primaryPerson: "",
        primaryContact: "",
        primaryEmail: "",
        address: "",
        url: "",
        remarks: "",
        foundedIn: "",
        partnershipDate: "",
      });
      setPage(1);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.warn("Failed to create fin-tech partner", error);
      setActionError("Unable to create partner right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editPartnerId) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await updateFinTechPartner(editPartnerId, editForm);
      setEditOpen(false);
      setEditPartner(null);
      setPage(1);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.warn("Failed to update fin-tech partner", error);
      setActionError("Unable to update partner right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (mode: "deactivate" | "delete") => {
    if (!editPartnerId) return;
    const message = mode === "delete" ? "Delete this partner? This cannot be undone." : "Deactivate this partner?";
    if (!window.confirm(message)) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await deleteFinTechPartner(editPartnerId);
      setEditOpen(false);
      setEditPartner(null);
      setPage(1);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.warn("Failed to delete fin-tech partner", error);
      setActionError("Unable to delete partner right now.");
    } finally {
      setIsSaving(false);
    }
  };

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
                onClick={() => {
                  setActionError(null);
                  setCreateOpen(true);
                }}
              >
                Create New
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex h-8 w-[200px] items-center gap-2 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-3 text-[11px] text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-[11px] text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 items-center gap-2 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-2 text-[11px] text-[#7b8495]">
                  <span>Type</span>
                  <input
                    value={typeFilter}
                    onChange={(event) => {
                      setTypeFilter(event.target.value);
                      setPage(1);
                    }}
                    placeholder="e.g. Bank"
                    className="w-20 bg-transparent text-[11px] text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                  />
                  <ChevronDown className="h-3 w-3" />
                </div>
                <div className="flex h-8 items-center gap-2 rounded-md border border-[#e2e7ef] bg-[#fbfcff] px-2 text-[11px] text-[#7b8495]">
                  <span>Location</span>
                  <input
                    value={locationFilter}
                    onChange={(event) => {
                      setLocationFilter(event.target.value);
                      setPage(1);
                    }}
                    placeholder="City"
                    className="w-20 bg-transparent text-[11px] text-[#1f2533] outline-none placeholder:text-[#9aa2b1]"
                  />
                  <ChevronDown className="h-3 w-3" />
                </div>
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
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
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
                <div className="flex items-center justify-between rounded-lg border border-[#e6eaf1] bg-white px-3 py-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span>Page {page} of {totalPages}</span>
                    <select
                      value={perPage}
                      onChange={(event) => {
                        setPerPage(Number(event.target.value));
                        setPage(1);
                      }}
                      className="inline-flex h-8 items-center rounded border border-[#d1d5db] bg-white px-3 text-xs text-[#6b7280]"
                    >
                      {[10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          Show {size} rows
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-8 rounded border border-[#d1d5db] px-3 disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </button>
                    <button className="h-8 min-w-[28px] rounded bg-[#0f1136] px-2 text-white">{page}</button>
                    <button
                      className="h-8 rounded border border-[#d1d5db] px-3 disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
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
                                  setActionError(null);
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
                    <span>Page {page} of {totalPages}</span>
                    <select
                      value={perPage}
                      onChange={(event) => {
                        setPerPage(Number(event.target.value));
                        setPage(1);
                      }}
                      className="inline-flex h-8 items-center rounded border border-[#d1d5db] bg-white px-3 text-xs text-[#6b7280]"
                    >
                      {[10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          Show {size} rows
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-8 rounded border border-[#d1d5db] px-3 disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </button>
                    <button className="h-8 min-w-[28px] rounded bg-[#0f1136] px-2 text-white">{page}</button>
                    <button
                      className="h-8 rounded border border-[#d1d5db] px-3 disabled:cursor-not-allowed disabled:text-[#9aa2b1]"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </button>
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
              {actionError ? (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                  {actionError}
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block font-semibold">Partner Name*</label>
                  <input
                    value={isEditLoading ? "" : editForm.name}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
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
                  <input
                    value={isEditLoading ? "" : editForm.address ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : "Region"}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Founded In</label>
                  <input
                    value={isEditLoading ? "" : editForm.foundedIn ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, foundedIn: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : "Year"}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Contact Name</label>
                  <input
                    value={isEditLoading ? "" : editForm.primaryPerson ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryPerson: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Contact</label>
                  <input
                    value={isEditLoading ? "" : editForm.primaryContact ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryContact: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Primary Email</label>
                  <input
                    value={isEditLoading ? "" : editForm.primaryEmail ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, primaryEmail: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">URL</label>
                  <input
                    value={isEditLoading ? "" : editForm.url ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, url: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Address</label>
                  <input
                    value={isEditLoading ? "" : editForm.address ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : ""}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
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
                  <input
                    value={isEditLoading ? "" : editForm.providerType ?? ""}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, providerType: event.target.value }))}
                    placeholder={isEditLoading ? "Loading..." : "Type"}
                    className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2"
                  />
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
                  value={editForm.remarks ?? ""}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, remarks: event.target.value }))}
                  className="w-full rounded border border-[#d5dbe6] p-2 text-[10px]"
                  placeholder={isEditLoading ? "Loading..." : "Type Remarks"}
                />
              </div>
            </div>
            <div className="mt-auto space-y-2 px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 rounded border border-[#cfd4df] bg-white text-[10px] font-semibold text-[#30384a]" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]" onClick={handleEditSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 rounded border border-[#f08f8f] bg-white text-[10px] font-semibold text-[#e53935]" onClick={() => handleDelete("deactivate")}>Deactivate Account</button>
                <button className="h-8 rounded bg-[#eb2f2f] text-[10px] font-semibold text-white" onClick={() => handleDelete("delete")}>Delete Account</button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
          <aside className="flex h-full w-full max-w-[540px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e4e7ee] px-4 py-3">
              <div className="text-[24px] font-medium leading-none text-[#1b2230]">Add New Partner</div>
              <button className="rounded border border-[#ced4df] p-1 text-[#5a6373]" onClick={() => setCreateOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-4 py-4 text-[12px] text-[#1f2532]">
              {actionError ? (
                <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                  {actionError}
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-[#2c3445]">Partner Name*</label>
                  <input
                    value={createForm.name}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Type*</label>
                  <input
                    value={createForm.providerType ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, providerType: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                    placeholder="Bank/NBFC"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Primary Email</label>
                  <input
                    value={createForm.primaryEmail ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, primaryEmail: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#2c3445]">Primary Contact</label>
                  <input
                    value={createForm.primaryContact ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, primaryContact: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Address</label>
                  <input
                    value={createForm.address ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, address: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Primary Person</label>
                  <input
                    value={createForm.primaryPerson ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, primaryPerson: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Website</label>
                  <input
                    value={createForm.url ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, url: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-[#1c2240]">Founded In</label>
                  <input
                    value={createForm.foundedIn ?? ""}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, foundedIn: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-[#d5dbe6] bg-white px-3"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-semibold text-[#1c2240]">Remarks</label>
                <textarea
                  rows={4}
                  value={createForm.remarks ?? ""}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, remarks: event.target.value }))}
                  className="w-full rounded-lg border border-[#d5dbe6] p-3"
                />
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-3">
              <button className="h-9 rounded border border-[#1d2340] bg-white text-[14px] font-semibold text-[#1d2340]" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button className="h-9 rounded bg-[#11163f] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]" onClick={handleCreate} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

