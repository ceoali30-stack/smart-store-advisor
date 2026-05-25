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
  }, [svgContent, selectedRegion]);

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
        </div>

        <aside className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg min-h-[560px]">
          {!selectedRegion ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-lg font-bold mb-2">اختر منطقة</p>
              <p className="text-sm text-slate-300">
                ستظهر هنا بطاقة تحليل ذكية حسب المنطقة المختارة.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-blue-300 mb-1">تحليل المنطقة</p>
              <h3 className="text-3xl font-bold mb-6">
                {selectedRegion.nameAr}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-300">إجمالي المبيعات</p>
                  <p className="text-xl font-bold">
                    {regionStats?.total_revenue || 0} ر.س
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-300">عدد الطلبات</p>
                  <p className="text-xl font-bold">
                    {regionStats?.total_orders || 0}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-300">متوسط الفاتورة</p>
                  <p className="text-xl font-bold">
                    {regionStats?.average_order_value || 0} ر.س
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs text-slate-300">متوسط القطع</p>
                  <p className="text-xl font-bold">
                    {regionStats?.average_items_per_order || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300">أكثر منتج مبيعًا</p>
                  <p className="font-bold mt-1">
                    {regionStats?.top_product || "لا توجد بيانات"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300">أكثر طريقة دفع</p>
                  <p className="font-bold mt-1">
                    {regionStats?.top_payment_method || "لا توجد بيانات"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300">أقوى قناة بيع</p>
                  <p className="font-bold mt-1">
                    {regionStats?.top_sales_channel || "لا توجد بيانات"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-slate-300">المدن</p>
                  <p className="font-bold mt-1">
                    {regionStats?.cities?.join("، ") || selectedRegion.cities}
                  </p>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  </section>
);
}
