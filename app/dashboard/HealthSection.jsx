export default function HealthSection({
  storeHealthPercentage,
  storeHealthLabel,
  storeHealthMessage,
  stockHealthScore,
  stagnantHealthScore,
  salesHealthScore,
  averageOrderHealthScore,
  productDataHealthScore,
  styles,
  HealthItem,
}) {
  return (
    <section style={styles.healthSection}>
      <div style={styles.healthCircle}>
        <div style={styles.healthNumber}>
          {storeHealthPercentage}%
        </div>

        <div style={styles.healthLabel}>
          {storeHealthLabel}
        </div>
      </div>

      <div>
        <p style={styles.sectionEyebrow}>
          صحة المتجر
        </p>

        <h2 style={styles.sectionTitle}>
          {storeHealthMessage}
        </h2>

        <div style={styles.healthGrid}>
          <HealthItem
            title="المخزون"
            value={Math.round(stockHealthScore)}
            max={25}
            note="يقيس تأثير المنتجات منخفضة أو نافدة المخزون."
          />

          <HealthItem
            title="المنتجات الراكدة"
            value={Math.round(stagnantHealthScore)}
            max={20}
            note="يقيس وجود منتجات لا تتحرك مقارنة بعدد المنتجات."
          />

          <HealthItem
            title="المبيعات"
            value={Math.round(salesHealthScore)}
            max={20}
            note="يعتمد على وجود طلبات وإيرادات فعلية."
          />

          <HealthItem
            title="متوسط الطلب"
            value={Math.round(averageOrderHealthScore)}
            max={15}
            note="يقيس قوة متوسط قيمة الطلب."
          />

          <HealthItem
            title="جودة بيانات المنتجات"
            value={Math.round(productDataHealthScore)}
            max={20}
            note="يعتمد على توفر السعر وسعر التكلفة."
          />
        </div>
      </div>
    </section>
  );
}
