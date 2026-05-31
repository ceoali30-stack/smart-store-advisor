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
