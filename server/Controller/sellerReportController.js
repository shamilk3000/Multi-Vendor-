const sellerReportService = require("../Service/sellerReportService");

const getSellerReport = async (req, res) => {
  try {
    const sellerReport = await sellerReportService.getSellerReport(
      req.seller._id
    );
    return res.status(200).json({ sellerReport });
  } catch (error) {
    console.error(`Error getting seller report`, error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSellerReport,
};
