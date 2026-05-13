export default async function DashboardPage({ searchParams }) {
  const merchantId = searchParams?.merchant_id || "210819854";

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

  return (
    <main
      style={{
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
        <Card title="Low Stock Products" value={data.low_stock_products_count} />
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
