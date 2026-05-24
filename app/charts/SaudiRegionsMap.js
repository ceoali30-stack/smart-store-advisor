"use client";

import { useEffect, useRef, useState } from "react";

// إذا كانت قاعدة البيانات ترسل الأسماء بدون كلمة "منطقة"، فهذا الجدول سيحل المشكلة فوراً
const REGION_ID_TO_NAME = {
  SA01: "الرياض",
  SA02: "مكة المكرمة",
  SA03: "المدينة المنورة",
  SA04: "الشرقية",
  SA05: "القصيم",
  SA06: "حائل",
  SA07: "تبوك",
  SA08: "الحدود الشمالية",
  SA09: "جازان",
  SA10: "نجران",
  SA11: "الباحة",
  SA12: "الجوف",
  SA13: "عسير",
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
      .then((data) => setSvgContent(data))
      .catch((err) => console.error("Error loading SVG:", err));
  }, []);

  useEffect(() => {
    if (!svgContent || !mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.maxHeight = "580px";
    svg.style.transform = "scale(1.02)";
    svg.style.transformOrigin = "center";

    const elementsToClean = [];

    Object.entries(REGION_ID_TO_NAME).forEach(([id, regionName]) => {
      const regionElement = svg.querySelector(`#${id}`);
      if (!regionElement) return;

      elementsToClean.push(regionElement);

      // البحث عن التطابق في البيانات
      const regionData = regionsInsights.find(
        (r) => r.region === regionName || r.region?.replace("منطقة ", "") === regionName
      );

      const orders = regionData?.total_orders || 0;

      let fillColor = "#f3f4f6";
      if (orders >= 5) fillColor = "#15803d";
      else if (orders >= 3) fillColor = "#22c55e";
      else if (orders >= 1) fillColor = "#86efac";

      regionElement.style.fill = fillColor;
      regionElement.style.stroke = "#ffffff";
      regionElement.style.strokeWidth = "1.5";
      regionElement.style.cursor = "pointer";
      regionElement.style.transition = "all 0.2s ease";

      if (selectedRegion === regionName) {
        regionElement.style.stroke = "#0f172a";
        regionElement.style.strokeWidth = "3";
        regionElement.parentNode.appendChild(regionElement); 
      }

      const handleMouseEnter = () => { regionElement.style.opacity = "0.8"; };
      const handleMouseLeave = () => { regionElement.style.opacity = "1"; };
      
      const handleElementClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSelectRegion) {
          onSelectRegion(regionName); // تفعيل التغيير فوراً عند النقر
        }
      };

      regionElement.addEventListener("mouseenter", handleMouseEnter);
      regionElement.addEventListener("mouseleave", handleMouseLeave);
      regionElement.addEventListener("click", handleElementClick);

      const oldTitle = regionElement.querySelector("title");
      if (oldTitle) oldTitle.remove();

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${regionName}\nالطلبات: ${orders}\nالإيرادات: ${regionData?.total_revenue || 0} ريال`;
      regionElement.appendChild(title);

      regionElement._cleanUp = () => {
        regionElement.removeEventListener("mouseenter", handleMouseEnter);
        regionElement.removeEventListener("mouseleave", handleMouseLeave);
        regionElement.removeEventListener("click", handleElementClick);
      };
    });

    return () => {
      elementsToClean.forEach((el) => {
        if (el._cleanUp) el._cleanUp();
      });
    };
  }, [svgContent, regionsInsights, selectedRegion, onSelectRegion]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "600px",
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        ref={mapRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: "100%", height: "100%", maxWidth: "700px" }}
      />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontSize: "11px", fontWeight: "700", color: "#1e293b" }}>
        {[
          ["الرياض", "54%", "50%"],
          ["الشرقية", "74%", "44%"],
          ["مكة المكرمة", "34%", "56%"],
          ["المدينة المنورة", "29%", "42%"],
          ["القصيم", "46%", "37%"],
          ["حائل", "41%", "31%"],
          ["تبوك", "24%", "24%"],
          ["الجوف", "36%", "16%"],
          ["الحدود الشمالية", "51%", "19%"],
          ["عسير", "39%", "69%"],
          ["جازان", "37%", "78%"],
          ["نجران", "52%", "73%"],
          ["الباحة", "34%", "64%"],
        ].map(([name, left, top]) => (
          <span key={name} style={{ position: "absolute", left, top, transform: "translate(-50%, -50%)", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)", border: "1px solid rgba(226, 232, 240, 0.8)", borderRadius: "30px", padding: "3px 8px", boxShadow: "0 2px 5px rgba(0,0,0,0.04)", whiteSpace: "nowrap" }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
