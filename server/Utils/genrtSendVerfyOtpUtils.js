// const transporter = require("../Configurations/nodeMailer");
// const Otp = require("../Models/otpModel");
import transporter from "../Configurations/nodeMailer.js";
import Otp from "../Models/otpModel.js";

 async function generateOtp(email, who = "admin") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // remove old OTP if exists
  await Otp.deleteMany({ email, who });

  const record = await Otp.create({
    email,
    who,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  return record;
}

async function sendOtpEmail(to, otp, purpose = "Verification") {
  return transporter.sendMail({
    to,
    subject: `🔑 Your OTP for ${purpose}`,
    html: `
      <div style="
        font-family: Arial, sans-serif; 
        max-width: 600px; 
        margin: auto; 
        padding: 20px; 
        border: 1px solid #ddd; 
        border-radius: 10px; 
        background-color: #f9f9f9;
      ">
        <h2 style="color: #333; text-align: center;">🔑 OTP Verification</h2>
        <p style="font-size: 16px; color: #555;">
          Hello! Use the OTP below to complete your <b>${purpose}</b> process.
        </p>
        <p style="
          font-size: 24px; 
          font-weight: bold; 
          color: #1a73e8; 
          text-align: center; 
          margin: 20px 0;
        ">${otp}</p>
        <p style="font-size: 14px; color: #999; text-align: center;">
          This OTP will expire in 10 minutes.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          If you didn’t request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

 async function verifyOtp(otp, sellerData, who = "admin") {
  const record = await Otp.findOne({ email: sellerData.email, who });

  if (!record) {
    throw new Error("No OTP found");
  }

  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ _id: record._id }); // cleanup
    throw new Error("OTP expired");
  }

  if (record.otp !== String(otp).trim()) {
    throw new Error("Invalid OTP");
  }

  // ✅ delete after successful verification
  await Otp.deleteOne({ _id: record._id });

  return true;
}

export { generateOtp, sendOtpEmail, verifyOtp };
