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

    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("access_token")
      .eq("merchant_id", merchantId)
      .single();

    if (merchantError || !merchant?.access_token) {
      return Response.json(
        {
          success: false,
          message: "Merchant access token not found",
          error: merchantError,
        },
        { status: 404 }
      );
    }

    const listRes = await fetch("https://api.salla.dev/admin/v2/orders", {
      headers: {
        Authorization: `Bearer ${merchant.access_token}`,
        Accept: "application/json",
      },
    });

    const listJson = await listRes.json();
    const firstOrder = listJson.data?.[0] || null;
    const orderId = firstOrder?.id;

    if (!orderId) {
      return Response.json({
        success: false,
        message: "No orders found",
        list_status: listRes.status,
        list_response: listJson,
      });
    }

    const detailRes = await fetch(
      `https://api.salla.dev/admin/v2/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${merchant.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const detailJson = await detailRes.json();

    const itemsRes = await fetch(
      `https://api.salla.dev/admin/v2/orders/${orderId}/items`,
      {
        headers: {
          Authorization: `Bearer ${merchant.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const itemsJson = await itemsRes.json();

    return Response.json({
      success: true,
      merchant_id: merchantId,

      first_order_id: orderId,

      list_status: listRes.status,
      detail_status: detailRes.status,
      items_endpoint_status: itemsRes.status,

      first_order_from_list: firstOrder,

      detail_order_keys: detailJson.data ? Object.keys(detailJson.data) : [],
      detail_order_items: detailJson.data?.items || null,

      items_endpoint_response: itemsJson,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unexpected server error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
