const express = require("express");
const router = express.Router();
const {sellerAuth , coockieTest} = require("../Middlewares/sellerAuthMiddlewares")
const sellerController = require("../Controller/sellerController");
const productController = require("../Controller/productController");
const orderController = require("../Controller/orderController");
const paymentController = require("../Controller/paymentController");
const sellerReportController = require("../Controller/sellerReportController");
const transactionController = require("../Controller/transactionController");


router.post("/google-auth", sellerController.googleAuthController);                                                 //using
router.post("/start-seller-signup", sellerController.startSellerSignup);                                           //using
router.post("/verify-seller-signup-otp", sellerController.verifySellerSignupOtp);                                   //using
router.post("/create-seller-details", sellerController.createSellerDetails);                                       //using
router.post("/stripe-check", sellerController.checkStripeSellerStatus );                                       //using
router.post("/stripe-retry-onboarding", sellerController.retryStripeOnboarding);                                       //using
router.post("/seller-login", sellerController.sellerLogin);                                                         //using
router.post("/logout", sellerAuth, sellerController.logout);                                                        //using

router.post("/seller-forget-password-otp-send", sellerController.sellerForgetPasswordOtpSend);                       //using
router.post("/seller-forget-password-otp-verify", sellerController.sellerForgetPasswordOtpVerify);                  //using
router.post("/seller-reset-password", sellerController.sellerResetPassword);                                         //using
router.post("/seller-reset-password-dashboard", sellerAuth, sellerController.sellerResetPasswordDashboard);           //using

router.get("/get-seller-profile", sellerAuth, sellerController.getSellerProfile);                                //using
router.get("/get-seller-dashboard", sellerAuth, sellerController.getSellerDashboard);                                //using
router.put("/update-seller-profile", sellerAuth, sellerController.updateSeller);                                   //using
router.post("/subscribe-session", sellerController.sellerSubscription);                                            //using
router.get("/coockie-test", coockieTest, (req, res) => {
  res.json({ success: true, message: "Seller authentication successful", seller: req.seller });
});                                                                                                                    //using


// router.post("/verify-sub-session",sellerController.verifySubSession);
// router.delete("/delete-seller/:id", sellerController.deleteSeller);

router.post("/create-product", sellerAuth, productController.createProduct);                                             //using
router.put("/update-product", sellerAuth, productController.updateProduct);                                             //using
router.get("/get-product/:productId", sellerAuth, productController.getProductById);                                       //using
router.put("/delete-product/:productId", sellerAuth, productController.deleteProduct);                                     //using
router.put("/restore-product/:productId", sellerAuth, productController.restoreProduct);                                     //using
router.get("/get-product-for-seller", sellerAuth, productController.getProductForSeller);                                 //using
router.get("/search-products/:sellerId/:search", sellerAuth, productController.searchProducts);
router.post("/create-category", sellerAuth, productController.createCategory);                                             //using
router.put("/update-category/:categoryId", sellerAuth, productController.updateCategory);                                  //using
// router.get("/get-all-parent-category", sellerAuth, productController.getAllParentCategories);         
router.get("/get-category-by-id/:categoryId", sellerAuth, productController.getCategoryById);          
router.get("/get-all-categories-of-seller", sellerAuth, productController.getAllCategoriesOfSeller);                        //using
router.put("/delete-category/:categoryId", sellerAuth, productController.deleteCategory);                                   //using
router.put("/restore-category/:categoryId", sellerAuth, productController.restoreCategory);                                 //using
router.get("/get-product-by-id/:productId",sellerAuth, productController.getProductByIdForUser);                           //using
router.get("/get-reviews/:productId",sellerAuth, productController.getReviews);                                             //using

router.get("/all-orders-of-seller", sellerAuth, orderController.allOrdersOfSeller);                                          //using
router.get("/get-order-by-id/:orderId", sellerAuth, orderController.getOrderByIdForSeller);                                  //using
router.put("/update-order-status/:orderId/:status", sellerAuth, orderController.updateOrderStatus);                          //using

router.get("/get-transaction-by-seller", sellerAuth, transactionController.getTransactionsBySellerId);

router.get("/get-seller-report", sellerAuth, sellerReportController.getSellerReport);

module.exports = router; 