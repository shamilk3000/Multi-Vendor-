const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    needAttachment: {
      type: Boolean,
      default: false,
    },
    attachmentItem: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
