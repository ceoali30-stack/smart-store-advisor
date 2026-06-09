import ChartBox from "./ChartBox";

export default function DataQualityOverview({
  topProducts,
  topCategories,
  topCities,
  topCustomers,
}) {
  return (
    <div id="data-quality">
      <ChartBox title="مؤشرات جودة البيانات" accent="#6366f1">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: topProducts.length > 0 ? "#f0fdf4" : "#fef2f2",
              border:
                topProducts.length > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: topProducts.length > 0 ? "#166534" : "#991b1b",
              }}
            >
              بيانات المنتجات
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "22px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {topProducts.length > 0 ? "مكتملة" : "ناقصة"}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.7",
              }}
            >
              {topProducts.length > 0
                ? "يمكن تحليل المنتجات الأعلى مبيعًا."
                : "لا يمكن تحديد المنتجات الأعلى مبيعًا حتى تظهر عناصر الطلبات."}
            </p>
          </div>

          <div
            style={{
              background: topCategories.length > 0 ? "#f0fdf4" : "#fef2f2",
              border:
                topCategories.length > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: topCategories.length > 0 ? "#166534" : "#991b1b",
              }}
            >
              بيانات الأقسام
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "22px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {topCategories.length > 0 ? "مكتملة" : "ناقصة"}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.7",
              }}
            >
              {topCategories.length > 0
                ? "يمكن تحليل الأقسام الأعلى طلبًا."
                : "لا يمكن تحليل أداء الأقسام حتى ترتبط المنتجات بتصنيفاتها."}
            </p>
          </div>

          <div
            style={{
              background: topCities.length > 0 ? "#f0fdf4" : "#fef2f2",
              border:
                topCities.length > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: topCities.length > 0 ? "#166534" : "#991b1b",
              }}
            >
              بيانات المدن
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "22px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {topCities.length > 0 ? "مكتملة" : "ناقصة"}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.7",
              }}
            >
              {topCities.length > 0
                ? "يمكن معرفة المدن الأعلى طلبًا."
                : "لا توجد بيانات مدن كافية لتحليل التوزيع الجغرافي."}
            </p>
          </div>

          <div
            style={{
              background: topCustomers.length > 0 ? "#f0fdf4" : "#fef2f2",
              border:
                topCustomers.length > 0
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "800",
                color: topCustomers.length > 0 ? "#166534" : "#991b1b",
              }}
            >
              بيانات العملاء
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "22px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {topCustomers.length > 0 ? "مكتملة" : "ناقصة"}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.7",
              }}
            >
              {topCustomers.length > 0
                ? "يمكن معرفة العملاء الأعلى قيمة."
                : "لا توجد بيانات عملاء كافية للتحليل."}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: "16px",
            padding: "16px",
            color: "#312e81",
            lineHeight: "1.9",
            fontSize: "14px",
          }}
        >
          <strong>قراءة جودة البيانات:</strong>{" "}
          كلما اكتملت بيانات المنتجات، الأقسام، العملاء، المدن، طرق الدفع،
          والسلات المتروكة؛ أصبحت التوصيات أدق وأكثر فائدة للتاجر.
        </div>
      </ChartBox>
    </div>
  );
}
