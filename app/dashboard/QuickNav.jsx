export default function QuickNav({ styles }) {
  return (
    <nav style={styles.quickNav}>
      <a href="#store-health" style={styles.quickNavLink}>صحة المتجر</a>
      <a href="#today-priorities" style={styles.quickNavLink}>أولويات اليوم</a>
      <a href="#top-products" style={styles.quickNavLink}>أفضل المنتجات</a>
      <a href="#data-quality" style={styles.quickNavLink}>جودة البيانات</a>
      <a href="#recommendations" style={styles.quickNavLink}>التوصيات</a>
    </nav>
  );
}
