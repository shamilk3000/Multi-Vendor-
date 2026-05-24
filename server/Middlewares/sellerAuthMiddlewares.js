const sellerService = require("../Service/sellerService");
const jwtProvider = require("../Utils/jwtProvider");

const coockieTest = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    try {
      const decoded = jwtProvider.verifyJwt(token);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Authorization failed",
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authorization failed",
      });
    }

    const seller = await jwtProvider.getSellerProfileByToken(token);
    if (!seller) {
      return res.json({ success: false, message: "Seller not found" });
    }

    if (seller.accountStatus == "PENDING_PAYMENT") {
      return res.json({
        success: false,
        seller,
        status: seller.accountStatus,
        message: "Seller subscription payment is pending",
      });
    }
    if (seller.accountStatus == "SUSPENDED") {
      return res.json({
        success: false,
        status: seller.accountStatus,
        message: "Seller account is suspended",
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    console.error("sellerAuth Error:", error.message);
    return res.status(401).json({ success: false, message: error.message });
  }
};

const sellerAuth = async (req, res, next) => {
  try {
    console.log("worked sellerAuth - cookie check");
    const token = req.cookies.token;

    // ❌ NO COOKIE
    if (!token) {
      console.log("No token");
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Login required",
      });
    }

    let decoded;

    // ❌ TOKEN INVALID / EXPIRED
    try {
      decoded = await jwtProvider.verifyJwt(token);
      console.log("worked decoding");
    } catch (err) {
      console.log("No decode");
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Session expired",
      });
    }
    // 🔍 GET SELLER
    const seller = await jwtProvider.getSellerProfileByToken(token);

    if (!seller) {
      console.log("No seller");
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
      });
    }

    // ❌ ACCOUNT NOT ACTIVE (🔥 FIRST CHECK LIKE YOU SAID)
    if (seller.accountStatus !== "ACTIVE") {
      console.log("Account is not active");
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_NOT_ACTIVE",
        status: seller.accountStatus, // PAYMENT_PENDING etc
      });
    }

    // ✅ ALL GOOD
    req.seller = seller;
    next();
  } catch (err) {
    console.log("SellerAuth server error");
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: err.message,
    });
  }
};

module.exports = { coockieTest, sellerAuth };
