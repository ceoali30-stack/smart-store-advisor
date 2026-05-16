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

    if (!listRes.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch orders list from Salla",
          status: listRes.status,
          error: listJson,
        },
        { status: listRes.status }
      );
    }

    const orderList = listJson.data || [];
    const detailedOrders = [];

    for (const order of orderList) {
      const orderId = order.id;

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

      if (detailRes.ok && detailJson.data) {
        detailedOrders.push(detailJson.data);
      } else {
        detailedOrders.push(order);
      }
    }

    const ordersRows = detailedOrders.map((order) => ({
      id: Number(order.id),
      merchant_id: merchantId,
      reference_id: order.reference_id || order.reference || null,
      status: order.status?.name || order.status || null,
      city:
        order.customer?.city ||
        order.shipping?.address?.city ||
        order.address?.city ||
        null,
      country:
        order.customer?.country ||
        order.shipping?.address?.country ||
        order.address?.country ||
        null,
      currency:
        order.amounts?.total?.currency ||
        order.total?.currency ||
        order.currency ||
        "SAR",
      total_amount: Number(
        order.amounts?.total?.amount ||
          order.total?.amount ||
          order.total ||
          order.paid_amount?.amount ||
          0
      ),
      items_count: Number(order.items?.length || 0),
      customer_name:
        order.customer?.full_name ||
        `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim() ||
        order.customer?.name ||
        null,
      customer_mobile: order.customer?.mobile || null,
      created_at: order.created_at?.date || order.created_at || null,
      updated_at: order.updated_at?.date || order.updated_at || null,
      synced_at: new Date().toISOString(),
    }));

    if (ordersRows.length > 0) {
      const { error: ordersError } = await supabase
        .from("orders")
        .upsert(ordersRows, { onConflict: "id" });

      if (ordersError) {
        return Response.json(
          {
            success: false,
            message: "Supabase orders upsert failed",
            error: ordersError,
          },
          { status: 500 }
        );
      }
    }

    await supabase.from("order_items").delete().eq("merchant_id", merchantId);

    const itemRows = [];

    for (const order of detailedOrders) {
      const items = order.items || [];

      for (const item of items) {
        const unitPrice = Number(
          item.amounts?.price_without_tax?.amount ||
            item.amounts?.price?.amount ||
            item.price?.amount ||
            item.price ||
            0
        );

        const totalPrice = Number(
          item.amounts?.total?.amount ||
            item.total?.amount ||
            item.total ||
            unitPrice * Number(item.quantity || 0)
        );

        itemRows.push({
          order_id: Number(order.id),
          merchant_id: merchantId,
          product_id:
            item.product?.id ||
            item.product_id ||
            item.sku_id ||
            null,
          product_name:
            item.product?.name ||
            item.name ||
            item.product_name ||
            null,
          category_name:
            item.product?.category?.name ||
            item.category?.name ||
            null,
          quantity: Number(item.quantity || 0),
          unit_price: unitPrice,
          total_price: totalPrice,
          sku: item.sku || item.product?.sku || null,
        });
      }
    }

    if (itemRows.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemRows);

      if (itemsError) {
        return Response.json(
          {
            success: false,
            message: "Supabase order items insert failed",
            error: itemsError,
          },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      merchant_id: merchantId,
      orders_count: ordersRows.length,
      order_items_count: itemRows.length,
      orders: ordersRows,
      items: itemRows,
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
