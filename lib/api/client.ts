const DEFAULT_API_BASE_URL = "https://api.rengy.in/api/v1";
const DEFAULT_PROXY_BASE_URL = "/api/rengy";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const envBase =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL;
  return normalizeBaseUrl(envBase);
}

export function getApiProxyBaseUrl(): string {
  const proxyBase = process.env.NEXT_PUBLIC_API_PROXY_BASE_URL ?? DEFAULT_PROXY_BASE_URL;
  return normalizeBaseUrl(proxyBase);
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const baseUrl =
    typeof window === "undefined" ? getApiBaseUrl() : getApiProxyBaseUrl();
  const nextPath = path.startsWith("/") ? path : `/${path}`;
  const url = baseUrl.startsWith("http")
    ? new URL(`${baseUrl}${nextPath}`)
    : new URL(`${baseUrl}${nextPath}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, query, ...rest } = options;
  const url = buildUrl(path, query);

  const init: RequestInit = {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(headers ?? {}),
    },
    cache: rest.cache ?? "no-store",
    credentials: "include",
  };

  if (body !== undefined) {
    if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer) {
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
      init.headers = {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      };
    }
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();
  if (!response.ok) {
    throw new ApiError(`API request failed: ${response.status}`, response.status, payload);
  }

  return payload as T;
}
