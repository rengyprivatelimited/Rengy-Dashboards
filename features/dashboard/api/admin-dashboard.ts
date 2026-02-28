import { apiRequest } from "@/lib/api/client";

export type AdminDashboardStat = {
  value: string;
  title: string;
  note: string;
};

export type AdminDashboardData = {
  stats: AdminDashboardStat[];
  raw: unknown;
  source: "api" | "fallback";
};

const FALLBACK_STATS: AdminDashboardStat[] = [
  {
    value: "INR 3.8 Cr",
    title: "Total Revenue Impact",
    note: "+6% growth points vs last year",
  },
  {
    value: "1202",
    title: "Active Projects",
    note: "+8% higher than last month",
  },
  {
    value: "40%",
    title: "Overall SLA Compliance",
    note: "+4 percent above/under performance",
  },
  {
    value: "INR 62 Lakh",
    title: "Pending Collections",
    note: "+4 percent achievement in overdue invoices",
  },
];

type GenericRecord = Record<string, unknown>;

function asRecord(value: unknown): GenericRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as GenericRecord;
}

function firstObject(...values: unknown[]): GenericRecord | null {
  for (const value of values) {
    const record = asRecord(value);
    if (record) return record;
  }
  return null;
}

function toDisplayValue(value: unknown): string | null {
  if (typeof value === "number") return `${value}`;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function pickValue(record: GenericRecord | null, keys: string[]): string | null {
  if (!record) return null;
  for (const key of keys) {
    if (key in record) {
      const value = toDisplayValue(record[key]);
      if (value) return value;
    }
  }
  return null;
}

function mapStatsFromKnownShape(payload: unknown): AdminDashboardStat[] | null {
  const root = asRecord(payload);
  if (!root) return null;

  const data = firstObject(root.data, root.result, root.response, root.dashboard, root);
  if (!data) return null;

  const mapped: AdminDashboardStat[] = [
    {
      value:
        pickValue(data, ["totalRevenueImpact", "revenueImpact", "totalRevenue", "revenue"]) ??
        FALLBACK_STATS[0].value,
      title: FALLBACK_STATS[0].title,
      note:
        pickValue(data, ["totalRevenueImpactNote", "revenueImpactNote", "revenueNote"]) ??
        FALLBACK_STATS[0].note,
    },
    {
      value:
        pickValue(data, ["activeProjects", "projectCount", "totalProjects"]) ??
        FALLBACK_STATS[1].value,
      title: FALLBACK_STATS[1].title,
      note:
        pickValue(data, ["activeProjectsNote", "projectCountNote"]) ??
        FALLBACK_STATS[1].note,
    },
    {
      value:
        pickValue(data, ["overallSlaCompliance", "slaCompliance", "overallSla"]) ??
        FALLBACK_STATS[2].value,
      title: FALLBACK_STATS[2].title,
      note:
        pickValue(data, ["overallSlaComplianceNote", "slaComplianceNote", "slaNote"]) ??
        FALLBACK_STATS[2].note,
    },
    {
      value:
        pickValue(data, ["pendingCollections", "overdueCollections", "pendingAmount"]) ??
        FALLBACK_STATS[3].value,
      title: FALLBACK_STATS[3].title,
      note:
        pickValue(data, ["pendingCollectionsNote", "overdueCollectionsNote", "pendingAmountNote"]) ??
        FALLBACK_STATS[3].note,
    },
  ];

  return mapped;
}

export async function getAdminDashboardData(dashboardId = 32): Promise<AdminDashboardData> {
  try {
    const raw = await apiRequest<unknown>(`/dashboard/${dashboardId}`, {
      method: "GET",
      cache: "no-store",
    });

    const stats = mapStatsFromKnownShape(raw) ?? FALLBACK_STATS;
    return {
      stats,
      raw,
      source: "api",
    };
  } catch (error) {
    console.error("Admin dashboard API failed, using fallback data", error);
    return {
      stats: FALLBACK_STATS,
      raw: null,
      source: "fallback",
    };
  }
}

export async function getAdminDashboardDataWithToken(
  accessToken: string,
  dashboardId = 32,
): Promise<AdminDashboardData> {
  if (!accessToken) {
    return {
      stats: FALLBACK_STATS,
      raw: null,
      source: "fallback",
    };
  }

  try {
    const raw = await apiRequest<unknown>(`/dashboard/${dashboardId}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const stats = mapStatsFromKnownShape(raw) ?? FALLBACK_STATS;
    return {
      stats,
      raw,
      source: "api",
    };
  } catch (error) {
    console.error("Admin dashboard API (token) failed, using fallback data", error);
    return {
      stats: FALLBACK_STATS,
      raw: null,
      source: "fallback",
    };
  }
}
