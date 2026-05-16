"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SyncOrdersButton({ merchantId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSync() {
    try {
      setLoading(true);
      setMessage("جاري مزامنة الطلبات...");

      const res = await fetch(`/api/orders/sync?merchant_id=${merchantId}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setMessage("فشلت المزامنة. تحقق من الاتصال أو صلاحية التوكن.");
        setLoading(false);
        return;
      }

      setMessage(`تمت المزامنة بنجاح. عدد الطلبات: ${data.orders_count || 0}`);

      setLoading(false);

      setTimeout(() => {
        window.location.href = `/dashboard?merchant_id=${merchantId}`;
      }, 900);
    } catch (error) {
      setMessage("حدث خطأ أثناء المزامنة.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        style={{
          background: loading ? "#94a3b8" : "#16a34a",
          color: "white",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {loading ? "جاري المزامنة..." : "مزامنة الطلبات الآن"}
      </button>

      {message && (
        <span
          style={{
            color:
              message.includes("فشلت") || message.includes("خطأ")
                ? "#dc2626"
                : "#166534",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}
