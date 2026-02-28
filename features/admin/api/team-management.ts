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
};

export type TeamUsersQuery = {
  type: number | string;
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
  const response = await apiRequest<unknown>("/users", {
    method: "GET",
    query: { type: query.type },
  });

  return {
    users: pickList(response).map(mapUserRow),
  };
}
