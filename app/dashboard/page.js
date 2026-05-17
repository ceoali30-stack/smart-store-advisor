import SyncOrdersButton from "./SyncOrdersButton";
export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const stockFilter = params?.stock || "all";
  const merchantId = params?.merchant_id || "210819854";

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://smart-store-advisor.vercel.app";

  let data = null;
  let error = null;
let syncStatus = null;
  try {
    const res = await fetch(`${baseUrl}/api/dashboard?merchant_id=${merchantId}`, {
      cache: "no-store",
    });

    data = await res.json();
try {
  const syncRes = await fetch(
    `${baseUrl}/api/sync/status?merchant_id=${merchantId}`,
    { cache: "no-store" }
  );

  syncStatus = await syncRes.json();
} catch (err) {
  syncStatus = null;
}
    if (!res.ok || data.success === false) {
      error = data.message || "Failed to load dashboard data";
    }
  } catch (err) {
    error = String(err);
  }

  if (error) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>Smart Store Advisor</h1>

        <MerchantLinks />

        <p style={{ color: "red", marginTop: "30px" }}>Error: {error}</p>
      </main>
    );
  }
let salesInsights = null;

try {
  const salesRes = await fetch(
    `${baseUrl}/api/sales/insights?merchant_id=${merchantId}`,
    { cache: "no-store" }
  );

  salesInsights = await salesRes.json();
} catch (err) {
  salesInsights = null;
}

const filteredLowStockProducts =
  stockFilter === "out"
    ? data.low_stock_products.filter(
        (product) => Number(product.quantity) === 0
      )
    : stockFilter === "low"
    ? data.low_stock_products.filter(
        (product) => Number(product.quantity) > 0
      )
    : data.low_stock_products;
  return (
    <main
      style={{
  direction: "rtl",
  textAlign: "right",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
        background: "#f6f7f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>لوحة مستشار المتجر الذكي</h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        تحليلات ذكية لمتاجر سلة.
      </p>

      <MerchantLinks />
<div
  style={{
    marginTop: "14px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  }}
>
  <SyncOrdersButton merchantId={merchantId} />

  <a
    href={`/dashboard?merchant_id=${merchantId}`}
    style={{
      background: "#0f172a",
      color: "white",
      padding: "10px 16px",
      borderRadius: "10px",
      textDecoration: "none",
      fontWeight: "700",
      fontSize: "14px",
      display: "inline-block",
    }}
  >
    تحديث لوحة التحكم
  </a>
</div>
   <div
  style={{
    marginTop: "10px",
    marginBottom: "24px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#334155",
    fontSize: "14px",
    display: "inline-block",
  }}
>
  آخر مزامنة للبيانات:{" "}
  <strong>
    {syncStatus?.last_sync
      ? new Date(syncStatus.last_sync).toLocaleString("ar-SA", {
          timeZone: "Asia/Riyadh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "لا توجد مزامنة بعد"}
  </strong>
</div>   
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <Card title="رقم التاجر" value={data.merchant_id} />
        <Card title="إجمالي المنتجات" value={data.total_products} />
        <Card title="متوسط السعر" value={`${data.average_price} ريال`} />
        <Card title="تنبيهات المخزون" value={data.low_stock_products_count} />
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        <InsightCard
          title="أعلى منتج سعرًا"
          name={data.highest_price_product?.name}
          price={data.highest_price_product?.price}
        />

        <InsightCard
          title="أقل منتج سعرًا"
          name={data.lowest_price_product?.name}
          price={data.lowest_price_product?.price}
        />
      </section>
          <section
  style={{
    marginTop: "28px",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  {salesInsights?.success && (
  <div
    style={{
      background: "white",
      padding: "18px",
      borderRadius: "14px",
      marginBottom: "18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}
  >
    {(() => {
  const outOfStockCount = data.low_stock_products.filter(
    (product) => Number(product.quantity) === 0
  ).length;

  const lowStockCount = data.low_stock_products.filter(
    (product) => Number(product.quantity) > 0
  ).length;

  const totalProducts = Number(data.total_products || 0);
  const stockRisk = totalProducts > 0
    ? ((outOfStockCount * 2 + lowStockCount) / totalProducts) * 100
    : 0;

  const averageOrderValue = Number(
    salesInsights?.summary?.average_order_value || 0
  );

  const score = Math.max(
    0,
    Math.round(
      100 -
        stockRisk -
        (averageOrderValue < 150 ? 10 : 0)
    )
  );

  const status =
    score >= 80
      ? "ممتاز"
      : score >= 60
      ? "جيد ويحتاج متابعة"
      : "يحتاج تحسين عاجل";

  return (
    <section
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        marginTop: "24px",
        marginBottom: "24px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        border: "1px solid #eef2f7",
      }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: "24px" }}>
        درجة صحة المتجر
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "18px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: score >= 80 ? "#ecfdf5" : score >= 60 ? "#fffbeb" : "#fef2f2",
            border:
              score >= 80
                ? "1px solid #bbf7d0"
                : score >= 60
                ? "1px solid #fde68a"
                : "1px solid #fecaca",
            borderRadius: "18px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "42px", fontWeight: "900" }}>
            {score}
          </div>
          <div style={{ color: "#64748b", fontWeight: "700" }}>
            من 100
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: "22px" }}>
            الحالة: {status}
          </h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: "1.8" }}>
            تم احتساب الدرجة بناءً على توفر المخزون، عدد المنتجات منخفضة المخزون،
            ومتوسط قيمة الطلب. كلما انخفضت المنتجات النافدة وارتفع متوسط الطلب
            تحسنت درجة المتجر.
          </p>
        </div>
      </div>
    </section>
  );
})()}
  {(() => {
  const outOfStockProducts = data.low_stock_products.filter(
    (product) => Number(product.quantity) === 0
  );

  const lowStockProducts = data.low_stock_products.filter(
    (product) => Number(product.quantity) > 0
  );

  const topProduct =
    salesInsights?.top_products?.[0]?.product_name || "غير متوفر";

  const hasOutOfStock = outOfStockProducts.length > 0;
  const hasLowStock = lowStockProducts.length > 0;
  const hasTopProduct = topProduct !== "غير متوفر";

  const priorities = [
    {
      number: "1",
      title: "إعادة توفير المنتجات النافدة فورًا",
      description: hasOutOfStock
        ? `يوجد ${outOfStockProducts.length} منتجات نافدة تحتاج إلى إعادة توفير مباشرة حتى لا تخسر طلبات محتملة.`
        : "لا توجد منتجات نافدة حاليًا، وهذا مؤشر جيد.",
      status: hasOutOfStock ? "عالية" : "مستقرة",
      background: hasOutOfStock ? "#fef2f2" : "#ecfdf5",
      border: hasOutOfStock ? "#fecaca" : "#bbf7d0",
      color: hasOutOfStock ? "#991b1b" : "#166534",
    },
    {
      number: "2",
      title: "مراجعة المنتجات منخفضة المخزون خلال 48 ساعة",
      description: hasLowStock
        ? `يوجد ${lowStockProducts.length} منتجات منخفضة المخزون. راجعها قبل نفادها وحدد الكميات المطلوبة لإعادة الطلب.`
        : "لا توجد منتجات منخفضة المخزون حاليًا.",
      status: hasLowStock ? "متوسطة" : "مستقرة",
      background: hasLowStock ? "#fffbeb" : "#ecfdf5",
      border: hasLowStock ? "#fde68a" : "#bbf7d0",
      color: hasLowStock ? "#92400e" : "#166534",
    },
    {
      number: "3",
      title: "التركيز على المنتج الأعلى مبيعًا",
      description: hasTopProduct
        ? `المنتج الأعلى مبيعًا حاليًا هو "${topProduct}". تأكد من توفره، واجعله ظاهرًا في واجهة المتجر أو ضمن العروض.`
        : "لا توجد بيانات كافية لتحديد المنتج الأعلى مبيعًا.",
      status: hasTopProduct ? "فرصة" : "بحاجة بيانات",
      background: "#eff6ff",
      border: "#bfdbfe",
      color: "#1d4ed8",
    },
    {
      number: "4",
      title: "تحسين أو تسويق المنتجات التي لا تتحرك",
      description:
        "راجع المنتجات التي لديها مخزون متوفر ولا تحقق مبيعات. قد تحتاج إلى تحسين الصور، تعديل السعر، أو إضافتها في عرض ترويجي.",
      status: "تحسين",
      background: "#f5f3ff",
      border: "#ddd6fe",
      color: "#6d28d9",
    },
  ];

  return (
    <section
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        marginTop: "24px",
        marginBottom: "24px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        border: "1px solid #eef2f7",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "800",
              color: "#111827",
            }}
          >
            أولويات اليوم
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            إجراءات عملية مقترحة بناءً على حالة المخزون والمبيعات الحالية.
          </p>
        </div>

        <span
          style={{
            background: "#0f172a",
            color: "white",
            padding: "8px 12px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          {priorities.length} أولويات
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
          gap: "14px",
        }}
      >
        {priorities.map((priority) => (
          <div
            key={priority.number}
            style={{
              background: priority.background,
              border: `1px solid ${priority.border}`,
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  color: priority.color,
                  border: `1px solid ${priority.border}`,
                }}
              >
                {priority.number}
              </div>

              <span
                style={{
                  color: priority.color,
                  fontSize: "13px",
                  fontWeight: "800",
                }}
              >
                {priority.status}
              </span>
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: priority.color,
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              {priority.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#334155",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              {priority.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
})()}
    <section
  style={{
    background: "white",
    padding: "22px",
    borderRadius: "18px",
    marginTop: "24px",
    marginBottom: "24px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    border: "1px solid #eef2f7",
  }}
>
  <h2
    style={{
      margin: "0 0 14px",
      fontSize: "24px",
      fontWeight: "800",
      color: "#111827",
    }}
  >
    الملخص التنفيذي الذكي
  </h2>

  <p
    style={{
      margin: "0 0 16px",
      fontSize: "16px",
      lineHeight: "1.9",
      color: "#374151",
    }}
  >
    حقق المتجر{" "}
    <strong>{salesInsights?.summary?.total_revenue || 0} ريال</strong>{" "}
    من خلال{" "}
    <strong>{salesInsights?.summary?.total_orders || 0} طلبات</strong>.
    متوسط قيمة الطلب هو{" "}
    <strong>{salesInsights?.summary?.average_order_value || 0} ريال</strong>.
    أفضل منتج مبيعًا هو{" "}
    <strong>
      {salesInsights?.top_products?.[0]?.product_name || "غير متوفر"}
    </strong>
    .
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: "14px",
      marginTop: "18px",
    }}
  >
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>
        منتجات نافدة
      </p>
      <h3 style={{ margin: "8px 0", color: "#7f1d1d", fontSize: "26px" }}>
        {data?.out_of_stock_count || 0}
      </h3>
      <p style={{ margin: 0, color: "#991b1b", fontSize: "13px" }}>
        تحتاج إلى إعادة توفير فورية.
      </p>
    </div>

    <div
      style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        منتجات منخفضة المخزون
      </p>
      <h3 style={{ margin: "8px 0", color: "#78350f", fontSize: "26px" }}>
        {data?.low_stock_count || 0}
      </h3>
      <p style={{ margin: 0, color: "#92400e", fontSize: "13px" }}>
        راجعها قبل نفادها من المتجر.
      </p>
    </div>

    <div
      style={{
        background: "#ecfdf5",
        border: "1px solid #bbf7d0",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>
        الإجراء المقترح
      </p>
      <h3 style={{ margin: "8px 0", color: "#14532d", fontSize: "20px" }}>
        ابدأ بالمخزون
      </h3>
      <p style={{ margin: 0, color: "#166534", fontSize: "13px" }}>
        أعد توفير المنتجات النافدة ثم راجع المنتجات منخفضة المخزون خلال 48 ساعة.
      </p>
    </div>
  </div>
</section>
    <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
      تحليلات المبيعات
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>إجمالي الطلبات</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.total_orders}
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>إجمالي الإرادات</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.total_revenue} ريال
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>متوسط قيمة الفاتورة</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.average_order_value} ريال
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>متوسط عدد المنتجات في الفاتورة</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.average_items_per_order}
        </h3>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: "14px",
        marginBottom: "18px",
      }}
    >
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر المنتجات مبيعًا</h3>
      {salesInsights.top_products.slice(0, 5).map((product, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {product.product_name} — {product.quantity_sold} مبيعات — {product.revenue} ريال
  </p>
))}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر الأقسام مبيعًا</h3>
        {salesInsights.top_categories.slice(0, 5).map((category, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {category.category_name} — {category.quantity_sold} مبيعات — {category.revenue} ريال
  </p>
))}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر المنتجات مبيعًا حسب المدينة</h3>
     {salesInsights.top_products_by_city.slice(0, 5).map((item, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {item.city} — {item.product_name} — {item.quantity_sold} مبيعات
  </p>
))}
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
        gap: "12px",
      }}
    >
      {salesInsights.recommendations.map((rec, index) => (
        <div
          key={index}
          style={{
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <p style={{ margin: 0, color: "#166534", fontSize: "13px" }}>
            {rec.title}
          </p>
          <h3 style={{ margin: "6px 0 8px", color: "#15803d" }}>
            التوصية
          </h3>
          <p style={{ margin: 0, color: "#14532d" }}>
            {rec.message}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
  <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
    منتجات منخفضة المخزون
  </h2>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  }}
>
  <a
    href={`?merchant_id=${merchantId}&stock=all`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "all" ? "#111827" : "#f3f4f6",
      color: stockFilter === "all" ? "white" : "#111827",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    الكل
  </a>

  <a
   href={`?merchant_id=${merchantId}&stock=out`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "out" ? "#dc2626" : "#fef2f2",
      color: stockFilter === "out" ? "white" : "#991b1b",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    نفد المخزون
  </a>

  <a
    href={`?merchant_id=${merchantId}&stock=low`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "low" ? "#d97706" : "#fffbeb",
      color: stockFilter === "low" ? "white" : "#92400e",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    مخزون منخفض
  </a>
</div>
 {filteredLowStockProducts && filteredLowStockProducts.length > 0 ? (
    <>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  }}
>
  <div
    style={{
      background: "#fef2f2",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #fecaca",
    }}
  >
    <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>
      نفد المخزون
    </p>
    <h3 style={{ margin: "8px 0 0", color: "#dc2626", fontSize: "26px" }}>
      {
        data.low_stock_products.filter(
          (product) => Number(product.quantity) === 0
        ).length
      }
    </h3>
  </div>

  <div
    style={{
      background: "#fffbeb",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #fde68a",
    }}
  >
    <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
      مخزون منخفض
    </p>
    <h3 style={{ margin: "8px 0 0", color: "#b45309", fontSize: "26px" }}>
      {
        data.low_stock_products.filter(
          (product) =>
            Number(product.quantity) > 0 && Number(product.quantity) <= 3
        ).length
      }
    </h3>
  </div>
</div>
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "15px",
        }}
      >
        <thead>
          <tr
  style={{
    background: "#e5e7eb",
    textAlign: "left",
    color: "#111827",
  }}
>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              رقم المنتج
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              اسم المنتج
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              السعر
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              الكمية
            </th>
         <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الحالة
</th>

<th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الإجراء المقترح
</th>
    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الأولوية
</th>
          </tr>
        </thead>

        <tbody>
          {filteredLowStockProducts.map((product) => (
           <tr
  key={product.id}
  style={{
    background:
      Number(product.quantity) === 0 ? "#fff7f7" : "#fffdf2",
  }}
>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.id}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.name || "-"}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.price ?? "-"} ريال
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  fontWeight: "700",
                  color: Number(product.quantity) === 0 ? "#dc2626" : "#b45309",
                }}
              >
                {product.quantity ?? "-"}
              </td>
                <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "700",
    color: Number(product.quantity) === 0 ? "#dc2626" : "#b45309",
  }}
>
  {Number(product.quantity) === 0 ? "نفد المخزون" : "مخزون منخفض"}
</td>
 <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "600",
    color: Number(product.quantity) === 0 ? "#991b1b" : "#92400e",
  }}
>
  {Number(product.quantity) === 0
    ? "إعادة التوريد فورًا"
    : "المراجعة وإعادة الطلب قريبًا"}
</td>
  <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "700",
    color: Number(product.quantity) === 0 ? "#dc2626" : "#d97706",
  }}
>
  {Number(product.quantity) === 0 ? "عالية" : "متوسطة"}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</>
  ) : (
    <p style={{ margin: 0, color: "#666" }}>
      No low stock products found.
    </p>
  )}
</section>
    <section
  style={{
    marginTop: "28px",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
    توصيات ذكية
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: "16px",
    }}
  >
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>
        تنبيه مخزون حرج
      </p>
      <h3 style={{ margin: "8px 0", color: "#dc2626", fontSize: "24px" }}>
        {data.low_stock_products.filter(
          (product) => Number(product.quantity) === 0
        ).length}
      </h3>
      <p style={{ margin: 0, color: "#7f1d1d", fontSize: "14px" }}>
      منتجات نفد مخزونها بالكامل ويجب إعادة توريدها فورًا.
      </p>
    </div>

    <div
      style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        إعادة الطلب قريبًا
      </p>
      <h3 style={{ margin: "8px 0", color: "#d97706", fontSize: "24px" }}>
        {data.low_stock_products.filter(
          (product) => Number(product.quantity) > 0
        ).length}
      </h3>
      <p style={{ margin: 0, color: "#78350f", fontSize: "14px" }}>
        منتجات أوشكت على النفاد ويجب مراجعتها قبل نفادها.
      </p>
    </div>

    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>
        الإجراء المقترح
      </p>
      <h3 style={{ margin: "8px 0", color: "#15803d", fontSize: "24px" }}>
        مراجعة اليوم
      </h3>
      <p style={{ margin: 0, color: "#14532d", fontSize: "14px" }}>
       ابدأ بالمنتجات عالية الأولوية، ثم راجع المنتجات متوسطة الأولوية خلال 24 إلى 48 ساعة.
      </p>
    </div>
  </div>
</section>
   
    </main>
  );
}

function MerchantLinks() {
  const merchants = ["210819854", "905561820", "174453729"];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {merchants.map((id) => (
        <a
          key={id}
          href={`/dashboard?merchant_id=${id}`}
          style={{
            background: "#111827",
            color: "white",
            padding: "10px 14px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          متجر {id}
        </a>
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "10px 0 0", fontSize: "26px" }}>{value}</h2>
    </div>
  );
}

function InsightCard({ title, name, price }) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "12px 0 8px", fontSize: "24px" }}>{name || "-"}</h2>
      <p style={{ margin: 0, fontSize: "18px" }}>{price ?? "-"} ريال</p>
    </div>
  );
}
