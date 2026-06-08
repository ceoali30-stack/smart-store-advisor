export default function SmartRecommendationsSection({
  topCities,
}) {
  return (
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
      <h2
        style={{
          margin: "0 0 18px",
          fontSize: "18px",
          color: "#0f172a",
        }}
      >
        توصيات ذكية للتاجر
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "14px",
          }}
        >
          <strong style={{ color: "#15803d" }}>
            استهدف أفضل مدينة
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            ركّز العروض أو الإعلانات على{" "}
            {topCities?.[0]?.city || "المدينة الأعلى طلبًا"} لأنها
            تظهر كأقوى منطقة طلب حاليًا.
          </p>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "14px",
          }}
        >
          <strong style={{ color: "#1d4ed8" }}>
            ارفع متوسط السلة
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            جرّب عرضًا مثل: اشترِ بمبلغ أعلى واحصل على خصم أو شحن مجاني.
          </p>
        </div>

        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            padding: "14px",
          }}
        >
          <strong style={{ color: "#9a3412" }}>
            حسّن بيانات المنتجات
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            بيانات المنتجات والأقسام غير مكتملة؛ تحسينها سيرفع دقة
            التحليل والتوصيات.
          </p>
        </div>
      </div>
    </section>
  );
}
