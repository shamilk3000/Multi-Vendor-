const orderService = require("../Service/orderService");
const cartService = require("../Service/cartService");
const paymentService = require("../Service/paymentService");
const { createMulterUpload } = require("../Utils/multerUtil");
const userOrderUpload = createMulterUpload("User/OrderCustomizations");
const Order = require("../Models/orderModel");

const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const shippingAddress = req.body.shippingAddress;
    const isBuyNow = req.body.isBuyNow;
    const cart = req.body.cart;

    const order = await orderService.createOrder(
      user,
      cart,
      shippingAddress,
      isBuyNow,
    );

    const response = {};

    response.order = order;
    return res.status(200).json(response);
  } catch (error) {
    console.error("createOrder Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const customize = async (req, res) => {
  userOrderUpload.any()(req, res, async (err) => {
    try {
      if (err)
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });

      const user = req.user;
      const orderId = req.body.orderId;
      const customData = JSON.parse(req.body.customData);

      req.files.forEach((file) => {
        const productId = file.fieldname.replace("images_", "");

        customData[productId].images.push(
          `/Uploads/User/OrderCustomizations/${user.email}-${user._id}/${file.filename}`,
        );
      });

      const order = await orderService.customize(user, customData, orderId);
      return res.status(200).json(order);
    } catch (error) {
      console.error("customize Controller Error:", error);
      return res.status(500).json({ message: error.message });
    }
  });
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    return res.status(200).json({order});
  } catch (error) {
    console.error("getOrderById Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getOrderByIdForSeller = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderByIdForSeller(orderId);
    return res.status(200).json(order);
  } catch (error) {
    console.error("getOrderByIdForSeller Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const allOrdersOfSeller = async (req, res) => {
  try {
    const sellerId = req?.seller?._id;
    const orders = await Order.find({
      sellerId: sellerId,
      paymentStatus: "success",
    })
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
    return res.status(200).json(orders);
  } catch (error) {
    console.error("allOrdersOfSeller Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const allOrdersOfUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.allOrdersOfUser(userId);
    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("allOrdersOfUser Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.params;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("updateOrderStatus Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await orderService.cancelOrder(orderId);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("cancelOrder Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getOderItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const orderItem = await orderService.getOderItemById(itemId);
    return res.status(200).json(orderItem);
  } catch (error) {
    console.error("getOderItemById Controller Error:", error);
    return res.status(500).json({ message: error.message });
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
