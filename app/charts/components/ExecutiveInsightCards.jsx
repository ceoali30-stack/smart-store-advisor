export default function ExecutiveInsightCards({
  topCity,
  topPaymentMethod,
  topSalesChannel,
  recommendations,
}) {
  return (
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

        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "18px",
          }}
        >
          {recommendations?.[0]?.title || "لا توجد تنبيهات"}
        </h2>

        <p style={{ color: "#94a3b8", marginTop: "8px" }}>
          {recommendations?.[0]?.message || ""}
        </p>
      </div>
    </div>
  );
}
