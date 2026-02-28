import { apiRequest, getApiBaseUrl, getApiProxyBaseUrl } from "@/lib/api/client";

export type ApprovalPriority = "High" | "Medium" | "Low";

export type ApprovalListRow = {
  ticketId: string;
  source: string;
  name: string;
  email: string;
  category: string;
  time: string;
  description: string;
  priority: ApprovalPriority;
  attachments: string;
  documents: ApprovalDocument[];
  projectId: string;
  fintechName: string | null;
  fintechType: string | null;
};

export type InstallationListRow = {
  ticketId: string;
  projectId: string;
  customer: string;
  raisedBy: string;
  dateCreated: string;
  installationDateTime: string;
  poc: string;
  documents: InstallationDocument[];
  attachments: string;
  status: "Not Approved" | "Approved" | "Pending Approval";
};

export type InstallationDocument = {
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
};

export type ApprovalDocument = {
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
};

export type AmcListRow = {
  projectId: string;
  customer: string;
  address: string;
  customerContact: string;
  customerEmail: string;
  serviceRequested: string;
};

export type ApprovalManagementData = {
  onboardingRows: ApprovalListRow[];
  installationRows: InstallationListRow[];
  amcRows: AmcListRow[];
};

export type ApprovalManagementQuery = {
  search?: string;
  page?: number;
  perPage?: number;
  stage?: number;
  dateFrom?: string;
  dateTo?: string;
  vendor?: string;
  category?: string;
  source?: string;
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

function formatDate(dateValue: unknown): string {
  const raw = typeof dateValue === "string" ? dateValue : "";
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatDateTime(dateValue: unknown): string {
  const raw = typeof dateValue === "string" ? dateValue.trim() : "";
  if (!raw) return "-";
  if (raw.includes(",")) return raw;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year}, ${hour}:${minute}:${second}`;
}

function attachmentCountText(imageValue: unknown): string {
  if (Array.isArray(imageValue)) {
    const count = imageValue.length;
    return count === 0 ? "--" : `${count} Files attached`;
  }
  if (typeof imageValue === "string" && imageValue.trim()) {
    return "1 File attached";
  }
  return "--";
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

function normalizePriority(value: unknown): ApprovalPriority {
  const text = toStringValue(value, "Medium").toLowerCase();
  if (text.includes("high")) return "High";
  if (text.includes("low")) return "Low";
  return "Medium";
}

function mapOnboardingRow(item: unknown): ApprovalListRow {
  const row = toObject(item);
  const documents = Array.isArray(row.documents) ? row.documents : [];
  const category = toStringValue(row.category, "-");
  const type = toStringValue(row.type, "-");
  const fintech = toObject(row.fintech ?? row.bank ?? row.partner);
  const mappedDocs: ApprovalDocument[] = documents.map((doc, index) => {
    const entry = toObject(doc);
    const url = toStringValue(entry.url, "");
    const inferredName =
      firstNonEmptyString(entry.name, entry.type, url, `Document ${index + 1}`) ?? `Document ${index + 1}`;
    return {
      name: inferredName,
      url,
      type: toStringValue(entry.type, "-"),
      size: toStringValue(entry.size, "-"),
      uploadedAt: formatDateTime(
        firstNonEmptyString(entry.uploadedAt, entry.createdAt, entry.date, row.requestedAt),
      ),
    };
  });
  const projectId =
    firstNonEmptyString(row.projectId, row.leadId, row.referenceNo, row.ticketId, row.requestId) ??
    `#ONB-${toStringValue(row.id, "0")}`;

  return {
    ticketId: `#ONB-${toStringValue(row.id, "0")}`,
    source: category,
    name: toStringValue(row.name),
    email: toStringValue(row.email),
    category,
    time: formatDate(row.requestedAt),
    description: toStringValue(row.description, `${type} approval request`),
    priority: normalizePriority(firstNonEmptyString(row.priority, row.priorityName, row.priorityType)),
    attachments: documents.length > 0 ? `${documents.length} Files attached` : "--",
    documents: mappedDocs,
    projectId,
    fintechName: firstNonEmptyString(row.fintechName, fintech.name, row.bankName),
    fintechType: firstNonEmptyString(row.fintechType, fintech.type, row.bankType),
  };
}

function mapInstallationStatus(status: unknown): InstallationListRow["status"] {
  if (typeof status === "string") {
    const text = status.trim().toLowerCase();
    if (text.includes("not approved") || text.includes("rejected") || text.includes("declined")) {
      return "Not Approved";
    }
    if (
      text.includes("approved") ||
      text.includes("success") ||
      text.includes("completed") ||
      text.includes("paid")
    ) {
      return "Approved";
    }
    return "Pending Approval";
  }

  if (typeof status === "boolean") {
    return status ? "Approved" : "Pending Approval";
  }

  const numeric = Number(status);
  if (numeric === 1) return "Approved";
  if (numeric === 2) return "Not Approved";
  return "Pending Approval";
}

function mapInstallationRow(item: unknown): InstallationListRow {
  const row = toObject(item);
  const paymentHistory = Array.isArray(row.paymentHistory) ? row.paymentHistory : [];
  const latestPayment = toObject(paymentHistory[0]);
  const fallbackId = toStringValue(row.id, "0");
  const vendorId = toStringOrNull(row.vendorId);
  const paymentDocs = Array.isArray(latestPayment.documents) ? latestPayment.documents : [];
  const mappedDocs: InstallationDocument[] = paymentDocs.map((doc, index) => {
    const entry = toObject(doc);
    const url = toStringValue(entry.url, "");
    const inferredName = firstNonEmptyString(entry.type, url, `Document ${index + 1}`) ?? `Document ${index + 1}`;
    return {
      name: inferredName,
      url,
      type: toStringValue(entry.type, "-"),
      size: toStringValue(entry.size, "-"),
      uploadedAt: formatDateTime(firstNonEmptyString(latestPayment.paymentDate, latestPayment.createdAt, row.createdAt)),
    };
  });
  const raisedByValue = toStringValue(
    firstNonEmptyString(row.raisedBy, latestPayment.source, vendorId ? `Vendor #${vendorId}` : null),
  );
  const installationDateTimeValue = formatDateTime(
    firstNonEmptyString(latestPayment.paymentDate, latestPayment.createdAt, row.startDate, row.createdAt),
  );

  return {
    ticketId:
      firstNonEmptyString(row.projectCode, row.ticketId, row.referenceNo) ??
      `#INS-${fallbackId}`,
    projectId:
      firstNonEmptyString(row.projectCode, row.ticketId, row.referenceNo) ??
      `#PRJ-${fallbackId}`,
    customer: toStringValue(
      firstNonEmptyString(latestPayment.customerName, row.customerName),
    ),
    raisedBy: raisedByValue,
    dateCreated: formatDate(
      firstNonEmptyString(latestPayment.createdAt, row.startDate, row.createdAt),
    ),
    installationDateTime: installationDateTimeValue,
    poc: raisedByValue,
    documents: mappedDocs,
    attachments: attachmentCountText(paymentDocs),
    status: mapInstallationStatus(
      firstNonEmptyString(latestPayment.statusName, latestPayment.status, row.status),
    ),
  };
}

function mapAmcRow(item: unknown): AmcListRow {
  const row = toObject(item);
  const user = toObject(row.user);
  const service = toObject(row.service);

  return {
    projectId: toStringValue(row.amcRefNo, `#AMC-${toStringValue(row.id, "0")}`),
    customer: toStringValue(user.name),
    address: toStringValue(toObject(user.customer).address),
    customerContact: toStringValue(user.mobileNumber),
    customerEmail: toStringValue(user.email),
    serviceRequested: toStringValue(service.name),
  };
}

export async function getApprovalManagementData(query: ApprovalManagementQuery = {}): Promise<ApprovalManagementData> {
  const {
    search = "",
    page = 1,
    perPage = 100,
    stage = 7,
    dateFrom = "",
    dateTo = "",
    vendor = "",
    category = "",
    source = "",
  } = query;

  const [onboardingResponse, installationResponse, amcResponse] = await Promise.all([
    apiRequest<unknown>("/common/admin/approval", {
      method: "GET",
      query: {
        search,
        export: "",
        page,
        per_page: perPage,
        startDate: dateFrom,
        endDate: dateTo,
        vendor,
        category,
        source,
      },
    }),
    apiRequest<unknown>("/projects/combined/payments", {
      method: "GET",
      query: {
        export: "",
        per_page: perPage,
        page,
        stage,
        search,
        startDate: dateFrom,
        endDate: dateTo,
        vendor,
        category,
        source,
      },
    }),
    apiRequest<unknown>("/amc-requests", {
      method: "GET",
      query: {
        search,
        page,
        per_page: perPage,
        startDate: dateFrom,
        endDate: dateTo,
        vendor,
        category,
        source,
      },
    }),
  ]);

  return {
    onboardingRows: pickList(onboardingResponse).map(mapOnboardingRow),
    installationRows: pickList(installationResponse).map(mapInstallationRow),
    amcRows: pickList(amcResponse).map(mapAmcRow),
  };
}

export type ApprovalActionPayload = {
  action: "approve" | "reject" | "resubmit" | "save";
  ticketId?: string;
  projectId?: string;
  notes?: string;
  type?: "installation" | "onboarding" | "amc";
};

export async function submitApprovalAction(payload: ApprovalActionPayload): Promise<unknown> {
  return apiRequest("/common/admin/approval", {
    method: "POST",
    body: payload,
  });
}

export function buildLoanFilesDownloadUrl(ids: string): string {
  const base = typeof window === "undefined" ? getApiBaseUrl() : getApiProxyBaseUrl();
  const safeIds = encodeURIComponent(ids);
  return `${base}/common/files/download?module=loans&ids=${safeIds}&fields=documents`;
}
