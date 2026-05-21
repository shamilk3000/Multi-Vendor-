const User = require("../Models/userModel");
const Address = require("../Models/addressModel");
const { getUserFromToken, createJwt } = require("../Utils/jwtProvider");
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const {
  generateOtp,
  sendOtpEmail,
  verifyOtp,
} = require("../Utils/genrtSendVerfyOtpUtils");
const Cart = require("../Models/cartModel");
const { verifyGoogleToken } = require("../Configurations/googleAuth");

const userGoogleAuth = async (credential, sellerId, res) => {
  try {
    // Get verified Google user
    const googleUser = await verifyGoogleToken(credential);

    // Check if user already exists
    let user = await User.findOne({
      email: googleUser.email,
      sellerId: sellerId,
    });

    let isNew = false;
    if (!user) {
      // Signup flow - create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.sub,
        sellerId: sellerId,
        isGoogleAccount: true,
      });
      const cart = new Cart({
        userId: user._id,
      });
      await cart.save();
      isNew = true;
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.sub;
        user.isGoogleAccount = true;
        await user.save();
      }
    }
    if (user.accountStatus === "SUSPENDED") {
      throw new Error("Your account is suspended");
    }
    // Always generate JWT (whether login or signup)
    const token = createJwt({
      id: user._id,
      email: user.email,
      sellerId: user.sellerId,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
    });

    return { user, isNew };
  } catch (error) {
    console.error("userGoogleAuth Service Error:", error);
    throw error;
  }
};

const userSignup = async (userData, sellerId) => {
  try {
    const existingUser = await User.findOne({
      email: userData.email,
      sellerId: sellerId,
    });
    if (existingUser) {
      err.statusCode = 400;
      throw new Error("User with this email already exists");
    }

    const record = await generateOtp(userData.email, `user${sellerId}`);

    // 3️⃣ Send email
    await sendOtpEmail(userData.email, record.otp, "Signup");

    return {
      userData,
      message: "OTP sent successfully. Please verify to complete signup.",
    };
  } catch (error) {
    console.error("userSignup Service Error:", error);
    throw error;
  }
};

const verifyOtpAndCreateUser = async (userData, otp, sellerId, res) => {
  try {
    await verifyOtp(otp, userData, `user${sellerId}`);

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      sellerId: sellerId,
    });

    const token = createJwt({
      id: user._id,
      email: user.email,
      sellerId: user.sellerId,
    });

    const cart = new Cart({
        userId: user._id,
      });
      await cart.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
    });

    return { user, isVerified: true, message: "OTP verified" };
  } catch (error) {
    console.error("verifyOtpAndCreateUser Service Error:", error);
    return {
      user: null,
      isVerified: false,
      message: error.message,
    };
  }
};

const getUserProfileByToken = async (jwt) => {
  try {
    const user = getUserFromToken(jwt);
    return await getUserByEmail(user);
  } catch (error) {
    console.error("getUserProfileByToken Service Error:", error);
    throw new Error(`Unable to fetch user profile: ${error.message}`);
  }
};

const getUserByEmail = async (userData) => {
  try {
    const user = await User.findOne({
      email: userData.email,
      sellerId: userData.sellerId,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("getUserByEmail Service Error:", error);
    throw new Error(`Unable to fetch user by email: ${error.message}`);
  }
};

const userLogin = async (email, password, sellerId, res) => {
  try {
    const user = await User.findOne({ email: email, sellerId: sellerId });

    if (!user) throw new Error("No account found with this email");

    if (user.accountStatus === "SUSPENDED") {
      throw new Error("Your account is suspended");
    }
    // Check if user was registered via Google
    if (user.isGoogleAccount && !user.password) {
      throw new Error(
        "This email is linked with Google. Please login using Google.",
      );
    }

    // Compare password normally (if set)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = createJwt({
      id: user._id,
      email: user.email,
      sellerId: user.sellerId,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
    });

    return { user };
  } catch (error) {
    console.error("userLogin Service Error:", error);
    throw error;
  }
};

const userForgetPasswordOtp = async (email, sellerId) => {
  try {
    const user = await User.findOne({ email: email, sellerId: sellerId });
    if (!user) {
      throw new Error("User not found");
    }
    const record = await generateOtp(email, `user${sellerId}`);
    await sendOtpEmail(email, record.otp, "Forgot Password");
    return {
      message: "OTP sent successfully. Please verify to reset password.",
    };
  } catch (error) {
    console.error("userForgetPasswordOtp Service Error:", error);
    throw new Error(`Unable to send OTP: ${error.message}`);
  }
};

const userForgetPasswordOtpVerify = async (data, otp, sellerId) => {
  try {
    await verifyOtp(otp, data, `user${sellerId}`);
    return { isVerified: true, message: "OTP verified" };
  } catch (error) {
    console.error("userForgetPasswordOtpVerify Service Error:", error);
    return { isVerified: false, message: error.message };
  }
};

const userResetPassword = async (email, password, sellerId) => {
  try {
    const user = await User.findOne({ email: email, sellerId: sellerId });
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return { message: "Password reset successfully" };
  } catch (error) {
    console.error("userResetPassword Service Error:", error);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

const userResetPasswordSlider = async (password, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    return { message: "Password reset successfully" };
  } catch (error) {
    console.error("userResetPasswordSlider Service Error:", error);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

const getUserProfileById = async (id) => {
  try {
    const user = await getUserById(id);
    return user;
  } catch (error) {
    console.error("getUserProfileById Service Error:", error);
    throw new Error(`Unable to fetch user profile: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("getUserById Service Error:", error);
    throw new Error(`Unable to fetch user by ID: ${error.message}`);
  }
};

const updateUser = async (existingUser, userData) => {
  try {
    existingUser.name = userData.name;
    if (userData.phone) {
      existingUser.phone = userData.phone;
    }
    existingUser.save();

    return existingUser;
  } catch (error) {
    console.error("updateUser Service Error:", error);
    throw new Error(`Unable to update user: ${error.message}`);
  }
};

const addAddress = async (address, user) => {
  try {
    const newAddress = await Address.create({
      name: user.name,
      phone: address.phone,
      email: user.email,
      flatNoOrVillaNo: address.flatNoOrVillaNo,
      street: address.street,
      area: address.area,
      city: address.city,
      emirate: address.emirate,
      landmark: address.landmark,
      postalCode: address.postalCode,
      addressType: "address",
    });
    if (!user.phone) {
      user.phone = address.phone;
    }

    user.address.push(newAddress._id);
    await user.save();
    return user;
  } catch (error) {
    console.error("addAddress Service Error:", error);
    throw new Error(`Unable to add address: ${error.message}`);
  }
};

const updateAddress = async (addressId, address) => {
  try {
    const existingAddress = await Address.findById(addressId);
    existingAddress.phone = address.phone;
    existingAddress.flatNoOrVillaNo = address.flatNoOrVillaNo;
    existingAddress.street = address.street;
    existingAddress.area = address.area;
    existingAddress.city = address.city;
    existingAddress.emirate = address.emirate;
    existingAddress.landmark = address.landmark;
    existingAddress.postalCode = address.postalCode;
    await existingAddress.save();
    return existingAddress;
  } catch (error) {
    console.error("updateAddress Service Error:", error);
    throw new Error(`Unable to update address: ${error.message}`);
  }
};

const deleteAddress = async (addressId, user) => {
  try {
    const address = await Address.findById(addressId);
    address.isDeleted = true;
    await address.save();
    user.address.pull(addressId);
    await user.save();
    return user;
  } catch (error) {
    console.error("deleteAddress Service Error:", error);
    throw new Error(`Unable to delete address: ${error.message}`);
  }
};

const getAllUsers = async (status, sellerId) => {
  try {
    const users = await User.find({
      accountStatus: status,
      sellerId: sellerId,
    });
    return users;
  } catch (error) {
    console.error("getAllUsers Service Error:", error);
    throw new Error(`Unable to fetch users: ${error.message}`);
  }
};

const updateUserStatus = async (userId, newStatus) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { accountStatus: newStatus },
      { new: true },
    );
  } catch (error) {
    console.error("updateUserStatus Service Error:", error);
    throw new Error(`Unable to update user status: ${error.message}`);
  }
};

module.exports = {
  userGoogleAuth,
  userSignup,
  verifyOtpAndCreateUser,
  getUserProfileByToken,
  getUserByEmail,
  userLogin,
  userForgetPasswordOtp,
  userForgetPasswordOtpVerify,
  userResetPassword,
  getUserProfileById,
  getUserById,
  updateUser,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  updateUserStatus,
  userResetPasswordSlider,
};
