import { redirect } from "next/navigation";

export default async function EmbeddedDashboardPage({ searchParams }) {
  const params = await searchParams;

  const merchantId =
    params?.merchant_id ||
    params?.merchant ||
    params?.store_id ||
    params?.store ||
    null;

  if (!merchantId) {
    redirect("/");
  }

  redirect(`/dashboard?merchant_id=${merchantId}`);
}
