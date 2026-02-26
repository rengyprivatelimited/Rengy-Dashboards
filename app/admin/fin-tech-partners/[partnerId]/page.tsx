import PageImpl from "@/app/fin-tech-partners/[partnerId]/page";
import { requireRole } from "@/features/auth/server-guard";

type Props = { params: Promise<{ partnerId: string }> };

export default async function AdminPartnerPage(props: Props) {
  await requireRole("admin");
  return <PageImpl {...props} />;
}
