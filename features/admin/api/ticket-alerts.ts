import { apiRequest } from "@/lib/api/client";

export type TicketPriority = "High" | "Medium" | "Low";
export type TicketStatus = "Resolved" | "Open";

export type TicketRow = {
  id: number;
  ticketId: string;
  raisedBy: string;
  team: string;
  description: string;
  date: string;
  time: string;
  priority: TicketPriority;
  assignedTo: string;
  status: TicketStatus;
};

export type AlertRow = {
  id: number;
  title: string;
  description: string;
  severity: "Success" | "Info" | "Error";
  unread: boolean;
  createdAt: string;
};

export type TicketQuery = {
  search?: string;
  page?: number;
  perPage?: number;
};

export type TicketPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type TicketListResult = {
  rows: TicketRow[];
  pagination: TicketPagination;
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

function pickPagination(payload: unknown, fallback: TicketPagination): TicketPagination {
  const root = toObject(payload);
  const data = root.data;

  let pagination: Record<string, unknown> = {};
  if (Array.isArray(data)) {
    const paginationEntry = data.find((entry) => toObject(entry).id === "pagination");
    const list = toObject(paginationEntry).list;
    if (Array.isArray(list) && list.length > 0) {
      pagination = toObject(list[0]);
    } else {
      pagination = toObject(paginationEntry);
    }
  } else {
    pagination = toObject(root.pagination ?? toObject(data).pagination ?? root.meta ?? toObject(data).meta);
  }

  const page = toNumber(pagination.page ?? pagination.currentPage ?? pagination.current_page) ?? fallback.page;
  const perPage = toNumber(pagination.perPage ?? pagination.per_page ?? pagination.pageSize) ?? fallback.perPage;
  const total = toNumber(pagination.total ?? pagination.totalRecords ?? pagination.total_items) ?? fallback.total;
  const totalPages =
    toNumber(pagination.totalPages ?? pagination.total_pages) ??
    (perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : fallback.totalPages);

  return { page, perPage, total, totalPages };
}

function formatDate(value: unknown): { date: string; time: string } {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return { date: "-", time: "-" };
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return { date: raw, time: "-" };
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return { date: `${day}-${month}-${year}`, time: `${hour}:${minute}` };
}

function normalizePriority(value: unknown): TicketPriority {
  const text = toStringValue(value, "Medium").toLowerCase();
  if (text.includes("high")) return "High";
  if (text.includes("low")) return "Low";
  return "Medium";
}

function normalizeStatus(value: unknown): TicketStatus {
  const text = toStringValue(value, "Open").toLowerCase();
  if (text.includes("resolve") || text === "1" || text === "resolved") return "Resolved";
  return "Open";
}

function mapTicket(rowValue: unknown): TicketRow {
  const row = toObject(rowValue);
  const createdAt = row.createdAt ?? row.created_on ?? row.date ?? row.createdDate;
  const { date, time } = formatDate(createdAt);
  const createdBy = toObject(row.createdBy ?? row.user ?? row.raisedBy);
  const team = toStringValue(row.team ?? row.moduleType ?? row.department);

  return {
    id: toNumber(row.id ?? row.ticketId) ?? 0,
    ticketId: toStringValue(row.ticketId ?? row.referenceNo ?? row.id, "-"),
    raisedBy: toStringValue(createdBy.name ?? row.raisedByName ?? row.raisedBy ?? row.userName),
    team,
    description: toStringValue(row.description ?? row.details ?? row.message),
    date,
    time,
    priority: normalizePriority(row.priority ?? row.priorityName ?? row.priorityId),
    assignedTo: toStringValue(row.assignedToName ?? row.assignedTo ?? row.assignee),
    status: normalizeStatus(row.status ?? row.statusName),
  };
}

function mapAlert(rowValue: unknown): AlertRow {
  const row = toObject(rowValue);
  const severityText = toStringValue(row.priority ?? row.severity ?? row.type, "Info").toLowerCase();
  const severity: AlertRow["severity"] =
    severityText.includes("error") || severityText.includes("high") ? "Error" :
    severityText.includes("success") ? "Success" : "Info";
  const createdAt = toStringValue(row.createdAt ?? row.date ?? row.created_on, "-");

  return {
    id: toNumber(row.id) ?? 0,
    title: toStringValue(row.title ?? row.subject ?? row.name),
    description: toStringValue(row.description ?? row.message ?? row.body),
    severity,
    unread: !(row.isRead ?? row.read ?? row.is_read ?? false),
    createdAt,
  };
}

export async function getTickets(query: TicketQuery): Promise<TicketListResult> {
  const { search = "", page = 1, perPage = 10 } = query;
  const response = await apiRequest<unknown>("/tickets", {
    method: "GET",
    query: {
      search,
      page,
      per_page: perPage,
    },
  });

  const rows = pickList(response).map(mapTicket);
  const pagination = pickPagination(response, {
    page,
    perPage,
    total: rows.length,
    totalPages: 1,
  });
  return { rows, pagination };
}

export async function getAlerts(search = ""): Promise<AlertRow[]> {
  const response = await apiRequest<unknown>("/alerts", {
    method: "GET",
    query: { search },
  });
  return pickList(response).map(mapAlert);
}

export async function updateTicket(
  id: number,
  payload: { status?: TicketStatus; assignedTo?: string; description?: string },
): Promise<unknown> {
  const formData = new FormData();
  if (payload.description) formData.append("description", payload.description);
  if (payload.assignedTo) formData.append("assignedTo", payload.assignedTo);
  if (payload.status) formData.append("status", payload.status === "Resolved" ? "1" : "0");

  return apiRequest(`/tickets/${id}`, {
    method: "PUT",
    body: formData,
  });
}
