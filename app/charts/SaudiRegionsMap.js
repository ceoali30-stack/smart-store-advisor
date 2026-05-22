"use client";

import { useState } from "react";

export default function SaudiRegionsMap({ regionsInsights = [] }) {
  const sortedRegions = [...regionsInsights].sort(
    (a, b) => Number(b.total_orders || 0) - Number(a.total_orders || 0)
  );

  const [selectedRegion, setSelectedRegion] = useState(sortedRegions[0] || null);

  const totalOrders = sortedRegions.reduce(
    (sum, region) => sum + Number(region.total_orders || 0),
    0
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
const selectedRegionPercent =
  totalOrders > 0 && selectedRegion
    ? Math.round((Number(selectedRegion.total_orders || 0) / totalOrders) * 100)
    : 0;

const selectedRegionAverageOrder =
  selectedRegion?.total_orders > 0
    ? Math.round(Number(selectedRegion.total_revenue || 0) / Number(selectedRegion.total_orders || 1))
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
          </div>
        </div>

        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
<h3 style={{ marginTop: 0, color: "#0f172a" }}>
  {selectedRegion?.region || "اختر منطقة"}
</h3>

<div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
  <div>
    <span style={{ color: "#64748b" }}>إجمالي الطلبات</span>
    <strong style={{ display: "block", fontSize: "24px", color: "#0f172a" }}>
      {selectedRegion?.total_orders || 0}
    </strong>
  </div>

  <div>
    <span style={{ color: "#64748b" }}>إجمالي الإيرادات</span>
    <strong style={{ display: "block", fontSize: "24px", color: "#0f172a" }}>
      {selectedRegion?.total_revenue || 0} ريال
    </strong>
  </div>

  <div>
    <span style={{ color: "#64748b" }}>متوسط قيمة الطلب</span>
    <strong style={{ display: "block", fontSize: "24px", color: "#0f172a" }}>
      {selectedRegionAverageOrder} ريال
    </strong>
  </div>

  <div>
    <span style={{ color: "#64748b" }}>نسبة المنطقة من الطلبات</span>
    <strong style={{ display: "block", fontSize: "24px", color: "#16a34a" }}>
      {selectedRegionPercent}%
    </strong>
  </div>

  <div>
    <span style={{ color: "#64748b" }}>المدن</span>
    <strong style={{ display: "block", color: "#0f172a" }}>
      {selectedRegion?.cities?.join("، ") || "غير محدد"}
    </strong>
  </div>

  <div
    style={{
      background: "white",
      border: "1px solid #bbf7d0",
      borderRadius: "14px",
      padding: "12px",
      color: "#166534",
      lineHeight: "1.8",
    }}
  >
    <strong>توصية:</strong>{" "}
    {selectedRegion?.total_orders > 0
      ? "هذه المنطقة تستحق متابعة تسويقية، جرّب تخصيص عرض أو حملة محلية لها."
      : "لا توجد طلبات كافية لهذه المنطقة حتى الآن."}
  </div>
</div>
    </section>
  );
}
