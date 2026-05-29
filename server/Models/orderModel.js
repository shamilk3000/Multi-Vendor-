const mongoose = require("mongoose");
const OrderStatus = require("../Public/Domain/OrderStatus");
const PaymentStatus = require("../Public/Domain/PaymentStatus");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    orderId: {
      type: String,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        default: null,
      },
    ],
    cartDeleteItemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
        default: null,
      },
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    totalMrp: {
      type: Number,
      required: true,
      default: 0,
    },
    totalSellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    stripeFee: {
      type: Number,
    },
    creditedAmount: {
      type: Number,
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    totalItems: {
      type: Number,
      required: true,
        default: 0,
    },
    paymentStatus: {
        type: String,
        enum:Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    },
    additionalNotes: {
      type: String,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    isNew: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
