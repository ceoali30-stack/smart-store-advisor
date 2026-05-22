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

  const getRegionByName = (name) =>
    sortedRegions.find((region) => region.region === name) || {
      region: name,
      total_orders: 0,
      total_revenue: 0,
      cities: [],
    };

  const selectedRegionPercent =
    totalOrders > 0 && selectedRegion
      ? Math.round((Number(selectedRegion.total_orders || 0) / totalOrders) * 100)
      : 0;

  const selectedRegionAverageOrder =
    selectedRegion?.total_orders > 0
      ? Math.round(
          Number(selectedRegion.total_revenue || 0) /
            Number(selectedRegion.total_orders || 1)
        )
      : 0;

  const getFillColor = (regionName) => {
    const region = getRegionByName(regionName);
    const orders = Number(region.total_orders || 0);

    if (orders === 0) return "#e5e7eb";

    const percent = totalOrders > 0 ? (orders / totalOrders) * 100 : 0;

    if (percent >= 30) return "#16a34a";
    if (percent >= 15) return "#22c55e";
    if (percent >= 5) return "#86efac";
    return "#bbf7d0";
  };

  const handleRegionClick = (regionName) => {
    setSelectedRegion(getRegionByName(regionName));
  };

  const regionsOnMap = [
    { name: "منطقة تبوك", x: 155, y: 85, w: 115, h: 80 },
    { name: "منطقة الجوف", x: 270, y: 65, w: 105, h: 70 },
    { name: "منطقة الحدود الشمالية", x: 375, y: 55, w: 150, h: 65 },
    { name: "منطقة حائل", x: 300, y: 145, w: 115, h: 75 },
    { name: "منطقة المدينة المنورة", x: 190, y: 185, w: 130, h: 90 },
    { name: "منطقة القصيم", x: 420, y: 155, w: 100, h: 70 },
    { name: "منطقة الرياض", x: 455, y: 230, w: 170, h: 145 },
    { name: "منطقة مكة المكرمة", x: 210, y: 300, w: 135, h: 95 },
    { name: "المنطقة الشرقية", x: 610, y: 170, w: 170, h: 180 },
    { name: "منطقة الباحة", x: 270, y: 410, w: 80, h: 45 },
    { name: "منطقة عسير", x: 330, y: 430, w: 115, h: 70 },
    { name: "منطقة جازان", x: 315, y: 515, w: 90, h: 45 },
    { name: "منطقة نجران", x: 465, y: 465, w: 135, h: 75 },
  ];

  const getRecommendation = () => {
    if (!selectedRegion) return "اختر منطقة لعرض التوصية.";

    if (selectedRegion?.region === "غير محدد") {
      return "يوجد طلبات بدون منطقة واضحة. حسّن جمع بيانات العنوان حتى تصبح قراراتك الجغرافية أدق.";
    }

    if (selectedRegionPercent >= 30) {
      return "هذه من أقوى المناطق حاليًا. ركّز عليها بحملة إعلانية أو عرض خاص لأنها تمثل نسبة عالية من الطلبات.";
    }

    if (selectedRegionPercent >= 15) {
      return "هذه المنطقة لديها طلب جيد. جرّب تحسين الشحن أو تقديم عرض محلي لزيادة المبيعات منها.";
    }

    if (Number(selectedRegion?.total_orders || 0) > 0) {
      return "هذه المنطقة ما زالت ضعيفة نسبيًا. اختبر حملة صغيرة قبل زيادة الميزانية الإعلانية.";
    }

    return "لا توجد طلبات كافية لهذه المنطقة حتى الآن.";
  };

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
            minHeight: "420px",
          }}
        >
          <svg
            viewBox="0 0 850 620"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "390px",
            }}
          >
            <path
              d="M150 80 L300 45 L520 55 L700 145 L780 260 L735 390 L620 540 L430 570 L270 520 L185 410 L130 260 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="4"
            />

            {regionsOnMap.map((region) => {
              const regionData = getRegionByName(region.name);
              const isSelected = selectedRegion?.region === region.name;

              return (
                <g key={region.name} onClick={() => handleRegionClick(region.name)}>
                  <rect
                    x={region.x}
                    y={region.y}
                    width={region.w}
                    height={region.h}
                    rx="18"
                    fill={getFillColor(region.name)}
                    stroke={isSelected ? "#0f172a" : "#ffffff"}
                    strokeWidth={isSelected ? "4" : "2"}
                    style={{ cursor: "pointer" }}
                  />
                  <text
                    x={region.x + region.w / 2}
                    y={region.y + region.h / 2 - 6}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill="#0f172a"
                    style={{ pointerEvents: "none" }}
                  >
                    {region.name.replace("منطقة ", "").replace("المنطقة ", "")}
                  </text>
                  <text
                    x={region.x + region.w / 2}
                    y={region.y + region.h / 2 + 18}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#334155"
                    style={{ pointerEvents: "none" }}
                  >
                    {regionData.total_orders || 0} طلب
                  </text>
                </g>
              );
            })}
          </svg>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "12px",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            <span>⬤ رمادي: لا توجد طلبات</span>
            <span>⬤ أخضر فاتح: طلب منخفض</span>
            <span>⬤ أخضر متوسط: طلب جيد</span>
            <span>⬤ أخضر داكن: طلب قوي</span>
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
                {Number(selectedRegion?.total_revenue || 0).toLocaleString("ar-SA")} ريال
              </strong>
            </div>

            <div>
              <span style={{ color: "#64748b" }}>متوسط قيمة الطلب</span>
              <strong style={{ display: "block", fontSize: "24px", color: "#0f172a" }}>
                {selectedRegionAverageOrder.toLocaleString("ar-SA")} ريال
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
              <strong>توصية:</strong> {getRecommendation()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
