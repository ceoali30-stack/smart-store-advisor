export default function InventoryWatchSection({
  merchantId,
  stockFilter,
  filteredLowStockProducts,
  styles,
  formatCurrency,
  EmptyBox,
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.sectionEyebrow}>المخزون</p>
          <h2 style={styles.sectionTitle}>المنتجات التي تحتاج متابعة</h2>
        </div>

        <div style={styles.filterButtons}>
          <a
            href={`/dashboard?merchant_id=${merchantId}&stock=all`}
            style={{
              ...styles.filterButton,
              ...(stockFilter === "all" ? styles.filterActive : {}),
            }}
          >
            الكل
          </a>

          <a
            href={`/dashboard?merchant_id=${merchantId}&stock=out`}
            style={{
              ...styles.filterButton,
              ...(stockFilter === "out"
                ? styles.filterActiveDanger
                : {}),
            }}
          >
            نفد المخزون
          </a>

          <a
            href={`/dashboard?merchant_id=${merchantId}&stock=low`}
            style={{
              ...styles.filterButton,
              ...(stockFilter === "low"
                ? styles.filterActiveWarning
                : {}),
            }}
          >
            مخزون منخفض
          </a>
        </div>
      </div>

      {filteredLowStockProducts.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>رقم المنتج</th>
                <th style={styles.th}>اسم المنتج</th>
                <th style={styles.th}>السعر</th>
                <th style={styles.th}>الكمية</th>
                <th style={styles.th}>الحالة</th>
              </tr>
            </thead>

            <tbody>
              {filteredLowStockProducts.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    background:
                      Number(product.quantity || 0) === 0
                        ? "#fff7f7"
                        : "#fffdf2",
                  }}
                >
                  <td style={styles.td}>{product.id}</td>

                  <td style={styles.td}>
                    {product.name || "-"}
                  </td>

                  <td style={styles.td}>
                    {formatCurrency(product.price)}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color:
                        Number(product.quantity || 0) === 0
                          ? "#dc2626"
                          : "#b45309",
                    }}
                  >
                    {product.quantity ?? "-"}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color:
                        Number(product.quantity || 0) === 0
                          ? "#dc2626"
                          : "#b45309",
                    }}
                  >
                    {Number(product.quantity || 0) === 0
                      ? "نفد المخزون"
                      : "مخزون منخفض"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyBox message="لا توجد منتجات منخفضة أو نافدة المخزون حسب الفلتر الحالي." />
      )}
    </section>
  );
}
