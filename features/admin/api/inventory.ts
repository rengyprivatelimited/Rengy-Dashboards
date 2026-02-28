import { apiRequest } from "@/lib/api/client";

export type InventoryItem = {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  categoryId?: number;
  brand: string;
  count: string;
  specification: string;
  updated: string;
  currentPrice: string;
};

export type InventoryQuery = {
  search?: string;
  categoryId?: string | number;
  page?: number;
  perPage?: number;
};

export type InventoryPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type InventoryListResult = {
  rows: InventoryItem[];
  pagination: InventoryPagination;
};

export type InventoryInput = {
  itemName: string;
  categoryId?: number;
  brand?: string;
  count?: string | number;
  specification?: string;
  price?: string | number;
};

export type InventoryCategory = {
  id: number;
  name: string;
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

function pickPagination(payload: unknown, fallback: InventoryPagination): InventoryPagination {
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

function mapInventoryItem(item: unknown): InventoryItem {
  const row = toObject(item);
  const category = toObject(row.category);

  return {
    id: toNumber(row.id ?? row.itemId ?? row.inventoryId) ?? 0,
    itemCode: toStringValue(row.itemCode ?? row.code ?? row.sku ?? row.id),
    itemName: toStringValue(row.itemName ?? row.name ?? row.productName),
    category: toStringValue(row.categoryName ?? category.name ?? row.category),
    categoryId: toNumber(category.id ?? row.categoryId ?? row.category_id) ?? undefined,
    brand: toStringValue(row.brand ?? row.brandName ?? row.make),
    count: toStringValue(row.itemCount ?? row.count ?? row.stock ?? row.quantity),
    specification: toStringValue(row.specification ?? row.specifications ?? row.spec),
    updated: formatDate(row.updatedAt ?? row.updatedOn ?? row.modifiedAt ?? row.createdAt),
    currentPrice: formatCurrency(row.currentPrice ?? row.price ?? row.unitPrice ?? row.cost),
  };
}

function mapInventoryCategory(item: unknown): InventoryCategory {
  const row = toObject(item);
  return {
    id: toNumber(row.id) ?? 0,
    name: toStringValue(row.name ?? row.title ?? row.categoryName),
  };
}

export async function getInventoryItems(query: InventoryQuery): Promise<InventoryListResult> {
  const { search = "", categoryId = "", page = 1, perPage = 10 } = query;
  const response = await apiRequest<unknown>("/inventory", {
    method: "GET",
    query: {
      search,
      categoryId,
      page,
      per_page: perPage,
    },
  });

  const rows = pickList(response).map(mapInventoryItem);
  const pagination = pickPagination(response, {
    page,
    perPage,
    total: rows.length,
    totalPages: 1,
  });

  return { rows, pagination };
}

export async function getInventoryCategories(): Promise<InventoryCategory[]> {
  const response = await apiRequest<unknown>("/common/category", { method: "GET" });
  return pickList(response).map(mapInventoryCategory);
}

export async function getInventoryItemDetail(id: number): Promise<InventoryItem> {
  const response = await apiRequest<unknown>(`/inventory/${id}`, { method: "GET" });
  const list = pickList(response);
  const item = list[0] ?? response;
  return mapInventoryItem(item);
}

export async function createInventoryItem(payload: InventoryInput): Promise<unknown> {
  return apiRequest("/inventory", { method: "POST", body: payload });
}

export async function updateInventoryItem(id: number, payload: InventoryInput): Promise<unknown> {
  return apiRequest(`/inventory/${id}`, { method: "PUT", body: payload });
}

export async function deleteInventoryItem(id: number): Promise<unknown> {
  return apiRequest(`/inventory/${id}`, { method: "DELETE" });
}
