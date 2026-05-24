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

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("merchant_id", merchantId);

    if (ordersError) {
      return Response.json(
        { success: false, message: "Failed to fetch orders", error: ordersError },
        { status: 500 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("merchant_id", merchantId);

    if (itemsError) {
      return Response.json(
        { success: false, message: "Failed to fetch order items", error: itemsError },
        { status: 500 }
      );
    }

    const { data: abandonedCarts, error: abandonedCartsError } = await supabase
      .from("abandoned_carts")
      .select("*")
      .eq("merchant_id", merchantId);

    if (abandonedCartsError) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch abandoned carts",
          error: abandonedCartsError,
        },
        { status: 500 }
      );
    }

    const safeOrders = orders || [];
    const safeItems = items || [];
    const safeAbandonedCarts = abandonedCarts || [];

    const getOrderTotal = (order) =>
      Number(
        order.total_amount ||
          order.total ||
          order.amount ||
          order.grand_total ||
          0
      );

    const totalOrders = safeOrders.length;

    const totalRevenue = safeOrders.reduce(
      (sum, order) => sum + getOrderTotal(order),
      0
    );

    const totalItemsSold = safeItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const averageOrderValue =
      totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

    const averageItemsPerOrder =
      totalOrders > 0 ? Number((totalItemsSold / totalOrders).toFixed(2)) : 0;

    const abandonedCartsCount = safeAbandonedCarts.length;

    const abandonedCartsValue = safeAbandonedCarts.reduce(
      (sum, cart) => sum + Number(cart.total_amount || 0),
      0
    );

    const abandonedCartsItems = safeAbandonedCarts.reduce(
      (sum, cart) => sum + Number(cart.items_count || 0),
      0
    );

    const averageAbandonedCartValue =
      abandonedCartsCount > 0
        ? Number((abandonedCartsValue / abandonedCartsCount).toFixed(2))
        : 0;

    const productMap = {};

    for (const item of safeItems) {
      const name = item.product_name || "منتج غير معروف";

      if (!productMap[name]) {
        productMap[name] = {
          product_name: name,
          quantity_sold: 0,
          revenue: 0,
        };
      }

      productMap[name].quantity_sold += Number(item.quantity || 0);
      productMap[name].revenue += Number(item.total_price || 0);
    }

    const topProducts = Object.values(productMap).sort(
      (a, b) => b.quantity_sold - a.quantity_sold
    );

    const categoryMap = {};

    for (const item of safeItems) {
      const category = item.category_name || "غير مصنف";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          category_name: category,
          quantity_sold: 0,
          revenue: 0,
        };
      }

      categoryMap[category].quantity_sold += Number(item.quantity || 0);
      categoryMap[category].revenue += Number(item.total_price || 0);
    }

    const topCategories = Object.values(categoryMap).sort(
      (a, b) => b.quantity_sold - a.quantity_sold
    );

    const cityProductMap = {};

    for (const item of safeItems) {
      const order = safeOrders.find((o) => Number(o.id) === Number(item.order_id));
      const city = order?.city || "غير محدد";
      const key = `${city}-${item.product_name || "منتج غير معروف"}`;

      if (!cityProductMap[key]) {
        cityProductMap[key] = {
          city,
          product_name: item.product_name || "منتج غير معروف",
          quantity_sold: 0,
          revenue: 0,
        };
      }

      cityProductMap[key].quantity_sold += Number(item.quantity || 0);
      cityProductMap[key].revenue += Number(item.total_price || 0);
    }

    const topProductsByCity = Object.values(cityProductMap).sort(
      (a, b) => b.quantity_sold - a.quantity_sold
    );

    const salesByPaymentMethod = {};
    const salesBySource = {};

    safeOrders.forEach((order) => {
      const paymentMethod =
        order.payment_method_label ||
        order.payment_method ||
        "غير محدد";

      const source =
        order.sales_channel ||
        order.source ||
        order.source_details ||
        "غير محدد";

      const orderTotal = getOrderTotal(order);

      if (!salesByPaymentMethod[paymentMethod]) {
        salesByPaymentMethod[paymentMethod] = {
          name: paymentMethod,
          orders_count: 0,
          total_sales: 0,
        };
      }

      salesByPaymentMethod[paymentMethod].orders_count += 1;
      salesByPaymentMethod[paymentMethod].total_sales += orderTotal;

      if (!salesBySource[source]) {
        salesBySource[source] = {
          name: source,
          orders_count: 0,
          total_sales: 0,
        };
      }

      salesBySource[source].orders_count += 1;
      salesBySource[source].total_sales += orderTotal;
    });

    const paymentMethodsInsights = Object.values(salesByPaymentMethod).sort(
      (a, b) => b.total_sales - a.total_sales
    );

    const salesChannelsInsights = Object.values(salesBySource).sort(
      (a, b) => b.total_sales - a.total_sales
    );

    const ordersByCity = {};

    safeOrders.forEach((order) => {
      const city =
        order.city ||
        order.customer_city ||
        order.shipping_city ||
        order.billing_city ||
        "غير محدد";

      if (!ordersByCity[city]) {
        ordersByCity[city] = {
          city,
          total_orders: 0,
          total_revenue: 0,
        };
      }

      ordersByCity[city].total_orders += 1;
      ordersByCity[city].total_revenue += getOrderTotal(order);
    });

    const topCities = Object.values(ordersByCity)
      .sort((a, b) => b.total_orders - a.total_orders)
      .slice(0, 3);

    const cityToRegion = {
      الرياض: "منطقة الرياض",
      جدة: "منطقة مكة المكرمة",
      مكة: "منطقة مكة المكرمة",
      "مكة المكرمة": "منطقة مكة المكرمة",
      الطائف: "منطقة مكة المكرمة",
      الدمام: "المنطقة الشرقية",
      الخبر: "المنطقة الشرقية",
      الظهران: "المنطقة الشرقية",
      الأحساء: "المنطقة الشرقية",
      الهفوف: "المنطقة الشرقية",
      المدينة: "منطقة المدينة المنورة",
      "المدينة المنورة": "منطقة المدينة المنورة",
      ينبع: "منطقة المدينة المنورة",
      بريدة: "منطقة القصيم",
      عنيزة: "منطقة القصيم",
      الرس: "منطقة القصيم",
      أبها: "منطقة عسير",
      "خميس مشيط": "منطقة عسير",
      النماص: "منطقة عسير",
      تبوك: "منطقة تبوك",
      حائل: "منطقة حائل",
      جازان: "منطقة جازان",
      جيزان: "منطقة جازان",
      نجران: "منطقة نجران",
      الباحة: "منطقة الباحة",
      عرعر: "منطقة الحدود الشمالية",
      سكاكا: "منطقة الجوف",
      القريات: "منطقة الجوف",
    };

    const ordersByRegion = {};

safeOrders.forEach((order) => {
  const city =
    order.city ||
    order.customer_city ||
    order.shipping_city ||
    order.billing_city ||
    "غير محدد";

  const region = cityToRegion[city] || "غير محدد";
  const orderTotal = getOrderTotal(order);

  if (!ordersByRegion[region]) {
    ordersByRegion[region] = {
      region,
      total_orders: 0,
      total_revenue: 0,
      total_items: 0,
      cities: [],
      products: {},
      payment_methods: {},
      sales_channels: {},
    };
  }

  ordersByRegion[region].total_orders += 1;
  ordersByRegion[region].total_revenue += orderTotal;

  if (city && !ordersByRegion[region].cities.includes(city)) {
    ordersByRegion[region].cities.push(city);
  }

  const paymentMethod =
    order.payment_method_label ||
    order.payment_method ||
    "غير محدد";

  ordersByRegion[region].payment_methods[paymentMethod] =
    (ordersByRegion[region].payment_methods[paymentMethod] || 0) + 1;

  const source =
    order.sales_channel ||
    order.source ||
    order.source_details ||
    "غير محدد";

  ordersByRegion[region].sales_channels[source] =
    (ordersByRegion[region].sales_channels[source] || 0) + 1;

  const orderItems = safeItems.filter(
    (item) => Number(item.order_id) === Number(order.id)
  );

  orderItems.forEach((item) => {
    const productName = item.product_name || "منتج غير معروف";
    const quantity = Number(item.quantity || 0);

    ordersByRegion[region].total_items += quantity;

    ordersByRegion[region].products[productName] =
      (ordersByRegion[region].products[productName] || 0) + quantity;
  });
});

const getTopKey = (obj) => {
  const entries = Object.entries(obj || {});
  if (entries.length === 0) return "لا توجد بيانات";

  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

const regionsInsights = Object.values(ordersByRegion)
  .map((region) => ({
    region: region.region,
    total_orders: region.total_orders,
    total_revenue: region.total_revenue,
    total_items: region.total_items,
    average_order_value:
      region.total_orders > 0
        ? Number((region.total_revenue / region.total_orders).toFixed(2))
        : 0,
    average_items_per_order:
      region.total_orders > 0
        ? Number((region.total_items / region.total_orders).toFixed(2))
        : 0,
    cities: region.cities,
    top_product: getTopKey(region.products),
    top_payment_method: getTopKey(region.payment_methods),
    top_sales_channel: getTopKey(region.sales_channels),
  }))
  .sort((a, b) => b.total_orders - a.total_orders);
        if (b.total_orders !== a.total_orders) {
          return b.total_orders - a.total_orders;
        }

        return b.total_revenue - a.total_revenue;
      })
      .slice(0, 5);

    const recommendations = [];

    if (topProducts.length > 0) {
      recommendations.push({
        type: "top_product",
        title: "أكثر منتج مبيعًا",
        message: `المنتج "${topProducts[0].product_name}" هو الأكثر مبيعًا بعدد ${topProducts[0].quantity_sold} قطعة. يُنصح بزيادة توفره ومراقبة مخزونه باستمرار.`,
      });
    }

    if (topCategories.length > 0) {
      recommendations.push({
        type: "top_category",
        title: "أقوى قسم مبيعًا",
        message: `قسم "${topCategories[0].category_name}" هو الأعلى مبيعًا. يُنصح بإضافة منتجات مشابهة أو عمل عروض مخصصة لهذا القسم.`,
      });
    }

    if (topProductsByCity.length > 0) {
      recommendations.push({
        type: "city_product",
        title: "فرصة تسويق حسب المدينة",
        message: `المنتج "${topProductsByCity[0].product_name}" يحقق أداءً جيدًا في مدينة "${topProductsByCity[0].city}". يُنصح بزيادة الإعلانات أو العروض لهذا المنتج في هذه المدينة.`,
      });
    }

    if (averageOrderValue > 0) {
      recommendations.push({
        type: "average_order_value",
        title: "متوسط قيمة الفاتورة",
        message: `متوسط قيمة الفاتورة هو ${averageOrderValue} SAR. يمكن رفعه من خلال عروض مثل: اشترِ منتجين واحصل على خصم، أو الشحن المجاني فوق مبلغ معين.`,
      });
    }

    return Response.json({
      success: true,
      merchant_id: merchantId,
      summary: {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        total_items_sold: totalItemsSold,
        average_order_value: averageOrderValue,
        average_items_per_order: averageItemsPerOrder,
      },
      abandoned_carts_summary: {
        total_carts: abandonedCartsCount,
        total_value: abandonedCartsValue,
        total_items: abandonedCartsItems,
        average_cart_value: averageAbandonedCartValue,
      },
      top_products: topProducts,
      top_categories: topCategories,
      top_products_by_city: topProductsByCity,
      top_cities: topCities,
      regions_insights: regionsInsights,
      average_order_value
average_items_per_order
top_product
top_payment_method
top_sales_channel
      top_customers: topCustomers,
      payment_methods_insights: paymentMethodsInsights,
      sales_channels_insights: salesChannelsInsights,
      recommendations,
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
