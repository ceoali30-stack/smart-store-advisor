import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createMerchantSession } from "../../lib/session";

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

  const cookieStore = await cookies();

  cookieStore.set("merchant_session", createMerchantSession(String(merchantId)), {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/dashboard");
}
