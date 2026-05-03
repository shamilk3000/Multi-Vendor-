const userService = require("../Service/userService");

const userAuth = async (req, res, next) => {
  try {

    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authorization failed",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authorization failed",
      });
    }

    const user = await userService.getUserProfileByToken(token);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (sellerId !== user.sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (user.accountStatus === "DEACTIVATED") {
      throw new Error("User account is deactivated");
    } else if (user.accountStatus === "BANNED") {
      throw new Error("User account is banned");
    } else if (user.accountStatus === "CLOSED") {
      throw new Error("User account is closed");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("userAuth Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = userAuth;
