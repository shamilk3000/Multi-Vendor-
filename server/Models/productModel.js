const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: [
      {
        type: String,
      required: true,
      trim: true,
      },
    ],
    image: [
      {
        type: String,
        required: true,
      },
    ],
    mrpPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 0, // average value (like 4.3)
    },
    ratingCount: {
      type: Number,
      default: 0, // total ratings count
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    needAttachment: {
      type: Boolean,
      default: false,
    },
    needMessage: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedBy: {
      type: String,
      enum: ["manual", "cascade", null],
      default: null,
    },
    sale: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
