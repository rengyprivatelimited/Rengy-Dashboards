"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Building2, CalendarClock, ChevronDown, Mail, MapPin, Phone, Search, Star, User, X } from "lucide-react";
import { RootSidebar } from "@/components/RootSidebar";
import { mockData } from "@/lib/mock-data";
import { getVendorManagementData } from "@/features/admin/api/vendor-management";

const fallbackVendorCards = mockData.vendorManagement.vendors;
const fallbackVendorRequests = mockData.vendorManagement.requests;

function VendorCard({
  id,
  name,
  rating,
  compliance,
  projects,
  costRange,
  teamSize,
  location,
  userId
}: {
  id: number;
  name: string;
  rating: string;
  compliance: string;
  projects: string;
  costRange: string;
  teamSize: string;
  location: string;
  userId: string;
}) {
  const hrefId = userId && userId !== "-" ? userId : String(id);
  return (
    <Link
      href={`/vendor-management/${hrefId}`}
      className="group block rounded-lg border border-[#eceef2] bg-white p-3 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-[#d8deea] hover:shadow-[0_2px_8px_rgba(17,22,63,0.08),0_10px_22px_rgba(17,22,63,0.06)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#2b3243]">
          <div className="rounded border border-[#ced4df] p-1 text-[#1f243b]">
            <Building2 className="h-3 w-3" />
          </div>
          <h3 className="text-[13px] font-semibold leading-none transition-colors duration-200 group-hover:text-[#11163f]">
            {name}
          </h3>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-[#eef0f2] px-2 py-0.5 text-[13px] font-semibold leading-none text-[#4b5363] transition-colors duration-200 group-hover:bg-[#e8ecf7]">
          <Star className="h-3 w-3 fill-[#f3c648] text-[#f3c648]" />
          {rating}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] text-[#666d7b]">Compliance</span>
        <span className="text-[20px] font-medium leading-none tracking-[-0.01em] text-[#4f5663]">{compliance}</span>
      </div>
      <div className="mt-2 h-[5px] rounded bg-[#d9dde3]">
        <div className="h-[5px] w-[52%] rounded bg-[#21a23a] transition-all duration-200 group-hover:w-[56%]" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-3">
        <div>
          <div className="text-[12px] text-[#737a88]">Projects</div>
          <div className="mt-1 text-[20px] font-medium leading-none text-[#323843]">{projects}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#737a88]">Cost Range</div>
          <div className="mt-1 text-[14px] font-semibold leading-none text-[#444a56]">{costRange}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#737a88]">Team Size</div>
          <div className="mt-1 text-[20px] font-medium leading-none text-[#323843]">{teamSize}</div>
        </div>
        <div>
          <div className="text-[12px] text-[#737a88]">Location</div>
          <div className="mt-1 text-[14px] font-semibold leading-none text-[#444a56]">{location}</div>
        </div>
      </div>
    </Link>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="inline-flex h-9 items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#7b8495]">
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

export default function VendorManagementPage() {
  const [activeTab, setActiveTab] = useState<"vendors" | "requests">("vendors");
  const [vendorCards, setVendorCards] = useState(fallbackVendorCards);
  const [vendorRequests, setVendorRequests] = useState(fallbackVendorRequests);
  const [selectedRequest, setSelectedRequest] = useState<(typeof fallbackVendorRequests)[number] | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorManagementData({ search: searchTerm })
      .then((result) => {
        if (!isMounted) return;
        if (result.vendors.length > 0) setVendorCards(result.vendors);
        if (result.requests.length > 0) setVendorRequests(result.requests);
      })
      .catch((error) => {
        console.error("Vendor management API failed. Using fallback data.", error);
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#171b24]" suppressHydrationWarning>
      <div className="flex">
        <RootSidebar activeLabel="Vendor Management" />

        <main className="min-w-0 flex-1">
          <header className="flex h-[52px] items-center justify-between border-b border-[#d5d9e2] bg-[#f8f9fb] px-5">
            <div className="text-[20px] font-semibold text-[#202736]">Admin</div>
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

          <section className="p-4">
            <h1 className="text-[32px] font-semibold leading-none text-[#1d2028]">Vendors</h1>

            <div className="mt-4 flex h-9 w-[330px] rounded border border-[#dde1e8] bg-[#f2f4f7] p-0.5 text-[14px] font-semibold">
              <button
                className={`flex-1 rounded ${activeTab === "vendors" ? "bg-[#11163f] text-white" : "text-[#7a8494]"}`}
                onClick={() => setActiveTab("vendors")}
              >
                Vendors
              </button>
              <button
                className={`flex-1 rounded ${activeTab === "requests" ? "bg-[#11163f] text-white" : "text-[#7a8494]"}`}
                onClick={() => setActiveTab("requests")}
              >
                Vendor Requests
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex h-9 w-[180px] items-center gap-2 rounded border border-[#d8dde5] bg-white px-3 text-[12px] text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search"
                  className="h-full w-full bg-transparent text-[12px] text-[#111827] outline-none placeholder:text-[#9aa2b1]"
                />
              </div>
              {activeTab === "vendors" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <FilterButton label="Highest no. Projects" />
                  <FilterButton label="Conversion Rate" />
                  <FilterButton label="Rating" />
                  <FilterButton label="Location" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <FilterButton label="Location" />
                </div>
              )}
            </div>

            {activeTab === "vendors" ? (
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {vendorCards.map((card) => (
                  <VendorCard
                    key={card.id}
                    id={card.id}
                    name={card.name}
                    rating={card.rating}
                    compliance={card.compliance}
                    projects={card.projects}
                    costRange={card.costRange}
                    teamSize={card.teamSize}
                    location={card.location}
                    userId={card.userId}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {vendorRequests.map((request) => (
                  <article key={request.id} className="rounded-lg border border-[#dde2eb] bg-white p-1.5">
                    <div className="rounded-md border border-[#d7deea] bg-[#eef2ff] px-2.5 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded border border-[#b9c3d2] p-1 text-[#1e243f]">
                            <Building2 className="h-3 w-3" />
                          </div>
                          <h3 className="text-[13px] font-semibold text-[#2d3445]">{request.name}</h3>
                        </div>
                        <div className="inline-flex items-center gap-1 text-[9px] text-[#8b94a3]">
                          <CalendarClock className="h-3 w-3" />
                          {request.requestedOn}
                        </div>
                      </div>
                      <div className="my-2 h-px bg-[#d5dbea]" />
                      <div className="grid grid-cols-2 gap-y-2">
                        <div>
                          <div className="text-[14px] font-semibold text-[#2f3647]">{request.email}</div>
                          <div className="text-[10px] text-[#8992a2]">Business Email</div>
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#2f3647]">{request.mobile}</div>
                          <div className="text-[10px] text-[#8992a2]">Business Mobile</div>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-[#8992a2]">Company Address</div>
                      <div className="mt-1 text-[13px] font-semibold leading-snug text-[#2f3647]">{request.address}</div>
                    </div>
                    <button
                      className="mt-1.5 h-7 w-full rounded bg-[#11163f] text-[11px] font-semibold text-white"
                      onClick={() => setSelectedRequest(request)}
                    >
                      View Details
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {selectedRequest ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
          <aside className="flex h-full w-full max-w-[430px] flex-col border-l border-[#d7dde8] bg-white shadow-[-12px_0_28px_rgba(2,6,23,0.15)]">
            <div className="border-b border-[#e4e7ee] px-4 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[16px] font-semibold text-[#1b2230]">{selectedRequest.name}</div>
                  <div className="mt-1 text-[10px] text-[#8892a3]">{selectedRequest.requestedOn}</div>
                </div>
                <button
                  className="rounded border border-[#ced4df] p-1 text-[#5a6373] hover:bg-[#f2f4f8]"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-4 py-3 text-[10px] text-[#2b3445]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">Vendor ID</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.vendorId}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">Vendor Name</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.name}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">Business Email</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.email}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">Business Phone</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.mobile}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <User className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">POC</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.pocName}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">POC Phone</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.pocPhone}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">POC Email</div>
                    <div className="mt-1 text-xs font-semibold leading-none text-[#1f2532]">
                      {selectedRequest.pocEmail}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#1f4f84]" />
                  <div>
                    <div className="text-[#465062]">Address</div>
                    <div className="mt-1 text-xs font-semibold leading-snug text-[#1f2532]">
                      {selectedRequest.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e2e6ed] pt-3">
                <div className="mb-2 text-sm font-semibold text-[#1f2532]">Files</div>
                <div className="space-y-2">
                  {selectedRequest.documents.length === 0 ? (
                    <div className="rounded-md border border-[#cad3e4] bg-[#f6f8fc] px-2 py-2 text-[10px] text-[#6f7788]">
                      No documents uploaded.
                    </div>
                  ) : (
                    selectedRequest.documents.map((doc, index) => (
                      <div
                        key={`${doc.name}-${index}`}
                        className="flex items-center justify-between rounded-md border border-[#cad3e4] bg-[#e8eefb] px-2 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-white p-1">
                            <Building2 className="h-3.5 w-3.5 text-[#4c74c0]" />
                          </div>
                          <div>
                            <div className="text-[12px] font-semibold text-[#1f2532]">{doc.name}</div>
                            <div className="text-[10px] text-[#6f7788]">{doc.uploadedAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="rounded border border-[#c2cce0] bg-white px-2 py-0.5 text-[10px] text-[#1f4f84]">DL</button>
                          <button className="rounded bg-[#10153d] px-2 py-0.5 text-[10px] text-white">View</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button className="mt-3 h-8 w-full rounded border border-[#f08f8f] bg-white text-[10px] font-semibold text-[#e53935]">
                  Request Re - Submit
                </button>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 px-4 pb-5 pt-3">
              <button className="h-8 rounded border border-[#f08f8f] bg-white text-[10px] font-semibold text-[#e53935]" onClick={() => setSelectedRequest(null)}>
                Reject
              </button>
              <button className="h-8 rounded bg-[#11163f] text-[10px] font-semibold text-white" onClick={() => setSelectedRequest(null)}>
                Accept
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

