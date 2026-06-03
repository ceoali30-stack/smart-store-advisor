export default function ChartBox({
  title,
  children,
  accent = "#2563eb",
}) {
  return (
    <section
      className="print-card"
      style={{
        position: "relative",
        background: "white",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "6px",
          height: "100%",
          background: accent,
        }}
      />

      <h2
        style={{
          margin: "0 0 14px",
          fontSize: "15px",
          fontWeight: "800",
          color: "#64748b",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          color: "#0f172a",
          lineHeight: "1.6",
        }}
      >
        {children}
      </div>
    </section>
  );
}
