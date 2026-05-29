const mongoose = require("mongoose");
const PaymentStatus = require("../Public/Domain/PaymentStatus");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    totalAmount: {
      type: Number,
    },
    stripeFee: {
      type: Number,
    },
    creditedAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "STRIPE",
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
