const express = require("express");
const router = express.Router();
const { stripe } = require("../Utils/stripe");
const Seller = require("../Models/sellerModel");
const Cart = require("../Models/cartModel");
const CartItem = require("../Models/cartItemModel");
const OrderItem = require("../Models/orderItemModel");
const Order = require("../Models/orderModel");
const Payment = require("../Models/paymentModel");
const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("✅ Webhook called");
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log("❌ Webhook error:", err.message);
      return res.sendStatus(400);
    }

    // ✅ 1. FIRST PAYMENT (Checkout)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      switch (session.metadata.type) {
        case "ORDER_PAYMENT":
          // order logic
          const orderId = session.metadata.orderId;

          // 🔥 get real order details

          const order = await Order.findById(orderId)
            .populate("userId")
            .populate("sellerId")
            .populate({
              path: "orderItems",
              populate: {
                path: "product",
                populate: [{ path: "category" }, { path: "subCategory" }],
              },
            });
          order.paymentStatus = "success";
          order.orderStatus = "Placed";

          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent,
          );

          const payment = new Payment({
            userId: order.userId._id,
            sellerId: order.sellerId._id,
            orderId: order._id,
            amount: order.totalSellingPrice,
            paymentStatus: "success",
            paymentMethod: paymentIntent.payment_method_types[0],
            paymentIntentId: session.payment_intent,
          });
          await payment.save();
          order.paymentId = payment._id;

          if (order.cartDeleteItemIds.length !== 0) {
            for (const item of order.cartDeleteItemIds) {
              await CartItem.findByIdAndDelete(item);
            }
            const cart = await Cart.findOne({ userId: order.userId._id });
            cart.items = cart.items.filter(
              (item) => !order.cartDeleteItemIds.includes(item._id.toString()),
            );
            await cart.save();
          }
          await order.save();

          for (const item of order.orderItems) {
            const category = await Category.findById(item.product.category);
            const subCategory = await Category.findById(
              item.product.subCategory,
            );
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            product.sale += item.quantity;
            await product.save();
            category.sale += item.quantity;
            await category.save();
            subCategory.sale += item.quantity;
            await subCategory.save();
          }
          console.log("✅ New order added");

          break;

        case "SELLER_SUBSCRIPTION":
          // subscription logic
          const sellerId = session.metadata.sellerId;
          const subscriptionId = session.subscription;

          // 🔥 get real subscription details
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId,
            {
              expand: ["items.data.price"],
            },
          );

          const expiryDate = new Date(
            subscription.items.data[0].current_period_end * 1000,
          );

          await Seller.findByIdAndUpdate(sellerId, {
            accountStatus: "ACTIVE",
            subscriptionId: subscriptionId,
            subscriptionExpiry: expiryDate,
          });
          console.log("✅ New subscription added");

          break;
      }
    }

    // ✅ 2. RENEWAL / AUTO-DEBIT (MOST IMPORTANT)
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;

      const subscriptionId = invoice.parent.subscription_details.subscription;

      const periodEnd = invoice.lines.data[0].period.end;

      const expiryDate = new Date(periodEnd * 1000);

      const seller = await Seller.findOne({ subscriptionId });

      if (seller) {
        await Seller.findByIdAndUpdate(seller._id, {
          accountStatus: "ACTIVE",
          subscriptionExpiry: expiryDate,
        });
        console.log("🔁 Subscription renewed");
      }
    }

    // ✅ 3. IF CANCELLED
    if (
      event.type === "customer.subscription.deleted" ||
      (event.type === "customer.subscription.updated" &&
        (event.data.object.status === "canceled" ||
          (event.data.object.cancel_at &&
            // event.data.object.canceled_at === null &&
            event.data.object.status === "active")))
    ) {
      const subscription = event.data.object;

      const seller = await Seller.findOne({
        subscriptionId: subscription.id,
      });

      if (seller) {
        await Seller.findByIdAndUpdate(seller._id, {
          accountStatus: "PENDING_PAYMENT",
        });

        console.log("⚠️ Subscription canceled → payment pending");
      }
    }

    // ✅ 4. RE-ACTIVATE AFTER CANCELLED
    if (
      event.type === "customer.subscription.updated" &&
      event.data.object.status === "active" &&
      !event.data.object.cancel_at &&
      !event.data.object.canceled_at
    ) {
      const subscription = event.data.object;

      const expiryDate = new Date(
        subscription.items.data[0].current_period_end * 1000,
      );

      const seller = await Seller.findOne({
        subscriptionId: subscription.id,
      });

      if (seller) {
        await Seller.findByIdAndUpdate(seller._id, {
          accountStatus: "ACTIVE",
          subscriptionExpiry: expiryDate,
        });

        console.log("🔁 Subscription re-activated after cancellation → ACTIVE");
      }
    }

    // ❌ 5. PAYMENT FAILED
    if (event.type === "invoice.payment_failed") {
      console.log("✅ failed");

      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      const seller = await Seller.findOne({ subscriptionId });

      if (seller) {
        await Seller.findByIdAndUpdate(seller._id, {
          accountStatus: "PENDING_PAYMENT",
        });

        console.log("⚠️ Payment failed");
      }
    }

    res.sendStatus(200);
  },
);

module.exports = router;
