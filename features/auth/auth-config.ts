export const ROLE_SLUGS = [
  "admin",
  "design-team",
  "operations-team",
  "net-metering-team",
  "loan-team",
  "sales-team",
  "amc-team",
  "finance-team",
  "supply-chain-team",
] as const;

export type RoleSlug = (typeof ROLE_SLUGS)[number];

export type DemoUser = {
  name: string;
  username: string;
  password: string;
  role: RoleSlug;
};

export const ROLE_LABELS: Record<RoleSlug, string> = {
  admin: "Admin",
  "design-team": "Design Team",
  "operations-team": "Operational Team",
  "net-metering-team": "Net Metering Team",
  "loan-team": "Loan Team",
  "sales-team": "Sales Team",
  "amc-team": "AMC Team",
  "finance-team": "Finance Team",
  "supply-chain-team": "Supply Chain Team",
};

export const DEMO_USERS: DemoUser[] = [
  { name: "Akhil", username: "admin", password: "admin123", role: "admin" },
  { name: "Akhil", username: "design", password: "design123", role: "design-team" },
  { name: "Akhil", username: "ops", password: "ops123", role: "operations-team" },
  { name: "Akhil", username: "netmeter", password: "net123", role: "net-metering-team" },
  { name: "Akhil", username: "loan", password: "loan123", role: "loan-team" },
  { name: "Akhil", username: "sales", password: "sales123", role: "sales-team" },
  { name: "Akhil", username: "amc", password: "amc123", role: "amc-team" },
  { name: "Akhil", username: "finance", password: "finance123", role: "finance-team" },
  { name: "Akhil", username: "supply", password: "supply123", role: "supply-chain-team" },
];

export function isRoleSlug(value: string): value is RoleSlug {
  return ROLE_SLUGS.includes(value as RoleSlug);
}

export function getDashboardPath(role: RoleSlug): string {
  if (role === "admin") return "/admin/dashboard";
  return `/${role}/dashboard`;
}

export function findDemoUser(username: string, password: string): DemoUser | null {
  const normalized = username.trim().toLowerCase();
  return (
    DEMO_USERS.find(
      (user) => user.username.toLowerCase() === normalized && user.password === password,
    ) ?? null
  );
}
