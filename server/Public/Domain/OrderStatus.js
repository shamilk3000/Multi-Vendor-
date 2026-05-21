const OrderStatus = Object.freeze({
  PENDING: "Pending",
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
});

module.exports = OrderStatus;