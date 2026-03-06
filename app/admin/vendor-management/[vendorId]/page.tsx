import PageImpl from "@/app/vendor-management/[vendorId]/page";
import { requireRole } from "@/features/auth/server-guard";

export default async function AdminVendorPage() {
  await requireRole("admin");
  return <PageImpl />;
}
