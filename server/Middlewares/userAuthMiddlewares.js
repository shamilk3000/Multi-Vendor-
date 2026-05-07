const userService = require("../Service/userService");
const jwtProvider = require("../Utils/jwtProvider");

const userAuth = async (req, res, next) => {
  try {
    // const sellerId = req.params.sellerId;
    const token = req.cookies.token;

    // ❌ NO COOKIE
    if (!token) {
      console.log("No token");
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN_USER",
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
        code: "TOKEN_EXPIRED_USER",
        message: "Session expired",
      });
    }

    const user = await jwtProvider.getUserProfileByToken(
      token,
      decoded.sellerId,
    );

    if (!user) {
      console.log("No user");
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND_USER",
      });
    }

    // ❌ ACCOUNT NOT ACTIVE (🔥 FIRST CHECK LIKE YOU SAID)
    if (user.accountStatus !== "ACTIVE") {
      console.log("Account is not active");
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_NOT_ACTIVE_USER",
        status: user.accountStatus, // PAYMENT_PENDING etc
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("UserAuth server error");
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR_USER",
      message: error.message,
    });
  }
};

module.exports = userAuth;
