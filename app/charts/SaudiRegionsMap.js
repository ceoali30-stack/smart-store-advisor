'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// تهيئة العميل بأمان
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// دالة مساعدة معالجة وحصينة ضد القيم الفارغة والـ NULL
const mapCityToRegion = (city) => {
  if (!city || typeof city !== 'string') return 'undefined_region';
  
  const cityName = city.trim();
  
  if (cityName.includes('الرياض')) return 'riyadh';
  if (cityName.includes('جدة') || cityName.includes('مكة')) return 'makkah';
  if (cityName.includes('الدمام') || cityName.includes('الخبر') || cityName.includes('الجبيل')) return 'eastern';
  
  return 'other';
};

const initialRegions = {
  riyadh: { name: "منطقة الرياض", orders: 0, revenue: 0, cities: "الرياض", recommendation: "المنطقة نشطة، ركز عليها بحملات إعلانية مخصصة لرفع المبيعات." },
  makkah: { name: "منطقة مكة المكرمة", orders: 0, revenue: 0, cities: "جدة / مكة", recommendation: "أداء مستقر، نقترح عمل عروض شحن مجاني لتنشيط الطلبات." },
  eastern: { name: "المنطقة الشرقية", orders: 0, revenue: 0, cities: "الدمام / الخبر", recommendation: "المنطقة بحاجة لتنشيط تسويقي مستهدف لزيادة الحصة السوقية." },
  undefined_region: { name: "منطقة غير محددة", orders: 0, revenue: 0, cities: "غير محدد في النظام", recommendation: "يرجى تحسين جودة بيانات عناوين الشحن في المتجر لتحديد المنطقة بدقة." }
};

export default function SaudiRegionsMap({ merchantId = '210819854' }) {
  const [regionsData, setRegionsData] = useState(initialRegions);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRegionStats() {
      try {
        setLoading(true);
        
        // 1. جلب الطلبات بأمان مع وضع مصفوفة فارغة كبديل في حال فشل الجلب
        const { data: rawOrders, error: ordersError } = await supabase
          .from('orders')
          .select('id, city')
          .eq('merchant_id', merchantId);

        if (ordersError) console.error('Orders fetch warning:', ordersError);
        const orders = rawOrders || [];

        // 2. جلب عناصر الطلبات بأمان مع وضع مصفوفة فارغة كبديل
        const { data: rawItems, error: itemsError } = await supabase
          .from('order_items')
          .select('order_id, total_price')
          .eq('merchant_id', merchantId);

        if (itemsError) console.error('Order items fetch warning:', itemsError);
        const items = rawItems || [];

        // تجميع المبالغ لكل طلب بشكل آمن
        const orderRevenueMap = {};
        items.forEach(item => {
          if (item && item.order_id) {
            orderRevenueMap[item.order_id] = (orderRevenueMap[item.order_id] || 0) + Number(item.total_price || 0);
          }
        });

        // 3. تحديث البيانات وتوزيعها بمرونة كاملة
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

        // حساب النسب المئوية والمتوسطات رياضياً بأمان
        Object.keys(updatedRegions).forEach(key => {
          const reg = updatedRegions[key];
          reg.percentage = totalStoreOrders > 0 ? `${Math.round((reg.orders / totalStoreOrders) * 100)}%` : '0%';
          reg.avg_order = reg.orders > 0 ? Math.round(reg.revenue / reg.orders) : 0;
        });

        setRegionsData(updatedRegions);
      } catch (error) {
        console.error('Error in map components calculations:', error);
      } finally {
        setLoading(false);
      }
    }

    if (merchantId) {
      fetchRegionStats();
    }
  }, [merchantId]);

  const handleRegionClick = (regionId) => {
    if (regionsData[regionId]) {
      setSelectedRegion(regionsData[regionId]);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '30px', color: '#10b981', fontWeight: 'bold', direction: 'rtl' }}>جاري جلب بيانات الخريطة والتحليلات الذكية...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '20px', padding: '20px', direction: 'rtl' }}>
      
      {/* قسم الخريطة التفاعلية */}
      <div style={{ flex: 1, position: 'relative' }}>
        <h3 style={{ marginBottom: '5px', fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>خريطة المناطق التفاعلية</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>توزيع الطلبات والمبيعات حسب مناطق المملكة. اضغط على المنطقة لرؤية التقرير تفاعلياً.</p>
        
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
            fill={selectedRegion?.name === "منطقة مكة المكرمة" ? "#059669" : "#10b981"} 
            stroke="#fff" strokeWidth="2"
            onClick={() => handleRegionClick("makkah")}
            style={{ transition: 'fill 0.3s' }}
          />
        </svg>

        {regionsData.undefined_region.orders > 0 && (
          <button 
            onClick={() => handleRegionClick("undefined_region")}
            style={{ marginTop: '15px', background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'block' }}
          >
            ⚠️ هناك طلبات بمدن غير محددة ({regionsData.undefined_region.orders} طلبات). اضغط هنا لتحليلها.
          </button>
        )}
      </div>

      {/* قسم البطاقة المنبثقة الذكية بجانب الخريطة */}
      <div style={{ flex: '0 0 350px' }}>
        {selectedRegion ? (
          <div style={{ background: '#ffffff', borderRight: '5px solid #10b981', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '20px' }}>
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
                <span style={{ fontSize: '12px', color: '#6b7280' }}>نسبة من الطلبات</span>
                <strong style={{ display: 'block', fontSize: '16px', color: '#2563eb', marginTop: '4px' }}>{selectedRegion.percentage}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '15px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>المدن المرتبطة:</span>
              <span style={{ marginRight: '8px', fontWeight: '500', color: '#374151' }}>{selectedRegion.cities}</span>
            </div>

            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', borderRight: '4px solid #2563eb' }}>
              <strong style={{ fontSize: '13px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>💡 توصية ذكية:</strong>
              <p style={{ fontSize: '13px', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>{selectedRegion.recommendation}</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: '12px', color: '#9ca3af', padding: '40px', textAlign: 'center' }}>
            اضغط على أي منطقة ملونة في الخريطة لعرض تحليلاتها وتوصياتها الاستراتيجية هنا فوراً.
          </div>
        )}
      </div>
    </div>
  );
}
