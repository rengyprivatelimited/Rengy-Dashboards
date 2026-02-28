import { apiRequest } from "@/lib/api/client";

export type VendorDocument = {
  name: string;
  size: string;
  type: string;
  url: string;
  number: string;
  accNumber: string;
  code: string;
};

export type VendorDetail = {
  id: string;
  name: string;
  vendorCode: string;
  rating: string;
  reviewCount: string;
  location: string;
  onboardedOn: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  bankAccount: string;
  bankCode: string;
  documents: VendorDocument[];
  performance: {
    totalAssigned: string;
    completed: string;
    ongoing: string;
    avgInstallTime: string;
    lastAssigned: string;
    delayed: string;
  };
};

export type VendorProjectHistory = {
  id: string;
  name: string;
  status: string;
  client: string;
  costRange: string;
};

export type VendorTicketHistory = {
  id: string;
  project: string;
  status: string;
  created: string;
  resolved: string;
};

export type VendorDetailData = {
  detail: VendorDetail;
  projects: VendorProjectHistory[];
  tickets: VendorTicketHistory[];
  review: {
    average: string;
    total: string;
    distribution: Record<string, string>;
    reviews: Array<{ date: string; author: string; text: string; rating: number }>;
  };
};

export type VendorDetailUpdateInput = {
  vendorCode?: string;
  vendorName?: string;
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
  address?: string;
};

function toObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function pickList(payload: unknown): unknown[] {
  const root = toObject(payload);

  if (Array.isArray(root.list)) return root.list;
  if (Array.isArray(root.records)) return root.records;

  if (Array.isArray(root.data)) {
    const results = root.data.find((entry) => toObject(entry).id === "results");
    const resultList = toObject(results).list;
    if (Array.isArray(resultList)) return resultList;
    return root.data;
  }

  const data = toObject(root.data);
  if (Array.isArray(data.list)) return data.list;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.records)) return data.records;

  const results = toObject(root.results ?? data.results);
  if (Array.isArray(results.list)) return results.list;
  if (Array.isArray(results.data)) return results.data;

  return [];
}

function toStringValue(value: unknown, fallback = "-"): string {
  if (value === null || value === undefined) return fallback;
  const next = String(value).trim();
  return next || fallback;
}

function toNumber(value: unknown): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

function formatDate(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} ${date.toLocaleString("en-US", { month: "short" })} ${year}`;
}

function formatDateTime(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year}, ${hour}:${minute}`;
}

function formatRange(minValue: unknown, maxValue: unknown): string {
  const min = toNumber(minValue);
  const max = toNumber(maxValue);
  if (min === null && max === null) return "-";
  if (min !== null && max !== null) return `Rs ${min.toLocaleString("en-IN")} - Rs ${max.toLocaleString("en-IN")}`;
  if (min !== null) return `Rs ${min.toLocaleString("en-IN")}+`;
  if (max !== null) return `Rs ${max.toLocaleString("en-IN")}`;
  return "-";
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    const text = typeof value === "string" ? value.trim() : value ? String(value).trim() : "";
    if (text) return text;
  }
  return "-";
}

function mapDocuments(value: unknown): VendorDocument[] {
  if (!Array.isArray(value)) return [];
  return value.map((doc, index) => {
    const entry = toObject(doc);
    const url = toStringValue(entry.url, "");
    return {
      name: firstNonEmptyString(entry.name, entry.type, url, `Document ${index + 1}`),
      size: toStringValue(entry.size, "-"),
      type: toStringValue(entry.type, "-"),
      url,
      number: toStringValue(entry.number, "-"),
      accNumber: toStringValue(entry.accNumber, "-"),
      code: toStringValue(entry.code, "-"),
    };
  });
}

type VendorDetailSections = {
  overview?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  reviews?: Record<string, unknown>;
};

function pickSection(list: unknown, id: string): Record<string, unknown> | undefined {
  if (!Array.isArray(list)) return undefined;
  const section = list.find((entry) => toObject(entry).id === id);
  const sectionObj = toObject(section);
  const sectionList = Array.isArray(sectionObj.list) ? sectionObj.list : [];
  return toObject(sectionList[0]);
}

function mapVendorDetailFromSections(sections: VendorDetailSections): VendorDetail {
  const vendor = sections.overview ?? {};
  const stats = sections.performance ?? {};
  const documents = mapDocuments(toObject(vendor).documents);
  const panDoc = documents.find((doc) => doc.type.toLowerCase().includes("pan") || doc.name.toLowerCase().includes("pan"));
  const bankDoc = documents.find((doc) => doc.type.toLowerCase().includes("bank") || doc.name.toLowerCase().includes("bank"));

  return {
    id: toStringValue(firstNonEmptyString(vendor.id)),
    name: toStringValue(firstNonEmptyString(vendor.name, vendor.companyName, vendor.vendorName)),
    vendorCode: toStringValue(firstNonEmptyString(vendor.vendorCode, vendor.code, vendor.referenceNo)),
    rating: toStringValue(firstNonEmptyString(sections.reviews?.average, stats.rating), "0"),
    reviewCount: toStringValue(firstNonEmptyString(sections.reviews?.total, stats.reviewCount), "0"),
    location: toStringValue(firstNonEmptyString(vendor.location, vendor.state)),
    onboardedOn: formatDate(firstNonEmptyString(vendor.onboardedOn, vendor.createdAt)),
    pocName: toStringValue(firstNonEmptyString(vendor.primaryContactPerson, vendor.pocName, vendor.name)),
    pocEmail: toStringValue(firstNonEmptyString(vendor.email, vendor.businessEmail)),
    pocPhone: toStringValue(firstNonEmptyString(vendor.businessMobile, vendor.mobileNumber)),
    email: toStringValue(firstNonEmptyString(vendor.businessEmail, vendor.email)),
    phone: toStringValue(firstNonEmptyString(vendor.businessMobile, vendor.mobileNumber)),
    address: toStringValue(firstNonEmptyString(vendor.companyAddress, vendor.location, vendor.state)),
    gstNumber: toStringValue(firstNonEmptyString(vendor.gstNumber, vendor.gst)),
    panNumber: toStringValue(firstNonEmptyString(vendor.panNumber, vendor.pan, panDoc?.number)),
    bankAccount: toStringValue(firstNonEmptyString(vendor.bankAccount, vendor.accNumber, bankDoc?.accNumber)),
    bankCode: toStringValue(firstNonEmptyString(vendor.bankCode, vendor.ifsc, bankDoc?.code)),
    documents,
    performance: {
      totalAssigned: toStringValue(firstNonEmptyString(stats.totalProjects), "0"),
      completed: toStringValue(firstNonEmptyString(stats.completedProjects), "0"),
      ongoing: toStringValue(firstNonEmptyString(stats.ongoingProjects), "0"),
      avgInstallTime: toStringValue(firstNonEmptyString(stats.avgProgress), "0"),
      lastAssigned: toStringValue(firstNonEmptyString(stats.lastProjectAssigned), "-"),
      delayed: toStringValue(firstNonEmptyString(stats.delayedProject), "0"),
    },
  };
}

function mapPerformanceFromDashboard(payload: unknown): Partial<VendorDetail["performance"]> {
  const root = toObject(payload);
  const data = root.data ?? root.list ?? root;
  const entry = Array.isArray(data) ? toObject(data[0]) : toObject(data);
  return {
    totalAssigned: toStringValue(firstNonEmptyString(entry.totalProjects, entry.totalAssigned, entry.totalProjectsAssigned), ""),
    completed: toStringValue(firstNonEmptyString(entry.completedProjects, entry.projectsCompleted), ""),
    ongoing: toStringValue(firstNonEmptyString(entry.ongoingProjects, entry.projectsOngoing), ""),
    avgInstallTime: toStringValue(firstNonEmptyString(entry.avgInstallTime, entry.avgProgress), ""),
    lastAssigned: toStringValue(firstNonEmptyString(entry.lastProjectAssigned, entry.lastAssignedDate), ""),
    delayed: toStringValue(firstNonEmptyString(entry.delayedProjects, entry.delayedProject), ""),
  };
}

function mapProjectHistory(item: unknown): VendorProjectHistory {
  const row = toObject(item);
  return {
    id: toStringValue(firstNonEmptyString(row.projectId, row.id, row.referenceNo)),
    name: toStringValue(firstNonEmptyString(row.projectName, row.name, row.title)),
    status: toStringValue(firstNonEmptyString(row.status, row.statusName, row.stage)),
    client: toStringValue(firstNonEmptyString(row.customerName, row.clientName, row.customer)),
    costRange: formatRange(row.minCost ?? row.minPrice, row.maxCost ?? row.maxPrice),
  };
}

function mapTicketHistory(item: unknown): VendorTicketHistory {
  const row = toObject(item);
  return {
    id: toStringValue(firstNonEmptyString(row.ticketId, row.id, row.referenceNo)),
    project: toStringValue(firstNonEmptyString(row.projectName, row.project)),
    status: toStringValue(firstNonEmptyString(row.status, row.statusName)),
    created: formatDateTime(firstNonEmptyString(row.createdAt, row.createdOn)),
    resolved: formatDateTime(firstNonEmptyString(row.resolvedAt, row.closedAt)),
  };
}

export async function getVendorDetailData(vendorId: string): Promise<VendorDetailData> {
  const [detailResponse, projectsResponse, ticketsResponse, dashboardResponse] = await Promise.allSettled([
    apiRequest<unknown>(`/vendors/${vendorId}/detail`, { method: "GET" }),
    apiRequest<unknown>(`/vendors/${vendorId}/project`, { method: "GET" }),
    apiRequest<unknown>(`/vendors/${vendorId}/ticket`, { method: "GET" }),
    apiRequest<unknown>(`/vendors/dashboard/${vendorId}`, { method: "GET" }),
  ]);

  if (detailResponse.status !== "fulfilled") {
    throw detailResponse.reason;
  }

  const detailRoot = toObject(detailResponse.value);
  const detailList = detailRoot.data ?? detailRoot.list ?? detailRoot;
  const overview = pickSection(detailList, "overview");
  const performance = pickSection(detailList, "performance_overview");
  const reviewSection = pickSection(detailList, "customer_review");
  const distribution = toObject(reviewSection?.distribution);
  const reviews = Array.isArray(reviewSection?.reviews) ? reviewSection?.reviews : [];
  const baseDetail = mapVendorDetailFromSections({ overview, performance, reviews: reviewSection });
  const dashboardPerformance =
    dashboardResponse.status === "fulfilled" ? mapPerformanceFromDashboard(dashboardResponse.value) : {};

  return {
    detail: {
      ...baseDetail,
      performance: {
        totalAssigned: dashboardPerformance.totalAssigned || baseDetail.performance.totalAssigned,
        completed: dashboardPerformance.completed || baseDetail.performance.completed,
        ongoing: dashboardPerformance.ongoing || baseDetail.performance.ongoing,
        avgInstallTime: dashboardPerformance.avgInstallTime || baseDetail.performance.avgInstallTime,
        lastAssigned: dashboardPerformance.lastAssigned || baseDetail.performance.lastAssigned,
        delayed: dashboardPerformance.delayed || baseDetail.performance.delayed,
      },
    },
    projects: projectsResponse.status === "fulfilled" ? pickList(projectsResponse.value).map(mapProjectHistory) : [],
    tickets: ticketsResponse.status === "fulfilled" ? pickList(ticketsResponse.value).map(mapTicketHistory) : [],
    review: {
      average: toStringValue(reviewSection?.average, "0"),
      total: toStringValue(reviewSection?.total, "0"),
      distribution: {
        "5": toStringValue(distribution["5star"], "0"),
        "4": toStringValue(distribution["4star"], "0"),
        "3": toStringValue(distribution["3star"], "0"),
        "2": toStringValue(distribution["2star"], "0"),
        "1": toStringValue(distribution["1star"], "0"),
      },
      reviews: reviews.map((review: unknown) => {
        const row = toObject(review);
        const rating = toNumber(row.rating) ?? 0;
        return {
          date: formatDate(firstNonEmptyString(row.date, row.createdAt)),
          author: toStringValue(firstNonEmptyString(row.userName, row.user, row.name), "Anonymous"),
          text: toStringValue(firstNonEmptyString(row.comment, row.review, row.message), "-"),
          rating,
        };
      }),
    },
  };
}

export async function updateVendorDetail(vendorId: string, input: VendorDetailUpdateInput): Promise<unknown> {
  const formData = new FormData();
  formData.append("userType", "2");

  if (input.vendorCode) {
    formData.append("vendorCode", input.vendorCode);
  }
  if (input.vendorName) {
    formData.append("companyName", input.vendorName);
  }
  if (input.pocName) {
    formData.append("name", input.pocName);
  }
  if (input.pocEmail) {
    formData.append("email", input.pocEmail);
    formData.append("businessEmail", input.pocEmail);
  }
  if (input.pocPhone) {
    formData.append("mobileNumber", input.pocPhone);
    formData.append("businessMobile", input.pocPhone);
  }
  if (input.address) {
    formData.append("companyAddress", input.address);
  }

  return apiRequest(`/users/${vendorId}/profile`, {
    method: "PUT",
    body: formData,
  });
}

export async function updateVendorStatus(vendorId: string, status: "deactivate" | "delete"): Promise<unknown> {
  if (status === "delete") {
    return apiRequest(`/users/${vendorId}`, { method: "DELETE" });
  }
  return apiRequest(`/users/${vendorId}`, {
    method: "PUT",
    body: { status: 0 },
  });
}
