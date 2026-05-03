const mongoose = require("mongoose");

const sellerReportSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalRefunds: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    cancelledOrders: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalCustomers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SellerReport = mongoose.model("SellerReport", sellerReportSchema);

module.exports = SellerReport;
