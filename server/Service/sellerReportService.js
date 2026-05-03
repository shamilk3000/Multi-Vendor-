const SellerReport = require("../Models/sellerReportModel");

const getSellerReport = async (sellerId) => {
  try {
    const sellerReport = await SellerReport.findOne({ sellerId });
    if (!sellerReport) {
      sellerReport = new SellerReport({
        sellerId,
        totalEarnings: 0,
        totalSales: 0,
        totalRefunds: 0,
        totalOrders: 0,
        cancelledOrders: 0,
        totalTransactions: 0,
      });
      await sellerReport.save();
    }
    return sellerReport;
  } catch (error) {
    console.error(`Error finding seller report`, error);
    throw new Error(`Unable to find seller report : ${error.message}`);
  }
};

const updateSellerReport = async (sellerId, updateSellerReport) => {
  try {
    const sellerReport = await SellerReport.findOneAndUpdate(
      { sellerId },
      updateSellerReport,
      { new: true }
    );
    return sellerReport;
  } catch (error) {
    console.error(`Error updating seller report`, error);
    throw new Error(`Unable to update seller report : ${error.message}`);
  }
};

module.exports = {
  getSellerReport,
  updateSellerReport,
};
