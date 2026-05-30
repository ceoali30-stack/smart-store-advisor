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
      <p style={styles.sectionEyebrow}>تحليلات المبيعات</p>
      <h2 style={styles.sectionTitle}>ملخص المبيعات</h2>

      <div style={styles.cardsGrid}>
        <KpiCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenueValue)} />
        <KpiCard title="إجمالي الطلبات" value={formatNumber(totalOrdersCount)} />
        <KpiCard title="إجمالي القطع المباعة" value={formatNumber(totalItemsSold)} />

        <KpiCard
          title="متوسط القطع في الطلب"
          value={
            averageItemsPerOrder
              ? averageItemsPerOrder.toFixed(2)
              : "غير متوفر"
          }
        />

        <KpiCard title="أفضل منتج" value={topProduct} />

        <KpiCard
          title="عدد مرات بيع أفضل منتج"
          value={
            salesInsights?.top_products?.[0]?.sold_count
              ? `${salesInsights.top_products[0].sold_count} عملية`
              : "غير متوفر"
          }
        />

        <KpiCard
          title="الكمية المباعة لأفضل منتج"
          value={
            salesInsights?.top_products?.[0]?.quantity_sold
              ? `${salesInsights.top_products[0].quantity_sold} قطعة`
              : "غير متوفر"
          }
        />

        <KpiCard title="أعلى مدينة / منطقة" value={topCity} />
      </div>
    </section>
  );
}
