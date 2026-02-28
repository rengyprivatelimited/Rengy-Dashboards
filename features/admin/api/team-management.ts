import { apiRequest } from "@/lib/api/client";

export type TeamUserRow = {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateCreated: string;
};

export type TeamUsersResponse = {
  users: TeamUserRow[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

export type TeamUsersQuery = {
  type: number | string;
  search?: string;
  page?: number;
  perPage?: number;
};

export type TeamUserInput = {
  name: string;
  email: string;
  mobileNumber: string;
  roleId?: string | number;
  userType?: string | number;
  joiningDate?: string;
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

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickPagination(payload: unknown, fallback: TeamUsersResponse["pagination"]): TeamUsersResponse["pagination"] {
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

function mapUserRow(item: unknown): TeamUserRow {
  const row = toObject(item);
  const roleObject = toObject(row.role ?? row.roleName ?? row.userRole);

  return {
    employeeId: toStringValue(row.employeeId ?? row.empId ?? row.userId ?? row.id),
    name: toStringValue(row.name ?? row.userName),
    email: toStringValue(row.email),
    phone: toStringValue(row.mobileNumber ?? row.phone),
    role: toStringValue(
      row.roleName ??
        row.role ??
        roleObject.name ??
        roleObject.title ??
        roleObject.displayName,
    ),
    dateCreated: formatDate(row.createdAt ?? row.joiningDate ?? row.dateCreated),
  };
}

export async function getTeamUsers(query: TeamUsersQuery): Promise<TeamUsersResponse> {
  const { type, search = "", page = 1, perPage = 10 } = query;
  const response = await apiRequest<unknown>("/users", {
    method: "GET",
    query: { type, search, page, per_page: perPage },
  });

  const users = pickList(response).map(mapUserRow);
  return {
    users,
    pagination: pickPagination(response, {
      page,
      perPage,
      total: users.length,
      totalPages: 1,
    }),
  };
}

export async function createTeamUser(payload: TeamUserInput): Promise<unknown> {
  return apiRequest("/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateTeamUser(id: string | number, payload: TeamUserInput): Promise<unknown> {
  return apiRequest(`/users/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteTeamUser(id: string | number): Promise<unknown> {
  return apiRequest(`/users/${id}`, { method: "DELETE" });
}
