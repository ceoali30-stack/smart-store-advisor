"use client";

import { useEffect } from "react";
import { embedded } from "@salla.sa/embedded-sdk";

export default function EmbeddedDashboardPage() {
  useEffect(() => {
    async function initEmbedded() {
      try {
        await embedded.init({ debug: true });

        embedded.page.setTitle("مستشار المتجر الذكي");

        embedded.ready();
      } catch (error) {
        console.error("Salla Embedded SDK error:", error);
      }
    }

    initEmbedded();
  }, []);

  return (
    <main style={{ padding: "40px", direction: "rtl", fontFamily: "Arial" }}>
      <h1>مستشار المتجر الذكي</h1>
      <p>تم تحميل الصفحة المضمنة بنجاح.</p>
    </main>
  );
}
