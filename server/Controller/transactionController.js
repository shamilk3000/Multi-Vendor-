const transactionService = require("../Service/transactionService");

const getTransactionsBySellerId = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsBySellerId(
      req.seller._id
    );
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(`Error getting transactions by seller id`, error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(`Error getting all transactions`, error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactionsBySellerId,
  getAllTransactions,
};
