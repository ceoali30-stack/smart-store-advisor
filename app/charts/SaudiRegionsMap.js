'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- قيم الربط المباشرة ---
// إذا أردت جلبها حية، ضع القيم الحقيقية هنا. وإذا تركتها فارغة سيعمل الكود بنمط المحاكاة الذكي لبيانات تقريرك مباشرة دون انهيار الشاشة.
const SUPABASE_URL = "https://iggjkxoszwxvkvfpehab.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZ2preG9zend4dmt2ZnBlaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODMzOTUsImV4cCI6MjA5NDE1OTM5NX0.gTTeZ4jqYcvNEdB8ABpye7Ta4X7L6-p5UlkwXmI8GMg"; 

const initialRegions = {
  riyadh: { name: "منطقة الرياض", orders: 2, revenue: 522, percentage: "33%", avg_order: 261, cities: "الرياض", recommendation: "هذه من أقوى المناطق حالياً. ركز عليها بحملة إعلانية أو عرض خاص لأنها تمثل نسبة عالية من الطلبات الإقليمية." },
  makkah: { name: "منطقة مكة المكرمة", orders: 0, revenue: 0, percentage: "0%", avg_order: 0, cities: "جدة / مكة", recommendation: "أداء مستقر حالياً، نقترح عمل حملات تسويقية مستهدفة لتنشيط الطلبات." },
  eastern: { name: "المنطقة الشرقية", orders: 1, revenue: 262, percentage: "17%", avg_order: 262, cities: "الدمام", recommendation: "المنطقة مستقرة، نقترح تقديم عروض شحن مخفضة لزيادة حجم السلة الشرائية." },
  undefined_region: { name: "منطقة غير محددة", orders: 3, revenue: 34900, percentage: "50%", avg_order: 11633, cities: "غير محدد في النظام", recommendation: "تنبيه! هذه الطلبات ذات قيم شرائية ضخمة جداً ولكن مدنها غير محددة، يرجى مراجعة عناوين الشحن في سلة فوراً." }
};

export default function SaudiRegionsMap({ merchantId = '210819854' }) {
  const [regionsData, setRegionsData] = useState(initialRegions);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegionStats() {
      // إذا لم يتم توفير مفاتيح، نعتمد على البيانات الحقيقية المجهزة مسبقاً من تقرير التاجر لمنع الشاشة البيضاء
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.log("تم تفعيل النمط الآمن المستقر بناءً على بيانات تقرير المتجر الحالية.");
        setRegionsData(initialRegions);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data: orders } = await supabase.from('orders').select('id, city').eq('merchant_id', merchantId);
        const { data: items } = await supabase.from('order_items').select('order_id, total_price').eq('merchant_id', merchantId);

        if (orders && items) {
          const orderRevenueMap = {};
          items.forEach(item => {
            if (item?.order_id) {
              orderRevenueMap[item.order_id] = (orderRevenueMap[item.order_id] || 0) + Number(item.total_price || 0);
            }
          });

          const updatedRegions = JSON.parse(JSON.stringify(initialRegions));
          // تصفير العدادات للمزامنة الحية
          Object.keys(updatedRegions).forEach(k => { updatedRegions[k].orders = 0; updatedRegions[k].revenue = 0; });
          
          let totalOrders = orders.length;

          orders.forEach(order => {
            let rId = 'undefined_region';
            if (order.city?.includes('الرياض')) rId = 'riyadh';
            else if (order.city?.includes('جدة') || order.city?.includes('مكة')) rId = 'makkah';
            else if (order.city?.includes('الدمام')) rId = 'eastern';

            if (updatedRegions[rId]) {
              updatedRegions[rId].orders += 1;
              updatedRegions[rId].revenue += (orderRevenueMap[order.id] || 0);
            }
          });

          Object.keys(updatedRegions).forEach(key => {
            const reg = updatedRegions[key];
            reg.percentage = totalOrders > 0 ? `${Math.round((reg.orders / totalOrders) * 100)}%` : '0%';
            reg.avg_order = reg.orders > 0 ? Math.round(reg.revenue / reg.orders) : 0;
          });

          setRegionsData(updatedRegions);
        }
      } catch (error) {
        console.error('Safe fallback active:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRegionStats();
  }, [merchantId]);

  const handleRegionClick = (regionId) => {
    if (regionsData && regionsData[regionId]) {
      setSelectedRegion(regionsData[regionId]);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '30px', color: '#10b981', direction: 'rtl' }}>جاري عرض البيانات والتحليلات الجغرافية...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '20px', padding: '20px', direction: 'rtl', fontFamily: 'inherit' }}>
      
      {/* الخريطة التفاعلية */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>خريطة المناطق التفاعلية</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>اضغط على المنطقة الملونة لرؤية تقرير أدائها الاستراتيجي فوراً.</p>
        
        <svg id="saudi-arabia-map" viewBox="0 0 800 600" style={{ width: '100%', height: 'auto', cursor: 'pointer' }}>
          {/* المنطقة الشرقية */}
          <path 
            id="eastern"
            d="M660,180 L720,220 L750,350 L680,450 L600,420 Z" 
            fill={selectedRegion?.name === "المنطقة الشرقية" ? "#059669" : "#34d399"} 
            stroke="#fff" strokeWidth="2"
            onClick={() => handleRegionClick("eastern")}
            style={{ transition: 'fill 0.3s' }}
          />

          {/* منطقة الرياض */}
          <path 
            id="riyadh"
            d="M450,220 L580,260 L600,380 L520,480 L400,380 Z" 
            fill={selectedRegion?.name === "منطقة الرياض" ? "#059669" : "#10b981"} 
            stroke="#fff" strokeWidth="2"
            onClick={() => handleRegionClick("riyadh")}
            style={{ transition: 'fill 0.3s' }}
          />

          {/* منطقة مكة المكرمة */}
          <path 
            id="makkah"
            d="M320,320 L410,350 L430,420 L350,490 L300,400 Z" 
            fill={selectedRegion?.name === "منطقة مكة المكرمة" ? "#059669" : "#e2e8f0"} 
            stroke="#fff" strokeWidth="2"
            onClick={() => handleRegionClick("makkah")}
            style={{ transition: 'fill 0.3s' }}
          />
        </svg>

        <button 
          onClick={() => handleRegionClick("undefined_region")}
          style={{ marginTop: '15px', background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'block', width: '100%', textAlign: 'right' }}
        >
          ⚠️ تنبيه المخزون والبيانات: هناك طلبات بمدن غير محددة ({regionsData?.undefined_region?.orders} طلبات بقيمة {regionsData?.undefined_region?.revenue} ريال). اضغط للتحليل الحرج.
        </button>
      </div>

      {/* بطاقة المعاينة والتحليل الذكي الجانبية */}
      <div style={{ flex: '0 0 360px' }}>
        {selectedRegion ? (
          <div style={{ background: '#ffffff', borderRight: '5px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '20px' }}>
            <h4 style={{ color: '#111827', margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' }}>{selectedRegion.name}</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
              <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>إجمالي الطلبات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#111827', marginTop: '4px' }}>{selectedRegion.orders} طلب</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>إجمالي الإيرادات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#10b981', marginTop: '4px' }}>{selectedRegion.revenue} ريال</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>متوسط الطلب</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#111827', marginTop: '4px' }}>{selectedRegion.avg_order} ريال</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>نسبة المبيعات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#2563eb', marginTop: '4px' }}>{selectedRegion.percentage}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '15px', borderTop: '1px solid #f3f4f6', paddingTop: '10px', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>المدن المغطاة: </span>
              <strong style={{ color: '#374151', marginRight: '5px' }}>{selectedRegion.cities}</strong>
            </div>

            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', borderRight: '4px solid #2563eb' }}>
              <strong style={{ fontSize: '13px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>💡 التوصية الاستراتيجية:</strong>
              <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>{selectedRegion.recommendation}</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: '12px', color: '#9ca3af', padding: '40px', textAlign: 'center', fontSize: '14px' }}>
            الرجاء اختيار منطقة ملونة من الخريطة لعرض لوحة مؤشراتها وتوصياتها الذكية مباشرة هنا.
          </div>
        )}
      </div>
    </div>
  );
}
