const Seller = require("../Models/sellerModel");
const Address = require("../Models/addressModel");
const { getEmailFromToken, createJwt } = require("../Utils/jwtProvider");
const { verifyGoogleToken } = require("../Configurations/googleAuth");
const { deleteFiles } = require("../Utils/multerUtil");
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const { stripe } = require("../Utils/stripe");
const {
  generateOtp,
  sendOtpEmail,
  verifyOtp,
} = require("../Utils/genrtSendVerfyOtpUtils");

const getAllSellers = async (status) => {
  try {
    return await Seller.find({ accountStatus: status });
  } catch (error) {
    console.error("getAllSellers Service Error:", error);
    throw new Error(`Unable to fetch sellers: ${error.message}`);
  }
};

const createSellerDetails = async (req, res) => {
  try {
    if (typeof req.body.updatedForm === "string") {
      req.body.updatedForm = JSON.parse(req.body.updatedForm);
    }

    const sellerData = req.body.updatedForm;
    const idProofFiles = req.files?.idProof || [];
    const personalImageFile = req.files?.personalImage?.[0] || null;

    const existingSeller = await Seller.findOne({
      email: sellerData.email,
    });
    if (!existingSeller)
      throw new Error("Seller with this email does not exist");

    const address = await Address.create({
      name: sellerData.name,
      phone: sellerData.phone,
      email: existingSeller.email,
      flatNoOrVillaNo: sellerData.address.flatNoOrVillaNo,
      street: sellerData.address.street,
      area: sellerData.address.area,
      city: sellerData.address.city,
      emirate: sellerData.address.emirate,
      landmark: sellerData.address.landmark,
      postalCode: sellerData.address.postalCode,
      addressType: "address",
    });

    const bussinessAddress = await Address.create({
      name: sellerData.businessDetails.bussinessName,
      phone: sellerData.businessDetails.bussinessPhone,
      email: sellerData.businessDetails.businessEmail,
      flatNoOrVillaNo:
        sellerData.businessDetails.businessAddress.flatNoOrVillaNo,
      street: sellerData.businessDetails.businessAddress.street,
      area: sellerData.businessDetails.businessAddress.area,
      city: sellerData.businessDetails.businessAddress.city,
      emirate: sellerData.businessDetails.businessAddress.emirate,
      landmark: sellerData.businessDetails.businessAddress.landmark,
      postalCode: sellerData.businessDetails.businessAddress.postalCode,
      addressType: "bussinessAddress",
    });

    existingSeller.name = sellerData.name;
    existingSeller.phone = sellerData.phone;
    existingSeller.personalImage = personalImageFile
      ? `/Uploads/Seller/PersonalImages/${existingSeller.email}/${personalImageFile.filename}`
      : "";
    existingSeller.idProof = idProofFiles.map(
      (file) =>
        `/Uploads/Seller/IdProofs/${existingSeller.email}/${file.filename}`,
    );
    existingSeller.address = address._id;

    existingSeller.businessDetails.bussinessName =
      sellerData.businessDetails.bussinessName;
    existingSeller.businessDetails.businessEmail =
      sellerData.businessDetails.businessEmail;
    existingSeller.businessDetails.bussinessPhone =
      sellerData.businessDetails.bussinessPhone;
    existingSeller.businessDetails.bussinessWhatsapp =
      sellerData.businessDetails.whatsapp;
    existingSeller.businessDetails.bussinessInstagram =
      sellerData.businessDetails.instagram;
    existingSeller.businessDetails.bussinessFacebook =
      sellerData.businessDetails.facebook;
    existingSeller.businessDetails.businessAddress = bussinessAddress._id;

    existingSeller.bankingDetails.accountNumber =
      sellerData.bankingDetails.accountNumber;
    existingSeller.bankingDetails.accountHolderName =
      sellerData.bankingDetails.accountHolder;
    existingSeller.bankingDetails.IBANnumber = sellerData.bankingDetails.iban;
    // existingSeller.bankingDetails.SWIFTcode =
    //   sellerData.bankingDetails.SWIFTcode;
    existingSeller.bankingDetails.bankName = sellerData.bankingDetails.bankName;

    existingSeller.isComplete = true;

    let stripeOnboardingUrl = null;
    if (!existingSeller.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
      });
      existingSeller.bankingDetails.stripeAccountId = account.id;

      await existingSeller.save();

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: process.env.REFRESH_URL,
        return_url: process.env.RETURN_URL,
        type: "account_onboarding",
      });

      // you can return this later if needed
      stripeOnboardingUrl = accountLink.url;
    }

    const token = createJwt({
      id: existingSeller._id,
      email: existingSeller.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
    });
    req.seller = existingSeller;
    return {
      seller: existingSeller,
      onboardingUrl: stripeOnboardingUrl,
    };
  } catch (error) {
    console.error("createSellerDetails Service Error:", error);
    throw error;
  }
};

const getSellerProfileById = async (id) => {
  try {
    const seller = await getSellerById(id);
    return seller;
  } catch (error) {
    console.error("getSellerProfileById Service Error:", error);
    throw new Error(`Unable to fetch seller profile: ${error.message}`);
  }
};

const getSellerById = async (id) => {
  try {
    const seller = await Seller.findById(id);
    if (!seller) {
      throw new Error("Seller not found");
    }
    return seller;
  } catch (error) {
    console.error("getSellerById Service Error:", error);
    throw new Error(`Unable to fetch seller by id: ${error.message}`);
  }
};

const updateSeller = async (req) => {
  try {
    // ✅ Parse all stringified objects coming from form-data
    if (typeof req.body.address === "string") {
      req.body.address = JSON.parse(req.body.address);
    }
    if (typeof req.body.pickupAddress === "string") {
      req.body.pickupAddress = JSON.parse(req.body.pickupAddress);
    }
    if (typeof req.body.businessDetails === "string") {
      req.body.businessDetails = JSON.parse(req.body.businessDetails);
    }
    if (typeof req.body.bankingDetails === "string") {
      req.body.bankingDetails = JSON.parse(req.body.bankingDetails);
    }
    if (typeof req.body.idProofDlt === "string") {
      req.body.idProofDlt = JSON.parse(req.body.idProofDlt);
    }
    if (typeof req.body.personalImageDlt === "string") {
      req.body.personalImageDlt = JSON.parse(req.body.personalImageDlt);
    }

    const sellerData = req.body;
    const idProofFiles = req.files?.idProof || [];
    const personalImageFile = req.files?.personalImage?.[0] || null;

    const existingSeller = await req.seller;
    if (!existingSeller) {
      throw new Error("Seller not found");
    }

    // Update seller details
    const existingAddress = await Address.findById(existingSeller.address);

    ((existingAddress.name = sellerData.name),
      (existingAddress.phone = sellerData.phone),
      (existingAddress.email = existingSeller.email),
      (existingAddress.flatNoOrVillaNo = sellerData.address.flatNoOrVillaNo),
      (existingAddress.street = sellerData.address.street),
      (existingAddress.area = sellerData.address.area),
      (existingAddress.city = sellerData.address.city),
      (existingAddress.emirate = sellerData.address.emirate),
      (existingAddress.landmark = sellerData.address.landmark),
      (existingAddress.postalCode = sellerData.address.postalCode),
      await existingAddress.save());

    const existingPickupAddress = await Address.findById(
      existingSeller.pickupAddress,
    );

    ((existingPickupAddress.name = sellerData.name),
      (existingPickupAddress.phone = sellerData.phone),
      (existingPickupAddress.email = existingSeller.email),
      (existingPickupAddress.flatNoOrVillaNo =
        sellerData.pickupAddress.flatNoOrVillaNo),
      (existingPickupAddress.street = sellerData.pickupAddress.street),
      (existingPickupAddress.area = sellerData.pickupAddress.area),
      (existingPickupAddress.city = sellerData.pickupAddress.city),
      (existingPickupAddress.emirate = sellerData.pickupAddress.emirate),
      (existingPickupAddress.landmark = sellerData.pickupAddress.landmark),
      (existingPickupAddress.postalCode = sellerData.pickupAddress.postalCode),
      await existingPickupAddress.save());

    const existingBussinessAddress = await Address.findById(
      existingSeller.businessDetails.businessAddress,
    );

    ((existingBussinessAddress.name = sellerData.businessDetails.bussinessName),
      (existingBussinessAddress.phone =
        sellerData.businessDetails.bussinessPhone),
      (existingBussinessAddress.email =
        sellerData.businessDetails.businessEmail),
      (existingBussinessAddress.flatNoOrVillaNo =
        sellerData.businessDetails.businessAddress.flatNoOrVillaNo),
      (existingBussinessAddress.street =
        sellerData.businessDetails.businessAddress.street),
      (existingBussinessAddress.area =
        sellerData.businessDetails.businessAddress.area),
      (existingBussinessAddress.city =
        sellerData.businessDetails.businessAddress.city),
      (existingBussinessAddress.emirate =
        sellerData.businessDetails.businessAddress.emirate),
      (existingBussinessAddress.landmark =
        sellerData.businessDetails.businessAddress.landmark),
      (existingBussinessAddress.postalCode =
        sellerData.businessDetails.businessAddress.postalCode),
      await existingBussinessAddress.save());

    existingSeller.name = sellerData.name;
    existingSeller.phone = sellerData.phone;
    // If new files are uploaded, delete old files
    if (sellerData.personalImageDlt.length > 0) {
      await deleteFiles(sellerData.personalImageDlt);
      existingSeller.personalImage = personalImageFile
        ? `/Uploads/Seller/PersonalImages/${personalImageFile.filename}`
        : "";
    }
    if (sellerData.idProofDlt.length > 0) {
      await deleteFiles(sellerData.idProofDlt);
      existingSeller.idProof = existingSeller.idProof.filter(
        (file) => !sellerData.idProofDlt.includes(file),
      );
    }
    if (idProofFiles.length > 0) {
      const newProofs = idProofFiles.map(
        (file) => `/Uploads/Seller/IdProofs/${file.filename}`,
      );
      existingSeller.idProof = [...existingSeller.idProof, ...newProofs];
    }
    existingSeller.businessDetails.bussinessName =
      sellerData.businessDetails.bussinessName;
    existingSeller.businessDetails.businessEmail =
      sellerData.businessDetails.businessEmail;
    existingSeller.businessDetails.bussinessPhone =
      sellerData.businessDetails.bussinessPhone;
    existingSeller.bankingDetails.accountNumber =
      sellerData.bankingDetails.accountNumber;
    existingSeller.bankingDetails.accountHolderName =
      sellerData.bankingDetails.accountHolderName;
    existingSeller.bankingDetails.IBANnumber =
      sellerData.bankingDetails.IBANnumber;
    existingSeller.bankingDetails.SWIFTcode =
      sellerData.bankingDetails.SWIFTcode;
    existingSeller.bankingDetails.bankName = sellerData.bankingDetails.bankName;
    existingSeller.bankingDetails.upiId = sellerData.bankingDetails.upiId;

    await existingSeller.save();

    return existingSeller;
  } catch (error) {
    console.error("updateSeller Service Error:", error);
    throw new Error(`Unable to update seller: ${error.message}`);
  }
};

// const deleteSeller = async (sellerId) => {
//   try {
//     return await Seller.findByIdAndDelete(sellerId);
//   } catch (error) {
//     console.error("deleteSeller Service Error:", error);
//     throw new Error("Unable to delete seller");
//   }
// };

const updateSellerStatus = async (sellerId, newStatus) => {
  try {
    return await Seller.findByIdAndUpdate(
      sellerId,
      { accountStatus: newStatus },
      { new: true },
    );
  } catch (error) {
    console.error("updateSellerStatus Service Error:", error);
    throw new Error(`Unable to update seller status: ${error.message}`);
  }
};

const sellerGoogleAuth = async (credential, res) => {
  try {
    // Get verified Google user
    const googleUser = await verifyGoogleToken(credential);

    // Check if seller already exists
    let seller = await Seller.findOne({ email: googleUser.email });

    let isNew = false;
    if (!seller) {
      // Signup flow - create new seller
      seller = await Seller.create({
        email: googleUser.email,
        googleId: googleUser.sub,
        isGoogleAccount: true,
      });
      isNew = true;
    } else {
      if (!seller.googleId) {
        seller.googleId = googleUser.sub;
        seller.isGoogleAccount = true;
        await seller.save();
      }
    }

    if (seller.isComplete === false) {
      return { seller: seller, isNew };
    } else {
      const token = createJwt({ id: seller._id, email: seller.email });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAMESITE,
        maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
      });
      return { seller: seller, isNew };
    }
  } catch (error) {
    console.error("sellerGoogleAuth Service Error:", error);
    throw error;
  }
};

const sellerLogin = async (email, password, res) => {
  try {
    const seller = await Seller.findOne({ email });

    if (!seller) throw new Error("No account found with this email");

    if (seller.isComplete === false) {
      if (seller.isGoogleAccount && !seller.password) {
        throw new Error(
          "This email is linked with Google. Please login using Google.",
        );
      }

      const isMatch = bcrypt.compare(password, seller.password);
      if (!isMatch) throw new Error("Invalid password");

      return { seller, isComplete: seller.isComplete };
    } else {
      // Check if user was registered via Google
      if (seller.isGoogleAccount && !seller.password) {
        throw new Error(
          "This email is linked with Google. Please login using Google.",
        );
      }

      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) throw new Error("Invalid password");

      const token = createJwt({ id: seller._id, email: seller.email });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAMESITE,
        maxAge: Number(process.env.COOKIE_MAXAGE), // 1 day ,
      });
      return { seller, isComplete: seller.isComplete };
    }
  } catch (error) {
    console.error("sellerLogin Service Error:", error);
    throw error;
  }
};

const startSellerSignup = async (sellerData) => {
  try {
    // Check if seller already exists
    let existingSeller = await Seller.findOne({ email: sellerData.email });
    if (existingSeller) {
      const err = new Error("Seller with this email already exists");
      err.statusCode = 400;
      throw err;
    }

    const record = await generateOtp(sellerData.email, "seller");

    // 3️⃣ Send email
    await sendOtpEmail(sellerData.email, record.otp, "Signup");

    return {
      sellerData,
      message: "Please verify OTP to complete signup.",
    };
  } catch (error) {
    console.error("startSellerSignup Service Error:", error);
    throw error;
  }
};

const verifyOtpAndCreateSeller = async (otp, sellerData) => {
  try {
    await verifyOtp(otp, sellerData, "seller");

    const hashedPassword = await bcrypt.hash(sellerData.password, saltRounds);
    const seller = await Seller.create({
      email: sellerData.email,
      password: hashedPassword,
      isGoogleAccount: false,
    });

    return {
      email: seller.email,
      isVerified: true,
      message: "OTP verified successfully! Complete profile.",
    };
  } catch (error) {
    console.error("verifyOtpAndCreateSeller Service Error:", error);
    return {
      seller: null,
      isVerified: false,
      message: error.message,
    };
  }
};

const sellerForgetPasswordOtp = async (email) => {
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      throw new Error("Seller not found");
    }
    const record = await generateOtp(email, "seller");
    await sendOtpEmail(email, record.otp, "Forgot Password");
    return {
      message: "OTP sent successfully. Please verify to reset password.",
    };
  } catch (error) {
    console.error("sellerForgetPasswordOtp Service Error:", error);
    throw new Error(`${error.message} : Unable to send OTP`);
  }
};

const sellerForgetPasswordOtpVerify = async (email, otp) => {
  try {
    let sellerEmail = { email };
    await verifyOtp(otp, sellerEmail, "seller");
    return { isVerified: true, message: "OTP verified" };
  } catch (error) {
    console.error("sellerForgetPasswordOtpVerify Service Error:", error);
    return { isVerified: false, message: error.message };
  }
};

const sellerResetPassword = async (email, password) => {
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      throw new Error("Seller not found");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    seller.password = hashedPassword;
    await seller.save();
    return { message: "Password changed successfully" };
  } catch (error) {
    console.error("sellerResetPassword Service Error:", error);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

const handleSellerSubscription = async (priceId, sellerId, sellerEmail) => {
  try {
    // 🧠 Get seller from DB
    const seller = await Seller.findById(sellerId);

    let subscription = null;

    // ✅ Check if seller already has a subscription
    if (seller.subscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(
          seller.subscriptionId,
        );
      } catch (err) {
        console.log("Old subscription not found in Stripe");
      }
    }

    // 🔥 CASE 1: Subscription exists and NOT canceled → reuse
    if (subscription && subscription.status !== "canceled") {
      // Create billing portal session for upgrade/payment
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.customer,
        return_url: process.env.SUBSCRIPTION_SUCCESS_URL,
      });
      console.log("🔁 Subscription exists and NOT canceled . it will renew");
      return portalSession.url;
    }

    // 🔴 CASE 2: No subscription OR canceled → create new

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      customer_email: sellerEmail,

      success_url: process.env.SUBSCRIPTION_SUCCESS_URL,
      cancel_url: process.env.SUBSCRIPTION_CANCEL_URL,

      metadata: {
        sellerId,
        sellerEmail,
      },
    });
    console.log("✅ No subscription OR canceled → create new subscription");
    return session.url;
  } catch (error) {
    console.error("Stripe session creation failed:", error.message);
    throw new Error("Unable to handle subscription");
  }
};

module.exports = {
  getAllSellers,
  createSellerDetails,
  getSellerProfileById,
  getSellerById,
  updateSeller,
  // deleteSeller,
  updateSellerStatus,
  sellerGoogleAuth,
  sellerLogin,
  startSellerSignup,
  verifyOtpAndCreateSeller,
  sellerForgetPasswordOtp,
  sellerForgetPasswordOtpVerify,
  sellerResetPassword,
  handleSellerSubscription,
};
