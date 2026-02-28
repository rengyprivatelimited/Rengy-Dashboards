import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/api/client";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function safeDecode(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildUpstreamUrl(pathParts: string[], request: NextRequest): string {
  const upstream = new URL(`${getApiBaseUrl()}/${pathParts.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });
  return upstream.toString();
}

async function forward(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const cookieToken = safeDecode(cookieStore.get("rengy_access_token")?.value);
  const cookieUserType = safeDecode(cookieStore.get("rengy_user_type")?.value);
  const url = buildUpstreamUrl(path, request);
  const upstreamUrl = new URL(url);
  const incomingAuth = request.headers.get("authorization");

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", request.headers.get("accept") ?? "application/json");

  if (incomingAuth) {
    headers.set("Authorization", incomingAuth);
  } else if (cookieToken) {
    headers.set("Authorization", `Bearer ${cookieToken}`);
  }

  if (cookieUserType) {
    headers.set("x-user-type", cookieUserType);
    headers.set("userType", cookieUserType);
    if (!upstreamUrl.searchParams.has("userType")) {
      upstreamUrl.searchParams.set("userType", cookieUserType);
    }
  }

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl.toString(), {
      method,
      headers,
      body: hasBody ? body : undefined,
      cache: "no-store",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Upstream request failed.",
        error: error instanceof Error ? error.message : String(error),
        url: upstreamUrl.toString(),
      },
      { status: 504 },
    );
  }

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("Content-Type", upstreamContentType);
  }

  const responseBody = await upstreamResponse.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return forward(request, context);
}
