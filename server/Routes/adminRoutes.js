const express = require("express");
const router = express.Router();
const sellerController = require("../Controller/sellerController");
const adminController = require("../Controller/adminController");
const userController = require("../Controller/userController");
const productController = require("../Controller/productController");

// router.get("/get-all-sellers", sellerController.getAllSellers);
// router.get("/get-seller-profile-id/:id", sellerController.getSellerProfileById);
// router.patch("/update-seller-status/:id/:status", sellerController.updateSellerStatus);
// // router.delete("/delete-seller/:id", sellerController.deleteSeller);

// router.get("/get-all-users-of-a-seller", userController.getAllUsers);
// router.get("/get-user-profile-id/:id", userController.getUserProfileById);
// router.patch("/update-user-status/:id/:status", userController.updateUserStatus);

// router.get("/get-all-products", sellerAuth, productController.getAllProducts);
// router.get("/get-product-by-seller-id/:sellerId", sellerAuth, productController.getProductBySellerId);
// router.get("/search-products/:sellerId/:search", sellerAuth, productController.searchProducts);
// router.put("/add-rating", userAuth, productController.addRating);



module.exports = router;