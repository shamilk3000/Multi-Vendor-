const Address = require("../Models/addressModel");
const Cart = require("../Models/cartModel");
const CartItem = require("../Models/cartItemModel");
const OrderItem = require("../Models/orderItemModel");
const Order = require("../Models/orderModel");
const OrderStatus = require("../Public/Domain/OrderStatus");
const productService = require("./productService");
const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const createOrder = async (user, cart, shippingAddress, isBuyNow) => {
  try {
    let address = await Address.findById(user.address);

    if (address) {
      address.name = shippingAddress.name;
      address.phone = shippingAddress.phone;
      address.email = shippingAddress.email;
      address.flatNoOrVillaNo = shippingAddress.flatNoOrVillaNo;
      address.street = shippingAddress.street;
      address.area = shippingAddress.area;
      address.city = shippingAddress.city;
      address.emirate = shippingAddress.emirate;
      address.landmark = shippingAddress.landmark;
      address.postalCode = shippingAddress.postalCode;
      address.addressType = "address";
      await address.save();
    } else {
      address = await Address.create({
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        flatNoOrVillaNo: shippingAddress.flatNoOrVillaNo,
        street: shippingAddress.street,
        area: shippingAddress.area,
        city: shippingAddress.city,
        emirate: shippingAddress.emirate,
        landmark: shippingAddress.landmark,
        postalCode: shippingAddress.postalCode,
        addressType: "address",
      });
      user.address = address._id;
      await user.save();
    }

    let orderItems = [];
    let totalItems = cart.items.length;
    let totalMrp = 0;
    let totalSellingPrice = 0;
    let totalDiscount = 0;
    let discountPercentage = 0;
    for (const item of cart.items) {
      totalMrp += item.product.mrpPrice * item.quantity;

      totalSellingPrice += item.product.sellingPrice * item.quantity;

      totalDiscount +=
        (item.product.mrpPrice - item.product.sellingPrice) * item.quantity;

      let orderItem = new OrderItem({
        product: item.product._id,
        quantity: item.quantity,
        totalMrp: item.product.mrpPrice * item.quantity,
        totalSellingPrice: item.product.sellingPrice * item.quantity,
        totalDiscount:
          (item.product.mrpPrice - item.product.sellingPrice) * item.quantity,
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
    }
    if (totalMrp > 0) {
      discountPercentage = productService.calculateDiscountPercentage(
        totalMrp,
        totalSellingPrice,
      );
    }

    const order = new Order({
      userId: user._id,
      sellerId: user.sellerId,
      orderItems: orderItems,
      shippingAddress: address._id,
      totalMrp: totalMrp,
      totalSellingPrice: totalSellingPrice,
      totalDiscount: totalDiscount,
      discountPercentage: discountPercentage,
      totalItems: totalItems,
      additionalNotes: shippingAddress.additionalNotes,
    });
    if (!isBuyNow) {
      const ogCart = await Cart.findOne({ userId: user._id });
      for (const item of cart.items) {
        order.cartDeleteItemIds.push(item._id);
      }
    }
    await order.save();
    order.orderId = `#ORD-${order._id}`;
    await order.save();
    const fullOrder = await Order.findById(order._id).populate([
      {
        path: "orderItems",
        populate: {
          path: "product",
        },
      },
      {
        path: "shippingAddress",
      },
    ]);
    return fullOrder;
  } catch (error) {
    console.error(`Error creating order`, error);
    throw new Error(`Unable to create order : ${error.message}`);
  }
};

const customize = async (user, customData, orderId) => {
  try {
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // loop through order items
    for (const item of order.orderItems) {
      const productId = item.product._id.toString();

      if (customData[productId]) {
        item.customMessage = customData[productId].message;
        item.customImages = customData[productId].images;
        // save populated orderItem document
        await item.save();
      }
    }
    // save updated order
    await order.save();

    return order;
  } catch (error) {
    console.error(`Error creating order`, error);
    throw new Error(`Unable to create order : ${error.message}`);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("paymentId")
      .populate("sellerId")
      .populate("shippingAddress")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: [{ path: "category" }, { path: "subCategory" }],
        },
      });
    if (!order) {
      throw new Error("Order not found");
    }
    order.orderItems.sort((a, b) =>
      a.product.name.localeCompare(b.product.name),
    );
    return order;
  } catch (error) {
    console.error(`Error finding order`, error);
    throw new Error(`Unable to find order : ${error.message}`);
  }
};

const getOrderByIdForSeller = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("paymentId")
      .populate("sellerId")
      .populate("shippingAddress")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: [{ path: "category" }, { path: "subCategory" }],
        },
      });
    if (!order) {
      throw new Error("Order not found");
    }
    order.isNew = false;
    await order.save();
    order.orderItems.sort((a, b) =>
      a.product.name.localeCompare(b.product.name),
    );
    return order;
  } catch (error) {
    console.error(`Error finding order`, error);
    throw new Error(`Unable to find order : ${error.message}`);
  }
};

const allOrdersOfSeller = async (sellerId) => {
  try {
    const orders = await Order.find({ sellerId: sellerId }).populate([
      "orderItems",
      "shippingAddress",
    ]);
    return orders;
  } catch (error) {
    console.error(`Error finding orders of seller`, error);
    throw new Error(`Unable to find orders of seller : ${error.message}`);
  }
};

const allOrdersOfUser = async (userId) => {
  try {
    const orders = await Order.find({
      userId: userId,
      paymentStatus: "success",
    })
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("sellerId")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: [{ path: "category" }, { path: "subCategory" }],
        },
      });
    for (const order of orders) {
      order.orderItems.sort((a, b) =>
        a.product.name.localeCompare(b.product.name),
      );
    }
    return orders;
  } catch (error) {
    console.error(`Error finding orders of user`, error);
    throw new Error(`Unable to find orders of user : ${error.message}`);
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true },
    )
      .populate("userId")
      .populate("paymentId")
      .populate("sellerId")
      .populate("shippingAddress")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: [{ path: "category" }, { path: "subCategory" }],
        },
      });
    if (newStatus === "Cancelled") {
      for (const item of order.orderItems) {
        const category = await Category.findById(item.product.category);
        const subCategory = await Category.findById(item.product.subCategory);
        const product = await Product.findById(item.product._id);
        product.stock += item.quantity;
        product.sale -= item.quantity;
        await product.save();
        category.sale -= item.quantity;
        await category.save();
        subCategory.sale -= item.quantity;
        await subCategory.save();
      }
    }
    return order;
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
      { new: true },
    )
      .populate("userId")
      .populate("paymentId")
      .populate("sellerId")
      .populate("shippingAddress")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: [{ path: "category" }, { path: "subCategory" }],
        },
      });
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
  customize,
  getOrderById,
  allOrdersOfSeller,
  allOrdersOfUser,
  updateOrderStatus,
  cancelOrder,
  getOderItemById,
  getOrderByIdForSeller,
};
