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
    perItem: {
      type: Number,
      required: true,
      default: 0,
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
    customMessage: {
      type: String,
    },
    customImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
