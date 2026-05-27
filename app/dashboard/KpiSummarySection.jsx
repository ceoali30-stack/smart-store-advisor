export default function KpiSummarySection({
  totalRevenueValue,
  totalOrdersCount,
  averageOrderValue,
  totalProductsCount,
  lowStockCount,
  topProduct,
  styles,
  KpiCard,
  formatCurrency,
  formatNumber,
}) {
  return (
    <section style={styles.cardsGrid}>
      <KpiCard
        title="إجمالي المبيعات"
        value={formatCurrency(totalRevenueValue)}
      />

      <KpiCard
        title="عدد الطلبات"
        value={formatNumber(totalOrdersCount)}
      />

      <KpiCard
        title="متوسط قيمة الطلب"
        value={formatCurrency(averageOrderValue)}
      />

      <KpiCard
        title="عدد المنتجات"
        value={formatNumber(totalProductsCount)}
      />

      <KpiCard
        title="منتجات منخفضة المخزون"
        value={formatNumber(lowStockCount)}
      />

      <KpiCard
        title="المنتج الأعلى مبيعًا"
        value={topProduct}
      />
    </section>
  );
}
