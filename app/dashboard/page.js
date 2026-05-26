import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import PrintButton from "./PrintButton";
import SyncOrdersButton from "./SyncOrdersButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function ScoreCircle({ percentage }) {
  const color =
    percentage >= 85
      ? "#16a34a"
      : percentage >= 70
      ? "#0ea5e9"
      : percentage >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      style={{
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        border: `8px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
        fontWeight: "bold",
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      {percentage}%
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "18px",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#64748b",
          marginBottom: "10px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#94a3b8",
          marginTop: "8px",
          lineHeight: "1.6",
        }}
      >
        {note}
      </div>
    </div>
  );
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;

  const merchantId = params?.merchant_id;

  if (!merchantId) {
    redirect("/");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("merchant_id")
    .eq("merchant_id", String(merchantId))
    .maybeSingle();

  if (!merchant) {
    return (
      <main
        style={{
         padding: "24px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>غير مصرح</h1>

        <p>هذا المتجر غير مربوط بتطبيق مستشار المتجر الذكي.</p>
      </main>
    );
  }

  const salesRes = await fetch(
    `https://smart-store-advisor.vercel.app/api/sales/insights?merchant_id=${merchantId}`,
    {
      cache: "no-store",
    }
  );

  const salesData = await salesRes.json();

const totalOrders = salesData?.summary?.total_orders || 0;
const totalRevenue = salesData?.summary?.total_revenue || 0;
const totalProducts = data?.total_products || 0;
const slowProducts = data?.low_stock_products_count || 0;
const averageOrderValue = salesData?.summary?.average_order_value || 0;
const topProduct = salesData?.top_products?.[0]?.product_name || "غير متوفر";

  let score = 100;

  if (slowProducts > 0) score -= 20;
  if (totalProducts < 5) score -= 20;
  if (totalRevenue < 1000) score -= 25;

  if (score < 0) score = 0;

  const healthMessage =
    score >= 85
      ? "متجرك يعمل بشكل ممتاز"
      : score >= 70
      ? "أداء جيد مع فرص تحسين"
      : score >= 50
      ? "المتجر يحتاج بعض التحسينات"
      : "المتجر يحتاج تدخل وتحسين واضح";

  return (
    <main
      style={{
        direction: "rtl",
        textAlign: "right",
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "#f6f7f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#081028",
          color: "white",
          padding: "20px 28px",
          borderRadius: "24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            مستشار المتجر الذكي
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "15px",
            }}
          >
            لوحة تحليلات ذكية لمتاجر سلة
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`/dashboard?merchant_id=${merchantId}`}
            style={{
              background: "white",
              color: "#081028",
              textDecoration: "none",
              padding: "12px 18px",
              borderRadius: "14px",
              fontWeight: "bold",
            }}
          >
            لوحة التحكم
          </a>

          <a
            href={`/charts?merchant_id=${merchantId}`}
            style={{
              background: "#1e293b",
              color: "white",
              textDecoration: "none",
              padding: "12px 18px",
              borderRadius: "14px",
              fontWeight: "bold",
            }}
          >
            الرسوم البيانية
          </a>
        </div>
      </div>

      <section
        style={{
          background: "white",
         borderRadius: "22px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ScoreCircle percentage={score} />
          </div>

          <div>
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              مؤشر عام
            </div>

            <h1
              style={{
                fontSize: "42px",
                margin: "0 0 16px",
                color: "#0f172a",
              }}
            >
              درجة صحة المتجر
            </h1>

            <p
              style={{
                color: "#475569",
                lineHeight: "2",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              {healthMessage}
            </p>

            <div
              style={{
                width: "100%",
                height: "12px",
                background: "#e2e8f0",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  background:
                    score >= 85
                      ? "#16a34a"
                      : score >= 70
                      ? "#0ea5e9"
                      : score >= 50
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              {score >= 70 ? "أداء جيد" : "يحتاج تحسين"}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <MetricCard
          label="إجمالي الطلبات"
          value={totalOrders}
          note="عدد الطلبات في المتجر"
        />

        <MetricCard
          label="إجمالي الإيرادات"
          value={`${totalRevenue} ر.س`}
          note="إجمالي المبيعات"
        />

        <MetricCard
          label="عدد المنتجات"
          value={totalProducts}
          note="عدد المنتجات الموجودة"
        />

        <MetricCard
          label="المنتجات الراكدة"
          value={slowProducts}
          note="منتجات تحتاج تحسين"
        />
      </section>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <SyncOrdersButton merchantId={merchantId} />

        <PrintButton />

        <a
          href={`/charts?merchant_id=${merchantId}`}
          style={{
            background: "#081028",
            color: "white",
            padding: "14px 20px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          الرسوم البيانية
        </a>
      </div>

<section
  className="print-section"
  style={{
    marginTop: "24px",
    background: "white",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
  }}
>
  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
    خطة تنفيذية
  </p>

  <h2 style={{ margin: "8px 0 18px", fontSize: "26px", color: "#0f172a" }}>
    أولويات اليوم
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(240px, 1fr))",
      gap: "14px",
    }}
  >
    {[
      ["#fef2f2", "#fecaca", "#991b1b", "إعادة توفير المنتجات النافدة فورًا", "ابدأ بالمنتجات التي وصلت كميتها إلى صفر لأنها قد تسبب فقدان طلبات مباشرة."],
      ["#fffbeb", "#fde68a", "#92400e", "مراجعة المنتجات منخفضة المخزون", "راجع المنتجات ذات الكمية المنخفضة خلال 48 ساعة وحدد هل تحتاج إلى إعادة طلب."],
      ["#ecfdf5", "#bbf7d0", "#166534", "التركيز على المنتج الأعلى مبيعًا", "اجعله ظاهرًا في واجهة المتجر أو ضمن العروض."],
      ["#f5f3ff", "#ddd6fe", "#6d28d9", "تنشيط المنتجات الراكدة", "راجع المنتجات التي لا تتحرك وجرّب تحسين الصور أو السعر أو إضافتها في عرض."],
    ].map(([bg, border, color, title, text], index) => (
      <div
        key={index}
        className="print-card"
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <strong style={{ color, fontSize: "15px" }}>
          {index + 1}. {title}
        </strong>

        <p style={{ margin: "8px 0 0", color, lineHeight: "1.7", fontSize: "14px" }}>
          {text}
        </p>
      </div>
    ))}
  </div>
</section>

<section className="print-section" style={{
  marginTop: "24px",
  background: "white",
  borderRadius: "22px",
  padding: "24px",
  boxShadow: "0 8px 28px rgba(0,0,0,0.05)",
  border: "1px solid #e5e7eb",
}}>
  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>تحليل ذكي</p>
  <h2 style={{ margin: "8px 0 18px", fontSize: "26px", color: "#0f172a" }}>
    الملخص التنفيذي
  </h2>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
    gap: "14px",
  }}>
    {[
      ["إجمالي الطلبات", totalOrders, "عدد الطلبات في المتجر"],
      ["إجمالي المبيعات", `${totalRevenue} ر.س`, "قيمة المبيعات الحالية"],
      ["متوسط الفاتورة", `${averageOrderValue} ر.س`, "متوسط قيمة الطلب"],
      ["أفضل منتج", topProduct, "المنتج الأعلى مبيعًا"],
    ].map(([title, value, note], index) => (
      <div key={index} className="print-card" style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "18px",
      }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{title}</p>
        <h3 style={{ margin: "10px 0", fontSize: "24px", color: "#0f172a" }}>
          {value}
        </h3>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>{note}</p>
      </div>
    ))}
  </div>
</section>
            
    </main>
  );
}
