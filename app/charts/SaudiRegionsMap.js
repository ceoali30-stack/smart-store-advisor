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

  // التحكم بعناصر الـ SVG وتحديث البيانات وتأكيد إرسال الأحداث للبطاقات الجانبية
  useEffect(() => {
    if (!svgContent || !mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    // ضبط استجابة أبعاد الـ SVG
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

      // البحث عن بيانات المنطقة القادمة من قاعدة البيانات
      const regionData = regionsInsights.find(
        (r) => r.region === regionName
      );

      const orders = regionData?.total_orders || 0;

      // تحديد ألوان الكثافة البيعية
      let fillColor = "#f3f4f6"; 
      if (orders >= 5) {
        fillColor = "#15803d";
      } else if (orders >= 3) {
        fillColor = "#22c55e";
      } else if (orders >= 1) {
        fillColor = "#86efac";
      }

      // تطبيق الستايل الأساسي
      regionElement.style.fill = fillColor;
      regionElement.style.stroke = "#ffffff";
      regionElement.style.strokeWidth = "1.5";
      regionElement.style.cursor = "pointer";
      regionElement.style.transition = "all 0.2s ease";

      // تمييز المنطقة المحددة حالياً في الكارد الجانبي
      if (selectedRegion === regionName) {
        regionElement.style.stroke = "#0f172a";
        regionElement.style.strokeWidth = "3";
        // رفع حدود العنصر النشط للأعلى
        regionElement.parentNode.appendChild(regionElement); 
      }

      // وظائف الأحداث المحدثة للتأكد من تمرير الاسم الإداري الكامل
      const handleMouseEnter = () => {
        regionElement.style.opacity = "0.8";
      };
      const handleMouseLeave = () => {
        regionElement.style.opacity = "1";
      };
      
      const handleElementClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // منع تداخل الأحداث مع الحاويات الخارجية
        
        if (onSelectRegion) {
          // نمرر هنا اسم المنطقة المعياري بالكامل (مثال: "منطقة الرياض") لتطابق الكارد الجانبي
          onSelectRegion(regionName); 
        }
      };

      // استخدام المقبض المباشر للـ DOM لضمان تخطي أي حواجز برمجية
      regionElement.addEventListener("mouseenter", handleMouseEnter);
      regionElement.addEventListener("mouseleave", handleMouseLeave);
      regionElement.addEventListener("click", handleElementClick);

      // إضافة الـ Tooltip الافتراضي
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
