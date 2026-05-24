"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const REGION_ID_TO_NAME = {
  SA01: "منطقة الرياض",
  SA02: "منطقة مكة المكرمة",
  SA03: "منطقة المدينة المنورة",
  SA04: "المنطقة الشرقية",
  SA05: "منطقة القصيم",
  SA06: "منطقة حائل",
  SA07: "منطقة تبوك",
  SA08: "منطقة الحدود الشمالية",
  SA09: "منطقة جازان",
  SA10: "منطقة نجران",
  SA11: "منطقة الباحة",
  SA12: "منطقة الجوف",
  SA14: "منطقة عسير",
};

export default function SaudiRegionsMap({ regionsInsights = [] }) {
  const mapRef = useRef(null);

  const [svgContent, setSvgContent] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("SA01");
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const dataByRegionName = useMemo(() => {
    const map = {};
    regionsInsights.forEach((item) => {
      map[item.region] = item;
    });
    return map;
  }, [regionsInsights]);

  const totalOrders = regionsInsights.reduce(
    (sum, item) => sum + Number(item.total_orders || 0),
    0
  );

  const getRegionData = (regionName) => {
    return (
      dataByRegionName[regionName] || {
        region: regionName,
        total_orders: 0,
        total_revenue: 0,
        cities: [],
      }
    );
  };

  const getFillColor = (orders) => {
    if (!orders) return "#e5e7eb";

    const percent = totalOrders > 0 ? (orders / totalOrders) * 100 : 0;

    if (percent >= 30) return "#16a34a";
    if (percent >= 15) return "#22c55e";
    if (percent >= 5) return "#86efac";
    return "#bbf7d0";
  };

  const getRecommendation = (region) => {
    if (!region || Number(region.total_orders || 0) === 0) {
      return "لا توجد بيانات كافية لهذه المنطقة حتى الآن.";
    }

    const percent =
      totalOrders > 0
        ? Math.round((Number(region.total_orders || 0) / totalOrders) * 100)
        : 0;

    if (percent >= 30) {
      return "هذه من أقوى المناطق حاليًا. ركّز عليها بحملة إعلانية أو عرض خاص لأنها تمثل نسبة عالية من الطلبات.";
    }

    if (percent >= 15) {
      return "هذه المنطقة لديها طلب جيد. جرّب تحسين الشحن أو تقديم عرض محلي لزيادة المبيعات منها.";
    }

    return "هذه المنطقة ما زالت ضعيفة نسبيًا. اختبر حملة صغيرة قبل زيادة الميزانية الإعلانية.";
  };

  useEffect(() => {
    fetch("/sa.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(""));
  }, []);

  useEffect(() => {
    if (!svgContent || !mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("viewBox", "0 0 1000 824");
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.maxHeight = "560px";

    Object.entries(REGION_ID_TO_NAME).forEach(([regionId, regionName]) => {
      const path = svg.querySelector(`#${regionId}`);
      if (!path) return;

      const regionData = getRegionData(regionName);
      const orders = Number(regionData.total_orders || 0);
      const isSelected = selectedRegionId === regionId;

      path.style.fill = getFillColor(orders);
      path.style.stroke = isSelected ? "#0f172a" : "#ffffff";
      path.style.strokeWidth = isSelected ? "2.5" : "0.8";
      path.style.cursor = "pointer";
      path.style.transition = "all 0.2s ease";

      path.onmouseenter = () => {
        path.style.opacity = "0.85";
        setHoveredRegion({
          id: regionId,
          ...regionData,
        });
      };

      path.onmouseleave = () => {
        path.style.opacity = "1";
        setHoveredRegion(null);
      };

      path.onclick = () => {
        setSelectedRegionId(regionId);
      };
    });
  }, [svgContent, selectedRegionId, regionsInsights]);

  const selectedRegionName =
    REGION_ID_TO_NAME[selectedRegionId] || "منطقة الرياض";

  const selectedRegion = getRegionData(selectedRegionName);

  const selectedRegionPercent =
    totalOrders > 0
      ? Math.round(
          (Number(selectedRegion.total_orders || 0) / totalOrders) * 100
        )
      : 0;

  const selectedRegionAverageOrder =
    Number(selectedRegion.total_orders || 0) > 0
      ? Math.round(
          Number(selectedRegion.total_revenue || 0) /
            Number(selectedRegion.total_orders || 1)
        )
      : 0;

  return (
    <section
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "24px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        marginBottom: "28px",
        direction: "rtl",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          gap: "14px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            خريطة المناطق التفاعلية
          </h2>

          <p
            style={{
              margin: "8px 0 0",
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
            borderRadius: "14px",
            padding: "10px 14px",
            fontWeight: "900",
          }}
        >
          إجمالي الطلبات: {totalOrders}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 0.9fr",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "22px",
            padding: "18px",
            minHeight: "580px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            ref={mapRef}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          {!svgContent && (
            <div style={{ color: "#64748b", fontWeight: "800" }}>
              لم يتم تحميل ملف الخريطة sa.svg
            </div>
          )}

          {hoveredRegion && (
            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "18px",
                background: "#0f172a",
                color: "white",
                borderRadius: "16px",
                padding: "14px 16px",
                minWidth: "220px",
                boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
                zIndex: 10,
                direction: "rtl",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                {hoveredRegion.region}
              </strong>

              <div style={{ fontSize: "13px", lineHeight: "1.9" }}>
                <div>الطلبات: {hoveredRegion.total_orders || 0}</div>
                <div>
                  الإيرادات:{" "}
                  {Number(hoveredRegion.total_revenue || 0).toLocaleString(
                    "ar-SA"
                  )}{" "}
                  ريال
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "22px",
            padding: "22px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontSize: "22px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            {selectedRegion.region}
          </h3>

          <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
            <InfoCard
              title="إجمالي الطلبات"
              value={selectedRegion.total_orders || 0}
            />

            <InfoCard
              title="إجمالي الإيرادات"
              value={`${Number(selectedRegion.total_revenue || 0).toLocaleString(
                "ar-SA"
              )} ريال`}
              green
            />

            <InfoCard
              title="متوسط قيمة الطلب"
              value={`${selectedRegionAverageOrder.toLocaleString(
                "ar-SA"
              )} ريال`}
            />

            <InfoCard
              title="نسبة المنطقة من الطلبات"
              value={`${selectedRegionPercent}%`}
              green
            />

            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#64748b", marginBottom: "10px" }}>
                المدن المرتبطة
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(selectedRegion.cities || []).length > 0 ? (
                  selectedRegion.cities.map((city) => (
                    <span
                      key={city}
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        borderRadius: "999px",
                        padding: "7px 11px",
                        fontSize: "13px",
                        fontWeight: "800",
                      }}
                    >
                      {city}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#94a3b8" }}>لا توجد مدن محددة</span>
                )}
              </div>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "18px",
                padding: "16px",
                color: "#166534",
                lineHeight: "1.9",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                توصية ذكية
              </strong>
              {getRecommendation(selectedRegion)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, value, green = false }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "16px",
      }}
    >
      <div style={{ color: "#64748b", marginBottom: "8px" }}>{title}</div>
      <strong
        style={{
          display: "block",
          fontSize: "28px",
          color: green ? "#16a34a" : "#0f172a",
        }}
      >
        {value}
      </strong>
    </div>
  );
}
