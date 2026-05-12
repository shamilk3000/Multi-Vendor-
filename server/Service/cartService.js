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
    let cart = await Cart.findOne({ userId: user._id }).populate({
      path: "items",
      populate: {
        path: "product",
      },
    });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Update quantities based on stock
    for (const item of cart.items) {
      if (!item.product) continue;

      if (item.quantity > item.product.stock) {
        await CartItem.findByIdAndUpdate(item._id, {
          quantity: item.product.stock,
        });
      }
    }

    cart = await Cart.findOne({ userId: user._id }).populate({
      path: "items",
      populate: {
        path: "product",
      },
    });

    // Convert mongoose document to plain object
    cart = cart.toObject();

    cart.items = cart.items.filter(
      (item) =>
        item.product && item.product.isActive !== false && item.quantity > 0,
    );

    let totalMrp = 0;
    let totalSellingPrice = 0;
    let totalDiscount = 0;
    let totalQuantity = 0;

    for (const item of cart.items) {
      totalMrp += item.product.mrpPrice * item.quantity;

      totalSellingPrice += item.product.sellingPrice * item.quantity;

      totalDiscount +=
        (item.product.mrpPrice - item.product.sellingPrice) * item.quantity;

      totalQuantity += item.quantity;
    }

    const totalItems = cart.items.length;

    let discountPercentage = 0;

    if (totalMrp > 0) {
      discountPercentage = productService.calculateDiscountPercentage(
        totalMrp,
        totalSellingPrice,
      );
    }

    // Attach calculated fields
    cart.totalMrp = totalMrp;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalDiscount = totalDiscount;
    cart.totalQuantity = totalQuantity;
    cart.totalItems = totalItems;
    cart.discountPercentage = discountPercentage;

    return cart;
  } catch (error) {
    console.error("Error getting user cart:", error);

    throw new Error(`Unable to get user cart: ${error.message}`);
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

      await isItemFound.save();
      cartItem = isItemFound;
    } else {
      const newCartItem = new CartItem({
        cart: cart._id,
        product: product._id,
        quantity: quantity,
      });
      await newCartItem.save();
      cart.items.push(newCartItem._id);

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

    await cart.save();
    await CartItem.findByIdAndDelete(cartItemId);
    return { message: "Cart item deleted successfully" };
  } catch (error) {
    console.error(`Error delete cart item`, error);
    throw new Error(` ${error.message}`);
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
      if (cartItem.quantity >= product.stock) {
        throw new Error("You’ve reached the maximum available stock");
      }
      cartItem.quantity += 1;
    } else if (action === "dec") {
      if (cartItem.quantity <= 1) {
        throw new Error("You must order at least 1 item");
      }
      cartItem.quantity -= 1;
    } else {
      throw new Error("Invalid action");
    }

    await cartItem.save();

    return cartItem;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error(`${error.message}`);
  }
};

module.exports = {
  getUserCart,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};
