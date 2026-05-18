"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: "#2563eb",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      طباعة التقرير PDF
    </button>
  );
}
