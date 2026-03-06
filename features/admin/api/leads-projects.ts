import { apiRequest, getApiBaseUrl, getApiProxyBaseUrl } from "@/lib/api/client";

export type ProjectListRow = {
  id: string;
  rawId?: string | number | null;
  customer: string;
  vendor: string;
  stage: string;
  projectValue: string;
  amountPaid: string;
  dueAmount: string;
  paymentType: string;
  progress: number;
  assignedTo: string;
  statusRaw?: string;
};

export type LeadListRow = {
  id: string;
  rawId?: string | number | null;
  customer: string;
  vendor: string;
  source: string;
  address: string;
  milestone: "New Lead" | "Site Survey";
  amountPaid: string;
  dueAmount: string;
  assignedTo: string;
  statusRaw?: string;
  createdAt?: string;
};

export type LeadsProjectsData = {
  projects: ProjectListRow[];
  leads: LeadListRow[];
};

export type LeadsProjectsQuery = {
  search?: string;
  page?: number;
  perPage?: number;
  stage?: number;
  vendorId?: number | string;
  isArchived?: number | boolean;
  includeProjects?: boolean;
  includeLeads?: boolean;
};

export type UpdateLeadPayload = Record<string, unknown>;
export type CreateLeadPayload = Record<string, unknown>;
export type AssignVendorPayload = {
  leadId: number | string;
  vendorId: number | string;
};
export type ToggleFavoritePayload = {
  leadId: number | string;
};

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

function toNumber(value: unknown): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

function formatAmount(value: unknown): string {
  const numeric = toNumber(value);
  if (numeric === null) return toStringValue(value);
  return `Rs ${numeric.toLocaleString("en-IN")}`;
}

function normalizeProgress(value: unknown): number {
  const numeric = toNumber(value);
  if (numeric === null) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function toStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const next = String(value).trim();
  return next || null;
}

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    const text = toStringOrNull(value);
    if (text) return text;
  }
  return null;
}

function pickNestedName(value: unknown): string | null {
  const obj = toObject(value);
  return firstNonEmptyString(obj.name, obj.stageName, obj.statusName, obj.title, obj.label);
}

function mapLeadMilestone(value: string): LeadListRow["milestone"] {
  const text = value.toLowerCase();
  if (text.includes("survey")) return "Site Survey";
  return "New Lead";
}

function mapProjectRow(item: unknown): ProjectListRow {
  const row = toObject(item);
  const paymentHistory = Array.isArray(row.paymentHistory) ? row.paymentHistory : [];
  const latestPayment = toObject(paymentHistory[0] ?? row.latestPayment ?? row.payment ?? row.paymentDetail);
  const customer = toObject(row.customer ?? row.customerDetails ?? row.lead);
  const vendor = toObject(row.vendor ?? row.vendorDetails ?? row.assignedVendor);

  const stageName = firstNonEmptyString(
    row.stageName,
    pickNestedName(row.stage),
    row.stage,
    pickNestedName(row.projectStage),
    row.projectStage,
    row.statusName,
    row.status,
  );
  const assignedTo = firstNonEmptyString(row.assignedTo, row.assigneeName, row.vendorAssigned, vendor.name, row.vendorName);
  const projectId =
    firstNonEmptyString(row.projectCode, row.projectId, row.referenceNo, row.ticketId) ?? `#PRJ-${toStringValue(row.id, "0")}`;
  const rawId = row.id ?? row.projectId ?? row.projectCode ?? row.referenceNo;
  const projectValueRaw = firstNonEmptyString(row.projectValue, row.projectCost, row.totalAmount, row.amount);
  const balanceAmountRaw = firstNonEmptyString(row.dueAmount, row.balanceAmount, row.remainingAmount);
  const projectValueNumeric = toNumber(projectValueRaw);
  const balanceAmountNumeric = toNumber(balanceAmountRaw);
  const computedAmountPaid =
    projectValueNumeric !== null && balanceAmountNumeric !== null ? projectValueNumeric - balanceAmountNumeric : null;

  return {
    id: projectId,
    rawId: rawId ?? null,
    customer: toStringValue(
      firstNonEmptyString(row.customerName, customer.name, latestPayment.customerName),
    ),
    vendor: toStringValue(firstNonEmptyString(row.vendorName, vendor.name)),
    stage: toStringValue(stageName),
    projectValue: formatAmount(projectValueRaw),
    amountPaid: formatAmount(
      computedAmountPaid ?? firstNonEmptyString(latestPayment.amount, latestPayment.paidAmount, row.amountPaid, row.paidAmount),
    ),
    dueAmount: formatAmount(balanceAmountRaw),
    paymentType: toStringValue(firstNonEmptyString(latestPayment.paymentType, latestPayment.mode, row.paymentType)),
    progress: normalizeProgress(firstNonEmptyString(row.progress, row.projectProgress, row.statusPercent)),
    assignedTo: toStringValue(assignedTo),
    statusRaw: toStringValue(stageName),
  };
}

function mapLeadRow(item: unknown): LeadListRow {
  const row = toObject(item);
  const vendor = toObject(row.vendor ?? row.vendorDetails ?? row.assignedVendor);
  const stageName = firstNonEmptyString(
    row.stageName,
    pickNestedName(row.stage),
    row.stage,
    row.statusName,
    row.status,
    row.milestone,
  );
  const rawId = row.id ?? row.leadId ?? row.leadCode ?? row.referenceNo ?? row.ticketId;

  return {
    id:
      firstNonEmptyString(row.leadId, row.leadCode, row.referenceNo, row.ticketId) ??
      `#LD-${toStringValue(row.id, "0")}`,
    rawId: rawId ?? null,
    customer: toStringValue(firstNonEmptyString(row.name, row.customerName)),
    vendor: toStringValue(firstNonEmptyString(row.vendorName, vendor.name)),
    source: toStringValue(firstNonEmptyString(row.sourceName, row.sourceType, row.source)),
    address: toStringValue(firstNonEmptyString(row.address, row.location, row.siteAddress)),
    milestone: mapLeadMilestone(toStringValue(stageName)),
    amountPaid: formatAmount(firstNonEmptyString(row.amountPaid, row.paidAmount)),
    dueAmount: formatAmount(firstNonEmptyString(row.dueAmount, row.balanceAmount)),
    assignedTo: toStringValue(firstNonEmptyString(row.assignedTo, row.assigneeName, row.vendorAssigned)),
    statusRaw: toStringValue(stageName),
    createdAt: toStringValue(firstNonEmptyString(row.createdAt, row.createdOn, row.createdDate, row.date)),
  };
}

export async function getLeadsProjectsData(query: LeadsProjectsQuery = {}): Promise<LeadsProjectsData> {
  const {
    search = "",
    page = 1,
    perPage = 100,
    stage = 7,
    vendorId,
    isArchived,
    includeProjects = true,
    includeLeads = true,
  } = query;

  const [projectsResponse, leadsResponse] = await Promise.all([
    includeProjects
      ? apiRequest<unknown>("/projects", {
          method: "GET",
          query: { export: "", per_page: perPage, page, stage, search, vendorId },
        })
      : Promise.resolve({ list: [] }),
    includeLeads
      ? apiRequest<unknown>("/leads", {
          method: "GET",
          query: { vendorId, isArchived, search, per_page: perPage, page },
        })
      : Promise.resolve({ list: [] }),
  ]);

  return {
    projects: pickList(projectsResponse).map(mapProjectRow),
    leads: pickList(leadsResponse).map(mapLeadRow),
  };
}

export async function updateLead(leadId: string | number, payload: UpdateLeadPayload): Promise<unknown> {
  return apiRequest(`/leads/${leadId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function createLead(payload: CreateLeadPayload): Promise<unknown> {
  return apiRequest("/leads", {
    method: "POST",
    body: payload,
  });
}

export async function assignVendor(payload: AssignVendorPayload): Promise<unknown> {
  return apiRequest("/leads/assign-vendor", {
    method: "POST",
    body: payload,
  });
}

export async function toggleFavorite(payload: ToggleFavoritePayload): Promise<unknown> {
  return apiRequest("/leads/toggle-favorites", {
    method: "POST",
    body: payload,
  });
}

export function buildDprDownloadUrl(projectId: string | number): string {
  const base = typeof window === "undefined" ? getApiBaseUrl() : getApiProxyBaseUrl();
  return `${base}/projects/dpr-report/${encodeURIComponent(String(projectId))}`;
}
