const mongoose = require("mongoose");
const UserRoles = require("../Public/Domain/UserRole");
const AccountStatus = require("../Public/Domain/AccountStatus");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    personalImage: {
      type: String,
    },
    wallet: {
      total: {
        type: Number,
        required: true,
        default: 0,
      },
      stripeFee: {
        type: Number,
        required: true,
        default: 0,
      },
      creditedAmount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    subscriptionId: {
      type: String,
    },
    subscriptionExpiry: {
      type: Date,
    },
    idProof: [
      {
        type: String,
      },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    businessDetails: {
      bussinessName: {
        type: String,
      },
      businessEmail: {
        type: String,
      },
      bussinessPhone: {
        type: String,
      },
      bussinessWhatsapp: {
        type: String,
      },
      bussinessInstagram: {
        type: String,
      },
      bussinessFacebook: {
        type: String,
      },
      businessAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
      workingDays: {
        type: String,
      },
      openingHours: {
        type: String,
      },
      businessLocation: {
        latitude: {
          type: String,
        },
        longitude: {
          type: String,
        },
      },
    },
    bankingDetails: {
      // accountNumber: {
      //   type: String,
      // },
      accountHolderName: {
        type: String,
      },
      IBANnumber: {
        type: String,
      },
      // SWIFTcode: {
      //   type: String,
      // },
      bankName: {
        type: String,
      },
      // stripeAccountId: {
      //   type: String,
      // },
    },
    role: {
      type: String,
      enum: [UserRoles.SELLER],
      default: UserRoles.SELLER,
    },
    accountStatus: {
      type: String,
      enum: [
        AccountStatus.PENDING_PAYMENT,
        AccountStatus.ACTIVE,
        AccountStatus.SUSPENDED,
      ],
      default: AccountStatus.PENDING_PAYMENT,
    },
    isGoogleAccount: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
