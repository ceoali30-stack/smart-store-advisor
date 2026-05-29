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

    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("access_token")
      .eq("merchant_id", merchantId)
      .single();

    if (merchantError || !merchant?.access_token) {
      return Response.json(
        { success: false, message: "Merchant access token not found" },
        { status: 404 }
      );
    }

    const cartsRes = await fetch("https://api.salla.dev/admin/v2/carts/abandoned", {
      headers: {
        Authorization: `Bearer ${merchant.access_token}`,
        Accept: "application/json",
      },
    });

    const cartsData = await cartsRes.json();

    if (!cartsRes.ok) {
      return Response.json(
        { success: false, message: "Failed to fetch abandoned carts", error: cartsData },
        { status: cartsRes.status }
      );
    }

    const carts = Array.isArray(cartsData.data) ? cartsData.data : [];

    const rows = carts.map((cart) => ({
      merchant_id: merchantId,
      cart_id: String(cart.id || cart.cart_id || cart.reference || ""),

      customer_name:
        cart.customer?.name || cart.customer_name || cart.name || null,
      customer_email:
        cart.customer?.email || cart.customer_email || cart.email || null,
      customer_mobile:
        cart.customer?.mobile || cart.customer_mobile || cart.mobile || null,

      city:
        cart.customer?.city || cart.city || cart.shipping?.city || null,
      country:
        cart.customer?.country || cart.country || cart.shipping?.country || null,

      total_amount: Number(
        cart.total?.amount ||
          cart.amounts?.total?.amount ||
          cart.total_amount ||
          cart.amount ||
          0
      ),

      currency:
        cart.total?.currency ||
        cart.amounts?.total?.currency ||
        cart.currency ||
        "SAR",

      items_count: Number(
        cart.items_count ||
          cart.products?.length ||
          cart.items?.length ||
          0
      ),

      products: cart.products || cart.items || [],

      payment_method:
        cart.payment_method?.name ||
        cart.payment_method ||
        null,

      cart_created_at:
        cart.created_at || cart.date?.created_at || null,
      cart_updated_at:
        cart.updated_at || cart.date?.updated_at || null,

      raw_data: cart,
    }));

    if (rows.length > 0) {
      const { error: upsertError } = await supabase
        .from("abandoned_carts")
        .upsert(rows, { onConflict: "merchant_id,cart_id" });

      if (upsertError) {
        return Response.json(
          { success: false, message: "Failed to save abandoned carts", error: upsertError },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      merchant_id: merchantId,
      total_carts: rows.length,
      carts: rows,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Unexpected error", error: String(error) },
      { status: 500 }
    );
  }
}
