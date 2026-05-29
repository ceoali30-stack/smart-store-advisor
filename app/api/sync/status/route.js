import { cookies } from "next/headers";
import { verifyMerchantSession } from "../../../lib/session";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
const sessionCookie = cookieStore.get("merchant_session")?.value;
const merchantId = verifyMerchantSession(sessionCookie);

if (!merchantId) {
  return Response.json(
    { success: false, message: "Unauthorized" },
    { status: 401 }
  );
}
    const { data, error } = await supabase
      .from("orders")
      .select("synced_at")
      .eq("merchant_id", merchantId)
      .order("synced_at", { ascending: false })
      .limit(1);

    if (error) {
      return Response.json(
        { success: false, message: "Failed to fetch sync status", error },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      merchant_id: merchantId,
      last_sync: data?.[0]?.synced_at || null,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Unexpected server error", error: String(error) },
      { status: 500 }
    );
  }
}
