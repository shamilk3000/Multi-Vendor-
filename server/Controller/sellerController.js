const sellerService = require("../Service/sellerService");
const { createMulterUpload } = require("../Utils/multerUtil");
const sellerUpload = createMulterUpload("Seller");
const { stripe } = require("../Utils/stripe");
const Seller = require("../Models/sellerModel");
require("dotenv").config();

const getAllSellers = async (req, res) => {
  try {
    const { status } = req.query;
    const sellers = await sellerService.getAllSellers(status);

    return res.status(200).json({ sellers });
  } catch (error) {
    console.error("getAllSellers Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const sellerId = await req.seller;
    const seller = await Seller.findById(sellerId)
      .populate("address")
      .populate("businessDetails.businessAddress");
    return res.status(200).json( seller );
  } catch (error) {
    console.error("getSellerProfile Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getSellerProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await sellerService.getSellerProfileById(id);
    if (!seller) {
      return res.status(401).json({ message: "Seller not exist" });
    }
    return res.status(200).json({ seller });
  } catch (error) {
    console.error("getSellerProfileById Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const createSellerDetails = (req, res) => {
  sellerUpload.fields([
    { name: "personalImage", maxCount: 1 },
    { name: "idProof", maxCount: 3 },
  ])(req, res, async (err) => {
    try {
      if (err)
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });

      const result = await sellerService.createSellerDetails(req, res);
      return res.status(201).json({
        seller: result.seller,
        onboardingUrl: result.onboardingUrl,
        message: "Seller profile completed. Please choose a plan",
      });
    } catch (error) {
      console.error("createSellerDetails Controller Error:", error);
      return res.status(500).json({ message: error.message });
    }
  });
};

const checkStripeSellerStatus = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(400).json({
        message: "Seller not found",
      });
    }
    if (!seller.bankingDetails.stripeAccountId) {
      return res.status(200).json({
        isReady: false,
      });
    }
    const account = await stripe.accounts.retrieve(
      seller.bankingDetails.stripeAccountId,
    );

    const isReady =
      account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled;

    return res.status(200).json({
      isReady,
      status: {
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
      requirements: {
        currently_due: account.requirements?.currently_due || [],
        past_due: account.requirements?.past_due || [],
      },
    });
  } catch (error) {
    console.error("createSellerDetails Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const retryStripeOnboarding = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(400).json({
        message: "Seller not found",
      });
    }
    if (!seller.bankingDetails.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
      });
      seller.bankingDetails.stripeAccountId = account.id;

      await seller.save();

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: process.env.REFRESH_URL,
        return_url: process.env.RETURN_URL,
        type: "account_onboarding",
      });

      // you can return this later if needed
      return res.json({ onboardingUrl: accountLink.url });
    }

    const accountLink = await stripe.accountLinks.create({
      account: seller.bankingDetails.stripeAccountId,
      refresh_url: process.env.REFRESH_URL,
      return_url: process.env.RETURN_URL,
      type: "account_onboarding",
    });

    return res.json({ onboardingUrl: accountLink.url });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// const updateSeller = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ message: "Request body cannot be empty" });
//     }

//     const existingSeller = await req.seller;
//     if (!existingSeller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }

//     const seller = await sellerService.updateSeller(existingSeller, req.body);
//     return res.status(200).json({ seller });
//   } catch (error) {
//     console.error("updateSeller Controller Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

const updateSeller = async (req, res) => {
    try {
      const sellerData = req.body;
      const existingSeller = await req.seller;
      if (!existingSeller) {
        return res.status(404).json({ message: "Seller not found" });
      }
      const seller = await sellerService.updateSeller(existingSeller, sellerData);
      return res.status(200).json({ seller });
    } catch (error) {
      console.error("updateSeller Controller Error:", error);
      return res.status(500).json({ message: error.message });
    }
  };

// const deleteSeller = async (req, res) => {
//   try {
//     const existingSeller = req.params.id;
//     if (!existingSeller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }

//     const seller = await sellerService.deleteSeller(existingSeller);
//     return res
//       .status(200)
//       .json({ message: "Seller deleted successfully", seller });
//   } catch (error) {
//     console.error("deleteSeller Controller Error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

const updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.params;
    const updatedSeller = await sellerService.updateSellerStatus(id, status);
    return res.status(200).json({ updatedSeller });
  } catch (error) {
    console.error("updateSellerStatus Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const googleAuthController = async (req, res) => {
  try {
    const { credential } = req.body;
    const { seller, isNew } = await sellerService.sellerGoogleAuth(
      credential,
      res,
    );

    return res.status(200).json({
      message: isNew
        ? "Signup successful! Complete profile"
        : "Welcome back 👋! Login successful",
      seller,
    });
  } catch (error) {
    console.error("Google Auth Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { seller, isComplete } = await sellerService.sellerLogin(
      email,
      password,
      res,
    );

    return res.status(200).json({
      seller,
      message: isComplete
        ? "Please complete your profile to continue"
        : "Login successful",
    });
  } catch (error) {
    console.error("sellerLogin Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const startSellerSignup = async (req, res) => {
  try {
    const result = await sellerService.startSellerSignup(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("startSellerSignup Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const verifySellerSignupOtp = async (req, res) => {
  try {
    const { otp, sellerData } = req.body;
    const result = await sellerService.verifyOtpAndCreateSeller(
      otp,
      sellerData,
    );

    return res.status(result.isVerified ? 201 : 400).json({
      email: result.email,
      otpVerified: result.isVerified, // tells frontend if OTP verified
      message: result.message,
    });
  } catch (error) {
    console.error("verifySellerSignupOtp Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerForgetPasswordOtpSend = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sellerService.sellerForgetPasswordOtp(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("sellerForgetPasswordOtpSend Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerForgetPasswordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await sellerService.sellerForgetPasswordOtpVerify(
      email,
      otp,
    );
    return res.status(result.isVerified ? 200 : 400).json(result);
  } catch (error) {
    console.error("sellerForgetPasswordOtpVerify Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sellerService.sellerResetPassword(email, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error("sellerResetPassword Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerResetPasswordDashboard = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.seller.email;
    const result = await sellerService.sellerResetPassword(email, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error("sellerResetPasswordDashboard Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const sellerSubscription = async (req, res) => {
  try {
    const { priceId, sellerId, sellerEmail } = req.body;

    const url = await sellerService.handleSellerSubscription(
      priceId,
      sellerId,
      sellerEmail,
    );

    res.json({ url });
  } catch (error) {
    console.error("Subscription error:", error.message);

    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
};

const logout = async (req, res) => {
  try {
    // clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
    });

    // clear request values
    req.seller = null;
    req.tokenSellerId = null;
    req.tokenShopName = null;

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllSellers,
  getSellerProfile,
  getSellerProfileById,
  createSellerDetails,
  checkStripeSellerStatus,
  retryStripeOnboarding,
  updateSeller,
  // deleteSeller,
  updateSellerStatus,
  googleAuthController,
  sellerLogin,
  startSellerSignup,
  verifySellerSignupOtp,
  sellerForgetPasswordOtpSend,
  sellerForgetPasswordOtpVerify,
  sellerResetPassword,
  sellerResetPasswordDashboard,
  sellerSubscription,
  logout,
};
