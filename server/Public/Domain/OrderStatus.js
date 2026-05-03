const OrderStatus = Object.freeze({
  PENDING: "pending",
  PLACED: "placed",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

module.exports = OrderStatus;