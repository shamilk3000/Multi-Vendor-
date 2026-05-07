const jwt = require("jsonwebtoken");
require("dotenv").config();
const Seller = require("../Models/sellerModel");
const User = require("../Models/userModel");

function createJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function verifyJwt(token) {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token. Authorization failed");
  }
}

async function getSellerProfileByToken (jwt) {
  try {
    const email = await getEmailFromToken(jwt);
    return await getSellerByEmail(email);
  } catch (error) {;
    throw new Error(`Unable to fetch seller profile`);
  }
};

async function getUserProfileByToken (jwt, sellerId) {
  try {
    const email = await getEmailFromToken(jwt);
    return await getUserByEmail(email , sellerId);
  } catch (error) {;
    throw new Error(`Unable to fetch user profile`);
  }
};


async function getEmailFromToken(token) {
  try {
    const decoded = await verifyJwt(token);
    return decoded.email;
  } catch (error) {
    throw new Error("Failed to get email from token ");
  }
}

const getSellerByEmail = async (email) => {
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      throw new Error("Seller not found");
    }
    return seller;
  } catch (error) {
    throw new Error(`Unable to fetch seller by email`);
  }
};

const getUserByEmail = async (email, sellerId) => {
  try {
    const user = await User.findOne({ email, sellerId });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Unable to fetch user by email`);
  }
};

async function getUserFromToken(token) {
  try {
    const decoded = await verifyJwt(token);
    const user = await User.findOne({ email: decoded.email , sellerId: decoded.sellerId});
    return user;
  } catch (error) {
    throw new Error("Failed to get user from token: " + error.message);
  }
}

module.exports = {
  createJwt,
  verifyJwt,
  getEmailFromToken,
  getUserFromToken,
  getSellerProfileByToken,
  getUserProfileByToken,
  getSellerByEmail,
  getUserByEmail,
};
