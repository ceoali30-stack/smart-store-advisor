export default function BarItem({
  label,
  value,
  max,
}) {
  const numericValue = Number(
    String(value || 0).replace(/[^\d.]/g, "")
  );

  const percent =
    max > 0
      ? Math.min(
          100,
          Math.round((numericValue / max) * 100)
        )
      : 0;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <strong>{label}</strong>
        <span>{value}</span>
      </div>

      <div
        style={{
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#111827",
          }}
        />
      </div>
    </div>
  );
}
