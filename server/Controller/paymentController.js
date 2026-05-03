const paymentService = require("../Service/paymentService");
const orderService = require("../Service/orderService");
const Order = require("../Models/orderModel");
const Seller = require("../Models/sellerModel");
const sellerReportService = require("../Service/sellerReportService");
const Cart = require("../Models/cartModel");
const CartItem = require("../Models/cartItemModel");
const transactionService = require("../Service/transactionService");

const paymentHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentLinkId } = req.query;
    const user = req.user;

    const payment = await paymentService.getPaymentOrderByPaymentLinkId(
      paymentLinkId
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const paymentSuccess = await paymentService.proceedPayment(
      payment,
      paymentId,
      paymentLinkId
    );

    if (paymentSuccess) {
      const order = await Order.findOne({ _id: payment.orderId })
        .populate("userId")
        .populate("sellerId")
        .populate("orderItems")
        .populate("shippingAddress")
        .populate("paymentId");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const transaction = await transactionService.createTransaction(order._id);
      const seller = await Seller.findOne({ _id: order.sellerId });
      const sellerReport = await sellerReportService.getSellerReport(
        seller._id
      );

      sellerReport.totalEarnings += order.totalSellingPrice;
      sellerReport.totalSales += order.orderItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      sellerReport.totalRefunds += 0;
      sellerReport.totalOrders += 1;
      sellerReport.cancelledOrders += 0;
      sellerReport.totalTransactions += 1;

      await sellerReportService.updateSellerReport(seller._id, sellerReport);
      const cart = await Cart.findOne({ userId: user._id });
      await CartItem.deleteMany({
        _id: { $in: cart.items },
      });
      cart.items = [];
      await cart.save();
      return res.status(200).json({ message: "Payment successful" });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error(`Error processing payment order`, error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  paymentHandler,
};
