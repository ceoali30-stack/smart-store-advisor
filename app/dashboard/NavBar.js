export default function NavBar({ merchantId }) {
  return (
    <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <a href={`/dashboard?merchant_id=${merchantId}`} style={navStyle}>
        لوحة التحكم
      </a>

      <a href={`/charts?merchant_id=${merchantId}`} style={navStyle}>
        الرسوم والتقارير
      </a>
    </nav>
  );
}

const navStyle = {
  color: "white",
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
};
