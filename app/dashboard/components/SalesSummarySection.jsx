
export default function SalesSummarySection({
  totalRevenueValue,
  totalOrdersCount,
  totalItemsSold,
  averageItemsPerOrder,
  topProduct,
  topCity,
  salesInsights,
  styles,
  KpiCard,
  formatCurrency,
  formatNumber,
}) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>ملخص المبيعات</h2>

      <div style={styles.kpiGrid}>
        <KpiCard
          title="إجمالي المبيعات"
          value={formatCurrency(totalRevenueValue)}
          note="إجمالي قيمة الطلبات"
        />

        <KpiCard
          title="عدد الطلبات"
          value={formatNumber(totalOrdersCount)}
          note="إجمالي الطلبات المسجلة"
        />

        <KpiCard
          title="المنتجات المباعة"
          value={formatNumber(totalItemsSold)}
          note="إجمالي الكميات المباعة"
        />

        <KpiCard
          title="متوسط المنتجات لكل طلب"
          value={formatNumber(averageItemsPerOrder)}
          note="مؤشر مهم لزيادة متوسط السلة"
        />
      </div>

      <div style={styles.insightBox}>
        <div>
          <strong>أفضل منتج:</strong>{" "}
          {topProduct?.product_name || "لا توجد بيانات كافية"}
        </div>

        <div>
          <strong>أفضل مدينة:</strong>{" "}
          {topCity?.city || "لا توجد بيانات كافية"}
        </div>

        <div>
          <strong>قراءة سريعة:</strong>{" "}
          {salesInsights ||
            "كلما زادت جودة بيانات الطلبات والمنتجات أصبحت التوصيات أدق."}
        </div>
      </div>
    </section>
  );
}
