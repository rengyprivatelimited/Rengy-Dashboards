import { apiRequest } from "@/lib/api/client";

export type AccountSettingsPayload = {
  userId: string | number;
  settings: Record<string, boolean>;
};

export type AccountSettingsResponse = {
  settings: Record<string, boolean>;
};

function toObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function pickSettings(payload: unknown): Record<string, boolean> {
  const root = toObject(payload);
  const data = toObject(root.data ?? root.settings ?? root);
  const settings = toObject(data.settings ?? data);
  const result: Record<string, boolean> = {};

  Object.entries(settings).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      result[key] = value;
    } else if (value === 1 || value === "1" || value === "true") {
      result[key] = true;
    } else if (value === 0 || value === "0" || value === "false") {
      result[key] = false;
    }
  });

  return result;
}

export async function getAccountSettings(userId: string | number): Promise<AccountSettingsResponse> {
  const response = await apiRequest<unknown>(`/common/account-settings/${userId}`, { method: "GET" });
  return { settings: pickSettings(response) };
}

export async function saveAccountSettings(payload: AccountSettingsPayload): Promise<unknown> {
  return apiRequest("/common/account-settings", {
    method: "POST",
    body: payload,
  });
}
