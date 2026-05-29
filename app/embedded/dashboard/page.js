"use client";

import { useEffect, useState } from "react";
import { embedded } from "@salla.sa/embedded-sdk";

export default function EmbeddedDashboardPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        await embedded.init();

        const result = await embedded.auth.introspect();

        console.log("INTROSPECT RESULT:", result);

        setInfo(result);

        embedded.ready();
      } catch (e) {
        console.error(e);
      }
    }

    init();
  }, []);

  return (
    <div style={{ padding: 40, direction: "rtl" }}>
      <h1>اختبار بيانات المتجر</h1>

      <pre>
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  );
}
