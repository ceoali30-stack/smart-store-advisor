"use client";
import RegionDetailsPanel from "./components/RegionDetailsPanel";
import MapLegend from "./components/MapLegend";
import { regionsConstant } from "./constants/regionsConstant";
import { useEffect, useMemo, useRef, useState } from "react";
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
const value =
  colorMetric === "orders"
    ? regionData.total_orders || 0
    : regionData.total_revenue || 0;
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
  if (!region) {
    path.style.cursor = "default";
    path.style.fill = "#e5e7eb";
    path.style.stroke = "#ffffff";
    path.style.strokeWidth = "1";
    return;
  }
  path.style.cursor = "pointer";
  path.style.fill = getRegionColor(region.nameAr, id);
  path.style.stroke = "#ffffff";
  path.style.strokeWidth = "1";
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
<MapLegend />
<RegionDetailsPanel
  selectedRegion={selectedRegion}
  regionStats={regionStats}
/>
      </div>
    </div>
  </section>
);
}
