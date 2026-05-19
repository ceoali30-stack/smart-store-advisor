"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartsClient({ summary }) {
  const performanceData = [
    {
      name: "الطلبات",
      value: Number(summary?.total_orders || 0),
    },
    {
      name: "الإيرادات",
      value: Number(summary?.total_revenue || 0),
    },
    {
      name: "متوسط الطلب",
      value: Number(summary?.average_order_value || 0),
    },
  ];

  return (
    <section
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
        border: "1px solid #eef2f7",
        marginBottom: "24px",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "900" }}>
        ملخص الأداء البياني
      </h2>

      <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: "14px" }}>
        رسم بياني يوضح الطلبات والإيرادات ومتوسط قيمة الطلب.
      </p>

      <div style={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#111827" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
