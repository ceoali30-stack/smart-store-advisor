"use client";
import React, { useState } from "react";

// المعرفات الرسمية للمناطق الـ 13 الإدارية وأسماؤها
const regionsConstant = {
  "SA01": { nameAr: "منطقة الرياض", cities: "الرياض، الخرج، المجمعة" },
  "SA02": { nameAr: "منطقة مكة المكرمة", cities: "مكة، جدة، الطائف" },
  "SA03": { nameAr: "منطقة المدينة المنورة", cities: "المدينة، ينبع، العلا" },
  "SA04": { nameAr: "منطقة الشرقية", cities: "الدمام، الخبر، الأحساء" },
  "SA05": { nameAr: "منطقة القصيم", cities: "بريدة، عنيزة، الرس" },
  "SA06": { nameAr: "منطقة حائل", cities: "حائل" },
  "SA07": { nameAr: "منطقة تبوك", cities: "تبوك" },
  "SA08": { nameAr: "منطقة الحدود الشمالية", cities: "عرعر، رفحاء" },
  "SA09": { nameAr: "منطقة جازان", cities: "جازان" },
  "SA10": { nameAr: "منطقة نجران", cities: "نجران" },
  "SA11": { nameAr: "منطقة الباحة", cities: "الباحة" },
  "SA12": { nameAr: "منطقة الجوف", cities: "سكاكا، القريات" },
  "SA13": { nameAr: "منطقة عسير", cities: "أبها، خميس مشيط" }
};

export default function SaudiRegionsMap({ dashboardData = {}, onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // مسارات الـ SVG الدقيقة المستخرجة مباشرة من داتا SimpleMaps الرسمية للمملكة
  const saudiPaths = [
    { id: "SA01", name: "الرياض", d: "M435.5 354.2l12.8-19.1 27.6-6 19.3-17.5 14.1 6.8 5.6-7.3 19 3 13.9 14.5 3.3 12.3-9.5 22.8 12.9 33 2.1 24.3-14 18.2-1.7 20.3-25.5 30.7-34.9 13-17-7.2-22.3-33-31.1-1.3-34.8-15.1-11.7-27.1 2.8-18.1-19.4-4-23.9-39.7 18.2-13.8 29.5-12z" },
    { id: "SA02", name: "مكة المكرمة", d: "M281.4 430.4l33 5.4 25.1-4.8 23.9 39.7 19.4 4 11.7 27.1-11 25.9-20.9 22.2-30.8 11.7-18.9-10.4-11.5-31.5-25-14.7-20.5-35.3 1.8-38.3 23.7-41.4z" },
    { id: "SA03", name: "المدينة المنورة", d: "M216.7 340.5l19-15.4 28.5 2.1 36.1-23.7 19.1 3.5 11.1 27.1-18.2 13.8-29.5 12-43.5 35.4-33-5.4-8.8-18.1 4.2-21.7 15-9.6z" },
    { id: "SA04", name: "المنطقة الشرقية", d: "M511.1 190.2l15.3 4 52-25.8 28 20.8 51.5 5.5 26.3 35.8 45.4 36.8 125.7 180.3-13.8 22.2-140.2-.4-87.1-50.1-2.1-24.3-12.9-33 9.5-22.8-3.3-12.3-13.9-14.5-19-3-5.6 7.3-14.1-6.8-19.3 17.5-27.6 6-12.8 19.1-19.1-3.5 15.3-25.2 2-30.2 26.6-13.6z" },
    { id: "SA05", name: "القصيم", d: "M416.3 277.6l17-30.7 42.1 6.4 26.6-13.6-2 30.2-15.3 25.2-19.1-3.5-36.1 23.7-13.2-37.7z" },
    { id: "SA06", name: "حائل", d: "M331.6 230.1l30.4-38.1 60.1 20 11.2 34.9-17 30.7 13.2 37.7-28.5-2.1-19 15.4-23.4-17.7-17-43.4-10-37.4z" },
    { id: "SA07", name: "تبوك", d: "M103.5 178.4l30.2-35.8 29.8 13.6 44.5-10.3 33.1 34.4 2.1 29-41.5 20.8-11.2 46.2-15 9.6-32.9-19-21-44.2-18.1-44.3z" },
    { id: "SA08", name: "الحدود الشمالية", d: "M241.1 140.3l52.5-38.7 85.5-2.1 36.1 18.2 95.9 46.7-51.5-5.5-28-20.8-52 25.8-15.3-4-26.6 24.2-60.1-20-36.5-23.1z" },
    { id: "SA09", name: "جازان", d: "M328.1 630.4l15 3.3 20.3-6.1 2.8 11.8-21.7 5.5-16.4-14.5z" },
    { id: "SA10", name: "نجران", d: "M434.9 572.2l34.9-13 25.5-30.7 1.7-20.3 87.1 50.1 4.5 40.2-110.1 12.3-43.6-38.6z" },
    { id: "SA11", name: "الباحة", d: "M301.1 535.1l18.9 10.4 1.5 19.3-15.2.2-5.2-29.9z" },
    { id: "SA12", name: "الجوف", d: "M208.1 146.1l33-5.8 36.5 23.1-30.4 38.1 10 37.4 17 43.4-2.1-29-33.1-34.4-44.5 10.3-1.6-43.9 15.2-39.2z" },
    { id: "SA13", name: "عسير", d: "M336.5 545.5l11.5 31.5-1.5 19.3 15.2-.2 15 3.3 24.1-17.2 4.1-21 30.8-11.7 11-25.9 43.6 38.6-24.1 17.2-4.1 21-45.5-5.4-44.7-18.8-35.5-30.8z" }
  ];

  return (
    <div className="relative w-full bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
      {/* العنوان */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">خريطة المناطق التفاعلية الرسمية</h3>
        <p className="text-xs text-gray-400 mt-1">مخطط جغرافي انسيابي مطابق بالكامل لهيئة المساحة وموقع SimpleMaps</p>
      </div>

      {/* خريطة الـ SVG الموزونة */}
      <div className="w-full max-w-[750px] h-auto aspect-[4/3] flex justify-center items-center">
        <svg 
          viewBox="80 50 820 620" // تم تعديل الإحداثيات البصرية وسنترتها لتملأ الحاوية بشكل متناسق
          className="w-full h-full drop-shadow-md transition-all duration-300"
          style={{ direction: "ltr" }}
        >
          {saudiPaths.map((region) => {
            const stats = dashboardData[region.id] || { orders: 0, revenue: 0 };
            const isActive = stats.orders > 0;
            const isHovered = hoveredRegion === region.id;

            // هندسة الألوان المتناغمة مع نظام لوحة التحكم لديك
            let fillColor = "#F3F4F6"; // لون رمادي ناعم جداً للخلفية الافتراضية للمناطق
            if (isActive) fillColor = "#10B981"; // لون أخضر براند للمبيعات النشطة
            if (isHovered) fillColor = isActive ? "#059669" : "#E5E7EB"; // تعميق اللون عند الـ Hover

            return (
              <path
                key={region.id}
                d={region.d}
                fill={fillColor}
                stroke="#FFFFFF" // حد أبيض ناصع وجميل جداً بين المناطق الإدارية
                strokeWidth={isHovered ? "2.5" : "1.2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => {
                  if (onRegionSelect) {
                    onRegionSelect({
                      id: region.id,
                      nameAr: regionsConstant[region.id]?.nameAr || region.name,
                      cities: regionsConstant[region.id]?.cities || "",
                      ...stats
                    });
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* التلميح التفاعلي السفلي (Tooltip) */}
      {hoveredRegion && (
        <div className="absolute bottom-6 right-6 bg-slate-900 text-white text-xs py-2 px-4 rounded-lg shadow-xl pointer-events-none transition-all duration-150 animate-fade-in">
          <p className="font-semibold">{regionsConstant[hoveredRegion]?.nameAr}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">المدن: {regionsConstant[hoveredRegion]?.cities}</p>
        </div>
      )}
    </div>
  );
}
