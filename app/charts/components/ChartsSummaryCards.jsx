import ChartBox from "./ChartBox";

export default function ChartsSummaryCards({ summary }) {
  return (
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
  );
}
