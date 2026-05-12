const productService = require("../Service/productService");
const cartService = require("../Service/cartService");

const getUserCart = async (req, res) => {
  try {
    const user = req.user;
    const cart = await cartService.getUserCart(user);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("getUserCart Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const addCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { productId, quantity } = req.body;
    const product = await productService.getProductById(productId);
    const cartItem = await cartService.addCartItem(user, product, quantity);
    return res.status(200).json(cartItem);
  } catch (error) {
    console.error("addCartItem Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { cartItemId } = req.params;
    console.log(cartItemId);
    const result = await cartService.deleteCartItem(user, cartItemId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("deleteCartItem Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;
    const action = req.params.action;
    const updatedCartItem = await cartService.updateCartItemQuantity(
      cartItemId,
      action,
    );
    return res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("updateCartItemQuantity Controller Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserCart,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};
