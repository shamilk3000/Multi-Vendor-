const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
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
    needAttachment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
