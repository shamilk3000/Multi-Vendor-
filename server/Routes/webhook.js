const express = require("express");
const router = express.Router();
const { stripe } = require("../Utils/stripe");
const Seller = require("../Models/sellerModel");

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
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
    } catch (err) {
      console.log("❌ Webhook error:", err.message);
      return res.sendStatus(400);
    }




    // ✅ 1. FIRST PAYMENT (Checkout)
    if (event.type === "checkout.session.completed") {

  const session = event.data.object;

  const sellerId = session.metadata.sellerId;
  const subscriptionId = session.subscription;

  

  // 🔥 get real subscription details
const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
  expand: ["items.data.price"],
});

  const expiryDate = new Date(
    subscription.items.data[0].current_period_end * 1000
  );

  await Seller.findByIdAndUpdate(sellerId, {
    accountStatus: "ACTIVE",
    subscriptionId: subscriptionId,
    subscriptionExpiry: expiryDate,
  });
        console.log("✅ New subscription added");

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
  (
    event.type === "customer.subscription.updated" &&
    (
      event.data.object.status === "canceled" ||
      (
        event.data.object.cancel_at &&
        // event.data.object.canceled_at === null &&
        event.data.object.status === "active"
      )
    )
  )
){const subscription = event.data.object;

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

  const expiryDate = new Date(subscription.items.data[0].current_period_end * 1000);

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
  }
);

module.exports = router;
