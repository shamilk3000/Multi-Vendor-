const userService = require("../Service/userService");
const Address = require("../Models/addressModel");
const User = require("../Models/userModel");
const Seller = require("../Models/sellerModel");

const googleAuthController = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { credential } = req.body;
    const { user, isNew } = await userService.userGoogleAuth(
      credential,
      sellerId,
      res,
    );

    return res.status(200).json({
      message: isNew
        ? "Signup successful!"
        : "Login successful! Welcome back 👋",
      user,
      isNew, // 👈 IMPORTANT: send this to frontend
    });
  } catch (error) {
    console.error("Google Auth Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const userSignup = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await userService.userSignup(req.body, sellerId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("userSignup Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const verifyUserSignupOtp = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { userData, otp } = req.body;
    const result = await userService.verifyOtpAndCreateUser(
      userData,
      otp,
      sellerId,
      res,
    );

    return res.status(result.isVerified ? 201 : 400).json({
      user: result.user,
      otpVerified: result.isVerified, // tells frontend if OTP verified
      message: result.message,
    });
  } catch (error) {
    console.error("verifySellerSignupOtp Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { email, password } = req.body;

    const { user } = await userService.userLogin(
      email,
      password,
      sellerId,
      res,
    );

    return res.status(200).json({ user });
  } catch (error) {
    console.error("userLogin Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const userForgetPasswordOtpSend = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { email } = req.body;
    const result = await userService.userForgetPasswordOtp(email, sellerId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("userForgetPasswordOtpSend Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const userForgetPasswordOtpVerify = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const data = req.body;
    const result = await userService.userForgetPasswordOtpVerify(
      data,
      data.otp,
      sellerId,
    );
    return res.status(result.isVerified ? 200 : 400).json({
      otpVerified: result.isVerified, // tells frontend if OTP verified
      message: result.message,
    });
  } catch (error) {
    console.error("userForgetPasswordOtpVerify Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const userResetPassword = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { email, password } = req.body;
    const result = await userService.userResetPassword(
      email,
      password,
      sellerId,
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("userResetPassword Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const userResetPasswordSlider = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { password } = req.body;
    const result = await userService.userResetPasswordSlider(password, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("userResetPasswordSlider Controller Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await req.user;
    const userProfile = await User.findById(user._id).populate("address");
    return res.status(200).json({ userProfile });
  } catch (error) {
    console.error("getUserProfile Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserFooter = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const seller = await Seller.findById(sellerId);
    const address = await Address.findById(
      seller.businessDetails.businessAddress,
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const footerData = {
      workingDays: seller.businessDetails.workingDays,
      openingHours: seller.businessDetails.openingHours,
      address: address,
      location: seller.businessDetails.businessLocation,
      bussinessName: seller.businessDetails.bussinessName,
      bussinessInstagram:
        seller.businessDetails?.bussinessInstagram || "instagram.com",
      businessPhone: seller.businessDetails?.bussinessPhone || "",
      businessWhatsapp:
        seller.businessDetails?.bussinessWhatsapp || "whatsapp.com",
      bussinessFacebook:
        seller.businessDetails?.bussinessFacebook || "facebook.com",
      businessEmail: seller.businessDetails?.businessEmail,
    };
    return res.status(200).json({ footerData });
  } catch (error) {
    console.error("getUserFooter Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserProfileById(id);
    if (!user) {
      return res.status(401).json({ message: "User not exist" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("getUserProfileById Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { status, sellerId } = req.query;
    const users = await userService.getAllUsers(status, sellerId);

    return res.status(200).json({ users });
  } catch (error) {
    console.error("getAllUsers Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.params;
    const updatedUser = await userService.updateUserStatus(id, status);
    return res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("updateUserStatus Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserAddress = async (req, res) => {
  try {
    const user = req.user;
    const address = await Address.findById(user.address);
    return res.status(200).json({ address });
  } catch (error) {
    console.error("getUserAddress Controller Error:", error);
    return res.status(500).json({ message: error.message });
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
    req.user = null;
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
  googleAuthController,
  userSignup,
  verifyUserSignupOtp,
  userLogin,
  userForgetPasswordOtpSend,
  userForgetPasswordOtpVerify,
  userResetPassword,
  userResetPasswordSlider,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
  updateUserStatus,
  getUserAddress,
  getUserFooter,
  logout,
};
