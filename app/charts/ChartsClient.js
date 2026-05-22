"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ChartsClient({ summary, topCities, paymentMethods, salesChannels }) {
  const colors = ["#2563eb", "#22c55e", "#f97316", "#a855f7"];

  const performanceData = [
    { name: "إجمالي الطلبات", value: Number(summary?.total_orders || 0) },
    { name: "متوسط الطلب", value: Number(summary?.average_order_value || 0) },
    { name: "الإيرادات", value: Number(summary?.total_revenue || 0) },
  ];

const pieData =
  paymentMethods?.length > 0
    ? paymentMethods.map((item) => ({
        name: item.name || "غير محدد",
        value: Number(item.orders_count || 0),
      }))
    : [
        {
          name: "طريقة الدفع غير محددة",
          value: Number(summary?.total_orders || 0),
        },
      ];
const topCitiesData = (topCities || []).map((item) => ({
  name: item.city || "غير محدد",
  value: Number(item.total_orders || 0),
}));

const salesChannelsData = (salesChannels || []).map((item) => ({
  name: item.name || "غير محدد",
  value: Number(item.orders_count || 0),
}));
  const paymentMethodsData = (paymentMethods || []).map((item) => ({
  name: item.name || "غير محدد",
  value: Number(item.orders_count || 0),
}));
  const totalOrders = Number(summary?.total_orders || 0);
const totalRevenue = Number(summary?.total_revenue || 0);
const averageOrderValue = Number(summary?.average_order_value || 0);

const performanceInsights = [
  {
    title: "نشاط الطلبات",
    value: `${totalOrders} طلب`,
    note: totalOrders > 0 ? "النشاط موجود ويحتاج متابعة نمو الطلبات." : "لا توجد طلبات كافية للتحليل.",
    color: "#2563eb",
    background: "#eff6ff",
  },
  {
    title: "قوة الإيرادات",
    value: `${totalRevenue.toLocaleString("ar-SA")} ريال`,
    note: totalRevenue > 0 ? "الإيرادات موجودة ويمكن تحسينها برفع السلة أو الطلبات." : "لا توجد إيرادات كافية.",
    color: "#f97316",
    background: "#fff7ed",
  },
  {
    title: "متوسط قيمة الطلب",
    value: `${averageOrderValue.toLocaleString("ar-SA")} ريال`,
    note: averageOrderValue > 0 ? "راقب هذا الرقم لأنه يوضح جودة الطلب الواحد." : "لا توجد بيانات كافية.",
    color: "#22c55e",
    background: "#f0fdf4",
  },
];
return (
  <section
    style={{
      background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
      padding: "26px",
      borderRadius: "24px",
      boxShadow: "0 18px 40px rgba(15,23,42,0.22)",
      marginBottom: "26px",
      color: "white",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "22px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "900" }}>
          ملخص الأداء البياني
        </h2>
        <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px" }}>
          قراءة بصرية لأهم مؤشرات المبيعات والطلبات.
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "999px",
          padding: "8px 14px",
          fontSize: "13px",
          color: "#e5e7eb",
        }}
      >
        تحديث مباشر من بيانات المتجر
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: "14px",
        marginBottom: "22px",
      }}
    >
      {performanceInsights.map((item, index) => (
        <div
          key={index}
          style={{
            background: item.background,
            borderRadius: "18px",
            padding: "16px",
            color: "#0f172a",
          }}
        >
          <div style={{ color: item.color, fontWeight: "900", marginBottom: "8px" }}>
            {item.title}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "900", marginBottom: "8px" }}>
            {item.value}
          </div>
          <div style={{ color: "#475569", fontSize: "13px", lineHeight: "1.7" }}>
            {item.note}
          </div>
        </div>
      ))}
    </div>
          
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "18px",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "18px",
          minHeight: "320px",
        }}
      >
        <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
          مقارنة الأداء
        </h3>

        <div style={{ width: "100%", height: "260px" }}>
          <ResponsiveContainer>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "18px",
          minHeight: "320px",
        }}
      >
        <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
          توزيع طرق الدفع
        </h3>

        <div style={{ width: "100%", height: "260px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`payment-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: "18px",
        marginTop: "18px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "18px",
          minHeight: "260px",
        }}
      >
        <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
          أكثر 3 مدن طلبًا
        </h3>

        <div style={{ width: "100%", height: "210px" }}>
          <ResponsiveContainer>
            <BarChart data={topCitiesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "18px",
          minHeight: "260px",
        }}
      >
        <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
          قنوات البيع
        </h3>

        <div style={{ width: "100%", height: "210px" }}>
          <ResponsiveContainer>
            <BarChart data={salesChannelsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
              <XAxis dataKey="name" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "18px",
          minHeight: "260px",
        }}
      >
        <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
          قراءة سريعة
        </h3>

        <ul
          style={{
            margin: 0,
            paddingRight: "18px",
            color: "#e5e7eb",
            lineHeight: "2",
            fontSize: "14px",
          }}
        >
          <li>راقب المدن الأعلى طلبًا لتوجيه الحملات الإعلانية.</li>
          <li>قارن طرق الدفع لمعرفة الخيارات المفضلة للعملاء.</li>
          <li>اربط متوسط قيمة الطلب بالعروض لرفع الإيرادات.</li>
        </ul>
      </div>
    </div>
  </section>
  );
}
