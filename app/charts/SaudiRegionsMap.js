"use client";

import { useEffect, useRef, useState } from "react";

const REGION_ID_TO_NAME = {
  SA01: "منطقة الرياض",
  SA02: "منطقة مكة المكرمة",
  SA03: "المنطقة الشرقية",
  SA04: "منطقة عسير",
  SA05: "منطقة القصيم",
  SA06: "منطقة حائل",
  SA07: "منطقة تبوك",
  SA08: "منطقة الحدود الشمالية",
  SA09: "منطقة جازان",
  SA10: "منطقة نجران",
  SA11: "منطقة الباحة",
  SA12: "منطقة الجوف",
  SA14: "منطقة المدينة المنورة",
};

export default function SaudiRegionsMap({
  regionsInsights = [],
  selectedRegion,
  onSelectRegion,
}) {
  const mapRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch("/sa.svg")
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  }, []);

  useEffect(() => {
    if (!svgContent || !mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.maxHeight = "560px";
    svg.style.transform = "scale(1.08)";
    svg.style.transformOrigin = "center";

    Object.entries(REGION_ID_TO_NAME).forEach(([id, regionName]) => {
      const regionElement = svg.querySelector(`#${id}`);
      if (!regionElement) return;

      const regionData = regionsInsights.find(
        (r) => r.region === regionName
      );

      const orders = regionData?.total_orders || 0;

      let fillColor = "#d1d5db";

      if (orders >= 5) {
        fillColor = "#15803d";
      } else if (orders >= 3) {
        fillColor = "#22c55e";
      } else if (orders >= 1) {
        fillColor = "#86efac";
      }

      regionElement.style.fill = fillColor;
      regionElement.style.stroke = "#ffffff";
      regionElement.style.strokeWidth = "1.5";
      regionElement.style.cursor = "pointer";
      regionElement.style.transition = "all 0.25s ease";

      if (selectedRegion === regionName) {
        regionElement.style.stroke = "#0f172a";
        regionElement.style.strokeWidth = "3";
      }

      regionElement.onmouseenter = () => {
        regionElement.style.opacity = "0.85";
      };

      regionElement.onmouseleave = () => {
        regionElement.style.opacity = "1";
      };

      regionElement.onclick = () => {
        onSelectRegion(regionName);
      };

      const oldTitle = regionElement.querySelector("title");
      if (oldTitle) oldTitle.remove();

      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );

      title.textContent = `
${regionName}
الطلبات: ${orders}
الإيرادات: ${regionData?.total_revenue || 0} ريال
      `;

      regionElement.appendChild(title);
    });
  }, [svgContent, regionsInsights, selectedRegion, onSelectRegion]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "620px",
        background: "#f8fafc",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <div
        ref={mapRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontSize: "12px",
          fontWeight: "900",
          color: "#0f172a",
        }}
      >
        {[
          ["الرياض", "56%", "53%"],
          ["الشرقية", "72%", "46%"],
          ["مكة", "35%", "55%"],
          ["المدينة", "30%", "41%"],
          ["القصيم", "45%", "38%"],
          ["حائل", "43%", "31%"],
          ["تبوك", "30%", "25%"],
          ["الجوف", "39%", "18%"],
          ["الحدود الشمالية", "53%", "22%"],
          ["عسير", "41%", "67%"],
          ["جازان", "38%", "82%"],
          ["نجران", "57%", "78%"],
          ["الباحة", "35%", "65%"],
        ].map(([name, left, top]) => (
          <span
            key={name}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: "999px",
              padding: "4px 8px",
              boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
