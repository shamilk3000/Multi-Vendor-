const Address = require("../Models/addressModel");
const OrderItem = require("../Models/orderItemModel");
const Order = require("../Models/orderModel");
const OrderStatus = require("../Public/Domain/OrderStatus");
const productService = require("./productService");

const createOrder = async (user, cart, shippingAddress) => {
  try {
    if (shippingAddress._id && !user.addresses.includes(shippingAddress._id)) {
      user.addresses.push(shippingAddress._id);
      await user.save();
    }
    if (!shippingAddress._id) {
      shippingAddress = await Address.create(shippingAddress);
      user.addresses.push(shippingAddress._id);
      await user.save();
    }

    let orderItems = [];
    let totalItems = cart.items.length;
    let totalMrp = 0;
    let totalSellingPrice = 0;
    let totalDiscount = 0;
    let discountPercentage = 0;
    for (const item of cart.items) {
      totalMrp += item.totalMrp;
      totalSellingPrice += item.totalSellingPrice;
      totalDiscount += item.totalDiscount;

      let orderItem = new OrderItem({
        product: item.product._id,
        quantity: item.quantity,
        totalMrp: item.totalMrp,
        totalSellingPrice: item.totalSellingPrice,
        totalDiscount: item.totalDiscount,
      });
      await orderItem.save();
      orderItems.push(orderItem);
    }
    discountPercentage = productService.calculateDiscountPercentage(
      totalMrp,
      totalSellingPrice
    );

    const order = new Order({
      userId: user._id,
      sellerId: user.sellerId,
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      totalMrp: totalMrp,
      totalSellingPrice: totalSellingPrice,
      totalDiscount: totalDiscount,
      discountPercentage: discountPercentage,
      totalItems: totalItems,
    });
    await order.save();
    return order;
  } catch (error) {
    console.error(`Error creating order`, error);
    throw new Error(`Unable to create order : ${error.message}`);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate([
      "orderItems",
      "shippingAddress",
    ]);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    console.error(`Error finding order`, error);
    throw new Error(`Unable to find order : ${error.message}`);
  }
};

const allOrdersOfSeller = async (sellerId) => {
  try {
    const orders = await Order.find({ sellerId: sellerId })
      .sort({ orderDate: -1 })
      .populate(["orderItems", "shippingAddress"]);
    return orders;
  } catch (error) {
    console.error(`Error finding orders of seller`, error);
    throw new Error(`Unable to find orders of seller : ${error.message}`);
  }
};

const allOrdersOfUser = async (userId) => {
  try {
    const orders = await Order.find({ userId: userId })
      .sort({ orderDate: -1 })
      .populate(["orderItems", "shippingAddress"]);
    return orders;
  } catch (error) {
    console.error(`Error finding orders of user`, error);
    throw new Error(`Unable to find orders of user : ${error.message}`);
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    ).populate(["orderItems", "shippingAddress"]);
  } catch (error) {
    console.error(`Error updating order status`, error);
    throw new Error(`Unable to update order status : ${error.message}`);
  }
};

const cancelOrder = async (orderId) => {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: OrderStatus.CANCELLED },
      { new: true }
    ).populate(["orderItems", "shippingAddress"]);
  } catch (error) {
    console.error(`Error cancelling order`, error);
    throw new Error(`Unable to cancel order : ${error.message}`);
  }
};

const getOderItemById = async (orderItemId) => {
  try {
    const orderItem = await OrderItem.findById(orderItemId).populate("product");
    if (!orderItem) {
      throw new Error("Order item not found");
    }
    return orderItem;
  } catch (error) {
    console.error(`Error finding order item`, error);
    throw new Error(`Unable to find order item : ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  allOrdersOfSeller,
  allOrdersOfUser,
  updateOrderStatus,
  cancelOrder,
  getOderItemById,
};
