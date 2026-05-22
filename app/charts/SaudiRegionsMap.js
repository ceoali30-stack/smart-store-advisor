"use client";

import { useState } from "react";

export default function SaudiRegionsMap({ regionsInsights = [] }) {
  const [selectedRegion, setSelectedRegion] = useState(regionsInsights[0] || null);

const totalOrders = regionsInsights.reduce(
  (sum, region) => sum + Number(region.total_orders || 0),
  0
);

const sortedRegions = [...regionsInsights].sort(
  (a, b) => Number(b.total_orders || 0) - Number(a.total_orders || 0)
);
  
  return (
    <section
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "22px",
        boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        borderRight: "6px solid #16a34a",
        marginBottom: "24px",
      }}
    >
      <h2 style={{ margin: "0 0 18px", fontSize: "18px", color: "#0f172a" }}>
        خريطة المناطق الإدارية
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "18px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "18px",
            minHeight: "320px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
          {sortedRegions.map((region, index) => {
  const percent =
    totalOrders > 0
      ? Math.round((Number(region.total_orders || 0) / totalOrders) * 100)
      : 0;

  return (
    <button
      key={index}
      onClick={() => setSelectedRegion(region)}
      style={{
        border: "1px solid #cbd5e1",
        background:
          selectedRegion?.region === region.region ? "#dcfce7" : "white",
        color: "#0f172a",
        borderRadius: "14px",
        padding: "14px",
        cursor: "pointer",
        fontWeight: "800",
        textAlign: "center",
      }}
    >
      {region.region}

      <div style={{ marginTop: "6px", color: "#64748b", fontSize: "12px" }}>
        {region.total_orders || 0} طلب
      </div>

      <div
        style={{
          marginTop: "10px",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: index === 0 ? "#16a34a" : "#38bdf8",
          }}
        />
      </div>

      <div style={{ marginTop: "6px", color: "#64748b", fontSize: "12px" }}>
        {percent}% من الطلبات
      </div>
    </button>
  );
})}

        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {selectedRegion?.region || "اختر منطقة"}
          </h3>

          <p>إجمالي الطلبات: <strong>{selectedRegion?.total_orders || 0}</strong></p>
          <p>إجمالي الإيرادات: <strong>{selectedRegion?.total_revenue || 0} ريال</strong></p>
          <p>
            المدن:{" "}
            <strong>{selectedRegion?.cities?.join("، ") || "غير محدد"}</strong>
          </p>
        </div>
      </div>
    </section>
  );
})}
