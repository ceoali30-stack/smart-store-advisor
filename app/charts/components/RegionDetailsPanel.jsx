export default function RegionDetailsPanel({
  selectedRegion,
  regionStats,
}) {
  return (
    <aside
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        color: "white",
        borderRadius: "28px",
        padding: "28px",
        minHeight: "760px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!selectedRegion ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            اختر منطقة
          </p>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: "30px",
              fontSize: "15px",
            }}
          >
            اضغط على أي منطقة في الخريطة
            <br />
            لعرض التحليل الذكي للمبيعات والطلبات.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                color: "#93c5fd",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              تحليل المنطقة
            </p>

            <h3
              style={{
                fontSize: "34px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              {selectedRegion.nameAr}
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            {[
              {
                title: "إجمالي المبيعات",
                value: `${regionStats?.total_revenue || 0} ر.س`,
                bg: "#1e3a8a",
              },
              {
                title: "عدد الطلبات",
                value: regionStats?.total_orders || 0,
                bg: "#065f46",
              },
              {
                title: "متوسط الفاتورة",
                value: `${regionStats?.average_order_value || 0} ر.س`,
                bg: "#5b21b6",
              },
              {
                title: "متوسط القطع",
                value: regionStats?.average_items_per_order || 0,
                bg: "#9a3412",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: item.bg,
                  borderRadius: "20px",
                  padding: "18px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    opacity: 0.8,
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </p>

                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    margin: 0,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              {
                title: "أكثر منتج مبيعًا",
                value: regionStats?.top_product || "لا توجد بيانات",
              },
              {
                title: "أكثر طريقة دفع",
                value: regionStats?.top_payment_method || "لا توجد بيانات",
              },
              {
                title: "أقوى قناة بيع",
                value: regionStats?.top_sales_channel || "لا توجد بيانات",
              },
              {
                title: "المدن",
                value:
                  regionStats?.cities?.join("، ") || selectedRegion.cities,
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "18px",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
