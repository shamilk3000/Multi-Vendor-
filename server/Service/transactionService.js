const Order = require("../Models/orderModel");
const SellerReport = require("../Models/sellerReportModel");
const Transaction = require("../Models/transactionModel");

const createTransaction = async (orderId) => {
  try {
    const order = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate("sellerId")
      .populate("orderItems")
      .populate("shippingAddress")
      .populate("paymentId");

    if (!order) {
      throw new Error("Order not found");
    }

    const sellerReport = await SellerReport.findOne({
      sellerId: order.sellerId,
    });
    if (!sellerReport) {
      throw new Error("Seller report not found");
    }

    const transaction = new Transaction({
      sellerId: order.sellerId,
      userId: order.userId,
      orderId: order._id,
    });
    await transaction.save();
    return transaction;
  } catch (error) {
    console.error(`Error creating transaction`, error);
    throw new Error(`Unable to create transaction : ${error.message}`);
  }
};

const getTransactionsBySellerId = async (sellerId) => {
  try {
    const transactions = await Transaction.find({ sellerId })
      .populate("userId")
      .populate("orderId")
      .populate("sellerId");
    return transactions;
  } catch (error) {
    console.error(`Error getting transactions by seller id`, error);
    throw new Error(
      `Unable to get transactions by seller id : ${error.message}`
    );
  }
};

const getAllTransactions = async () => {
  try {
    const transactions = await Transaction.find()
      .populate("userId")
      .populate("orderId")
      .populate("sellerId");
    return transactions;
  } catch (error) {
    console.error(`Error getting all transactions`, error);
    throw new Error(`Unable to get all transactions : ${error.message}`);
  }
};

module.exports = {
  createTransaction,
  getTransactionsBySellerId,
  getAllTransactions,
};
