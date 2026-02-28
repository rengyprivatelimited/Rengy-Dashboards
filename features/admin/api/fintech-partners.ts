import { apiRequest } from "@/lib/api/client";

export type FinTechPartner = {
  id: number;
  name: string;
  sub: string;
  location: string;
  type: string;
  poc: string;
  phone: string;
  email: string;
  loans: string;
  disbursed: string;
  resub: string;
  logins: string;
  avg: string;
  approved: string;
  approvalRate: string;
  rejectedRate: string;
  rejectedLoans: string;
  logoUrl: string;
};

export type FinTechPartnerDetail = FinTechPartner & {
  bankId: string;
  address: string;
  gstNumber: string;
  onboardedOn: string;
  website: string;
  foundedIn: string;
  remarks: string;
};

export type FinTechPartnerQuery = {
  search?: string;
  page?: number;
  perPage?: number;
};

function toObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toStringValue(value: unknown, fallback = "-"): string {
  if (value === null || value === undefined) return fallback;
  const next = String(value).trim();
  return next || fallback;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const next = String(value).trim();
    if (next) return next;
  }
  return "-";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
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

function numberLabel(value: unknown): string {
  const numeric = toNumber(value);
  if (numeric !== null) return String(numeric);
  return toStringValue(value, "--");
}

function percentLabel(value: unknown): string {
  const text = toStringValue(value, "");
  if (!text) return "--";
  return text.includes("%") ? text : `${text}%`;
}

function formatDate(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function mapPartner(item: unknown): FinTechPartner {
  const row = toObject(item);
  const fintechType = toObject(row.fintechType);
  const baseUrl = toStringValue(row.baseUrl ?? row.baseURL ?? row.base_path, "");
  const logoList = Array.isArray(row.logo) ? row.logo : [];
  const imageList = Array.isArray(row.images) ? row.images : [];
  const logoFile = logoList[0] ?? imageList[0];
  const logoUrl = logoFile ? `${baseUrl}${logoFile}` : "";

  return {
    id: toNumber(row.id) ?? 0,
    name: toStringValue(row.name ?? row.providerName),
    sub: toStringValue(fintechType.name ?? row.providerTypeName ?? row.typeName ?? row.sub),
    location: toStringValue(row.state ?? row.city ?? row.location ?? row.address),
    type: toStringValue(fintechType.name ?? row.providerTypeName ?? row.typeName ?? row.type),
    poc: toStringValue(row.primaryPerson ?? row.poc ?? row.primaryContactName),
    phone: toStringValue(row.primaryContact ?? row.mobileNumber ?? row.phone ?? row.mobile),
    email: toStringValue(row.primaryEmail ?? row.email),
    loans: numberLabel(row.totalLoans ?? row.loans),
    disbursed: numberLabel(row.totalLoansDisbursed ?? row.disbursed),
    resub: numberLabel(row.totalLoansResubmitted ?? row.resub),
    logins: numberLabel(row.totalLogins ?? row.logins),
    avg: toStringValue(row.averageDisbursedTime ?? row.avg),
    approved: numberLabel(row.totalLoansApproved ?? row.approved),
    approvalRate: percentLabel(row.approvalRate),
    rejectedRate: percentLabel(row.rejectionRate),
    rejectedLoans: numberLabel(row.totalLoansRejected ?? row.rejectedLoans),
    logoUrl,
  };
}

function mapPartnerDetail(item: unknown): FinTechPartnerDetail {
  const row = toObject(item);
  const base = mapPartner(item);

  return {
    ...base,
    bankId: toStringValue(row.bankId ?? row.bankCode ?? row.code ?? row.id),
    address: toStringValue(row.address ?? row.location ?? row.state ?? row.city),
    gstNumber: toStringValue(row.gstNumber ?? row.gst ?? row.gstin),
    onboardedOn: formatDate(row.createdAt ?? row.onboardedOn ?? row.approvedAt),
    website: toStringValue(row.url ?? row.website),
    foundedIn: toStringValue(row.foundedIn ?? row.foundedAt),
    remarks: toStringValue(row.remarks ?? row.note ?? row.comment),
  };
}

export async function getFinTechPartners(query: FinTechPartnerQuery): Promise<FinTechPartner[]> {
  const { search = "", page = 1, perPage = 10 } = query;
  const response = await apiRequest<unknown>("/loan-providers", {
    method: "GET",
    query: {
      search,
      page,
      per_page: perPage,
    },
  });

  return pickList(response).map(mapPartner);
}

export async function getFinTechPartner(id: number): Promise<FinTechPartnerDetail> {
  const response = await apiRequest<unknown>(`/loan-providers/${id}`, {
    method: "GET",
  });

  const list = pickList(response);
  const item = list[0] ?? response;
  return mapPartnerDetail(item);
}
