export default function StagnantProductsSection({
  stagnantProducts,
  styles,
  formatCurrency,
  EmptyBox,
}) {
  return (
    <section style={styles.section}>
      <p style={styles.sectionEyebrow}>المنتجات الراكدة</p>
      <h2 style={styles.sectionTitle}>منتجات تحتاج تنشيط أو تحسين ظهور</h2>

      {stagnantProducts.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>رقم المنتج</th>
                <th style={styles.th}>اسم المنتج</th>
                <th style={styles.th}>السعر</th>
                <th style={styles.th}>الكمية</th>
                <th style={styles.th}>الحالة</th>
                <th style={styles.th}>الإجراء المقترح</th>
              </tr>
            </thead>

            <tbody>
              {stagnantProducts.map((product) => (
                <tr key={product.id || product.name}>
                  <td style={styles.td}>{product.id || "-"}</td>

                  <td style={styles.td}>
                    {product.name ||
                      product.product_name ||
                      product.title ||
                      "منتج بدون اسم"}
                  </td>

                  <td style={styles.td}>{formatCurrency(product.price)}</td>

                  <td style={styles.td}>
                    {product.quantity || product.stock || 0}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      color: "#c2410c",
                      fontWeight: 700,
                    }}
                  >
                    راكد
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      color: "#15803d",
                      fontWeight: 700,
                    }}
                  >
                    تسويق / عرض / تحسين ظهور
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyBox message="لا توجد منتجات راكدة واضحة حاليًا بناءً على البيانات المتاحة." />
      )}
    </section>
  );
}
