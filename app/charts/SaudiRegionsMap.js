"use client";

import { useMemo, useState } from "react";

export default function SaudiRegionsMap({ regionsInsights = [] }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regionDataMap = useMemo(() => {
    const map = {};

    regionsInsights.forEach((region) => {
      map[region.region] = region;
    });

    return map;
  }, [regionsInsights]);

  const totalOrders = regionsInsights.reduce(
    (sum, region) => sum + Number(region.total_orders || 0),
    0
  );

  const regionShapes = [
    {
      id: "riyadh",
      name: "منطقة الرياض",
      path: "M420 220 L580 220 L620 340 L520 430 L400 380 Z",
    },
    {
      id: "makkah",
      name: "منطقة مكة المكرمة",
      path: "M230 300 L390 300 L390 430 L250 450 L180 380 Z",
    },
    {
      id: "eastern",
      name: "المنطقة الشرقية",
      path: "M620 180 L780 220 L760 430 L620 420 L580 280 Z",
    },
    {
      id: "madinah",
      name: "منطقة المدينة المنورة",
      path: "M210 170 L360 170 L360 290 L220 300 L170 240 Z",
    },
    {
      id: "qassim",
      name: "منطقة القصيم",
      path: "M390 150 L500 150 L520 230 L420 220 L360 180 Z",
    },
    {
      id: "asir",
      name: "منطقة عسير",
      path: "M300 450 L430 450 L420 560 L310 560 L260 500 Z",
    },
    {
      id: "tabuk",
      name: "منطقة تبوك",
      path: "M120 70 L260 70 L280 160 L190 180 L110 130 Z",
    },
    {
      id: "hail",
      name: "منطقة حائل",
      path: "M300 110 L390 110 L410 180 L360 210 L280 160 Z",
    },
    {
      id: "jazan",
      name: "منطقة جازان",
      path: "M240 560 L320 560 L330 620 L260 630 L220 590 Z",
    },
    {
      id: "najran",
      name: "منطقة نجران",
      path: "M470 500 L610 500 L650 590 L520 620 L430 580 Z",
    },
  ];

  const getRegionData = (name) => {
    return (
      regionDataMap[name] || {
        region: name,
        total_orders: 0,
        total_revenue: 0,
        cities: [],
      }
    );
  };

  const getFillColor = (orders) => {
    if (orders === 0) return "#e5e7eb";
    if (orders >= 10) return "#14532d";
    if (orders >= 5) return "#15803d";
    if (orders >= 3) return "#22c55e";
    if (orders >= 1) return "#86efac";
    return "#dcfce7";
  };

  const getRecommendation = (region) => {
    if (!region || region.total_orders === 0) {
      return "لا توجد بيانات كافية لهذه المنطقة حتى الآن.";
    }

    const percent =
      totalOrders > 0
        ? Math.round((region.total_orders / totalOrders) * 100)
        : 0;

    if (percent >= 30) {
      return "هذه المنطقة تعتبر من أقوى المناطق أداءً. يُنصح بزيادة الاستثمار الإعلاني فيها.";
    }

    if (percent >= 15) {
      return "المنطقة تحقق أداءً جيدًا. يمكن تحسين التحويلات عبر عروض محلية.";
    }

    return "المنطقة ما زالت بحاجة إلى تعزيز الحملات التسويقية وتحسين الوصول.";
  };

  const currentRegion =
    selectedRegion || (regionsInsights.length > 0 ? regionsInsights[0] : null);

  return (
    <section
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        marginBottom: "28px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "800",
              color: "#0f172a",
            }}
          >
            خريطة المناطق التفاعلية
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            توزيع الطلبات والمبيعات حسب مناطق المملكة
          </p>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "10px 14px",
            borderRadius: "14px",
            fontWeight: "700",
          }}
        >
          إجمالي الطلبات: {totalOrders}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 0.9fr",
          gap: "22px",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#f8fafc",
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            padding: "12px",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 850 680"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "620px",
            }}
          >
            <path
              d="M120 70 L300 40 L560 60 L760 180 L800 350 L760 530 L620 650 L420 660 L230 620 L140 470 L100 260 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="6"
            />

            {regionShapes.map((regionShape) => {
              const region = getRegionData(regionShape.name);

              const isSelected =
                currentRegion?.region === regionShape.name;

              return (
                <g
                  key={regionShape.id}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(region)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={regionShape.path}
                    fill={getFillColor(region.total_orders)}
                    stroke={isSelected ? "#0f172a" : "#ffffff"}
                    strokeWidth={isSelected ? 5 : 3}
                    style={{
                      transition: "all 0.25s ease",
                    }}
                  />

                  <text
                    x={
                      regionShape.id === "riyadh"
                        ? 500
                        : regionShape.id === "makkah"
                        ? 300
                        : regionShape.id === "eastern"
                        ? 690
                        : regionShape.id === "madinah"
                        ? 270
                        : regionShape.id === "qassim"
                        ? 450
                        : regionShape.id === "asir"
                        ? 360
                        : regionShape.id === "tabuk"
                        ? 190
                        : regionShape.id === "hail"
                        ? 340
                        : regionShape.id === "jazan"
                        ? 275
                        : 540
                    }
                    y={
                      regionShape.id === "riyadh"
                        ? 320
                        : regionShape.id === "makkah"
                        ? 380
                        : regionShape.id === "eastern"
                        ? 330
                        : regionShape.id === "madinah"
                        ? 240
                        : regionShape.id === "qassim"
                        ? 190
                        : regionShape.id === "asir"
                        ? 520
                        : regionShape.id === "tabuk"
                        ? 120
                        : regionShape.id === "hail"
                        ? 160
                        : regionShape.id === "jazan"
                        ? 600
                        : 560
                    }
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="15"
                    fontWeight="800"
                    style={{ pointerEvents: "none" }}
                  >
                    {regionShape.name.replace("منطقة ", "").replace("المنطقة ", "")}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredRegion && (
            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "18px",
                background: "#0f172a",
                color: "#fff",
                padding: "14px",
                borderRadius: "14px",
                minWidth: "200px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                {hoveredRegion.region}
              </strong>

              <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
                <div>الطلبات: {hoveredRegion.total_orders}</div>

                <div>
                  الإيرادات:{" "}
                  {Number(
                    hoveredRegion.total_revenue || 0
                  ).toLocaleString("ar-SA")}{" "}
                  ريال
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            padding: "22px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontSize: "22px",
              color: "#0f172a",
            }}
          >
            {currentRegion?.region || "اختر منطقة"}
          </h3>

          <div
            style={{
              display: "grid",
              gap: "18px",
              marginTop: "22px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#64748b", marginBottom: "8px" }}>
                إجمالي الطلبات
              </div>

              <strong
                style={{
                  fontSize: "34px",
                  color: "#0f172a",
                }}
              >
                {currentRegion?.total_orders || 0}
              </strong>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#64748b", marginBottom: "8px" }}>
                إجمالي الإيرادات
              </div>

              <strong
                style={{
                  fontSize: "28px",
                  color: "#16a34a",
                }}
              >
                {Number(
                  currentRegion?.total_revenue || 0
                ).toLocaleString("ar-SA")}{" "}
                ريال
              </strong>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ color: "#64748b", marginBottom: "8px" }}>
                المدن المرتبطة
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {(currentRegion?.cities || []).map((city) => (
                  <span
                    key={city}
                    style={{
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "18px",
                padding: "18px",
                lineHeight: "1.9",
                color: "#166534",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                توصية ذكية
              </strong>

              {getRecommendation(currentRegion)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
