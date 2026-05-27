import HealthSection from "./HealthSection";
import NavBar from "./NavBar";
import PrintButton from "./PrintButton";
import SyncOrdersButton from "./SyncOrdersButton";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function formatCurrency(value) {
  const number = Number(value || 0);
  return `${number.toLocaleString("ar-SA")} ريال`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("ar-SA");
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const stockFilter = params?.stock || "all";
  const merchantId = params?.merchant_id;

  if (!merchantId) {
    redirect("/");
  }

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("merchant_id")
    .eq("merchant_id", String(merchantId))
    .maybeSingle();

  if (merchantError || !merchant) {
    return (
      <main style={styles.page}>
        <div style={styles.errorBox}>
          <h2>غير مصرح</h2>
          <p>هذا المتجر غير مربوط بتطبيق مستشار المتجر الذكي.</p>
        </div>
      </main>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://smart-store-advisor.vercel.app";

  let data = null;
  let error = null;
  let syncStatus = null;
  let salesInsights = null;

  try {
    const res = await fetch(
      `${baseUrl}/api/dashboard?merchant_id=${merchantId}`,
      { cache: "no-store" }
    );

    data = await res.json();

    if (!res.ok || data?.success === false) {
      error = data?.message || "Failed to load dashboard data";
    }
  } catch (err) {
    error = String(err);
  }

  try {
    const syncRes = await fetch(
      `${baseUrl}/api/sync/status?merchant_id=${merchantId}`,
      { cache: "no-store" }
    );
    syncStatus = await syncRes.json();
  } catch (err) {
    syncStatus = null;
  }

  try {
    const salesRes = await fetch(
      `${baseUrl}/api/sales/insights?merchant_id=${merchantId}`,
      { cache: "no-store" }
    );
    salesInsights = await salesRes.json();
  } catch (err) {
    salesInsights = null;
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.errorBox}>
          <h2>حدث خطأ</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const products = data?.products || [];
  const lowStockProducts = data?.low_stock_products || [];

  const outOfStockProducts = lowStockProducts.filter(
    (product) => Number(product.quantity || 0) === 0
  );

  const onlyLowStockProducts = lowStockProducts.filter(
    (product) => Number(product.quantity || 0) > 0
  );

  const filteredLowStockProducts =
    stockFilter === "out"
      ? outOfStockProducts
      : stockFilter === "low"
      ? onlyLowStockProducts
      : lowStockProducts;

const topProductsMap = {};

(salesInsights?.top_products || []).forEach((product) => {
  topProductsMap[product.product_name] = product;
});

const stagnantProducts = lowStockProducts
  .filter((product) => {
    const quantity = Number(product.quantity || 0);

    const salesData =
      topProductsMap[product.name] ||
      topProductsMap[product.product_name];

    const soldCount = Number(salesData?.sold_count || 0);

    return quantity > 0 && soldCount === 0;
  })
  .slice(0, 10);

  const totalProductsCount = Number(
  products.length || lowStockProducts.length || 0
);
  const lowStockCount = Number(lowStockProducts.length || 0);
  const stagnantCount = Number(stagnantProducts.length || 0);

  const totalOrdersCount = Number(salesInsights?.summary?.total_orders || 0);
  const totalRevenueValue = Number(salesInsights?.summary?.total_revenue || 0);
  const averageOrderValue = Number(
    salesInsights?.summary?.average_order_value || 0
  );
  const totalItemsSold = Number(salesInsights?.summary?.total_items_sold || 0);
  const averageItemsPerOrder = Number(
    salesInsights?.summary?.average_items_per_order || 0
  );

  const topProduct =
    salesInsights?.top_products?.[0]?.product_name ||
    salesInsights?.top_products?.[0]?.name ||
    "غير متوفر";

  const topCity =
    salesInsights?.regions_insights?.[0]?.city ||
    salesInsights?.regions_insights?.[0]?.region ||
    "غير متوفر";

const productsForDataQuality =
  products.length > 0 ? products : lowStockProducts;

const productsWithPrice = productsForDataQuality.filter(
  (product) => Number(product.price || 0) > 0
).length;

const productsWithCost = productsForDataQuality.filter(
  (product) => Number(product.cost_price || product.raw_data?.cost_price || 0) > 0
).length;

  const stockHealthScore =
    totalProductsCount > 0
      ? Math.max(0, 25 - Math.min(25, (lowStockCount / totalProductsCount) * 25))
      : 0;

  const stagnantHealthScore =
    totalProductsCount > 0
      ? Math.max(
          0,
          20 - Math.min(20, (stagnantCount / totalProductsCount) * 20)
        )
      : 0;

  const salesHealthScore =
    totalOrdersCount > 0 && totalRevenueValue > 0 ? 20 : 0;

  const averageOrderHealthScore =
    averageOrderValue >= 100
      ? 15
      : averageOrderValue >= 50
      ? 10
      : averageOrderValue > 0
      ? 5
      : 0;

  const productDataHealthScore =
    totalProductsCount > 0
      ? Math.round(
          ((productsWithPrice + productsWithCost) / (totalProductsCount * 2)) *
            20
        )
      : 0;

  const storeHealthPercentage = Math.round(
    stockHealthScore +
      stagnantHealthScore +
      salesHealthScore +
      averageOrderHealthScore +
      productDataHealthScore
  );

  const storeHealthLabel =
    storeHealthPercentage >= 85
      ? "ممتاز"
      : storeHealthPercentage >= 70
      ? "جيد"
      : storeHealthPercentage >= 50
      ? "متوسط"
      : "يحتاج تحسين";

  const storeHealthMessage =
    storeHealthPercentage >= 85
      ? "المتجر في حالة قوية، ركّز على التوسع وزيادة الحملات."
      : storeHealthPercentage >= 70
      ? "المتجر جيد، لكن توجد فرص لتحسين المخزون والمبيعات."
      : storeHealthPercentage >= 50
      ? "المتجر متوسط ويحتاج متابعة المنتجات الراكدة والمخزون."
      : "المتجر يحتاج تدخل واضح في المخزون والمبيعات وبيانات المنتجات.";

  const profitableProducts = lowStockProducts
    .map((product) => {
      const price = Number(product.price || 0);
      const costPrice = Number(
        product.cost_price || product.raw_data?.cost_price || 0
      );
      const profit = price - costPrice;
      const margin = price > 0 ? Math.round((profit / price) * 100) : 0;

      return {
        ...product,
        price,
        costPrice,
        profit,
        margin,
      };
    })
    .filter((product) => product.costPrice > 0 && product.profit > 0)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  const productsWithoutCost = productsForDataQuality.filter(
  (product) => Number(product.cost_price || product.raw_data?.cost_price || 0) <= 0
).length;

const productsWithoutPrice = productsForDataQuality.filter(
  (product) => Number(product.price || 0) <= 0
).length;

const productsWithoutName = productsForDataQuality.filter(
  (product) => !product.name
).length;

const ordersWithoutCity = Number(
  salesInsights?.summary?.orders_without_city || 0
);

const dataQualityAlerts = [
  {
    title: "منتجات بدون سعر تكلفة",
    value: productsWithoutCost,
    message: "تؤثر على حساب الربحية والهامش.",
  },
  {
    title: "منتجات بدون سعر بيع",
    value: productsWithoutPrice,
    message: "تؤثر على دقة تحليل الإيرادات.",
  },
  {
    title: "منتجات بدون اسم",
    value: productsWithoutName,
    message: "تجعل التقارير أقل وضوحًا.",
  },
  {
    title: "طلبات بدون مدينة",
    value: ordersWithoutCity,
    message: "تؤثر على تحليل المناطق والمدن.",
  },
];
  const marketingSuggestions = [];

  if (topProduct !== "غير متوفر") {
    marketingSuggestions.push({
      title: "روّج للمنتج الأعلى مبيعًا",
      message: `المنتج "${topProduct}" يحقق مبيعات جيدة. اجعله ظاهرًا في الصفحة الرئيسية أو أضفه إلى حملة قصيرة.`,
    });
  }

  if (outOfStockProducts.length > 0) {
    marketingSuggestions.push({
      title: "أعد توفير المنتجات النافدة",
      message:
        "لديك منتجات نفد مخزونها. هذه المنتجات قد تسبب خسارة مبيعات مباشرة إذا كانت ما زالت مطلوبة.",
    });
  }

  if (onlyLowStockProducts.length > 0) {
    marketingSuggestions.push({
      title: "راجع المنتجات منخفضة المخزون",
      message:
        "تجنب إطلاق حملات قوية على منتجات مخزونها منخفض حتى لا تنفد سريعًا وتخسر الطلبات.",
    });
  }

  if (averageOrderValue > 0) {
    marketingSuggestions.push({
      title: "ارفع متوسط قيمة الطلب",
      message: `متوسط قيمة الطلب هو ${formatCurrency(
        averageOrderValue
      )}. جرّب عروض مثل الشحن المجاني فوق مبلغ معين أو خصم عند شراء منتجين.`,
    });
  }

  return (
    <main style={styles.page}>
      <NavBar />

      <div style={styles.topBar}>
        <div>
          <p style={styles.mutedWhite}>لوحة تحكم المتجر</p>
          <h1 style={styles.mainTitle}>مستشار المتجر الذكي</h1>
          <p style={styles.mutedWhite}>رقم المتجر: {merchantId}</p>
        </div>
    
        <div style={styles.actions}>
          <SyncOrdersButton merchantId={merchantId} />
          <PrintButton />
          <a
            href={`/dashboard?merchant_id=${merchantId}`}
            style={styles.refreshButton}
          >
            تحديث لوحة التحكم
          </a>
              <a
  href={`/charts?merchant_id=${merchantId}`}
  style={styles.refreshButton}
>
  لوحة الرسوم والتحليلات
</a>
        </div>
      </div>

<div style={styles.demoNotice}>
  هذه البيانات من متجر تجريبي، وقد لا تعكس أداء متجر حقيقي.
  الهدف الحالي هو اختبار التحليلات وطريقة العرض.
</div>
              
      <HealthSection
  storeHealthPercentage={storeHealthPercentage}
  storeHealthLabel={storeHealthLabel}
  storeHealthMessage={storeHealthMessage}
  stockHealthScore={stockHealthScore}
  stagnantHealthScore={stagnantHealthScore}
  salesHealthScore={salesHealthScore}
  averageOrderHealthScore={averageOrderHealthScore}
  productDataHealthScore={productDataHealthScore}
  styles={styles}
  HealthItem={HealthItem}
/>

      <section style={styles.cardsGrid}>
        <KpiCard title="إجمالي المبيعات" value={formatCurrency(totalRevenueValue)} />
        <KpiCard title="عدد الطلبات" value={formatNumber(totalOrdersCount)} />
        <KpiCard title="متوسط قيمة الطلب" value={formatCurrency(averageOrderValue)} />
        <KpiCard title="عدد المنتجات" value={formatNumber(totalProductsCount)} />
        <KpiCard title="منتجات منخفضة المخزون" value={formatNumber(lowStockCount)} />
        <KpiCard title="المنتج الأعلى مبيعًا" value={topProduct} />
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>أولويات اليوم</p>
            <h2 style={styles.sectionTitle}>ما الذي يجب فعله الآن؟</h2>
          </div>
        </div>

        <div style={styles.priorityGrid}>
          <PriorityCard
            title="منتجات نافدة"
            value={outOfStockProducts.length}
            message="تحتاج إلى إعادة توفير فورية."
            tone="danger"
          />
          <PriorityCard
            title="منتجات منخفضة المخزون"
            value={onlyLowStockProducts.length}
            message="راجعها قبل نفادها من المتجر."
            tone="warning"
          />
          <PriorityCard
            title="الإجراء المقترح"
            value="أولويات اليوم"
            message="1. إعادة توفير المنتجات النافدة. 2. مراجعة المنتجات منخفضة المخزون. 3. التركيز على المنتج الأعلى مبيعًا. 4. تحسين المنتجات الراكدة."
            tone="success"
          />
        </div>
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>تحليلات المبيعات</p>
        <h2 style={styles.sectionTitle}>ملخص المبيعات</h2>

        <div style={styles.cardsGrid}>
          <KpiCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenueValue)} />
          <KpiCard title="إجمالي الطلبات" value={formatNumber(totalOrdersCount)} />
          <KpiCard title="إجمالي القطع المباعة" value={formatNumber(totalItemsSold)} />
          <KpiCard
            title="متوسط القطع في الطلب"
            value={averageItemsPerOrder ? averageItemsPerOrder.toFixed(2) : "غير متوفر"}
          />
          <KpiCard title="أفضل منتج" value={topProduct} />
            <KpiCard
  title="عدد مرات بيع أفضل منتج"
  value={
    salesInsights?.top_products?.[0]?.sold_count
      ? `${salesInsights.top_products[0].sold_count} عملية`
      : "غير متوفر"
  }
/>
  <KpiCard
  title="الكمية المباعة لأفضل منتج"
  value={
    salesInsights?.top_products?.[0]?.quantity_sold
      ? `${salesInsights.top_products[0].quantity_sold} قطعة`
      : "غير متوفر"
  }
/>
          <KpiCard title="أعلى مدينة / منطقة" value={topCity} />
        </div>
      </section>

<section style={styles.section}>
  <p style={styles.sectionEyebrow}>المنتجات</p>

  <h2 style={styles.sectionTitle}>
    أفضل المنتجات مبيعًا
  </h2>

  {salesInsights?.top_products?.length > 0 ? (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>الترتيب</th>
            <th style={styles.th}>اسم المنتج</th>
            <th style={styles.th}>عدد مرات البيع</th>
            <th style={styles.th}>الكمية المباعة</th>
            <th style={styles.th}>الإيرادات</th>
            <th style={styles.th}>التقييم</th>
          </tr>
        </thead>

        <tbody>
          {salesInsights.top_products
            .slice(0, 10)
            .map((product, index) => {
              const revenue = Number(product.revenue || 0);

              const performance =
                revenue >= 10000
                  ? "ممتاز"
                  : revenue >= 3000
                  ? "جيد"
                  : "متوسط";

              return (
                <tr key={product.product_name || index}>
                  <td style={styles.td}>
                    #{index + 1}
                  </td>

                  <td style={styles.td}>
                    {product.product_name || "منتج غير معروف"}
                  </td>

                  <td style={styles.td}>
                    {product.sold_count || 0} عملية
                  </td>

                  <td style={styles.td}>
                    {product.quantity_sold || 0} قطعة
                  </td>

                  <td style={styles.td}>
                    {formatCurrency(revenue)}
                  </td>

                  <td
                    style={{
                      ...styles.td,
                      fontWeight: "700",
                      color:
                        performance === "ممتاز"
                          ? "#16a34a"
                          : performance === "جيد"
                          ? "#d97706"
                          : "#475569",
                    }}
                  >
                    {performance}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyBox message="لا توجد بيانات مبيعات كافية لعرض أفضل المنتجات." />
  )}
</section>
  
      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>المنتجات الأعلى ربحية</p>
        <h2 style={styles.sectionTitle}>تحليل الربحية التقريبية</h2>

        {profitableProducts.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>اسم المنتج</th>
                  <th style={styles.th}>سعر البيع</th>
                  <th style={styles.th}>سعر التكلفة</th>
                  <th style={styles.th}>الربح التقريبي</th>
                  <th style={styles.th}>هامش الربح</th>
                  <th style={styles.th}>الإجراء المقترح</th>
                </tr>
              </thead>
              <tbody>
                {profitableProducts.map((product) => (
                  <tr key={product.id || product.name}>
                    <td style={styles.td}>{product.name || "-"}</td>
                    <td style={styles.td}>{formatCurrency(product.price)}</td>
                    <td style={styles.td}>{formatCurrency(product.costPrice)}</td>
                    <td style={styles.td}>{formatCurrency(product.profit)}</td>
                    <td style={styles.td}>{product.margin}%</td>
                    <td style={styles.td}>زيادة الظهور أو استخدامه في حملة مبيعات</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyBox message="لا توجد بيانات تكلفة كافية حاليًا لحساب أفضل المنتجات ربحية. عند توفر سعر التكلفة من سلة، سيظهر هذا القسم تلقائيًا." />
        )}
      </section>

          <section style={styles.section}>
  <p style={styles.sectionEyebrow}>جودة البيانات</p>
  <h2 style={styles.sectionTitle}>تنبيهات تؤثر على دقة التحليل</h2>

  <div style={styles.cardsGrid}>
    {dataQualityAlerts.map((item, index) => (
      <div key={index} style={styles.kpiCard}>
        <p style={styles.kpiTitle}>{item.title}</p>
        <h3 style={styles.kpiValue}>{item.value}</h3>
        <p style={{ margin: "8px 0 0", color: "#64748b", lineHeight: "1.7" }}>
          {item.message}
        </p>
      </div>
    ))}
  </div>
</section>
      
      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>التوصيات</p>
        <h2 style={styles.sectionTitle}>توصيات ذكية لتحسين الأداء</h2>

        {marketingSuggestions.length > 0 ? (
          <div style={styles.recommendationsGrid}>
            {marketingSuggestions.map((item, index) => (
              <div key={index} style={styles.recommendationCard}>
                <p style={styles.recommendationNumber}>توصية #{index + 1}</p>
                <h3 style={styles.recommendationTitle}>{item.title}</h3>
                <p style={styles.recommendationText}>{item.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyBox message="لا توجد اقتراحات تسويقية حاليًا. عند توفر بيانات المبيعات والمخزون سيتم توليد توصيات تلقائية." />
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>المخزون</p>
            <h2 style={styles.sectionTitle}>المنتجات التي تحتاج متابعة</h2>
          </div>

          <div style={styles.filterButtons}>
            <a
              href={`/dashboard?merchant_id=${merchantId}&stock=all`}
              style={{
                ...styles.filterButton,
                ...(stockFilter === "all" ? styles.filterActive : {}),
              }}
            >
              الكل
            </a>
            <a
              href={`/dashboard?merchant_id=${merchantId}&stock=out`}
              style={{
                ...styles.filterButton,
                ...(stockFilter === "out" ? styles.filterActiveDanger : {}),
              }}
            >
              نفد المخزون
            </a>
            <a
              href={`/dashboard?merchant_id=${merchantId}&stock=low`}
              style={{
                ...styles.filterButton,
                ...(stockFilter === "low" ? styles.filterActiveWarning : {}),
              }}
            >
              مخزون منخفض
            </a>
          </div>
        </div>

        {filteredLowStockProducts.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>رقم المنتج</th>
                  <th style={styles.th}>اسم المنتج</th>
                  <th style={styles.th}>السعر</th>
                  <th style={styles.th}>الكمية</th>
                  <th style={styles.th}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredLowStockProducts.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      background:
                        Number(product.quantity || 0) === 0
                          ? "#fff7f7"
                          : "#fffdf2",
                    }}
                  >
                    <td style={styles.td}>{product.id}</td>
                    <td style={styles.td}>{product.name || "-"}</td>
                    <td style={styles.td}>{formatCurrency(product.price)}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        color:
                          Number(product.quantity || 0) === 0
                            ? "#dc2626"
                            : "#b45309",
                      }}
                    >
                      {product.quantity ?? "-"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "700",
                        color:
                          Number(product.quantity || 0) === 0
                            ? "#dc2626"
                            : "#b45309",
                      }}
                    >
                      {Number(product.quantity || 0) === 0
                        ? "نفد المخزون"
                        : "مخزون منخفض"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyBox message="لا توجد منتجات منخفضة أو نافدة المخزون حسب الفلتر الحالي." />
        )}
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>المنتجات الراكدة</p>
        <h2 style={styles.sectionTitle}>منتجات تحتاج تنشيط أو تحسين ظهور</h2>

        {stagnantProducts.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>رقم المنتج</th>
                  <th style={styles.th}>اسم المنتج</th>
                  <th style={styles.th}>السعر</th>
                  <th style={styles.th}>الكمية</th>
                  <th style={styles.th}>الحالة</th>
                  <th style={styles.th}>الإجراء المقترح</th>
                </tr>
              </thead>
              <tbody>
                {stagnantProducts.map((product) => (
                  <tr key={product.id || product.name}>
                    <td style={styles.td}>{product.id || "-"}</td>
                    <td style={styles.td}>
                      {product.name ||
                        product.product_name ||
                        product.title ||
                        "منتج بدون اسم"}
                    </td>
                    <td style={styles.td}>{formatCurrency(product.price)}</td>
                    <td style={styles.td}>
                      {product.quantity || product.stock || 0}
                    </td>
                    <td style={{ ...styles.td, color: "#c2410c", fontWeight: 700 }}>
                      راكد
                    </td>
                    <td style={{ ...styles.td, color: "#15803d", fontWeight: 700 }}>
                      تسويق / عرض / تحسين ظهور
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyBox message="لا توجد منتجات راكدة واضحة حاليًا بناءً على البيانات المتاحة." />
        )}
      </section>

      <section style={styles.section}>
        <p style={styles.sectionEyebrow}>حالة المزامنة</p>
        <h2 style={styles.sectionTitle}>آخر حالة اتصال مع سلة</h2>

        <div style={styles.syncBox}>
          <p>
            الحالة:{" "}
            <strong>
              {syncStatus?.success === true
                ? "متصل"
                : syncStatus?.success === false
                ? "يوجد تنبيه"
                : "غير متوفر"}
            </strong>
          </p>
          <p>
            آخر تحديث:{" "}
            <strong>{syncStatus?.last_sync_at || "غير متوفر"}</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

function HealthItem({ title, value, max, note }) {
  const percentage = Math.round((value / max) * 100);

  const progressColor =
    percentage >= 80
      ? "#16a34a"
      : percentage >= 50
      ? "#d97706"
      : "#dc2626";

  return (
    <div style={styles.healthItem}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center",
        }}
      >
        <p style={styles.healthItemTitle}>{title}</p>

        <strong
          style={{
            fontSize: "15px",
            color: progressColor,
            fontWeight: "800",
          }}
        >
          {percentage}%
        </strong>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: progressColor,
            borderRadius: "999px",
            transition: "0.4s",
          }}
        />
      </div>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: "13px",
          color: "#475569",
          fontWeight: "700",
        }}
      >
        {value} من {max}
      </p>

      <p style={styles.healthItemNote}>{note}</p>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiTitle}>{title}</p>
      <h3 style={styles.kpiValue}>{value}</h3>
    </div>
  );
}

function PriorityCard({ title, value, message, tone }) {
  const toneStyle =
    tone === "danger"
      ? styles.priorityDanger
      : tone === "warning"
      ? styles.priorityWarning
      : styles.prioritySuccess;

  return (
    <div style={{ ...styles.priorityCard, ...toneStyle }}>
      <p style={styles.priorityTitle}>{title}</p>
      <h3 style={styles.priorityValue}>{value}</h3>
      <p style={styles.priorityMessage}>{message}</p>
    </div>
  );
}

function EmptyBox({ message }) {
  return <div style={styles.emptyBox}>{message}</div>;
}

const styles = {
  page: {
    direction: "rtl",
    textAlign: "right",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    background: "#f6f7f9",
    minHeight: "100vh",
    color: "#111827",
  },

  topBar: {
    background: "#0f172a",
    color: "white",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
    borderRadius: "18px",
  },

  mainTitle: {
    margin: "6px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  mutedWhite: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  refreshButton: {
    background: "white",
    color: "#0f172a",
    padding: "10px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },

  healthSection: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "center",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  },

  healthCircle: {
    width: "210px",
    height: "210px",
    borderRadius: "50%",
    background: "#f8fafc",
    border: "14px solid #0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  },

  healthNumber: {
    fontSize: "42px",
    fontWeight: "900",
    color: "#0f172a",
  },

  healthLabel: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#475569",
  },

  section: {
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 22px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "16px",
  },

  sectionEyebrow: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },

  sectionTitle: {
    margin: "8px 0 18px",
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  kpiCard: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  kpiTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
  },

  kpiValue: {
    margin: "12px 0 0",
    fontSize: "24px",
    fontWeight: "900",
    color: "#111827",
  },

  healthGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  healthItem: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },

  healthItemTitle: {
    margin: "0 0 8px",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },

  healthItemValue: {
    fontSize: "18px",
    color: "#0f172a",
  },

  healthItemNote: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.7",
  },

  priorityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },

  priorityCard: {
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #e5e7eb",
  },

  priorityDanger: {
    background: "#fef2f2",
    borderColor: "#fecaca",
  },

  priorityWarning: {
    background: "#fffbeb",
    borderColor: "#fde68a",
  },

  prioritySuccess: {
    background: "#ecfdf5",
    borderColor: "#bbf7d0",
  },

  priorityTitle: {
    margin: 0,
    color: "#374151",
    fontWeight: "700",
    fontSize: "14px",
  },

  priorityValue: {
    margin: "10px 0",
    fontSize: "26px",
    fontWeight: "900",
  },

  priorityMessage: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  recommendationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },

  recommendationCard: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
  },

  recommendationNumber: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontWeight: "800",
    fontSize: "13px",
  },

  recommendationTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#111827",
  },

  recommendationText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#374151",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    minWidth: "760px",
  },

  th: {
    padding: "12px",
    textAlign: "right",
    background: "#f1f5f9",
    color: "#334155",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: "800",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#111827",
  },

  filterButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  filterButton: {
    padding: "8px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    background: "#f8fafc",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
    border: "1px solid #e5e7eb",
  },

  filterActive: {
    background: "#0f172a",
    color: "white",
  },

  filterActiveDanger: {
    background: "#dc2626",
    color: "white",
  },

  filterActiveWarning: {
    background: "#d97706",
    color: "white",
  },

  emptyBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    color: "#6b7280",
    lineHeight: "1.8",
  },

  syncBox: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    color: "#334155",
    lineHeight: "1.8",
  },

 errorBox: {
  background: "white",
  padding: "28px",
  borderRadius: "16px",
  border: "1px solid #fecaca",
  color: "#991b1b",
},

demoNotice: {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  color: "#92400e",
  padding: "12px 16px",
  borderRadius: "12px",
  marginBottom: "20px",
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "1.7",
},
    
};
