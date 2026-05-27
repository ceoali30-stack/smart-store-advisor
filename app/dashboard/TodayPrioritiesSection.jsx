export default function TodayPrioritiesSection({
  outOfStockProducts,
  onlyLowStockProducts,
  styles,
  PriorityCard,
}) {
  return (
    <section
      id="today-priorities"
      style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.sectionEyebrow}>أولويات اليوم</p>
          <h2 style={styles.sectionTitle}>ما الذي يجب فعله الآن؟</h2>
        </div>
      </div>

      <div style={styles.priorityGrid}>
        <PriorityCard
          title="منتجات نافدة"
          value={outOfStockProducts.length}
          message="تحتاج إلى إعادة توفير فورية."
          tone="danger"
        />

        <PriorityCard
          title="منتجات منخفضة المخزون"
          value={onlyLowStockProducts.length}
          message="راجعها قبل نفادها من المتجر."
          tone="warning"
        />

        <PriorityCard
          title="الإجراء المقترح"
          value="أولويات اليوم"
          message="1. إعادة توفير المنتجات النافدة. 2. مراجعة المنتجات منخفضة المخزون. 3. التركيز على المنتج الأعلى مبيعًا. 4. تحسين المنتجات الراكدة."
          tone="success"
        />
      </div>
    </section>
  );
}
