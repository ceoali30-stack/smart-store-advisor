"use client";

import { useSearchParams } from "next/navigation";

export default function DashboardLayout({ children }) {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchant_id");

  const dashboardUrl = merchantId
    ? `/dashboard?merchant_id=${merchantId}`
    : "/dashboard";

  const chartsUrl = merchantId
    ? `/charts?merchant_id=${merchantId}`
    : "/charts";

  return (
    <div style={{ direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          background: "#0f172a",
          color: "white",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong style={{ fontSize: "18px" }}>مستشار المتجر الذكي</strong>
          <p style={{ margin: "6px 0 0", color: "#cbd5e1", fontSize: "13px" }}>
            لوحة تحليلات ذكية لمتاجر سلة
          </p>
        </div>

        <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href={dashboardUrl} style={navStyle}>
            لوحة التحكم
          </a>
          <a href={chartsUrl} style={navStyle}>
            الرسوم والتقارير
          </a>
        </nav>
      </header>

      {children}
    </div>
  );
}

const navStyle = {
  color: "white",
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
};
