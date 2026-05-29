const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
// const adminController = require("../Controller/adminController");
// const userController = require("../Controller/userController");
// const productController = require("../Controller/productController");

router.post("/admin-login", adminController.login);
router.get("/get-admin-profiles/:email", adminController.getSellers);
router.put("/update-amount/:email/:sellerId", adminController.updateAmount);
// router.get("/get-all-sellers", sellerController.getAllSellers);
// router.get("/get-seller-profile-id/:id", sellerController.getSellerProfileById);
// router.patch("/update-seller-status/:id/:status", sellerController.updateSellerStatus);
// // router.delete("/delete-seller/:id", sellerController.deleteSeller);

// router.get("/get-all-users-of-a-seller", userController.getAllUsers);
// router.get("/get-user-profile-id/:id", userController.getUserProfileById);
// router.patch("/update-user-status/:id/:status", userController.updateUserStatus);

// router.get("/get-all-products", sellerAuth, productController.getAllProducts);
// router.get("/get-product-by-seller-id/:sellerId", sellerAuth, productController.getProductBySellerId);
// router.put("/add-rating", userAuth, productController.addRating);



module.exports = router;