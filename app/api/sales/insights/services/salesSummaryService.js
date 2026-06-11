import { getOrderTotal } from "./salesHelpers";

export function getSalesSummary(
  orders,
  items,
  abandonedCarts
) {
  const safeOrders = orders || [];
  const safeItems = items || [];
  const safeAbandonedCarts = abandonedCarts || [];

  const totalOrders = safeOrders.length;

  const totalRevenue = safeOrders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );

  const totalItemsSold = safeItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? Number((totalRevenue / totalOrders).toFixed(2))
      : 0;

  const averageItemsPerOrder =
    totalOrders > 0
      ? Number((totalItemsSold / totalOrders).toFixed(2))
      : 0;

  const abandonedCartsCount = safeAbandonedCarts.length;

  const abandonedCartsValue = safeAbandonedCarts.reduce(
    (sum, cart) => sum + Number(cart.total_amount || 0),
    0
  );

  const abandonedCartsItems = safeAbandonedCarts.reduce(
    (sum, cart) => sum + Number(cart.items_count || 0),
    0
  );

  const averageAbandonedCartValue =
    abandonedCartsCount > 0
      ? Number(
          (abandonedCartsValue / abandonedCartsCount).toFixed(2)
        )
      : 0;

  return {
    totalOrders,
    totalRevenue,
    totalItemsSold,
    averageOrderValue,
    averageItemsPerOrder,
    abandonedCartsCount,
    abandonedCartsValue,
    abandonedCartsItems,
    averageAbandonedCartValue,
  };
}
