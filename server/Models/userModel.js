const mongoose = require("mongoose");
const UserRoles = require("../Public/Domain/UserRole");
const AccountStatus = require("../Public/Domain/AccountStatus");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    role: {
      type: String,
      enum: [UserRoles.CUSTOMER],
      default: UserRoles.CUSTOMER,
    },
    accountStatus: {
      type: String,
      enum: [
        AccountStatus.ACTIVE,
        AccountStatus.SUSPENDED,
        // AccountStatus.BANNED,
        // AccountStatus.CLOSED,
      ],
      default: AccountStatus.ACTIVE,
    },
    isGoogleAccount: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    whishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
