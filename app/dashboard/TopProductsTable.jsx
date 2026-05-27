export default function TopProductsTable({
  salesInsights,
  styles,
  formatCurrency,
  EmptyBox,
}) {
  return (
    <section style={styles.section}>
      <p style={styles.sectionEyebrow}>المنتجات</p>

      <h2 style={styles.sectionTitle}>أفضل المنتجات مبيعًا</h2>

      {salesInsights?.top_products?.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>الترتيب</th>
                <th style={styles.th}>اسم المنتج</th>
                <th style={styles.th}>عدد مرات البيع</th>
                <th style={styles.th}>الكمية المباعة</th>
                <th style={styles.th}>الإيرادات</th>
                <th style={styles.th}>التقييم</th>
              </tr>
            </thead>

            <tbody>
              {salesInsights.top_products.slice(0, 10).map((product, index) => {
                const revenue = Number(product.revenue || 0);

                const performance =
                  revenue >= 10000
                    ? "ممتاز"
                    : revenue >= 3000
                    ? "جيد"
                    : "متوسط";

                return (
                  <tr key={product.product_name || index}>
                    <td style={styles.td}>#{index + 1}</td>
                    <td style={styles.td}>
                      {product.product_name || "منتج غير معروف"}
                    </td>
                    <td style={styles.td}>{product.sold_count || 0} عملية</td>
                    <td style={styles.td}>
                      {product.quantity_sold || 0} قطعة
                    </td>
                    <td style={styles.td}>{formatCurrency(revenue)}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        color:
                          performance === "ممتاز"
                            ? "#16a34a"
                            : performance === "جيد"
                            ? "#d97706"
                            : "#475569",
                      }}
                    >
                      {performance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyBox message="لا توجد بيانات مبيعات كافية لعرض أفضل المنتجات." />
      )}
    </section>
  );
}
