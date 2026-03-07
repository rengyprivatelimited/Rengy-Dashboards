"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  getVendorDetailData,
  updateVendorDetail,
  updateVendorStatus,
  type VendorDetail,
  type VendorProjectHistory,
  type VendorTicketHistory,
} from "@/features/admin/api/vendor-detail";

type VendorTab = "overview" | "project" | "ticket" | "account" | "chat";

const emptyDetail: VendorDetail = {
  id: "",
  name: "-",
  vendorCode: "-",
  rating: "0",
  reviewCount: "0",
  location: "-",
  onboardedOn: "-",
  pocName: "-",
  pocEmail: "-",
  pocPhone: "-",
  email: "-",
  phone: "-",
  address: "-",
  gstNumber: "-",
  panNumber: "-",
  bankAccount: "-",
  bankCode: "-",
  documents: [],
  performance: {
    totalAssigned: "0",
    completed: "0",
    ongoing: "0",
    avgInstallTime: "-",
    lastAssigned: "-",
    delayed: "0",
  },
};

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

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[#e6eaf2] ${className}`} />;
}

function getReviewWidth(count: string, total: string): number {
  const countValue = Number(count);
  const totalValue = Number(total);
  if (!Number.isFinite(countValue) || !Number.isFinite(totalValue) || totalValue <= 0) return 0;
  return Math.round((countValue / totalValue) * 100);
}

type VendorDetailPageMode = "admin" | "sales-embedded";

type VendorDetailPageProps = {
  mode?: VendorDetailPageMode;
};

export default function VendorDetailPage({ mode = "admin" }: VendorDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const isSalesEmbedded = mode === "sales-embedded";
  const vendorBasePath = isSalesEmbedded ? "/sales-team/vendor-management" : "/vendor-management";
  const [activeTab, setActiveTab] = useState<VendorTab>("overview");
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [projectSortOpen, setProjectSortOpen] = useState(false);
  const [ticketSortOpen, setTicketSortOpen] = useState(false);
  const [vendorDetail, setVendorDetail] = useState<VendorDetail>(emptyDetail);
  const [projectHistory, setProjectHistory] = useState<VendorProjectHistory[]>([]);
  const [ticketHistory, setTicketHistory] = useState<VendorTicketHistory[]>([]);
  const [editForm, setEditForm] = useState({
    vendorCode: "",
    vendorName: "",
    pocName: "",
    pocPhone: "",
    pocEmail: "",
    address: "",
  });
  const [reviewSummary, setReviewSummary] = useState({
    average: "0",
    total: "0",
    distribution: { "5": "0", "4": "0", "3": "0", "2": "0", "1": "0" },
    reviews: [] as Array<{ date: string; author: string; text: string; rating: number }>,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const projectSortRef = useRef<HTMLDivElement | null>(null);
  const ticketSortRef = useRef<HTMLDivElement | null>(null);

  const projectList = useMemo<VendorProjectHistory[]>(() => {
    return projectHistory;
  }, [projectHistory]);

  const ticketList = useMemo<VendorTicketHistory[]>(() => {
    return ticketHistory;
  }, [ticketHistory]);

  const vendorId = useMemo(() => {
    const raw = Array.isArray(params?.vendorId) ? params.vendorId[0] : params?.vendorId;
    if (!raw) return "0";
    const match = String(raw).match(/\d+/g);
    return match ? match.join("") : String(raw);
  }, [params]);

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

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setLoadError(null);
    getVendorDetailData(vendorId)
      .then((result) => {
        if (!isMounted) return;
        setVendorDetail(result.detail);
        setProjectHistory(result.projects);
        setTicketHistory(result.tickets);
        setReviewSummary(result.review);
      })
      .catch((error) => {
        console.error("Vendor detail API failed.", error);
        if (isMounted) {
          setLoadError("Unable to load vendor details right now.");
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

  useEffect(() => {
    if (!isEditDrawerOpen) return;
    setEditForm({
      vendorCode: vendorDetail.vendorCode,
      vendorName: vendorDetail.name,
      pocName: vendorDetail.pocName,
      pocPhone: vendorDetail.pocPhone,
      pocEmail: vendorDetail.pocEmail,
      address: vendorDetail.address,
    });
  }, [isEditDrawerOpen, vendorDetail]);

  async function handleSaveVendor() {
    setActionError(null);
    setIsSaving(true);
    try {
      await updateVendorDetail(vendorId, editForm);
      setVendorDetail((prev) => ({
        ...prev,
        vendorCode: editForm.vendorCode || prev.vendorCode,
        name: editForm.vendorName || prev.name,
        pocName: editForm.pocName || prev.pocName,
        pocPhone: editForm.pocPhone || prev.pocPhone,
        pocEmail: editForm.pocEmail || prev.pocEmail,
        address: editForm.address || prev.address,
        email: editForm.pocEmail || prev.email,
        phone: editForm.pocPhone || prev.phone,
      }));
      setIsEditDrawerOpen(false);
    } catch (error) {
      console.error("Vendor update failed.", error);
      setActionError("Unable to save vendor details right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusUpdate(type: "deactivate" | "delete") {
    if (type === "delete" && !window.confirm("Delete this vendor account? This action cannot be undone.")) {
      return;
    }
    if (type === "deactivate" && !window.confirm("Deactivate this vendor account?")) {
      return;
    }
    setActionError(null);
    setIsStatusUpdating(true);
    try {
      await updateVendorStatus(vendorId, type);
      if (type === "delete") {
        router.push(vendorBasePath);
      }
    } catch (error) {
      console.error("Vendor status update failed.", error);
      setActionError("Unable to update vendor status right now.");
    } finally {
      setIsStatusUpdating(false);
    }
  }

  return (
    <div className={`${isSalesEmbedded ? "min-w-0 w-full" : "min-h-screen bg-[#eceef2]"} text-[#171b24]`} suppressHydrationWarning>
      <div className={isSalesEmbedded ? "min-w-0 w-full" : "flex"}>
        {!isSalesEmbedded ? <RootSidebar activeLabel="Vendor Management" /> : null}

        <main className={isSalesEmbedded ? "min-w-0 w-full" : "min-w-0 flex-1"}>
          {!isSalesEmbedded ? (
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
          ) : null}

          <section className={isSalesEmbedded ? "space-y-4 pt-1" : "space-y-4 p-4"}>
            {isLoading ? (
              <>
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-4 w-4" />
                  <SkeletonBlock className="h-5 w-[180px]" />
                </div>
                <div className="flex h-10 w-full gap-1 rounded border border-[#e2e6ed] bg-[#f8f9fb] p-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-full flex-1" />
                  ))}
                </div>
                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-4">
                  <SkeletonBlock className="h-[160px] w-full" />
                  <div className="-mt-8 ml-4 h-[58px] w-[58px] rounded-xl border border-[#d8dcef] bg-[#f1ecff] p-1.5 shadow-sm">
                    <SkeletonBlock className="h-full w-full rounded-full" />
                  </div>
                  <div className="mt-4 space-y-3 px-2 pb-2">
                    <SkeletonBlock className="h-4 w-[260px]" />
                    <SkeletonBlock className="h-4 w-[200px]" />
                    <SkeletonBlock className="h-4 w-[180px]" />
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-5">
                  <SkeletonBlock className="h-4 w-[180px]" />
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonBlock key={index} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {loadError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {loadError}
                  </div>
                ) : null}
                {actionError ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {actionError}
                  </div>
                ) : null}
                <button
                  className="flex items-center gap-3 text-[#202736]"
                  onClick={() => router.push(vendorBasePath)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <h1 className="text-[16px] font-semibold leading-none">{vendorDetail.name}</h1>
                </button>

                <div className="flex h-10 w-full gap-1 rounded border border-[#e2e6ed] bg-[#f8f9fb] p-1 text-sm font-medium">
                  <TabButton active={activeTab === "overview"} label="Overview" onClick={() => setActiveTab("overview")} />
                  <TabButton active={activeTab === "project"} label="Project History" onClick={() => setActiveTab("project")} />
                  <TabButton active={activeTab === "ticket"} label="Ticket History" onClick={() => setActiveTab("ticket")} />
                  <TabButton active={activeTab === "account"} label="Account Settings" onClick={() => setActiveTab("account")} />
                  <TabButton active={activeTab === "chat"} label="Chat" onClick={() => setActiveTab("chat")} />
                </div>

            {!isLoading && activeTab === "overview" ? (
              <>
                <div className="rounded-2xl border border-[#e3e7ee] bg-white p-4">
                  <div className="h-[160px] rounded-xl bg-gradient-to-r from-[#8d693f] via-[#5a8aac] to-[#d4dbe4]" />
                  <div className="-mt-8 ml-4 h-[58px] w-[58px] rounded-xl border border-[#d8dcef] bg-[#f1ecff] p-1.5 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1b1e5a] text-[12px] font-semibold text-[#4ad5cb]">eco</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-4 px-2 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[16px] font-semibold leading-none text-[#222938]">{vendorDetail.name}</h2>
                        <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <Star className="h-4 w-4 fill-[#f2ab2e] text-[#f2ab2e]" />
                        <span className="text-xs text-[#7a8394]">
                          {vendorDetail.rating} / ({vendorDetail.reviewCount})
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-[#7e8696]">
                        Vendor ID: {vendorDetail.vendorCode} <span className="mx-2 text-[#c6cbd5]">.</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#5a6273]">
                        <MapPin className="h-4 w-4" />
                        {vendorDetail.location}
                      </div>
                      <div className="mt-2 text-sm text-[#8b93a2]">Onboarded On: {vendorDetail.onboardedOn}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#8a92a0]">POC :</div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#2a3140]">
                        <div className="h-6 w-6 rounded-full bg-[#d8b08f]" />
                        {vendorDetail.pocName}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#2a3140]">
                        <Mail className="h-4 w-4" />
                        {vendorDetail.pocEmail}
                      </div>
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
                    <StatLine label="Email Address" value={vendorDetail.email} />
                    <StatLine label="Phone" value={vendorDetail.phone} />
                    <StatLine label="Company Address" value={vendorDetail.address} />
                    <StatLine label="GST Number" value={vendorDetail.gstNumber} />
                    <StatLine label="PAN Number" value={vendorDetail.panNumber} />
                    <StatLine label="Bank Account" value={vendorDetail.bankAccount} />
                    <StatLine label="IFSC Code" value={vendorDetail.bankCode} />
                  </div>
                    <div className="mt-6">
                      <div className="mb-2 text-sm text-[#8b93a2]">Documents Uploaded</div>
                      <div className="space-y-2">
                        {vendorDetail.documents.length === 0 ? (
                          <div className="rounded-lg border border-[#dfe3ea] bg-[#f8f9fb] px-4 py-3 text-sm text-[#8b93a2]">
                            No documents uploaded.
                          </div>
                        ) : (
                          vendorDetail.documents.map((doc, i) => (
                            <div key={`${doc.name}-${i}`} className="flex items-center justify-between rounded-lg border border-[#dfe3ea] bg-white px-4 py-2">
                            <div className="flex items-center gap-3">
                              <div className="rounded bg-[#ffecec] px-2 py-1 text-[10px] font-semibold text-[#e45050]">{doc.type}</div>
                              <div>
                                <div className="text-sm font-medium text-[#2a3140]">{doc.name}</div>
                                <div className="text-xs text-[#8b93a2]">{doc.size}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                className="text-[#2aa36b]"
                                onClick={() => {
                                  if (doc.url) {
                                    window.open(doc.url, "_blank", "noopener,noreferrer");
                                  }
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="text-[#ef5353]"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </div>
                          ))
                        )}
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
                    <StatLine label="Total Projects Assigned" value={vendorDetail.performance.totalAssigned} />
                    <StatLine label="Projects Completed" value={vendorDetail.performance.completed} />
                    <StatLine label="Ongoing Projects" value={vendorDetail.performance.ongoing} />
                    <StatLine label="Average Installation Time" value={vendorDetail.performance.avgInstallTime} />
                    <StatLine label="Last Project Assigned" value={vendorDetail.performance.lastAssigned} />
                    <StatLine label="Delayed Projects" value={vendorDetail.performance.delayed} />
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
                      <div className="mt-2 text-[36px] font-semibold leading-none">{reviewSummary.average}</div>
                      <div className="mt-2 flex gap-1 text-[#e0aa4c]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(reviewSummary.average)) ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <div className="mt-1 text-[13px] text-[#8a92a0]">({reviewSummary.total} Reviews)</div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {[
                        ["5 stars", reviewSummary.distribution["5"]],
                        ["4 stars", reviewSummary.distribution["4"]],
                        ["3 stars", reviewSummary.distribution["3"]],
                        ["2 stars", reviewSummary.distribution["2"]],
                        ["1 star", reviewSummary.distribution["1"]],
                      ].map(([label, count]) => (
                        <div key={label} className="grid grid-cols-[56px_1fr_34px] items-center gap-2">
                          <span className="text-xs text-[#444c5c]">{label}</span>
                          <div className="h-2 rounded bg-[#eceff4]">
                            <div className="h-2 rounded bg-[#d9a14c]" style={{ width: `${getReviewWidth(count, reviewSummary.total)}%` }} />
                          </div>
                          <span className="text-xs text-[#8a92a0]">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 space-y-8">
                    {reviewSummary.reviews.length == 0 ? (
                      <div className="rounded-lg border border-[#eceff4] bg-[#fafbfc] px-4 py-3 text-sm text-[#8a92a0]">
                        No reviews yet.
                      </div>
                    ) : (
                      reviewSummary.reviews.map((item, index) => (
                        <div key={`${item.author}-${index}`} className="border-t border-[#eceff4] pt-6 first:border-t-0 first:pt-0">
                          <div className="text-[13px] text-[#8a92a0]">{item.date}</div>
                          <div className="mt-2 flex gap-1 text-[#e0aa4c]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < item.rating ? "fill-current" : ""}`} />
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dbe2ff] text-xs font-semibold text-[#5d66d8]">
                              {item.author.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-[#202636]">{item.author}</span>
                          </div>
                          <p className="mt-3 max-w-[760px] text-[13px] text-[#2e3645]">{item.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : null}

            {!isLoading && activeTab === "project" ? (
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
                  {projectList.length === 0 ? (
                    <div className="col-span-full rounded-lg border border-[#e4e8ef] bg-white px-4 py-8 text-sm text-[#8b93a2]">
                      No project history available.
                    </div>
                  ) : (
                    projectList.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-lg border border-[#e4e8ef] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_2px_6px_rgba(15,23,42,0.08),0_12px_26px_rgba(15,23,42,0.08)]"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-[16px] font-semibold text-[#3a404c]">{item.name}</h3>
                          <span className="rounded-full bg-[#e8f6e8] px-2 py-0.5 text-[12px] font-semibold text-[#229e2e]">{item.status}</span>
                        </div>
                        <div className="my-2 h-px bg-[#d9dde4]" />
                        <div className="grid grid-cols-2 gap-y-2">
                          <div>
                            <div className="text-[12px] text-[#858d9b]">Client</div>
                            <div className="mt-1 text-[14px] text-[#3e4552]">{item.client}</div>
                          </div>
                          <div>
                            <div className="text-[12px] text-[#858d9b]">Cost Range</div>
                            <div className="mt-1 text-[14px] font-semibold text-[#3e4552]">{item.costRange}</div>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </>
            ) : null}

            {!isLoading && activeTab === "ticket" ? (
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
                  {ticketList.length === 0 ? (
                    <div className="px-4 py-8 text-sm text-[#8b93a2]">No ticket history available.</div>
                  ) : (
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
                        {ticketList.map((row, idx) => (
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
                  )}
                </div>
              </>
            ) : null}

            {!isLoading && activeTab === "chat" ? (
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

            {!isLoading && activeTab === "account" ? (
              <div className="max-w-[760px] space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold leading-none text-[#222938]">{vendorDetail.name}</h2>
                    <button className="text-[#6e7584]" onClick={() => setIsEditDrawerOpen(true)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <Star className="h-4 w-4 fill-[#f2ab2e] text-[#f2ab2e]" />
                    <span className="text-xs text-[#7a8394]">
                      {vendorDetail.rating} / ({vendorDetail.reviewCount})
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-[#7e8696]">
                    Vendor ID: {vendorDetail.vendorCode} <span className="mx-2 text-[#c6cbd5]">.</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-[#5a6273]">
                    <MapPin className="h-4 w-4" />
                    {vendorDetail.location}
                  </div>
                  <div className="mt-2 text-sm text-[#8b93a2]">Onboarded On: {vendorDetail.onboardedOn}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="h-9 w-[220px] rounded border border-[#ef5350] bg-white text-[12px] font-semibold text-[#ef5350] disabled:cursor-not-allowed disabled:border-[#f2b4b4] disabled:text-[#f2b4b4]"
                    onClick={() => handleStatusUpdate("deactivate")}
                    disabled={isStatusUpdating}
                  >
                    {isStatusUpdating ? "Updating..." : "Deactivate Account"}
                  </button>
                  <button
                    className="h-9 w-[220px] rounded bg-[#eb2f2f] text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#f2a1a1]"
                    onClick={() => handleStatusUpdate("delete")}
                    disabled={isStatusUpdating}
                  >
                    {isStatusUpdating ? "Updating..." : "Delete Account"}
                  </button>
                </div>
              </div>
            ) : null}
              </>
            )}
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
                  ["Vendor ID*", "vendorCode"],
                  ["Vendor Name*", "vendorName"],
                  ["POC", "pocName"],
                  ["POC Phone", "pocPhone"],
                  ["POC Email", "pocEmail"],
                  ["Address", "address"],
                ].map(([label, key]) => (
                  <div key={label}>
                    <label className="mb-1 block font-semibold text-[#1f2532]">{label}</label>
                    <input
                      value={editForm[key as keyof typeof editForm]}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      className="h-8 w-full rounded border border-[#d5dbe6] bg-white px-2 text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-3">
              <button className="h-8 rounded border border-[#cfd4df] bg-white text-[10px] font-semibold text-[#30384a]" onClick={() => setIsEditDrawerOpen(false)}>Cancel</button>
              <button
                className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9ca3b1]"
                onClick={handleSaveVendor}
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
