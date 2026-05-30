export default function ProfitabilitySection({
  profitableProducts,
  styles,
  formatCurrency,
  EmptyBox,
}) {
  return (
    <section style={styles.section}>
      <p style={styles.sectionEyebrow}>المنتجات الأعلى ربحية</p>
      <h2 style={styles.sectionTitle}>تحليل الربحية التقريبية</h2>

      {profitableProducts.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>اسم المنتج</th>
                <th style={styles.th}>سعر البيع</th>
                <th style={styles.th}>سعر التكلفة</th>
                <th style={styles.th}>الربح التقريبي</th>
                <th style={styles.th}>هامش الربح</th>
                <th style={styles.th}>الإجراء المقترح</th>
              </tr>
            </thead>

            <tbody>
              {profitableProducts.map((product) => (
                <tr key={product.id || product.name}>
                  <td style={styles.td}>{product.name || "-"}</td>
                  <td style={styles.td}>{formatCurrency(product.price)}</td>
                  <td style={styles.td}>{formatCurrency(product.costPrice)}</td>
                  <td style={styles.td}>{formatCurrency(product.profit)}</td>
                  <td style={styles.td}>{product.margin}%</td>
                  <td style={styles.td}>
                    زيادة الظهور أو استخدامه في حملة مبيعات
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyBox message="لا توجد بيانات تكلفة كافية حاليًا لحساب أفضل المنتجات ربحية. عند توفر سعر التكلفة من سلة، سيظهر هذا القسم تلقائيًا." />
      )}
    </section>
  );
}
