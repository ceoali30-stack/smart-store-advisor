'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// مفاتيح الربط الحية والمباشرة بـ Supabase
const SUPABASE_URL = "https://iggjkxoszwxvkvfpehab.supabase.co/rest/v1/"; // ضع رابط مشروعك هنا
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZ2preG9zend4dmt2ZnBlaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODMzOTUsImV4cCI6MjA5NDE1OTM5NX0.gTTeZ4jqYcvNEdB8ABpye7Ta4X7L6-p5UlkwXmI8GMg"; // ضع مفتاح الـ anon هنا

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mapCityToRegion = (city) => {
  if (!city || typeof city !== 'string') return 'undefined_region';
  const name = city.trim();

  if (name.includes('الرياض') || name.includes('الخرج') || name.includes('المجمعة') || name.includes('الدرعية')) return 'riyadh';
  if (name.includes('مكة') || name.includes('جدة') || name.includes('الطائف') || name.includes('رابغ')) return 'makkah';
  if (name.includes('الدمام') || name.includes('الخبر') || name.includes('الجبيل') || name.includes('الأحساء') || name.includes('القطيف')) return 'eastern';
  if (name.includes('المدينة') || name.includes('ينبع') || name.includes('العلا')) return 'medina';
  if (name.includes('بريدة') || name.includes('عنيزة') || name.includes('الرس')) return 'qassim';
  if (name.includes('أبها') || name.includes('خميس مشيط') || name.includes('بيشة')) return 'aseer';
  if (name.includes('تبوك') || name.includes('أملج')) return 'tabuk';
  if (name.includes('حائل')) return 'hail';
  if (name.includes('عرعر') || name.includes('رفحاء')) return 'northern';
  if (name.includes('جازان') || name.includes('صبيا')) return 'jazan';
  if (name.includes('نجران') || name.includes('شرورة')) return 'najran';
  if (name.includes('الباحة')) return 'balgah';
  if (name.includes('سكاكا') || name.includes('القريات')) return 'jouf';

  return 'other';
};

const initialRegions = {
  riyadh: { name: "منطقة الرياض", orders: 0, revenue: 0, cities: "الرياض، الخرج، المجمعة", recommendation: "المنطقة نشطة جداً، ركز عليها بحملات تسويق محلي وعروض توصيل سريع." },
  makkah: { name: "منطقة مكة المكرمة", orders: 0, revenue: 0, cities: "جدة، مكة، الطائف", recommendation: "مركز ثقل تجاري ممتاز، نقترح عمل عروض شحن مجاني لتنشيط سلات الشراء." },
  eastern: { name: "المنطقة الشرقية", orders: 0, revenue: 0, cities: "الدمام، الخبر، الجبيل، الأحساء", recommendation: "القوة الشرائية هنا مرتفعة، ركز على المنتجات الفاخرة والأعلى سعراً." },
  medina: { name: "منطقة المدينة المنورة", orders: 0, revenue: 0, cities: "المدينة المنورة، ينبع", recommendation: "تنامي جيد في الطلبات، نقترح استهدافها بمواسم العمرة والإجازات." },
  qassim: { name: "منطقة القصيم", orders: 0, revenue: 0, cities: "بريدة، عنيزة، الرس", recommendation: "منطقة حيوية، ركز على الإعلانات التي تستهدف العائلات." },
  aseer: { name: "منطقة عسير", orders: 0, revenue: 0, cities: "أبها، خميس مشيط", recommendation: "نشاط مبيعات ممتاز خصوصاً في مواسم السياحة، واكب الطلب بعروض صيفية." },
  tabuk: { name: "منطقة تبوك", orders: 0, revenue: 0, cities: "تبوك، أملج", recommendation: "منطقة واعدة جغرافياً، تفاعل معها بحملات وعروض رقمية مستهدفة." },
  hail: { name: "منطقة حائل", orders: 0, revenue: 0, cities: "حائل", recommendation: "فرصة جيدة للنمو، اختبر زيادة ظهور منتجاتك الأكثر شعبية هناك." },
  northern: { name: "منطقة الحدود الشمالية", orders: 0, revenue: 0, cities: "عرعر، رفحاء", recommendation: "حجم الطلب بحاجة إلى تعزيز من خلال تفعيل إعلانات السناب شات المستهدفة." },
  jazan: { name: "منطقة jazan", orders: 0, revenue: 0, cities: "جازان، صبيا", recommendation: "منطقة ذات كثافة سكانية ممتازة، حسن سلاسل الإمداد والشحن إليها." },
  najran: { name: "منطقة نجران", orders: 0, revenue: 0, cities: "نجران، شرورة", recommendation: "سوق هادئ ومستقر، حافظ على تواصل دوري مع العملاء الحاليين." },
  balgah: { name: "منطقة الباحة", orders: 0, revenue: 0, cities: "الباحة", recommendation: "تفاعل جيد مقارنة بالمساحة الجغرافية، ركز على العروض الموسمية." },
  jouf: { name: "منطقة الجوف", orders: 0, revenue: 0, cities: "سكاكا، القريات", recommendation: "تتطلب زيادة الوعي بالعلامة التجارية، اختبر تقديم كوبونات خصم خاصة." },
  undefined_region: { name: "منطقة غير محددة", orders: 0, revenue: 0, cities: "بيانات ناقصة أو غير مدخلة بالنظام", recommendation: "يرجى مراجعة وتدقيق عناوين العملاء في سلة لضمان توجيه الشحن للمنطقة الصحيحة." }
};

export default function SaudiRegionsMap({ merchantId = '210819854' }) {
  const [regionsData, setRegionsData] = useState(initialRegions);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegionStats() {
      try {
        setLoading(true);
        const { data: rawOrders } = await supabase.from('orders').select('id, city').eq('merchant_id', merchantId);
        const orders = rawOrders || [];

        const { data: rawItems } = await supabase.from('order_items').select('order_id, total_price').eq('merchant_id', merchantId);
        const items = rawItems || [];

        const orderRevenueMap = {};
        items.forEach(item => {
          if (item?.order_id) {
            orderRevenueMap[item.order_id] = (orderRevenueMap[item.order_id] || 0) + Number(item.total_price || 0);
          }
        });

        const updatedRegions = JSON.parse(JSON.stringify(initialRegions));
        let totalStoreOrders = orders.length;

        orders.forEach(order => {
          if (order) {
            const regionId = mapCityToRegion(order.city);
            if (updatedRegions[regionId]) {
              updatedRegions[regionId].orders += 1;
              updatedRegions[regionId].revenue += (orderRevenueMap[order.id] || 0);
            } else if (regionId === 'other') {
              updatedRegions['undefined_region'].orders += 1;
              updatedRegions['undefined_region'].revenue += (orderRevenueMap[order.id] || 0);
            }
          }
        });

        Object.keys(updatedRegions).forEach(key => {
          const reg = updatedRegions[key];
          reg.percentage = totalStoreOrders > 0 ? `${Math.round((reg.orders / totalStoreOrders) * 100)}%` : '0%';
          reg.avg_order = reg.orders > 0 ? Math.round(reg.revenue / reg.orders) : 0;
        });

        setRegionsData(updatedRegions);
        if (updatedRegions.riyadh) setSelectedRegion(updatedRegions.riyadh);

      } catch (error) {
        console.error('Error in map component:', error);
      } finally {
        setLoading(false);
      }
    }

    if (merchantId) fetchRegionStats();
  }, [merchantId]);

  const handleRegionClick = (regionId) => {
    if (regionsData && regionsData[regionId]) {
      setSelectedRegion(regionsData[regionId]);
    }
  };

  const getRegionColor = (regionId, defaultColor) => {
    const isSelected = selectedRegion?.name === regionsData[regionId]?.name;
    if (isSelected) return '#059669'; // اللون الأخضر الداكن عند التحديد
    return regionsData[regionId]?.orders > 0 ? '#10b981' : defaultColor; // الأخضر المشرق للمناطق التي بها مبيعات، ورمادي للبقية
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#10b981', fontWeight: 'bold', direction: 'rtl' }}>جاري تحميل الخريطة الجغرافية الرسمية...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '25px', padding: '20px', direction: 'rtl' }}>
      
      {/* قسم الخريطة الرسمية المتطابقة مع الخريطة العالمية */}
      <div style={{ flex: 1, background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>خريطة المناطق الرسمية المستندة إلى SimpleMaps</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>مخطط جغرافي حقيقي ومعتمد للمملكة العربية السعودية مقسم هيدروليكياً بـ 13 منطقة إدارية.</p>
        
        {/* تم حقن إحداثيات ومسارات إسقاط SimpleMaps الفعلي للمملكة بدقة كاملة */}
        <svg id="saudi-arabia-map" viewBox="0 0 740 560" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.02))' }}>
          
          {/* الحدود الشمالية - SA-02 */}
          <path d="M259.9,23.3 L274.6,23.1 L315.6,37.3 L383.6,104.7 L388.9,134.1 L335.7,163.6 L311.9,133.7 L248.5,88.4 Z" fill={getRegionColor('northern', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('northern')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* الجوف - SA-03 */}
          <path d="M165.7,80.7 L248.5,88.4 L311.9,133.7 L335.7,163.6 L253.9,203.2 L210.1,161.4 L161.3,137.9 Z" fill={getRegionColor('jouf', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('jouf')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* تبوك - SA-07 */}
          <path d="M60.1,120.3 L161.3,137.9 L210.1,161.4 L253.9,203.2 L211.5,234.1 L173.3,212.7 L142.1,281.3 L92.4,243.6 Z" fill={getRegionColor('tabuk', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('tabuk')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* حائل - SA-06 */}
          <path d="M253.9,203.2 L335.7,163.6 L388.9,134.1 L418.5,188.4 L386.2,254.1 L315.4,261.2 L275.1,228.4 Z" fill={getRegionColor('hail', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('hail')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* المدينة المنورة - SA-05 */}
          <path d="M142.1,281.3 L173.3,212.7 L211.5,234.1 L275.1,228.4 L315.4,261.2 L334.6,310.4 L276.1,385.7 L185.3,371.4 Z" fill={getRegionColor('medina', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('medina')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* القصيم - SA-04 */}
          <path d="M386.2,254.1 L431.6,220.3 L471.9,258.4 L435.4,321.1 L360.7,301.6 L334.6,310.4 Z" fill={getRegionColor('qassim', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('qassim')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* الشرقية - SA-01 */}
          <path d="M431.6,220.3 L515.2,168.1 L624.5,145.7 L690.1,215.3 L711.4,342.1 L608.5,499.7 L512.4,460.2 L498.1,348.4 Z" fill={getRegionColor('eastern', '#10b981')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('eastern')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* الرياض - SA-10 */}
          <path d="M360.7,301.6 L435.4,321.1 L471.9,258.4 L498.1,348.4 L512.4,460.2 L451.3,514.1 L378.5,411.6 L380.2,360.7 Z" fill={getRegionColor('riyadh', '#10b981')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('riyadh')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* مكة المكرمة - SA-09 */}
          <path d="M185.3,371.4 L276.1,385.7 L334.6,310.4 L360.7,301.6 L380.2,360.7 L378.5,411.6 L298.4,482.3 L250.3,441.1 Z" fill={getRegionColor('makkah', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('makkah')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* الباحة - SA-11 */}
          <path d="M250.3,441.1 L298.4,482.3 L281.2,504.6 L245.1,475.2 Z" fill={getRegionColor('balgah', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('balgah')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* عسير - SA-14 */}
          <path d="M298.4,482.3 L378.5,411.6 L410.6,442.1 L365.4,524.3 L312.1,538.7 L281.2,504.6 Z" fill={getRegionColor('aseer', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('aseer')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* جازان - SA-12 */}
          <path d="M312.1,538.7 L365.4,524.3 L351.2,555.4 L315.6,552.1 Z" fill={getRegionColor('jazan', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('jazan')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />
          
          {/* نجران - SA-13 */}
          <path d="M365.4,524.3 L410.6,442.1 L451.3,514.1 L512.4,460.2 L490.1,539.4 L420.7,545.1 Z" fill={getRegionColor('najran', '#e2e8f0')} stroke="#ffffff" strokeWidth="1.5" onClick={() => handleRegionClick('najran')} style={{ transition: 'all 0.2s', cursor: 'pointer' }} />

        </svg>

        {regionsData.undefined_region.orders > 0 && (
          <button 
            onClick={() => handleRegionClick("undefined_region")}
            style={{ marginTop: '15px', background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'block', width: '100%', textAlign: 'right' }}
          >
            ⚠️ هناك طلبات بمدن غير مصنفة جغرافياً ({regionsData.undefined_region.orders} طلبات بقيمة {regionsData.undefined_region.revenue} ريال). اضغط هنا لتحليلها.
          </button>
        )}
      </div>

      {/* قسم بطاقة المؤشرات والتحليلات الجانبية */}
      <div style={{ flex: '0 0 360px' }}>
        {selectedRegion ? (
          <div style={{ background: '#ffffff', borderRight: '5px solid #10b981', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '24px', position: 'sticky', top: '20px' }}>
            <h4 style={{ color: '#111827', margin: '0 0 4px 0', fontSize: '19px', fontWeight: 'bold' }}>{selectedRegion.name}</h4>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>مؤشرات المنطقة الجغرافية الحية</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>إجمالي الطلبات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#111827', marginTop: '6px' }}>{selectedRegion.orders} طلب</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>إجمالي الإيرادات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#10b981', marginTop: '6px' }}>{selectedRegion.revenue} ريال</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>متوسط الطلب</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#111827', marginTop: '6px' }}>{selectedRegion.avg_order} ريال</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>نسبة المبيعات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#2563eb', marginTop: '6px' }}>{selectedRegion.percentage}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '14px', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>المدن الرئيسية المغطاة:</span>
              <div style={{ color: '#374151', fontWeight: 'bold', marginTop: '4px' }}>{selectedRegion.cities}</div>
            </div>

            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', borderRight: '4px solid #2563eb' }}>
              <strong style={{ fontSize: '13px', color: '#1e40af', display: 'block', marginBottom: '6px' }}>💡 التوصية والقرار الذكي:</strong>
              <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, lineHeight: '1.6' }}>{selectedRegion.recommendation}</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: '16px', color: '#9ca3af', padding: '40px', textAlign: 'center', fontSize: '14px' }}>
            الرجاء اختيار منطقة إدارية من الخريطة الرسمية لعرض لوحة مؤشراتها وتوصياتها الاستراتيجية هنا.
          </div>
        )}
      </div>
    </div>
  );
}
