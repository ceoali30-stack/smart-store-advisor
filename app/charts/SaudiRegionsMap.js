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

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.maxWidth = "100%";
    svg.style.height = "auto";

    const paths = svg.querySelectorAll("path");

    paths.forEach((path) => {
      const id = path.getAttribute("id");
      const region = regionsConstant[id];

      path.style.cursor = region ? "pointer" : "default";
      path.style.fill = selectedRegion?.id === id ? "#2563eb" : "#e5e7eb";
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

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {!selectedRegion ? (
            <p className="text-gray-500 leading-7">
              اضغط على أي منطقة في الخريطة لعرض التحليل الذكي.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-1">تحليل المنطقة</p>

              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                {selectedRegion.nameAr}
              </h3>

              {loadingInsights ? (
                <p className="text-gray-500">جاري تحميل بيانات المنطقة...</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">إجمالي المبيعات</p>
                      <p className="font-bold text-lg">
                        {regionStats?.total_revenue || 0} ر.س
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">عدد الطلبات</p>
                      <p className="font-bold text-lg">
                        {regionStats?.total_orders || 0}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">متوسط الفاتورة</p>
                      <p className="font-bold text-lg">
                        {regionStats?.average_order_value || 0} ر.س
                      </p>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">متوسط القطع</p>
                      <p className="font-bold text-lg">
                        {regionStats?.average_items_per_order || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm leading-7">
                    <p>
                      <span className="text-gray-500">أكثر منتج مبيعًا: </span>
                      <b>{regionStats?.top_product || "لا توجد بيانات"}</b>
                    </p>

                    <p>
                      <span className="text-gray-500">أكثر طريقة دفع: </span>
                      <b>{regionStats?.top_payment_method || "لا توجد بيانات"}</b>
                    </p>

                    <p>
                      <span className="text-gray-500">أقوى قناة بيع: </span>
                      <b>{regionStats?.top_sales_channel || "لا توجد بيانات"}</b>
                    </p>

                    <p>
                      <span className="text-gray-500">المدن: </span>
                      <b>
                        {regionStats?.cities?.join("، ") ||
                          selectedRegion.cities}
                      </b>
                    </p>

                    <p className="text-xs text-gray-400 pt-2">
                      كود المنطقة: {selectedRegion.id}
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
