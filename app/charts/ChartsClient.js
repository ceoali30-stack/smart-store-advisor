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
      <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: "900" }}>
        ملخص الأداء البياني
      </h2>

      <p style={{ margin: "0 0 24px", color: "#cbd5e1", fontSize: "14px" }}>
        عرض بصري ملون لأهم مؤشرات المبيعات.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "22px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "18px",
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
            مقارنة الأداء
          </h3>

          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                <XAxis dataKey="name" stroke="#e5e7eb" />
                <YAxis stroke="#e5e7eb" />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "18px",
          }}
        >
<h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
  توزيع طرق الدفع
</h3>

          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={colors[index % colors.length]} />
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
    marginTop: "22px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "18px",
  }}
>
  <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
    أكثر 3 مدن طلبًا
  </h3>

  <div style={{ width: "100%", height: "260px" }}>
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
    marginTop: "22px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "18px",
  }}
>
  <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
    قنوات البيع
  </h3>

  <div style={{ width: "100%", height: "260px" }}>
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
    </section>
  );
}
