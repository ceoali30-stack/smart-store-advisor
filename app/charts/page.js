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

function ChartBox({ title, children }) {
  return (
    <section
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        border: "1px solid #eef2f7",
      }}
    >
      <h2 style={{ margin: "0 0 18px", fontSize: "22px" }}>{title}</h2>
      {children}
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

  const maxProductValue = Math.max(
    ...topProducts.map((item) => Number(item.total_quantity || item.quantity || 0)),
    1
  );

  const maxCategoryValue = Math.max(
    ...topCategories.map((item) => Number(item.total_quantity || item.quantity || 0)),
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
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        <ChartBox title="إجمالي الطلبات">
          <strong style={{ fontSize: "30px" }}>{summary.total_orders || 0}</strong>
        </ChartBox>

        <ChartBox title="إجمالي الإيرادات">
          <strong style={{ fontSize: "30px" }}>{summary.total_revenue || 0} ريال</strong>
        </ChartBox>

        <ChartBox title="متوسط قيمة الطلب">
          <strong style={{ fontSize: "30px" }}>
            {summary.average_order_value || 0} ريال
          </strong>
        </ChartBox>

        <ChartBox title="متوسط المنتجات بالفاتورة">
          <strong style={{ fontSize: "30px" }}>
            {Number(summary.average_items_per_order || 0) > 0
              ? summary.average_items_per_order
              : "غير متوفر"}
          </strong>
        </ChartBox>
      </div>
<ChartsClient
  summary={summary}
  topCities={topCities}
  paymentMethods={salesInsights?.payment_methods_insights || []}
  salesChannels={salesInsights?.sales_channels_insights || []}
/>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(320px, 1fr))",
          gap: "18px",
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
            <p style={{ color: "#64748b" }}>لا توجد بيانات كافية للمنتجات.</p>
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
            <p style={{ color: "#64748b" }}>لا توجد بيانات كافية للأقسام.</p>
          )}
        </ChartBox>
      </div>
    </main>
  );
}
