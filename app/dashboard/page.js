import NavBar from "./NavBar";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
import PrintButton from "./PrintButton";
import SyncOrdersButton from "./SyncOrdersButton";
export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const stockFilter = params?.stock || "all";
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
      <main
  style={{
    direction: "rtl",
    textAlign: "right",
    padding: "24px",
    maxWidth: "1600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    background: "#f6f7f9",
    minHeight: "100vh",
  }}
>


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
const stagnantProducts = (data.low_stock_products || [])
  .filter((product) => Number(product.quantity || 0) > 0)
  .slice(0, 10);

const profitableProducts = (data.low_stock_products || [])
  .map((product) => {
    const price = Number(product.price || 0);
    const costPrice = Number(product.cost_price || product.raw_data?.cost_price || 0);
    const profit = price - costPrice;
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0;

    const marketingSuggestions = [
  {
    title: "حملة للمنتج الأعلى مبيعًا",
    action: "ضع المنتج الأعلى مبيعًا في واجهة المتجر أو الصفحة الرئيسية.",
    reason: "المنتج الذي يبيع أكثر يستحق ظهورًا أكبر لزيادة التحويلات.",
    color: "#ecfdf5",
    border: "#bbf7d0",
    titleColor: "#166534",
  },
  {
    title: "تنشيط المنتجات الراكدة",
    action: "أنشئ عرضًا محدودًا أو خصمًا بسيطًا على المنتجات التي لا تتحرك.",
    reason: "المنتجات الراكدة تستهلك مساحة ومخزونًا دون مساهمة فعلية في الإيرادات.",
    color: "#fff7ed",
    border: "#fed7aa",
    titleColor: "#9a3412",
  },
  {
    title: "استعادة المنتجات النافدة",
    action: "أعد توريد المنتجات النافدة أولًا قبل إطلاق حملات تسويقية جديدة.",
    reason: "تسويق منتج غير متوفر يؤدي إلى خسارة طلبات وفرص بيع مباشرة.",
    color: "#fef2f2",
    border: "#fecaca",
    titleColor: "#991b1b",
  },
  {
    title: "رفع متوسط قيمة الطلب",
    action: "استخدم عروض مثل: اشتر منتجين واحصل على خصم أو شحن مجاني عند مبلغ معين.",
    reason: "رفع متوسط قيمة الطلب يزيد الإيرادات دون الحاجة إلى زيادة عدد الزوار.",
    color: "#eff6ff",
    border: "#bfdbfe",
    titleColor: "#1d4ed8",
  },
];
    return {
      ...product,
      price,
      costPrice,
      profit,
      margin,
    };
  })
  .filter((product) => product.costPrice > 0 && product.profit > 0)
  .sort((a, b) => b.profit - a.profit)
  .slice(0, 10);
const lowStockCount = Number(data.low_stock_products?.length || 0);
const stagnantCount = Number(stagnantProducts?.length || 0);
const totalProductsCount = Number(data.products?.length || 0);

const totalOrdersCount = Number(salesInsights?.summary?.total_orders || 0);
const totalRevenueValue = Number(salesInsights?.summary?.total_revenue || 0);
const averageOrderValue = Number(salesInsights?.summary?.average_order_value || 0);

const productsWithPrice = Number(
  data.products?.filter((product) => Number(product.price || 0) > 0).length || 0
);

const productsWithCost = Number(
  data.products?.filter((product) => Number(product.cost_price || 0) > 0).length || 0
);

const stockHealthScore =
  totalProductsCount > 0
    ? Math.max(0, 25 - Math.min(25, (lowStockCount / totalProductsCount) * 25))
    : 0;

const stagnantHealthScore =
  totalProductsCount > 0
    ? Math.max(0, 20 - Math.min(20, (stagnantCount / totalProductsCount) * 20))
    : 0;

const salesHealthScore =
  totalOrdersCount > 0 && totalRevenueValue > 0 ? 20 : 0;

const averageOrderHealthScore =
  averageOrderValue >= 100 ? 15 : averageOrderValue >= 50 ? 10 : averageOrderValue > 0 ? 5 : 0;

const productDataHealthScore =
  totalProductsCount > 0
    ? Math.round(((productsWithPrice + productsWithCost) / (totalProductsCount * 2)) * 20)
    : 0;

const storeHealthPercentage = Math.round(
  stockHealthScore +
    stagnantHealthScore +
    salesHealthScore +
    averageOrderHealthScore +
    productDataHealthScore
);

const storeHealthLabel =
  storeHealthPercentage >= 85
    ? "ممتاز"
    : storeHealthPercentage >= 70
    ? "جيد"
    : storeHealthPercentage >= 50
    ? "متوسط"
    : "يحتاج تحسين";

const storeHealthMessage =
  storeHealthPercentage >= 85
    ? "المتجر في حالة قوية، ركّز على التوسع وزيادة الحملات."
    : storeHealthPercentage >= 70
    ? "المتجر جيد، لكن توجد فرص لتحسين المخزون والمبيعات."
    : storeHealthPercentage >= 50
    ? "المتجر متوسط ويحتاج متابعة المنتجات الراكدة والمخزون."
    : "المتجر يحتاج تدخل واضح في المخزون والمبيعات وبيانات المنتجات.";

const marketingSuggestions = [];

if (data?.sales_insights?.top_products?.length > 0) {
  marketingSuggestions.push({
    title: "روّج للمنتج الأعلى مبيعًا",
    message: `المنتج "${data.sales_insights.top_products[0].name}" يحقق مبيعات جيدة. اجعله ظاهرًا في الصفحة الرئيسية أو أضفه إلى حملة قصيرة.`
  });
}

if (data?.low_stock_products?.length > 0) {
  marketingSuggestions.push({
    title: "لا تروّج لمنتجات منخفضة المخزون",
    message: "تجنب إطلاق حملات على منتجات مخزونها منخفض حتى لا تزيد الطلبات على منتجات قد تنفد سريعًا."
  });
}

if (data?.stagnant_products?.length > 0) {
  marketingSuggestions.push({
    title: "حملة تصريف للمنتجات الراكدة",
    message: "أنشئ عرضًا محدودًا أو حسّن صور ووصف المنتجات الراكدة لرفع فرص ظهورها وبيعها."
  });
}

if (data?.sales_insights?.summary?.average_order_value > 0) {
  marketingSuggestions.push({
    title: "ارفع متوسط قيمة الطلب",
    message: `متوسط قيمة الطلب هو ${data.sales_insights.summary.average_order_value} ريال. جرّب عروض مثل: اشترِ منتجين واحصل على خصم أو شحن مجاني فوق مبلغ معين.`
  });
}
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
          <div
  style={{
    background: "#0f172a",
    color: "white",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
    borderRadius: "16px",
  }}
>
  <div>
    <strong style={{ fontSize: "18px" }}>
      مستشار المتجر الذكي
    </strong>

    <p
      style={{
        margin: "6px 0 0",
        color: "#cbd5e1",
        fontSize: "13px",
      }}
    >
      لوحة تحليلات ذكية لمتاجر سلة
    </p>
  </div>

  <NavBar merchantId={merchantId} />
</div>
      <h1 style={{ marginBottom: "10px" }}>لوحة مستشار المتجر الذكي</h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        تحليلات ذكية لمتاجر سلة.
      </p>

          <section
  style={{
    display: "grid",
gridTemplateColumns: "320px 1fr",
    minHeight: "320px",
padding: "32px",
    justifyContent: "space-between",
gap: "28px",
alignItems: "center",
    marginBottom: "20px",
    background:
      storeHealthPercentage >= 85
        ? "#ecfdf5"
        : storeHealthPercentage >= 70
        ? "#eff6ff"
        : storeHealthPercentage >= 50
        ? "#fffbeb"
        : "#fef2f2",
    border:
      storeHealthPercentage >= 85
        ? "1px solid #bbf7d0"
        : storeHealthPercentage >= 70
        ? "1px solid #bfdbfe"
        : storeHealthPercentage >= 50
        ? "1px solid #fde68a"
        : "1px solid #fecaca",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
    <div>
      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
        مؤشر عام
      </p>

      <h2 style={{ margin: "8px 0", fontSize: "26px" }}>
        درجة صحة المتجر
      </h2>

      <p style={{ margin: 0, color: "#475569", fontSize: "14px", lineHeight: "1.8" }}>
        {storeHealthMessage}
      </p>
    </div>
<div>
    <div style={{ textAlign: "center" }}>
        </div>
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
         border:
  storeHealthPercentage >= 85
    ? "8px solid #22c55e"
    : storeHealthPercentage >= 70
    ? "8px solid #3b82f6"
    : storeHealthPercentage >= 50
    ? "8px solid #f59e0b"
    : "8px solid #ef4444",
          boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
        }}
      >
        <strong style={{ fontSize: "28px" }}>
          {storeHealthPercentage}%
        </strong>
      </div>

      <p style={{ margin: "10px 0 0", fontWeight: "700" }}>
        {storeHealthLabel}
<div
  style={{
    marginTop: "12px",
    width: "160px",
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  }}
>
  <div
    style={{
      width: `${storeHealthPercentage}%`,
      height: "100%",
      background:
        storeHealthPercentage >= 85
          ? "#22c55e"
          : storeHealthPercentage >= 70
          ? "#3b82f6"
          : storeHealthPercentage >= 50
          ? "#f59e0b"
          : "#ef4444",
    }}
  />
</div>
      </p>
<div
  style={{
    marginTop: "10px",
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(140px, 1fr))",
    gap: "12px",
    width: "100%",
    alignItems: "stretch",
  }}
>
  {[
   {
  label: "صحة المخزون",
  value: Math.round(stockHealthScore),
  max: 25,
  note:
    lowStockCount > 0
      ? "توجد منتجات منخفضة المخزون"
      : "المخزون مستقر",
},
{
  label: "المنتجات الراكدة",
  value: Math.round(stagnantHealthScore),
  max: 20,
  note:
    stagnantCount > 0
      ? "توجد منتجات راكدة"
      : "لا توجد منتجات راكدة",
},
{
  label: "نشاط المبيعات",
  value: Math.round(salesHealthScore),
  max: 20,
  note:
    totalOrdersCount > 0
      ? "توجد مبيعات نشطة"
      : "لا توجد طلبات كافية",
},
{
  label: "متوسط قيمة الطلب",
  value: Math.round(averageOrderHealthScore),
  max: 15,
  note:
    averageOrderValue >= 100
      ? "متوسط الطلب جيد"
      : averageOrderValue >= 50
      ? "متوسط الطلب مقبول"
      : "متوسط الطلب منخفض",
},
{
  label: "اكتمال بيانات المنتجات",
  value: Math.round(productDataHealthScore),
  max: 20,
  note:
    productsWithCost < totalProductsCount
      ? "بيانات التكلفة غير مكتملة"
      : "بيانات المنتجات مكتملة",
},
  ].map((item) => (
    <div
      key={item.label}
      style={{
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(148,163,184,0.25)",
        borderRadius: "14px",
      padding: "14px",
textAlign: "center",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#64748b",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        {item.label}
      </p>

      <strong style={{ fontSize: "18px" }}>
        {item.value} / {item.max}
      </strong>
          <p
  style={{
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.6",
  }}
>
  {item.note}
</p>
    </div>
  ))}
</div>
    </div>
  </div>
</section>
        
<div
  style={{
    marginTop: "14px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  }}
>
  <a
  href={`/charts?merchant_id=${merchantId}`}
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
  الرسوم البيانية
</a>
    
<PrintButton />
    
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
  const outOfStockProducts = data.low_stock_products.filter(
    (product) => Number(product.quantity) === 0
  );

  const lowStockProducts = data.low_stock_products.filter(
    (product) => Number(product.quantity) > 0
  );

  const topProduct =
    salesInsights?.top_products?.[0]?.product_name || "غير متوفر";

 return (
  <>
    <div
  style={{
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "24px",
  }}
>
  <h2 style={{ margin: "0 0 16px", fontSize: "24px" }}>
    أولويات اليوم
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(240px, 1fr))",
      gap: "14px",
    }}
  >
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px", padding: "16px" }}>
      <h3 style={{ margin: "0 0 8px", color: "#991b1b" }}>
        1. إعادة توفير المنتجات النافدة فورًا
      </h3>
      <p style={{ margin: 0, color: "#7f1d1d" }}>
        ابدأ بالمنتجات التي وصلت كميتها إلى صفر لأنها قد تسبب فقدان طلبات مباشرة.
      </p>
    </div>

    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "14px", padding: "16px" }}>
      <h3 style={{ margin: "0 0 8px", color: "#92400e" }}>
        2. مراجعة المنتجات منخفضة المخزون خلال 48 ساعة
      </h3>
      <p style={{ margin: 0, color: "#78350f" }}>
        راجع المنتجات ذات الكمية المنخفضة وحدد هل تحتاج إلى إعادة طلب قبل نفادها.
      </p>
    </div>

    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "16px" }}>
      <h3 style={{ margin: "0 0 8px", color: "#1d4ed8" }}>
        3. التركيز على المنتج الأعلى مبيعًا
      </h3>
      <p style={{ margin: 0, color: "#1e40af" }}>
        اجعل المنتج الأعلى مبيعًا ظاهرًا في واجهة المتجر أو ضمن العروض.
      </p>
    </div>

    <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "14px", padding: "16px" }}>
      <h3 style={{ margin: "0 0 8px", color: "#6d28d9" }}>
        4. تحسين أو تسويق المنتجات التي لا تتحرك
      </h3>
      <p style={{ margin: 0, color: "#5b21b6" }}>
        راجع المنتجات التي لا تحقق مبيعات وجرّب تحسين الصور أو السعر أو إضافتها في عرض.
      </p>
    </div>
  </div>
</div>
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
        <strong>
          {salesInsights?.summary?.average_order_value || 0} ريال
        </strong>
        . أفضل منتج مبيعًا هو <strong>{topProduct}</strong>.
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

          <h3
            style={{
              margin: "8px 0",
              color: "#7f1d1d",
              fontSize: "26px",
            }}
          >
            {outOfStockProducts.length}
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

          <h3
            style={{
              margin: "8px 0",
              color: "#78350f",
              fontSize: "26px",
            }}
          >
            {lowStockProducts.length}
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

          <h3
            style={{
              margin: "8px 0",
              color: "#14532d",
              fontSize: "20px",
            }}
          >
            أولويات اليوم
          </h3>

          <p style={{ margin: 0, color: "#166534", fontSize: "13px" }}>
            1. إعادة توفير المنتجات النافدة فورًا.
            <br />
            2. مراجعة المنتجات منخفضة المخزون خلال 48 ساعة.
            <br />
            3. التركيز على المنتج الأعلى مبيعًا.
            <br />
            4. تحسين أو تسويق المنتجات التي لا تتحرك.
          </p>
        </div>
      </div>
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
         {Number(salesInsights.summary.average_items_per_order) > 0
  ? salesInsights.summary.average_items_per_order
  : "غير متوفر"}
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
    فرص زيادة المبيعات
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
        background: "#ecfdf5",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>
        فرصة فورية
      </p>
      <h3 style={{ margin: "8px 0", color: "#15803d", fontSize: "22px" }}>
        ركّز على المنتج الأعلى مبيعًا
      </h3>
      <p style={{ margin: 0, color: "#14532d", fontSize: "14px" }}>
        اجعله ظاهرًا في الصفحة الرئيسية أو أضفه إلى حملة تسويقية قصيرة.
      </p>
    </div>

    <div
      style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#1d4ed8", fontSize: "14px" }}>
        زيادة متوسط الطلب
      </p>
      <h3 style={{ margin: "8px 0", color: "#1e40af", fontSize: "22px" }}>
        أنشئ باقة منتجات
      </h3>
      <p style={{ margin: 0, color: "#1e3a8a", fontSize: "14px" }}>
        اربط منتجًا سريع البيع مع منتج يحتاج تنشيطًا لرفع قيمة الفاتورة.
      </p>
    </div>

    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        حماية المبيعات
      </p>
      <h3 style={{ margin: "8px 0", color: "#c2410c", fontSize: "22px" }}>
        لا تدع المنتجات النافدة تخسرك طلبات
      </h3>
      <p style={{ margin: 0, color: "#7c2d12", fontSize: "14px" }}>
        أعد توريد المنتجات النافدة أولًا لأنها تمثل خسارة مباشرة للطلبات.
      </p>
    </div>
  </div>
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
    أفضل المنتجات ربحية
  </h2>

  {profitableProducts.length > 0 ? (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th style={{ padding: "12px", textAlign: "right" }}>اسم المنتج</th>
          <th style={{ padding: "12px", textAlign: "right" }}>سعر البيع</th>
          <th style={{ padding: "12px", textAlign: "right" }}>سعر التكلفة</th>
          <th style={{ padding: "12px", textAlign: "right" }}>الربح التقريبي</th>
          <th style={{ padding: "12px", textAlign: "right" }}>هامش الربح</th>
          <th style={{ padding: "12px", textAlign: "right" }}>الإجراء المقترح</th>
        </tr>
      </thead>

      <tbody>
        {profitableProducts.map((product, index) => (
          <tr
            key={product.id || product.sku || index}
            style={{
              borderBottom: "1px solid #e5e7eb",
              background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
            }}
          >
            <td style={{ padding: "12px", fontWeight: "700" }}>
              {product.name || product.product_name || "منتج بدون اسم"}
            </td>
            <td style={{ padding: "12px" }}>{product.price} ريال</td>
            <td style={{ padding: "12px" }}>{product.costPrice} ريال</td>
            <td style={{ padding: "12px", color: "#15803d", fontWeight: "700" }}>
              {product.profit} ريال
            </td>
            <td style={{ padding: "12px", color: "#166534", fontWeight: "700" }}>
              {product.margin}%
            </td>
            <td style={{ padding: "12px", color: "#1d4ed8", fontWeight: "700" }}>
              ركّز عليه في الحملات والعروض
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "12px",
        padding: "18px",
        color: "#92400e",
        lineHeight: 1.8,
      }}
    >
      لا توجد بيانات تكلفة كافية حاليًا لحساب أفضل المنتجات ربحية.
      <br />
      عند توفر سعر التكلفة من سلة، سيظهر هذا القسم تلقائيًا بأعلى المنتجات ربحًا.
    </div>
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
  <h2 style={{ margin: "0 0 18px", fontSize: "24px" }}>
    اقتراحات تسويقية تلقائية
  </h2>

  {marketingSuggestions.length > 0 ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "14px",
      }}
    >
      {marketingSuggestions.map((item, index) => (
        <div
          key={index}
          style={{
            background:
              index === 0
                ? "#ecfdf5"
                : index === 1
                ? "#fff7ed"
                : index === 2
                ? "#eff6ff"
                : "#f5f3ff",
            border:
              index === 0
                ? "1px solid #bbf7d0"
                : index === 1
                ? "1px solid #fed7aa"
                : index === 2
                ? "1px solid #bfdbfe"
                : "1px solid #ddd6fe",
            borderRadius: "14px",
            padding: "18px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "13px",
              color:
                index === 0
                  ? "#15803d"
                  : index === 1
                  ? "#c2410c"
                  : index === 2
                  ? "#1d4ed8"
                  : "#6d28d9",
              fontWeight: "700",
            }}
          >
            توصية #{index + 1}
          </p>

          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.8",
              color: "#374151",
            }}
          >
            {item.message}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
        color: "#6b7280",
        lineHeight: "1.8",
      }}
    >
      لا توجد اقتراحات تسويقية حاليًا. عند توفر بيانات المبيعات والمخزون
      سيتم توليد توصيات تلقائية لتحسين الأداء.
    </div>
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
    منتجات تحتاج تنشيطًا
  </h2>

  <p style={{ margin: "0 0 18px", color: "#64748b", fontSize: "14px" }}>
    هذه المنتجات متوفرة في المخزون لكنها لا تظهر ضمن المنتجات الأعلى مبيعًا، لذلك تحتاج إلى مراجعة تسويقية أو عرض خاص أو تحسين ظهورها في المتجر.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: "16px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        عدد المنتجات الراكدة
      </p>

      <h3 style={{ margin: "8px 0", color: "#c2410c", fontSize: "24px" }}>
        {stagnantProducts.length}
      </h3>

      <p style={{ margin: 0, color: "#7c2d12", fontSize: "14px" }}>
        منتجات متوفرة لكنها لا تتحرك بوضوح.
      </p>
    </div>

    <div
      style={{
        background: "#fefce8",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#854d0e", fontSize: "14px" }}>
        الخطر التجاري
      </p>

      <h3 style={{ margin: "8px 0", color: "#a16207", fontSize: "24px" }}>
        تجميد رأس مال
      </h3>

      <p style={{ margin: 0, color: "#713f12", fontSize: "14px" }}>
        بقاء المنتجات دون حركة يقلل السيولة ويرفع تكلفة التخزين.
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
        عرض أو تحسين ظهور
      </h3>

      <p style={{ margin: 0, color: "#14532d", fontSize: "14px" }}>
        جرّب خصمًا بسيطًا، باقة مع منتج سريع البيع، أو تحسين الصورة والوصف.
      </p>
    </div>
  </div>

  {stagnantProducts.length > 0 ? (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th style={{ padding: "12px", textAlign: "right" }}>رقم المنتج</th>
          <th style={{ padding: "12px", textAlign: "right" }}>اسم المنتج</th>
          <th style={{ padding: "12px", textAlign: "right" }}>السعر</th>
          <th style={{ padding: "12px", textAlign: "right" }}>الكمية</th>
          <th style={{ padding: "12px", textAlign: "right" }}>الحالة</th>
          <th style={{ padding: "12px", textAlign: "right" }}>الإجراء المقترح</th>
        </tr>
      </thead>

      <tbody>
        {stagnantProducts.map((product, index) => (
          <tr
            key={product.id || product.sku || index}
            style={{
              borderBottom: "1px solid #e5e7eb",
              background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
            }}
          >
            <td style={{ padding: "12px" }}>
              {product.id || product.sku || "-"}
            </td>

            <td style={{ padding: "12px", fontWeight: "600" }}>
              {product.name || product.product_name || product.title || "منتج بدون اسم"}
            </td>

            <td style={{ padding: "12px" }}>
              {product.price ? `${product.price} ريال` : "-"}
            </td>

            <td style={{ padding: "12px" }}>
              {product.quantity || product.stock || 0}
            </td>

            <td style={{ padding: "12px", color: "#c2410c", fontWeight: "600" }}>
              راكد
            </td>

            <td style={{ padding: "12px", color: "#15803d", fontWeight: "600" }}>
              تسويق / عرض / تحسين ظهور
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "16px",
        color: "#166534",
      }}
    >
      لا توجد منتجات راكدة واضحة حاليًا بناءً على البيانات المتاحة.
    </div>
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
    تحليل قنوات البيع وطرق الدفع
  </h2>

  <div
    style={{
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "12px",
      padding: "18px",
      color: "#92400e",
      lineHeight: 1.8,
    }}
  >
    لا توجد بيانات كافية حاليًا لتحليل قنوات البيع أو طرق الدفع.
    <br />
    قد يكون السبب أن المتجر تجريبي أو أن الطلبات الحالية لا تحتوي على بيانات الدفع وقنوات البيع.
    <br />
    عند ربط متجر حقيقي وتوفر هذه البيانات، سيظهر التحليل تلقائيًا هنا.
  </div>
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
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        تنبيه
      </p>

      <h3 style={{ margin: "8px 0", color: "#d97706", fontSize: "24px" }}>
        {data.low_stock_products.filter(
          (product) => Number(product.quantity) > 0
        ).length}
      </h3>

      <p style={{ margin: 0, color: "#78350f", fontSize: "14px" }}>
        منتجات أوشكت على النفاد.
      </p>
    </div>

    <div
      style={{
        background: "#fdf4ff",
        border: "1px solid #f0abfc",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#86198f", fontSize: "14px" }}>
        الإجراء المقترح
      </p>

      <h3 style={{ margin: "8px 0", color: "#581c87", fontSize: "24px" }}>
        راجعها
      </h3>

      <p style={{ margin: 0, color: "#701a75", fontSize: "14px" }}>
        تابع المنتجات منخفضة المخزون خلال 48 ساعة.
      </p>
    </div>
  </div>
</section>
    </>
  );
})()}
  </div>
)}
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
