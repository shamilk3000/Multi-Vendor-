// const adminService = require("../Service/adminService");
const Seller = require("../Models/sellerModel");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let isComplete = false;
    if (email == process.env.ADMIN_USER && password == process.env.ADMIN_PASS) {
      isComplete = true;
    } else {
      throw new Error("The email or password is incorrect. Please try again.");
    }

    return res.status(200).json({
      admin: email,
      message: isComplete
        ? "Welcome back 👋! Login successful"
        : "The email or password is incorrect. Please try again.",
    });
  } catch (error) {
    console.error("adminLogin Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getSellers = async (req, res) => {
  try {
    const email = req.params.email;

    if (email !== process.env.ADMIN_USER) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED_ADMIN",
        message: "Session expired",
      });
    }

    const sellers = await Seller.find();

    return res.status(200).json(sellers);
  } catch (error) {
    console.error("adminLogin Controller Error:", error);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR_ADMIN",
      message: error.message,
    });
  }
};

const updateAmount = async (req, res) => {
  try {
    const email = req.params.email;
    const sellerId = req.params.sellerId;

    if (email !== process.env.ADMIN_USER) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED_ADMIN",
        message: "Session expired",
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not fount.");
    }
    seller.wallet.creditedAmount = 0;
    seller.wallet.stripeFee = 0;
    seller.wallet.total = 0;
    await seller.save();

    return res.status(200).json(seller);
  } catch (error) {
    console.error("adminLogin Controller Error:", error);
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR_ADMIN",
      message: error.message,
    });
  }
};

module.exports = {
  login,
  getSellers,
  updateAmount,
};
