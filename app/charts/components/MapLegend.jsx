export default function MapLegend() {
  const items = [
    { label: "مبيعات عالية", color: "#166534" },
    { label: "مبيعات متوسطة", color: "#16a34a" },
    { label: "مبيعات منخفضة", color: "#4ade80" },
    { label: "لا توجد بيانات", color: "#e5e7eb" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "18px",
        flexWrap: "wrap",
        fontSize: "13px",
        color: "#475569",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "4px",
              background: item.color,
              border: "1px solid #cbd5e1",
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
