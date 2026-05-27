export default function TopCustomersChart({ topCustomers, ChartBox }) {
  return (
    <ChartBox title="أكثر 5 عملاء شراءً" accent="#0ea5e9">
      {topCustomers.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {topCustomers.slice(0, 5).map((item, index) => {
            const totalRevenue = Number(item.total_revenue || 0);
            const totalOrders = Number(item.total_orders || 0);

            return (
              <div
                key={index}
                style={{
                  background: index === 0 ? "#eff6ff" : "#f8fafc",
                  border:
                    index === 0
                      ? "1px solid #93c5fd"
                      : "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <strong
                    style={{
                      color: "#0f172a",
                      fontSize: "15px",
                    }}
                  >
                    {index === 0 ? "🏆 " : ""}
                    {item.name || "عميل غير محدد"}
                  </strong>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    #{index + 1}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      الطلبات
                    </div>

                    <strong style={{ color: "#111827" }}>
                      {totalOrders}
                    </strong>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      إجمالي الشراء
                    </div>

                    <strong style={{ color: "#16a34a" }}>
                      {totalRevenue.toLocaleString("ar-SA")} ريال
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            color: "#64748b",
            lineHeight: "1.8",
            fontSize: "15px",
          }}
        >
          <strong style={{ color: "#0f172a" }}>
            لا توجد بيانات عملاء كافية حتى الآن.
          </strong>

          <p style={{ margin: "10px 0 0" }}>
            عند توفر بيانات العملاء سيظهر هنا العملاء الأعلى قيمة وتكرارًا.
          </p>
        </div>
      )}
    </ChartBox>
  );
}
