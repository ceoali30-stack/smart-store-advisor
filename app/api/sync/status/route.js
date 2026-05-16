import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchant_id");

    if (!merchantId) {
      return Response.json(
        { success: false, message: "merchant_id is required" },
        { status: 400 }
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
