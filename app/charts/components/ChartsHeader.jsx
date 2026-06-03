import ChartsQuickNav from "../ChartsQuickNav";
import PrintButton from "../../dashboard/PrintButton";

export default function ChartsHeader({ merchantId }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div>
          <p
            style={{
              margin: "0 0 8px",
              color: "#2563eb",
              fontWeight: "800",
              fontSize: "14px",
            }}
          >
            Smart Store Advisor
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            لوحة الرسوم والتحليلات
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            مؤشرات ورسوم تساعد التاجر على فهم المبيعات واتخاذ قرارات أسرع.
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          color: "#92400e",
          padding: "12px 16px",
          borderRadius: "12px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "1.7",
        }}
      >
        هذه البيانات من متجر تجريبي، وقد لا تعكس أداء متجر حقيقي. الهدف الحالي
        هو اختبار التحليلات وطريقة العرض.
      </div>

      <ChartsQuickNav />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <a
          href={`/dashboard?merchant_id=${merchantId}`}
          style={{
            background: "#111827",
            color: "white",
            padding: "10px 14px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          العودة للوحة التحكم
        </a>

        <PrintButton />
      </div>
    </div>
  );
}
