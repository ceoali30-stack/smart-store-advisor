import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1) جلب آخر تاجر محفوظ
    const { data: merchants, error: merchantError } = await supabase
      .from("merchants")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (merchantError) {
      return Response.json({
        success: false,
        step: "get_merchant_failed",
        error: merchantError.message,
      });
    }

    if (!merchants || merchants.length === 0) {
      return Response.json({
        success: false,
        error: "No merchant found. Please authorize Salla first.",
      });
    }

    const merchant = merchants[0];

    if (!merchant.access_token) {
      return Response.json({
        success: false,
        error: "Merchant has no access_token.",
      });
    }

    // 2) جلب الطلبات من سلة
    const sallaResponse = await fetch(
      "https://api.salla.dev/admin/v2/orders?page=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${merchant.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const sallaData = await sallaResponse.json();

    if (!sallaResponse.ok || sallaData.success === false) {
      return Response.json({
        success: false,
        step: "salla_orders_failed",
        status: sallaResponse.status,
        error: sallaData,
      });
    }

    const orders = sallaData.data || [];

    if (orders.length === 0) {
      return Response.json({
        success: true,
        message: "No orders found.",
        count: 0,
      });
    }

    // 3) تجهيز الطلبات للحفظ
    const ordersToSave = orders.map((order) => ({
      merchant_id: merchant.merchant_id,
      salla_order_id: String(order.id),
      reference_id: order.reference_id ? String(order.reference_id) : null,
      status_name: order.status?.name || null,
      status_slug: order.status?.slug || null,
      payment_method: order.payment_method || null,
      total_amount: order.total?.amount || 0,
      currency: order.total?.currency || "SAR",
      order_date: order.date?.date || null,
      raw_data: order,
      updated_at: new Date().toISOString(),
    }));

    // 4) حفظ الطلبات في Supabase
    const { data: savedOrders, error: saveError } = await supabase
      .from("orders")
      .upsert(ordersToSave, {
        onConflict: "salla_order_id",
      })
      .select();

    if (saveError) {
      return Response.json({
        success: false,
        step: "save_orders_failed",
        error: saveError.message,
        details: saveError,
      });
    }

    return Response.json({
      success: true,
      message: "Orders synced successfully",
      count: savedOrders.length,
      orders: savedOrders,
    });
  } catch (error) {
    return Response.json({
      success: false,
      step: "unexpected_error",
      error: error.message,
    });
  }
}
