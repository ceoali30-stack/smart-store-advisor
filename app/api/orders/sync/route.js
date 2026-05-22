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

    const accessToken = merchant.access_token;

    // 1) جلب قائمة الطلبات من سلة
    const listRes = await fetch("https://api.salla.dev/admin/v2/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

    // 2) جلب تفاصيل كل طلب + اختبار Endpoint المنتجات
    for (const order of orderList) {
      const orderId = order.id;

      const detailRes = await fetch(
        `https://api.salla.dev/admin/v2/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const detailJson = await detailRes.json();

      console.log(
        "SALLA ORDER DETAIL:",
        JSON.stringify(
          {
            order_id: orderId,
            status: detailRes.status,
            ok: detailRes.ok,
            data: detailJson.data || detailJson,
          },
          null,
          2
        )
      );

const testUrls = [
`https://api.salla.dev/admin/v2/orders/${order.id}/items`
  `https://api.salla.dev/admin/v2/orders/${order.id}/products`,
  `https://api.salla.dev/admin/v2/orders/${order.id}/shipments`,
  `https://api.salla.dev/admin/v2/orders/items?order_id=${order.id}`,
];

for (const testUrl of testUrls) {
  const testRes = await fetch(testUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const testData = await testRes.json().catch(() => null);

  console.log("SALLA ORDER ITEMS ENDPOINT TEST:", {
    order_id: order.id,
    url: testUrl,
    status: testRes.status,
    ok: testRes.ok,
    data: testData,
  });
}
      
      // اختبار مؤقت: هل يوجد Endpoint مستقل لعناصر الطلب؟
      let orderItemsFromEndpoint = [];

      try {
        const itemsTestRes = await fetch(
          `https://api.salla.dev/admin/v2/orders/${orderId}/items`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        const itemsTestJson = await itemsTestRes.json();

        console.log(
          "SALLA ORDER ITEMS TEST:",
          JSON.stringify(
            {
              order_id: orderId,
              status: itemsTestRes.status,
              ok: itemsTestRes.ok,
              data: itemsTestJson,
            },
            null,
            2
          )
        );

        if (itemsTestRes.ok) {
          if (Array.isArray(itemsTestJson?.data)) {
            orderItemsFromEndpoint = itemsTestJson.data;
          } else if (Array.isArray(itemsTestJson?.data?.items)) {
            orderItemsFromEndpoint = itemsTestJson.data.items;
          } else if (Array.isArray(itemsTestJson?.items)) {
            orderItemsFromEndpoint = itemsTestJson.items;
          }
        }
      } catch (itemsError) {
        console.log(
          "SALLA ORDER ITEMS TEST ERROR:",
          JSON.stringify(
            {
              order_id: orderId,
              error: String(itemsError),
            },
            null,
            2
          )
        );
      }

      const detailedOrder =
        detailRes.ok && detailJson.data ? detailJson.data : order;

      // نضيف المنتجات التي جاءت من Endpoint الاختبار داخل الطلب نفسه
      detailedOrders.push({
        ...detailedOrder,
        __items_from_endpoint: orderItemsFromEndpoint,
      });
    }

    // 3) تجهيز صفوف الطلبات
    const ordersRows = detailedOrders.map((order) => {
      const detectedItems =
        order.__items_from_endpoint ||
        order.items ||
        order.items?.data ||
        order.products ||
        order.order_items ||
        [];

      return {
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
        items_count: Number(detectedItems.length || 0),
        customer_name:
          order.customer?.full_name ||
          `${order.customer?.first_name || ""} ${
            order.customer?.last_name || ""
          }`.trim() ||
          order.customer?.name ||
          null,
        customer_mobile: order.customer?.mobile || null,
        created_at: order.created_at?.date || order.date?.date || order.created_at || null,
        updated_at: order.updated_at?.date || order.updated_at || null,
        synced_at: new Date().toISOString(),
      };
    });

    // 4) حفظ الطلبات في Supabase
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

    // 5) حذف منتجات هذا التاجر القديمة قبل إعادة إدخالها
    await supabase.from("order_items").delete().eq("merchant_id", merchantId);

    // 6) تجهيز صفوف المنتجات
    const itemRows = [];

    for (const order of detailedOrders) {
      const items =
        order.__items_from_endpoint ||
        order.items ||
        order.items?.data ||
        order.products ||
        order.order_items ||
        [];

      for (const item of items) {
        const unitPrice = Number(
          item.amounts?.price_without_tax?.amount ||
            item.amounts?.price?.amount ||
            item.price?.amount ||
            item.price ||
            item.unit_price ||
            0
        );

        const quantity = Number(item.quantity || item.qty || 0);

        const totalPrice = Number(
          item.amounts?.total?.amount ||
            item.total?.amount ||
            item.total ||
            item.total_price ||
            unitPrice * quantity ||
            0
        );

        itemRows.push({
          order_id: Number(order.id),
          merchant_id: merchantId,
          product_id:
            item.product?.id ||
            item.product_id ||
            item.sku_id ||
            item.id ||
            null,
          product_name:
            item.product?.name ||
            item.name ||
            item.product_name ||
            item.title ||
            null,
          category_name:
            item.product?.category?.name ||
            item.category?.name ||
            item.category_name ||
            null,
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          sku: item.sku || item.product?.sku || null,
        });
      }
    }

    // 7) حفظ المنتجات في Supabase
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
