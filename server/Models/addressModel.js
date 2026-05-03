const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
    flatNoOrVillaNo: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    emirate: {
      type: String,
      enum: [
        "Dubai",
        "Abu Dhabi",
        "Sharjah",
        "Ajman",
        "Ras Al Khaimah",
        "Fujairah",
        "Umm Al Quwain",
      ],
    },
    postalCode: {
      type: String,
      trim: true,
    },
    additionalNotes: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["address" , "bussinessAddress"],
      default: "address",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
