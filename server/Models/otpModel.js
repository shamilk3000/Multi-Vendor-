const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    who: { type: String, default: "admin" },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;