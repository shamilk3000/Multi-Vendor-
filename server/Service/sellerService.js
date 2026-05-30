const Seller = require("../Models/sellerModel");
const Address = require("../Models/addressModel");
const User = require("../Models/userModel");
const Category = require("../Models/categoryModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const Payment = require("../Models/paymentModel");
const mongoose = require("mongoose");
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

    // existingSeller.bankingDetails.accountNumber =
    //   sellerData.bankingDetails.accountNumber;
    existingSeller.bankingDetails.accountHolderName =
      sellerData.bankingDetails.accountHolder;
    existingSeller.bankingDetails.IBANnumber = sellerData.bankingDetails.iban;
    // existingSeller.bankingDetails.SWIFTcode =
    //   sellerData.bankingDetails.SWIFTcode;
    existingSeller.bankingDetails.bankName = sellerData.bankingDetails.bankName;

    existingSeller.isComplete = true;
    await existingSeller.save();

    // let stripeOnboardingUrl = null;
    // if (!existingSeller.stripeAccountId) {
    //   const account = await stripe.accounts.create({
    //     type: "express",
    //   });
    //   existingSeller.bankingDetails.stripeAccountId = account.id;

    //   const accountLink = await stripe.accountLinks.create({
    //     account: account.id,
    //     refresh_url: process.env.REFRESH_URL,
    //     return_url: process.env.RETURN_URL,
    //     type: "account_onboarding",
    //   });

    //   // you can return this later if needed
    //   stripeOnboardingUrl = accountLink.url;
    // }

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
      // onboardingUrl: stripeOnboardingUrl,
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

const getSellerDashboard = async (seller) => {
  try {
    const sellerId = seller._id;
    // PRODUCTS
    const products = await Product.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
          isActive: true,
        },
      },

      {
        $sort: {
          sale: -1,
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          sales: "$sale",
        },
      },
    ]);

    // Products
    const totalSalesProducts = products.reduce((sum, product) => {
      return sum + product.sales;
    }, 0);
    const topProducts = products.map((product) => ({
      ...product,
      percentage:
        totalSalesProducts === 0
          ? 0
          : Math.round((product.sales / totalSalesProducts) * 100),
    }));

    // CATEGORIES
    const categoriesData = await Category.aggregate([
      // 🔥 ONLY PARENT CATEGORIES
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          parentCategory: null,
          isActive: true,
        },
      },

      // 🔥 GET CHILD CATEGORIES
      {
        $lookup: {
          from: "categories",
          let: { parentId: "$_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$parentCategory", "$$parentId"],
                },
                isActive: true,
              },
            },

            // 🔥 SORT CHILDREN BY SALE
            {
              $sort: {
                sale: -1,
              },
            },

            // 🔥 RETURN CHILD NAME + SALE
            {
              $project: {
                _id: 0,
                name: 1,
                sales: "$sale",
              },
            },
          ],

          as: "children",
        },
      },

      // 🔥 SORT PARENT CATEGORY BY SALE
      {
        $sort: {
          sale: -1,
        },
      },

      // 🔥 FINAL FORMAT
      {
        $project: {
          _id: 0,
          name: 1,
          sales: "$sale",
          children: 1,
        },
      },
    ]);

    // Categories
    const totalSalesCategory = categoriesData.reduce((sum, category) => {
      return sum + category.sales;
    }, 0);

    const categories = categoriesData.map((category) => ({
      ...category,
      percentage:
        totalSalesCategory === 0
          ? 0
          : Math.round((category.sales / totalSalesCategory) * 100),
    }));
    // CHART
    const currentDate = new Date();

    // 🔥 START FROM 11 MONTHS BEFORE CURRENT MONTH
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1,
    );

    // 🔥 END OF CURRENT MONTH
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const payments = await Payment.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          paymentStatus: "success",

          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      // 🔥 GROUP BY YEAR + MONTH
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },

          totalAmount: {
            $sum: "$creditedAmount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // 🔥 CREATE LAST 12 MONTH LABELS
    const labels = [];
    const datasets = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );

      const month = date.toLocaleString("default", {
        month: "short",
      });

      const year = date.getFullYear();

      labels.push(`${month}-${year}`);

      // 🔥 FIND MATCHING PAYMENT
      const found = payments.find(
        (item) =>
          item._id.month === date.getMonth() + 1 && item._id.year === year,
      );

      datasets.push(found ? found.totalAmount : 0);
    }

    // 🔥 FINAL CHART DATA
    const chartData = {
      labels,
      datasets,
    };

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          paymentStatus: "success",
        },
      },

      {
        $group: {
          _id: null,

          creditedAmount: {
            $sum: "$creditedAmount",
          },

          totalAmount: {
            $sum: "$totalAmount",
          },

          stripeFee: {
            $sum: "$stripeFee",
          },
        },
      },

      {
        $project: {
          _id: 0,

          creditedAmount: {
            $round: ["$creditedAmount", 2],
          },

          totalAmount: {
            $round: ["$totalAmount", 2],
          },

          stripeFee: {
            $round: ["$stripeFee", 2],
          },
        },
      },
    ]);

    const revenue = totalRevenue[0]
      ? {
          creditedAmount: Number(totalRevenue[0].creditedAmount.toFixed(2)),
          totalAmount: Number(totalRevenue[0].totalAmount.toFixed(2)),
          stripeFee: Number(totalRevenue[0].stripeFee.toFixed(2)),
        }
      : {
          creditedAmount: 0,
          totalAmount: 0,
          stripeFee: 0,
        };

    const ordersStats = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
        },
      },

      {
        $group: {
          _id: null,

          // 🔥 ALL ORDERS
          totalOrders: {
            $sum: 1,
          },

          // 🔥 PENDING ORDERS
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ["$isNew", true] }, 1, 0],
            },
          },

          // 🔥 CANCELLED ORDERS
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalOrders: 1,
          pendingOrders: 1,
          cancelledOrders: 1,
        },
      },
    ]);

    const orderStats = ordersStats[0] || {
      totalOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0,
    };

    const productsStats = await Product.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(sellerId),
        },
      },

      {
        $group: {
          _id: null,

          // ALL PRODUCTS
          totalProducts: {
            $sum: 1,
          },

          // ACTIVE PRODUCTS
          activeProducts: {
            $sum: {
              $cond: [{ $eq: ["$isActive", true] }, 1, 0],
            },
          },

          // INACTIVE PRODUCTS
          deletedProducts: {
            $sum: {
              $cond: [{ $eq: ["$isActive", false] }, 1, 0],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalProducts: 1,
          activeProducts: 1,
          deletedProducts: 1,
        },
      },
    ]);

    const productStats = productsStats[0] || {
      totalProducts: 0,
      activeProducts: 0,
      deletedProducts: 0,
    };

    const categoriesStats = await Category.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
        },
      },

      {
        $group: {
          _id: null,

          // 🔥 ALL CATEGORIES
          totalCategories: {
            $sum: 1,
          },

          // 🔥 PARENT CATEGORIES
          parentCategories: {
            $sum: {
              $cond: [{ $eq: ["$parentCategory", null] }, 1, 0],
            },
          },

          // 🔥 CHILD CATEGORIES
          childCategories: {
            $sum: {
              $cond: [{ $ne: ["$parentCategory", null] }, 1, 0],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalCategories: 1,
          parentCategories: 1,
          childCategories: 1,
        },
      },
    ]);

    const categoryStats = categoriesStats[0] || {
      totalCategories: 0,
      parentCategories: 0,
      childCategories: 0,
    };

    const totalCustomers = await User.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
        },
      },

      // 🔥 UNIQUE CUSTOMERS
      {
        $group: {
          _id: "$userId",
        },
      },

      // 🔥 COUNT UNIQUE USERS
      {
        $count: "totalCustomers",
      },
    ]);

    const customers = totalCustomers[0]?.totalCustomers || 0;

    // console.log(topProducts);
    // console.log(categories);
    // console.log(chartData);
    // console.log(revenue);
    // console.log(orderStats);
    // console.log(productStats);
    // console.log(categoryStats);
    // console.log(customers);

    return {
      topProducts,
      categories,
      chartData,
      revenue,
      orderStats,
      productStats,
      categoryStats,
      customers,
      seller,
    };
  } catch (error) {
    console.error("getSellerDashboard Service Error:", error);
    throw new Error(`Unable to fetch seller dashboard: ${error.message}`);
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

const updateSeller = async (existingSeller, sellerData) => {
  try {
    // Update seller details
    const existingAddress = await Address.findById(existingSeller.address);
    if (!existingAddress) {
      throw new Error("Address not found");
    }
    existingAddress.phone = sellerData.phone;
    existingAddress.flatNoOrVillaNo = sellerData.address.flatNoOrVillaNo;
    existingAddress.street = sellerData.address.street;
    existingAddress.area = sellerData.address.area;
    existingAddress.city = sellerData.address.city;
    existingAddress.emirate = sellerData.address.emirate;
    existingAddress.landmark = sellerData.address.landmark;
    existingAddress.postalCode = sellerData.address.postalCode;
    await existingAddress.save();

    const existingBusinessAddress = await Address.findById(
      existingSeller.businessDetails.businessAddress,
    );
    if (!existingBusinessAddress) {
      throw new Error("Business address not found");
    }
    existingBusinessAddress.name = sellerData.businessDetails.bussinessName;
    existingBusinessAddress.phone = sellerData.businessDetails.bussinessPhone;
    existingBusinessAddress.email = sellerData.businessDetails.businessEmail;
    existingBusinessAddress.flatNoOrVillaNo =
      sellerData.businessDetails.businessAddress.flatNoOrVillaNo;
    existingBusinessAddress.street =
      sellerData.businessDetails.businessAddress.street;
    existingBusinessAddress.area =
      sellerData.businessDetails.businessAddress.area;
    existingBusinessAddress.city =
      sellerData.businessDetails.businessAddress.city;
    existingBusinessAddress.emirate =
      sellerData.businessDetails.businessAddress.emirate;
    existingBusinessAddress.landmark =
      sellerData.businessDetails.businessAddress.landmark;
    existingBusinessAddress.postalCode =
      sellerData.businessDetails.businessAddress.postalCode;
    await existingBusinessAddress.save();

    existingSeller.phone = sellerData.phone;

    existingSeller.businessDetails.bussinessName =
      sellerData.businessDetails.bussinessName;
    existingSeller.businessDetails.businessEmail =
      sellerData.businessDetails.businessEmail;
    existingSeller.businessDetails.bussinessPhone =
      sellerData.businessDetails.bussinessPhone;
    existingSeller.businessDetails.bussinessWhatsapp =
      sellerData.businessDetails.bussinessWhatsapp;
    existingSeller.businessDetails.bussinessFacebook =
      sellerData.businessDetails.bussinessFacebook;
    existingSeller.businessDetails.bussinessInstagram =
      sellerData.businessDetails.bussinessInstagram;

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

      // checkout session metadata
      metadata: {
        type: "SELLER_SUBSCRIPTION",
        sellerId,
        sellerEmail,
      },

      // subscription metadata
      subscription_data: {
        metadata: {
          type: "SELLER_SUBSCRIPTION",
          sellerId,
          sellerEmail,
        },
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
  getSellerDashboard,
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
