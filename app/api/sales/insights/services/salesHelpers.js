export function getOrderTotal(order) {
  return Number(
    order.total_amount ||
      order.total ||
      order.amount ||
      order.grand_total ||
      0
  );
}

export function getTopKey(obj) {
  const entries = Object.entries(obj || []);

  if (entries.length === 0) {
    return "لا توجد بيانات";
  }

  return entries.sort((a, b) => b[1] - a[1])[0][0];
}
