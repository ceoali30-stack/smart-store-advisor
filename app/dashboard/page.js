export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const stockFilter = params?.stock || "all";
  const merchantId = params?.merchant_id || "210819854";

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://smart-store-advisor.vercel.app";

  let data = null;
  let error = null;

  try {
    const res = await fetch(`${baseUrl}/api/dashboard?merchant_id=${merchantId}`, {
      cache: "no-store",
    });

    data = await res.json();

    if (!res.ok || data.success === false) {
      error = data.message || "Failed to load dashboard data";
    }
  } catch (err) {
    error = String(err);
  }

  if (error) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>Smart Store Advisor</h1>

        <MerchantLinks />

        <p style={{ color: "red", marginTop: "30px" }}>Error: {error}</p>
      </main>
    );
  }
let salesInsights = null;

try {
  const salesRes = await fetch(
    `${baseUrl}/api/sales/insights?merchant_id=${merchantId}`,
    { cache: "no-store" }
  );

  salesInsights = await salesRes.json();
} catch (err) {
  salesInsights = null;
}

const filteredLowStockProducts =
  stockFilter === "out"
    ? data.low_stock_products.filter(
        (product) => Number(product.quantity) === 0
      )
    : stockFilter === "low"
    ? data.low_stock_products.filter(
        (product) => Number(product.quantity) > 0
      )
    : data.low_stock_products;
  return (
    <main
      style={{
  direction: "rtl",
  textAlign: "right",
  padding: "40px",
  fontFamily: "Arial, sans-serif",
        background: "#f6f7f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>Smart Store Advisor Dashboard</h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        AI-powered analytics for Salla merchants.
      </p>

      <MerchantLinks />

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <Card title="Merchant ID" value={data.merchant_id} />
        <Card title="Total Products" value={data.total_products} />
        <Card title="Average Price" value={`${data.average_price} SAR`} />
        <Card title="Stock Alerts" value={data.low_stock_products_count} />
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        <InsightCard
          title="Highest Price Product"
          name={data.highest_price_product?.name}
          price={data.highest_price_product?.price}
        />

        <InsightCard
          title="Lowest Price Product"
          name={data.lowest_price_product?.name}
          price={data.lowest_price_product?.price}
        />
      </section>
          <section
  style={{
    marginTop: "28px",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  {salesInsights?.success && (
  <div
    style={{
      background: "white",
      padding: "18px",
      borderRadius: "14px",
      marginBottom: "18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}
  >
    <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
      تحليلات المبيعات
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>إجمالي الطلبات</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.total_orders}
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Total Revenue</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.total_revenue} SAR
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Average Order Value</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.average_order_value} SAR
        </h3>
      </div>

      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Avg Items / Order</p>
        <h3 style={{ margin: "8px 0 0", fontSize: "24px" }}>
          {salesInsights.summary.average_items_per_order}
        </h3>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
        gap: "14px",
        marginBottom: "18px",
      }}
    >
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر المنتجات مبيعًا</h3>
      {salesInsights.top_products.slice(0, 5).map((product, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {product.product_name} — {product.quantity_sold} مبيعات — {product.revenue} ريال
  </p>
))}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر الأقسام مبيعًا</h3>
        {salesInsights.top_categories.slice(0, 5).map((category, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {category.category_name} — {category.quantity_sold} مبيعات — {category.revenue} ريال
  </p>
))}
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
        <h3 style={{ marginTop: 0 }}>أكثر المنتجات مبيعًا حسب المدينة</h3>
     {salesInsights.top_products_by_city.slice(0, 5).map((item, index) => (
  <p key={index} style={{ margin: "8px 0" }}>
    {item.city} — {item.product_name} — {item.quantity_sold} مبيعات
  </p>
))}
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
        gap: "12px",
      }}
    >
      {salesInsights.recommendations.map((rec, index) => (
        <div
          key={index}
          style={{
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "14px",
          }}
        >
          <p style={{ margin: 0, color: "#166534", fontSize: "13px" }}>
            {rec.title}
          </p>
          <h3 style={{ margin: "6px 0 8px", color: "#15803d" }}>
            التوصية
          </h3>
          <p style={{ margin: 0, color: "#14532d" }}>
            {rec.message}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
  <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
    منتجات منخفضة المخزون
  </h2>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  }}
>
  <a
    href={`?merchant_id=${merchantId}&stock=all`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "all" ? "#111827" : "#f3f4f6",
      color: stockFilter === "all" ? "white" : "#111827",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    الكل
  </a>

  <a
   href={`?merchant_id=${merchantId}&stock=out`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "out" ? "#dc2626" : "#fef2f2",
      color: stockFilter === "out" ? "white" : "#991b1b",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    نفد المخزون
  </a>

  <a
    href={`?merchant_id=${merchantId}&stock=low`}
    style={{
      padding: "8px 14px",
      borderRadius: "999px",
      textDecoration: "none",
      background: stockFilter === "low" ? "#d97706" : "#fffbeb",
      color: stockFilter === "low" ? "white" : "#92400e",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    مخزون منخفض
  </a>
</div>
 {filteredLowStockProducts && filteredLowStockProducts.length > 0 ? (
    <>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  }}
>
  <div
    style={{
      background: "#fef2f2",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #fecaca",
    }}
  >
    <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>
      Out of Stock
    </p>
    <h3 style={{ margin: "8px 0 0", color: "#dc2626", fontSize: "26px" }}>
      {
        data.low_stock_products.filter(
          (product) => Number(product.quantity) === 0
        ).length
      }
    </h3>
  </div>

  <div
    style={{
      background: "#fffbeb",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #fde68a",
    }}
  >
    <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
      Low Stock
    </p>
    <h3 style={{ margin: "8px 0 0", color: "#b45309", fontSize: "26px" }}>
      {
        data.low_stock_products.filter(
          (product) =>
            Number(product.quantity) > 0 && Number(product.quantity) <= 3
        ).length
      }
    </h3>
  </div>
</div>
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "15px",
        }}
      >
        <thead>
          <tr
  style={{
    background: "#e5e7eb",
    textAlign: "left",
    color: "#111827",
  }}
>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              رقم المنتج
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              اسم المنتج
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              السعر
            </th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
              الكمية
            </th>
         <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الحالة
</th>

<th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الإجراء المقترح
</th>
    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
  الأولوية
</th>
          </tr>
        </thead>

        <tbody>
          {filteredLowStockProducts.map((product) => (
           <tr
  key={product.id}
  style={{
    background:
      Number(product.quantity) === 0 ? "#fff7f7" : "#fffdf2",
  }}
>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.id}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.name || "-"}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                {product.price ?? "-"} ريال
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  fontWeight: "700",
                  color: Number(product.quantity) === 0 ? "#dc2626" : "#b45309",
                }}
              >
                {product.quantity ?? "-"}
              </td>
                <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "700",
    color: Number(product.quantity) === 0 ? "#dc2626" : "#b45309",
  }}
>
  {Number(product.quantity) === 0 ? "نفد المخزون" : "مخزون منخفض"}
</td>
 <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "600",
    color: Number(product.quantity) === 0 ? "#991b1b" : "#92400e",
  }}
>
  {Number(product.quantity) === 0
    ? "إعادة التوريد فورًا"
    : "المراجعة وإعادة الطلب قريبًا"}
</td>
  <td
  style={{
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "700",
    color: Number(product.quantity) === 0 ? "#dc2626" : "#d97706",
  }}
>
  {Number(product.quantity) === 0 ? "عالية" : "متوسطة"}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</>
  ) : (
    <p style={{ margin: 0, color: "#666" }}>
      No low stock products found.
    </p>
  )}
</section>
    <section
  style={{
    marginTop: "28px",
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  }}
>
  <h2 style={{ margin: "0 0 16px", fontSize: "22px" }}>
    AI Recommendations
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
      gap: "16px",
    }}
  >
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#991b1b", fontSize: "14px" }}>
        Critical Stock Alert
      </p>
      <h3 style={{ margin: "8px 0", color: "#dc2626", fontSize: "24px" }}>
        {data.low_stock_products.filter(
          (product) => Number(product.quantity) === 0
        ).length}
      </h3>
      <p style={{ margin: 0, color: "#7f1d1d", fontSize: "14px" }}>
        Products are completely out of stock and should be restocked immediately.
      </p>
    </div>

    <div
      style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#92400e", fontSize: "14px" }}>
        Reorder Soon
      </p>
      <h3 style={{ margin: "8px 0", color: "#d97706", fontSize: "24px" }}>
        {data.low_stock_products.filter(
          (product) => Number(product.quantity) > 0
        ).length}
      </h3>
      <p style={{ margin: 0, color: "#78350f", fontSize: "14px" }}>
        Products are running low and should be reviewed before they run out.
      </p>
    </div>

    <div
      style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p style={{ margin: 0, color: "#166534", fontSize: "14px" }}>
        Suggested Action
      </p>
      <h3 style={{ margin: "8px 0", color: "#15803d", fontSize: "24px" }}>
        Review Today
      </h3>
      <p style={{ margin: 0, color: "#14532d", fontSize: "14px" }}>
        Start with high-priority products, then review medium-priority products
        within 24–48 hours.
      </p>
    </div>
  </div>
</section>
   
    </main>
  );
}

function MerchantLinks() {
  const merchants = ["210819854", "905561820", "174453729"];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {merchants.map((id) => (
        <a
          key={id}
          href={`/dashboard?merchant_id=${id}`}
          style={{
            background: "#111827",
            color: "white",
            padding: "10px 14px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Store {id}
        </a>
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "10px 0 0", fontSize: "26px" }}>{value}</h2>
    </div>
  );
}

function InsightCard({ title, name, price }) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "12px 0 8px", fontSize: "24px" }}>{name || "-"}</h2>
      <p style={{ margin: 0, fontSize: "18px" }}>{price ?? "-"} SAR</p>
    </div>
  );
}
