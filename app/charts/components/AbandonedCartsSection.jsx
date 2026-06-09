export default function AbandonedCartsSection({
  abandonedCartsSummary,
}) {
  return (
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
      <h2
        style={{
          margin: "0 0 18px",
          fontSize: "18px",
          color: "#0f172a",
        }}
      >
        تحليل السلات المتروكة
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
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "#991b1b",
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            عدد السلات المتروكة
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "28px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            {abandonedCartsSummary?.count || 0}
          </div>
        </div>

        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "#9a3412",
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            قيمة السلات المتروكة
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "28px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            {abandonedCartsSummary?.total_value || 0} ريال
          </div>
        </div>

        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              color: "#1d4ed8",
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            ملاحظة ذكية
          </div>

          <p
            style={{
              margin: "10px 0 0",
              color: "#334155",
              lineHeight: "1.8",
              fontSize: "14px",
            }}
          >
            متابعة السلات المتروكة تساعد على استرجاع العملاء عبر رسائل
            التذكير والعروض الخاصة.
          </p>
        </div>
      </div>
    </section>
  );
}
