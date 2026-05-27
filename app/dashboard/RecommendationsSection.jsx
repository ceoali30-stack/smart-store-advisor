export default function RecommendationsSection({
  marketingSuggestions,
  styles,
  EmptyBox,
}) {
  return (
    <section style={styles.section}>
      <p style={styles.sectionEyebrow}>التوصيات</p>

      <h2 style={styles.sectionTitle}>
        توصيات ذكية لتحسين الأداء
      </h2>

      {marketingSuggestions.length > 0 ? (
        <div style={styles.recommendationsGrid}>
          {marketingSuggestions.map((item, index) => (
            <div
              key={index}
              style={styles.recommendationCard}
            >
              <p style={styles.recommendationNumber}>
                توصية #{index + 1}
              </p>

              <h3 style={styles.recommendationTitle}>
                {item.title}
              </h3>

              <p style={styles.recommendationText}>
                {item.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyBox message="لا توجد اقتراحات تسويقية حاليًا. عند توفر بيانات المبيعات والمخزون سيتم توليد توصيات تلقائية." />
      )}
    </section>
  );
}
