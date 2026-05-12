const express = require("express");
const router = express.Router();
const userAuth = require("../Middlewares/userAuthMiddlewares")
const userController = require("../Controller/userController");
const productController = require("../Controller/productController");
const cartController = require("../Controller/cartController");
const orderController = require("../Controller/orderController");
const paymentController = require("../Controller/paymentController");

router.post("/:sellerId/:shopName/google-auth", userController.googleAuthController);                                          //using
router.post("/:sellerId/:shopName/start-user-signup", userController.userSignup);                                          //using
router.post("/:sellerId/:shopName/verify-user-signup-otp", userController.verifyUserSignupOtp);                                 //using
router.post("/:sellerId/:shopName/user-login", userController.userLogin);                                          //using

router.post("/:sellerId/:shopName/user-forget-password-otp-send", userController.userForgetPasswordOtpSend);                       //using
router.post("/:sellerId/:shopName/user-forget-password-otp-verify", userController.userForgetPasswordOtpVerify);                     //using
router.post("/:sellerId/:shopName/user-reset-password", userController.userResetPassword);                                          //using

router.get("/:sellerId/:shopName/get-user-profile", userAuth, userController.getUserProfile);
router.put("/:sellerId/:shopName/update-user", userAuth, userController.updateUser);
router.post("/:sellerId/:shopName/add-address", userAuth, userController.addAddress);
router.put("/:sellerId/:shopName/update-address/:id", userAuth, userController.updateAddress);
router.delete("/:sellerId/:shopName/delete-address/:id", userAuth, userController.deleteAddress);

router.get("/:sellerId/:shopName/search-products/:search", userAuth, productController.searchProducts);
router.get("/:sellerId/:shopName/get-all-products-for-customer", productController.getAllProductsForCustomer);          //using
router.get("/get-products-in-category/:categoryId", productController.getProductsInCategory);     //using                        //using
router.get("/:sellerId/get-all-categories-of-seller", productController.getAllCategoriesOfSellerForUser);                //using
router.get("/get-product-by-id/:productId", productController.getProductByIdForUser);                                          //using
router.post("/add-rating", userAuth, productController.addRating);                                                  //using
router.get("/get-reviews/:productId", productController.getReviews);                                                  //using

router.get("/get-user-cart", userAuth, cartController.getUserCart);                                                  //using
router.post("/add-cart-item", userAuth, cartController.addCartItem);                                                  //using
router.delete("/delete-cart-item/:cartItemId", userAuth, cartController.deleteCartItem);                              //using
router.put("/update-cart-item-quantity/:cartItemId/:action", userAuth, cartController.updateCartItemQuantity);             //using

router.post("/:sellerId/:shopName/create-order", userAuth, orderController.createOrder);
router.get("/:sellerId/:shopName/get-order-by-id/:orderId", userAuth, orderController.getOrderById);
router.get("/:sellerId/:shopName/all-orders-of-user", userAuth, orderController.allOrdersOfUser);
router.put("/:sellerId/:shopName/cancel-order/:orderId", userAuth, orderController.cancelOrder);
router.get("/:sellerId/:shopName/get-order-item-by-id/:orderId/:itemId", userAuth, orderController.getOderItemById);

router.get("/:sellerId/:shopName/get-payment-link/:paymentLinkId", userAuth, paymentController.paymentHandler);

module.exports = router;