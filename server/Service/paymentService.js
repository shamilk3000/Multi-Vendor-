const Payment = require("../Models/paymentModel");
const PaymentStatus = require("../Public/Domain/PaymentStatus");
const Order = require("../Models/orderModel");
const razorpay = require("../Configurations/razorpayConfig");
const OrderStatus = require("../Public/Domain/OrderStatus");

const createPaymentOrder = async (user, orders) => {
  try {
    const amount = orders.orderItems.reduce(
      (total, order) => total + order.totalSellingPrice,
      0
    );
    const payment = new Payment({
      userId: user._id,
      amount: amount,
      paymentStatus: PaymentStatus.PENDING,
      //   paymentMethod: "RAZORPAY",
      orderId: orders._id,
    });
    await payment.save();
    const order = await Order.findOne({
      _id: orders._id,
    });
    order.paymentId = payment._id;
    await order.save();
    return payment;
  } catch (error) {
    console.error(`Error creating payment order`, error);
    throw new Error(`Unable to create payment order : ${error.message}`);
  }
};

const getPaymentOrderById = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  } catch (error) {
    console.error(`Error finding payment order`, error);
    throw new Error(`Unable to find payment order : ${error.message}`);
  }
};

const getPaymentOrderByPaymentLinkId = async (paymentLinkId) => {
  try {
    const payment = await Payment.findOne({ paymentLinkId });
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  } catch (error) {
    console.error(`Error finding payment order`, error);
    throw new Error(`Unable to find payment order : ${error.message}`);
  }
};

const createPaymentLink = async (user, orders) => {
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: orders.totalSellingPrice * 100,
      currency: "INR",
      customer: {
        user_id: user._id,
        seller_id: user.sellerId,
        email: user.email,
        order_id: orders._id,
      },
      notify: {
        email: true,
      },
      callback_url: "http://localhost:5000/payment-success",
      callback_method: "GET",
    });
    return paymentLink;
  } catch (error) {
    console.error(`Error creating payment link`, error);
    throw new Error(`Unable to create payment link : ${error.message}`);
  }
};

const proceedPayment = async (payment, paymentId, paymentLinkId) => {
  try {
    if (payment.paymentStatus === PaymentStatus.PENDING) {
      const paymentRzr = await razorpay.payments.fetch(paymentId);
      if (paymentRzr.status === "captured") {
        const order = await Order.findOne({ paymentId: payment._id });
        order.paymentStatus = PaymentStatus.SUCCESS;
        order.orderStatus = OrderStatus.PLACED;
        await order.save();

        payment.paymentStatus = PaymentStatus.SUCCESS;
        payment.paymentLinkId = paymentLinkId;
        await payment.save();
        return true;
      } else {
        payment.paymentStatus = PaymentStatus.FAILED;
        await payment.save();
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing payment order`, error);
    throw new Error(`Unable to process payment order : ${error.message}`);
  }
};

module.exports = {
  createPaymentOrder,
  getPaymentOrderById,
  getPaymentOrderByPaymentLinkId,
  createPaymentLink,
  proceedPayment,
};
