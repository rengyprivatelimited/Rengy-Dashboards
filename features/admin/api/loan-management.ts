import { apiRequest } from "@/lib/api/client";

export type LoanStatus =
  | "Documents Pending"
  | "Rejected"
  | "Hold"
  | "Disbursed"
  | "Approved"
  | "Log In Pending";

export type LoanAttachment = {
  id: string;
  name: string;
  reference: string;
  type: string;
  createdAt: string;
  url: string;
};

export type LoanRequestRow = {
  id: number;
  leadId: string;
  loanRefNo: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  vendor: string;
  vendorPhone: string;
  vendorEmail: string;
  projectValue: string;
  bank: string;
  bankPocName: string;
  bankPocPhone: string;
  bankPocEmail: string;
  requestedOn: string;
  assignedTo: string;
  attachments: LoanAttachment[];
  lead: Record<string, unknown>;
  vendorDetails: Record<string, unknown>;
  bankDetails: Record<string, unknown>;
};

export type LoanStatusRow = LoanRequestRow & {
  updatedOn: string;
  status: LoanStatus;
  remarks: string;
  disbursedAmount: string;
  pendingAmount: string;
  region: string;
};

export type LoanListQuery = {
  paymentType?: string;
  search?: string;
  export?: string;
  perPage?: number;
  page?: number;
  loanApprove: 0 | 1;
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

function formatCurrency(value: unknown): string {
  if (value === null || value === undefined || value === "") return "--";
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return `Rs ${numeric.toLocaleString("en-IN")}`;
  }
  return toStringValue(value, "--");
}

function ensureArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const container = toObject(value);
  if (Array.isArray(container.list)) return container.list;
  if (Array.isArray(container.data)) return container.data;
  if (Array.isArray(container.records)) return container.records;
  return [];
}

function mapAttachment(entry: unknown, fallbackIndex: number): LoanAttachment {
  const item = toObject(entry);
  const name = pickString(
    item.name,
    item.fileName,
    item.filename,
    item.title,
    item.documentType,
    item.docType,
    item.type,
    item.label,
  );
  const reference = pickString(
    item.documentNumber,
    item.docNumber,
    item.referenceNo,
    item.refNo,
    item.number,
    item.id,
  );
  const createdAt = formatDate(item.createdAt ?? item.updatedAt ?? item.date ?? item.uploadedAt);
  const url = pickString(item.url, item.fileUrl, item.path, item.location);
  const type = pickString(item.documentType, item.docType, item.type, item.category, name);

  return {
    id: pickString(item.id, item.documentId, `${fallbackIndex}`),
    name,
    reference,
    type,
    createdAt: createdAt === "-" ? "--" : createdAt,
    url,
  };
}

function mapAttachments(row: Record<string, unknown>): LoanAttachment[] {
  const attachmentsRaw =
    row.documents ??
    row.files ??
    row.attachments ??
    row.documentFiles ??
    row.uploads ??
    row.documentList ??
    row.documentData ??
    row.document;

  const attachments = ensureArray(attachmentsRaw).map((entry, index) => mapAttachment(entry, index));
  if (attachments.length) return attachments;

  const types = Array.isArray(row.documentTypes) ? row.documentTypes : [];
  const numbers = Array.isArray(row.documentNumbers) ? row.documentNumbers : [];
  if (types.length || numbers.length) {
    const max = Math.max(types.length, numbers.length);
    return Array.from({ length: max }, (_, index) =>
      mapAttachment(
        {
          documentType: types[index],
          documentNumber: numbers[index],
        },
        index,
      ),
    );
  }

  if (row.documentType || row.documentNumber) {
    return [mapAttachment(row, 0)];
  }

  return [];
}

const STATUS_OPTIONS: LoanStatus[] = [
  "Documents Pending",
  "Rejected",
  "Hold",
  "Disbursed",
  "Approved",
  "Log In Pending",
];

function normalizeStatus(value: unknown): LoanStatus {
  const text = toStringValue(value, "Documents Pending").toLowerCase();
  if (text.includes("reject")) return "Rejected";
  if (text.includes("hold")) return "Hold";
  if (text.includes("disburs")) return "Disbursed";
  if (text.includes("approve")) return "Approved";
  if (text.includes("log")) return "Log In Pending";
  return "Documents Pending";
}

function mapLoanRequestRow(item: unknown): LoanRequestRow {
  const row = toObject(item);
  const lead = toObject(row.lead ?? row.customer ?? row.user ?? row.borrower);
  const customer = toObject(row.customer ?? row.user ?? row.borrower ?? row.lead);
  const vendor = toObject(row.vendor ?? row.partner ?? row.seller);
  const bank = toObject(row.bank ?? row.fintech ?? row.finTechPartner ?? row.fintechPartner ?? row.provider);
  const attachments = mapAttachments(row);

  return {
    id: toNumber(row.id ?? row.loanId ?? row.requestId) ?? 0,
    leadId: toStringValue(
      row.leadId ??
        row.leadCode ??
        row.projectCode ??
        row.projectId ??
        row.referenceNo ??
        row.ticketId ??
        row.id,
    ),
    loanRefNo: toStringValue(
      row.loanRefNo ??
        row.loanReferenceNo ??
        row.loanRef ??
        row.referenceNo ??
        row.loanId ??
        row.id,
    ),
    customer: toStringValue(lead.name ?? customer.name ?? row.customerName ?? row.name),
    customerPhone: pickString(
      row.customerPhone,
      row.customerMobile,
      row.phone,
      row.mobile,
      lead.phone,
      lead.mobile,
      lead.mobileNo,
      lead.phoneNumber,
      lead.contactNumber,
      lead.primaryContact,
      lead.whatsapp,
      lead.whatsApp,
    ),
    customerEmail: pickString(
      row.customerEmail,
      row.email,
      lead.email,
      lead.mail,
      lead.primaryEmail,
      lead.contactEmail,
    ),
    vendor: toStringValue(row.vendorName ?? vendor.name ?? row.vendor),
    vendorPhone: pickString(
      row.vendorPhone,
      vendor.phone,
      vendor.mobile,
      vendor.mobileNo,
      vendor.phoneNumber,
      vendor.contactNumber,
      vendor.primaryContact,
    ),
    vendorEmail: pickString(
      row.vendorEmail,
      vendor.email,
      vendor.mail,
      vendor.primaryEmail,
      vendor.contactEmail,
    ),
    projectValue: formatCurrency(
      row.projectValue ?? row.amount ?? row.totalAmount ?? row.loanAmount ?? row.requestedAmount,
    ),
    bank: toStringValue(row.bankName ?? bank.name ?? row.fintechName ?? row.partnerName),
    bankPocName: pickString(
      row.bankPocName,
      row.pocName,
      bank.primaryPerson,
      bank.poc,
      bank.pocName,
      bank.contactPerson,
      bank.contactName,
      bank.managerName,
    ),
    bankPocPhone: pickString(
      row.bankPocPhone,
      row.pocPhone,
      bank.primaryContact,
      bank.contactPhone,
      bank.phone,
      bank.mobile,
    ),
    bankPocEmail: pickString(
      row.bankPocEmail,
      row.pocEmail,
      bank.primaryEmail,
      bank.email,
      bank.contactEmail,
    ),
    requestedOn: formatDate(row.requestedOn ?? row.createdAt ?? row.requestDate ?? row.updatedAt),
    assignedTo: pickString(
      row.assignedTo,
      row.assigned,
      row.assignee,
      row.assigneeName,
      row.owner,
      row.createdByName,
    ),
    attachments,
    lead,
    vendorDetails: vendor,
    bankDetails: bank,
  };
}

function mapLoanStatusRow(item: unknown): LoanStatusRow {
  const base = mapLoanRequestRow(item);
  const row = toObject(item);

  return {
    ...base,
    updatedOn: formatDate(row.updatedAt ?? row.statusUpdatedAt ?? row.approvedAt ?? row.createdAt),
    status: normalizeStatus(row.status ?? row.statusName ?? row.loanStatus ?? row.stageName),
    remarks: toStringValue(row.remarks ?? row.notes ?? row.comment, "--"),
    disbursedAmount: formatCurrency(row.disbursedAmount ?? row.disbursed ?? row.paidAmount),
    pendingAmount: formatCurrency(row.pendingAmount ?? row.balanceAmount ?? row.dueAmount),
    region: toStringValue(row.region ?? row.state ?? row.location ?? row.city, "--"),
  };
}

export async function getLoanRequests(query: LoanListQuery): Promise<LoanRequestRow[]> {
  const { paymentType = "", search = "", export: exportValue = "", perPage = 10, page = 1 } = query;
  const response = await apiRequest<unknown>("/loans", {
    method: "GET",
    query: {
      paymentType,
      search,
      export: exportValue,
      per_page: perPage,
      page,
      loanApprove: query.loanApprove,
    },
  });

  return pickList(response).map(mapLoanRequestRow);
}

export async function getLoanStatuses(query: LoanListQuery): Promise<LoanStatusRow[]> {
  const { paymentType = "", search = "", export: exportValue = "", perPage = 10, page = 1 } = query;
  const response = await apiRequest<unknown>("/loans", {
    method: "GET",
    query: {
      paymentType,
      search,
      export: exportValue,
      per_page: perPage,
      page,
      loanApprove: query.loanApprove,
    },
  });

  return pickList(response).map(mapLoanStatusRow);
}

export const LOAN_STATUS_OPTIONS = STATUS_OPTIONS;
