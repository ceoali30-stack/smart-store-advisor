"use client";

import { useEffect } from "react";
import { embedded } from "@salla.sa/embedded-sdk";

export default function EmbeddedDashboardPage() {
  useEffect(() => {
    async function init() {
      try {
        await embedded.init({ debug: true });

        const result = await embedded.auth.introspect();

        if (!result?.isVerified || !result?.data?.merchant_id) {
          embedded.ready();
          return;
        }

        const merchantId = result.data.merchant_id;

        embedded.page.setTitle("مستشار المتجر الذكي");
        embedded.ready();

        window.location.href = `/dashboard?merchant_id=${merchantId}`;
      } catch (error) {
        console.error("Embedded dashboard error:", error);
        embedded.ready();
      }
    }

    init();
  }, []);

  return (
    <main style={{ padding: 40, direction: "rtl", fontFamily: "Arial" }}>
      <h1>جاري فتح مستشار المتجر الذكي...</h1>
      <p>يتم التحقق من بيانات المتجر وتحميل لوحة التحكم.</p>
    </main>
  );
}
