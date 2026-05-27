export default function DataQualitySection({
  dataQualityAlerts,
  styles,
}) {
  return (
    <section
      id="data-quality"
      style={styles.section}>
      <p style={styles.sectionEyebrow}>جودة البيانات</p>

      <h2 style={styles.sectionTitle}>
        تنبيهات تؤثر على دقة التحليل
      </h2>

      <div style={styles.cardsGrid}>
        {dataQualityAlerts.map((item, index) => (
          <div key={index} style={styles.kpiCard}>
            <p style={styles.kpiTitle}>{item.title}</p>

            <h3 style={styles.kpiValue}>{item.value}</h3>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                lineHeight: "1.7",
              }}
            >
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
