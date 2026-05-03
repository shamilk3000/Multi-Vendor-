const express = require("express");
const router = express.Router();
const userAuth = require("../Middlewares/userAuthMiddlewares")
const userController = require("../Controller/userController");
const productController = require("../Controller/productController");
const cartController = require("../Controller/cartController");
const orderController = require("../Controller/orderController");
const paymentController = require("../Controller/paymentController");

router.post("/:sellerId/:shopName/google-auth", userController.googleAuthController);
router.post("/:sellerId/:shopName/start-user-signup", userController.userSignup);
router.post("/:sellerId/:shopName/verify-user-signup-otp", userController.verifyUserSignupOtp);
router.post("/:sellerId/:shopName/user-login", userController.userLogin);

router.post("/:sellerId/:shopName/user-forget-password-otp-send", userController.userForgetPasswordOtpSend);
router.post("/:sellerId/:shopName/user-forget-password-otp-verify", userController.userForgetPasswordOtpVerify);
router.post("/:sellerId/:shopName/user-reset-password", userController.userResetPassword);

router.get("/:sellerId/:shopName/get-user-profile", userAuth, userController.getUserProfile);
router.put("/:sellerId/:shopName/update-user", userAuth, userController.updateUser);
router.post("/:sellerId/:shopName/add-address", userAuth, userController.addAddress);
router.put("/:sellerId/:shopName/update-address/:id", userAuth, userController.updateAddress);
router.delete("/:sellerId/:shopName/delete-address/:id", userAuth, userController.deleteAddress);

router.get("/:sellerId/:shopName/search-products/:search", userAuth, productController.searchProducts);
router.get("/:sellerId/:shopName/get-all-products-for-customer", productController.getAllProductsForCustomer);          //using
router.get("/:sellerId/:shopName/get-all-categories-of-seller", userAuth, productController.getAllCategoriesOfSeller);

router.get("/:sellerId/:shopName/get-user-cart", userAuth, cartController.getUserCart);
router.post("/:sellerId/:shopName/add-cart-item", userAuth, cartController.addCartItem);
router.delete("/:sellerId/:shopName/delete-cart-item/:cartItemId", userAuth, cartController.deleteCartItem);
router.put("/:sellerId/:shopName/update-cart-item-quantity/:cartItemId/:action", userAuth, cartController.updateCartItemQuantity);

router.post("/:sellerId/:shopName/create-order", userAuth, orderController.createOrder);
router.get("/:sellerId/:shopName/get-order-by-id/:orderId", userAuth, orderController.getOrderById);
router.get("/:sellerId/:shopName/all-orders-of-user", userAuth, orderController.allOrdersOfUser);
router.put("/:sellerId/:shopName/cancel-order/:orderId", userAuth, orderController.cancelOrder);
router.get("/:sellerId/:shopName/get-order-item-by-id/:orderId/:itemId", userAuth, orderController.getOderItemById);

router.get("/:sellerId/:shopName/get-payment-link/:paymentLinkId", userAuth, paymentController.paymentHandler);

module.exports = router;