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
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
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
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
        type: Date,
        default: function() {
            return new Date(this.orderDate.getTime() + 7*24*60*60*1000);
        },
    },
    additionalNotes: {
      type: String,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
