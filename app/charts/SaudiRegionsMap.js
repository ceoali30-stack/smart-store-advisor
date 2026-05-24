"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    let isMounted = true;

    async function loadSvg() {
      try {
        const res = await fetch("/sa.svg");
        if (!res.ok) throw new Error("SVG file not found");

        const text = await res.text();

        if (isMounted) {
          setSvgContent(text);
        }
      } catch (error) {
        console.error("Error loading sa.svg:", error);
      }
    }

    loadSvg();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.maxWidth = "100%";
    svg.style.height = "auto";

    const paths = svg.querySelectorAll("path");

    paths.forEach((path) => {
      const id = path.getAttribute("id");
      const region = regionsConstant[id];

      path.style.cursor = region ? "pointer" : "default";
      path.style.fill = region ? "#e5e7eb" : "#f3f4f6";
      path.style.stroke = "#ffffff";
      path.style.strokeWidth = "1";

      if (!region) return;

      const handleMouseEnter = () => {
        path.style.fill = "#60a5fa";
      };

      const handleMouseLeave = () => {
        path.style.fill = selectedRegion?.id === id ? "#2563eb" : "#e5e7eb";
      };

      const handleClick = () => {
        setSelectedRegion({
          id,
          ...region,
        });
      };

      path.addEventListener("mouseenter", handleMouseEnter);
      path.addEventListener("mouseleave", handleMouseLeave);
      path.addEventListener("click", handleClick);

      path._cleanup = () => {
        path.removeEventListener("mouseenter", handleMouseEnter);
        path.removeEventListener("mouseleave", handleMouseLeave);
        path.removeEventListener("click", handleClick);
      };
    });

    return () => {
      paths.forEach((path) => {
        if (path._cleanup) path._cleanup();
      });
    };
  }, [svgContent, selectedRegion]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        خريطة مناطق المملكة
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            className="w-full min-h-[420px] flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          {selectedRegion ? (
            <>
              <p className="text-sm text-gray-500 mb-1">المنطقة المحددة</p>
              <h3 className="text-2xl font-bold text-blue-700 mb-3">
                {selectedRegion.nameAr}
              </h3>
              <p className="text-gray-700 leading-7">
                <span className="font-semibold">أبرز المدن: </span>
                {selectedRegion.cities}
              </p>
              <p className="text-xs text-gray-400 mt-4">
                كود المنطقة: {selectedRegion.id}
              </p>
            </>
          ) : (
            <p className="text-gray-500 leading-7">
              اضغط على أي منطقة في الخريطة لعرض تفاصيلها.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
