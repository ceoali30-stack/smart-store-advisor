export default function ChartsQuickNav() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
        padding: "14px 18px",
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        position: "sticky",
        top: "0",
        zIndex: 999,
      }}
    >
      <a href="#charts-summary" style={linkStyle}>الملخص</a>
      <a href="#merchant-decisions" style={linkStyle}>قرارات التاجر</a>
      <a href="#regions-map" style={linkStyle}>خريطة المناطق</a>
      <a href="#abandoned-carts" style={linkStyle}>السلات المتروكة</a>
      <a href="#data-quality" style={linkStyle}>جودة البيانات</a>
      <a href="#regions-analysis" style={linkStyle}>تحليل المناطق</a>
      <a href="#visual-charts" style={linkStyle}>الرسوم البيانية</a>
    </nav>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#0f172a",
  background: "#f1f5f9",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
};
