import ChartsQuickNav from "./ChartsQuickNav";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
import SaudiRegionsMap from "./SaudiRegionsMap";
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
      className="print-card"
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
  const params = await searchParams;
  const merchantId = params?.merchant_id;

  if (!merchantId) {
    redirect("/");
  }

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("merchant_id")
    .eq("merchant_id", String(merchantId))
    .maybeSingle();

  if (merchantError || !merchant) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>غير مصرح</h1>
        <p>هذا المتجر غير مربوط بتطبيق مستشار المتجر الذكي.</p>
      </main>
    );
  }

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
  const regionsInsights = salesInsights?.regions_insights || [];
  const topCustomers = salesInsights?.top_customers || [];
  const abandonedCartsSummary = salesInsights?.abandoned_carts_summary || {};
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

<div
  style={{
    background: "#fffbeb",
    border: "1px solid #fde68a",
    color: "#92400e",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.7",
  }}
>
  هذه البيانات من متجر تجريبي، وقد لا تعكس أداء متجر حقيقي. الهدف الحالي هو اختبار التحليلات وطريقة العرض.
</div>

<ChartsQuickNav />
    
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
 id="charts-summary"
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
<section
id="merchant-decisions"
 className="print-section"
  style={{
    background: "white",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    borderRight: "6px solid #f97316",
    marginBottom: "24px",
  }}
>
  <h2 style={{ margin: "0 0 18px", fontSize: "18px", color: "#0f172a" }}>
    ملخص قرارات التاجر
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "14px",
    }}
  >
    <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "14px", padding: "14px", minHeight: "110px" }}>
      <strong style={{ color: "#9a3412" }}>متوسط قيمة الطلب:</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        {summary.average_order_value || 0} ريال — كلما ارتفع متوسط الفاتورة زادت فرصة الربح من نفس عدد العملاء.
      </p>
    </div>

    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "14px", minHeight: "110px" }}>
      <strong style={{ color: "#1d4ed8" }}>إجمالي الطلبات:</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        {summary.total_orders || 0} طلب — هذا الرقم يساعد على قياس نشاط المتجر وحجم الطلب الفعلي.
      </p>
    </div>

    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "14px", minHeight: "110px" }}>
      <strong style={{ color: "#15803d" }}>أفضل مدينة طلبًا:</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        {topCities.length > 0 ? topCities[0].city || "غير محدد" : "غير متوفر"} — يمكن استهداف هذه المدينة بعروض خاصة أو حملات تسويقية محلية.
      </p>
    </div>

    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", minHeight: "110px" }}>
      <strong style={{ color: "#0f172a" }}>ملاحظة بيانات:</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        إذا كانت المنتجات أو الأقسام غير ظاهرة، فهذا يعني أن بيانات عناصر الطلب أو تصنيف المنتجات لم تكتمل بعد في المزامنة.
      </p>
    </div>
  </div>
</section>

 <section
 className="print-section"
  style={{
    background: "white",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    borderRight: "6px solid #22c55e",
    marginBottom: "24px",
  }}
>
  <h2 style={{ margin: "0 0 18px", fontSize: "18px", color: "#0f172a" }}>
    توصيات ذكية للتاجر
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: "14px",
    }}
  >
    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "14px" }}>
      <strong style={{ color: "#15803d" }}>استهدف أفضل مدينة</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        ركّز العروض أو الإعلانات على {topCities?.[0]?.city || "المدينة الأعلى طلبًا"} لأنها تظهر كأقوى منطقة طلب حاليًا.
      </p>
    </div>

    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "14px" }}>
      <strong style={{ color: "#1d4ed8" }}>ارفع متوسط السلة</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        جرّب عرضًا مثل: اشترِ بمبلغ أعلى واحصل على خصم أو شحن مجاني.
      </p>
    </div>

    <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "14px", padding: "14px" }}>
      <strong style={{ color: "#9a3412" }}>حسّن بيانات المنتجات</strong>
      <p style={{ margin: "8px 0 0", color: "#334155" }}>
        بيانات المنتجات والأقسام غير مكتملة؛ تحسينها سيرفع دقة التحليل والتوصيات.
      </p>
    </div>
  </div>
</section>

<div
id="regions-map"
  className="print-section"
  style={{
    width: "100%",
    marginBottom: "24px",
  }}
>
  <SaudiRegionsMap regionsInsights={regionsInsights} />
</div>
          
<section
id="abandoned-carts"
 className="print-section"
  style={{
    background: "white",
    padding: "22px",
    borderRadius: "22px",
    boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    borderRight: "6px solid #ef4444",
    marginBottom: "24px",
  }}
>
  <h2 style={{ margin: "0 0 18px", fontSize: "18px", color: "#0f172a" }}>
    السلات المتروكة
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(160px, 1fr))",
      gap: "14px",
      marginBottom: "16px",
    }}
  >
<div id="data-quality">
  <ChartBox title="مؤشرات جودة البيانات" accent="#6366f1">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "14px",
      }}
    >
      <div
        style={{
          background: topProducts.length > 0 ? "#f0fdf4" : "#fef2f2",
          border: topProducts.length > 0
            ? "1px solid #bbf7d0"
            : "1px solid #fecaca",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "800",
            color: topProducts.length > 0 ? "#166534" : "#991b1b",
          }}
        >
          بيانات المنتجات
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "22px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {topProducts.length > 0 ? "مكتملة" : "ناقصة"}
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          {topProducts.length > 0
            ? "يمكن تحليل المنتجات الأعلى مبيعًا."
            : "لا يمكن تحديد المنتجات الأعلى مبيعًا حتى تظهر عناصر الطلبات."}
        </p>
      </div>

      <div
        style={{
          background: topCategories.length > 0 ? "#f0fdf4" : "#fef2f2",
          border: topCategories.length > 0
            ? "1px solid #bbf7d0"
            : "1px solid #fecaca",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "800",
            color: topCategories.length > 0 ? "#166534" : "#991b1b",
          }}
        >
          بيانات الأقسام
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "22px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {topCategories.length > 0 ? "مكتملة" : "ناقصة"}
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          {topCategories.length > 0
            ? "يمكن تحليل الأقسام الأعلى طلبًا."
            : "لا يمكن تحليل أداء الأقسام حتى ترتبط المنتجات بتصنيفاتها."}
        </p>
      </div>

      <div
        style={{
          background: topCities.length > 0 ? "#f0fdf4" : "#fef2f2",
          border: topCities.length > 0
            ? "1px solid #bbf7d0"
            : "1px solid #fecaca",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "800",
            color: topCities.length > 0 ? "#166534" : "#991b1b",
          }}
        >
          بيانات المدن
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "22px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {topCities.length > 0 ? "مكتملة" : "ناقصة"}
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          {topCities.length > 0
            ? "يمكن معرفة المدن الأعلى طلبًا."
            : "لا توجد بيانات مدن كافية لتحليل التوزيع الجغرافي."}
        </p>
      </div>

      <div
        style={{
          background: topCustomers.length > 0 ? "#f0fdf4" : "#fef2f2",
          border: topCustomers.length > 0
            ? "1px solid #bbf7d0"
            : "1px solid #fecaca",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "800",
            color: topCustomers.length > 0 ? "#166534" : "#991b1b",
          }}
        >
          بيانات العملاء
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "22px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {topCustomers.length > 0 ? "مكتملة" : "ناقصة"}
        </div>

        <p
          style={{
            margin: "8px 0 0",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          {topCustomers.length > 0
            ? "يمكن معرفة العملاء الأعلى قيمة."
            : "لا توجد بيانات عملاء كافية للتحليل."}
        </p>
      </div>
    </div>

    <div
      style={{
        marginTop: "16px",
        background: "#eef2ff",
        border: "1px solid #c7d2fe",
        borderRadius: "16px",
        padding: "16px",
        color: "#312e81",
        lineHeight: "1.9",
        fontSize: "14px",
      }}
    >
      <strong>قراءة جودة البيانات:</strong>{" "}
      كلما اكتملت بيانات المنتجات، الأقسام، العملاء، المدن، طرق الدفع،
      والسلات المتروكة؛ أصبحت التوصيات أدق وأكثر فائدة للتاجر.
    </div>
  </ChartBox>
</div>

<div id="regions-analysis">
  <ChartBox title="تحليل المناطق الإدارية" accent="#14b8a6">
    {regionsInsights.length > 0 ? (
      <div style={{ display: "grid", gap: "12px" }}>
        {regionsInsights.map((region, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 0.8fr 1fr 1.2fr",
              gap: "12px",
              alignItems: "center",
              background: index === 0 ? "#ecfeff" : "#f8fafc",
              border:
                index === 0
                  ? "1px solid #67e8f9"
                  : "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "14px",
            }}
          >
            <div>
              <strong style={{ color: "#0f172a" }}>
                {index === 0 ? "🏆 " : ""}
                {region.region || "غير محدد"}
              </strong>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                المدن: {(region.cities || []).join("، ") || "غير محدد"}
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                الطلبات
              </div>
              <strong>{region.total_orders || 0}</strong>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                الإيرادات
              </div>
              <strong>{region.total_revenue || 0} ريال</strong>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#64748b", fontSize: "12px" }}>
                متوسط الطلب
              </div>

              <strong>
                {region.total_orders > 0
                  ? Math.round(
                      (region.total_revenue || 0) /
                        region.total_orders
                    )
                  : 0}{" "}
                ريال
              </strong>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ color: "#64748b", lineHeight: "1.8" }}>
        لا توجد بيانات مناطق كافية حتى الآن.
      </div>
    )}
  </ChartBox>
</div>
    <div id="visual-charts">
<ChartsClient
  summary={summary}
  topCities={topCities}
  paymentMethods={salesInsights?.payment_methods_insights || []}
  salesChannels={salesInsights?.sales_channels_insights || []}
/>
  </div>
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
<div style={{ display: "grid", gap: "12px" }}>
  {topCustomers.slice(0, 5).map((item, index) => {
    const totalRevenue = Number(item.total_revenue || 0);
    const totalOrders = Number(item.total_orders || 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
      <div
        key={index}
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 0.8fr 1fr 1fr",
          gap: "12px",
          alignItems: "center",
          background: index === 0 ? "#eff6ff" : "#f8fafc",
          border: index === 0 ? "1px solid #93c5fd" : "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "12px 14px",
        }}
      >
        <div>
          <div style={{ fontWeight: "800", color: "#0f172a" }}>
            {index === 0 ? "🏆 " : ""}
            {item.name || "عميل غير محدد"}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            العميل رقم {index + 1}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#64748b" }}>الطلبات</div>
          <strong style={{ color: "#0f172a" }}>{totalOrders}</strong>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#64748b" }}>إجمالي الشراء</div>
          <strong style={{ color: "#16a34a" }}>
            {totalRevenue.toLocaleString("ar-SA")} ريال
          </strong>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#64748b" }}>متوسط الفاتورة</div>
          <strong style={{ color: "#2563eb" }}>
            {Math.round(avgOrder).toLocaleString("ar-SA")} ريال
          </strong>
        </div>
      </div>
    );
  })}
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
    </main>
  );
}
