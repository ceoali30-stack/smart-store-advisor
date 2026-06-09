import AbandonedCartsSection from "./components/AbandonedCartsSection";
import SmartRecommendationsSection from "./components/SmartRecommendationsSection";
import MerchantDecisionsSection from "./components/MerchantDecisionsSection";
import ExecutiveInsightCards from "./components/ExecutiveInsightCards";
import ChartsSummaryCards from "./components/ChartsSummaryCards";
import ChartsHeader from "./components/ChartsHeader";
import PrintButton from "../dashboard/PrintButton";
import ChartBox from "./components/ChartBox";
import BarItem from "./components/BarItem";
import TopCustomersChart from "./TopCustomersChart";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
import SaudiRegionsMap from "./SaudiRegionsMap";
import ChartsClient from "./ChartsClient";
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
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
<ExecutiveInsightCards
  topCity={topCity}
  topPaymentMethod={topPaymentMethod}
  topSalesChannel={topSalesChannel}
  recommendations={recommendations}
/>
<MerchantDecisionsSection
  summary={summary}
  topCities={topCities}
/>
<SmartRecommendationsSection
  topCities={topCities}
/>
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
<AbandonedCartsSection
  abandonedCartsSummary={abandonedCartsSummary}
/>
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
        <strong style={{ color: "#0f172a" }}>
          لا توجد بيانات منتجات كافية حتى الآن.
        </strong>
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
<TopCustomersChart
  topCustomers={topCustomers}
  ChartBox={ChartBox}
/>
</div>
</div>
</main>
  );
}
