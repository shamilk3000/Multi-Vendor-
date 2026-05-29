const orderService = require("../Service/orderService");
const Order = require("../Models/orderModel");
const Seller = require("../Models/sellerModel");
const Cart = require("../Models/cartModel");
const CartItem = require("../Models/cartItemModel");
const { stripe } = require("../Utils/stripe");
require("dotenv").config();

const paymentHandler = async (req, res) => {
  try {
    const user = req.user;
    const seller = await Seller.findById(user.sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    // const sellerStripeAccountId = seller.bankingDetails.stripeAccountId;

    const { orderId } = req.body;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const amount = Math.round(order.totalSellingPrice * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      metadata: {
        type: "ORDER_PAYMENT",
        orderId: order._id.toString(),
        userId: user._id.toString(),
        userEmail: user.email,
        sellerId: seller._id.toString(),
        sellerEmail: seller.email,
      },
      // AUTOMATIC PAYMENT METHODS
      automatic_tax: {
        enabled: false,
      },

      billing_address_collection: "auto",

      // payment_method_collection: "always",
      customer_email: seller.email,
      line_items: [
        {
          price_data: {
            currency: "aed",

            product_data: {
              name: `Order #${order._id}`,
            },

            unit_amount: amount,
          },

          quantity: 1,
        },
      ],

      payment_intent_data: {
        // transfer_data: {
        //   destination: sellerStripeAccountId,
        // },

        metadata: {
          type: "ORDER_PAYMENT",
          orderId: order._id.toString(),
          userId: user._id.toString(),
          userEmail: user.email,
          sellerId: seller._id.toString(),
          sellerEmail: seller.email,
        },
      },

      success_url: `${process.env.ORDER_SUCCESS_URL}/${seller._id}/${seller.businessDetails.bussinessName}/payment-success?orderId=${order._id}&products=${order.totalItems}`,

      cancel_url: `${process.env.ORDER_CANCEL_URL}/${seller._id}/${seller.businessDetails.bussinessName}/payment-fail?orderId=${order._id}`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error(`Error processing payment order`, error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  paymentHandler,
};
