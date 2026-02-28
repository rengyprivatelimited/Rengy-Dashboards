import { apiRequest } from "@/lib/api/client";

export type VendorCardRow = {
  id: number;
  userId: string;
  name: string;
  rating: string;
  compliance: string;
  projects: string;
  costRange: string;
  teamSize: string;
  location: string;
};

export type VendorRequestDocument = {
  name: string;
  url: string;
  uploadedAt: string;
};

export type VendorRequestRow = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  requestedOn: string;
  vendorId: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  documents: VendorRequestDocument[];
};

export type VendorManagementData = {
  vendors: VendorCardRow[];
  requests: VendorRequestRow[];
};

export type VendorManagementQuery = {
  search?: string;
  page?: number;
  perPage?: number;
  adminApproval?: number | boolean;
  requestApproval?: number | boolean;
  requestType?: number | string;
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

function formatPercent(value: unknown): string {
  const numeric = toNumber(value);
  if (numeric === null) return toStringValue(value);
  const clamped = Math.max(0, Math.min(100, numeric));
  return `${Math.round(clamped)}%`;
}

function formatRange(minValue: unknown, maxValue: unknown): string {
  const min = toNumber(minValue);
  const max = toNumber(maxValue);
  if (min === null && max === null) return "-";
  if (min !== null && max !== null) return `Rs ${min.toLocaleString("en-IN")} - ${max.toLocaleString("en-IN")}`;
  if (min !== null) return `Rs ${min.toLocaleString("en-IN")}+`;
  if (max !== null) return `Rs ${max.toLocaleString("en-IN")}`;
  return "-";
}

function formatDate(value: unknown): string {
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

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    const text = typeof value === "string" ? value.trim() : value ? String(value).trim() : "";
    if (text) return text;
  }
  return "-";
}

function mapVendorCard(item: unknown): VendorCardRow {
  const row = toObject(item);
  const stats = toObject(row.stats ?? row.metrics ?? row.summary);
  const location = toObject(row.location ?? row.address ?? row.city ?? row.state);

  return {
    id: Number(toNumber(row.id) ?? 0),
    userId: toStringValue(firstNonEmptyString(row.userId, row.vendorUserId, row.user_id, row.ownerId, row.id)),
    name: toStringValue(firstNonEmptyString(row.name, row.vendorName, row.companyName)),
    rating: toStringValue(firstNonEmptyString(row.rating, row.avgRating, stats.rating), "0"),
    compliance: formatPercent(firstNonEmptyString(row.compliance, row.complianceRate, stats.compliance)),
    projects: toStringValue(firstNonEmptyString(row.projects, row.projectCount, stats.projectCount, stats.projects), "0"),
    costRange: formatRange(row.minCost ?? row.minPrice, row.maxCost ?? row.maxPrice),
    teamSize: toStringValue(firstNonEmptyString(row.teamSize, row.teamCount, stats.teamSize), "0"),
    location: toStringValue(firstNonEmptyString(location.city, row.city, location.state, row.state, row.location)),
  };
}

function mapRequestDocuments(value: unknown): VendorRequestDocument[] {
  if (!Array.isArray(value)) return [];
  return value.map((doc, index) => {
    const entry = toObject(doc);
    const url = toStringValue(entry.url, "");
    const name = firstNonEmptyString(entry.name, entry.type, url, `Document ${index + 1}`);
    return {
      name,
      url,
      uploadedAt: formatDate(firstNonEmptyString(entry.uploadedAt, entry.createdAt, entry.date)),
    };
  });
}

function mapVendorRequest(item: unknown): VendorRequestRow {
  const row = toObject(item);
  const address = toObject(row.address ?? row.location ?? row.customer ?? row.companyAddress);
  const documents = mapRequestDocuments(row.documents ?? row.documentDetails ?? row.files);

  return {
    id: Number(toNumber(row.id) ?? 0),
    name: toStringValue(firstNonEmptyString(row.name, row.vendorName, row.companyName)),
    email: toStringValue(firstNonEmptyString(row.email, row.businessEmail)),
    mobile: toStringValue(firstNonEmptyString(row.mobileNumber, row.mobile, row.businessMobile)),
    address: toStringValue(
      firstNonEmptyString(address.address, row.address, row.location, row.city, row.state),
    ),
    requestedOn: formatDate(firstNonEmptyString(row.createdAt, row.createdOn, row.requestedAt, row.date)),
    vendorId: toStringValue(firstNonEmptyString(row.vendorId, row.userId, row.referenceNo, row.vendorCode)),
    pocName: toStringValue(firstNonEmptyString(row.pocName, row.contactName, row.ownerName, row.name)),
    pocEmail: toStringValue(firstNonEmptyString(row.pocEmail, row.contactEmail, row.email)),
    pocPhone: toStringValue(firstNonEmptyString(row.pocPhone, row.contactPhone, row.mobileNumber, row.mobile)),
    documents,
  };
}

export async function getVendorManagementData(query: VendorManagementQuery = {}): Promise<VendorManagementData> {
  const {
    search = "",
    page = 1,
    perPage = 10,
    adminApproval = 1,
    requestApproval = 0,
    requestType = 2,
  } = query;

  const [vendorsResponse, requestsResponse] = await Promise.all([
    apiRequest<unknown>("/vendors/combined/list", {
      method: "GET",
      query: { search, per_page: perPage, page, adminApproval },
    }),
    apiRequest<unknown>("/users", {
      method: "GET",
      query: { approval: requestApproval, type: requestType },
    }),
  ]);

  return {
    vendors: pickList(vendorsResponse).map(mapVendorCard),
    requests: pickList(requestsResponse).map(mapVendorRequest),
  };
}
