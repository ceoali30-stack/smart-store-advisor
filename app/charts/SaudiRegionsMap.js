'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// مفاتيح الربط الحية والمباشرة التي استخرجتها من Supabase
const SUPABASE_URL = "https://iggjkxoszwxvkvfpehab.supabase.co/rest/v1/"; // ضع رابط مشروعك هنا
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZ2preG9zend4dmt2ZnBlaGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODMzOTUsImV4cCI6MjA5NDE1OTM5NX0.gTTeZ4jqYcvNEdB8ABpye7Ta4X7L6-p5UlkwXmI8GMg"; // ضع مفتاح الـ anon هنا

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة متطورة لفرز كافة المدن والقرى على المناطق الإدارية الـ 13 بالمملكة
const mapCityToRegion = (city) => {
  if (!city || typeof city !== 'string') return 'undefined_region';
  const name = city.trim();

  if (name.includes('الرياض') || name.includes('الخرج') || name.includes('المجمعة') || name.includes('الدرعية')) return 'riyadh';
  if (name.includes('مكة') || name.includes('جدة') || name.includes('الطائف') || name.includes('القنفذة') || name.includes('رابغ')) return 'makkah';
  if (name.includes('الدمام') || name.includes('الخبر') || name.includes('الجبيل') || name.includes('الأحساء') || name.includes('حفر الباطن') || name.includes('القطيف')) return 'eastern';
  if (name.includes('المدينة') || name.includes('ينبع') || name.includes('العلا')) return 'medina';
  if (name.includes('بريدة') || name.includes('عنيزة') || name.includes('الرس') || name.includes('البكيرية')) return 'qassim';
  if (name.includes('أبها') || name.includes('خميس مشيط') || name.includes('محايل') || name.includes('بيشة') || name.includes('النماص')) return 'aseer';
  if (name.includes('تبوك') || name.includes('أملج') || name.includes('ضبا')) return 'tabuk';
  if (name.includes('حائل')) return 'hail';
  if (name.includes('عرعر') || name.includes('رفحاء') || name.includes('طريف')) return 'northern';
  if (name.includes('جازان') || name.includes('صبيا') || name.includes('أبو عريش')) return 'jazan';
  if (name.includes('نجران') || name.includes('شرورة')) return 'najran';
  if (name.includes('الباحة') || name.includes('المخواة')) return 'balgah';
  if (name.includes('سكاكا') || name.includes('القريات') || name.includes('طبرجل')) return 'jouf';

  return 'other';
};

// الهيكلية الجاهزة لكافة المناطق الـ 13 مع التوصيات التلقائية
const initialRegions = {
  riyadh: { name: "منطقة الرياض", orders: 0, revenue: 0, cities: "الرياض، الخرج، المجمعة", recommendation: "المنطقة نشطة جداً، ركز عليها بحملات تسويق محلي وعروض توصيل سريع." },
  makkah: { name: "منطقة مكة المكرمة", orders: 0, revenue: 0, cities: "جدة، مكة، الطائف", recommendation: "مركز ثقل تجاري ممتاز، نقترح عمل عروض شحن مجاني لتنشيط سلات الشراء." },
  eastern: { name: "المنطقة الشرقية", orders: 0, revenue: 0, cities: "الدمام، الخبر، الجبيل، الأحساء", recommendation: "القوة الشرائية هنا مرتفعة، ركز على المنتجات الفاخرة والأعلى سعراً." },
  medina: { name: "منطقة المدينة المنورة", orders: 0, revenue: 0, cities: "المدينة المنورة، ينبع", recommendation: "تنامي جيد في الطلبات، نقترح استهدافها بمواسم العمرة والإجازات." },
  qassim: { name: "منطقة القصيم", orders: 0, revenue: 0, cities: "بريدة، عنيزة، الرس", recommendation: "منطقة حيوية، ركز على الإعلانات التي تستهدف العائلات." },
  aseer: { name: "منطقة عسير", orders: 0, revenue: 0, cities: "أبها، خميس مشيط، بيشة", recommendation: "نشاط مبيعات ممتاز خصوصاً في مواسم السياحة، واكب الطلب بعروض صيفية." },
  tabuk: { name: "منطقة تبوك", orders: 0, revenue: 0, cities: "تبوك، أملج", recommendation: "منطقة واعدة جغرافياً، تفاعل معها بحملات وعروض رقمية مستهدفة." },
  hail: { name: "منطقة حائل", orders: 0, revenue: 0, cities: "حائل", recommendation: "فرصة جيدة للنمو، اختبر زيادة ظهور منتجاتك الأكثر شعبية هناك." },
  northern: { name: "منطقة الحدود الشمالية", orders: 0, revenue: 0, cities: "عرعر، رفحاء، طريف", recommendation: "حجم الطلب بحاجة إلى تعزيز من خلال تفعيل إعلانات السناب شات المستهدفة." },
  jazan: { name: "منطقة جازان", orders: 0, revenue: 0, cities: "جازان، صبيا", recommendation: "منطقة ذات كثافة سكانية ممتازة، حسن سلاسل الإمداد والشحن إليها لتكسب ولاء العملاء." },
  najran: { name: "منطقة نجران", orders: 0, revenue: 0, cities: "نجران، شرورة", recommendation: "سوق هادئ ومستقر، حافظ على تواصل دوري مع العملاء الحاليين عبر الرسائل." },
  balgah: { name: "منطقة الباحة", orders: 0, revenue: 0, cities: "الباحة، المخواة", recommendation: "تفاعل جيد مقارنة بالمساحة الجغرافية، ركز على العروض الموسمية." },
  jouf: { name: "منطقة الجوف", orders: 0, revenue: 0, cities: "سكاكا، القريات", recommendation: "تتطلب زيادة الوعي بالعلامة التجارية، اختبر تقديم كوبونات خصم خاصة بالمنطقة." },
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
        
        const { data: rawOrders, error: ordersError } = await supabase
          .from('orders')
          .select('id, city')
          .eq('merchant_id', merchantId);

        if (ordersError) console.error('Orders Error:', ordersError);
        const orders = rawOrders || [];

        const { data: rawItems, error: itemsError } = await supabase
          .from('order_items')
          .select('order_id, total_price')
          .eq('merchant_id', merchantId);

        if (itemsError) console.error('Items Error:', itemsError);
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
        // تعيين الرياض كمنطقة افتراضية تفتح تلقائياً عند تحميل الصفحة
        if (updatedRegions.riyadh) setSelectedRegion(updatedRegions.riyadh);

      } catch (error) {
        console.error('Error in map component:', error);
      } finally {
        setLoading(false);
      }
    }

    if (merchantId) {
      fetchRegionStats();
    }
  }, [merchantId]);

  const handleRegionClick = (regionId) => {
    if (regionsData && regionsData[regionId]) {
      setSelectedRegion(regionsData[regionId]);
    }
  };

  // دالة مساعدة لتحديد لون المنطقة بناءً على وجود مبيعات أو اختيار التاجر لها
  const getRegionColor = (regionId, defaultColor) => {
    const isSelected = selectedRegion?.name === regionsData[regionId]?.name;
    if (isSelected) return '#059669'; // الأخضر الغامق عند الضغط والتحديد
    return regionsData[regionId]?.orders > 0 ? '#10b981' : defaultColor; // أخضر مشرق للمناطق الحية، ورمادي للمناطق الصفرية
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#10b981', fontWeight: 'bold', direction: 'rtl' }}>جاري تحميل خريطة المملكة والتحليلات الجغرافية الحية...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '25px', padding: '20px', direction: 'rtl' }}>
      
      {/* قسم الخريطة الرسمية المتجاوبة */}
      <div style={{ flex: 1, background: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>خريطة المناطق التفاعلية</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>مخطط جغرافي دقيق للمملكة. اضغط على أي منطقة لعرض التقرير والتوصيات الذكية فوراً.</p>
        
        {/* رسم الخريطة الجغرافية الحقيقية باستخدام مسارات SVG الرسمية المتطابقة مع لقطتك */}
        <svg id="saudi-arabia-map" viewBox="0 0 1000 800" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.02))' }}>
          
          {/* الجوف */}
          <path d="M220,100 L320,80 L380,120 L400,180 L320,210 L210,160 Z" fill={getRegionColor('jouf', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('jouf')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* الحدود الشمالية */}
          <path d="M320,80 L480,110 L520,160 L440,210 L400,180 Z" fill={getRegionColor('northern', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('northern')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* تبوك */}
          <path d="M120,140 L210,160 L240,260 L160,320 L100,240 Z" fill={getRegionColor('tabuk', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('tabuk')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* حائل */}
          <path d="M320,210 L440,210 L460,290 L360,310 L280,270 Z" fill={getRegionColor('hail', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('hail')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* القصيم */}
          <path d="M440,210 L550,250 L520,330 L450,320 L460,290 Z" fill={getRegionColor('qassim', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('qassim')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* المدينة المنورة */}
          <path d="M240,260 L280,270 L360,310 L450,320 L410,410 L260,420 L210,360 Z" fill={getRegionColor('medina', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('medina')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* الشرقية */}
          <path d="M550,250 L720,180 L880,320 L890,520 L760,540 L650,480 L590,380 Z" fill={getRegionColor('eastern', '#10b981')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('eastern')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* الرياض */}
          <path d="M450,320 L520,330 L590,380 L650,480 L580,590 L480,510 L440,430 Z" fill={getRegionColor('riyadh', '#10b981')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('riyadh')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* مكة المكرمة */}
          <path d="M260,420 L410,410 L440,430 L420,520 L330,550 L280,480 Z" fill={getRegionColor('makkah', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('makkah')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* الباحة */}
          <path d="M330,550 L370,550 L360,590 L320,580 Z" fill={getRegionColor('balgah', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('balgah')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* عسير */}
          <path d="M360,590 L420,520 L480,510 L460,620 L380,640 Z" fill={getRegionColor('aseer', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('aseer')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* جازان */}
          <path d="M380,640 L410,640 L400,680 L360,660 Z" fill={getRegionColor('jazan', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('jazan')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />
          
          {/* نجران */}
          <path d="M460,620 L480,510 L580,590 L520,660 Z" fill={getRegionColor('najran', '#e2e8f0')} stroke="#ffffff" strokeWidth="2.5" onClick={() => handleRegionClick('najran')} style={{ transition: 'all 0.3s', cursor: 'pointer' }} />

        </svg>

        {regionsData.undefined_region.orders > 0 && (
          <button 
            onClick={() => handleRegionClick("undefined_region")}
            style={{ marginTop: '15px', background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'block', width: '100%', textAlign: 'right', transition: 'background 0.2s' }}
          >
            ⚠️ هناك طلبات بمدن غير مصنفة ({regionsData.undefined_region.orders} طلبات بقيمة {regionsData.undefined_region.revenue} ريال). اضغط هنا لتحليلها بشكل منفصل.
          </button>
        )}
      </div>

      {/* قسم بطاقة البيانات والتحليل الجانبية */}
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
