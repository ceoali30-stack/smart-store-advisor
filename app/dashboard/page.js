import {
  getStagnantProducts,
  getProfitableProducts,
  getStoreHealth,
} from "./services/dashboardCalculations";
import {
  HealthItem,
  KpiCard,
  PriorityCard,
  EmptyBox,
} from "./components/DashboardWidgets";
import { styles } from "./styles/dashboardStyles";
import DemoNotice from "./components/DemoNotice";
import DashboardHeader from "./components/DashboardHeader";
import SyncStatusSection from "./components/SyncStatusSection";
import InventoryWatchSection from "./components/InventoryWatchSection";
import StagnantProductsSection from "./components/StagnantProductsSection";
import ProfitabilitySection from "./components/ProfitabilitySection";
import SalesSummarySection from "./components/SalesSummarySection";
import { cookies } from "next/headers";
import { verifyMerchantSession } from "../lib/session";
import QuickNav from "./QuickNav";
import KpiSummarySection from "./KpiSummarySection";
import TodayPrioritiesSection from "./TodayPrioritiesSection";
import DataQualitySection from "./DataQualitySection";
import RecommendationsSection from "./RecommendationsSection";
import TopProductsTable from "./TopProductsTable";
import HealthSection from "./HealthSection";
import NavBar from "./NavBar";
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

const cookieStore = await cookies();
const sessionCookie = cookieStore.get("merchant_session")?.value;
  const authHeaders = sessionCookie
  ? { Cookie: `merchant_session=${sessionCookie}` }
  : {};

const merchantId =
  verifyMerchantSession(sessionCookie) ||
  params?.merchant_id ||
  null;

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
  `${baseUrl}/api/dashboard`,
  {
    cache: "no-store",
    headers: authHeaders,
  }
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
  `${baseUrl}/api/sync/status`,
  {
    cache: "no-store",
    headers: authHeaders,
  }
);
    syncStatus = await syncRes.json();
  } catch (err) {
    syncStatus = null;
  }

  try {
    const salesRes = await fetch(
  `${baseUrl}/api/sales/insights`,
  {
    cache: "no-store",
    headers: authHeaders,
  }
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

const stagnantProducts = getStagnantProducts(
  lowStockProducts,
  salesInsights
);

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

 const productsWithKnownStockCount = totalProductsCount;

const productsInStockCount =
  Math.max(0, totalProductsCount - lowStockCount);

const {
  stockHealthScore,
  stagnantHealthScore,
  salesHealthScore,
  averageOrderHealthScore,
  productDataHealthScore,
  storeHealthPercentage,
  storeHealthLabel,
  storeHealthMessage,
} = getStoreHealth({
  totalProductsCount,
  lowStockCount,
  stagnantCount,
  totalOrdersCount,
  totalRevenueValue,
  averageOrderValue,
  productsWithPrice,
  productsWithCost,
});

const profitableProducts = getProfitableProducts(lowStockProducts);
  
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

<DashboardHeader
  merchantId={merchantId}
  styles={styles}
/>

<DemoNotice styles={styles} />

    <QuickNav styles={styles} />
              
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

     <KpiSummarySection
  totalRevenueValue={totalRevenueValue}
  totalOrdersCount={totalOrdersCount}
  averageOrderValue={averageOrderValue}
  totalProductsCount={totalProductsCount}
  lowStockCount={lowStockCount}
  topProduct={topProduct}
  styles={styles}
  KpiCard={KpiCard}
  formatCurrency={formatCurrency}
  formatNumber={formatNumber}
/>

      <TodayPrioritiesSection
  outOfStockProducts={outOfStockProducts}
  onlyLowStockProducts={onlyLowStockProducts}
  styles={styles}
  PriorityCard={PriorityCard}
/>

<SalesSummarySection
  totalRevenueValue={totalRevenueValue}
  totalOrdersCount={totalOrdersCount}
  totalItemsSold={totalItemsSold}
  averageItemsPerOrder={averageItemsPerOrder}
  topProduct={topProduct}
  topCity={topCity}
  salesInsights={salesInsights}
  styles={styles}
  KpiCard={KpiCard}
  formatCurrency={formatCurrency}
  formatNumber={formatNumber}
/>

<TopProductsTable
  salesInsights={salesInsights}
  styles={styles}
  formatCurrency={formatCurrency}
  EmptyBox={EmptyBox}
/>
  
      <ProfitabilitySection
  profitableProducts={profitableProducts}
  styles={styles}
  formatCurrency={formatCurrency}
  EmptyBox={EmptyBox}
/>

       <DataQualitySection
  dataQualityAlerts={dataQualityAlerts}
  styles={styles}
/>
      
     <RecommendationsSection
  marketingSuggestions={marketingSuggestions}
  styles={styles}
  EmptyBox={EmptyBox}
/>

<InventoryWatchSection
  merchantId={merchantId}
  stockFilter={stockFilter}
  filteredLowStockProducts={filteredLowStockProducts}
  styles={styles}
  formatCurrency={formatCurrency}
  EmptyBox={EmptyBox}
/>

<StagnantProductsSection
  stagnantProducts={stagnantProducts}
  styles={styles}
  formatCurrency={formatCurrency}
  EmptyBox={EmptyBox}
/>

<SyncStatusSection
  syncStatus={syncStatus}
  styles={styles}
/>
    </main>
  );
}
