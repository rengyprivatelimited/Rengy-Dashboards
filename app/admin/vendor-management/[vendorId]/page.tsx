import PageImpl from "@/app/vendor-management/[vendorId]/page";
import { requireRole } from "@/features/auth/server-guard";

type Props = { params: Promise<{ vendorId: string }> };

export default async function AdminVendorPage(props: Props) {
  await requireRole("admin");
  return <PageImpl {...props} />;
}
