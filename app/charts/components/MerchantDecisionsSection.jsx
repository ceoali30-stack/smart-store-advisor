export default function MerchantDecisionsSection({
  summary,
  topCities,
}) {
  return (
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
      <h2
        style={{
          margin: "0 0 18px",
          fontSize: "18px",
          color: "#0f172a",
        }}
      >
        ملخص قرارات التاجر
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            padding: "14px",
            minHeight: "110px",
          }}
        >
          <strong style={{ color: "#9a3412" }}>
            متوسط قيمة الطلب:
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            {summary.average_order_value || 0} ريال — كلما ارتفع متوسط
            الفاتورة زادت فرصة الربح من نفس عدد العملاء.
          </p>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "14px",
            minHeight: "110px",
          }}
        >
          <strong style={{ color: "#1d4ed8" }}>
            إجمالي الطلبات:
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            {summary.total_orders || 0} طلب — هذا الرقم يساعد على قياس
            نشاط المتجر وحجم الطلب الفعلي.
          </p>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "14px",
            minHeight: "110px",
          }}
        >
          <strong style={{ color: "#15803d" }}>
            أفضل مدينة طلبًا:
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            {topCities.length > 0
              ? topCities[0].city || "غير محدد"
              : "غير متوفر"}{" "}
            — يمكن استهداف هذه المدينة بعروض خاصة أو حملات تسويقية محلية.
          </p>
        </div>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "14px",
            minHeight: "110px",
          }}
        >
          <strong style={{ color: "#0f172a" }}>
            ملاحظة بيانات:
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#334155",
            }}
          >
            إذا كانت المنتجات أو الأقسام غير ظاهرة، فهذا يعني أن بيانات
            عناصر الطلب أو تصنيف المنتجات لم تكتمل بعد في المزامنة.
          </p>
        </div>
      </div>
    </section>
  );
}
