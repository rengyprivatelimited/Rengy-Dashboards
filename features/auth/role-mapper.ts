import { RoleSlug } from "./auth-config";

type ApiUserLike = {
  userType?: unknown;
  role?: {
    userTypeDetail?: {
      name?: unknown;
    };
  };
};

const ROLE_KEYWORD_MAP: Array<{ keyword: string; role: RoleSlug }> = [
  { keyword: "admin", role: "admin" },
  { keyword: "design", role: "design-team" },
  { keyword: "operation", role: "operations-team" },
  { keyword: "ops", role: "operations-team" },
  { keyword: "net metering", role: "net-metering-team" },
  { keyword: "loan", role: "loan-team" },
  { keyword: "sales", role: "sales-team" },
  { keyword: "amc", role: "amc-team" },
  { keyword: "finance", role: "finance-team" },
  { keyword: "supply chain", role: "supply-chain-team" },
  { keyword: "supply", role: "supply-chain-team" },
  { keyword: "procurement", role: "supply-chain-team" },
];

// Fallback numeric mapping inferred from current backend sample data.
const USER_TYPE_TO_ROLE: Record<number, RoleSlug> = {
  1: "admin",
  2: "design-team",
  3: "operations-team",
  4: "sales-team",
  5: "finance-team",
  6: "loan-team",
  7: "amc-team",
  8: "supply-chain-team",
  9: "net-metering-team",
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function mapApiUserToRole(user: ApiUserLike | null | undefined): RoleSlug {
  const userTypeName = normalizeText(user?.role?.userTypeDetail?.name);
  if (userTypeName) {
    const foundByName = ROLE_KEYWORD_MAP.find(({ keyword }) => userTypeName.includes(keyword));
    if (foundByName) {
      return foundByName.role;
    }
  }

  const userType = Number(user?.userType);
  if (Number.isFinite(userType) && userType in USER_TYPE_TO_ROLE) {
    return USER_TYPE_TO_ROLE[userType];
  }

  return "admin";
}

