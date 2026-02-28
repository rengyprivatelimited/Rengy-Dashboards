import { apiRequest } from "@/lib/api/client";

export type TeamTab =
  | "Sales Team"
  | "Finance"
  | "Design"
  | "Loan Team"
  | "Operation Team"
  | "Supply Chain Team"
  | "AMC Team"
  | "Net Metering Team";

export type CrudKey = "create" | "read" | "update" | "delete";

export type PermissionModule = "Dashboard" | "Teams & Leads" | "Tickets and Alerts";

export type ModulePermission = {
  module: PermissionModule;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type PermissionRow = {
  id?: number;
  role: string;
  modulePermissions: ModulePermission[];
  users: string;
  name: string;
  dateCreated: string;
  team: TeamTab;
};

export type MenuMap = Record<PermissionModule, number | null>;

export type TeamPermissionsData = {
  rows: PermissionRow[];
  menuMap: MenuMap;
};

type RolePayload = Record<string, unknown>;

type MenuPayload = Record<string, unknown>;

const TEAM_ID_MAP: Record<TeamTab, number> = {
  "Sales Team": 4,
  "Loan Team": 5,
  Finance: 6,
  Design: 7,
  "Operation Team": 8,
  "Supply Chain Team": 9,
  "Net Metering Team": 10,
  "AMC Team": 11,
};

const TEAM_NAME_BY_ID: Record<number, TeamTab> = Object.entries(TEAM_ID_MAP).reduce(
  (acc, [team, id]) => ({ ...acc, [id]: team as TeamTab }),
  {} as Record<number, TeamTab>,
);

const MODULE_SYNONYMS: Record<PermissionModule, string[]> = {
  Dashboard: ["dashboard", "home"],
  "Teams & Leads": [
    "teams & leads",
    "team",
    "teams",
    "lead",
    "leads",
    "team management",
    "leads & projects",
    "leads and projects",
  ],
  "Tickets and Alerts": [
    "tickets and alerts",
    "ticket",
    "tickets",
    "alerts",
    "ticket & alerts",
  ],
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
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

function extractMenuIds(value: unknown): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "number") return entry;
        const obj = toObject(entry);
        return toNumber(obj.id ?? obj.menuId ?? obj.menu_id);
      })
      .filter((entry): entry is number => typeof entry === "number");
  }
  const obj = toObject(value);
  const nested = obj.menuIds ?? obj.menu_ids ?? obj.menus;
  if (nested !== undefined) return extractMenuIds(nested);
  return [];
}

function extractMenuNames(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => {
        const obj = toObject(entry);
        const menu = toObject(obj.menu);
        const name = toStringValue(menu.name ?? obj.name ?? obj.label, "");
        if (name) return [name];
        const nested = obj.menuIds ?? obj.menu_ids ?? obj.menus ?? obj.permissions;
        if (nested !== undefined) return extractMenuNames(nested);
        return [];
      })
      .filter(Boolean);
  }
  const obj = toObject(value);
  const menu = toObject(obj.menu);
  const name = toStringValue(menu.name ?? obj.name ?? obj.label, "");
  if (name) return [name];
  const nested = obj.menuIds ?? obj.menu_ids ?? obj.menus ?? obj.permissions;
  if (nested !== undefined) return extractMenuNames(nested);
  return [];
}

function inferTeamFromRole(role: RolePayload): TeamTab | null {
  const userType = toNumber(role.userType ?? role.userTypeId ?? role.type ?? role.teamId);
  if (userType && userType in TEAM_NAME_BY_ID) return TEAM_NAME_BY_ID[userType];

  const roleName = normalizeText(role.name ?? role.roleName ?? role.title ?? role.slug);
  if (!roleName) return null;
  if (roleName.includes("sales")) return "Sales Team";
  if (roleName.includes("finance")) return "Finance";
  if (roleName.includes("design")) return "Design";
  if (roleName.includes("loan")) return "Loan Team";
  if (roleName.includes("net")) return "Net Metering Team";
  if (roleName.includes("amc")) return "AMC Team";
  if (roleName.includes("supply") || roleName.includes("procurement")) return "Supply Chain Team";
  if (roleName.includes("operation") || roleName.includes("ops")) return "Operation Team";
  return null;
}

function buildMenuMap(menus: MenuPayload[]): MenuMap {
  const map: MenuMap = {
    Dashboard: null,
    "Teams & Leads": null,
    "Tickets and Alerts": null,
  };

  const normalizedMenus = menus.map((menu) => {
    const name = toStringValue(menu.name ?? menu.title ?? menu.label ?? menu.slug, "").trim();
    return {
      id: toNumber(menu.id ?? menu.menuId ?? menu.menu_id),
      key: normalizeKey(name),
      name,
    };
  });

  (Object.keys(MODULE_SYNONYMS) as PermissionModule[]).forEach((module) => {
    const targetKeys = MODULE_SYNONYMS[module].map(normalizeKey);
    const match = normalizedMenus.find((menu) => {
      if (!menu.id) return false;
      if (targetKeys.includes(menu.key)) return true;
      return targetKeys.some((key) => menu.key.includes(key));
    });
    map[module] = match?.id ?? null;
  });

  return map;
}

function mapRoleToPermissionRow(role: RolePayload, menuMap: MenuMap): PermissionRow {
  const roleId = toNumber(role.id ?? role.roleId ?? role.role_id) ?? undefined;
  const roleName = toStringValue(role.name ?? role.roleName ?? role.title ?? role.slug, "Unknown Role");
  const team = inferTeamFromRole(role) ?? "Sales Team";
  const usersCount = toStringValue(role.usersCount ?? role.userCount ?? role.totalUsers ?? role.users, "-");
  const createdBy = toObject(role.createdBy ?? role.user ?? role.owner);
  const creatorName = toStringValue(createdBy.name ?? createdBy.userName ?? createdBy.email, "-");
  const createdAt = formatDate(role.createdAt ?? role.dateCreated ?? role.created_on);
  const roleMenuIds = extractMenuIds(role.menuIds ?? role.menus ?? role.permissions);
  const roleMenuNames = extractMenuNames(role.permissions ?? role.menus ?? role.menuIds).map(normalizeKey);

  const modulePermissions: ModulePermission[] = (Object.keys(menuMap) as PermissionModule[]).map((module) => {
    const menuId = menuMap[module];
    const targetKeys = MODULE_SYNONYMS[module].map(normalizeKey);
    const hasNameAccess = targetKeys.some((key) => roleMenuNames.some((name) => name.includes(key)));
    const hasIdAccess = menuId ? roleMenuIds.includes(menuId) : false;
    const hasAccess = hasIdAccess || hasNameAccess;
    return {
      module,
      create: false,
      read: hasAccess,
      update: false,
      delete: false,
    };
  });

  return {
    id: roleId,
    role: roleName,
    modulePermissions,
    users: usersCount,
    name: creatorName,
    dateCreated: createdAt,
    team,
  };
}

function buildMenuIds(modulePermissions: ModulePermission[], menuMap: MenuMap): number[] {
  const ids: number[] = [];
  modulePermissions.forEach((permission) => {
    if (!(permission.create || permission.read || permission.update || permission.delete)) return;
    const menuId = menuMap[permission.module];
    if (menuId) ids.push(menuId);
  });
  return ids;
}

function pickId(payload: unknown): number | null {
  const root = toObject(payload);
  const id = toNumber(root.id ?? root.roleId ?? root.role_id ?? toObject(root.data).id);
  return id ?? null;
}

async function fetchMenus(): Promise<MenuPayload[]> {
  const response = await apiRequest<unknown>("/menus", { method: "GET", query: { search: "", export: "" } });
  return pickList(response).map((entry) => toObject(entry));
}

async function fetchRolesByTeam(teamId: number): Promise<RolePayload[]> {
  const response = await apiRequest<unknown>("/roles", {
    method: "GET",
    query: { userType: teamId },
  });
  return pickList(response).map((entry) => toObject(entry));
}

export async function getMenuMap(): Promise<MenuMap> {
  const menus = await fetchMenus();
  return buildMenuMap(menus);
}

export async function getTeamPermissionsForTeam(
  team: TeamTab,
  menuMap: MenuMap,
): Promise<PermissionRow[]> {
  const teamId = TEAM_ID_MAP[team];
  const roles = await fetchRolesByTeam(teamId);
  return roles.map((entry) => mapRoleToPermissionRow(toObject(entry), menuMap));
}

export async function createRoleWithPermissions(
  payload: {
    roleName: string;
    team: TeamTab;
    modulePermissions: ModulePermission[];
  },
  menuMap?: MenuMap | null,
): Promise<PermissionRow | null> {
  const teamId = TEAM_ID_MAP[payload.team];
  const roleResponse = await apiRequest<unknown>("/roles", {
    method: "POST",
    body: { name: payload.roleName, userType: teamId },
  });

  const roleId = pickId(roleResponse);
  const menuIds = buildMenuIds(payload.modulePermissions, menuMap ?? buildMenuMap(await fetchMenus()));

  if (roleId && menuIds.length > 0) {
    await apiRequest("/permissions", {
      method: "POST",
      body: { teamId, roleId, menuIds },
    });
  }

  if (roleId === null) return null;

  return {
    id: roleId,
    role: payload.roleName,
    modulePermissions: payload.modulePermissions,
    users: "-",
    name: "-",
    dateCreated: formatDate(new Date().toISOString()),
    team: payload.team,
  };
}

export async function updateRoleWithPermissions(
  payload: {
    roleId: number;
    roleName: string;
    team: TeamTab;
    modulePermissions: ModulePermission[];
  },
  menuMap?: MenuMap | null,
): Promise<void> {
  const teamId = TEAM_ID_MAP[payload.team];
  await apiRequest(`/roles/${payload.roleId}`, {
    method: "PUT",
    body: { name: payload.roleName },
  });

  const menuIds = buildMenuIds(payload.modulePermissions, menuMap ?? buildMenuMap(await fetchMenus()));
  if (menuIds.length > 0) {
    await apiRequest("/permissions", {
      method: "POST",
      body: { teamId, roleId: payload.roleId, menuIds },
    });
  }
}
