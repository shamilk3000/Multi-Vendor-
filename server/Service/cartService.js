const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const Seller = require("../Models/sellerModel");
const mongoose = require("mongoose");
const Cart = require("../Models/cartModel");
const productService = require("./productService");
const CartItem = require("../Models/cartItemModel");

const getUserCart = async (user) => {
  try {
    let cart = await Cart.findOne({ userId: user._id })
      .populate({
        path: "items",
        populate: {
          path: "product",
        },
      })
      .populate({
        path: "attachmentItem",
        populate: {
          path: "product",
        },
      });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    let totalMrp = 0;
    let totalSellingPrice = 0;
    let totalDiscount = 0;
    let totalQuantity = 0;
    let totalItems = cart.items.length;

    cart.items.forEach((item) => {
      totalMrp += item.totalMrp;
      totalSellingPrice += item.totalSellingPrice;
      totalDiscount += item.totalDiscount;
      totalQuantity += item.quantity;
    });

    cart.totalMrp = totalMrp;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalDiscount = totalDiscount;
    cart.totalQuantity = totalQuantity;
    cart.totalItems = totalItems;
    cart.discountPercentage = productService.calculateDiscountPercentage(
      totalMrp,
      totalSellingPrice
    );

    return cart;
  } catch (error) {
    console.error(`Error get user cart`, error);
    throw new Error(`Unable to get user cart : ${error.message}`);
  }
};

const addCartItem = async (user, product, quantity) => {
  try {
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }
    // Logic to add item to cart and update totals
    let isItemFound = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
    }).populate("product");
    let cartItem;
    if (isItemFound) {
      isItemFound.quantity += quantity;
      isItemFound.totalMrp += product.mrpPrice * quantity;
      isItemFound.totalSellingPrice += product.sellingPrice * quantity;
      isItemFound.totalDiscount =
        isItemFound.totalMrp - isItemFound.totalSellingPrice;
      await isItemFound.save();
      cartItem = isItemFound;
    } else {
      const newCartItem = new CartItem({
        cart: cart._id,
        product: product._id,
        quantity: quantity,
        totalMrp: product.mrpPrice * quantity,
        totalSellingPrice: product.sellingPrice * quantity,
        totalDiscount: (product.mrpPrice - product.sellingPrice) * quantity,
        needAttachment: product.needAttachment,
      });
      await newCartItem.save();
      cart.items.push(newCartItem._id);
      if (product.needAttachment) {
        cart.attachmentItem.push(newCartItem._id);
        cart.needAttachment = true;
      }
      cartItem = newCartItem;
    }
    await cart.save();
    return cartItem;
  } catch (error) {
    console.error(`Error add cart item`, error);
    throw new Error(`Unable to add cart item : ${error.message}`);
  }
};

const deleteCartItem = async (user, cartItemId) => {
  try {
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      throw new Error("Cart not found for the user");
    }
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    cart.items.pull(cartItemId);
    if (cartItem.needAttachment) {
      cart.attachmentItem.pull(cartItemId);
      if (cart.attachmentItem.length === 0) {
        cart.needAttachment = false;
      }
    }
    await cart.save();
    await CartItem.findByIdAndDelete(cartItemId);
    return { message: "Cart item deleted successfully" };
  } catch (error) {
    console.error(`Error delete cart item`, error);
    throw new Error(`Unable to delete cart item : ${error.message}`);
  }
};

const updateCartItemQuantity = async (cartItemId, action) => {
  try {
    // Find the cart item with product populated
    let cartItem = await CartItem.findById(cartItemId).populate("product");

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const product = cartItem.product;

    if (action === "inc") {
      cartItem.quantity += 1;
    } else if (action === "dec") {
      if (cartItem.quantity <= 1) {
        throw new Error("Minimum quantity is 1");
      }
      cartItem.quantity -= 1;
    } else {
      throw new Error("Invalid action");
    }

    // Update totals
    cartItem.totalMrp = product.mrpPrice * cartItem.quantity;
    cartItem.totalSellingPrice = product.sellingPrice * cartItem.quantity;
    cartItem.totalDiscount = cartItem.totalMrp - cartItem.totalSellingPrice;

    await cartItem.save();

    return cartItem;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error(`Unable to update cart item quantity: ${error.message}`);
  }
};

module.exports = {
  getUserCart,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};
