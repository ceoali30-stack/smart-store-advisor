import ChartsClient from "./ChartsClient";
import PrintButton from "../dashboard/PrintButton";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function BarItem({ label, value, max }) {
 const numericValue = Number(String(value || 0).replace(/[^\d.]/g, ""));
const percent = max > 0 ? Math.min(100, Math.round((numericValue / max) * 100)) : 0;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>

      <div
        style={{
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#111827",
          }}
        />
      </div>
    </div>
  );
}

function ChartBox({ title, children, accent = "#2563eb" }) {
  return (
    <section
      style={{
        position: "relative",
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "6px",
          height: "100%",
          background: accent,
        }}
      />

      <h2
        style={{
          margin: "0 0 14px",
          fontSize: "15px",
          fontWeight: "800",
          color: "#64748b",
        }}
      >
        {title}
      </h2>

     <div
  style={{
    color: "#0f172a",
    lineHeight: "1.6",
  }}
>
  {children}
</div>
    </section>
  );
}

export default async function ChartsPage({ searchParams }) {
  const merchantId = searchParams?.merchant_id || "210819854";
  const baseUrl = "https://smart-store-advisor.vercel.app";

  let salesInsights = null;

  try {
    const res = await fetch(
      `${baseUrl}/api/sales/insights?merchant_id=${merchantId}`,
      { cache: "no-store" }
    );

    salesInsights = await res.json();
  } catch (error) {
    salesInsights = null;
  }

  const summary = salesInsights?.summary || {};
  const topProducts = salesInsights?.top_products || [];
  const topCategories = salesInsights?.top_categories || [];
  const topCities = salesInsights?.top_cities || [];
  const topCustomers = salesInsights?.top_customers || [];
const recommendations = salesInsights?.recommendations || [];
const topCity = salesInsights?.top_cities?.[0];
const topPaymentMethod = salesInsights?.payment_methods_insights?.[0];
const topSalesChannel = salesInsights?.sales_channels_insights?.[0];
  const maxProductValue = Math.max(
    ...topProducts.map((item) => Number(item.total_quantity || item.quantity || 0)),
    1
  );

  const maxCategoryValue = Math.max(
    ...topCategories.map((item) => Number(item.total_quantity || item.quantity || 0)),
    1
  );
const maxCustomerValue = Math.max(
  ...topCustomers.map((item) => Number(item.total_revenue || 0)),
  1
);
  
 return (
  <main
    style={{
      direction: "rtl",
      textAlign: "right",
      padding: "28px",
      fontFamily: "Arial, sans-serif",
      background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      minHeight: "100vh",
    }}
  >
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
         <div>
  <p
    style={{
      margin: "0 0 8px",
      color: "#2563eb",
      fontWeight: "800",
      fontSize: "14px",
    }}
  >
    Smart Store Advisor
  </p>

  <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "900", color: "#0f172a" }}>
    لوحة الرسوم والتحليلات
  </h1>

  <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: "15px" }}>
    مؤشرات ورسوم تساعد التاجر على فهم المبيعات واتخاذ قرارات أسرع.
  </p>
</div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href={`/dashboard?merchant_id=${merchantId}`}
            style={{
              background: "#111827",
              color: "white",
              padding: "10px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            العودة للوحة التحكم
          </a>

          <PrintButton />
        </div>
      </div>

      <div
        style={{
          display: "grid",
         gridTemplateColumns: "repeat(2, minmax(320px, 1fr))",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
       <ChartBox title="إجمالي الطلبات" accent="#2563eb">
 <strong style={{ fontSize: "30px", fontWeight: "900" }}>
  {summary.total_orders || 0}
</strong>
</ChartBox>

<ChartBox title="إجمالي الإيرادات" accent="#f97316">
  <strong style={{ fontSize: "30px", fontWeight: "900" }}>
  {summary.total_revenue || 0} ريال
</strong>
</ChartBox>

<ChartBox title="متوسط قيمة الطلب" accent="#22c55e">
 <strong style={{ fontSize: "30px", fontWeight: "900" }}>
  {summary.average_order_value || 0} ريال
</strong>
</ChartBox>

<ChartBox title="متوسط المنتجات بالفاتورة" accent="#a855f7">
 <strong style={{ fontSize: "30px", fontWeight: "900" }}>
  {Number(summary.average_items_per_order || 0) > 0
    ? summary.average_items_per_order
    : "غير متوفر"}
</strong>
</ChartBox>
      </div>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  }}
>
  <div
    style={{
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      borderRight: "6px solid #3b82f6",
    }}
  >
    <p style={{ color: "#64748b", marginBottom: "10px" }}>
      أفضل مدينة مبيعًا
    </p>

    <h2 style={{ margin: 0, color: "#0f172a" }}>
      {topCity?.city || "غير متوفر"}
    </h2>

    <p style={{ color: "#94a3b8", marginTop: "8px" }}>
      {topCity?.total_orders || 0} طلب
    </p>
  </div>

  <div
    style={{
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      borderRight: "6px solid #22c55e",
    }}
  >
    <p style={{ color: "#64748b", marginBottom: "10px" }}>
      أكثر طريقة دفع استخدامًا
    </p>

    <h2 style={{ margin: 0, color: "#0f172a" }}>
      {topPaymentMethod?.name || "غير محدد"}
    </h2>

    <p style={{ color: "#94a3b8", marginTop: "8px" }}>
      {topPaymentMethod?.orders_count || 0} طلب
    </p>
  </div>

  <div
    style={{
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      borderRight: "6px solid #a855f7",
    }}
  >
    <p style={{ color: "#64748b", marginBottom: "10px" }}>
      أفضل قناة بيع
    </p>

    <h2 style={{ margin: 0, color: "#0f172a" }}>
      {topSalesChannel?.name || "غير محدد"}
    </h2>

    <p style={{ color: "#94a3b8", marginTop: "8px" }}>
      {topSalesChannel?.orders_count || 0} طلب
    </p>
  </div>

  <div
    style={{
      background: "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      borderRight: "6px solid #f97316",
    }}
  >
    <p style={{ color: "#64748b", marginBottom: "10px" }}>
      تنبيه ذكي
    </p>

    <h2 style={{ margin: 0, color: "#0f172a", fontSize: "18px" }}>
      {recommendations?.[0]?.title || "لا توجد تنبيهات"}
    </h2>

    <p style={{ color: "#94a3b8", marginTop: "8px" }}>
      {recommendations?.[0]?.message || ""}
    </p>
  </div>
</div>
  <ChartBox title="ملخص قرارات التاجر" accent="#f97316">
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
      gap: "14px",
      color: "#334155",
      lineHeight: "1.8",
      fontSize: "15px",
    }}
  >
    <div style={{ marginBottom: "24px" }} />
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "14px",
        padding: "12px",
      }}
    >
      <strong style={{ color: "#9a3412" }}>متوسط قيمة الطلب:</strong>{" "}
      {summary.average_order_value || 0} ريال
      <br />
      <span>
        كلما ارتفع متوسط الفاتورة، زادت قدرة المتجر على تحقيق ربح أعلى من نفس عدد العملاء.
      </span>
    </div>

    <div
      style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "14px",
        padding: "12px",
      }}
    >
      <strong style={{ color: "#1d4ed8" }}>إجمالي الطلبات:</strong>{" "}
      {summary.total_orders || 0} طلب
      <br />
      <span>
        هذا الرقم يساعد التاجر على قياس نشاط المتجر وحجم الطلب الفعلي.
      </span>
    </div>

    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "14px",
        padding: "12px",
      }}
    >
      <strong style={{ color: "#15803d" }}>أفضل مدينة طلبًا:</strong>{" "}
      {topCities.length > 0 ? topCities[0].city || "غير محدد" : "غير متوفر"}
      <br />
      <span>
        يمكن استهداف هذه المدينة بعروض خاصة أو حملات تسويقية محلية.
      </span>
    </div>

    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "12px",
      }}
    >
      <strong style={{ color: "#0f172a" }}>ملاحظة بيانات:</strong>{" "}
      إذا كانت المنتجات أو الأقسام غير ظاهرة، فهذا يعني أن بيانات عناصر الطلب أو تصنيف المنتجات لم تكتمل بعد في المزامنة.
    </div>
  </div>
</ChartBox>

<ChartsClient
  summary={summary}
  topCities={topCities}
  paymentMethods={salesInsights?.payment_methods_insights || []}
  salesChannels={salesInsights?.sales_channels_insights || []}
/>
      <div
        style={{
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(360px, 1fr))",
  gap: "22px",
  alignItems: "start",
  marginTop: "26px",
}}
      >
        
        <ChartBox title="أكثر المنتجات مبيعًا">
          {topProducts.length > 0 ? (
            topProducts.slice(0, 5).map((item, index) => (
              <BarItem
                key={index}
                label={item.product_name || item.name || "منتج غير معروف"}
                value={item.total_quantity || item.quantity || 0}
                max={maxProductValue}
              />
            ))
          ) : (
           <div style={{ color: "#64748b", lineHeight: "1.8", fontSize: "15px" }}>
  <strong style={{ color: "#0f172a" }}>لا توجد بيانات منتجات كافية حتى الآن.</strong>
  <p style={{ margin: "10px 0 0" }}>
    عند توفر تفاصيل عناصر الطلبات، سيظهر هنا أكثر المنتجات مبيعًا لمساعدة التاجر على زيادة المخزون والترويج للمنتجات الأقوى.
  </p>
</div>
          )}
        </ChartBox>
<ChartBox title="أكثر الأقسام مبيعًا">
  {topCategories.length > 0 ? (
    topCategories.slice(0, 5).map((item, index) => (
      <BarItem
        key={index}
        label={item.category_name || item.name || "قسم غير معروف"}
        value={item.total_quantity || item.quantity || 0}
        max={maxCategoryValue}
      />
    ))
  ) : (
    <div style={{ color: "#64748b", lineHeight: "1.8", fontSize: "15px" }}>
      <strong style={{ color: "#0f172a" }}>
        لا توجد بيانات أقسام كافية حتى الآن.
      </strong>
      <p style={{ margin: "10px 0 0" }}>
        عند توفر تصنيف المنتجات داخل الطلبات، سيظهر هنا أداء الأقسام لمساعدة التاجر على معرفة الأقسام الأعلى طلبًا.
      </p>
    </div>
  )}
</ChartBox>

<ChartBox title="أكثر 5 عملاء شراءً" accent="#0ea5e9">
  {topCustomers.length > 0 ? (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ padding: "12px", textAlign: "right" }}>العميل</th>
            <th style={{ padding: "12px", textAlign: "right" }}>عدد الطلبات</th>
            <th style={{ padding: "12px", textAlign: "right" }}>إجمالي الشراء</th>
            <th style={{ padding: "12px", textAlign: "right" }}>متوسط الفاتورة</th>
          </tr>
        </thead>

        <tbody>
          {topCustomers.slice(0, 5).map((customer, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px", fontWeight: "700" }}>
                {customer.name || "عميل غير محدد"}
              </td>
              <td style={{ padding: "12px" }}>
                {customer.total_orders || 0}
              </td>
              <td style={{ padding: "12px" }}>
                {customer.total_revenue || 0} ريال
              </td>
              <td style={{ padding: "12px" }}>
                {customer.average_order_value || 0} ريال
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div style={{ color: "#64748b", lineHeight: "1.8", fontSize: "15px" }}>
      <strong style={{ color: "#0f172a" }}>
        لا توجد بيانات عملاء كافية حتى الآن.
      </strong>
      <p style={{ margin: "10px 0 0" }}>
        عند توفر بيانات العملاء، سيظهر هنا أكثر العملاء تكرارًا وشراءً لمساعدة التاجر على بناء عروض ولاء واستهداف العملاء الأعلى قيمة.
      </p>
    </div>
  )}
</ChartBox>
      </div>
    </div>
    </main>
  );
}
