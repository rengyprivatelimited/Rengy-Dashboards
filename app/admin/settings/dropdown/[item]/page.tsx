import PageImpl from "@/app/settings/dropdown/[item]/page";
import { requireRole } from "@/features/auth/server-guard";

type Props = { params: Promise<{ item: string }> };

export default async function AdminSettingsItemPage(props: Props) {
  await requireRole("admin");
  return <PageImpl {...props} />;
}
