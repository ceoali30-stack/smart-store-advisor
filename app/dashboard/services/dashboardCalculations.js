export function getTopProductsMap(salesInsights) {
  const topProductsMap = {};

  (salesInsights?.top_products || []).forEach((product) => {
    topProductsMap[product.product_name] = product;
  });

  return topProductsMap;
}

export function getStagnantProducts(lowStockProducts, salesInsights) {
  const topProductsMap = getTopProductsMap(salesInsights);

  return lowStockProducts
    .filter((product) => {
      const quantity = Number(product.quantity || 0);

      const salesData =
        topProductsMap[product.name] ||
        topProductsMap[product.product_name];

      const soldCount = Number(salesData?.sold_count || 0);

      return quantity > 0 && soldCount === 0;
    })
    .slice(0, 10);
}

export function getProfitableProducts(lowStockProducts) {
  return lowStockProducts
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
}
export function getStoreHealth({
  totalProductsCount,
  lowStockCount,
  stagnantCount,
  totalOrdersCount,
  totalRevenueValue,
  averageOrderValue,
  productsWithPrice,
  productsWithCost,
}) {
  const stockHealthScore =
    totalProductsCount > 0
      ? Math.max(
          0,
          25 - Math.min(25, (lowStockCount / totalProductsCount) * 10)
        )
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

  return {
    stockHealthScore,
    stagnantHealthScore,
    salesHealthScore,
    averageOrderHealthScore,
    productDataHealthScore,
    storeHealthPercentage,
    storeHealthLabel,
    storeHealthMessage,
  };
}
export function getDataQualityAlerts(
  productsForDataQuality,
  salesInsights
) {
  const productsWithoutCost = productsForDataQuality.filter(
    (product) =>
      Number(
        product.cost_price ||
          product.raw_data?.cost_price ||
          0
      ) <= 0
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

  return [
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
}
export function getMarketingSuggestions({
  topProduct,
  outOfStockProducts,
  onlyLowStockProducts,
  averageOrderValue,
  formatCurrency,
}) {
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

  return marketingSuggestions;
}
