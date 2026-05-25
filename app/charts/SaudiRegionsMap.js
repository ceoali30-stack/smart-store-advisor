"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const regionsConstant = {
  SA01: { nameAr: "منطقة الرياض", cities: "الرياض، الخرج، المجمعة" },
  SA02: { nameAr: "منطقة مكة المكرمة", cities: "مكة، جدة، الطائف" },
  SA03: { nameAr: "منطقة المدينة المنورة", cities: "المدينة، ينبع، العلا" },
  SA04: { nameAr: "المنطقة الشرقية", cities: "الدمام، الخبر، الأحساء" },
  SA05: { nameAr: "منطقة القصيم", cities: "بريدة، عنيزة، الرس" },
  SA06: { nameAr: "منطقة حائل", cities: "حائل" },
  SA07: { nameAr: "منطقة تبوك", cities: "تبوك، الوجه، ضباء" },
  SA08: { nameAr: "منطقة الحدود الشمالية", cities: "عرعر، رفحاء، طريف" },
  SA09: { nameAr: "منطقة جازان", cities: "جازان، صبيا، أبو عريش" },
  SA10: { nameAr: "منطقة نجران", cities: "نجران" },
  SA11: { nameAr: "منطقة الباحة", cities: "الباحة، بلجرشي" },
  SA12: { nameAr: "منطقة الجوف", cities: "سكاكا، القريات" },
  SA14: { nameAr: "منطقة عسير", cities: "أبها، خميس مشيط" },
};

export default function SaudiRegionsMap() {
  const containerRef = useRef(null);

  const [svgContent, setSvgContent] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [colorMetric, setColorMetric] = useState("revenue");
  
  useEffect(() => {
    async function loadSvg() {
      try {
        const res = await fetch("/sa.svg");
        const text = await res.text();
        setSvgContent(text);
      } catch (error) {
        console.error("Error loading sa.svg:", error);
      }
    }

    loadSvg();
  }, []);

  useEffect(() => {
    async function loadInsights() {
      try {
        const params = new URLSearchParams(window.location.search);
        const merchantId = params.get("merchant_id");

        if (!merchantId) {
          setLoadingInsights(false);
          return;
        }

        const res = await fetch(`/api/sales/insights?merchant_id=${merchantId}`);
        const data = await res.json();

        if (data?.success) {
          setInsights(data);
        }
      } catch (error) {
        console.error("Error loading insights:", error);
      } finally {
        setLoadingInsights(false);
      }
    }

    loadInsights();
  }, []);

  const regionStats = useMemo(() => {
    if (!selectedRegion || !insights?.regions_insights) return null;

    return insights.regions_insights.find(
      (item) => item.region === selectedRegion.nameAr
    );
  }, [selectedRegion, insights]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

   svg.removeAttribute("width");
svg.removeAttribute("height");

svg.style.width = "100%";
svg.style.height = "700px";
svg.style.display = "block";
svg.style.margin = "0 auto";

svg.setAttribute(
  "viewBox",
  "0 0 1000 1000"
);

svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const paths = svg.querySelectorAll("path");

const maxRevenue = Math.max(
  ...(insights?.regions_insights || []).map(
    (r) => r.total_revenue || 0
  ),
  1
);

function getRegionColor(regionName, regionId) {
  const regionData = insights?.regions_insights?.find(
    (r) => r.region === regionName
  );

  if (!regionData) return "#e5e7eb";

  const mappedRegionsNames = Object.values(regionsConstant).map(
  (r) => r.nameAr
);

const maxValue = Math.max(
  ...(insights?.regions_insights || [])
    .filter((r) => mappedRegionsNames.includes(r.region))
    .map((r) =>
      colorMetric === "orders"
        ? r.total_orders || 0
        : r.total_revenue || 0
    ),
  1
);

  const ratio = value / maxValue;

  if (ratio > 0.7) return "#166534";
  if (ratio > 0.4) return "#16a34a";
 if (ratio > 0) return "#4ade80";
  
  return "#e5e7eb";
}
    
    paths.forEach((path) => {
      const id = path.getAttribute("id");
      const region = regionsConstant[id];

      path.style.cursor = region ? "pointer" : "default";
      path.style.fill = getRegionColor(region.nameAr, id);
      path.style.stroke = "#ffffff";
      path.style.strokeWidth = "1";

      if (!region) return;

const handleMouseEnter = () => {
  path.style.opacity = "0.8";
};

const handleMouseLeave = () => {
  path.style.opacity = "1";
  path.style.fill = getRegionColor(region.nameAr, id);
};

path.addEventListener("mouseenter", handleMouseEnter);
path.addEventListener("mouseleave", handleMouseLeave);

path._cleanup = () => {
  path.removeEventListener("mouseenter", handleMouseEnter);
  path.removeEventListener("mouseleave", handleMouseLeave);
};
    });

    return () => {
      paths.forEach((path) => {
        if (path._cleanup) path._cleanup();
      });
    };
 }, [svgContent, selectedRegion, insights, colorMetric]);

 return (
  <section className="w-full py-2" dir="rtl">
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            خريطة تحليل المناطق
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            اضغط على أي منطقة لعرض المبيعات والطلبات وأداء المنتجات.
          </p>
        </div>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    padding: "24px",
    alignItems: "stretch",
  }}
>
        <div
  style={{
    background: "#f8fafc",
    borderRadius: "28px",
    padding: "40px",
    minHeight: "760px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
  }}
>
  <button
    onClick={() => setColorMetric("revenue")}
    style={{
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1px solid #bbf7d0",
      background: colorMetric === "revenue" ? "#166534" : "white",
      color: colorMetric === "revenue" ? "white" : "#166534",
      fontWeight: "800",
      cursor: "pointer",
    }}
  >
    حسب المبيعات
  </button>

  <button
    onClick={() => setColorMetric("orders")}
    style={{
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1px solid #bbf7d0",
      background: colorMetric === "orders" ? "#166534" : "white",
      color: colorMetric === "orders" ? "white" : "#166534",
      fontWeight: "800",
      cursor: "pointer",
    }}
  >
    حسب الطلبات
  </button>
</div>
  
          <div
            ref={containerRef}
           style={{
  width: "100%",
  maxWidth: "1200px",
}}
            onClick={(e) => {
              const path = e.target.closest("path");
              if (!path) return;

              const id = path.getAttribute("id");
              const region = regionsConstant[id];
              if (!region) return;

              setSelectedRegion({ id, ...region });
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
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
  {[
    { label: "مبيعات عالية", color: "#166534" },
    { label: "مبيعات متوسطة", color: "#16a34a" },
    { label: "مبيعات منخفضة", color: "#4ade80" },
    { label: "لا توجد بيانات", color: "#e5e7eb" },
  ].map((item) => (
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
        </div>

        <aside
  style={{
    background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
    color: "white",
    borderRadius: "28px",
    padding: "28px",
    minHeight: "760px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
  }}
>
  {!selectedRegion ? (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "12px",
        }}
      >
        اختر منطقة
      </p>

      <p
        style={{
          color: "#cbd5e1",
          lineHeight: "30px",
          fontSize: "15px",
        }}
      >
        اضغط على أي منطقة في الخريطة
        <br />
        لعرض التحليل الذكي للمبيعات والطلبات.
      </p>
    </div>
  ) : (
    <>
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            color: "#93c5fd",
            fontSize: "14px",
            marginBottom: "6px",
          }}
        >
          تحليل المنطقة
        </p>

        <h3
          style={{
            fontSize: "34px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          {selectedRegion.nameAr}
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            title: "إجمالي المبيعات",
            value: `${regionStats?.total_revenue || 0} ر.س`,
            bg: "#1e3a8a",
          },
          {
            title: "عدد الطلبات",
            value: regionStats?.total_orders || 0,
            bg: "#065f46",
          },
          {
            title: "متوسط الفاتورة",
            value: `${regionStats?.average_order_value || 0} ر.س`,
            bg: "#5b21b6",
          },
          {
            title: "متوسط القطع",
            value: regionStats?.average_items_per_order || 0,
            bg: "#9a3412",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: item.bg,
              borderRadius: "20px",
              padding: "18px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                opacity: 0.8,
                marginBottom: "10px",
              }}
            >
              {item.title}
            </p>

            <p
              style={{
                fontSize: "24px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {[
          {
            title: "أكثر منتج مبيعًا",
            value: regionStats?.top_product || "لا توجد بيانات",
          },
          {
            title: "أكثر طريقة دفع",
            value:
              regionStats?.top_payment_method || "لا توجد بيانات",
          },
          {
            title: "أقوى قناة بيع",
            value:
              regionStats?.top_sales_channel || "لا توجد بيانات",
          },
          {
            title: "المدن",
            value:
              regionStats?.cities?.join("، ") ||
              selectedRegion.cities,
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "18px",
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              {item.title}
            </p>

            <p
              style={{
                fontSize: "18px",
                fontWeight: "700",
                margin: 0,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </>
  )}
</aside>
      </div>
    </div>
  </section>
);
}
